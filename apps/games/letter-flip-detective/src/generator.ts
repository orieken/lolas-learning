export type LetterPair = 'bd' | 'pq' | 'mw' | 'nu';

export type FlipLine = {
  items: string[];
  errorIndex: number;
  pair: LetterPair;
  dominant: string; // the "correct" letter filling most slots
  sneaky: string; // the odd one out
};

export type MakeFlipLinesOptions = {
  lines?: number;
  lineLength?: number;
  seed?: number;
  pairs?: LetterPair[]; // which confusion pairs to include
};

// Letter pair definitions with hints
export const LETTER_PAIRS: Record<LetterPair, { letters: [string, string]; hint: string }> = {
  bd: {
    letters: ['b', 'd'],
    hint: '"b" has its belly on the right, "d" has its belly on the left',
  },
  pq: {
    letters: ['p', 'q'],
    hint: '"p" points up like a pole, "q" has a tail going down',
  },
  mw: {
    letters: ['m', 'w'],
    hint: '"m" has mountains pointing up, "w" has waves pointing down',
  },
  nu: {
    letters: ['n', 'u'],
    hint: '"n" has a hump on top, "u" is a cup that holds water',
  },
};

// Simple xorshift32 PRNG for deterministic randomness
function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0xffffffff;
  };
  return { next };
}

/**
 * Generate lines for Letter Flip Detective game.
 * Each line has one "sneaky" letter that doesn't match the others.
 */
export function makeFlipLines(opts: MakeFlipLinesOptions = {}): FlipLine[] {
  const { lines = 10, lineLength = 6, seed = 42, pairs = ['bd', 'pq', 'mw', 'nu'] } = opts;

  if (!Number.isInteger(lines) || lines <= 0) {
    throw new Error('lines must be a positive integer');
  }
  if (!Number.isInteger(lineLength) || lineLength < 3) {
    throw new Error('lineLength must be an integer >= 3');
  }
  if (!pairs.length) {
    throw new Error('pairs must contain at least one letter pair');
  }

  const rng = makeRng(seed);
  const output: FlipLine[] = [];

  for (let i = 0; i < lines; i++) {
    // Pick a letter pair for this line
    const pairKey = pairs[i % pairs.length];
    const pairDef = LETTER_PAIRS[pairKey];
    const [letter1, letter2] = pairDef.letters;

    // Randomly choose which letter is dominant (fills most slots)
    const dominantIdx = rng.next() < 0.5 ? 0 : 1;
    const dominant = dominantIdx === 0 ? letter1 : letter2;
    const sneaky = dominantIdx === 0 ? letter2 : letter1;

    // Fill the line with dominant letters
    const items: string[] = Array(lineLength).fill(dominant);

    // Place the sneaky letter at a random position
    const errorIndex = Math.floor(rng.next() * lineLength);
    items[errorIndex] = sneaky;

    output.push({
      items,
      errorIndex,
      pair: pairKey,
      dominant,
      sneaky,
    });
  }

  return output;
}

/**
 * Get the hint for a specific letter pair
 */
export function getHintForPair(pair: LetterPair): string {
  return LETTER_PAIRS[pair]?.hint ?? '';
}

/**
 * Get the phoneme sound for a letter (for audio)
 */
export function getPhonemeForLetter(letter: string): string {
  const phonemes: Record<string, string> = {
    b: '/b/ as in ball',
    d: '/d/ as in dog',
    p: '/p/ as in pig',
    q: '/kw/ as in queen',
    m: '/m/ as in mom',
    w: '/w/ as in water',
    n: '/n/ as in nose',
    u: '/uh/ as in umbrella',
  };
  return phonemes[letter.toLowerCase()] ?? letter;
}
