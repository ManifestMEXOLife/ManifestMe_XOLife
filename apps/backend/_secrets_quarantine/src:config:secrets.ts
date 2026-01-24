import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
        "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment."
    );
}

const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function getSecret(secretId: string): Promise<Record<string, any>> {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await client.send(command);

    if (!response.SecretString) {
        throw new Error(`Secret "${secretId}" is empty`);
    }

    try {
        return JSON.parse(response.SecretString);
    } catch {
        return { value: response.SecretString };
    }
}
