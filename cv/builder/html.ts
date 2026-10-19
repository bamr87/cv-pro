// HTML exporter — the machine's publishing surface (GitHub Pages).
// Emits one self-contained page: no external assets beyond the optional
// headshot, system fonts only, dark-mode aware, and print-friendly enough that
// "Print → Save as PDF" from the browser yields a usable resume.

import { CVData, formatRange, formatDate } from './types.ts';

export interface HtmlOptions {
  updated: string; // ISO date shown in the footer
  hasPhoto: boolean; // whether assets/headshot.jpg is alongside the page
  hasPdf: boolean; // whether cv.pdf is alongside the page
  editUrl: string; // where the companion editor lives
  sourceUrl: string; // this repo
}

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function contactChips(data: CVData): string {
  const p = data.personalInfo;
  const chips: string[] = [];
  if (p.email) chips.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
  if (p.phone) chips.push(`<a href="tel:${esc(p.phone.replace(/[^+\d]/g, ''))}">${esc(p.phone)}</a>`);
  if (p.website) chips.push(`<a href="${esc(p.website)}">${esc(p.website.replace(/^https?:\/\//, ''))}</a>`);
  if (p.linkedin) chips.push(`<a href="${esc(p.linkedin)}">LinkedIn</a>`);
  if (p.github) chips.push(`<a href="${esc(p.github)}">GitHub</a>`);
  return chips.map((c) => `<span class="chip">${c}</span>`).join('\n        ');
}

export function exportToHTML(data: CVData, opts: HtmlOptions): string {
  const p = data.personalInfo;
  const sections: string[] = [];

  if (p.summary) {
    sections.push(`<section id="summary">
      <h2>Summary</h2>
      <p>${esc(p.summary)}</p>
    </section>`);
  }

  if (data.experience.length > 0) {
    const entries = data.experience
      .map((exp) => {
        const bullets = exp.achievements.map((a) => `<li>${esc(a)}</li>`).join('\n            ');
        return `<article class="entry">
          <header>
            <h3>${esc(exp.position)}</h3>
            <p class="org">${esc(exp.company)}${exp.location ? ` · ${esc(exp.location)}` : ''}</p>
            <p class="dates">${esc(formatRange(exp.startDate, exp.endDate, exp.current))}</p>
          </header>
          ${exp.description ? `<p class="desc">${esc(exp.description)}</p>` : ''}
          ${bullets ? `<ul>\n            ${bullets}\n          </ul>` : ''}
        </article>`;
      })
      .join('\n        ');
    sections.push(`<section id="experience">
      <h2>Experience</h2>
        ${entries}
    </section>`);
  }

  if (data.projects.length > 0) {
    const entries = data.projects
      .map((project) => {
        const links: string[] = [];
        if (project.url) links.push(`<a href="${esc(project.url)}">live</a>`);
        if (project.github) links.push(`<a href="${esc(project.github)}">source</a>`);
        return `<article class="entry compact">
          <h3>${esc(project.name)}${links.length ? ` <span class="links">${links.join(' · ')}</span>` : ''}</h3>
          <p class="desc">${esc(project.description)}${
            project.technologies.length ? ` <span class="tech">${esc(project.technologies.join(', '))}</span>` : ''
          }</p>
        </article>`;
      })
      .join('\n        ');
    sections.push(`<section id="projects">
      <h2>Projects</h2>
        ${entries}
    </section>`);
  }

  if (data.skills.length > 0) {
    const rows = data.skills
      .map(
        (group) => `<div class="skill-row"><dt>${esc(group.category)}</dt><dd>${esc(group.skills.join(', '))}</dd></div>`
      )
      .join('\n        ');
    sections.push(`<section id="skills">
      <h2>Skills</h2>
      <dl class="skills">
        ${rows}
      </dl>
    </section>`);
  }

  if (data.education.length > 0) {
    const entries = data.education
      .map((edu) => {
        const notes = [edu.gpa ? `GPA ${edu.gpa}` : '', edu.honors ?? ''].filter(Boolean).join(' · ');
        return `<article class="entry compact">
          <h3>${esc(edu.degree)} in ${esc(edu.field)}</h3>
          <p class="org">${esc(edu.institution)}${edu.location ? ` · ${esc(edu.location)}` : ''}</p>
          <p class="dates">${esc(formatDate(edu.startDate))} – ${esc(formatDate(edu.endDate))}${notes ? ` · ${esc(notes)}` : ''}</p>
        </article>`;
      })
      .join('\n        ');
    sections.push(`<section id="education">
      <h2>Education</h2>
        ${entries}
    </section>`);
  }

  if (data.certifications.length > 0) {
    sections.push(`<section id="certifications">
      <h2>Certifications</h2>
      <ul>
        ${data.certifications.map((c) => `<li>${esc(c)}</li>`).join('\n        ')}
      </ul>
    </section>`);
  }

  if (data.languages.length > 0) {
    sections.push(`<section id="languages">
      <h2>Languages</h2>
      <p>${esc(data.languages.join(', '))}</p>
    </section>`);
  }

  const downloads: string[] = [];
  if (opts.hasPdf) downloads.push('<a href="cv.pdf">PDF</a>');
  downloads.push('<a href="cv.md">Markdown</a>');
  downloads.push('<a href="cv.txt">Plain text</a>');
  downloads.push('<a href="cv-minimal.tex">LaTeX</a>');
  downloads.push('<a href="cv.json">JSON data</a>');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.fullName)} — CV</title>
<meta name="description" content="CV of ${esc(p.fullName)}. Generated from structured data by the bamr87/cv machine.">
<style>
  :root {
    --bg: #ffffff;
    --ink: #1b2733;
    --muted: #5b6b7b;
    --line: #dbe2e8;
    --accent: #0b5fa5;
    --chip-bg: #f1f5f8;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #10161c;
      --ink: #e6edf3;
      --muted: #9fb0c0;
      --line: #2c3945;
      --accent: #6cb2ee;
      --chip-bg: #1a232c;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  main { max-width: 60rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .masthead { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
  .masthead img { width: 96px; height: 96px; object-fit: cover; border-radius: 50%; border: 2px solid var(--line); }
  .masthead h1 { margin: 0; font-size: 2.1rem; letter-spacing: 0.01em; }
  .masthead .where { margin: 0.15rem 0 0.6rem; color: var(--muted); }
  .chip { display: inline-block; background: var(--chip-bg); border: 1px solid var(--line); border-radius: 999px; padding: 0.15rem 0.7rem; margin: 0 0.35rem 0.35rem 0; font-size: 0.85rem; white-space: nowrap; }
  h2 { font-size: 1.05rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); border-bottom: 1px solid var(--line); padding-bottom: 0.3rem; margin: 2.2rem 0 1rem; }
  .entry { margin-bottom: 1.4rem; }
  .entry header { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "title dates" "org dates"; column-gap: 1rem; }
  .entry h3 { margin: 0; font-size: 1.02rem; grid-area: title; }
  .entry .org { margin: 0; color: var(--muted); grid-area: org; }
  .entry .dates { margin: 0; color: var(--muted); font-size: 0.9rem; white-space: nowrap; grid-area: dates; align-self: start; }
  .entry .desc { margin: 0.35rem 0 0.2rem; }
  .entry ul { margin: 0.3rem 0 0; padding-left: 1.2rem; }
  .entry li { margin: 0.15rem 0; }
  .entry.compact { margin-bottom: 0.9rem; }
  .entry.compact h3 { font-size: 0.98rem; }
  .entry.compact p { margin: 0.1rem 0; }
  .entry .links { font-weight: normal; font-size: 0.85rem; }
  .tech { color: var(--muted); font-size: 0.9rem; }
  .skills { margin: 0; }
  .skill-row { display: grid; grid-template-columns: 14rem 1fr; gap: 0.6rem; padding: 0.3rem 0; border-bottom: 1px dashed var(--line); }
  .skill-row dt { font-weight: 600; }
  .skill-row dd { margin: 0; color: var(--muted); }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line); color: var(--muted); font-size: 0.85rem; }
  footer .downloads a { margin-right: 0.8rem; }
  @media (max-width: 640px) {
    .entry header { grid-template-columns: 1fr; grid-template-areas: "title" "org" "dates"; }
    .entry .dates { white-space: normal; }
    .skill-row { grid-template-columns: 1fr; gap: 0.1rem; }
  }
  @media print {
    :root { --bg: #fff; --ink: #000; --muted: #333; --line: #999; --accent: #000; --chip-bg: #fff; }
    body { font-size: 10.5pt; }
    main { max-width: none; padding: 0; }
    .masthead img { width: 72px; height: 72px; }
    h2 { margin: 1rem 0 0.5rem; }
    a { color: inherit; }
    footer { display: none; }
  }
</style>
</head>
<body>
<main>
  <header class="masthead">
    ${opts.hasPhoto ? '<img src="assets/headshot.jpg" alt="Headshot">' : ''}
    <div>
      <h1>${esc(p.fullName)}</h1>
      <p class="where">${esc(p.location)}</p>
      <div class="contact">
        ${contactChips(data)}
      </div>
    </div>
  </header>

  ${sections.join('\n\n  ')}

  <footer>
    <p class="downloads"><strong>Download:</strong> ${downloads.join(' ')}</p>
    <p>Generated from <a href="${esc(opts.sourceUrl)}/blob/main/data/cv.json">data/cv.json</a> by the <a href="${esc(opts.sourceUrl)}">bamr87/cv</a> build machine · Updated ${esc(opts.updated)} · <a href="${esc(opts.editUrl)}">Edit with CV Builder Pro</a></p>
  </footer>
</main>
</body>
</html>
`;
}
