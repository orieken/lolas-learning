# Detective App – Development Plan, Architecture & TDD/BDD Prompts

> Goal: Ship a modular, micro‑frontend (MFE) learning app (Vue 3 + Vite + Pinia + Ionic UI + Capacitor) where the **Shell** owns identity, scoring, badges, routing, analytics, and **Games** ship as independent plugins. Build quality in via **TDD/BDD**, Clean Architecture, and CI/CD from Sprint 0. Deploy the web PWA to **Netlify**; mobile via Capacitor later.

---

## Product North Star

* **Audience:** 1st graders; parents; (later) teachers
* **Outcomes:** Slowing down as a skill; accurate sequencing; self‑check habit; playful engagement
* **MVP Games:** Number Detective, Letter Detective, Word Detective (CVC/CVCe), Freeze Math
* **Differentiators:** Offline‑first PWA; printable packs; plug‑and‑play new games via MFE

---

## Architecture Overview (High Level)

```mermaid
flowchart LR
  subgraph Shell[Shell (Vue 3 + Vite + Pinia + Ionic)]
    Router[[Router]]
    CoreSDK[(Core SDK)]
    Stores[(Pinia Stores: sessions, rewards, profiles, settings)]
    Analytics[(Analytics Adapter)]
    PrintSvc[(Print/PDF Service)]
    Registry[(Game Registry & Loader)]
  end

  CDN[(CDN)] -- manifest.json --> Registry
  CDN -- remoteEntry.js --> Registry

  subgraph Games[Games (Remote MFEs)]
    ND[Number Detective]
    LD[Letter Detective]
    WD[Word Detective]
    FM[Freeze Math]
  end

  Registry --> ND
  Registry --> LD
  Registry --> WD
  Registry --> FM

  ND -- CoreAPI events --> CoreSDK
  LD -- CoreAPI events --> CoreSDK
  WD -- CoreAPI events --> CoreSDK
  FM -- CoreAPI events --> CoreSDK

  CoreSDK --> Stores
  CoreSDK --> Analytics
  PrintSvc -. optional .- Games
```

### Clean Architecture Slice (per game & shell)

```mermaid
flowchart TB
  UI[Presentation (Vue Components)] --> APP[Application (Use Cases, Services)]
  APP --> DOMAIN[(Domain Models & Rules)]
  APP --> INFRA[Infrastructure (Storage, HTTP, PDF, Analytics)]
  INFRA -. adapters .-> APP
  note right of DOMAIN: Pure, framework‑agnostic
```

**Guiding Principles (our heroes):**

* *Fowler:* evolutionary architecture, bounded contexts, build pipelines as first‑class
* *Bob Martin:* SOLID, Clean Architecture boundaries, DTOs across boundaries
* *Kent Beck:* TDD/BDD, simple design, continuous refactor, baby steps
* *Neal Ford:* fitness functions in CI (lint, test, bundle size, perf budgets)

---

## Micro‑Frontend Strategy

* **Module Federation** via `vite-plugin-federation` (preferred) or **Web Components** fallback
* **Contract:** `GamePlugin` interface + `CoreAPI` injected by shell
* **Discovery:** CDN‑hosted `manifest.json` listing remote games, versions, and entry points
* **Isolation:** Games never mutate Pinia directly; they call `CoreAPI` (award points, save sessions, unlock badges, register printables)
* **Offline:** Pre‑bundle a core set; cache additional games with Workbox; allow “Installed” vs “Remote” badges in catalog

---

## Sprint 0 – Enable Quality (1–2 days)

### 0.1 Repository & Tooling

* [ ] Initialize monorepo (pnpm workspaces or Turborepo)
* [ ] Packages: `core-sdk`, `ui-kit`
* [ ] Apps: `shell`, `games/number-detective` (first remote)
* [ ] Code style: ESLint + Prettier + EditorConfig
* [ ] Type Safety: strict TSConfig across packages

### 0.2 Testing Pyramid

* [ ] **Unit**: Vitest + Vue Test Utils (components & pure generators)
* [ ] **BDD**: Cucumber.js (gherkin) or Playwright‑BDD for feature specs (optional), else Playwright test + Given/When/Then helpers
* [ ] **E2E**: Playwright (shell load, game load, play/complete, badge earn)
* [ ] **Contract Tests**: validate each game’s `GamePlugin` against `core-sdk` types at build time

### 0.3 CI/CD

* [ ] GitHub Actions: lint → unit → e2e (preview env) → build
* [ ] Netlify deploy (main → prod; PRs → previews)
* [ ] Artifacts: Upload Playwright reports & coverage to GH run
* [ ] Fitness checks: bundle size, Lighthouse PWA score, Typecheck gates

### 0.4 DevX

* [ ] Storybook (or Histoire) for `ui-kit` components (large tap targets, a11y)
* [ ] Mock services for offline dev (storage, analytics)
* [ ] Env & secrets handling (Vite env files; Netlify env vars)

---

## Sprint 1 – Shell MVP

**Goal:** Navigable PWA shell that can discover & mount one remote game, persist sessions, and award points/badges.

* [ ] Scaffold Shell: Vue + Vite + Pinia + Ionic + Router
* [ ] Implement `core-sdk` interfaces & `CoreAPI` bus
* [ ] Pinia stores: `sessions`, `rewards`, `profiles`, `settings`
* [ ] Catalog Page (reads local static manifest for dev)
* [ ] Route Mount: load MF remote and mount its route
* [ ] Rewards Page: stars & badge rules (simple: 5 stars → badge)
* [ ] Print Center Page: placeholder entries; hooks for games to register printables
* [ ] Local persistence: IndexedDB via localForage

**Tests**

* Unit: stores (reducers), CoreAPI events
* E2E: open app → load catalog → launch game → complete session → star badge appears

---

## Sprint 2 – First Game (Number Detective)

* [ ] Pure generator: `makeNumberLines([1,20], lines=10)` with exactly one error per line
* [ ] Game view: large tap targets; immediate feedback; progress; completion modal
* [ ] Callbacks to `CoreAPI`: `awardPoints`, `saveSession`
* [ ] Printable registration: basic PDF (client‑side)

**Tests**

* Unit: generator has single error; distribution; edge ranges
* Component: renders lines; clicking error marks correct
* E2E: play 10/10 → star → badge flow; persistence across reload

---

## Sprint 3 – Letter & Word Detective

* [ ] `makeLetterLines(a–z)` generator (one error: missing/double/out‑of‑order)
* [ ] `makeWordSets()` for CVC & CVCe rhymes (one odd word per row)
* [ ] Views with the same interaction pattern; unlock “Detective” badge set
* [ ] Printables registration for both games

**Tests** similar structure to Sprint 2

---

## Sprint 4 – Freeze Math

* [ ] `makeFacts()` (+/– within bands; evenly distributed)
* [ ] Freeze overlay: point → breathe → continue (timer pause)
* [ ] Save session & award points
* [ ] Printable registration

**Tests**: generator coverage, UI pause/resume, timing captured

---

## Future Sprints

* Adaptive difficulty; streaks; parental dashboard; teacher mode; Supabase sync; analytics dashboards; accessibility deep‑pass; localization

---

## Prompts Library (copy‑paste for fast TDD/BDD)

> Use these prompts in your AI/codegen workflow. Each prompt is **small, test‑first**, and references acceptance criteria.

### P‑01: Scaffold Monorepo

**Status:** [x] Complete
**Prompt:**
"""
Create a pnpm workspace monorepo with packages `core-sdk`, `ui-kit` and apps `shell`, `games/number-detective`. All TypeScript with strict tsconfig. Configure ESLint + Prettier + EditorConfig. Add Vitest config shared across packages. Provide folder trees and base files.
Acceptance: running `pnpm -w install && pnpm -w -r build` succeeds.
"""

### P‑02: Core SDK Types (Clean Architecture boundary)

**Status:** [x] Complete
**Prompt:**
"""
Write a minimal `core-sdk` package exporting:

* `GamePlugin`, `CoreAPI`, `Session`, `PrintableDef` types
* A small `createCoreApi()` that records events to an injected adapter
  No framework imports. Add Vitest unit tests for type‑level contract and runtime no‑op adapters.
  """

### P‑03: Shell Stores (Pinia)

**Status:** [x] Complete
**Prompt:**
"""
Implement Pinia stores `sessions`, `rewards`, `profiles`, `settings` with strict types, actions, and selectors. Add unit tests (Vitest) covering reducers and persistence serialization to localForage (mocked).
"""

### P‑04: Module Federation Wiring (Dev Only)

**Status:** [ ] Not started
**Prompt:**
"""
Integrate `vite-plugin-federation` into Shell and `games/number-detective`. Shell exposes no remotes; game exposes `./Game` which exports `{ plugin: GamePlugin }`. Implement dynamic import from a local dev URL. Add a Playwright e2e that loads shell and navigates to the game route.
"""

### P‑05: Number Generator (TDD)

**Status:** [x] Complete
**Prompt:**
"""
Implement `makeNumberLines(range:[number,number], lines=10)` returning an array of `{ items:number[]; errorIndex:number; type:'missing'|'double'|'order' }`. Ensure exactly one error per line. Write table‑driven Vitest tests for correctness and edge cases.
"""

### P‑06: Number Detective View (BDD + a11y)

**Status:** [x] Complete
**Prompt:**
"""
Create `NumberDetectiveView.vue` using Ionic components with large tap targets. Given a line, when the user taps the error index, show positive feedback and advance. On completion, call `core.awardPoints(1)` per correct and `core.saveSession(...)`. Add Playwright tests for a full run, and axe‑core a11y checks.
"""

### P‑07: Rewards & Badges

**Status:** [x] Complete
**Prompt:**
"""
Implement a simple rule engine: every completed session with 10/10 earns 1 star; every 5 stars earns `badgeId='detective-star'`. Update the Rewards page to list stars, badges, and earnedAt timestamps. Unit test rule engine; e2e test star→badge flow.
"""

### P‑08: Print Center (PDF Service)

**Status:** [x] Complete
**Prompt:**
"""
Create `print/service.ts` with a strategy for generating PDFs client‑side (pdfmake). Shell registers default templates; games can `core.registerPrintable({id,title,makePdf})`. Add unit tests for registry; mock pdf generation. E2E: clicking a printable triggers a Blob download.
"""

### P‑09: Letters & Words Games (reuse patterns)

**Status:** [x] Complete
**Prompt:**
"""
Implement `makeLetterLines()` and `makeWordSets()` with tests ensuring exactly one odd element per row. Create corresponding views and register them as separate remote games via federation. Reuse the same scoring hooks.
"""

### P‑10: Freeze Math (Timer & Freeze Overlay)

**Status:** [x] Complete
**Prompt:**
"""
Implement `makeFacts()` and a Pause/Freeze overlay that halts the problem timer and displays a breath animation. Ensure timer resumes only after user interaction. Unit test the timer module; E2E the freeze flow.
"""

#### Freeze Math – Enhancement Backlog
(Tracked for follow‑up after core feature completion)
- [ ] FM‑E1: Award separate practice points after all facts are completed correctly (do not mix with main odd-one-out score).
- [ ] FM‑E2: Allow configurable fact count & max via query params (`?facts=20&max=12`) with sane defaults and validation.
- [ ] FM‑E3: Add a user toggle (collapse/expand) to hide/show the Facts Practice panel; remember preference in local storage.

---

## Future Sprints

* Adaptive difficulty; streaks; parental dashboard; teacher mode; Supabase sync; analytics dashboards; accessibility deep‑pass; localization

---

## Tracking Checklist (per deliverable)

Use this table to mark completion and link PRs.

| ID   | Title                              | Owner | Status | PR/Link |
| ---- | ---------------------------------- | ----- | ------ | ------- |
| P‑01 | Scaffold Monorepo                  |       | [x]   |         |
| P‑02 | Core SDK Types                     |       | [x]   |         |
| P‑03 | Shell Stores (Pinia)               |       | [x]   |         |
| P‑04 | Module Federation Wiring           |       | [ ]   |         |
| P‑05 | Number Generator (TDD)             |       | [x]   |         |
| P‑06 | Number Detective View (BDD + a11y) |       | [x]   |         |
| P‑07 | Rewards & Badges                   |       | [x]   |         |
| P‑08 | Print Center (PDF Service)         |       | [x]   |         |
| P‑09 | Letters & Words Games              |       | [x]   |         |
| P‑10 | Freeze Math                        |       | [x]   |         |
| P‑11 | CI/CD – GitHub Actions + Netlify   |       | [ ]   |         |
| P‑12 | Fitness Functions                  |       | [ ]   |         |
| P‑13 | Security & Manifest Validation     |       | [ ]   |         |
| P‑14 | Offline Caching & Installed Games  |       | [ ]   |         |

---

## Deployment Notes (Web First)

* **Netlify:** deploy `shell` dist; keep remotes on CDN (or Netlify site paths)
* **Env:** `VITE_GAMES_MANIFEST_URL` per env (dev/preview/prod)
* **Previews:** every PR builds shell + a sample remote; post preview URLs as PR comments

---

## Definition of Done (per Story)

* 100% unit tests for new pure functions; ≥80% for components
* Playwright e2e added/updated
* a11y checked (axe) and keyboard navigable
* CI green with fitness gates
* Docs updated (README + prompts/usage)

---

## Risks & Mitigations

* **Remote version drift** → pin shared dep versions; semver checks in manifest
* **Offline complexity** → start with core bundle; progressive caching for extras
* **Mobile store policies** → only load web content; no native code updates

---

## Next Steps

1. Approve Sprint 0 scope
2. Run P‑01 to create the workspace
3. Wire P‑04 to load the first remote locally
4. Implement P‑05/P‑06 for the first playable flow

> When you’re ready, I can generate the **P‑01/P‑02/P‑03** starter files directly so you can copy into your repo and run.
