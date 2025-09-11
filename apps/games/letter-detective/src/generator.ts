export type ErrorType = 'missing' | 'double' | 'order';
export type LetterLine = { items: string[]; errorIndex: number; type: ErrorType };

export type MakeLetterLinesOptions = { lines?: number; lineLength?: number; seed?: number };

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

export function makeLetterLines(opts: MakeLetterLinesOptions = {}): LetterLine[] {
  const { lines = 10, lineLength = 6, seed = 1234 } = opts;
  if (!Number.isInteger(lines) || lines <= 0) throw new Error('lines must be positive int');
  if (!Number.isInteger(lineLength) || lineLength < 3) throw new Error('lineLength must be >=3');
  const rng = makeRng(seed);
  const aCode = 'a'.charCodeAt(0);
  const zCode = 'z'.charCodeAt(0);
  const maxStart = zCode - aCode - (lineLength - 1);
  if (maxStart < 0) throw new Error('lineLength too large for alphabet');
  const types: ErrorType[] = ['missing', 'double', 'order'];

  const out: LetterLine[] = [];
  for (let i = 0; i < lines; i++) {
    const startOffset = Math.floor(rng.next() * (maxStart + 1));
    const base: string[] = Array.from({ length: lineLength }, (_, k) =>
      String.fromCharCode(aCode + startOffset + k),
    );
    const type = types[i % types.length];
    let errorIndex = Math.floor(rng.next() * (lineLength - 1));
    if (type === 'double') {
      // keep interior to ensure two-step visibility without boundary anomalies
      const min = 1;
      const max = Math.max(min, lineLength - 3);
      errorIndex = min + Math.floor(rng.next() * (max - min + 1));
    } else if (type === 'order') {
      // put swap at start to yield diffs [-1, +2, 1, ...] (exactly one +2)
      errorIndex = 0;
    }

    if (type === 'missing') {
      // skip one letter after errorIndex
      for (let k = errorIndex + 1; k < base.length; k++) {
        const code = base[k].charCodeAt(0) + 1;
        base[k] = String.fromCharCode(code);
      }
    } else if (type === 'double') {
      base[errorIndex + 1] = base[errorIndex];
    } else {
      const tmp = base[errorIndex];
      base[errorIndex] = base[errorIndex + 1];
      base[errorIndex + 1] = tmp;
    }
    out.push({ items: base, errorIndex, type });
  }
  return out;
}
