"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// testSecret.ts (fixed)
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
// Ensure AWS credentials are set in env
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment.");
}
const client = new client_secrets_manager_1.SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
/**
 * Fetch a secret from AWS Secrets Manager
 */
async function getSecret(secretId) {
    try {
        const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretId });
        const response = await client.send(command);
        if (!response.SecretString) {
            throw new Error(`Secret "${secretId}" is empty`);
        }
        // Try to parse JSON, fallback to raw string
        try {
            return JSON.parse(response.SecretString);
        }
        catch {
            return { value: response.SecretString };
        }
    }
    catch (err) {
        console.error("❌ Error fetching secret:", err);
        throw err;
    }
}
/**
 * Load secret into process.env
 */
async function loadSecretToEnv(secretId, prefix) {
    const secret = await getSecret(secretId);
    Object.entries(secret).forEach(([key, value]) => {
        const envKey = prefix ? `${prefix}_${key}`.toUpperCase() : key.toUpperCase();
        process.env[envKey] = value;
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
        // Print any DB-prefixed env variables that were loaded
        console.log("\n--- ENV VARIABLES ---\n");
        Object.keys(process.env)
            .filter((k) => k.startsWith("DB"))
            .forEach((k) => console.log(`${k}=${process.env[k]}`));
    }
    catch (err) {
        console.error("❌ Error in main:", err);
        process.exit(1);
    }
}
// Run main when executed
main();
//# sourceMappingURL=secrets.fixed.js.map