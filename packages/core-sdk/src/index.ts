// Core SDK minimal types and factory

export type PrintableDef = {
  id: string;
  title: string;
  makePdf: () => Promise<Blob> | Blob | void;
};

export type Session = {
  id: string;
  gameId: string;
  startedAt: number;
  completedAt?: number;
  score?: number;
};

export type CoreAPI = {
  awardPoints: (points: number) => void;
  saveSession: (session: Session) => void;
  registerPrintable: (p: PrintableDef) => void;
};

export type GamePlugin = {
  id: string;
  title: string;
  mount?: (el: HTMLElement, core: CoreAPI) => void | Promise<void>;
  unmount?: () => void | Promise<void>;
};

/**
 * Adapter that allows host apps to observe core events without coupling.
 * All callbacks are optional; provide only what you need.
 */
export type CoreEventAdapter = {
  /** Emitted when a game awards points incrementally. */
  onAwardPoints?: (points: number) => void;
  /** Emitted when a game completes and wishes to persist a session. */
  onSaveSession?: (session: Session) => void;
  /** Emitted when a game registers a printable resource. */
  onRegisterPrintable?: (p: PrintableDef) => void;
};

/**
 * Create the CoreAPI surface consumed by games. The provided adapter receives events.
 */
export function createCoreApi(adapter: CoreEventAdapter = {}): CoreAPI {
  return {
    awardPoints(points) {
      adapter.onAwardPoints?.(points);
    },
    saveSession(session) {
      adapter.onSaveSession?.(session);
    },
    registerPrintable(p) {
      adapter.onRegisterPrintable?.(p);
    },
  };
}

export * from './oddOneOut';
