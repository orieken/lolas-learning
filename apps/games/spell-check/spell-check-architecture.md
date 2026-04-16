# Architecture Notes: Spelling Detective

## Structural Decisions

### Independent Microfrontend Isolation
**Decision**: The "Spelling Detective" game will be completely isolated as a distinct microfrontend (`spelling-detective` at port 5178) rather than built into a shared game bundle.
**Reasoning**: Micro Frontends bounded context. Each educational game has a separate lifecycle, different accessibility profiles, and may be independently versions/deployed. This strictly follows the Saturday Framework architectural isolation.
**Alternative considered**: Integrating it directly into a mono-game application. Rejected due to the potential coupling of distinct logic loops and shared states that violate independent deployability.
**Constraint**: "Never share game state logic between two microfrontend game apps; rely entirely on `core-sdk` for shared communication."

### Vanilla DOM State Machine over Framework
**Decision**: Use Vanilla TS to build the DOM for `src/Game.ts` directly via a simple state machine pattern instead of importing Vue/React.
**Reasoning**: Simple Design & Least Elements Necessary. The prompt explicitly prohibits reusing `mountOddOneOut` and mandates direct DOM building, avoiding the overhead of heavy frameworks for a single lightweight activity.
**Alternative considered**: Adding Vue or Preact. Rejected because the prompt specification forbids generic component dependencies here.
**Constraint**: "Always use native DOM methods for simple interactive cards in this game to reduce bundle overhead."

### Deterministic Seeded PRNG Strategy
**Decision**: `makeWordRound` must accept an explicit seed and utilize the xorshift32 PRNG. 
**Reasoning**: Determinism is crucial for reproducible testing and potentially resuming or validating sessions. Pure domain logic enables easy unit testing off the browser environment.
**Alternative considered**: Standard `Math.random()`. Rejected because it makes E2E testing brittle and hinders future re-playability features.
**Constraint**: "Never use `Math.random()` for core game generation."

## Component Placement

| Component | Package | Layer | Extends/Implements |
|---|---|---|---|
| `Game.ts` | `apps/games/spelling-detective/src` | Interface Adapters / UI | Vanilla DOM Mount |
| `makeWordRound()` | `apps/games/spelling-detective/src` | Application/Use Case | N/A (Pure Function) |
| `GameSpellingDetective.vue` | `apps/shell/src/views` | Frameworks (Vue router) | Shell Component |

## Layer Boundary Checks
- [x] No domain logic in adapter layer (Game logic stays in generator)
- [x] No framework imports in use case layer (words.ts and generator.ts are pure TypeScript)
- [x] New components follow dependency direction (inward only)
- [x] No direct HTTP calls outside `IHttpAdapter` implementations (Only SDK calls via `core`)

## Fitness Functions
These properties must remain true as the codebase evolves.

- **A11y Constraint Check**: ESLint rule or Playwright axe-core integration to ensure `aria-live` and `role="status"` properties remain enforced on all feedback toast containers.
- **Dependency Isolation**: `dependency-cruiser` rule enforcing that `apps/games/spelling-detective` cannot import from other sibling apps in `apps/games/*`.
- **Pure Generator Limits**: `tsc --strict` enforcement; ensure `makeWordRound` remains side-effect free.

## Refactoring Opportunities
Adjacent code that should be cleaned up while we're in this area:
- None identified directly pending review of the existing game generator patterns; however, the `xorshift32` logic might be a candidate for an *Extract Method/Class* into a shared math utilities package if it is copy-pasted across 3+ microfrontends.

## Developer Handoff Notes
- Please note the explicit requirement regarding the `data-error` attribute inversion: `data-error="true"` goes on the *correctly spelled word*. This is a crucial legacy constraint to satisfy the established e2e ecosystem.
- For generating the foils with `xorshift32`, model your approach after existing generators in the codebase.
- Colors must be extracted strictly from `tailwind.config.cjs` tokens and added to `.className` strings directly.

## Open Architectural Questions
- Do we have a shared utility for `xorshift32` in the `core-sdk`? If so, the developer should import it rather than rewriting it.
- Should the "Soft Timer" be managed via `setInterval` or `requestAnimationFrame`? A CSS transition on width might be cleaner and perfectly aligns with the required "prefers-reduced-motion" graceful degradation.
