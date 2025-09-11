import 'dotenv/config';
import { defineConfig } from '@playwright/test';

function toBool(v: string | undefined, fallback: boolean) {
  if (v == null) return fallback;
  const s = v.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'off'].includes(s)) return false;
  return fallback;
}

const HEADLESS = toBool(process.env.HEADLESS, true);
const RECORD_VIDEO_ENV = (process.env.RECORD_VIDEO || '').trim().toLowerCase();
// Allow: '', 'on', 'retain-on-failure', 'on-first-retry'
const VIDEO: 'on' | 'retain-on-failure' | 'on-first-retry' | 'off' =
  RECORD_VIDEO_ENV === 'on' ||
  RECORD_VIDEO_ENV === 'retain-on-failure' ||
  RECORD_VIDEO_ENV === 'on-first-retry'
    ? (RECORD_VIDEO_ENV as 'on' | 'retain-on-failure' | 'on-first-retry')
    : toBool(process.env.RECORD_VIDEO, false)
      ? 'on-first-retry'
      : 'off';

const SCREENSHOTS_ENV = (process.env.SCREENSHOTS || '').trim().toLowerCase();
// Allow: '', 'on', 'only-on-failure', 'off'
const SCREENSHOT: 'on' | 'only-on-failure' | 'off' =
  SCREENSHOTS_ENV === 'on' || SCREENSHOTS_ENV === 'only-on-failure'
    ? (SCREENSHOTS_ENV as 'on' | 'only-on-failure')
    : toBool(process.env.SCREENSHOTS, true)
      ? 'only-on-failure'
      : 'off';

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 0,
  tsconfig: './tsconfig.base.json',
  use: {
    baseURL: 'http://localhost:5173',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    headless: HEADLESS,
    video: VIDEO,
    screenshot: SCREENSHOT,
  },
  webServer: [
    {
      command: 'pnpm --filter @lolas/game-freeze-math dev',
      port: 5177,
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command: 'pnpm --filter @lolas/game-number-detective dev',
      port: 5174,
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command: 'pnpm --filter @lolas/game-letter-detective dev',
      port: 5175,
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command: 'pnpm --filter @lolas/game-word-detective dev',
      port: 5176,
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command: 'pnpm --filter @lolas/shell dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
});
