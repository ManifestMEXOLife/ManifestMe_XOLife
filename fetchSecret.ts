import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Initialize client with explicit region
const client = new SecretsManagerClient({
    region: "us-east-1", // make sure your secret is in this region
});

async function getSecret(secretIdOrName: string) {
    try {
        // SecretsManager GetSecretValue works with secret name OR ARN
        const command = new GetSecretValueCommand({ SecretId: secretIdOrName });
        const response = await client.send(command);

        if (!response.SecretString) throw new Error("Secret is empty");

        const secret = JSON.parse(response.SecretString);
        console.log("✅ Secret fetched successfully:", secret);
    } catch (err) {
        console.error("❌ Error fetching secret:", err);
    }
}

// Use **secret name** instead of full ARN for simplicity
// Find this in AWS Secrets Manager console
const secretName = "manifestme/prod/database";

getSecret(secretName);
