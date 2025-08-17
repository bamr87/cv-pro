import { LaTeXTemplate } from '../types/cv';

export const latexTemplates: LaTeXTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean, simple design perfect for any industry',
    category: 'minimal',
    template: '\\documentclass[letterpaper,11pt]{article}\n' +
'\\usepackage{latexsym}\n' +
'\\usepackage[empty]{fullpage}\n' +
'\\usepackage{titlesec}\n' +
'\\usepackage{marvosym}\n' +
'\\usepackage[usenames,dvipsnames]{color}\n' +
'\\usepackage{verbatim}\n' +
'\\usepackage{enumitem}\n' +
'\\usepackage[hidelinks]{hyperref}\n' +
'\\usepackage{fancyhdr}\n' +
'\\usepackage[english]{babel}\n' +
'\\usepackage{tabularx}\n' +
'\n' +
'\\pagestyle{fancy}\n' +
'\\fancyhf{}\n' +
'\\fancyfoot{}\n' +
'\\renewcommand{\\headrulewidth}{0pt}\n' +
'\\renewcommand{\\footrulewidth}{0pt}\n' +
'\n' +
'\\addtolength{\\oddsidemargin}{-0.5in}\n' +
'\\addtolength{\\evensidemargin}{-0.5in}\n' +
'\\addtolength{\\textwidth}{1in}\n' +
'\\addtolength{\\topmargin}{-.5in}\n' +
'\\addtolength{\\textheight}{1.0in}\n' +
'\n' +
'\\urlstyle{same}\n' +
'\n' +
'\\raggedbottom\n' +
'\\raggedright\n' +
'\\setlength{\\tabcolsep}{0in}\n' +
'\n' +
'\\titleformat{\\section}{\n' +
'  \\vspace{-4pt}\\scshape\\raggedright\\large\n' +
'}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]\n' +
'\n' +
'\\newcommand{\\resumeItem}[1]{\n' +
'  \\item\\small{\n' +
'    {#1 \\vspace{-2pt}}\n' +
'  }\n' +
'}\n' +
'\n' +
'\\newcommand{\\resumeSubheading}[4]{\n' +
'  \\vspace{-2pt}\\item\n' +
'    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\n' +
'      \\textbf{#1} & #2 \\\\\n' +
'      \\textit{\\small#3} & \\textit{\\small #4} \\\\\n' +
'    \\end{tabular*}\\vspace{-7pt}\n' +
'}\n' +
'\n' +
'\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}\n' +
'\n' +
'\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}\n' +
'\n' +
'\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}\n' +
'\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}\n' +
'\\newcommand{\\resumeItemListStart}{\\begin{itemize}}\n' +
'\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}\n' +
'\n' +
'\\begin{document}\n' +
'\n' +
'\\begin{center}\n' +
'    \\textbf{\\Huge \\scshape {{fullName}}} \\\\ \\vspace{1pt}\n' +
'    \\small {{phone}} $|$ \\href{mailto:{{email}}}{\\underline{{{email}}}} $|$ \n' +
'    {{#if linkedin}}\\href{{{linkedin}}}{\\underline{LinkedIn}} $|${{/if}}\n' +
'    {{#if github}}\\href{{{github}}}{\\underline{GitHub}} $|${{/if}}\n' +
'    {{#if website}}\\href{{{website}}}{\\underline{{{website}}}}{{/if}}\n' +
'\\end{center}\n' +
'\n' +
'{{#if summary}}\n' +
'\\section{Summary}\n' +
'{{summary}}\n' +
'{{/if}}\n' +
'\n' +
'{{#if experience.length}}\n' +
'\\section{Experience}\n' +
'  \\resumeSubHeadingListStart\n' +
'    {{#each experience}}\n' +
'    \\resumeSubheading\n' +
'      {{{company}}}{{{position}}}\n' +
'      {{{startDate}} -- {{#if current}}Present{{else}}{{{endDate}}}{{/if}}}{{{location}}}\n' +
'      \\resumeItemListStart\n' +
'        {{#each achievements}}\n' +
'        \\resumeItem{{{this}}}\n' +
'        {{/each}}\n' +
'      \\resumeItemListEnd\n' +
'    {{/each}}\n' +
'  \\resumeSubHeadingListEnd\n' +
'{{/if}}\n' +
'\n' +
'{{#if education.length}}\n' +
'\\section{Education}\n' +
'  \\resumeSubHeadingListStart\n' +
'    {{#each education}}\n' +
'    \\resumeSubheading\n' +
'      {{{institution}}}{{{degree}} in {{{field}}}}\n' +
'      {{{startDate}} -- {{{endDate}}}}{{{location}}}\n' +
'    {{/each}}\n' +
'  \\resumeSubHeadingListEnd\n' +
'{{/if}}\n' +
'\n' +
'{{#if projects.length}}\n' +
'\\section{Projects}\n' +
'  \\resumeSubHeadingListStart\n' +
'    {{#each projects}}\n' +
'    \\resumeSubheading\n' +
'      {{{name}}}{{#if url}}$|$ \\href{{{url}}}{\\underline{Live Demo}}{{/if}}{{#if github}}$|$ \\href{{{github}}}{\\underline{GitHub}}{{/if}}\n' +
'      {{{startDate}}{{#if endDate}} -- {{{endDate}}}{{/if}}}{}\n' +
'      \\resumeItemListStart\n' +
'        \\resumeItem{{{description}}}\n' +
'        \\resumeItem{Technologies: {{#each technologies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}}\n' +
'      \\resumeItemListEnd\n' +
'    {{/each}}\n' +
'  \\resumeSubHeadingListEnd\n' +
'{{/if}}\n' +
'\n' +
'{{#if skills.length}}\n' +
'\\section{Technical Skills}\n' +
' \\begin{itemize}[leftmargin=0.15in, label={}]\n' +
'    \\small{\\item{\n' +
'     {{#each skills}}\n' +
'     \\textbf{ {{{category}}} }{: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}} \\\\\n' +
'     {{/each}}\n' +
'    }}\n' +
' \\end{itemize}\n' +
'{{/if}}\n' +
'\n' +
'\\end{document}'
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Formal academic style with emphasis on publications and research',
    category: 'academic',
    template: '\\documentclass[11pt,a4paper,sans]{moderncv}\n' +
'\\moderncvstyle{classic}\n' +
'\\moderncvcolor{blue}\n' +
'\\usepackage[scale=0.75]{geometry}\n' +
'\n' +
'\\name{{{{fullName}}}}{}\n' +
'\\title{Curriculum Vitae}\n' +
'\\address{{{{location}}}}{}{}\n' +
'\\phone[mobile]{{{{phone}}}}\n' +
'\\email{{{{email}}}}\n' +
'{{#if website}}\\homepage{{{website}}}{{/if}}\n' +
'{{#if linkedin}}\\social[linkedin]{{{linkedin}}}{{/if}}\n' +
'{{#if github}}\\social[github]{{{github}}}{{/if}}\n' +
'\n' +
'\\begin{document}\n' +
'\\makecvtitle\n' +
'\n' +
'{{#if summary}}\n' +
'\\section{Research Interests}\n' +
'{{summary}}\n' +
'{{/if}}\n' +
'\n' +
'{{#if education.length}}\n' +
'\\section{Education}\n' +
'{{#each education}}\n' +
'\\cventry{{{startDate}}--{{{endDate}}}}{{{degree}}}{{{institution}}}{{{field}}}{{#if gpa}}{{gpa}}{{/if}}{{#if honors}}{{{honors}}}{{/if}}{}\n' +
'{{/each}}\n' +
'{{/if}}\n' +
'\n' +
'{{#if experience.length}}\n' +
'\\section{Experience}\n' +
'{{#each experience}}\n' +
'\\cventry{{{startDate}}--{{#if current}}Present{{else}}{{{endDate}}}{{/if}}}{{{position}}}{{{company}}}{}{}{{{description}}}\n' +
'{{/each}}\n' +
'{{/if}}\n' +
'\n' +
'{{#if projects.length}}\n' +
'\\section{Research & Projects}\n' +
'{{#each projects}}\n' +
'\\cventry{{{startDate}}{{#if endDate}}--{{{endDate}}}{{/if}}}{{{name}}}{}{}{}{{description}}\n' +
'{{/each}}\n' +
'{{/if}}\n' +
'\n' +
'{{#if skills.length}}\n' +
'\\section{Skills}\n' +
'{{#each skills}}\n' +
'\\cvitem{{{category}}}{{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}}\n' +
'{{/each}}\n' +
'{{/if}}\n' +
'\n' +
'\\end{document}'
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