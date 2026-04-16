# Adaptive Learning System Design

## Gamification & AI-Powered Difficulty Scaling

### Vision
Create an intelligent learning system that adapts to each child's unique needs, using research-based word lists (DIBELS, Dolch, Fry) and machine learning to optimize difficulty, pacing, and content selection.

---

## 🎯 Core Principles

### 1. Mastery-Based Progression
- Don't advance until the child demonstrates mastery (80%+ accuracy)
- Allow natural regression and re-practice without shame
- Celebrate small wins frequently

### 2. Spaced Repetition
- Words the child struggles with appear more often
- Mastered words appear less frequently but still cycle back
- Optimal review intervals based on forgetting curve

### 3. Multi-Modal Assessment
- Track accuracy, response time, retry count, and patterns
- Identify specific confusion types (b/d vs m/w vs phonetic)
- Adapt game selection based on weakness areas

### 4. Research-Based Content
- Use established word lists (DIBELS, Dolch, Fry)
- Align with grade-level expectations
- Progress through phonics patterns systematically

---

## 📚 Word Lists by Grade

### Kindergarten (Pre-Primer Dolch + CVC)
```typescript
const KINDERGARTEN_WORDS = {
  // Pre-Primer Dolch (40 words)
  dolchPrePrimer: [
    'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down',
    'find', 'for', 'funny', 'go', 'help', 'here', 'I', 'in',
    'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my',
    'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the',
    'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'
  ],
  
  // CVC words for phonics practice
  cvcWords: {
    shortA: ['cat', 'hat', 'bat', 'mat', 'sat', 'rat', 'pat', 'tap', 'cap', 'map'],
    shortE: ['bed', 'red', 'fed', 'led', 'pen', 'hen', 'ten', 'men', 'pet', 'wet'],
    shortI: ['pig', 'big', 'dig', 'wig', 'fig', 'sit', 'hit', 'bit', 'kit', 'pit'],
    shortO: ['dog', 'log', 'fog', 'hog', 'hot', 'pot', 'cot', 'dot', 'lot', 'top'],
    shortU: ['bug', 'rug', 'mug', 'hug', 'dug', 'cup', 'pup', 'sun', 'run', 'fun']
  }
};
```

### First Grade (Primer + First Grade Dolch)
```typescript
const FIRST_GRADE_WORDS = {
  // Primer Dolch (52 words)
  dolchPrimer: [
    'all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown',
    'but', 'came', 'did', 'do', 'eat', 'four', 'get', 'good',
    'have', 'he', 'into', 'like', 'must', 'new', 'no', 'now',
    'on', 'our', 'out', 'please', 'pretty', 'ran', 'ride', 'saw',
    'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this',
    'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white',
    'who', 'will', 'with', 'yes'
  ],
  
  // First Grade Dolch (41 words)
  dolchFirstGrade: [
    'after', 'again', 'an', 'any', 'as', 'ask', 'by', 'could',
    'every', 'fly', 'from', 'give', 'going', 'had', 'has', 'her',
    'him', 'his', 'how', 'just', 'know', 'let', 'live', 'may',
    'of', 'old', 'once', 'open', 'over', 'put', 'round', 'some',
    'stop', 'take', 'thank', 'them', 'then', 'think', 'walk', 'were',
    'when'
  ],
  
  // DIBELS-aligned phonics patterns
  phonicsPatterns: {
    blends: ['stop', 'clap', 'trip', 'flag', 'swim', 'snap', 'skip', 'spin'],
    digraphs: ['ship', 'chip', 'thin', 'that', 'when', 'what', 'fish', 'wish'],
    cvce: ['make', 'take', 'like', 'home', 'came', 'time', 'name', 'same']
  },
  
  // Word families for rhyming practice
  wordFamilies: {
    at: ['cat', 'bat', 'hat', 'mat', 'sat', 'rat', 'flat', 'that'],
    an: ['fan', 'man', 'pan', 'ran', 'tan', 'van', 'plan', 'than'],
    ig: ['big', 'dig', 'fig', 'pig', 'wig', 'jig', 'twig'],
    op: ['hop', 'mop', 'pop', 'top', 'stop', 'shop', 'drop'],
    ug: ['bug', 'dug', 'hug', 'mug', 'rug', 'tug', 'plug', 'slug']
  }
};
```

### Second Grade (Dolch Second Grade + Advanced Patterns)
```typescript
const SECOND_GRADE_WORDS = {
  // Second Grade Dolch (46 words)
  dolchSecondGrade: [
    'always', 'around', 'because', 'been', 'before', 'best', 'both', 'buy',
    'call', 'cold', 'does', 'dont', 'fast', 'first', 'five', 'found',
    'gave', 'goes', 'green', 'its', 'made', 'many', 'off', 'or',
    'pull', 'read', 'right', 'sing', 'sit', 'sleep', 'tell', 'their',
    'these', 'those', 'upon', 'us', 'use', 'very', 'wash', 'which',
    'why', 'wish', 'work', 'would', 'write', 'your'
  ],
  
  // Advanced phonics patterns
  phonicsPatterns: {
    rControlled: ['car', 'star', 'her', 'fern', 'bird', 'first', 'corn', 'storm'],
    vowelTeams: ['rain', 'play', 'green', 'sleep', 'boat', 'grow'],
    diphthongs: ['coin', 'boy', 'cloud', 'now', 'few', 'new']
  }
};
```

### Third Grade (Dolch Third Grade + Complex Words)
```typescript
const THIRD_GRADE_WORDS = {
  // Third Grade Dolch (41 words)
  dolchThirdGrade: [
    'about', 'better', 'bring', 'carry', 'clean', 'cut', 'done', 'draw',
    'drink', 'eight', 'fall', 'far', 'full', 'got', 'grow', 'hold',
    'hot', 'hurt', 'if', 'keep', 'kind', 'laugh', 'light', 'long',
    'much', 'myself', 'never', 'only', 'own', 'pick', 'seven', 'shall',
    'show', 'six', 'small', 'start', 'ten', 'today', 'together', 'try',
    'warm'
  ],
  
  // Multisyllabic words
  multisyllabic: {
    twoSyllable: ['better', 'carry', 'never', 'together', 'myself'],
    threeSyllable: ['beautiful', 'wonderful', 'tomorrow', 'remember']
  }
};
```

---

## 🤖 AI/ML Adaptive System Design

### Data Model

```typescript
// Word mastery tracking
interface WordProgress {
  wordId: string;
  word: string;
  grade: 'K' | '1' | '2' | '3';
  category: 'dolch' | 'cvc' | 'phonics' | 'family';
  
  // Performance metrics
  attempts: number;
  correct: number;
  accuracy: number;  // correct / attempts
  
  // Timing metrics
  avgResponseTimeMs: number;
  lastSeenAt: number;
  
  // Mastery state
  masteryLevel: 'new' | 'learning' | 'practiced' | 'mastered';
  confidenceScore: number;  // 0-1, decays over time
  
  // Error patterns
  confusionsWith: string[];  // words often confused with this one
  errorTypes: ('spelling' | 'reversal' | 'phonetic' | 'sight')[];
}

// Session tracking
interface LearningSession {
  id: string;
  playerId: string;
  gameId: string;
  startedAt: number;
  completedAt?: number;
  
  // Performance
  wordsAttempted: string[];
  wordsCorrect: string[];
  accuracy: number;
  
  // Adaptive metrics
  difficultyLevel: number;  // 1-10
  adaptiveActions: AdaptiveAction[];
}

// What the system decided to do
interface AdaptiveAction {
  timestamp: number;
  action: 'increase_difficulty' | 'decrease_difficulty' | 
          'focus_weakness' | 'review_mastered' | 'introduce_new';
  reason: string;
  params: Record<string, any>;
}

// Player profile (aggregated)
interface PlayerProfile {
  id: string;
  currentGrade: 'K' | '1' | '2' | '3';
  
  // Overall progress
  totalWordsLearned: number;
  totalSessionsCompleted: number;
  averageAccuracy: number;
  
  // Skill levels by area
  skillLevels: {
    letterRecognition: number;      // 0-100
    phonemicAwareness: number;      // 0-100
    cvcDecoding: number;            // 0-100
    sightWordRecognition: number;   // 0-100
    blendReading: number;           // 0-100
    wordFamilies: number;           // 0-100
  };
  
  // Identified challenges
  struggles: {
    letterConfusion: string[];      // ['b-d', 'p-q']
    phoneticGaps: string[];         // ['short-a', 'blends']
    sightWordGaps: string[];        // specific words
  };
  
  // Learning preferences (detected)
  preferences: {
    bestTimeOfDay: 'morning' | 'afternoon' | 'evening';
    optimalSessionLength: number;   // minutes
    preferredGameTypes: string[];
  };
}
```

### Adaptive Algorithm

```typescript
// Core adaptive engine
class AdaptiveEngine {
  
  // Select next words based on player profile and spaced repetition
  selectWords(profile: PlayerProfile, count: number): WordSelection[] {
    const words: WordSelection[] = [];
    
    // 1. Priority: Words due for review (spaced repetition)
    const reviewDue = this.getReviewDueWords(profile, Math.floor(count * 0.3));
    words.push(...reviewDue);
    
    // 2. Focus: Words in current learning zone
    const learning = this.getLearningWords(profile, Math.floor(count * 0.5));
    words.push(...learning);
    
    // 3. Challenge: New words at edge of ability
    const newWords = this.getNewWords(profile, count - words.length);
    words.push(...newWords);
    
    return this.shuffle(words);
  }
  
  // Calculate optimal difficulty level (Zone of Proximal Development)
  calculateDifficulty(profile: PlayerProfile, recentAccuracy: number): number {
    // Target 70-85% accuracy for optimal learning
    const TARGET_ACCURACY = 0.77;
    const currentDifficulty = profile.currentDifficulty || 5;
    
    if (recentAccuracy > 0.90) {
      // Too easy - increase challenge
      return Math.min(10, currentDifficulty + 1);
    } else if (recentAccuracy < 0.60) {
      // Too hard - reduce challenge
      return Math.max(1, currentDifficulty - 1);
    } else if (recentAccuracy < 0.70) {
      // Slightly hard - small adjustment
      return Math.max(1, currentDifficulty - 0.5);
    }
    
    return currentDifficulty;
  }
  
  // Identify weakness patterns from errors
  analyzeErrors(errors: ErrorRecord[]): WeaknessPattern[] {
    const patterns: WeaknessPattern[] = [];
    
    // Group errors by type
    const letterConfusions = errors.filter(e => e.type === 'reversal');
    const phoneticErrors = errors.filter(e => e.type === 'phonetic');
    
    // Detect b/d confusion
    const bdErrors = letterConfusions.filter(e => 
      (e.expected.includes('b') && e.actual.includes('d')) ||
      (e.expected.includes('d') && e.actual.includes('b'))
    );
    if (bdErrors.length >= 3) {
      patterns.push({ type: 'letter-confusion', letters: ['b', 'd'], severity: 'high' });
    }
    
    // Detect short vowel confusion
    const vowelErrors = phoneticErrors.filter(e => 
      this.isVowelConfusion(e.expected, e.actual)
    );
    if (vowelErrors.length >= 3) {
      patterns.push({ type: 'vowel-confusion', severity: 'medium' });
    }
    
    return patterns;
  }
  
  // Recommend which game to play next
  recommendGame(profile: PlayerProfile): GameRecommendation {
    const weaknesses = profile.struggles;
    
    // If letter confusion is detected, prioritize Letter Flip
    if (weaknesses.letterConfusion.length > 0) {
      return {
        gameId: 'letter-flip-detective',
        reason: 'Practice distinguishing similar letters',
        focusArea: weaknesses.letterConfusion[0]
      };
    }
    
    // If phonetic gaps, prioritize Sound Detective
    if (weaknesses.phoneticGaps.length > 0) {
      return {
        gameId: 'sound-detective',
        reason: 'Strengthen sound-letter connections',
        focusArea: weaknesses.phoneticGaps[0]
      };
    }
    
    // If sight word gaps, prioritize Word Builder or Spelling Shadows
    if (weaknesses.sightWordGaps.length > 0) {
      return {
        gameId: 'word-builder',
        reason: 'Practice spelling high-frequency words',
        focusArea: weaknesses.sightWordGaps.slice(0, 5)
      };
    }
    
    // Default: balanced practice
    return {
      gameId: 'rhyme-time-detective',
      reason: 'General word family practice',
      focusArea: null
    };
  }
}
```

### Spaced Repetition Algorithm

```typescript
// SM-2 inspired algorithm adapted for children
class SpacedRepetition {
  
  // Calculate next review time based on performance
  calculateNextReview(word: WordProgress, wasCorrect: boolean): number {
    const now = Date.now();
    
    // Base intervals in hours
    const INTERVALS = [1, 4, 8, 24, 72, 168, 336]; // 1h, 4h, 8h, 1d, 3d, 1w, 2w
    
    if (wasCorrect) {
      // Move to next interval
      const newLevel = Math.min(word.masteryLevel + 1, INTERVALS.length - 1);
      return now + INTERVALS[newLevel] * 60 * 60 * 1000;
    } else {
      // Reset to beginning but not fully
      const newLevel = Math.max(0, word.masteryLevel - 2);
      return now + INTERVALS[newLevel] * 60 * 60 * 1000;
    }
  }
  
  // Get words due for review
  getWordsDueForReview(words: WordProgress[]): WordProgress[] {
    const now = Date.now();
    return words
      .filter(w => w.nextReviewAt <= now)
      .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  }
  
  // Calculate confidence decay over time
  calculateConfidence(word: WordProgress): number {
    const hoursSinceLastSeen = (Date.now() - word.lastSeenAt) / (1000 * 60 * 60);
    const decayRate = 0.1; // 10% decay per day
    const daysSinceLastSeen = hoursSinceLastSeen / 24;
    
    // Exponential decay with floor based on mastery
    const baseConfidence = word.accuracy * (word.masteryLevel / 5);
    const decayedConfidence = baseConfidence * Math.exp(-decayRate * daysSinceLastSeen);
    
    return Math.max(0.1, decayedConfidence);
  }
}
```

---

## 🎮 Gamification Elements

### Points & Rewards System

```typescript
interface RewardsConfig {
  // Points per action
  points: {
    correctAnswer: 10,
    perfectRound: 50,           // No mistakes in a round
    perfectSession: 100,        // No mistakes in entire session
    streakBonus: 5,             // Per word in a streak
    speedBonus: 2,              // Fast correct answer
    comebackBonus: 15,          // After getting previous wrong
    masteryAchieved: 200,       // First time mastering a word
  };
  
  // Streaks
  streaks: {
    daily: { threshold: 1, reward: 'daily-star' },
    weekly: { threshold: 5, reward: 'weekly-badge' },
    perfectWeek: { threshold: 7, reward: 'perfect-week-trophy' }
  };
  
  // Achievements
  achievements: [
    { id: 'first-word', name: 'First Word!', condition: 'master_1_word' },
    { id: 'ten-words', name: 'Word Explorer', condition: 'master_10_words' },
    { id: 'fifty-words', name: 'Word Detective', condition: 'master_50_words' },
    { id: 'hundred-words', name: 'Word Master', condition: 'master_100_words' },
    { id: 'letter-flip-pro', name: 'Letter Flip Pro', condition: 'perfect_letter_flip_5x' },
    { id: 'no-more-bd', name: 'b and d Expert', condition: 'no_bd_errors_20_words' },
  ];
  
  // Unlockables
  unlockables: {
    themes: ['space', 'underwater', 'jungle', 'castle'],
    avatars: ['detective', 'wizard', 'robot', 'unicorn'],
    celebrations: ['confetti', 'fireworks', 'stars', 'balloons']
  };
}
```

### Progress Visualization

```typescript
// Visual progress for child
interface ProgressDisplay {
  // Word garden metaphor: words grow from seeds to flowers
  gardenView: {
    seeds: string[];      // New words
    sprouts: string[];    // Learning words
    flowers: string[];    // Mastered words
  };
  
  // Map/journey metaphor: traveling through word land
  journeyView: {
    currentLevel: number;
    levelsCompleted: number;
    totalLevels: number;
    starsCollected: number;
  };
  
  // Simple stats for parents
  parentView: {
    wordsLearned: number;
    accuracy: number;
    timeSpent: string;
    areasOfStrength: string[];
    areasNeedingWork: string[];
    recommendations: string[];
  };
}
```

---

## 📊 Analytics & Reporting

### Parent Dashboard Data

```typescript
interface ParentReport {
  // Summary
  summary: {
    totalWordsLearned: number;
    accuracyTrend: 'improving' | 'stable' | 'needs-attention';
    totalPracticeTime: string;
    sessionsThisWeek: number;
    currentStreak: number;
  };
  
  // Detailed progress
  gradeProgress: {
    grade: string;
    wordsExpected: number;
    wordsMastered: number;
    percentComplete: number;
  };
  
  // Skill breakdown (DIBELS-aligned)
  skills: {
    letterNaming: { score: number; benchmark: number; status: string };
    phonemicAwareness: { score: number; benchmark: number; status: string };
    nonsenseWordFluency: { score: number; benchmark: number; status: string };
    sightWords: { score: number; benchmark: number; status: string };
  };
  
  // Areas of focus
  focusAreas: {
    area: string;
    description: string;
    suggestedGames: string[];
    homeActivities: string[];
  }[];
  
  // Recommendations
  recommendations: string[];
}
```

---

## 🛠️ Implementation TODO List

### Phase 1: Core Data Infrastructure
- [ ] Create `packages/adaptive-engine/` package
- [ ] Define TypeScript types for all data models
- [ ] Implement local storage for player profiles
- [ ] Create word list data files (JSON) for each grade
- [ ] Build basic progress tracking in Pinia store

### Phase 2: First Grade Word Lists
- [ ] Compile complete Dolch Pre-Primer list (40 words)
- [ ] Compile complete Dolch Primer list (52 words)
- [ ] Compile complete Dolch First Grade list (41 words)
- [ ] Create CVC word lists by vowel sound
- [ ] Create word family lists for rhyming games
- [ ] Add phonics pattern lists (blends, digraphs)
- [ ] Tag words with difficulty scores

### Phase 3: Basic Adaptive Selection
- [ ] Implement `selectWords()` function
- [ ] Implement basic spaced repetition
- [ ] Track word-level performance
- [ ] Calculate mastery levels
- [ ] Store/retrieve progress locally

### Phase 4: Error Pattern Detection
- [ ] Track specific error types (reversal, phonetic, etc.)
- [ ] Implement `analyzeErrors()` function
- [ ] Detect letter confusion patterns
- [ ] Detect phonetic weakness patterns
- [ ] Generate weakness reports

### Phase 5: Game Integration
- [ ] Update Letter Flip to use adaptive word selection
- [ ] Update Word Builder to use adaptive word selection
- [ ] Add difficulty parameter to all games
- [ ] Track per-game performance
- [ ] Implement game recommendations

### Phase 6: Gamification
- [ ] Implement points system
- [ ] Add streak tracking
- [ ] Create achievement system
- [ ] Build progress visualization (garden/journey)
- [ ] Add unlockable rewards

### Phase 7: Parent Dashboard
- [ ] Create parent view route
- [ ] Build progress summary component
- [ ] Add skill breakdown charts
- [ ] Generate recommendations
- [ ] Export progress reports

### Phase 8: Expand to Other Grades
- [ ] Add Kindergarten word lists
- [ ] Add Second Grade word lists
- [ ] Add Third Grade word lists
- [ ] Implement grade progression logic
- [ ] Add placement assessment

### Phase 9: Advanced ML (Future)
- [ ] Collect anonymized learning data
- [ ] Train difficulty prediction model
- [ ] Implement personalized pacing
- [ ] A/B test different algorithms
- [ ] Optimize for long-term retention

---

## 🚀 Build Prompts

### Prompt 1: Create Adaptive Engine Package

```
Create the adaptive learning engine package for Lola's Learning.

Requirements:
1. Create `packages/adaptive-engine/` with TypeScript
2. Define types for:
   - WordProgress (per-word tracking)
   - PlayerProfile (aggregated stats)
   - LearningSession (session data)
   - AdaptiveAction (system decisions)
3. Implement SpacedRepetition class with:
   - calculateNextReview(word, wasCorrect)
   - getWordsDueForReview(words)
   - calculateConfidence(word)
4. Implement AdaptiveEngine class with:
   - selectWords(profile, count)
   - calculateDifficulty(profile, recentAccuracy)
   - analyzeErrors(errors)
   - recommendGame(profile)
5. Export all types and classes
6. Add unit tests for core functions
7. Target 70-85% accuracy for optimal learning zone

Use pure TypeScript, no framework dependencies.
```

### Prompt 2: Create Word Lists Data

```
Create the word list data files for Lola's Learning adaptive system.

Requirements:
1. Create `packages/word-data/` package
2. Create JSON files for each grade level:
   - kindergarten.json (Pre-Primer Dolch + CVC)
   - first-grade.json (Primer + First Grade Dolch + phonics)
   - second-grade.json (Second Grade Dolch + advanced patterns)
   - third-grade.json (Third Grade Dolch + multisyllabic)
3. Each word entry should have:
   - word: string
   - grade: 'K' | '1' | '2' | '3'
   - category: 'dolch' | 'cvc' | 'phonics' | 'family'
   - difficulty: 1-10
   - phonicsPattern?: string (e.g., 'short-a', 'blend-cl')
   - wordFamily?: string (e.g., '-at', '-ig')
   - confusableWith?: string[] (similar words)
4. Create TypeScript types for word data
5. Create index.ts exporting all word lists
6. Include at least:
   - 40 Pre-Primer Dolch words
   - 52 Primer Dolch words
   - 41 First Grade Dolch words
   - 50+ CVC words organized by vowel
   - 30+ word families for rhyming
```

### Prompt 3: Create Progress Store

```
Create a Pinia store for tracking player progress in Lola's Learning.

Requirements:
1. Create `apps/shell/src/stores/progress.ts`
2. Store should track:
   - Current player profile
   - Word-level progress for all attempted words
   - Session history
   - Streak data
   - Achievement unlocks
3. Persist to localForage
4. Implement actions:
   - recordWordAttempt(word, correct, responseTimeMs)
   - completeSession(session)
   - updateMasteryLevels()
   - getWordsDueForReview()
   - getRecommendedGame()
5. Implement getters:
   - currentAccuracy
   - wordsLearned
   - currentStreak
   - skillLevels
   - weaknessPatterns
6. Add unit tests
7. Integrate with existing sessions/rewards stores
```

### Prompt 4: Create Parent Dashboard

```
Create a parent dashboard view for Lola's Learning.

Requirements:
1. Create `apps/shell/src/views/ParentDashboard.vue`
2. Add route `/parent` (protected, maybe PIN?)
3. Display:
   - Summary stats (words learned, accuracy, time)
   - Progress chart over time
   - Skill breakdown (DIBELS-aligned areas)
   - Current grade progress
   - Areas needing focus
   - Recommended activities
4. Use Tailwind for styling, match existing design
5. Make it mobile-friendly
6. Add "Export Report" button (PDF or text)
7. Show celebration of achievements
8. Include tips for parents
```

### Prompt 5: Integrate Adaptive Selection into Games

```
Integrate the adaptive word selection system into Letter Flip Detective.

Requirements:
1. Import adaptive engine into game
2. Replace hardcoded word generation with adaptive selection:
   - Get player profile from store
   - Call selectWords() for session words
   - Include mix of review + learning + new
3. Track per-word performance during game:
   - Record correct/incorrect
   - Record response time
   - Track error patterns (which letter was confused)
4. After session:
   - Update word progress in store
   - Calculate new difficulty level
   - Check for achievements
   - Update mastery levels
5. Show difficulty indicator in UI (optional)
6. Add "Focus Mode" for practicing weak areas
```

---

## 📅 Implementation Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Data Foundation | Word lists JSON, TypeScript types, basic store |
| 2 | Adaptive Engine | SpacedRepetition, AdaptiveEngine classes |
| 3 | Game Integration | Update Letter Flip + Word Builder with adaptive |
| 4 | Progress Tracking | Full progress store, persistence |
| 5 | Gamification | Points, streaks, achievements |
| 6 | Parent Dashboard | View, charts, recommendations |
| 7 | Testing & Polish | Testing with real child, adjustments |
| 8 | Expand Grades | Add K, 2nd, 3rd grade content |

---

## 🔑 Key Design Decisions

### Why Local-First ML?
- Privacy: No child data leaves the device
- Offline: Works without internet
- Fast: No API latency
- Simple: No backend infrastructure needed

### Why DIBELS + Dolch Combined?
- DIBELS: Research-based assessment alignment
- Dolch: Proven high-frequency word lists
- Together: Comprehensive coverage of early reading skills

### Why 70-85% Target Accuracy?
- Too easy (>90%): Child gets bored, no learning
- Too hard (<60%): Child gets frustrated, quits
- Sweet spot: Challenging but achievable, optimal learning

### Why Spaced Repetition?
- Proven to improve long-term retention
- Efficient: Focus time on words that need it
- Personalized: Adapts to individual forgetting curves