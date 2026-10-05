import { LaTeXTemplate } from '../types/cv';

export const latexTemplates: LaTeXTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean, simple design perfect for any industry',
    category: 'minimal',
    template: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape \$\{fullName\}} \\\\ \\vspace{1pt}
    \\small \$\{phone\} $|$ \\href{mailto:\$\{email\}}{\\underline{\$\{email\}}} $|$ 
    \$\{linkedin ? \`\\href{\$\{linkedin\}}{\\underline{LinkedIn}} $|$\` : ''\}
    \$\{github ? \`\\href{\$\{github\}}{\\underline{GitHub}} $|$\` : ''\}
    \$\{website ? \`\\href{\$\{website\}}{\\underline{\$\{website\}}}\` : ''\}
\\end{center}

\$\{summary ? \`\\section{Summary}
\$\{summary\}\` : ''\}

\$\{experience?.length ? \`\\section{Experience}
  \\resumeSubHeadingListStart
\$\{experience.map(exp => \`    \\resumeSubheading
      {\$\{exp.company\}}{\$\{exp.position\}}
      {\$\{exp.startDate\} -- \$\{exp.current ? 'Present' : exp.endDate\}}{\$\{exp.location\}}
      \\resumeItemListStart
\$\{exp.achievements?.map(achievement => \`        \\resumeItem{\$\{achievement\}}\`).join('\\n') || ''\}
      \\resumeItemListEnd\`).join('\\n')}
  \\resumeSubHeadingListEnd\` : ''\}

\$\{education?.length ? \`\\section{Education}
  \\resumeSubHeadingListStart
\$\{education.map(edu => \`    \\resumeSubheading
      {\$\{edu.institution\}}{\$\{edu.degree\} in \$\{edu.field\}}
      {\$\{edu.startDate\} -- \$\{edu.endDate\}}{\$\{edu.location\}}\`).join('\\n')}
  \\resumeSubHeadingListEnd\` : ''\}

\$\{projects?.length ? \`\\section{Projects}
  \\resumeSubHeadingListStart
\$\{projects.map(project => \`    \\resumeSubheading
      {\$\{project.name\}}\$\{project.url ? \`$|$ \\href{\$\{project.url\}}{\\underline{Live Demo}}\` : ''\}\$\{project.github ? \`$|$ \\href{\$\{project.github\}}{\\underline{GitHub}}\` : ''\}
      {\$\{project.startDate\}\$\{project.endDate ? \` -- \$\{project.endDate\}\` : ''\}}{}
      \\resumeItemListStart
        \\resumeItem{\$\{project.description\}}
        \\resumeItem{Technologies: \$\{project.technologies?.join(', ') || ''\}}
      \\resumeItemListEnd\`).join('\\n')}
  \\resumeSubHeadingListEnd\` : ''\}

\$\{skills?.length ? \`\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
\$\{skills.map(skill => \`     \\textbf{ \$\{skill.category\} }{: \$\{skill.skills?.join(', ') || ''\}} \\\\\`).join('\\n')}
    }}
 \\end{itemize}\` : ''\}

\\end{document}`
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Formal academic style with emphasis on publications and research',
    category: 'academic',
    template: `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}
\\usepackage[scale=0.75]{geometry}

\\name{\$\{fullName\}}{}
\\title{Curriculum Vitae}
\\address{\$\{location\}}{}{}
\\phone[mobile]{\$\{phone\}}
\\email{\$\{email\}}
\$\{website ? \`\\homepage{\$\{website\}}\` : ''\}
\$\{linkedin ? \`\\social[linkedin]{\$\{linkedin\}}\` : ''\}
\$\{github ? \`\\social[github]{\$\{github\}}\` : ''\}

\\begin{document}
\\makecvtitle

\$\{summary ? \`\\section{Research Interests}
\$\{summary\}\` : ''\}

\$\{education?.length ? \`\\section{Education}
\$\{education.map(edu => \`\\cventry{\$\{edu.startDate\}--\$\{edu.endDate\}}{\$\{edu.degree\}}{\$\{edu.institution\}}{\$\{edu.field\}}\$\{edu.gpa ? edu.gpa : ''}\$\{edu.honors ? edu.honors : ''\}{}\`).join('\\n')}\` : ''\}

\$\{experience?.length ? \`\\section{Experience}
\$\{experience.map(exp => \`\\cventry{\$\{exp.startDate\}--\$\{exp.current ? 'Present' : exp.endDate\}}{\$\{exp.position\}}{\$\{exp.company\}}{}{}{\$\{exp.description\}}\`).join('\\n')}\` : ''\}

\$\{projects?.length ? \`\\section{Research & Projects}
\$\{projects.map(project => \`\\cventry{\$\{project.startDate\}\$\{project.endDate ? \`--\$\{project.endDate\}\` : ''\}}{\$\{project.name\}}{}{}{}{\$\{project.description\}}\`).join('\\n')}\` : ''\}

\$\{skills?.length ? \`\\section{Skills}
\$\{skills.map(skill => \`\\cvitem{\$\{skill.category\}}{\$\{skill.skills?.join(', ') || ''\}}\`).join('\\n')}\` : ''\}

\\end{document}`
  }
];

// LaTeX-escape user content so real-world values (C#, FP&A, 100%, snake_case)
// produce compilable documents instead of breaking the template. Escaping runs
// over the normalized data before interpolation, so the templates themselves
// stay untouched.
const LATEX_SPECIALS: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

export function escapeLatex(text: string): string {
  return text.replace(/[\\&%$#_{}~^]/g, (ch) => LATEX_SPECIALS[ch]);
}

function escapeDeep<T>(value: T): T {
  if (typeof value === 'string') return escapeLatex(value) as unknown as T;
  if (Array.isArray(value)) return value.map(escapeDeep) as unknown as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, escapeDeep(v)])
    ) as unknown as T;
  }
  return value;
}

export function generateLaTeX(template: LaTeXTemplate, data: any): string {
  // Use Function constructor to create a template function
  // This safely evaluates the template string with the provided data
  try {
    // Normalize incoming CVData into the flat shape expected by the templates
    const normalized = (() => {
      const personal = data?.personalInfo ?? {};
      const normalizedExperience = (data?.experience ?? []).map((exp: any) => ({
        ...exp,
        // Ensure properties referenced in templates exist
        achievements: Array.isArray(exp?.achievements) ? exp.achievements : [],
        location: exp?.location ?? '',
      }));
      const normalizedEducation = (data?.education ?? []).map((edu: any) => ({
        ...edu,
        location: edu?.location ?? '',
      }));
      const normalizedProjects = (data?.projects ?? []).map((proj: any) => ({
        ...proj,
        technologies: Array.isArray(proj?.technologies) ? proj.technologies : [],
      }));

      return escapeDeep({
        fullName: personal.fullName ?? '',
        phone: personal.phone ?? '',
        email: personal.email ?? '',
        linkedin: personal.linkedin ?? '',
        github: personal.github ?? '',
        website: personal.website ?? '',
        location: personal.location ?? '',
        summary: personal.summary ?? '',
        experience: normalizedExperience,
        education: normalizedEducation,
        projects: normalizedProjects,
        skills: Array.isArray(data?.skills) ? data.skills : [],
      });
    })();

    const templateFunction = new Function('data', `
      const {
        fullName = '', phone = '', email = '', linkedin = '', github = '', website = '',
        summary = '', experience = [], education = [], projects = [], skills = [], location = ''
      } = data;
      return \`${template.template}\`;
    `);

    return templateFunction(normalized);
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    return template.template; // Return raw template if evaluation fails
  }
}