# P-XX: Spelling Detective — DIBELS Spelling Game with Difficulty Levels

## Overview

Scaffold and implement a new microfrontend game called **Spelling Detective** under `apps/games/spelling-detective`. The game presents the player with two versions of a DIBELS sight word — one correctly spelled, one misspelled — and the player must tap the correctly spelled word to advance. The game supports three difficulty levels that change word complexity, misspelling type, visual scaffolding, and pacing.

This game is designed for children ages 5–8 with dyslexia and other learning differences. All design decisions must prioritize:
- OpenDyslexic or high-legibility font rendering
- High contrast, large tap targets
- Immediate, encouraging audio + visual feedback
- No time pressure at easier levels

---

## Step 1 — Scaffold the Microfrontend

Run the scaffold CLI to create the boilerplate:

```bash
node tools/mf-scaffold.mjs \
  --name "Spelling Detective" \
  --slug spelling-detective \
  --port 5178 \
  --pkg @lolas/game-spelling-detective
```

This will generate:
- `apps/games/spelling-detective/` with `src/Game.ts`, `src/generator.ts`, `vite.config.ts`, `package.json`, `tsconfig.json`
- Shell view `apps/shell/src/views/GameSpellingDetective.vue`
- Route `/game/spelling-detective` wired into shell router
- Home link with `data-test="link-spelling-detective"`
- Playwright e2e stub at `tests/e2e/spelling-detective-load.spec.ts`
- Entry in `tools/mf.manifest.json`
- Playwright `webServer` entry for port 5178

After scaffolding, verify the shell `vite.config.ts` includes:
```ts
spelling_detective: 'http://localhost:5178/assets/remoteEntry.js',
```

---

## Step 2 — Word Data (`src/words.ts`)

Create `apps/games/spelling-detective/src/words.ts` exporting a typed word bank organized by difficulty level.

### Types

```ts
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type WordEntry = {
  correct: string;        // correctly spelled DIBELS word
  misspelling: string;    // the foil shown to the player
  errorType: MisspellType;
};

export type MisspellType =
  | 'transposition'   // two letters swapped: "the" → "teh"
  | 'omission'        // a letter dropped: "said" → "sid"
  | 'substitution'    // one letter replaced: "like" → "lice"
  | 'doubling'        // a letter doubled: "come" → "comme"
  | 'insertion';      // extra letter added: "and" → "annd"
```

### Level Definitions

**Easy (Level 1) — Pre-K / Kindergarten DIBELS Tier 1**
- 3–4 letter words only
- Misspelling type: `transposition` only (two adjacent letters swapped — most visually obvious)
- No time limit
- Large font, generous spacing, scaffold hint available ("Look at each letter carefully!")
- Words: a, at, am, an, in, is, it, if, up, us, on, no, go, do, so, me, he, we, be, by, my, or, of, to, I, as, has, had, his, him, her, can, ran, fan, man, pan, sat, cat, bat, hat, mat, rat, van, tan, sun, run, fun, gun, bun, cup, cut, put, but, nut, rut, pig, big, fig, dig, wig, jig, hop, top, pop, mop, cop, dot, hot, lot, got, cot, bed, red, fed, led, wet, set, net, pet, let

**Medium (Level 2) — Grade 1 DIBELS Tier 1 & 2**
- 3–6 letter words
- Misspelling types: `transposition`, `omission`
- 60-second soft timer (visual only, no penalty — just feedback at end)
- Standard font size
- Words: the, and, said, you, like, come, have, from, they, were, what, when, here, with, this, will, look, see, play, make, that, jump, into, for, her, his, are, was, all, one, our, out, put, day, too, now, new, old, ran, gave, live, find, each, away, any, may, its, use, how, who, get, back, your, two, more, did, let, way, big, set, tell, give, does, good, some, just, went, came, told, help, say, him, got, saw

**Hard (Level 3) — Grade 1–2 DIBELS / Dolch advanced**
- 4–8 letter words, includes blends and digraphs
- Misspelling types: all five (`transposition`, `omission`, `substitution`, `doubling`, `insertion`)
- 45-second soft timer
- Smaller font, standard spacing, no hints
- Words: there, their, these, those, other, about, could, would, should, which, while, where, again, after, every, first, found, place, write, think, light, right, night, might, fight, sight, bring, thing, going, doing, being, water, under, never, still, always, often, before, little, people, school, friend, number, together, something, another, because, without, between, through, everything

### Generator Function

```ts
export function makeWordRound(
  level: DifficultyLevel,
  opts: { count?: number; seed?: number }
): WordEntry[]
```

- Returns `count` (default 10) `WordEntry` items drawn from the level's word bank
- Is deterministic given the same `seed`
- Uses the same xorshift32 PRNG pattern established in other generators
- Each entry's `misspelling` is generated programmatically from the `correct` word using the allowed error types for the level (do not hardcode misspellings — derive them):
  - `transposition`: swap characters at a random adjacent pair that produces a distinct string
  - `omission`: drop a non-first vowel or a non-critical consonant
  - `substitution`: replace one interior letter with an adjacent-keyboard or visually-similar letter (e, a, o commonly confused; b/d/p/q for dyslexia-specific)
  - `doubling`: double an interior consonant
  - `insertion`: insert a duplicate of an adjacent letter
- Misspelling must differ from the correct word (validate this)
- For easy level words that are only 2 letters, use omission or insertion to still produce a distinct foil

---

## Step 3 — Game Component (`src/Game.ts`)

Replace the scaffolded `Game.ts` with the full implementation. Do NOT use `mountOddOneOut` from core-sdk because this game has its own layout (horizontal pair, not a grid of 6). Build the DOM directly.

### Game State Machine

```
IDLE → LEVEL_SELECT → PLAYING → (ROUND_FEEDBACK → PLAYING)* → DONE
```

### Level Select Screen

On mount, show a level selection screen before any gameplay. The screen must:
- Display the game title: "Spelling Detective 🔍"
- Show three large tappable cards: **Easy**, **Medium**, **Hard**
- Each card shows:
  - A star icon representing difficulty (⭐ / ⭐⭐ / ⭐⭐⭐)
  - The level name in large text
  - A one-line description (e.g. Easy: "Short words, swap two letters", Hard: "Longer words, trickier mistakes")
  - `data-test="level-btn-easy"` / `"level-btn-medium"` / `"level-btn-hard"`
- Each card is keyboard accessible (button element, Enter/Space activates)

### Gameplay Screen

Show one question at a time. Per question:

```
┌─────────────────────────────────────────────────────┐
│  Question 3 of 10           [level badge]           │
│  ████████████░░░░░░░░░  30%                         │
│                                                     │
│  Circle the word that is spelled correctly! ✏️      │
│                                                     │
│  ┌──────────────────┐   ┌──────────────────┐        │
│  │                  │   │                  │        │
│  │      said        │   │      siad        │        │
│  │                  │   │                  │        │
│  └──────────────────┘   └──────────────────┘        │
│                                                     │
│  [Hint button — Easy level only]                    │
└─────────────────────────────────────────────────────┘
```

**Word cards:**
- Two large buttons, side by side (or stacked on very small screens)
- Minimum tap target: 120px × 100px
- Font: `"OpenDyslexic", "Lexie Readable", "Comic Sans MS", cursive` — large, at least 32px on Easy, 28px on Medium, 24px on Hard
- `data-test="word-btn-left"` and `data-test="word-btn-right"` on the two buttons
- The correct answer's button has `data-error="false"` and the wrong answer's has `data-error="true"` (matching the existing pattern used in e2e tests — the test clicks `[data-error="true"]` to simulate always picking the *wrong* word... wait, reverse: tests click `[data-error="true"]` to verify the game detects it — see note below)

> **IMPORTANT — data-error attribute convention:** In existing games, `data-error="true"` marks the **correct answer** (the error/odd-one-out to find). Follow the same convention here: the **correctly spelled word** gets `data-error="true"`. The misspelled word gets `data-error="false"`. This allows the existing e2e helper `page.locator('[data-test="game-root"] [data-error="true"]')` to find and click the target, and the test to confirm the score reaches `10/10`.

**Feedback (per round):**
- Correct pick: card border pulses green, ✅ icon appears, brief "Nice!" / "You got it!" message (vary it)
- Wrong pick: card shakes red, ❌ icon, misspelled word highlighted with letters that differ marked in a different color, "Let's look at the difference!" message
- Auto-advance after 1200ms on correct, 2000ms on wrong (give more time to absorb feedback)

**Hint system (Easy level only):**
- A "Need a hint? 💡" button below the words
- On click, the misspelled word's incorrect letter(s) get visually highlighted (different background color on the character span)
- Hint usage is tracked; if >3 hints used in a session, a gentle "You're getting better! Try without hints next time 💪" message appears on the done screen
- `data-test="hint-btn"` on the button

**Soft timer (Medium and Hard):**
- Displayed as a horizontal progress bar that drains from full to empty over the time limit
- `data-test="timer-bar"` on the element, `data-elapsed` attribute updated with elapsed seconds
- When timer runs out: show the correct answer highlighted, auto-advance after 2s, count as incorrect
- Timer resets on each question

### Done Screen

After all 10 questions, show:
- Emoji trophy scaled to score (🏅 < 5, 🥉 5–6, 🥈 7–8, 🥇 9, 🏆 10)
- Score: "You got X out of 10!"
- Stars earned: one ⭐ per correct answer displayed with staggered pop-in animation
- If Easy: "Ready to try Medium? 🚀" button that re-launches game at Medium level
- If Medium: "Challenge yourself on Hard! 🔥" button
- If Hard with 10/10: "Perfect score on Hard! You're a Spelling Detective! 🔍🏆"
- "Play again" button resets to level select
- `data-test="done-screen"` on the container
- `core.saveSession()` called with `{ id, gameId: 'spelling-detective', startedAt, completedAt, score }`
- `core.awardPoints(score)` called

---

## Step 4 — Accessibility Requirements

These are non-negotiable for the Lola's Learning platform:

1. **Font**: Use OpenDyslexic via Google Fonts or CDN import. Fallback stack: `"OpenDyslexic", "Lexie Readable", "Comic Sans MS", cursive`
2. **Contrast**: All text must meet WCAG AA minimum 4.5:1 contrast ratio
3. **Touch targets**: All interactive elements minimum 44×44px (prefer 100×80px for word buttons)
4. **ARIA**:
   - `role="status"` + `aria-live="polite"` on the feedback message element
   - `aria-label` on each word button: `"Word option: said"` / `"Word option: siad"`
   - `aria-pressed` on selected card (before feedback resolves)
   - Level select buttons: `aria-label="Easy level: short words, swap two letters"`
5. **Keyboard**: Full game playable via Tab + Enter/Space
6. **No motion required**: Animations must respect `prefers-reduced-motion` — use a CSS media query to disable all transitions/keyframes when set
7. **Session length**: Default 10 questions. Consider that 5–7 minutes is the target session length; 10 questions at ~15s each = ~2.5 min, appropriate.

---

## Step 5 — Unit Tests (`src/__tests__/generator.test.ts`)

Replace the scaffolded test with comprehensive coverage:

```ts
describe('makeWordRound', () => {
  it('returns requested count for each level', ...)
  it('is deterministic with same seed', ...)
  it('misspelling always differs from correct word', ...)
  it('easy level uses only transposition errors', ...)
  it('medium level uses transposition and omission only', ...)
  it('hard level may use all error types', ...)
  it('generated misspelling has same length ± 1 as correct word', ...)
  it('throws if count exceeds available word bank size', ...)
})
```

---

## Step 6 — E2E Tests (`tests/e2e/spelling-detective-load.spec.ts`)

Replace the scaffolded stub with:

```ts
// Test 1: Easy level — load and complete a perfect run
test('Spelling Detective Easy: load, select level, complete full run', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });

  // Select easy level
  await page.getByTestId('level-btn-easy').click();

  // Play 10 rounds clicking the correct word each time
  for (let i = 0; i < 10; i++) {
    const correctBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(correctBtn).toBeVisible();
    await correctBtn.click();
    await page.waitForTimeout(1300); // wait for auto-advance
  }

  await expect(page.getByTestId('done-screen')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/You got 10 out of 10/)).toBeVisible();
});

// Test 2: Medium level — timer bar is visible
test('Spelling Detective Medium: timer bar is visible', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-medium').click();
  await expect(page.getByTestId('timer-bar')).toBeVisible();
});

// Test 3: Hard level — hint button absent
test('Spelling Detective Hard: no hint button', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-hard').click();
  await expect(page.getByTestId('hint-btn')).not.toBeVisible();
});

// Test 4: Wrong answer shows difference highlight
test('Spelling Detective: wrong answer shows error highlight', async ({ page }) => {
  await page.goto('/#/');
  await page.getByTestId('link-spelling-detective').click();
  await expect(page.getByTestId('game-root')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('level-btn-easy').click();
  // Click the wrong word
  const wrongBtn = page.locator('[data-test="game-root"] [data-error="false"]').first();
  await wrongBtn.click();
  await expect(page.getByTestId('feedback-message')).toContainText(/difference/i);
});
```

---

## Step 7 — Shell Integration Verification

After implementation, verify:

1. `HomeView.vue` shows a "Spelling Detective" link with `data-test="link-spelling-detective"`
2. Shell router has route `/game/spelling-detective`
3. `GameSpellingDetective.vue` uses `useRemotePlugin` with specs:
   ```ts
   specs: ['spelling_detective/Game', 'http://localhost:5178/src/Game.ts']
   ```
4. `tools/mf.manifest.json` includes the new entry
5. `playwright.config.ts` has webServer entry for port 5178

---

## Step 8 — Styling Guidelines

The game should feel like the rest of Lola's Learning but with its own visual identity:

- **Color palette**: Warm yellows and soft greens as primary (distinct from the blue/pink of Number/Letter Detective)
- **Background**: Soft paper-like texture effect using CSS (`background: #fffdf4` with subtle noise or grain)
- **Word cards**: Rounded corners (24px), thick border (3–4px), large drop shadow, white fill
- **Correct feedback color**: `#4cde80` (green) — same as established in the prototype
- **Wrong feedback color**: `#ff6b8a` (red-pink) — same as prototype
- **Level select**: Easy = green palette, Medium = yellow/amber, Hard = coral/red
- **Tailwind classes**: Use existing `lolaPink`, `lolaBlue`, `lolaGreen`, `lolaYellow`, `lolaPurple` color tokens from `tailwind.config.cjs`
- **No external CSS files**: All styles inline or via Tailwind utility classes applied through DOM element `.className`

---

## Step 9 — Core SDK Registration (Optional Enhancement)

If time permits, register a printable worksheet:

```ts
core.registerPrintable({
  id: 'spelling-detective-wordlist',
  title: 'Spelling Detective Word List',
  makePdf: () => new Blob([generateWordListText(level)], { type: 'application/pdf' }),
});
```

This will auto-appear in the Print Center.

---

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| 1 | Game loads as a remote microfrontend from port 5178 |
| 2 | Level select screen shows 3 levels with correct `data-test` attributes |
| 3 | Easy: only transposition misspellings, hint button present, no timer |
| 4 | Medium: transposition + omission misspellings, soft timer visible, no hint |
| 5 | Hard: all misspelling types, faster timer, no hint, smaller font |
| 6 | `data-error="true"` on the correctly spelled word button |
| 7 | Correct answer: green feedback, 1200ms auto-advance |
| 8 | Wrong answer: red shake, letter-diff highlight, 2000ms auto-advance |
| 9 | Done screen shows score, stars, level-up prompt |
| 10 | `core.saveSession()` called on completion with correct score |
| 11 | `core.awardPoints()` called on completion |
| 12 | All unit tests pass (`pnpm test`) |
| 13 | All e2e tests pass (`pnpm e2e`) |
| 14 | OpenDyslexic font applied to word display |
| 15 | `prefers-reduced-motion` respected |
| 16 | Keyboard navigable (Tab + Enter/Space) |
| 17 | ARIA roles on status, buttons, and live regions |

---

## File Checklist

```
apps/games/spelling-detective/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── Game.ts            ← main game mount logic
    ├── generator.ts       ← makeWordRound() + misspelling engine
    ├── words.ts           ← word banks by level
    └── __tests__/
        └── generator.test.ts

apps/shell/src/
├── views/
│   └── GameSpellingDetective.vue
└── router/index.ts        ← /game/spelling-detective route added

tests/e2e/
└── spelling-detective-load.spec.ts

tools/
└── mf.manifest.json       ← spelling-detective entry added
```
