# Lolas Learning Monorepo

[![CI](https://github.com/orieken/lolas-learning/actions/workflows/ci.yml/badge.svg)](https://github.com/orieken/lolas-learning/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/REPLACE_ME_NETLIFY/site/status)](https://app.netlify.com/sites/REPLACE_ME_NETLIFY/overview)

This repository contains multiple apps and packages for the Lolas Learning platform.

## Tech Stack
- TypeScript (strict)
- pnpm workspaces
- Vitest for unit tests
- Playwright for end-to-end tests (+ axe-core a11y checks)
- Vite dev servers
- Pinia (state) + localForage (persistence) in shell

## CI/CD (P-11)
Automated via GitHub Actions workflow `ci.yml`:
- Install with cached pnpm store
- Lint & typecheck gates
- Unit tests (Vitest) with coverage artifact upload
- E2E tests (Playwright) with report artifact upload
- Build shell (and core packages)
- Conditional Netlify deploy on push to main (and PR previews) when `NETLIFY_AUTH_TOKEN` & `NETLIFY_SITE_ID` secrets are present.

Badges above use placeholder values. Replace `REPLACE_ME_OWNER/REPLACE_ME_REPO` and `REPLACE_ME_NETLIFY` after repo & site are created.

## Prerequisites
- Node.js (v18+ recommended)
- pnpm (install globally: `npm install -g pnpm`)

## Install (All Workspaces)
```sh
pnpm install
```

## Run Unit Tests
```sh
pnpm test
```
Notes:
- Vitest runs across the monorepo; e2e specs under `tests/e2e` are excluded from Vitest.
- Coverage provider: V8 (see `vitest.config.ts`).

## Run E2E Tests (Playwright)
```sh
pnpm e2e
```
What this does:
- Installs Playwright browsers if missing, builds workspace packages that e2e depends on, then runs tests in `tests/e2e`.
- Dev servers for Shell (http://localhost:5173) and Number Detective (http://localhost:5174) are spawned automatically via Playwright’s `webServer` config.

Configure via `.env` (see `.env.example`):
- HEADLESS=true|false (default true)
- RECORD_VIDEO=on|retain-on-failure|on-first-retry|off (boolean-like true -> on-first-retry)
- SCREENSHOTS=on|only-on-failure|off (boolean-like true -> only-on-failure)

Troubleshooting:
- If a port is busy, stop any existing dev servers or change the port in the respective Vite config.
- To open a trace after a failure:
  ```sh
  pnpm exec playwright show-trace test-results/**/trace.zip
  ```

## Local Development (Shell + Remote Game)
You can now use a small CLI to start multiple micro frontends at once.

Quick start (default apps):
```sh
pnpm dev
```
This starts the default apps from tools/mf.manifest.json (shell and number-detective) and opens http://localhost:5173/#/ when ready.

Other helpful commands:
```sh
# List available micro frontends
pnpm mf list

# Start all apps (ignores default flag)
pnpm mf start --all

# Start a subset by id
pnpm mf start shell
pnpm mf start shell number-detective

# Do not auto-open the browser
pnpm mf start --no-open
```

You can still start individual dev servers if you prefer:

Terminal A – Number Detective game (remote):
```sh
pnpm --filter @lolas/game-number-detective dev
```
Terminal B – Shell app (host):
```sh
pnpm --filter @lolas/shell dev
```
Then open the Shell:
- http://localhost:5173/#/
- Click “Go to Number Detective” to load the remote game.

## Scaffold a New Microfrontend
You can scaffold a new game microfrontend with our CLI. It will prompt for the game name, slug, port, and workspace package name, and will:
- Create a new app under apps/games/<slug> with Vite + Module Federation exposing ./Game.
- Generate a minimal Game.ts, a deterministic generator utility and a unit test.
- Create a Playwright e2e test stub under tests/e2e/<slug>-load.spec.ts.
- Append the new app to tools/mf.manifest.json so you can start it with pnpm mf start.
- Automatically wire it into the Shell (adds remote in vite.config.ts, creates Game<Pascal>.vue view using useRemotePlugin, adds route and Home link).
- Optionally adds a Playwright webServer entry for the new port so e2e can auto-start it.

Usage:
```sh
# Interactive
pnpm mf:new

# Non-interactive flags
node tools/mf-scaffold.mjs --name "Color Detective" --slug color-detective --port 5180 --pkg @lolas/game-color-detective
```

After scaffolding, run one of:
- pnpm dev (starts defaults and opens the shell)
- pnpm mf start --all (start everything)
- pnpm mf start shell <slug> (start shell + just your new game)

## Useful Workspace Commands
Run from repo root:
```sh
# Lint entire repo
pnpm lint
# Format (Prettier write)
pnpm format
# Build every package/app (each must have its own build script)
pnpm -r build
# Build a specific target
pnpm --filter @lolas/core-sdk build
pnpm --filter @lolas/shell build
pnpm --filter @lolas/game-number-detective build
```

## Project Structure
```
packages/
  core-sdk/        Core API boundary & types
  ui-kit/          UI component library (placeholder)
apps/
  shell/           Host PWA shell (Pinia stores, federation host)
  games/
    number-detective/  First game (remote)
```

## State Stores
Shell implements Pinia stores with localForage-backed persistence:
- profiles
- rewards (stars + badges; rule engine awards 1 star for perfect session, badge every 5 stars)
- sessions
- settings
Each has unit tests mocking localForage.

## Development Plan
See `docs/detective-dev-plan.md` for the step-by-step prompts (P‑01–P‑14).
Completed so far: P‑01, P‑02, P‑03, P‑05, P‑06, P‑07, P‑08, P‑09, P‑10.

## Conventions
- Keep packages framework-agnostic unless explicitly an app.
- Use CoreAPI events (awardPoints/saveSession/registerPrintable) for cross-boundary communication.
- Persist only minimal serializable state; derive the rest with getters.

## License
MIT
