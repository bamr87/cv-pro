# builder/ — the generation engine

TypeScript engine that renders `data/cv.json` into every published surface. **Ported from [bamr87/cv-builder-pro](https://github.com/bamr87/cv-builder-pro)** — `types.ts`, `markdown.ts`, `ascii.ts`, and `latex.ts` correspond to the app's `src/types/cv.ts`, `src/lib/export-utils.ts`, and `src/lib/latex-templates.ts`, kept intentionally close so improvements can flow both ways.

Deliberate divergences from the app versions (all output-side; the data contract is untouched):

- LaTeX values are **escaped** (`escapeLatex` — the data really contains `C#` and `FP&A`) and templates are plain typed functions instead of `new Function` evaluation.
- Dates render as `Jan 2020` instead of raw `2020-01`.
- ASCII output covers all sections and word-wraps to 80 columns.
- `html.ts` (the Pages site) has no app counterpart.

Entry points: `build.ts` (`npm run build` / `npm run check`) and `build.test.ts` (`npm test` — contract validation, the `CV.md` sync gate, and generator invariants, using the real data as the golden fixture). `validate.ts` enforces the same shape as `data/cv.schema.json`; keep the two in sync when the contract evolves, and land contract changes in the app too.
