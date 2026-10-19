# builder/ — the generation engine

TypeScript engine that renders `data/cv.json` into every surface. **Ported from [bamr87/cv-builder-pro](https://github.com/bamr87/cv-builder-pro)** — `types.ts`, `markdown.ts`, `ascii.ts`, and `latex.ts` correspond to the app's `src/types/cv.ts`, `src/lib/export-utils.ts`, and `src/lib/latex-templates.ts`, kept intentionally close so improvements can flow both ways.

Modules with no app counterpart:

- `tex.ts` — renders the committed `sections/*.tex` content (resume.sty macro calls) so the PDF lane is data-driven too; maps unicode punctuation (`–` `—` `·`) to LaTeX-safe forms and reproduces the bold `Industry/Scope/Department` meta labels from ` · `-separated description strings.
- `html.ts` — the Pages site.
- `watch.ts` — dependency-free rebuild-on-save loop (`npm run watch`, the VS Code editing loop).

Deliberate divergences from the app versions (all output-side; the data contract is untouched):

- LaTeX values are **escaped** (`escapeLatex` — the data really contains `C#` and `FP&A`) and templates are plain typed functions instead of `new Function` evaluation.
- Dates render as `Jan 2020` instead of raw `2020-01`.
- ASCII output covers all sections and word-wraps to 80 columns.

Entry points: `build.ts` (`npm run build` / `npm run check`; `committedSurfaces()` lists every committed-and-generated file) and `build.test.ts` (`npm test` — contract validation, the CV.md + sections sync gates, and generator invariants, using the real data as the golden fixture). `validate.ts` enforces the same shape as `data/cv.schema.json`; keep the two in sync when the contract evolves, and land contract changes in the app too.
