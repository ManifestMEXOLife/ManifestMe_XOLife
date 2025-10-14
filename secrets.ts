// testSecret.ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Ensure AWS credentials are set in env
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment.");
}

const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
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
        // Fetch secret
        const secret = await getSecret(secretArn);
        console.log("✅ Secret fetched successfully:", secret);

        // Optionally load to process.env
        await loadSecretToEnv(secretArn, "DB");

        console.log("\n--- ENV VARIABLES
