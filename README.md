# Lola's Learning

[![CI](https://github.com/orieken/lolas-learning/actions/workflows/ci.yml/badge.svg)](https://github.com/orieken/lolas-learning/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e1f70848-f60c-4bad-b6e0-cded2998db77/deploy-status)](https://app.netlify.com/projects/lolaslearning/deploys)

Lola's Learning is an interactive, extensible educational platform designed to provide a cohesive suite of learning games for children.

## 🎯 What We Are Trying to Solve

Educational games for children are often fragmented. A child might use one app for math and an entirely different one for spelling, each with its own separate progress tracking, reward system, and user experience. 

**Lola's Learning** solves this by providing a unified educational ecosystem. It features:
- **Shared State & Progression**: A central profile that tracks progress, awards stars, and unlocks badges across all games.
- **Adaptive Learning**: Games that adapt to the child's skill level.
- **Micro-Frontend Extensibility**: A plug-and-play architecture that allows new games (like Number Detective or Freeze Math) to be developed in isolation and instantly integrated into the main platform.
- **Blended Learning**: Support for generating dynamic PDFs and printable worksheets to bridge digital and physical learning.

## 🏗️ Architecture

The platform uses a **Micro-Frontend (MFE)** architecture powered by Vite and Module Federation. This allows independent games to be mounted inside a single host application, sharing core logic while remaining decoupled.

### Repository Structure

We use a **pnpm workspaces** monorepo to manage our packages and applications:

```text
packages/
  core-sdk/        Core API boundary, shared events, and types
  ui-kit/          UI component library (shared design system)
apps/
  shell/           Host PWA shell (Pinia stores, federation host, global routing)
  games/
    number-detective/  Remote game: Math operations & number recognition
    freeze-math/       Remote game: Fast-paced math challenges
    letter-detective/  Remote game: Letter recognition
    ...                (And many more)
```

### Core Technologies
- **Host Application (`apps/shell`)**: Acts as the central hub. Built with Vue 3 and Vite. It manages global Pinia stores (profiles, rewards, sessions) backed by `localForage` for offline persistence.
- **Remote Applications (`apps/games/*`)**: Individual learning games. Each game is a standalone micro-frontend that exposes a `./Game` entry point.
- **State Management**: The shell owns the state. Games communicate with the shell via cross-boundary CoreAPI events (e.g., `awardPoints`, `saveSession`).
- **Testing Strategy**: 
  - **Unit**: Vitest (across the monorepo)
  - **E2E**: Playwright (with axe-core for accessibility checks)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (install globally: `npm install -g pnpm`)

### Installation
```sh
pnpm install
```

### Local Development (Shell + Remote Game)
You can use our custom CLI to start multiple micro-frontends at once.

Quick start (default apps - Shell + Number Detective):
```sh
pnpm dev
```
This starts the default apps from `tools/mf.manifest.json` and opens `http://localhost:5173/#/` when ready.

Other helpful commands:
```sh
# List available micro frontends
pnpm mf list

# Start all apps (ignores default flag)
pnpm mf start --all

# Start a subset by id
pnpm mf start shell number-detective

# Do not auto-open the browser
pnpm mf start --no-open
```

You can still start individual dev servers manually:
```sh
# Terminal A – Remote game:
pnpm --filter @lolas/game-number-detective dev

# Terminal B – Shell app:
pnpm --filter @lolas/shell dev
```

### Scaffold a New Microfrontend
You can scaffold a new game microfrontend with our CLI:
```sh
# Interactive
pnpm mf:new

# Non-interactive flags
node tools/mf-scaffold.mjs --name "Color Detective" --slug color-detective --port 5180 --pkg @lolas/game-color-detective
```
The CLI will automatically wire it into the Shell, create a stub e2e test, and add it to the manifest.

## 🧪 Testing

### Run Unit Tests
```sh
pnpm test
```
*Vitest runs across the monorepo; e2e specs under `tests/e2e` are excluded. Coverage provider: V8.*

### Run E2E Tests (Playwright)
```sh
pnpm e2e
```
*Installs Playwright browsers if missing, builds workspace packages, and runs tests in `tests/e2e`.*

Configure via `.env` (see `.env.example`):
- `HEADLESS=true|false`
- `RECORD_VIDEO=on|retain-on-failure|on-first-retry|off`
- `SCREENSHOTS=on|only-on-failure|off`

## 🛠️ Useful Workspace Commands
```sh
pnpm lint                       # Lint entire repo
pnpm format                     # Format (Prettier write)
pnpm -r build                   # Build every package/app
pnpm --filter @lolas/shell build # Build a specific target
```

## 📜 Conventions
- Keep packages framework-agnostic unless explicitly an app.
- Use CoreAPI events (`awardPoints`, `saveSession`, `registerPrintable`) for cross-boundary communication.
- Persist only minimal serializable state; derive the rest with getters.

## 📝 License
MIT
