// Safe wrapper for secret fetching. This file intentionally keeps import-time
// behavior minimal (no throws) so tsc and workflows won't fail if AWS creds
// are missing or another secrets helper is temporarily corrupted.

import { getSecret, loadSecretToEnv } from './src/config/secrets';

export async function fetchAndLoadSecretIfNeeded(): Promise<void> {
  const hasCreds = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  if (!hasCreds) {
    console.log('Skipping secret fetch — AWS credentials not found');
    return;
  }

  const secretArn =
    process.env.SECRET_ARN || 'arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-AIDATJUFRQCRNTHN3UFB2';

  try {
    // Use the shared helpers from src/config/secrets which are mocked for local dev
    const secret = await getSecret(secretArn);
    await loadSecretToEnv(secretArn, 'DB');
    console.log('Secret fetched and loaded to env');
  } catch (err) {
    console.error('Failed to fetch or load secret:', err);
    throw err;
  }
}

// If run directly, execute and surface failure via non-zero exit code
if (require.main === module) {
  fetchAndLoadSecretIfNeeded().catch(() => process.exit(1));
}
