// Minimal shell entry to satisfy build output
import { createCoreApi } from '@lolas/core-sdk';
import { renderButton } from '@lolas/ui-kit';

export function bootstrap() {
  const core = createCoreApi();
  // no-op usage
  core.awardPoints(0);
  return renderButton({ label: 'Shell Loaded' });
}

// (Retained for legacy exports; main Vue entry is in main.ts)
export * from './stores/sessions';
