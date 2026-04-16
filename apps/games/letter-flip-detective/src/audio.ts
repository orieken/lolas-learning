/**
 * Audio manager for Letter Flip Detective
 * Uses Web Speech API for text-to-speech (no audio files needed)
 */

export type AudioManager = {
  speak: (text: string, rate?: number) => void;
  speakLetter: (letter: string) => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playInstruction: () => void;
  setMuted: (muted: boolean) => void;
  isMuted: () => boolean;
};

export function createAudioManager(): AudioManager {
  let muted = false;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Letter pronunciations for clarity
  const letterSounds: Record<string, string> = {
    b: 'buh',
    d: 'duh',
    p: 'puh',
    q: 'kwuh',
    m: 'mmm',
    w: 'wuh',
    n: 'nnn',
    u: 'uh',
  };

  function speak(text: string, rate = 0.9) {
    if (muted || !synth) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.1; // Slightly higher pitch for child-friendliness
    utterance.volume = 1;
    
    // Try to use a friendly voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Samantha') || v.name.includes('Google') || v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    synth.speak(utterance);
  }

  function speakLetter(letter: string) {
    const sound = letterSounds[letter.toLowerCase()] ?? letter;
    speak(sound, 0.8);
  }

  function playCorrect() {
    speak('Great job!', 1.0);
  }

  function playIncorrect() {
    speak('Try again', 0.9);
  }

  function playInstruction() {
    speak('Find the sneaky letter!', 0.85);
  }

  return {
    speak,
    speakLetter,
    playCorrect,
    playIncorrect,
    playInstruction,
    setMuted: (m: boolean) => { muted = m; },
    isMuted: () => muted,
  };
}

/**
 * Simple tone generator for additional audio feedback
 */
export function playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio context may not be available
  }
}

/**
 * Play a cheerful success sound
 */
export function playSuccessChime() {
  playTone(523.25, 0.1); // C5
  setTimeout(() => playTone(659.25, 0.1), 100); // E5
  setTimeout(() => playTone(783.99, 0.15), 200); // G5
}

/**
 * Play a gentle "try again" sound
 */
export function playTryAgainTone() {
  playTone(349.23, 0.2, 'triangle'); // F4 - softer tone
}
