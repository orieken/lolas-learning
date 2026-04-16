# Word Search MFE - Implementation TODO

This file is a living checklist for implementing the Word Search microfrontend and generator.

- [x] Add microfrontend entry (`mfe.ts`) exporting `bootstrap`, `mount`, `unmount` in `apps/games/word-search`.
- [x] Create a reusable generator at `apps/games/word-search/lib/generator.ts` with `generateGrid` and `findWordInGrid`.
- [ ] Extract full styles into `styles.css` and template into `template.html` (optional refactor).
- [ ] Add unit tests to reach >=85% coverage:
  - `generator.test.ts` — placement rules, backwards/diagonal toggles, solver finds words.
  - `mfe.test.ts` — mount/unmount behavior, DOM structure, minimal interactivity.
- [ ] Add Playwright E2E tests under `tests/e2e/word-search.spec.ts` to verify UI flows (select letters, match words, clear selection).
- [ ] Add CI scripts / vitest coverage thresholds and e2e runner commands.
- [ ] ML/AI integration POC (`tools/puzzle-ml/`) to propose word groups and validate puzzles deterministically.

Design notes:
- Default directions: right and down. Backwards and diagonal are available via options.
- Keep the MFE inside `apps/games/word-search` as requested.
- Generator uses RNG injection for deterministic tests.

Next steps:
1. Implement unit tests for `generateGrid` and `findWordInGrid`.
2. Wire Vitest in `apps/games/word-search/package.json` (or root) to run tests.
3. Implement Playwright test page that mounts the MFE and runs interactions.

