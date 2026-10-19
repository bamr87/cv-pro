// Artisanal-lane generator: data/cv.json -> sections/*.tex.
//
// This is what removes the last drift channel: resume.sty + cv.tex stay pure
// LAYOUT (typography, spacing, section order), while every piece of CONTENT
// — heading, education, experience, projects, skills, strengths — is rendered
// here from the canonical data and committed as generated files, sync-gated
// by `npm test` exactly like CV.md. Never edit sections/*.tex by hand.

import { CVData, Experience, formatDate, formatRange } from './types.ts';
import { escapeLatex } from './latex.ts';

// pdflatex + the resume.sty font stack want ASCII-safe punctuation.
const UNICODE_TO_TEX: Array<[RegExp, string]> = [
  [/\u2013/g, '--'], // – en dash
  [/\u2014/g, '---'], // — em dash
  [/\u00b7/g, '~$\\cdot$~'], // · middle dot
  [/\u2018|\u2019/g, "'"],
  [/\u201c|\u201d/g, "''"]
];

export function texText(text: string): string {
  let out = escapeLatex(text);
  for (const [pattern, replacement] of UNICODE_TO_TEX) out = out.replace(pattern, replacement);
  return out;
}

const BANNER =
  '% GENERATED FILE - do not edit by hand.\n' +
  '% Source of truth: data/cv.json; regenerate with `npm run build`.\n' +
  '% Layout lives in resume.sty / cv.tex - edit those for typography, never this file.\n';

// "Industry: FinTech · Scope: North America." -> bold-labelled meta lines,
// matching the old hand-written \IndustryScope/\Dept/\Division look.
function metaLines(description: string): string {
  const segments = description.split(' \u00b7 ').map((s) => s.trim()).filter(Boolean);
  const rendered = segments.map((segment) => {
    const labelled = /^([A-Z][A-Za-z/ ]{0,24}): (.+)$/.exec(segment);
    if (labelled) return `\\textbf{${texText(labelled[1])}}{: ${texText(labelled[2])}}`;
    return texText(segment);
  });
  return rendered.join(' \\\\\n   ');
}

function experienceDates(exp: Experience): string {
  return texText(formatRange(exp.startDate, exp.endDate, exp.current));
}

export function renderHeading(data: CVData, headshotFile: string | null): string {
  const p = data.personalInfo;
  const contact: string[] = [];
  if (p.phone) contact.push(`\\raisebox{-0.1\\height}\\faPhone\\ ${texText(p.phone)}`);
  if (p.email) contact.push(`\\href{mailto:${p.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\ ${texText(p.email)}}`);
  if (p.linkedin) contact.push(`\\href{${p.linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\ ${texText(p.linkedin.replace(/^https?:\/\//, ''))}}`);
  if (p.github) contact.push(`\\href{${p.github}}{\\raisebox{-0.2\\height}\\faGithub\\ ${texText(p.github.replace(/^https?:\/\//, ''))}}`);
  if (p.website) contact.push(`\\href{${p.website}}{\\raisebox{-0.2\\height}\\faGlobe\\ ${texText(p.website.replace(/^https?:\/\//, ''))}}`);

  const photo = headshotFile
    ? `\\includegraphics[width=0.15\\linewidth]{${headshotFile}}\n\n% Center Contact Information\n\\vspace{-10mm}\n`
    : '';

  return `${BANNER}
${photo}\\begin{center}
  \\vspace{-10mm}
    {\\Huge \\scshape ${texText(p.fullName)}} \\\\ \\vspace{1pt}
    {\\Large ${texText(p.location)}} \\\\ \\vspace{6mm}
    \\small ${contact.join(' ~\n    ')}
    \\vspace{-8pt}
\\end{center}
`;
}

export function renderEducation(data: CVData): string {
  const out: string[] = [BANNER, '\\resumeSubHeadingListStart', ''];
  for (const edu of data.education) {
    const meta: string[] = [];
    if (edu.gpa) meta.push(`\\textbf{GPA}{: ${texText(edu.gpa)}}`);
    if (edu.honors) meta.push(metaLines(edu.honors));
    out.push(`\\Education
  {${texText(edu.institution)}}
  {${texText(formatDate(edu.startDate))} -- ${texText(formatDate(edu.endDate))}}
  {${texText(edu.degree)} in ${texText(edu.field)}}
  {${texText(edu.location ?? '')}}${meta.length ? `\n  [${meta.join(' \\\\\n   ')}]` : ''}
`);
  }
  out.push('\\resumeSubHeadingListEnd');
  return out.join('\n') + '\n';
}

export function renderExperience(data: CVData): string {
  const out: string[] = [BANNER, '\\resumeSubHeadingListStart', ''];
  for (const exp of data.experience) {
    const items = exp.achievements.map((a) => `    \\RItem{${texText(a)}}`).join('\n');
    out.push(`\\Experience
  {${texText(exp.company)}}
  {${experienceDates(exp)}}
  {${texText(exp.position)}}
  {${texText(exp.location ?? '')}}${exp.description ? `\n  [${metaLines(exp.description)}]` : ''}
  {
${items}
  }
`);
  }
  out.push('\\resumeSubHeadingListEnd');
  return out.join('\n') + '\n';
}

export function renderProjects(data: CVData): string {
  const out: string[] = [BANNER, '\\resumeSubHeadingListStart', ''];
  for (const project of data.projects) {
    const items: string[] = [`  \\RItem{${texText(project.description)}}`];
    if (project.technologies.length > 0) {
      items.push(`  \\RItem{\\emph{${texText(project.technologies.join(', '))}}}`);
    }
    out.push(`\\CompanyProjects{${texText(project.name)}}{
${items.join('\n')}
}
`);
  }
  out.push('\\resumeSubHeadingListEnd');
  return out.join('\n') + '\n';
}

export const STRENGTHS_CATEGORY = 'Core Strengths';

export function renderSkills(data: CVData): string {
  const groups = data.skills.filter((g) => g.category !== STRENGTHS_CATEGORY);
  const lines = groups.map(
    (g) => `    \\textbf{${texText(g.category)}}{: ${texText(g.skills.join(', '))}}`
  );
  return `${BANNER}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small\\item{
${lines.join(' \\\\\n')}
  }
\\end{itemize}
\\vspace{-16pt}
`;
}

export function renderStrengths(data: CVData): string {
  const strengths = data.skills.find((g) => g.category === STRENGTHS_CATEGORY)?.skills ?? [];
  if (strengths.length === 0) {
    return `${BANNER}% no "${STRENGTHS_CATEGORY}" skill group in data/cv.json\n`;
  }
  const items = strengths.map((s) => `    \\item ${texText(s)}`).join('\n');
  return `${BANNER}
\\begin{multicols}{4}
  \\begin{itemize}[itemsep=-5pt, parsep=3pt]
${items}
  \\end{itemize}
\\end{multicols}
\\vspace*{2.0\\multicolsep}
`;
}

export interface TexSections {
  [filename: string]: string;
}

export function renderTexSections(data: CVData, headshotFile: string | null): TexSections {
  return {
    'heading.tex': renderHeading(data, headshotFile),
    'education.tex': renderEducation(data),
    'experience.tex': renderExperience(data),
    'projects.tex': renderProjects(data),
    'skills.tex': renderSkills(data),
    'strengths.tex': renderStrengths(data)
  };
}
