import { CVData } from '../types/cv';

export function exportToMarkdown(data: CVData): string {
  const md: string[] = [];
  
  // Header
  md.push(`# ${data.personalInfo.fullName}`);
  md.push('');
  
  // Contact info
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
  
  // Summary
  if (data.personalInfo.summary) {
    md.push('## Summary');
    md.push('');
    md.push(data.personalInfo.summary);
    md.push('');
  }
  
  // Experience
  if (data.experience.length > 0) {
    md.push('## Experience');
    md.push('');
    
    data.experience.forEach(exp => {
      md.push(`### ${exp.position} at ${exp.company}`);
      md.push(`*${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}*`);
      md.push('');
      md.push(exp.description);
      if (exp.achievements.length > 0) {
        md.push('');
        exp.achievements.forEach(achievement => {
          md.push(`- ${achievement}`);
        });
      }
      md.push('');
    });
  }
  
  // Education
  if (data.education.length > 0) {
    md.push('## Education');
    md.push('');
    
    data.education.forEach(edu => {
      md.push(`### ${edu.degree} in ${edu.field}`);
      md.push(`**${edu.institution}** | ${edu.startDate} - ${edu.endDate}`);
      if (edu.gpa) md.push(`GPA: ${edu.gpa}`);
      if (edu.honors) md.push(`Honors: ${edu.honors}`);
      md.push('');
    });
  }
  
  // Projects
  if (data.projects.length > 0) {
    md.push('## Projects');
    md.push('');
    
    data.projects.forEach(project => {
      md.push(`### ${project.name}`);
      md.push(project.description);
      md.push(`**Technologies:** ${project.technologies.join(', ')}`);
      if (project.url) md.push(`🔗 [Live Demo](${project.url})`);
      if (project.github) md.push(`💻 [Source Code](${project.github})`);
      md.push('');
    });
  }
  
  // Skills
  if (data.skills.length > 0) {
    md.push('## Skills');
    md.push('');
    
    data.skills.forEach(skillGroup => {
      md.push(`**${skillGroup.category}:** ${skillGroup.skills.join(', ')}`);
    });
    md.push('');
  }
  
  // Certifications
  if (data.certifications.length > 0) {
    md.push('## Certifications');
    md.push('');
    data.certifications.forEach(cert => {
      md.push(`- ${cert}`);
    });
    md.push('');
  }
  
  // Languages
  if (data.languages.length > 0) {
    md.push('## Languages');
    md.push('');
    md.push(data.languages.join(', '));
  }
  
  return md.join('\n');
}

export function exportToASCII(data: CVData): string {
  const lines: string[] = [];
  const width = 80;
  
  // Header
  const name = data.personalInfo.fullName.toUpperCase();
  const padding = Math.max(0, Math.floor((width - name.length) / 2));
  lines.push('='.repeat(width));
  lines.push(' '.repeat(padding) + name);
  lines.push('='.repeat(width));
  lines.push('');
  
  // Contact
  if (data.personalInfo.email) lines.push(`Email: ${data.personalInfo.email}`);
  if (data.personalInfo.phone) lines.push(`Phone: ${data.personalInfo.phone}`);
  if (data.personalInfo.location) lines.push(`Location: ${data.personalInfo.location}`);
  if (data.personalInfo.website) lines.push(`Website: ${data.personalInfo.website}`);
  lines.push('');
  
  // Summary
  if (data.personalInfo.summary) {
    lines.push('SUMMARY');
    lines.push('-'.repeat(20));
    lines.push(data.personalInfo.summary);
    lines.push('');
  }
  
  // Experience
  if (data.experience.length > 0) {
    lines.push('EXPERIENCE');
    lines.push('-'.repeat(20));
    
    data.experience.forEach(exp => {
      lines.push(`${exp.position} | ${exp.company}`);
      lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      lines.push(exp.description);
      if (exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          lines.push(`  * ${achievement}`);
        });
      }
      lines.push('');
    });
  }
  
  // Education
  if (data.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(20));
    
    data.education.forEach(edu => {
      lines.push(`${edu.degree} in ${edu.field}`);
      lines.push(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      lines.push('');
    });
  }
  
  // Skills
  if (data.skills.length > 0) {
    lines.push('SKILLS');
    lines.push('-'.repeat(20));
    
    data.skills.forEach(skillGroup => {
      lines.push(`${skillGroup.category}: ${skillGroup.skills.join(', ')}`);
    });
    lines.push('');
  }
  
  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}