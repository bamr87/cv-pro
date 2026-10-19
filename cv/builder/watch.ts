// Watch mode for the VS Code editing loop: rebuild every surface whenever the
// data or the engine changes. Dependency-free (fs.watch on the two dirs, no
// recursion needed — both are flat), debounced, and runs one build at a time.
//
//   npm run watch          (or the "CV: watch" task in .vscode/tasks.json)
//
// Pair it with the Live Preview extension on dist/index.html for a live
// rendered view while editing data/cv.json.

import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WATCHED = [join(ROOT, 'data'), join(ROOT, 'builder')];
const BUILD = join(ROOT, 'builder', 'build.ts');

let timer: NodeJS.Timeout | null = null;
let running = false;
let queued = false;

function build(reason: string): void {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  console.log(`[watch] ${reason} — rebuilding…`);
  const child = spawn(process.execPath, ['--import', 'tsx', BUILD], { cwd: ROOT, stdio: 'inherit' });
  child.on('exit', (code) => {
    running = false;
    console.log(code === 0 ? '[watch] ok — waiting for changes' : `[watch] build failed (exit ${code}) — fix and save again`);
    if (queued) {
      queued = false;
      build('queued change');
    }
  });
}

function schedule(reason: string): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => build(reason), 150);
}

for (const dir of WATCHED) {
  watch(dir, (_event, filename) => {
    const name = filename ?? '';
    if (name.endsWith('.json') || name.endsWith('.ts')) schedule(`${name} changed`);
  });
}

console.log(`[watch] watching ${WATCHED.map((d) => d.slice(ROOT.length + 1) + '/').join(' and ')}`);
build('initial build');
