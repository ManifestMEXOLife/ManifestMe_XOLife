"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// testSecret.ts (clean)
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
// Detect whether AWS credentials are available. Do NOT throw at import time
// so this file can be executed locally without credentials for development.
const HAS_AWS_CREDENTIALS = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
if (!HAS_AWS_CREDENTIALS) {
    console.warn("⚠️  AWS credentials not found in environment. Secret fetches will be skipped unless credentials are provided.");
}
// Build an AWS Secrets Manager client; keep it simple and avoid redeclarations.
const client = HAS_AWS_CREDENTIALS
    ? new client_secrets_manager_1.SecretsManagerClient({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })
    : new client_secrets_manager_1.SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });
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
        if (!HAS_AWS_CREDENTIALS) {
            console.log("Skipping secret fetch because AWS credentials are not set.");
            return;
        }
        const secret = await getSecret(secretArn);
        console.log("✅ Secret fetched successfully:", secret);
        await loadSecretToEnv(secretArn, "DB");
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
void main();
//# sourceMappingURL=secrets_clean.js.map