# Deployment and production workflow setup

This repository includes a dedicated production deploy workflow at
`.github/workflows/deploy-production.yml` that performs a deploy to Elastic
Beanstalk and is wired to a GitHub Environment called `production` so you can
require manual approvals and reviewer checks before any deploy runs.

Follow these steps to restore automated deploys safely.

1. Add required repository secrets

In the repository Settings -> Secrets -> Actions, add the following secrets:

1. `AWS_ACCESS_KEY_ID` — IAM access key id with permissions to deploy to EB and
   to read required secrets if you use Secrets Manager in CI.
1. `AWS_SECRET_ACCESS_KEY` — the secret key for the above access key.
1. `AWS_REGION` — e.g. `us-east-1` (optional; defaults to `us-east-1` in the
   workflow).
1. `EB_APP_NAME` — the Elastic Beanstalk application name (optional default
   `manifestme-api`).
1. `EB_ENV_NAME` — the Elastic Beanstalk environment name (optional default
   `manifestme-env`).

Note: store credentials for a least-privilege IAM user, or better use OpenID
Connect (OIDC) with short-lived credentials if you prefer not to store long-
term keys in GitHub. The workflows currently use basic AWS keys configured via
`aws-actions/configure-aws-credentials`.

1. Configure the `production` environment protection (required for approvals)

Go to Settings -> Environments -> New environment and create `production`.
Then configure protection rules you need, for example:

1. Require manual approval by at least one reviewer.
1. Restrict which branches or GitHub teams/users can deploy.

This makes any job that targets `environment: production` pause and await the
configured approvers before continuing. The deploy workflow uses this feature
so you can safely allow pushes to `main` while preventing automatic deploys
without approval.

1. How the workflows are organized

1. `.github/workflows/deploy-backend.yml` — continuous build & optional manual
   deploy job. It runs build steps on push and PR. The deploy job in that file
   is configured to only run when manually triggered (workflow_dispatch), so it
   won't auto-deploy on push.
1. `.github/workflows/deploy-production.yml` — dedicated production deploy that
   runs on pushes to `main` and via manual dispatch, but targets the
   `production` environment which enforces approvals.

1. Testing the deploy flow

1. Add the repository secrets listed above.
1. Create the `production` environment and configure at least one required
   approver.
1. Push a trivial change to `main` (or open a PR and merge) to trigger the
   `deploy-production` workflow. The workflow will start, reach the environment
   protection step, and pause for approval.
1. Approve the deployment in the GitHub UI (the approvals UI is shown on the
   workflow run). After approval the workflow will continue and run the
   EB deploy steps.

1. If you want staged/preview deployments

Consider creating additional environments like `staging` or `qa` with their
own secrets and looser protection. A `deploy-staging.yml` can run on PR
merges/main and either be automatic or require a lighter approval rule.

1. Troubleshooting

1. If the workflow fails because of missing secrets, ensure the secrets are set
   in repository Settings -> Secrets -> Actions and not only in your local
   environment.
1. If the workflow errors with "Unrecognized named-value: 'secrets'" make sure
   any `if:` expressions that reference secrets are used at the step level, not
   at the job level — the existing workflows already follow that guideline.

1. Security notes

1. Prefer OIDC where possible to avoid long-lived keys. If using access keys,
   scope the IAM policy to the minimum required (EB, S3 if used for artifacts,
   and Secrets Manager read if needed). Rotate keys periodically.

If you'd like, I can also:

1. Add a `deploy-staging.yml` for automated staging deploys.
1. Convert the EB deployment steps to use OIDC and short-lived credentials.
1. Add a tiny GitHub Actions status-check that blocks merging until a build
   passes for `main`.
