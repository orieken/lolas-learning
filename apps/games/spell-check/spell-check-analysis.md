# Feature Analysis: Spelling Detective

## Summary
The Spelling Detective feature introduces a new microfrontend game designed for children ages 5–8 with dyslexia and other learning differences. The game presents two variations of a DIBELS sight word (one correct and one misspelled) and asks the player to select the correctly spelled word. It includes three difficulty levels that adjust word complexity, misspelling types, visual scaffolding, and pacing. This feature matters because it provides accessible and engaging spelling practice tailored to neurodivergent learners.

### Acceptance Criteria
- Given a user launches the game, they are presented with a level select screen offering Easy, Medium, and Hard options.
- Given a player selects Easy, they see only transposition misspellings, a hint button, and no timer.
- Given a player selects Medium, they face a soft timer and transposition/omission errors, with no hint button.
- Given a player selects Hard, they encounter all misspelling types, a faster soft timer, a smaller font, and no hint button.
- When a user selects the correct word (marked with `data-error="true"`), the card pulses green, a checkmark appears, and the game auto-advances after 1200ms.
- When a user selects the wrong word, the card shakes red, highlights the difference, and the game auto-advances after 2000ms.
- **MANDATORY**: Accessibility requirements must be met:
  - Font applied must be OpenDyslexic (or accessible fallback).
  - Tap targets must be at least 44x44px (100x80px preferred).
  - All interactive elements must support keyboard navigation (Tab + Enter/Space).
  - UI feedback must use ARIA roles (`role="status"`, `aria-live="polite"`, `aria-label`).
  - Animations must respect `prefers-reduced-motion`.

### Non-Functional Requirements
- **Performance**: Game logic to generate misspellings must be fully synchronous and resolve in <50ms to ensure immediate rendering. Core SDK calls like `core.saveSession()` and `core.awardPoints()` should resolve within 200ms without blocking UI interactions.
- **Security**: N/A for this pure client-side educational game, beyond existing Core SDK session boundaries.
- **Scaling**: N/A (Client-side game logic).

## Out of Scope
- Backend changes to user reporting or word lists.
- Multiplayer or competitive modes.
- Sound effect creation (use existing platform audio).

## Technical Breakdown

### Affected Components
- `apps/games/spelling-detective/`: New microfrontend scaffold to be created.
- `apps/games/spelling-detective/src/words.ts`: New file for DIBELS word bank and difficulty types.
- `apps/games/spelling-detective/src/generator.ts`: Logic to consistently generate the word foils.
- `apps/games/spelling-detective/src/Game.ts`: Main state machine and component rendering logic.
- `apps/shell/src/views/GameSpellingDetective.vue`: Host shell integration.
- `apps/shell/src/router/index.ts`: Route registration for `/game/spelling-detective`.
- `tools/mf.manifest.json`: Microfrontend registry updates.
- `tests/e2e/spelling-detective-load.spec.ts`: E2E verification of game flows.

### Data Model Changes
- None

### API Changes
- None. (Interacts with existing `core.saveSession()` and `core.awardPoints()`).

### New Dependencies
- None. (Must use vanilla DOM building as specified, Tailwind colors, and existing microfrontend setup).

## Task List

### Developer Tasks
1. Scafold the microfrontend using `node tools/mf-scaffold.mjs`.
2. Create `src/words.ts` and define the `DifficultyLevel`, `WordEntry`, and `MisspellType` types alongside the word bank.
3. Implement `src/generator.ts` with `makeWordRound()` using an xorshift32 PRNG for deterministic error generation.
4. Build `src/Game.ts` to handle the state machine: IDLE -> LEVEL_SELECT -> PLAYING -> ROUND_FEEDBACK -> DONE.
5. Apply styling based on `tailwind.config.cjs` tokens and inline CSS.
6. Register the wordlist printable in the core SDK (Optional Enhancement).
7. Create unit tests for `generator.test.ts`.

### QA Tasks
1. Write Playwright E2E tests in `tests/e2e/spelling-detective-load.spec.ts` matching the spec.
2. Verify all difficulty traits (timers, hints, misspell types) work as described.
3. Test a11y: Screen reader announcements, keyboard navigation, contrast, and `prefers-reduced-motion`.

### Tech Writer Tasks
1. Update any teacher/parent-facing documentation to explain Spelling Detective difficulty scaling.

### DevOps Tasks
1. Update CI `mf.manifest.json` configurations to build the new game.
2. Verify port 5178 is mapped correctly in Playwright webServer configs.

## Edge Cases and Risks
- **Edge case**: Generated transposition foil coincidentally produces a valid English word (e.g. "saw" -> "was").
  - **Handling**: Ensure spelling targets are purely evaluated against what the generator marks as `data-error="true"`.
- **Edge case**: 2-letter word constraints on "Easy" transpositions.
  - **Handling**: Fall back to insertion or omission automatically as defined in spec.
- **Risk**: Device performance for DOM repaints during timer countdowns.
  - **Mitigation**: Use lightweight CSS transitions or `requestAnimationFrame` for the timer bar rather than heavy recalculations.

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing (`pnpm test`)
- [ ] Integration tests written and passing (`pnpm e2e`)
- [ ] CI pipeline green
- [ ] No new linting errors
