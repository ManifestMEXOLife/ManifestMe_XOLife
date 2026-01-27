# CI secrets and OIDC guide

This project uses GitHub Actions to run tests, builds and deploys. Some workflows
support OIDC role assumption and/or static AWS credentials. Use the notes below
when configuring repository secrets or enabling OIDC.

Required repository secrets (common)

- AWS_REGION: (optional) region, default us-east-1
- AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY: static AWS keys (fallback only)
- AWS_OIDC_ROLE_ARN: IAM Role ARN that GitHub Actions may assume via OIDC
- AWS_OIDC_ROLE_ARN_STAGING: optional separate role ARN for staging
- EB_APP_NAME, EB_ENV_NAME: Elastic Beanstalk application and environment names
- SMOKE_TEST_EMAIL / SMOKE_TEST_PASSWORD: optional credentials for smoke tests

Recommended setup

1. Prefer OIDC role assumption (more secure): enable GitHub Actions OIDC and
  create an IAM role with a trust policy that allows the repository to assume
  the role. See AWS docs and the repository `docs/OIDC_SETUP.md` for details.

2. If you cannot use OIDC, set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
  in the repository secrets as a fallback.

Why workflows include credential guards

- The workflows now perform a light check to ensure credentials (OIDC role ARN
  or static keys) are present before calling `aws-actions/configure-aws-credentials`.

- This prevents runtime failures when the action is invoked with empty inputs
  (the action errors and fails the job). The guard preserves the ability to run
  non-deploy workflows without credentials configured.

Smoke test / manual deploy notes

- Many deploy workflows are gated to only run when appropriate secrets are
  present. There is a manual `workflow_dispatch` path for production deploys.

- For smoke tests, see `scripts/post_deploy_smoke.js` which accepts TARGET_URL as
  an env var and will optionally perform an auth check when `SMOKE_TEST_EMAIL`
  is set.
