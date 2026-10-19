// LaTeX exporter — ported from bamr87/cv-builder-pro (src/lib/latex-templates.ts).
// The app evaluates template strings with `new Function`; here each template is
// a plain typed function producing the same document structure. Two deliberate
// upgrades over the app version: all interpolated values are LaTeX-escaped
// (real data contains `C#`, `FP&A`, …) and dates are prettified.
// These templates are the *generated lane*; the hand-tuned cv.tex + resume.sty
// in the repo root remain the artisanal lane.

import { CVData, Experience, formatRange, formatDate } from './types.ts';

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
  '^': '\\textasciicircum{}'
};

export function escapeLatex(text: string): string {
  return text.replace(/[\\&%$#_{}~^]/g, (ch) => LATEX_SPECIALS[ch]);
}

export interface LaTeXTemplate {
  id: string;
  name: string;
  description: string;
  render: (data: CVData) => string;
}

function dateRange(exp: Experience): string {
  return escapeLatex(formatRange(exp.startDate, exp.endDate, exp.current));
}

function renderMinimal(data: CVData): string {
  const p = data.personalInfo;
  const e = escapeLatex;
  const out: string[] = [];

  out.push(String.raw`\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}
`);

  const contactParts: string[] = [];
  if (p.phone) contactParts.push(e(p.phone));
  if (p.email) contactParts.push(String.raw`\href{mailto:${p.email}}{\underline{${e(p.email)}}}`);
  if (p.linkedin) contactParts.push(String.raw`\href{${p.linkedin}}{\underline{LinkedIn}}`);
  if (p.github) contactParts.push(String.raw`\href{${p.github}}{\underline{GitHub}}`);
  if (p.website) contactParts.push(String.raw`\href{${p.website}}{\underline{${e(p.website.replace(/^https?:\/\//, ''))}}}`);

  out.push(String.raw`\begin{center}
    \textbf{\Huge \scshape ${e(p.fullName)}} \\ \vspace{1pt}
    \small ${contactParts.join(' $|$ ')}
\end{center}
`);

  if (p.summary) {
    out.push(String.raw`\section{Summary}
${e(p.summary)}
`);
  }

  if (data.experience.length > 0) {
    out.push(String.raw`\section{Experience}
  \resumeSubHeadingListStart`);
    for (const exp of data.experience) {
      out.push(String.raw`    \resumeSubheading
      {${e(exp.company)}}{${e(exp.position)}}
      {${dateRange(exp)}}{${e(exp.location ?? '')}}`);
      const items = [exp.description, ...exp.achievements].filter(Boolean);
      if (items.length > 0) {
        out.push(String.raw`      \resumeItemListStart`);
        for (const item of items) {
          out.push(String.raw`        \resumeItem{${e(item)}}`);
        }
        out.push(String.raw`      \resumeItemListEnd`);
      }
    }
    out.push(String.raw`  \resumeSubHeadingListEnd
`);
  }

  if (data.education.length > 0) {
    out.push(String.raw`\section{Education}
  \resumeSubHeadingListStart`);
    for (const edu of data.education) {
      const detail = [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors ?? ''].filter(Boolean).join(' · ');
      out.push(String.raw`    \resumeSubheading
      {${e(edu.institution)}}{${e(edu.degree)} in ${e(edu.field)}}
      {${e(formatDate(edu.startDate))} -- ${e(formatDate(edu.endDate))}}{${e(edu.location ?? '')}}`);
      if (detail) {
        out.push(String.raw`      \resumeItemListStart
        \resumeItem{${e(detail)}}
      \resumeItemListEnd`);
      }
    }
    out.push(String.raw`  \resumeSubHeadingListEnd
`);
  }

  if (data.projects.length > 0) {
    out.push(String.raw`\section{Projects}
  \resumeSubHeadingListStart`);
    for (const project of data.projects) {
      const links: string[] = [];
      if (project.url) links.push(String.raw`\href{${project.url}}{\underline{Live}}`);
      if (project.github) links.push(String.raw`\href{${project.github}}{\underline{Source}}`);
      const range = `${formatDate(project.startDate)}${project.endDate ? ` -- ${formatDate(project.endDate)}` : ''}`;
      out.push(String.raw`    \resumeSubheading
      {${e(project.name)}}{${links.join(' $|$ ')}}
      {${e(range)}}{}
      \resumeItemListStart
        \resumeItem{${e(project.description)}}`);
      if (project.technologies.length > 0) {
        out.push(String.raw`        \resumeItem{Technologies: ${e(project.technologies.join(', '))}}`);
      }
      out.push(String.raw`      \resumeItemListEnd`);
    }
    out.push(String.raw`  \resumeSubHeadingListEnd
`);
  }

  if (data.skills.length > 0) {
    out.push(String.raw`\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{`);
    for (const skill of data.skills) {
      out.push(String.raw`     \textbf{${e(skill.category)}}{: ${e(skill.skills.join(', '))}} \\`);
    }
    out.push(String.raw`    }}
 \end{itemize}
`);
  }

  if (data.certifications.length > 0) {
    out.push(String.raw`\section{Certifications}
 \begin{itemize}[leftmargin=0.15in]`);
    for (const cert of data.certifications) {
      out.push(String.raw`    \small\item{${e(cert)}}`);
    }
    out.push(String.raw` \end{itemize}
`);
  }

  if (data.languages.length > 0) {
    out.push(String.raw`\section{Languages}
${e(data.languages.join(', '))}
`);
  }

  out.push(String.raw`\end{document}`);
  return out.join('\n') + '\n';
}

function renderAcademic(data: CVData): string {
  const p = data.personalInfo;
  const e = escapeLatex;
  const out: string[] = [];

  out.push(String.raw`\documentclass[11pt,a4paper,sans]{moderncv}
\moderncvstyle{classic}
\moderncvcolor{blue}
\usepackage[scale=0.75]{geometry}

\name{${e(p.fullName)}}{}
\title{Curriculum Vitae}
\address{${e(p.location)}}{}{}
\phone[mobile]{${e(p.phone)}}
\email{${p.email}}`);
  if (p.website) out.push(String.raw`\homepage{${p.website.replace(/^https?:\/\//, '')}}`);
  if (p.linkedin) out.push(String.raw`\social[linkedin]{${p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}}`);
  if (p.github) out.push(String.raw`\social[github]{${p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')}}`);

  out.push(String.raw`
\begin{document}
\makecvtitle
`);

  if (p.summary) {
    out.push(String.raw`\section{Profile}
\cvitem{}{${e(p.summary)}}
`);
  }

  if (data.education.length > 0) {
    out.push(String.raw`\section{Education}`);
    for (const edu of data.education) {
      const notes = [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors ?? ''].filter(Boolean).join(' · ');
      out.push(
        String.raw`\cventry{${e(formatDate(edu.startDate))}--${e(formatDate(edu.endDate))}}{${e(edu.degree)}}{${e(edu.institution)}}{${e(edu.field)}}{}{${e(notes)}}`
      );
    }
    out.push('');
  }

  if (data.experience.length > 0) {
    out.push(String.raw`\section{Experience}`);
    for (const exp of data.experience) {
      const body = [exp.description, ...exp.achievements.map((a) => `-- ${a}`)].filter(Boolean).map((s) => e(s)).join(String.raw` \newline{} `);
      out.push(
        String.raw`\cventry{${dateRange(exp)}}{${e(exp.position)}}{${e(exp.company)}}{${e(exp.location ?? '')}}{}{${body}}`
      );
    }
    out.push('');
  }

  if (data.projects.length > 0) {
    out.push(String.raw`\section{Research \& Projects}`);
    for (const project of data.projects) {
      const range = `${formatDate(project.startDate)}${project.endDate ? `--${formatDate(project.endDate)}` : ''}`;
      const tech = project.technologies.length > 0 ? ` (${project.technologies.join(', ')})` : '';
      out.push(String.raw`\cventry{${e(range)}}{${e(project.name)}}{}{}{}{${e(project.description + tech)}}`);
    }
    out.push('');
  }

  if (data.skills.length > 0) {
    out.push(String.raw`\section{Skills}`);
    for (const skill of data.skills) {
      out.push(String.raw`\cvitem{${e(skill.category)}}{${e(skill.skills.join(', '))}}`);
    }
    out.push('');
  }

  if (data.certifications.length > 0) {
    out.push(String.raw`\section{Certifications}`);
    for (const cert of data.certifications) {
      out.push(String.raw`\cvlistitem{${e(cert)}}`);
    }
    out.push('');
  }

  if (data.languages.length > 0) {
    out.push(String.raw`\section{Languages}`);
    out.push(String.raw`\cvitem{}{${e(data.languages.join(', '))}}`);
    out.push('');
  }

  out.push(String.raw`\end{document}`);
  return out.join('\n') + '\n';
}

export const latexTemplates: LaTeXTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean, simple design perfect for any industry',
    render: renderMinimal
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Formal academic style (moderncv)',
    render: renderAcademic
  }
];

export function generateLaTeX(templateId: string, data: CVData): string {
  const template = latexTemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`unknown LaTeX template "${templateId}" (have: ${latexTemplates.map((t) => t.id).join(', ')})`);
  }
  return template.render(data);
}
