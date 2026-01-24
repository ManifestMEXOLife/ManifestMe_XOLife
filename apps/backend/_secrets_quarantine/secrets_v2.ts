// testSecret.ts (fixed)
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Detect whether AWS credentials are available. Do NOT throw at import time
// so this file can be executed locally without credentials for development.
const HAS_AWS_CREDENTIALS = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

if (!HAS_AWS_CREDENTIALS) {
    console.warn("⚠️  AWS credentials not found in environment. Secret fetches will be skipped unless credentials are provided.");
}

// Create an AWS Secrets Manager client. If credentials are not present, create
// the client without explicit credentials — main() will skip fetch in that case.
const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    ...(HAS_AWS_CREDENTIALS
        ? {
              credentials: {
                  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
              },
          }
        : {}),
});

/**
 * Fetch a secret from AWS Secrets Manager
 */
async function getSecret(secretId: string): Promise<Record<string, any>> {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretId });
        const response = await client.send(command);

        if (!response.SecretString) {
            throw new Error(`Secret "${secretId}" is empty`);
        }

        // Try to parse JSON, fallback to raw string
        try {
            return JSON.parse(response.SecretString);
        } catch {
            return { value: response.SecretString };
        }
    } catch (err) {
        console.error("❌ Error fetching secret:", err);
        throw err;
    }
}

/**
 * Load secret into process.env
 */
async function loadSecretToEnv(secretId: string, prefix?: string) {
    const secret = await getSecret(secretId);

    Object.entries(secret).forEach(([key, value]) => {
        const envKey = prefix ? `${prefix}_${key}`.toUpperCase() : key.toUpperCase();
        process.env[envKey] = value as string;
    });
}

// --- MAIN EXECUTION ---
async function main() {
    console.log("Starting secret fetch test...");

    const secretArn = "arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-AIDATJUFRQCRNTHN3UFB2";

    try {
        if (!HAS_AWS_CREDENTIALS) {
            console.log("Skipping secret fetch because AWS credentials are not set.");
            return;
        }

        // Fetch secret
        const secret = await getSecret(secretArn);
        console.log("✅ Secret fetched successfully:", secret);

        // Optionally load to process.env
        await loadSecretToEnv(secretArn, "DB");

        // Print any DB-prefixed env variables that were loaded
        console.log("\n--- ENV VARIABLES ---\n");
        Object.keys(process.env)
            .filter((k) => k.startsWith("DB"))
            .forEach((k) => console.log(`${k}=${process.env[k]}`));
    } catch (err) {
        console.error("❌ Error in main:", err);
        process.exit(1);
    }
}

// Run main when executed
main();
