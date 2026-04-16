export interface GameCheck {
  id: string;
  name: string;
  path: string;
  icon: string;
  color: string;
  description: string;
  bgGradient: string;
}

export const games: GameCheck[] = [
  {
    id: 'freeze-math',
    name: 'Freeze Math',
    path: '/game/freeze-math',
    icon: '❄️',
    color: 'text-lolaBlue',
    description: 'Stop the monsters with math!',
    bgGradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'number-detective',
    name: 'Number Detective',
    path: '/game/number-detective',
    icon: '🔢',
    color: 'text-lolaGreen',
    description: 'Find the missing numbers!',
    bgGradient: 'from-green-400 to-teal-500',
  },
  {
    id: 'letter-detective',
    name: 'Letter Detective',
    path: '/game/letter-detective',
    icon: '📝',
    color: 'text-lolaPink',
    description: 'Hunt for hidden letters!',
    bgGradient: 'from-pink-400 to-rose-500',
  },
  {
    id: 'word-detective',
    name: 'Word Detective',
    path: '/game/word-detective',
    icon: '📖',
    color: 'text-lolaYellow',
    description: 'Build words and solve puzzles!',
    bgGradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'letter-flip-detective',
    name: 'Letter Flip',
    path: '/game/letter-flip-detective',
    icon: '🔠',
    color: 'text-lolaPurple',
    description: 'Find the tricky backwards letters!',
    bgGradient: 'from-purple-400 to-violet-600',
  },
  {
    id: 'spelling-detective',
    name: 'Spelling Detective',
    path: '/game/spelling-detective',
    icon: '🔍',
    color: 'text-lolaBlue',
    description: 'Find the correctly spelled word!',
    bgGradient: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'math-blast',
    name: 'MathBlast',
    path: '/game/math-blast',
    icon: '🚀',
    color: 'text-lolaPurple',
    description: 'A Space Math Adventure!',
    bgGradient: 'from-fuchsia-600 to-indigo-800',
  },
];
