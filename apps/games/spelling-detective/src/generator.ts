import { DifficultyLevel, MisspellType, WordEntry, getWordsForLevel } from './words';

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

// Visual similarity or keyboard proximity replacements for substitution errors
const substitutions: Record<string, string[]> = {
  a: ['e', 'o'],
  e: ['a', 'i'],
  i: ['e', 'j'],
  o: ['a', 'u'],
  u: ['o', 'v'],
  b: ['d', 'p', 'q'],
  d: ['b', 'p', 'q'],
  p: ['q', 'b', 'd'],
  q: ['p', 'b', 'd'],
  m: ['n', 'w'],
  n: ['m', 'h'],
  w: ['v', 'm'],
  v: ['w', 'u'],
  c: ['s', 'k'],
  s: ['c', 'z'],
};

function generateMisspelling(
  word: string,
  allowedTypes: MisspellType[],
  rng: ReturnType<typeof makeRng>,
): { misspelling: string; errorType: MisspellType } {
  // Try up to 10 times to get a distinct misspelled word
  for (let attempt = 0; attempt < 10; attempt++) {
    const type = allowedTypes[Math.floor(rng.next() * allowedTypes.length)];
    let result = word;

    if (type === 'transposition' && word.length > 1) {
      const idx = Math.floor(rng.next() * (word.length - 1));
      result = word.slice(0, idx) + word[idx + 1] + word[idx] + word.slice(idx + 2);
    } else if (type === 'omission' && word.length > 2) {
      // Avoid dropping the first letter to keep the word shape somewhat similar
      const idx = 1 + Math.floor(rng.next() * (word.length - 1));
      result = word.slice(0, idx) + word.slice(idx + 1);
    } else if (type === 'substitution') {
      // Find indices of characters that have specific visual similarity substitutions
      const specificOpts = [];
      const genericOpts = [];
      for (let i = 0; i < word.length; i++) {
        if (substitutions[word[i]]) specificOpts.push(i);
        else genericOpts.push(i);
      }

      // Prefer substituting letters with known confusions (e.g. b/d) if available
      const candidates =
        specificOpts.length > 0 && rng.next() > 0.3
          ? specificOpts
          : genericOpts.length > 0
            ? genericOpts
            : [0];
      const idx = candidates[Math.floor(rng.next() * candidates.length)];
      const char = word[idx];

      if (substitutions[char]) {
        const subs = substitutions[char];
        const subChar = subs[Math.floor(rng.next() * subs.length)];
        result = word.slice(0, idx) + subChar + word.slice(idx + 1);
      } else {
        // generic substitution if no Specific mappings
        const generic = ['e', 'a', 'o', 's', 't', 'r'];
        const subChar = generic[Math.floor(rng.next() * generic.length)];
        result = word.slice(0, idx) + subChar + word.slice(idx + 1);
      }
    } else if (type === 'doubling' && word.length > 2) {
      const idx = 1 + Math.floor(rng.next() * (word.length - 1));
      result = word.slice(0, idx) + word[idx] + word.slice(idx);
    } else if (type === 'insertion') {
      const idx = 1 + Math.floor(rng.next() * (word.length - 1));
      const charToInsert = word[Math.max(0, idx - 1)]; // Duplicate a nearby char
      result = word.slice(0, idx) + charToInsert + word.slice(idx);
    }

    if (result !== word && result.length > 0) {
      return { misspelling: result, errorType: type };
    }
  }

  // Fallback if all 10 attempts failed to alter the word (e.g. 2-letter word transposition like "oo" fails)
  // Force an insertion for very short words that couldn't be transposed
  const ext = 's';
  return { misspelling: word + ext, errorType: 'insertion' };
}

export function makeWordRound(
  level: DifficultyLevel,
  opts: { count?: number; seed?: number } = {},
): WordEntry[] {
  const { count = 10, seed = 42 } = opts;
  const rng = makeRng(seed);
  const words = getWordsForLevel(level);

  if (count > words.length) {
    throw new Error('count exceeds available word bank size');
  }

  let allowedTypes: MisspellType[];
  if (level === 'easy') {
    allowedTypes = ['transposition', 'omission', 'insertion']; // Note: omissions/insertions used as fallback for 2-letter words in generateMisspelling
  } else if (level === 'medium') {
    allowedTypes = ['transposition', 'omission'];
  } else if (level === 'dyslexia') {
    allowedTypes = ['substitution', 'transposition'];
  } else {
    allowedTypes = ['transposition', 'omission', 'substitution', 'doubling', 'insertion'];
  }

  // Shuffle the word list
  const shuffledWords = [...words];
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    const temp = shuffledWords[i];
    shuffledWords[i] = shuffledWords[j];
    shuffledWords[j] = temp;
  }

  const selectedWords = shuffledWords.slice(0, count);

  return selectedWords.map((correct) => {
    // For easy level, try to stick to transposition unless it's impossible (length < 3)
    let types = allowedTypes;
    if (level === 'easy') {
      types = correct.length <= 2 ? ['omission', 'insertion'] : ['transposition'];
    }

    const { misspelling, errorType } = generateMisspelling(correct, types, rng);

    return {
      correct,
      misspelling,
      errorType,
    };
  });
}
