import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// This module intentionally keeps runtime behaviour guarded so importing it
// at build/CI time doesn't throw when credentials are not present. Callers
// should use the helper functions at runtime.

const hasAwsCredentials = () => Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

export async function getSecret(secretId: string): Promise<Record<string, any> | null> {
  if (!hasAwsCredentials()) {
    // In local/dev environments we don't require AWS creds. Return null so
    // callers can handle missing secrets or fall back to local config.
    return null;
  }

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const command = new GetSecretValueCommand({ SecretId: secretId });
  const response = await client.send(command);

  if (!response.SecretString) return null;

  try {
    return JSON.parse(response.SecretString);
  } catch {
    return { value: response.SecretString };
  }
}

export async function loadSecretToEnv(secretId: string, prefix = ""): Promise<void> {
  const secret = await getSecret(secretId);
  if (!secret) return;

  // Flatten and load into process.env with optional prefix.
  Object.entries(secret).forEach(([k, v]) => {
    const key = `${prefix}${k}`.toUpperCase();
    process.env[key] = typeof v === 'string' ? v : JSON.stringify(v);
  });
}
