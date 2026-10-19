// Engine test suite — run with `npm test` (node:test via tsx).
// The real data/cv.json doubles as the golden fixture; the hub registry has
// long noted this repo is "the natural golden fixture for cv-builder-pro's
// LaTeX exporter", and these tests make that official.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CVData } from './types.ts';
import { validateCVData } from './validate.ts';
import { exportToMarkdown } from './markdown.ts';
import { exportToASCII } from './ascii.ts';
import { escapeLatex, generateLaTeX, latexTemplates } from './latex.ts';
import { exportToHTML } from './html.ts';
import { texText, renderTexSections } from './tex.ts';
import { committedSurfaces, loadData, ROOT } from './build.ts';

const data: CVData = loadData();

test('data/cv.json validates against the CVData contract', () => {
  const raw: unknown = JSON.parse(readFileSync(new URL('../data/cv.json', import.meta.url), 'utf8'));
  const { errors } = validateCVData(raw);
  assert.deepEqual(errors, []);
});

test('validator rejects broken data', () => {
  const broken = {
    personalInfo: { fullName: 42 },
    experience: [{ company: 'X' }],
    education: 'nope',
    projects: [],
    skills: [{ category: 'A', skills: ['a', 1] }],
    certifications: [],
    languages: {}
  };
  const { errors } = validateCVData(broken);
  assert.ok(errors.some((e) => e.startsWith('personalInfo.fullName')), 'flags wrong type');
  assert.ok(errors.some((e) => e.startsWith('experience[0].id')), 'flags missing id');
  assert.ok(errors.some((e) => e.startsWith('education')), 'flags non-array section');
  assert.ok(errors.some((e) => e.startsWith('skills[0].skills')), 'flags non-string skill');
  assert.ok(errors.some((e) => e.startsWith('languages')), 'flags non-array languages');
});

test('every committed generated surface is in sync with data/cv.json', () => {
  for (const [path, expected] of committedSurfaces(data)) {
    const label = path.slice(ROOT.length + 1);
    assert.ok(existsSync(path), `${label} exists — run \`npm run build\``);
    assert.equal(
      readFileSync(path, 'utf8'),
      expected,
      `${label} drifted from data/cv.json — run \`npm run build\` and commit the result`
    );
  }
});

test('tex sections are ASCII-safe and structurally complete', () => {
  assert.equal(texText('2014–18 · C# — done'), "2014--18 ~$\\cdot$~ C\\# --- done");
  const sections = renderTexSections(data, 'Amr-Headshot_v3.jpg');
  for (const [name, content] of Object.entries(sections)) {
    assert.ok(!/[–—·‘’“”]/.test(content), `${name}: no raw unicode punctuation`);
    assert.ok(content.startsWith('% GENERATED FILE'), `${name}: carries the generated banner`);
  }
  assert.ok(sections['experience.tex'].includes('\\Experience'), 'experience uses the resume.sty macro');
  assert.equal((sections['experience.tex'].match(/\\Experience\n/g) ?? []).length, data.experience.length);
  assert.equal((sections['education.tex'].match(/\\Education\n/g) ?? []).length, data.education.length);
  assert.equal((sections['projects.tex'].match(/\\CompanyProjects\{/g) ?? []).length, data.projects.length);
  assert.ok(sections['skills.tex'].includes('C\\#'), 'skills escape LaTeX specials');
  assert.ok(!sections['skills.tex'].includes('Core Strengths'), 'strengths split into their own section');
  assert.ok(sections['strengths.tex'].includes('multicols'), 'strengths render as the 4-column block');
  assert.ok(sections['heading.tex'].includes('\\faEnvelope'), 'heading keeps the fontawesome contact row');
});

test('markdown export contains the headline facts', () => {
  const md = exportToMarkdown(data);
  assert.ok(md.startsWith(`# ${data.personalInfo.fullName}`));
  for (const exp of data.experience) {
    assert.ok(md.includes(exp.company), `mentions ${exp.company}`);
  }
  for (const edu of data.education) {
    assert.ok(md.includes(edu.institution), `mentions ${edu.institution}`);
  }
});

test('ascii export stays within 80 columns', () => {
  const txt = exportToASCII(data);
  for (const line of txt.split('\n')) {
    assert.ok(line.length <= 80, `line exceeds 80 cols: "${line}"`);
  }
  assert.ok(txt.includes(data.personalInfo.fullName.toUpperCase()));
});

test('escapeLatex escapes every special and is single-pass', () => {
  assert.equal(escapeLatex('C#'), 'C\\#');
  assert.equal(escapeLatex('FP&A'), 'FP\\&A');
  assert.equal(escapeLatex('100%'), '100\\%');
  assert.equal(escapeLatex('a_b'), 'a\\_b');
  assert.equal(escapeLatex('{x}'), '\\{x\\}');
  assert.equal(escapeLatex('\\cmd'), '\\textbackslash{}cmd');
  assert.equal(escapeLatex('~^'), '\\textasciitilde{}\\textasciicircum{}');
});

test('generated LaTeX escapes the real data', () => {
  for (const template of latexTemplates) {
    const tex = template.render(data);
    assert.ok(tex.includes('C\\#'), `${template.id}: C# escaped`);
    assert.ok(!/[^\\]C#/.test(tex), `${template.id}: no raw C#`);
    assert.ok(tex.includes('\\&') || !tex.includes(' & '), `${template.id}: ampersands escaped`);
    assert.ok(tex.trimEnd().endsWith('\\end{document}'), `${template.id}: complete document`);
    assert.ok(tex.includes(escapeLatex(data.personalInfo.fullName)), `${template.id}: has name`);
  }
  assert.throws(() => generateLaTeX('nope', data), /unknown LaTeX template/);
});

test('html export is a complete page with contact links', () => {
  const html = exportToHTML(data, {
    updated: '2026-08-19',
    hasPhoto: false,
    hasPdf: true,
    editUrl: 'https://github.com/bamr87/cv-builder-pro',
    sourceUrl: 'https://github.com/bamr87/cv'
  });
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes('</html>'));
  assert.ok(html.includes(`mailto:${data.personalInfo.email}`));
  assert.ok(html.includes('cv.pdf'), 'links the PDF when present');
  assert.ok(!html.includes('assets/headshot.jpg'), 'no photo when hasPhoto=false');
  // interpolated text is HTML-escaped
  assert.ok(html.includes('Sr. Manager, Accounting Systems &amp; IT Business Partner'));
});

test('data round-trips through JSON serialization unchanged', () => {
  const clone: unknown = JSON.parse(JSON.stringify(data));
  assert.deepEqual(clone, data);
});
