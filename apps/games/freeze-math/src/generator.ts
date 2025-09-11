export type Line = { items: number[]; errorIndex: number };

export function makeLines(range: [number, number], opts: { lines: number; seed?: number }): Line[] {
  const [min, max] = range;
  const rnd = mulberry32(opts.seed ?? 1);
  const out: Line[] = [];
  for (let i = 0; i < opts.lines; i++) {
    const base = Math.floor(rnd() * (max - min - 6)) + min;
    const arr = Array.from({ length: 6 }, (_, j) => base + j * 2);
    const errIdx = Math.floor(rnd() * 6);
    arr[errIdx] = arr[errIdx] + 1; // make it odd one out
    out.push({ items: arr, errorIndex: errIdx });
  }
  return out;
}

// --- New arithmetic facts generator (P-10) ---
export type Fact = { a: number; b: number; op: '+' | '-'; answer: number };

export function makeFacts(count: number, opts: { seed?: number; max?: number } = {}): Fact[] {
  const max = opts.max ?? 10; // limit sums to <= max and minuends within max
  const rnd = mulberry32(opts.seed ?? 1);
  const facts: Fact[] = [];
  for (let i = 0; i < count; i++) {
    const useAdd = i % 2 === 0; // alternate for even distribution (+/- difference <=1)
    if (useAdd) {
      // a + b <= max
      const a = Math.floor(rnd() * (max + 1));
      const b = Math.floor(rnd() * (max - a + 1));
      facts.push({ a, b, op: '+', answer: a + b });
    } else {
      // a - b >= 0
      const a = Math.floor(rnd() * (max + 1));
      const b = Math.floor(rnd() * (a + 1));
      facts.push({ a, b, op: '-', answer: a - b });
    }
  }
  return facts;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
