"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
async function safeGetSecret(secretArn) {
    // If no AWS creds and no IAM role available, skip fetching and exit success.
    const hasAwsEnv = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) || !!process.env.AWS_ROLE_ARN;
    if (!hasAwsEnv) {
        console.log("⚠️  No AWS credentials found in environment — skipping secret fetch (CI/deploy should provide these)");
        return;
    }
    const client = new client_secrets_manager_1.SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });
    try {
        const cmd = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretArn });
        const resp = await client.send(cmd);
        if (!resp.SecretString) {
            console.log("⚠️  Secret fetched but empty");
            return;
        }
        const secret = JSON.parse(resp.SecretString);
        // Map known values into env for downstream steps
        process.env.DATABASE_URL = secret.DATABASE_URL || process.env.DATABASE_URL;
        console.log("✅ Secret loaded into process.env (DATABASE_URL masked)");
    }
    catch (err) {
        // Log error but do not fail the job — deploy should fail later if creds are incorrect
        console.error("❌ Error fetching secret (continuing):", err && err.message ? err.message : err);
    }
}
// Use the ARN from your workflow env or fallback to the hard-coded ARN.
const secretArn = process.env.SECRET_ARN || "arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-qDpxwd";
safeGetSecret(secretArn).then(() => process.exit(0)).catch(() => process.exit(0));
//# sourceMappingURL=fetchSecret.safe.js.map