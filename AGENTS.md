# Repository Guidelines

## Project Structure & Module Organization
App routes live in `src/app`. Shared UI sits in `src/components`, utilities and hooks in `src/lib`, and server code (tRPC, Prisma helpers, mailers) in `src/server`. Middleware and request guards stay in `src/middleware.ts`. Prisma schema and seeds are in `prisma/`. Assets reside in `public/` and `brand-logos/`. Cypress suites live in `cypress/e2e`, and legacy Node smoke tests are kept in `tests/`.

## Build, Test & Development Commands
Use `npm run dev` for the Turbopack dev server. `npm run build` compiles and type-checks, while `npm run start` serves the optimized build. Run `npm run lint` before committing to satisfy the Next + ESLint configuration. Database helpers: `npm run db:generate` refreshes the Prisma client, `npm run db:push` syncs schema changes to your local database, `npm run db:seed` loads baseline data, and `npm run db:reset` rebuilds everything. `npm run db:setup` orchestrates the initialization script when bootstrapping a new environment.

## Coding Style & Naming Conventions
Code is TypeScript-first with React Server/Client Components. Use 2-space indentation, allow ESLint to dictate trailing commas, and prefer `const` for immutable values. Components and hooks follow `PascalCase` and `useCamelCase`; utility modules and files stay `kebab-case`. Keep Tailwind classlists grouped by layout, color, then state to match the current pattern. Run `npm run lint` to auto-fix minor issues and tidy any remaining diffs before opening a PR.

## Testing Guidelines
Cypress drives accessibility and workflow coverage under `cypress/e2e`. Run `npx cypress open` for guided runs or `npx cypress run --e2e` in CI mode. Smoke scripts in `tests/` execute with `node tests/dashboard-test-suite.js` for quick dashboard checks. Seed the database before tests so dashboards render realistic data. Add or update specs alongside features and note changes in the QA checklist.

## Commit & Pull Request Guidelines
Follow Conventional Commit prefixes (`feat`, `fix`, `chore`, etc.) where possible; at minimum, keep subjects imperative and under 72 characters. Every PR should describe the change, reference Jira/GitHub issues, and call out database or config impacts. Attach screenshots or video for UI tweaks and list the commands run (build, lint, tests) in the PR template. Request review from a domain owner and ensure CI passes before merging.

## Environment & Security Notes
Copy `.env.example` into `.env` and keep secrets out of git. Use `docker-compose up` when you need a disposable Postgres instance. Rotate Paystack keys and SMTP credentials in production and avoid logging sensitive customer data.
