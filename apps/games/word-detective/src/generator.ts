export type WordLine = { items: string[]; oddIndex: number; rhyme: string };
export type MakeWordSetsOptions = { lines?: number; seed?: number };

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

const CVC: Record<string, string[]> = {
  at: ['cat', 'bat', 'hat', 'mat', 'sat', 'rat'],
  an: ['fan', 'man', 'pan', 'ran', 'tan', 'van'],
  it: ['fit', 'hit', 'kit', 'lit', 'pit', 'sit'],
  ot: ['cot', 'dot', 'hot', 'lot', 'pot', 'tot'],
};

const ODD_POOL = ['tree', 'book', 'sun', 'desk', 'shoe', 'lake', 'bird'];

export function makeWordSets(opts: MakeWordSetsOptions = {}): WordLine[] {
  const { lines = 10, seed = 2024 } = opts;
  if (!Number.isInteger(lines) || lines <= 0) throw new Error('lines must be positive int');
  const rng = makeRng(seed);
  const rhymes = Object.keys(CVC);

  const out: WordLine[] = [];
  for (let i = 0; i < lines; i++) {
    const rhyme = rhymes[Math.floor(rng.next() * rhymes.length)];
    const pool = CVC[rhyme];
    // pick 5 rhyme words + 1 odd
    const items = [...pool].sort(() => rng.next() - 0.5).slice(0, 5);
    const odd = ODD_POOL[Math.floor(rng.next() * ODD_POOL.length)];
    // insert odd at a random position
    const oddIndex = Math.floor(rng.next() * 6);
    items.splice(oddIndex, 0, odd);
    out.push({ items, oddIndex, rhyme });
  }
  return out;
}

