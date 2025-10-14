// Clean secret loader for ManifestMe backend
// Safely fetches a JSON secret from AWS Secrets Manager when AWS credentials
// are present. If run locally without credentials, it skips fetching so
// development isn't blocked.
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const HAS_AWS_CREDENTIALS = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
if (!HAS_AWS_CREDENTIALS) console.warn("⚠️ AWS credentials not found — skipping secret fetch in local/dev");

const client = HAS_AWS_CREDENTIALS
  ? new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1", credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } })
  : new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });

async function getSecret(secretId: string): Promise<Record<string, any>> {
  const cmd = new GetSecretValueCommand({ SecretId: secretId });
  const res = await client.send(cmd);
  if (!res.SecretString) throw new Error(`Secret "${secretId}" empty`);
  try { return JSON.parse(res.SecretString); } catch { return { value: res.SecretString }; }
}

async function loadSecretToEnv(secretId: string, prefix?: string) {
  const secret = await getSecret(secretId);
  Object.entries(secret).forEach(([k, v]) => { process.env[prefix ? `${prefix}_${k}`.toUpperCase() : k.toUpperCase()] = v as string; });
}

export async function fetchAndLoadSecretIfNeeded() {
  if (!HAS_AWS_CREDENTIALS) { console.log('Skipping secret fetch — no creds'); return; }
  const secretArn = process.env.SECRET_ARN || "arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-AIDATJUFRQCRNTHN3UFB2";
  try {
    const s = await getSecret(secretArn);
    console.log('Secret fetched');
    await loadSecretToEnv(secretArn, 'DB');
  } catch (e) {
    console.error('Failed to fetch secret:', e);
    throw e;
  }
}

// Run when executed directly
if (require.main === module) {
  fetchAndLoadSecretIfNeeded().catch(() => process.exit(1));
}
