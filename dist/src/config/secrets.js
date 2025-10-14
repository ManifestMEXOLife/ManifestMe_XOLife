"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = getSecret;
exports.loadSecretToEnv = loadSecretToEnv;
async function getSecret(secretName) {
    // Mock implementation - replace with actual AWS Secrets Manager integration
    return `mock-secret-for-${secretName}`;
}
async function loadSecretToEnv(secretId, prefix) {
    // Mock implementation - replace with actual secret loading
    const mockSecret = {
        DB_HOST: "localhost",
        DB_PORT: "5432",
        DB_NAME: "manifestme",
        DB_USER: "user",
        DB_PASSWORD: "password"
    };
    Object.entries(mockSecret).forEach(([key, value]) => {
        const envKey = prefix ? `${prefix}_${key}` : key;
        process.env[envKey] = value;
    });
}
//# sourceMappingURL=secrets.js.map