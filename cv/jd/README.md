# jd/ — job descriptions & tailored variants

Job descriptions the CV gets tailored against, one markdown file per posting (`<company>-<role-slug>.md`), plus the tailored CV variants produced for them (`<company>-<role-slug>.tailored.json`, same CVData schema as `data/cv.json`).

The loop: open an issue with the [tailor-cv template](../.github/ISSUE_TEMPLATE/tailor-cv.md) (paste the JD, keep the `@claude` mention) and the agent workflow drafts the JD file + tailored variant as a PR — reordering and trimming the canonical data for the role, never inventing facts. `data/cv.json` itself stays untouched by tailoring.

Render a tailored variant with the same engine, e.g.: `npx tsx -e "import{exportToMarkdown}from'./builder/markdown.ts';import{readFileSync}from'node:fs';console.log(exportToMarkdown(JSON.parse(readFileSync('jd/<file>.tailored.json','utf8'))))"`.
