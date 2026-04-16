# E2E – Roadmap for Visual/AI Validation

Purpose: level up our Playwright e2e beyond DOM assertions by adding screenshots, video, and ML/computer-vision validation of the UI as we go.

## Environment Flags (.env)

- HEADLESS=true|false (default true)
- RECORD_VIDEO=on|retain-on-failure|on-first-retry|off (default off; if boolean-like true -> on-first-retry)
- SCREENSHOTS=on|only-on-failure|off (default only-on-failure if boolean-like true)

See `.env.example` for recommended defaults.

## Core Use Cases

1) Visual regressions – catch unintended pixel changes in critical views (home, game grid, rewards page).
2) Game state image check – verify the error button positioning visually matches the generator output.
3) Accessibility overlays – verify focus rings and contrast at runtime with screenshots.
4) OCR text verification – confirm copy (titles, score banners) using OCR when DOM text isn’t reliable.
5) Layout drift guardrails – detect shifted components beyond a tolerance using feature/keypoint matching.

## Tooling Options

- Baseline snapshots: Playwright `toHaveScreenshot()` + custom thresholds.
- Diff engines: `pixelmatch`, `resemblejs` for color-tolerant diffs.
- CV/ML: `opencv4nodejs` (native) or `@u4/opencv4nodejs` (prebuilt), or call into a small Python service (OpenCV) over HTTP for complex ops.
- OCR: `tesseract.js` for in-process OCR (JS), or optional Python Tesseract service.
- Layout heuristics: SIFT/ORB keypoints via OpenCV; fallback to contour/shape match (less accurate).

## Architecture Sketch

- Test Helper Layer
  - `visual/assert.ts`: wrappers for screenshot+diff and region-based checks.
  - `visual/ocr.ts`: helper to OCR selected regions and compare to expected.
  - `visual/cv.ts`: utilities to compute keypoints and layout similarity.
- Asset Management
  - Baselines under `tests/visual-baselines/<suite>/<name>.png`.
  - Diffs under `test-results/<suite>/<name>.diff.png`.
- Thresholds
  - Strict on icons/logos; relaxed on text rendering/anti-aliasing (1–3%).

## Execution Model

- Default headless, screenshots only on failure.
- CI: `RECORD_VIDEO=on-first-retry`, `SCREENSHOTS=only-on-failure`.
- Local debug: `HEADLESS=false`, `RECORD_VIDEO=on`, `SCREENSHOTS=on`.

## Prompts Backlog (for codegen-assisted iterations)

- P‑E2E‑01: Visual Baselines – "Add Playwright screenshot baselines for Home, Game (first line), Rewards. Implement `expect(page).toHaveScreenshot(name, { maxDiffPixelRatio: 0.02 })` with stable locators and `animations: 'disabled'`."
- P‑E2E‑02: Diff Harness – "Create `tests/visual/visualAssert.ts` that can capture a region by selector, compare via `pixelmatch`, and produce a diff artifact. Expose `assertRegionMatch(page, selector, name, { threshold })`."
- P‑E2E‑03: OCR Check – "Integrate `tesseract.js` with a helper `ocrText(page, selector)` and a test that validates the score banner text after a perfect run. Cache language data and run headless."
- P‑E2E‑04: CV Keypoints – "Prototype OpenCV keypoint matching for the game grid to ensure tiles align in a 6-column layout within ±3px. Provide prebuilt binaries or optional Docker service to avoid native build flakiness."
- P‑E2E‑05: Layout Drift Guard – "Implement a layout drift test that samples key components (header, CTA, grid bounds) and fails when deltas exceed thresholds compared to baseline metadata."
- P‑E2E‑06: Report Integration – "Aggregate visual/OCR/CV results into Playwright HTML report with links to baselines/diffs and an overall summary."

## Acceptance Criteria Examples

- When running `pnpm e2e` locally with `HEADLESS=false`, visual baselines are created/updated via explicit flag (e.g., UPDATE_SNAPSHOTS=1) and diffs saved on failure.
- OCR can read the final score as `Finished! Score 10/10` with >99% confidence.
- Keypoint layout check fails if the game grid columns shift >3px average from baseline.

## Risks & Mitigations

- Native builds (OpenCV): prefer optional path via Docker or a small Python sidecar. Keep a pure-JS fallback for developers who can’t compile native deps.
- Flaky diffs due to fonts/AA: disable animations, set consistent viewport and device scale; allow small pixel ratios.
- Baseline drift: require human approval for baseline updates; store separately per theme/dark mode.

## Next Steps

1) Land P‑E2E‑01 and wire `.env` flags into Playwright (done).
2) Add `tests/visual-baselines/` and the visual assert helper.
3) Decide on OCR path (JS vs. Python) and spike a canary test.
4) Evaluate feasibility of prebuilt OpenCV vs Docker sidecar for CI.

