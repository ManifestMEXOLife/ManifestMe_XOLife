## Repository: ManifestMe_XOLife — Copilot / AI agent instructions

These notes give AI coding agents exactly the repository-specific context and patterns needed to be productive quickly. Keep suggestions scoped to code discoverable in this repo.

High-level architecture (quick):
- Backend: TypeScript + Node.js (Express) API that lives under `manifestme-backend/` (see `ProjectStructure`). Key app entry points: `src/app.ts`, `src/server.ts`.
- Persistence: Prisma + PostgreSQL schema located at `prisma/schema.prisma`. Prisma client appears under `src/prisma/client.ts`.
- Frontend & mobile: described in `README.md` (React / React Native, Tailwind); frontend code is not present in this repository snapshot — focus work on the backend here unless new frontend dirs are added.

What to look for first (fast path):
1. `README.md` — high-level intent, integrations (AWS, S3, Redis, FCM, SendGrid), and CI/CD via GitHub Actions.
2. `ProjectStructure` — a concrete backend layout; use it to find controllers (`src/controllers`), routes (`src/routes`), services (`src/services`), middlewares (`src/middlewares`), and Prisma client (`src/prisma/client.ts`).
3. `prisma/schema.prisma` — authoritative data model. Use it to infer DB fields, relations, and validation constraints.

Conventions and patterns (from code layout + README):
- Folder-driven responsibilities: controllers handle HTTP, services hold business logic (e.g., `video.service.ts`), routes wire controllers, middlewares provide auth. When adding features, prefer adding service logic in `src/services` and keep controllers thin.
- Prisma as the single source of truth for DB schema. When changing models, update `prisma/schema.prisma` and run Prisma migrations. Search for `prisma migrate` or `prisma generate` in CI to mirror pipeline steps.
- Auth: JWT-based flows are mentioned; check `src/middlewares/auth.middleware.ts` and `src/controllers/auth.controller.ts` for token structure and refresh token handling before changing auth logic.

Build / run / test notes (discoverable hints):
- The backend uses TypeScript and includes `package.json` according to `ProjectStructure` (not present in current snapshot). Assume common scripts: `npm install`, `npm run build`, `npm run dev`, `npm test`. If you add or modify scripts, update README and CI workflows under `.github/workflows/`.
- Env: Keep secrets out of code. Follow the `.env.example` pattern. When adding new env vars, update `.env.example` and the relevant GitHub Action secrets.

Integration points and external dependencies:
- AWS: S3 for file storage; expect S3 client configuration in services handling uploads (search for `s3`, `S3Client`, or `aws-sdk` when present).
- Notifications: Firebase (FCM) and SendGrid are called out in the README — look for `notifications` or `fcm` keywords in services.
- Analytics & monitoring: Sentry/CloudWatch — when adding instrumentation, follow existing logging patterns and ensure sensitive data is redacted.

Code change guidance (actionable):
- When adding endpoints: add route under `src/routes/*`, implement controller in `src/controllers/*` and business logic in `src/services/*`. Export any DB operations through Prisma client (`src/prisma/client.ts`).
- When modifying the schema: update `prisma/schema.prisma` -> run `prisma migrate dev` locally -> run `prisma generate`. Add a short migration note to the pull request.
- Tests: If adding behavior, add unit tests alongside services and controller tests (project's test framework not present in snapshot; prefer Jest if adding test infra). Document any new test scripts in `package.json`.

Examples from this repo (explicit cues):
- Video features: `src/controllers/video.controller.ts` -> `src/services/video.service.ts` — replicate this controller->service pattern for new domain features.
- Auth flows: `src/routes/auth.routes.ts` -> `src/controllers/auth.controller.ts` -> `src/middlewares/auth.middleware.ts` — inspect these files before changing auth token lifecycles.

Behavioral rules for AI agents (how to propose code):
- Keep changes minimal and focused. Prefer small PRs that touch one feature or migration.
- Preserve existing patterns: thin controllers, service-layer business logic, Prisma client usage.
- Avoid adding external infra changes (new AWS services, new CI providers) without an accompanying migration/ops note in the PR description.

Files/places to reference in PRs:
- `README.md` (high-level architecture), `ProjectStructure` (concrete layout), `prisma/schema.prisma`, `src/prisma/client.ts`, `src/controllers/*`, `src/services/*`, `src/middlewares/*`, `.github/workflows/ci-cd.yml` (CI expectations).

If something is missing or unclear:
- If `package.json`, CI workflows, or frontend directories are missing or outdated, call that out in the PR and propose the minimal change needed (e.g., add `package.json` scripts, or update `.github/workflows` to run `npm ci && npm run build`).
- Ask for credentials/ops guidance before adding or testing cloud integrations (S3, Redis, RDS). Do not hardcode keys.

Quick checklist for PRs generated by an AI agent:
- Does the change follow controller->service->prisma structure?
- Are new env vars documented in `.env.example` and the README?
- Are migrations included if the schema changed?
- Are tests added for new behavior (or a test plan included) and CI updated if necessary?

End of instructions. Ask maintainers for any missing local scripts or if the backend root differs from `manifestme-backend/` in their workspace.
