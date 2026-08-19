// Build entry point for the CV machine.
//
//   npm run build          -> regenerate CV.md + everything under dist/
//   npm run build:check    -> verify CV.md is in sync with data/cv.json (CI gate)
//
// Reads data/cv.json (the canonical CVData, shared with cv-builder-pro),
// validates it, and emits every text surface. The PDF lane (cv.tex + LaTeX)
// is compiled by CI, not here — see .github/workflows/publish.yml.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CVData } from './types.ts';
import { validateCVData } from './validate.ts';
import { exportToMarkdown } from './markdown.ts';
import { exportToASCII } from './ascii.ts';
import { latexTemplates } from './latex.ts';
import { exportToHTML } from './html.ts';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_FILE = join(ROOT, 'data', 'cv.json');
export const CV_MD = join(ROOT, 'CV.md');
export const DIST = join(ROOT, 'dist');
export const HEADSHOT = join(ROOT, 'Amr-Headshot_v3.jpg');

export const SOURCE_URL = 'https://github.com/bamr87/cv';
export const EDIT_URL = 'https://github.com/bamr87/cv-builder-pro';

const GENERATED_BANNER = `<!-- GENERATED FILE — do not edit by hand.
     Source of truth: data/cv.json. Regenerate with: npm run build -->
`;

export function loadData(): CVData {
  const raw = readFileSync(DATA_FILE, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  const { errors, warnings } = validateCVData(parsed);
  for (const warning of warnings) console.warn(`warn: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`);
    throw new Error(`data/cv.json failed validation with ${errors.length} error(s)`);
  }
  return parsed as CVData;
}

// Last commit date of the data file; falls back to today for un-committed edits
// and shallow checkouts where the file's history isn't reachable.
export function dataUpdatedDate(): string {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'data/cv.json'], {
      cwd: ROOT,
      encoding: 'utf8'
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    // not a git checkout (or git unavailable) — fall through to today
  }
  return new Date().toISOString().slice(0, 10);
}

export function renderCvMd(data: CVData): string {
  return GENERATED_BANNER + '\n' + exportToMarkdown(data);
}

function main(): void {
  const check = process.argv.includes('--check');
  const data = loadData();
  const cvMd = renderCvMd(data);

  if (check) {
    const committed = existsSync(CV_MD) ? readFileSync(CV_MD, 'utf8') : '';
    if (committed !== cvMd) {
      console.error('error: CV.md is out of sync with data/cv.json — run `npm run build` and commit the result');
      process.exit(1);
    }
    console.log('CV.md is in sync with data/cv.json');
    return;
  }

  writeFileSync(CV_MD, cvMd);

  mkdirSync(join(DIST, 'assets'), { recursive: true });
  const hasPhoto = existsSync(HEADSHOT);
  if (hasPhoto) copyFileSync(HEADSHOT, join(DIST, 'assets', 'headshot.jpg'));

  writeFileSync(join(DIST, 'cv.md'), exportToMarkdown(data));
  writeFileSync(join(DIST, 'cv.txt'), exportToASCII(data));
  for (const template of latexTemplates) {
    writeFileSync(join(DIST, `cv-${template.id}.tex`), template.render(data));
  }
  // Normalized copy of the canonical data (drop the local $schema pointer so
  // the published file is exactly what CV Builder Pro imports).
  const publishable: Record<string, unknown> = { ...(JSON.parse(readFileSync(DATA_FILE, 'utf8')) as Record<string, unknown>) };
  delete publishable['$schema'];
  writeFileSync(join(DIST, 'cv.json'), JSON.stringify(publishable, null, 2) + '\n');

  // The PDF comes from the artisanal lane (cv.tex): the publish workflow
  // recompiles cv.pdf in place before running this build, and locally the
  // committed render is used as-is.
  const rootPdf = join(ROOT, 'cv.pdf');
  const hasPdf = existsSync(rootPdf);
  if (hasPdf) copyFileSync(rootPdf, join(DIST, 'cv.pdf'));
  writeFileSync(
    join(DIST, 'index.html'),
    exportToHTML(data, {
      updated: dataUpdatedDate(),
      hasPhoto,
      hasPdf,
      editUrl: EDIT_URL,
      sourceUrl: SOURCE_URL
    })
  );

  console.log(`built: CV.md + dist/{index.html, cv.md, cv.txt, ${latexTemplates.map((t) => `cv-${t.id}.tex`).join(', ')}, cv.json}`);
}

const isDirectRun = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) main();
