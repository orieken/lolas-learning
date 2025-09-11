import { describe, it, expect, vi } from 'vitest';
import {
  createCoreApi,
  CoreEventAdapter,
  Session,
  PrintableDef,
  CoreAPI,
  GamePlugin,
} from './index';

// Type-level contract tests
const _testSession: Session = {
  id: 'sess1',
  gameId: 'game1',
  startedAt: Date.now(),
};
const _testPrintable: PrintableDef = {
  id: 'print1',
  title: 'Test PDF',
  makePdf: () => new Blob(),
};
const _testPlugin: GamePlugin = {
  id: 'game1',
  title: 'Game',
  mount: (el, core) => {},
  unmount: () => {},
};

// Runtime tests

describe('createCoreApi', () => {
  it('calls adapter methods when invoked', () => {
    const adapter: CoreEventAdapter = {
      onAwardPoints: vi.fn(),
      onSaveSession: vi.fn(),
      onRegisterPrintable: vi.fn(),
    };
    const core = createCoreApi(adapter);
    core.awardPoints(5);
    core.saveSession(_testSession);
    core.registerPrintable(_testPrintable);
    expect(adapter.onAwardPoints).toHaveBeenCalledWith(5);
    expect(adapter.onSaveSession).toHaveBeenCalledWith(_testSession);
    expect(adapter.onRegisterPrintable).toHaveBeenCalledWith(_testPrintable);
  });

  it('does not fail if adapter methods are missing', () => {
    const core = createCoreApi();
    expect(() => core.awardPoints(1)).not.toThrow();
    expect(() => core.saveSession(_testSession)).not.toThrow();
    expect(() => core.registerPrintable(_testPrintable)).not.toThrow();
  });
});
