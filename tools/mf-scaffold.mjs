#!/usr/bin/env node
/**
 * Microfrontend Scaffold CLI (no dependencies)
 *
 * Creates a new game microfrontend under apps/games/<slug>
 * - Generates Vite + Federation config exposing ./Game
 * - Adds basic Game.ts with a 10-step "odd one out" template
 * - Adds unit test example and Playwright e2e spec
 * - Updates tools/mf.manifest.json to include the new app
 * - Automatically wires into the shell (remotes, view, route, home link), and can add Playwright webServer entry
 *
 * Usage:
 *   pnpm node tools/mf-scaffold.mjs              # interactive
 *   node tools/mf-scaffold.mjs --name "Color Detective" --slug color-detective --port 5180 --pkg @lolas/game-color-detective
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function toPascal(slug) {
  return slug
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

async function promptInteractive(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((res) => rl.question(question, (ans) => res(ans)));
  const name = (await ask('Game name (e.g., "Color Detective"): ')).trim();
  const slugDefault = toSlug(name || 'my-game');
  const slug = (await ask(`Slug [${slugDefault}]: `)).trim() || slugDefault;
  const portStr = (await ask('Dev server port (e.g., 5180): ')).trim();
  const port = Number(portStr) || 5180;
  const pkgDefault = `@lolas/game-${slug}`;
  const pkg = (await ask(`Workspace package name [${pkgDefault}]: `)).trim() || pkgDefault;
  rl.close();
  return { name: name || 'My Game', slug, port, pkg };
}

function readArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--name') out.name = args[++i];
    else if (a === '--slug') out.slug = args[++i];
    else if (a === '--port') out.port = Number(args[++i]);
    else if (a === '--pkg') out.pkg = args[++i];
    else if (a === '--yes' || a === '-y') out.yes = true;
  }
  return out;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function writeFileSafe(file, content) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, content);
}

function templatePackageJson(pkgName) {
  return `{
  "name": "${pkgName}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "vite build && tsc -p tsconfig.json",
    "clean": "rimraf dist || rm -rf dist",
    "dev": "vite"
  },
  "dependencies": {
    "@lolas/core-sdk": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "rimraf": "^5.0.7",
    "vite": "^5.4.9",
    "@originjs/vite-plugin-federation": "^1.4.1"
  }
}
`;}

function templateTsconfig() {
  return `{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "composite": false,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "isolatedModules": true,
    "declaration": true,
    "outDir": "dist",
    "types": ["vite/client"]
  },
  "include": ["src"]
}
`;}

function templateViteConfig(port, federatedName) {
  return `import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import path from 'node:path';

export default defineConfig({
  server: { port: ${port}, cors: true },
  resolve: {
    alias: {
      '@lolas/core-sdk': path.resolve(__dirname, '../../../packages/core-sdk'),
    },
    preserveSymlinks: true,
  },
  plugins: [
    federation({
      name: '${federatedName}',
      filename: 'remoteEntry.js',
      exposes: { './Game': './src/Game.ts' },
      shared: ['vue']
    })
  ],
  build: { target: 'esnext' }
});
`;}

function templateIndexHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Game Dev Preview</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { plugin } from '/src/Game.ts';
      import { createCoreApi } from '@lolas/core-sdk';
      const el = document.getElementById('app');
      const core = createCoreApi();
      plugin.mount?.(el, core);
    </script>
  </body>
</html>
`;}

function templateGeneratorTs() {
  return `export type Line = { items: number[]; errorIndex: number };

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

function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
`;}

function templateUnitTest() {
  return `import { describe, it, expect } from 'vitest';
import { makeLines } from '../generator';

describe('makeLines', () => {
  it('creates exactly one error per row', () => {
    const lines = makeLines([1, 30], { lines: 5, seed: 42 });
    for (const ln of lines) {
      expect(ln.items).toHaveLength(6);
      const wrong = ln.items[ln.errorIndex];
      expect(ln.items.filter((n) => n === wrong).length).toBe(1);
    }
  });
});
`;}

function templateGameTs(gameId, title) {
  return `import type { GamePlugin, CoreAPI, Session } from '@lolas/core-sdk';
import { makeLines } from './generator';

export const plugin: GamePlugin = {
  id: '${gameId}',
  title: '${title}',
  async mount(el: HTMLElement, core: CoreAPI) {
    const startedAt = Date.now();
    el.innerHTML = '';
    const root = document.createElement('div');
    root.setAttribute('data-test', 'game-root');
    root.style.display = 'grid';
    root.style.gap = '16px';
    root.style.maxWidth = '520px';
    root.style.margin = '24px auto';
    el.appendChild(root);

    let current = 0;
    let correct = 0;
    const total = 10;

    const lines = makeLines([1, 40], { lines: total, seed: 5 });

    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.appendChild(status);

    const lineWrap = document.createElement('div');
    lineWrap.style.display = 'grid';
    lineWrap.style.gridTemplateColumns = 'repeat(6, 1fr)';
    lineWrap.style.gap = '12px';
    root.appendChild(lineWrap);

    const msg = document.createElement('div');
    msg.setAttribute('data-test', 'message');
    root.appendChild(msg);

    function renderLine() {
      const ln = lines[current];
      lineWrap.innerHTML = '';
      lineWrap.setAttribute('data-error-index', String(ln.errorIndex));
      ln.items.forEach((num, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = String(num);
        btn.style.padding = '12px';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '8px';
        btn.style.border = '2px solid #333';
        btn.setAttribute('aria-label', 'Item ' + String(idx + 1) + ' value ' + String(num));
        if (idx === ln.errorIndex) btn.setAttribute('data-error', 'true');
        btn.addEventListener('click', () => {
          if (idx === ln.errorIndex) {
            correct++;
            msg.textContent = 'Correct!';
            current++;
            if (current >= total) {
              const completedAt = Date.now();
              if (correct > 0) core.awardPoints(correct);
              const session: Session = {
                id: 'sess-' + String(completedAt),
                gameId: '${gameId}',
                startedAt,
                completedAt,
                score: correct,
              };
              core.saveSession(session);
              status.textContent = 'Finished! Score ' + String(correct) + '/' + String(total);
              lineWrap.innerHTML = '';
              return;
            }
            renderLine();
          } else {
            msg.textContent = 'Try again…';
          }
        });
        lineWrap.appendChild(btn);
      });
      status.textContent = 'Line ' + String(current + 1) + ' of ' + String(total);
      msg.textContent = '';
    }

    renderLine();
  },
};
`;}

function templateE2E(slug, linkTestId) {
  return `import { test, expect } from '@playwright/test';

async function playPerfectRun(page: any) {
  for (let i = 0; i < 10; i++) {
    const oddBtn = page.locator('[data-test="game-root"] [data-error="true"]');
    await expect(oddBtn).toBeVisible();
    await oddBtn.click();
  }
}

test('${toPascal(slug)}: load and complete a full run', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByTestId('shell-heading')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('${linkTestId}').click();

  const gameRoot = page.getByTestId('game-root');
  await expect(gameRoot).toBeVisible({ timeout: 20000 });

  await playPerfectRun(page);
  await expect(page.getByText(/Finished! Score 10\\/10/)).toBeVisible({ timeout: 10000 });
});
`;}

async function updateManifest(slug, pkg, port) {
  const file = path.join(ROOT, 'tools', 'mf.manifest.json');
  const raw = await fs.readFile(file, 'utf-8');
  const json = JSON.parse(raw);
  json.apps = json.apps || [];
  if (!json.apps.find((a) => a.id === slug)) {
    json.apps.push({ id: slug, package: pkg, devCommand: 'dev', port, default: false });
  }
  await fs.writeFile(file, JSON.stringify(json, null, 2));
}

async function patchShellViteConfig({ federatedName, port }) {
  const file = path.join(ROOT, 'apps', 'shell', 'vite.config.ts');
  let src = await fs.readFile(file, 'utf-8');
  const remotesOpen = 'remotes: {';
  if (!src.includes(`${federatedName}: 'http://localhost:${port}/assets/remoteEntry.js'`)) {
    src = src.replace(remotesOpen, `${remotesOpen}\n        ${federatedName}: 'http://localhost:${port}/assets/remoteEntry.js',`);
    await fs.writeFile(file, src);
  }
}

async function ensureShellView({ pascal, federatedName, port, slug, title }) {
  const viewPath = path.join(ROOT, 'apps', 'shell', 'src', 'views', `Game${pascal}.vue`);
  try { await fs.access(viewPath); return; } catch {}
  const content = `<template>\n  <section>\n    <h2>${title} Remote</h2>\n    <p v-if=\"status==='loading'\">Loading remote game...</p>\n    <p v-else-if=\"status==='error'\" style=\"color:red\" data-test=\"remote-error\">Failed: {{ errorMsg }}</p>\n    <div ref=\"mountEl\" data-test=\"remote-mount\" />\n    <router-link to=\"/\" data-test=\"link-home\">Home</router-link>\n  </section>\n</template>\n<script setup lang=\"ts\">\nimport { onMounted, ref } from 'vue';\nimport type { CoreAPI, Session, PrintableDef } from '@lolas/core-sdk';\nimport { createCoreApi } from '@lolas/core-sdk';\nimport { useSessionsStore } from '../stores/sessions';\nimport { useRewardsStore } from '../stores/rewards';\nimport { printRegistry } from '../print/service';\nimport { useRemotePlugin } from '../composables/useRemotePlugin';\n\nconst mountEl = ref<HTMLElement | null>(null);\nconst { status, errorMsg, load } = useRemotePlugin();\n\nonMounted(async () => {\n  try {\n    const plugin = await load({\n      specs: [\n        '${federatedName}/Game',\n        'http://localhost:${port}/src/Game.ts',\n      ],\n    });\n    if (!plugin) throw new Error('Remote plugin not found after attempts');\n\n    const sessions = useSessionsStore();\n    const rewards = useRewardsStore();\n    const adapter: Partial<CoreAPI & { onAwardPoints?: (p:number)=>void; onSaveSession?: (s:Session)=>void; onRegisterPrintable?: (p: PrintableDef)=>void; }> = {\n      onAwardPoints: (_p: number) => {},\n      onSaveSession: (s: Session) => { sessions.addSession(s); rewards.processPerfectSession(s); },\n      onRegisterPrintable: (p: PrintableDef) => { printRegistry.register(p); },\n    } as any;\n    const core: CoreAPI = createCoreApi(adapter);\n    if (mountEl.value) await plugin.mount?.(mountEl.value, core);\n  } catch (e: any) {\n    (window as any).__REMOTE_LOAD_ERROR__ = e?.stack || e?.message || String(e);\n  }\n});\n</script>\n`;
  await writeFileSafe(viewPath, content);
}

async function patchShellRouter({ pascal, slug }) {
  const file = path.join(ROOT, 'apps', 'shell', 'src', 'router', 'index.ts');
  let src = await fs.readFile(file, 'utf-8');
  const importLine = `import Game${pascal} from '../views/Game${pascal}.vue';`;
  if (!src.includes(importLine)) {
    src = src.replace("import HomeView from '../views/HomeView.vue';", `import HomeView from '../views/HomeView.vue';\nimport Game${pascal} from '../views/Game${pascal}.vue';`);
  }
  const routeLine = `{ path: '/game/${slug}', name: '${slug}', component: Game${pascal} },`;
  if (!src.includes(routeLine)) {
    const marker = 'const routes: RouteRecordRaw[] = [';
    src = src.replace(marker, `${marker}\n  ${routeLine}`);
  }
  await fs.writeFile(file, src);
}

async function patchHomeView({ slug, title }) {
  const file = path.join(ROOT, 'apps', 'shell', 'src', 'views', 'HomeView.vue');
  let src = await fs.readFile(file, 'utf-8');
  const li = `      <li><router-link to=\"/game/${slug}\" data-test=\"link-${slug}\">${title}</router-link></li>`;
  if (!src.includes(li)) {
    const ulMarker = '<ul>';
    src = src.replace(ulMarker, `${ulMarker}\n${li}`);
    await fs.writeFile(file, src);
  }
}

async function patchPlaywright({ port, pkg, slug }, add=true) {
  if (!add) return;
  const file = path.join(ROOT, 'playwright.config.ts');
  let src = await fs.readFile(file, 'utf-8');
  const block = `    {\n      command: 'pnpm --filter ${pkg} dev',\n      port: ${port},\n      reuseExistingServer: true,\n      timeout: 60000,\n    },`;
  if (!src.includes(`port: ${port}`)) {
    src = src.replace('  webServer: [', `  webServer: [\n${block}`);
    await fs.writeFile(file, src);
  }
}

async function main() {
  const args = readArgs();
  let cfg = args;
  if (!cfg.name || !cfg.slug || !cfg.port || !cfg.pkg) {
    cfg = { ...(args || {}), ...(await promptInteractive()) };
  }
  cfg.slug = toSlug(cfg.slug || toSlug(cfg.name));
  const pascal = toPascal(cfg.slug);
  const gameTitle = cfg.name;
  const federatedName = cfg.slug.replace(/-/g, '_');
  const gameId = cfg.slug;

  const baseDir = path.join(ROOT, 'apps', 'games', cfg.slug);
  const srcDir = path.join(baseDir, 'src');

  // Create files
  await writeFileSafe(path.join(baseDir, 'package.json'), templatePackageJson(cfg.pkg));
  await writeFileSafe(path.join(baseDir, 'tsconfig.json'), templateTsconfig());
  await writeFileSafe(path.join(baseDir, 'vite.config.ts'), templateViteConfig(cfg.port, federatedName));
  await writeFileSafe(path.join(baseDir, 'index.html'), templateIndexHtml());
  await writeFileSafe(path.join(srcDir, 'generator.ts'), templateGeneratorTs());
  await writeFileSafe(path.join(srcDir, 'Game.ts'), templateGameTs(gameId, gameTitle));
  await writeFileSafe(path.join(srcDir, '__tests__', 'generator.test.ts'), templateUnitTest());

  // E2E spec stub
  const linkTestId = `link-${cfg.slug}`;
  await writeFileSafe(path.join(ROOT, 'tests', 'e2e', `${cfg.slug}-load.spec.ts`), templateE2E(cfg.slug, linkTestId));

  // Update mf manifest
  await updateManifest(cfg.slug, cfg.pkg, cfg.port);

  // Wire into shell automatically
  await patchShellViteConfig({ federatedName, port: cfg.port });
  await ensureShellView({ pascal, federatedName, port: cfg.port, slug: cfg.slug, title: gameTitle });
  await patchShellRouter({ pascal, slug: cfg.slug });
  await patchHomeView({ slug: cfg.slug, title: gameTitle });
  const addE2E = true; // can be toggled later with a flag
  await patchPlaywright({ port: cfg.port, pkg: cfg.pkg, slug: cfg.slug }, addE2E);

  console.log('\nScaffold complete!');
  console.log(`- Remote added to shell remotes as ${federatedName}`);
  console.log(`- View created: apps/shell/src/views/Game${pascal}.vue`);
  console.log(`- Route added: /game/${cfg.slug}`);
  console.log(`- Home link added with test id: link-${cfg.slug}`);
  console.log('- Playwright webServer entry added (if not already present).');
  console.log('Start dev: pnpm dev (or pnpm mf start --all)');
}

main().catch((e) => {
  console.error(e?.stack || e?.message || String(e));
  process.exit(1);
});
