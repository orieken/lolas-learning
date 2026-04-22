export type MathQuestion = {
  expression: string;
  correctAnswer: number;
  options: number[];
};

export const getNumberRangeForLevel = (level: number): [number, number] => {
  if (level <= 4) return [1, 10];
  if (level <= 9) return [1, 15];
  return [1, 20];
};

export const generateQuestion = (level: number): MathQuestion => {
  const [min, max] = getNumberRangeForLevel(level);
  const isAddition = Math.random() > 0.5;

  let a = Math.floor(Math.random() * (max - min + 1)) + min;
  let b = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!isAddition && a < b) {
    // Ensure positive results for subtraction
    const temp = a;
    a = b;
    b = temp;
  }

  const correctAnswer = isAddition ? a + b : a - b;
  const operator = isAddition ? '+' : '-';
  const expression = `${a} ${operator} ${b} = ?`;

  // Generate plausible options (±3)
  const optionsSet = new Set<number>();
  optionsSet.add(correctAnswer);

  while (optionsSet.size < 4) {
    const variance = Math.floor(Math.random() * 7) - 3; // -3 to +3
    if (variance === 0) continue;

    // Ensure we don't generate negative options if we only want positive numbers
    // But since it's addition/subtraction of 1-20, max correct answer is 40.
    const wrongAnswer = correctAnswer + variance;
    if (wrongAnswer >= 0) {
      optionsSet.add(wrongAnswer);
    }
  }

  // Shuffle options
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return { expression, correctAnswer, options };
};

export const calculateScore = (streak: number): number => {
  const base = 10;
  if (streak >= 6) return base * 2;
  if (streak >= 3) return Math.floor(base * 1.5);
  return base;
};

export const calculateNextTimer = (
  currentTimer: number,
  isCorrect: boolean,
  consecutiveCorrect: number,
  consecutiveWrong: number,
): number => {
  let newTimer = currentTimer;
  if (isCorrect && consecutiveCorrect > 0 && consecutiveCorrect % 3 === 0) {
    newTimer -= 0.5;
  } else if (!isCorrect && consecutiveWrong > 0 && consecutiveWrong % 2 === 0) {
    newTimer += 0.5;
  }
  return Math.min(Math.max(newTimer, 4), 12); // Clamped between 4s and 12s
};
