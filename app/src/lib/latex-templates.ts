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
    \\textbf{\\Huge \\scshape {{fullName}}} \\\\ \\vspace{1pt}
    \\small {{phone}} $|$ \\href{mailto:{{email}}}{\\underline{{{email}}}} $|$ 
    {{#if linkedin}}\\href{{{linkedin}}}{\\underline{LinkedIn}} $|${{/if}}
    {{#if github}}\\href{{{github}}}{\\underline{GitHub}} $|${{/if}}
    {{#if website}}\\href{{{website}}}{\\underline{{{website}}}}{{/if}}
\\end{center}

{{#if summary}}
\\section{Summary}
{{summary}}
{{/if}}

{{#if experience.length}}
\\section{Experience}
  \\resumeSubHeadingListStart
    {{#each experience}}
    \\resumeSubheading
      {{{company}}}{{{position}}}
      {{{startDate}} -- {{#if current}}Present{{else}}{{{endDate}}}{{/if}}}{{{location}}}
      \\resumeItemListStart
        {{#each achievements}}
        \\resumeItem{{{this}}}
        {{/each}}
      \\resumeItemListEnd
    {{/each}}
  \\resumeSubHeadingListEnd
{{/if}}

{{#if education.length}}
\\section{Education}
  \\resumeSubHeadingListStart
    {{#each education}}
    \\resumeSubheading
      {{{institution}}}{{{degree}} in {{{field}}}}
      {{{startDate}} -- {{{endDate}}}}{{{location}}}
    {{/each}}
  \\resumeSubHeadingListEnd
{{/if}}

{{#if projects.length}}
\\section{Projects}
  \\resumeSubHeadingListStart
    {{#each projects}}
    \\resumeSubheading
      {{{name}}}{{#if url}}$|$ \\href{{{url}}}{\\underline{Live Demo}}{{/if}}{{#if github}}$|$ \\href{{{github}}}{\\underline{GitHub}}{{/if}}
      {{{startDate}}{{#if endDate}} -- {{{endDate}}}{{/if}}}{}
      \\resumeItemListStart
        \\resumeItem{{{description}}}
        \\resumeItem{Technologies: {{#each technologies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}}
      \\resumeItemListEnd
    {{/each}}
  \\resumeSubHeadingListEnd
{{/if}}

{{#if skills.length}}
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     {{#each skills}}
     \\textbf{ {{{category}}} }{: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}} \\\\
     {{/each}}
    }}
 \\end{itemize}
{{/if}}

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

\\name{{{{fullName}}}}{}
\\title{Curriculum Vitae}
\\address{{{{location}}}}{}{}
\\phone[mobile]{{{{phone}}}}
\\email{{{{email}}}}
{{#if website}}\\homepage{{{website}}}{{/if}}
{{#if linkedin}}\\social[linkedin]{{{linkedin}}}{{/if}}
{{#if github}}\\social[github]{{{github}}}{{/if}}

\\begin{document}
\\makecvtitle

{{#if summary}}
\\section{Research Interests}
{{summary}}
{{/if}}

{{#if education.length}}
\\section{Education}
{{#each education}}
\\cventry{{{startDate}}--{{{endDate}}}}{{{degree}}}{{{institution}}}{{{field}}}{{#if gpa}}{{gpa}}{{/if}}{{#if honors}}{{{honors}}}{{/if}}{}
{{/each}}
{{/if}}

{{#if experience.length}}
\\section{Experience}
{{#each experience}}
\\cventry{{{startDate}}--{{#if current}}Present{{else}}{{{endDate}}}{{/if}}}{{{position}}}{{{company}}}{}{}{{{description}}}
{{/each}}
{{/if}}

{{#if projects.length}}
\\section{Research \& Projects}
{{#each projects}}
\\cventry{{{startDate}}{{#if endDate}}--{{{endDate}}}{{/if}}}{{{name}}}{}{}{}{{description}}
{{/each}}
{{/if}}

{{#if skills.length}}
\\section{Skills}
{{#each skills}}
\\cvitem{{{category}}}{{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}}
{{/each}}
{{/if}}

\\end{document}`
  }
];

export function generateLaTeX(template: LaTeXTemplate, data: any): string {
  let latex = template.template;
  
  // Simple template replacement
  latex = latex.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
  
  // Handle conditionals and loops (simplified)
  latex = latex.replace(/\{\{#if (\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  return latex;
}