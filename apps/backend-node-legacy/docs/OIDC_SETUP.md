OIDC-based GitHub Actions -> AWS deploy setup
============================================

This repository supports using GitHub Actions OIDC to assume an AWS IAM role
for deployments instead of long-lived AWS access keys. Using OIDC is more
secure and recommended for production.

High-level steps

1. Create an IAM role in AWS with a trust relationship allowing
   token.actions.githubusercontent.com to assume the role via web identity.
   Use the `aws/oidc-trust-policy.json` from this repo as a template. Replace
   `YOUR_AWS_ACCOUNT_ID` and `YOUR_GITHUB_ORG/YOUR_REPO` appropriately.

2. Attach a minimal policy to the role granting permissions required for EB
   deploys (Elastic Beanstalk, S3 if used for artifacts, and Secrets Manager
   read if you use it). Example actions: `elasticbeanstalk:*`, `s3:*` (narrow
   these in production), `secretsmanager:GetSecretValue`.

3. Note the role's ARN (e.g. `arn:aws:iam::123456789012:role/github-actions-eb-deploy`).

4. In the GitHub repository Settings -> Secrets -> Actions, add a secret:

   - `AWS_OIDC_ROLE_ARN` with the role ARN. (Alternatively, add as an org
     secret if you want to reuse across repos.)

5. The workflows in this repo now prefer `AWS_OIDC_ROLE_ARN` for credential
   configuration. If present, the `aws-actions/configure-aws-credentials@v2`
   action will request an ID token from GitHub and assume the role via STS.


Notes

- Ensure the role's trust policy `Condition` narrows the `sub` claim to your
   repository (or to a specific workflow) to prevent other repos from using the
   role.
- If you prefer to keep using access keys, populate `AWS_ACCESS_KEY_ID` and
   `AWS_SECRET_ACCESS_KEY` in repo secrets; workflows fall back to those keys.
