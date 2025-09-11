#!/usr/bin/env node
/**
 * Simple MFE dev orchestrator for pnpm workspaces.
 *
 * Usage:
 *   pnpm mf list
 *   pnpm mf start                # start default apps from manifest
 *   pnpm mf start shell          # start only shell
 *   pnpm mf start shell number-detective
 *   pnpm mf start --all
 *   pnpm mf start --no-open      # do not open browser
 *   pnpm mf start --open         # force open even if not default
 */

import { createServer } from 'http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, 'mf.manifest.json');

function log(msg) { console.log(`[mf] ${msg}`); }
function err(msg) { console.error(`[mf:error] ${msg}`); }

async function loadManifest() {
  const raw = await readFile(manifestPath, 'utf-8');
  const json = JSON.parse(raw);
  if (!json.apps || !Array.isArray(json.apps)) throw new Error('Invalid manifest: apps[] missing');
  return json.apps;
}

async function waitForPort(port, { timeoutMs = 60000, intervalMs = 300 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const req = createServer();
      req.listen(port, '127.0.0.1');
      req.on('listening', () => {
        // Port is free; not ready
        req.close(() => resolve(false));
      });
      req.on('error', () => {
        // EADDRINUSE: port is taken -> assume server started
        resolve(true);
      });
    });
    if (ok) return true;
    await delay(intervalMs);
  }
  return false;
}

function spawnDev(app) {
  const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const args = ['--filter', app.package, app.devCommand];
  log(`starting ${app.id} -> pnpm ${args.join(' ')}`);
  const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
  const prefix = `[${app.id}]`;
  child.stdout.on('data', (d) => process.stdout.write(`${prefix} ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`${prefix} ${d}`));
  child.on('exit', (code) => log(`${app.id} exited with code ${code}`));
  return child;
}

async function openBrowser(url) {
  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') { cmd = 'open'; args = [url]; }
  else if (platform === 'win32') { cmd = 'cmd'; args = ['/c', 'start', '""', url]; }
  else { cmd = 'xdg-open'; args = [url]; }
  spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
}

async function cmdList() {
  const apps = await loadManifest();
  log('available apps:');
  for (const a of apps) {
    console.log(` - ${a.id} (${a.package}) : port ${a.port}${a.default ? ' [default]' : ''}`);
  }
}

async function cmdStart(argv) {
  const apps = await loadManifest();
  const idx = new Map(apps.map((a) => [a.id, a]));
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const names = argv.filter((a) => !a.startsWith('--'));
  const allFlag = flags.has('--all');
  const noOpen = flags.has('--no-open');
  const forceOpen = flags.has('--open');

  let targets;
  if (allFlag) targets = apps;
  else if (names.length) targets = names.map((n) => idx.get(n)).filter(Boolean);
  else targets = apps.filter((a) => a.default);

  if (!targets.length) {
    err('no apps resolved to start. Use `pnpm mf list` to see options.');
    process.exit(1);
  }

  // Start each app
  const children = targets.map(spawnDev);

  // Wait for shell if included, then open browser
  const shell = targets.find((a) => a.id === 'shell');
  if (shell && (!noOpen || forceOpen)) {
    log(`waiting for shell port ${shell.port}...`);
    const ok = await waitForPort(shell.port, { timeoutMs: 90000 });
    if (ok) {
      const url = shell.openUrl || `http://localhost:${shell.port}/#/`;
      log(`opening ${url}`);
      await openBrowser(url);
    } else {
      err('timed out waiting for shell to start');
    }
  }

  // Keep process alive while children are running
  process.on('SIGINT', () => {
    log('received SIGINT, terminating children...');
    for (const c of children) { try { c.kill('SIGINT'); } catch {} }
    process.exit(0);
  });
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  if (cmd === 'list') return cmdList();
  if (cmd === 'start' || !cmd) return cmdStart(rest);
  err(`unknown command: ${cmd}`);
  process.exit(1);
}

main().catch((e) => { err(e?.stack || e?.message || String(e)); process.exit(1); });
