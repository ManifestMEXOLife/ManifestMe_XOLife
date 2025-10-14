"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = getSecret;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
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
async function getSecret(secretId) {
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
//# sourceMappingURL=src:config:secrets.js.map