export type ErrorType = 'missing' | 'double' | 'order';

export type NumberLine = {
  items: number[];
  errorIndex: number; // index in items where error manifests
  type: ErrorType;
};

export type MakeNumberLinesOptions = {
  lines?: number;
  lineLength?: number;
  // deterministic seed to make tests stable
  seed?: number;
};

// Simple xorshift32 PRNG for deterministic but lightweight randomness
function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    // keep in uint32 space
    s >>>= 0;
    return s / 0xffffffff;
  };
  return { next };
}

/**
 * Create number lines with exactly one error per line.
 * - Base sequence is strictly ascending by 1 (e.g., 7,8,9,10,11,12)
 * - Error types:
 *   - missing: one value is skipped, creating a jump (+2), the shown list still has lineLength items
 *   - double: one value is duplicated, creating a repeat at errorIndex (followed by a +2)
 *   - order: two adjacent values are swapped at errorIndex and errorIndex+1 (yields -1 then +2)
 */
export function makeNumberLines(
  range: [number, number],
  opts: MakeNumberLinesOptions = {},
): NumberLine[] {
  const { lines = 10, lineLength = 6, seed = 42 } = opts;
  const [start, end] = range;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new Error('range must be finite numbers');
  }
  if (start >= end) {
    throw new Error('range must be [min,max] with min < max');
  }
  if (!Number.isInteger(lines) || lines <= 0) {
    throw new Error('lines must be a positive integer');
  }
  if (!Number.isInteger(lineLength) || lineLength < 3) {
    throw new Error('lineLength must be an integer >= 3');
  }
  const span = end - start + 1;
  if (span < lineLength + 2) {
    // need some slack to embed errors safely
    throw new Error('range too small for requested lineLength');
  }

  const rng = makeRng(seed);
  const errorCycle: ErrorType[] = ['missing', 'double', 'order'];

  const linesOut: NumberLine[] = [];
  for (let i = 0; i < lines; i++) {
    // choose a baseStart ensuring the sequence fits inside range with room for missing/order edits
    const safeMaxStart = end - lineLength + 1;
    const baseStart = start + Math.floor(rng.next() * (safeMaxStart - start + 1));

    // base strictly ascending sequence of length lineLength
    const base: number[] = Array.from({ length: lineLength }, (_, k) => baseStart + k);

    // pick error type and index
    const type = errorCycle[i % errorCycle.length];
    let errorIndex = Math.floor(rng.next() * (lineLength - 1));

    // Choose safer interior index for 'double' and fixed edge for 'order' to ensure expected patterns
    if (type === 'double') {
      const min = 1;
      const max = Math.max(min, lineLength - 3);
      errorIndex = min + Math.floor(rng.next() * (max - min + 1));
    } else if (type === 'order') {
      errorIndex = 0; // yields diffs [-1, +2, 1, ...]
    }

    if (type === 'missing') {
      // introduce a single +2 jump at errorIndex between items[errorIndex] and items[errorIndex+1]
      // Implement by incrementing all items after errorIndex by +1
      for (let k = errorIndex + 1; k < base.length; k++) base[k] += 1;
    } else if (type === 'double') {
      // duplicate the value at errorIndex by setting items[errorIndex+1] equal to items[errorIndex]
      base[errorIndex + 1] = base[errorIndex];
    } else {
      // order: swap adjacent values at errorIndex and errorIndex+1
      const tmp = base[errorIndex];
      base[errorIndex] = base[errorIndex + 1];
      base[errorIndex + 1] = tmp;
    }

    linesOut.push({ items: base, errorIndex, type });
  }
  return linesOut;
}
