# Lola's Learning: Dyslexia-Friendly Spelling Games

## Development Plan & TODO List

---

## 📋 Game Status Overview

| Game | Status | Priority | Worksheet | Digital |
|------|--------|----------|-----------|---------|
| Letter Flip Detective | 🟡 Scaffolded | P1 - High | ✅ Done | 🟡 Code exists, needs testing |
| Word Builder | 📝 Concept | P2 - High | ✅ Done | ❌ Not started |
| Sound Detective | 📝 Concept | P3 - Medium | ✅ Done | ❌ Not started |
| Syllable Stomp | 📝 Concept | P4 - Medium | ✅ Done | ❌ Not started |
| Rhyme Time Detective | 📝 Concept | P5 - Medium | ✅ Done | ❌ Not started |
| Spelling Shadows | 📝 Concept | P6 - Low | ❌ Not done | ❌ Not started |

---

## 🎮 Game 1: Letter Flip Detective

### Status: 🟡 SCAFFOLDED (needs integration testing)

### Concept
Find the "sneaky" letter that doesn't belong in a row. Targets common dyslexia confusion pairs: b/d, p/q, m/w, n/u.

### Learning Goals
- Distinguish commonly confused letter pairs
- Build automatic letter recognition
- Reduce reversal errors through targeted practice

### Gameplay
- 10 rounds per session (5-6 minutes)
- Row of 6 letters with one "odd one out"
- Tap the different letter to advance
- Hints appear after 2 wrong attempts
- Audio feedback for each interaction

### Multisensory Features
- 👁️ OpenDyslexic font, large letters, color-coded feedback
- 🔊 Letters speak their sound, celebration/retry audio
- 👆 Tap interaction, flip animation, shake on wrong

### Files Created
```
apps/games/letter-flip-detective/
├── src/
│   ├── Game.ts           ✅ Main game with UI
│   ├── generator.ts      ✅ Letter pair generator
│   ├── audio.ts          ✅ Web Speech API audio
│   ├── index.ts          ✅ Export
│   └── __tests__/
│       └── generator.test.ts  ✅ Unit tests
├── package.json          ✅
├── tsconfig.json         ✅
├── vite.config.ts        ✅ (port 5178)
└── index.html            ✅

apps/shell/src/views/GameLetterFlipDetective.vue  ✅
apps/shell/src/router/index.ts                    ✅ Updated
apps/shell/src/views/HomeView.vue                 ✅ Updated
apps/shell/vite.config.ts                         ✅ Updated
tools/mf.manifest.json                            ✅ Updated
playwright.config.ts                              ✅ Updated
tests/e2e/letter-flip-detective-load.spec.ts      ✅
```

### TODO
- [ ] Run `pnpm install` to add new package
- [ ] Test with `pnpm dev` or `pnpm mf start shell letter-flip-detective`
- [ ] Run unit tests: `pnpm test`
- [ ] Run e2e tests: `pnpm e2e`
- [ ] Test with actual child and gather feedback
- [ ] Adjust difficulty/timing based on feedback

---

## 🎮 Game 2: Word Builder

### Status: 📝 CONCEPT ONLY

### Concept
Drag letter tiles to build CVC (consonant-vowel-consonant) words. Picture provides context, letters are color-coded (vowels vs consonants).

### Learning Goals
- Practice spelling simple CVC words
- Reinforce letter-sound connections
- Build phonemic awareness through segmentation

### Gameplay
- Picture appears (e.g., cat)
- Letter tiles available at bottom
- Drag tiles into slots to spell the word
- Each tile speaks its sound when touched
- Completed word is read aloud
- 8-10 words per session (5-7 minutes)

### Multisensory Features
- 👁️ Picture context, color-coded vowels (blue) vs consonants (green)
- 🔊 Letters speak phoneme sounds, word read aloud on completion
- 👆 Drag-and-drop interaction

### Word Lists (Progressive)
```
Level 1 (CVC):
cat, dog, sun, hat, bed, pig, cup, bug, rat, pen

Level 2 (4-letter):
frog, fish, ship, duck, lamp, hand, jump, nest

Level 3 (blends):
stop, clap, trip, flag, swim, snug
```

### Technical Notes
- New interaction pattern (drag-drop) vs existing tap pattern
- Need picture assets or emoji fallback
- Consider HTML5 drag-drop or touch events for mobile

### Build Prompt
```
Build the Word Builder game for Lola's Learning.

Requirements:
1. Scaffold new game at apps/games/word-builder/ on port 5179
2. Create generator.ts with word lists (CVC words with picture hints)
3. Create Game.ts with:
   - Picture/emoji display at top
   - Empty letter slots in middle
   - Draggable letter tiles at bottom
   - Color coding: vowels blue, consonants green
   - Audio: Web Speech API for letter sounds and word reading
   - OpenDyslexic font
4. Wire into shell (view, route, home link, federation remote)
5. Add unit tests and e2e test
6. Session: 10 words, tracks score, saves session

Use existing patterns from letter-flip-detective for audio and styling.
```

---

## 🎮 Game 3: Sound Detective

### Status: 📝 CONCEPT ONLY

### Concept
Hear a phoneme sound, tap the letter that makes that sound. Strengthens phonemic awareness and letter-sound mapping.

### Learning Goals
- Connect phonemes to graphemes
- Distinguish similar sounds
- Build automatic sound-letter recall

### Gameplay
- Audio plays a phoneme (e.g., "/b/ as in ball")
- 4 letter choices appear
- Tap the correct letter
- Progresses from single sounds to blends
- 10 rounds per session (5 minutes)

### Multisensory Features
- 👁️ Large letters, visual feedback on selection
- 🔊 Phoneme audio (primary), letter confirmation
- 👆 Tap to select

### Sound Progressions
```
Level 1 (Single consonants):
/b/, /d/, /p/, /m/, /n/, /s/, /t/, /f/

Level 2 (Easily confused):
/b/ vs /d/, /p/ vs /b/, /m/ vs /n/

Level 3 (Blends):
/sh/, /ch/, /th/, /wh/
```

### Build Prompt
```
Build the Sound Detective game for Lola's Learning.

Requirements:
1. Scaffold new game at apps/games/sound-detective/ on port 5180
2. Create generator.ts with phoneme-letter mappings and distractors
3. Create Game.ts with:
   - Audio instruction: "Find the letter that says /b/"
   - 4 letter choices in grid
   - Replay sound button
   - Visual feedback (correct = green glow, wrong = shake)
   - Progress through 10 sounds per session
4. Audio: Use Web Speech API to synthesize phoneme sounds
   - Speak phoneme like "buh" not letter name "bee"
5. OpenDyslexic font, large touch targets
6. Wire into shell, add tests

Reference letter-flip-detective for audio patterns.
```

---

## 🎮 Game 4: Syllable Stomp

### Status: 📝 CONCEPT ONLY

### Concept
Word appears with picture. Child taps a button once per syllable (like clapping). Word visually splits to show syllable breaks.

### Learning Goals
- Develop phonological awareness
- Recognize syllable patterns
- Connect rhythm to word structure

### Gameplay
- Word + picture displayed
- "Tap for each beat!" instruction
- Child taps drum/button per syllable
- Word splits visually after correct count
- Celebration for correct, gentle retry for wrong
- 12 words per session (5 minutes)

### Multisensory Features
- 👁️ Word splits into colored syllable chunks
- 🔊 Drum/tap sound, word spoken with syllable emphasis
- 👆 Rhythmic tapping (kinesthetic)

### Word Lists
```
1 syllable: cat, dog, sun, hat, bed, fish
2 syllables: baby, tiger, monkey, happy, water, apple
3 syllables: elephant, butterfly, dinosaur, banana, computer, kangaroo
```

### Build Prompt
```
Build the Syllable Stomp game for Lola's Learning.

Requirements:
1. Scaffold new game at apps/games/syllable-stomp/ on port 5181
2. Create generator.ts with words and syllable counts
3. Create Game.ts with:
   - Word + emoji displayed large
   - Big "STOMP" button at bottom
   - Tap counter showing 1, 2, 3 dots
   - After tapping, prompt "Is that right? [1] [2] [3]"
   - Word visually splits: "el • e • phant"
   - Drum/stomp sound effect on each tap
4. Audio: Play word with syllable emphasis
5. Animation: Word splits with color per syllable
6. OpenDyslexic font, engaging colors
7. Wire into shell, add tests
```

---

## 🎮 Game 5: Rhyme Time Detective

### Status: 📝 CONCEPT ONLY

### Concept
Show 4-5 words from a rhyme family plus one that doesn't belong. Child finds the non-rhyming word.

### Learning Goals
- Recognize rhyming patterns
- Build word family awareness
- Develop phonological sensitivity

### Gameplay
- 5 words displayed (4 rhyme, 1 doesn't)
- Words read aloud on tap or auto-play
- Tap the odd one out
- Highlight rhyme family ending (-at, -ig, etc.)
- 10 rounds per session (5 minutes)

### Multisensory Features
- 👁️ Rhyme ending highlighted in color
- 🔊 Words read aloud, rhyme emphasized
- 👆 Tap to select

### Word Families
```
-at: cat, bat, hat, mat, sat, rat
-an: fan, man, pan, ran, tan, van
-it: fit, hit, kit, lit, pit, sit
-ot: cot, dot, hot, lot, pot, tot
-ig: big, dig, fig, pig, wig, jig
-en: hen, men, pen, ten, den, Ben
-ug: bug, dug, hug, mug, rug, tug
```

### Build Prompt
```
Build the Rhyme Time Detective game for Lola's Learning.

Requirements:
1. Scaffold new game at apps/games/rhyme-time-detective/ on port 5182
2. Create generator.ts with:
   - Word family definitions
   - Function to generate rows with one non-rhyming word
   - Pool of "odd" words that don't rhyme with any family
3. Create Game.ts with:
   - 5 word cards displayed
   - Auto-play each word on load (or tap to hear)
   - Rhyme ending highlighted (e.g., "-at" in blue)
   - Tap non-rhyming word to advance
   - Family name shown after correct answer
4. Can reuse mountOddOneOut from core-sdk with custom formatting
5. OpenDyslexic font, word cards with good spacing
6. Wire into shell, add tests
```

---

## 🎮 Game 6: Spelling Shadows

### Status: 📝 CONCEPT ONLY (lowest priority)

### Concept
High-frequency word appears briefly with audio. It fades to show only some letters (outline). Child fills in the missing letters from memory.

### Learning Goals
- Build sight word recognition
- Train visual memory
- Practice high-frequency words

### Gameplay
- Word appears for 3 seconds with audio
- Fades to show first/last letters only: "c _ t"
- Child taps letter choices to fill gaps
- Progressive: show more blanks as child improves
- 8-10 words per session (5-7 minutes)

### Multisensory Features
- 👁️ Brief visual exposure, fade animation
- 🔊 Word spoken, replay available
- 👆 Tap letters to fill blanks

### Word Lists (Dolch Sight Words)
```
Pre-primer: a, and, away, big, blue, can, come, down, find, for
Primer: all, am, are, at, ate, be, black, brown, but, came
First Grade: after, again, an, any, ask, as, by, could, every, fly
```

### Build Prompt
```
Build the Spelling Shadows game for Lola's Learning.

Requirements:
1. Scaffold new game at apps/games/spelling-shadows/ on port 5183
2. Create generator.ts with:
   - High-frequency word lists by level
   - Function to create masked words (show N letters, hide rest)
3. Create Game.ts with:
   - Full word displayed for 3 seconds
   - Fade animation to masked state
   - Letter choices at bottom (correct letters + distractors)
   - Slots to fill in blanks
   - Replay audio button
   - Progressive difficulty (fewer visible letters)
4. Audio: Word spoken clearly
5. Animation: Smooth fade effect
6. OpenDyslexic font
7. Wire into shell, add tests
```

---

## 🔧 Master TODO List

### Phase 1: Complete Letter Flip Detective
- [ ] Copy scaffolded files from Claude output to project
- [ ] Run `pnpm install`
- [ ] Test locally: `pnpm mf start shell letter-flip-detective`
- [ ] Run tests: `pnpm test` and `pnpm e2e`
- [ ] Print worksheets and test with child
- [ ] Note feedback and adjust

### Phase 2: Build Word Builder
- [ ] Scaffold game using mf-scaffold or manual
- [ ] Create generator with word lists
- [ ] Implement drag-drop interaction
- [ ] Add audio (letter sounds, word reading)
- [ ] Wire into shell
- [ ] Write tests
- [ ] Test with child

### Phase 3: Build Sound Detective
- [ ] Scaffold game
- [ ] Create phoneme-letter mappings
- [ ] Implement audio-first interaction
- [ ] Add letter choice grid
- [ ] Wire into shell
- [ ] Write tests
- [ ] Test with child

### Phase 4: Build Syllable Stomp
- [ ] Scaffold game
- [ ] Create word lists with syllable counts
- [ ] Implement tap-counting mechanic
- [ ] Add syllable splitting animation
- [ ] Wire into shell
- [ ] Write tests
- [ ] Test with child

### Phase 5: Build Rhyme Time Detective
- [ ] Scaffold game
- [ ] Create word family generator
- [ ] Potentially reuse mountOddOneOut
- [ ] Add rhyme highlighting
- [ ] Wire into shell
- [ ] Write tests
- [ ] Test with child

### Phase 6: Build Spelling Shadows (if needed)
- [ ] Scaffold game
- [ ] Create sight word lists
- [ ] Implement fade/reveal mechanic
- [ ] Add fill-in-blank interaction
- [ ] Wire into shell
- [ ] Write tests
- [ ] Test with child

### Shared Improvements
- [ ] Add global dyslexia-friendly font CSS to shell
- [ ] Create shared audio utility in core-sdk
- [ ] Add settings for font size / audio speed
- [ ] Implement progress tracking across games
- [ ] Add print center integration for each game

---

## 🛠️ Quick Commands

```bash
# Install dependencies
pnpm install

# Start development (shell + default games)
pnpm dev

# Start specific games
pnpm mf start shell letter-flip-detective
pnpm mf start shell word-builder

# Run all unit tests
pnpm test

# Run e2e tests
pnpm e2e

# Scaffold a new game interactively
pnpm mf:new

# List all available micro frontends
pnpm mf list
```

---

## 📁 Project Structure Reference

```
apps/
├── shell/                    # Main host app
│   └── src/
│       ├── views/            # Game view components
│       ├── router/           # Routes
│       └── stores/           # Pinia stores (sessions, rewards)
└── games/
    ├── letter-flip-detective/  # ✅ Scaffolded
    ├── word-builder/           # 📝 To build
    ├── sound-detective/        # 📝 To build
    ├── syllable-stomp/         # 📝 To build
    ├── rhyme-time-detective/   # 📝 To build
    └── spelling-shadows/       # 📝 To build

packages/
└── core-sdk/                 # Shared types, mountOddOneOut helper

tests/e2e/                    # Playwright tests
tools/                        # mf.mjs, mf-scaffold.mjs
```

---

## 🎯 Success Metrics

For each game, track:
- Completion rate (% of sessions finished)
- Accuracy (% correct on first try)
- Time per round (engagement indicator)
- Replay rate (do they want to play again?)

Signs of success:
- Child asks to play again
- Reduced letter reversals in writing
- Increased confidence with spelling
- Shorter time to recognize patterns

---

## 📝 Notes from Testing

*(Add notes here after testing worksheets with child)*

**Letter Flip Detective:**
- 

**Word Builder:**
- 

**Syllable Stomp:**
- 

**Rhyme Time:**
- 

**Sound Detective:**
- 

