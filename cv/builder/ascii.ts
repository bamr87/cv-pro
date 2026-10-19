// Plain-text exporter — ported from bamr87/cv-builder-pro
// (src/lib/export-utils.ts exportToASCII), extended for the machine: projects,
// certifications, languages and education honors are included, and prose is
// word-wrapped so every line fits the classic 80-column resume format.

import { CVData, formatRange, formatDate } from './types.ts';

const WIDTH = 80;

function wrap(text: string, indent = ''): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = indent;
  for (const word of words) {
    const candidate = line === indent ? indent + word : `${line} ${word}`;
    if (candidate.length > WIDTH && line !== indent) {
      lines.push(line);
      line = indent + word;
    } else {
      line = candidate;
    }
  }
  if (line.trim()) lines.push(line);
  return lines;
}

function heading(title: string): string[] {
  return [title.toUpperCase(), '-'.repeat(20)];
}

export function exportToASCII(data: CVData): string {
  const lines: string[] = [];

  const name = data.personalInfo.fullName.toUpperCase();
  const padding = Math.max(0, Math.floor((WIDTH - name.length) / 2));
  lines.push('='.repeat(WIDTH));
  lines.push(' '.repeat(padding) + name);
  lines.push('='.repeat(WIDTH));
  lines.push('');

  if (data.personalInfo.email) lines.push(`Email: ${data.personalInfo.email}`);
  if (data.personalInfo.phone) lines.push(`Phone: ${data.personalInfo.phone}`);
  if (data.personalInfo.location) lines.push(`Location: ${data.personalInfo.location}`);
  if (data.personalInfo.website) lines.push(`Website: ${data.personalInfo.website}`);
  if (data.personalInfo.linkedin) lines.push(`LinkedIn: ${data.personalInfo.linkedin}`);
  if (data.personalInfo.github) lines.push(`GitHub: ${data.personalInfo.github}`);
  lines.push('');

  if (data.personalInfo.summary) {
    lines.push(...heading('Summary'));
    lines.push(...wrap(data.personalInfo.summary));
    lines.push('');
  }

  if (data.experience.length > 0) {
    lines.push(...heading('Experience'));

    data.experience.forEach((exp) => {
      lines.push(...wrap(`${exp.position} | ${exp.company}`));
      lines.push(`${formatRange(exp.startDate, exp.endDate, exp.current)}${exp.location ? ` | ${exp.location}` : ''}`);
      if (exp.description) lines.push(...wrap(exp.description));
      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          const wrapped = wrap(achievement, '    ');
          if (wrapped.length > 0) {
            wrapped[0] = '  * ' + wrapped[0].slice(4);
            lines.push(...wrapped);
          }
        });
      }
      lines.push('');
    });
  }

  if (data.education.length > 0) {
    lines.push(...heading('Education'));

    data.education.forEach((edu) => {
      lines.push(...wrap(`${edu.degree} in ${edu.field}`));
      lines.push(...wrap(`${edu.institution}${edu.location ? ` | ${edu.location}` : ''} | ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`));
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.honors) lines.push(`Honors: ${edu.honors}`);
      lines.push('');
    });
  }

  if (data.projects.length > 0) {
    lines.push(...heading('Projects'));

    data.projects.forEach((project) => {
      lines.push(project.name);
      if (project.description) lines.push(...wrap(project.description, '  '));
      if (project.technologies.length > 0) lines.push(...wrap(`Technologies: ${project.technologies.join(', ')}`, '  '));
      if (project.url) lines.push(`  URL: ${project.url}`);
      if (project.github) lines.push(`  Source: ${project.github}`);
      lines.push('');
    });
  }

  if (data.skills.length > 0) {
    lines.push(...heading('Skills'));

    data.skills.forEach((skillGroup) => {
      lines.push(...wrap(`${skillGroup.category}: ${skillGroup.skills.join(', ')}`));
    });
    lines.push('');
  }

  if (data.certifications.length > 0) {
    lines.push(...heading('Certifications'));
    data.certifications.forEach((cert) => {
      const wrapped = wrap(cert, '    ');
      if (wrapped.length > 0) {
        wrapped[0] = '  * ' + wrapped[0].slice(4);
        lines.push(...wrapped);
      }
    });
    lines.push('');
  }

  if (data.languages.length > 0) {
    lines.push(...heading('Languages'));
    lines.push(...wrap(data.languages.join(', ')));
    lines.push('');
  }

  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n') + '\n';
}
