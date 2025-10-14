import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const creds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
  : undefined;

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: creds,
});

export async function getSecret(secretName: string): Promise<string> {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    return response.SecretString || '';
  } catch (error) {
    console.error(`Failed to fetch secret "${secretName}":`, error);
    throw error;
  }
}

export async function loadSecretToEnv(secretId: string, prefix?: string): Promise<void> {
  try {
    const secretString = await getSecret(secretId);
    const secret = JSON.parse(secretString);

    Object.entries(secret).forEach(([key, value]) => {
      const envKey = prefix ? `${prefix}_${key}` : key;
      process.env[envKey] = value as string;
    });
  } catch (error) {
    console.error(`Failed to load secret to env:`, error);
    throw error;
  }
}

export async function fetchAndLoadSecretIfNeeded(): Promise<void> {
  const hasCreds = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  if (!hasCreds) {
    console.warn('Skipping secret fetch — AWS credentials not found');
    return;
  }

  const secretArn: string =
    process.env.SECRET_ARN ||
    'arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-AIDATJUFRQCRNTHN3UFB2';

  try {
    await loadSecretToEnv(secretArn, 'DB');
    console.log('Secret fetched and loaded to env');
  } catch (err) {
    console.error('Failed to fetch or load secret:', err);
    throw err;
  }
}

// If run directly, execute and surface failure via exit code.
if (require.main === module) {
  fetchAndLoadSecretIfNeeded()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
