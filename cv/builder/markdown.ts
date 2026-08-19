// Markdown exporter — ported from bamr87/cv-builder-pro
// (src/lib/export-utils.ts exportToMarkdown), with date prettification and the
// optional Experience.location extension. Output stays one-paragraph-per-line,
// which is also this fleet's markdown house rule (markdown-oneline gate).

import { CVData, formatRange, formatDate } from './types.ts';

export function exportToMarkdown(data: CVData): string {
  const md: string[] = [];

  md.push(`# ${data.personalInfo.fullName}`);
  md.push('');

  const contact: string[] = [];
  if (data.personalInfo.email) contact.push(`📧 ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contact.push(`📱 ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contact.push(`📍 ${data.personalInfo.location}`);
  if (data.personalInfo.website) contact.push(`🌐 [Website](${data.personalInfo.website})`);
  if (data.personalInfo.linkedin) contact.push(`💼 [LinkedIn](${data.personalInfo.linkedin})`);
  if (data.personalInfo.github) contact.push(`💻 [GitHub](${data.personalInfo.github})`);

  if (contact.length > 0) {
    md.push(contact.join(' | '));
    md.push('');
  }

  if (data.personalInfo.summary) {
    md.push('## Summary');
    md.push('');
    md.push(data.personalInfo.summary);
    md.push('');
  }

  if (data.experience.length > 0) {
    md.push('## Experience');
    md.push('');

    data.experience.forEach((exp) => {
      md.push(`### ${exp.position} at ${exp.company}`);
      const where = exp.location ? ` | ${exp.location}` : '';
      md.push(`*${formatRange(exp.startDate, exp.endDate, exp.current)}${where}*`);
      md.push('');
      if (exp.description) {
        md.push(exp.description);
        md.push('');
      }
      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          md.push(`- ${achievement}`);
        });
        md.push('');
      }
    });
  }

  if (data.education.length > 0) {
    md.push('## Education');
    md.push('');

    data.education.forEach((edu) => {
      md.push(`### ${edu.degree} in ${edu.field}`);
      const where = edu.location ? ` | ${edu.location}` : '';
      md.push(`**${edu.institution}**${where} | ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`);
      md.push('');
      if (edu.gpa) md.push(`- GPA: ${edu.gpa}`);
      if (edu.honors) md.push(`- Honors: ${edu.honors}`);
      if (edu.gpa || edu.honors) md.push('');
    });
  }

  if (data.projects.length > 0) {
    md.push('## Projects');
    md.push('');

    data.projects.forEach((project) => {
      md.push(`### ${project.name}`);
      md.push('');
      md.push(project.description);
      md.push('');
      if (project.technologies.length > 0) {
        md.push(`**Technologies:** ${project.technologies.join(', ')}`);
        md.push('');
      }
      if (project.url) md.push(`🔗 [Live Demo](${project.url})`);
      if (project.github) md.push(`💻 [Source Code](${project.github})`);
      if (project.url || project.github) md.push('');
    });
  }

  if (data.skills.length > 0) {
    md.push('## Skills');
    md.push('');

    data.skills.forEach((skillGroup) => {
      md.push(`**${skillGroup.category}:** ${skillGroup.skills.join(', ')}`);
      md.push('');
    });
  }

  if (data.certifications.length > 0) {
    md.push('## Certifications');
    md.push('');
    data.certifications.forEach((cert) => {
      md.push(`- ${cert}`);
    });
    md.push('');
  }

  if (data.languages.length > 0) {
    md.push('## Languages');
    md.push('');
    md.push(data.languages.join(', '));
    md.push('');
  }

  while (md.length > 0 && md[md.length - 1] === '') md.pop();
  return md.join('\n') + '\n';
}
