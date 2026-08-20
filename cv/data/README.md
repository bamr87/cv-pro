# data/ — the canonical CV

`cv.json` is the **single source of truth** for CV content, in the `CVData` shape defined by [cv-builder-pro's `src/types/cv.ts`](https://github.com/bamr87/cv-builder-pro/blob/main/src/types/cv.ts) and mirrored here in `builder/types.ts` + `cv.schema.json` (draft-07 JSON Schema, referenced via the file's `$schema` key so editors validate/complete as you type).

Every render — `CV.md`, the LaTeX content sections (`sections/*.tex`), the ASCII/LaTeX exports, the Pages site — is generated from this file by `npm run build` (or continuously by `npm run watch`). CI fails if any committed render drifts from it. The intended editor is **VS Code**: the `$schema` reference gives completion and validation, `.vscode/cv.code-snippets` scaffolds new entries (`cv-experience`, `cv-education`, `cv-project`, `cv-skill`), and the *CV: watch* task keeps every surface current as you type.

Transcription notes (how the LaTeX original maps onto the schema):

- `experience[].description` carries the role's context line (Industry/Scope/Division) that the artisanal LaTeX renders as a meta block; `achievements` are the bullet items.
- `projects[]` consolidates the LaTeX "Projects – Enterprise Systems" section to one **engagement portfolio per employer** (the per-line detail lives on in `sections/projects.tex`); `technologies` holds the systems/tools list.
- `skills[]` includes a `Core Strengths` category mirroring `sections/strengths.tex`.
- Dates are `YYYY-MM` (the app's `<input type="month">` format); generators prettify them for display.
- Round-trip: **Import cv.json / Export JSON** in CV Builder Pro reads and writes this exact file (the `$schema` key is ignored by the app and stripped from the published copy).

This file is also where **credentials of record** live: degrees, honors, and GPA sit on `education[]` entries, and licenses/certifications belong in `certifications[]` (currently empty on purpose — the old LaTeX list was deliberately disabled; add one back only when it is current and verifiable).

The [bamr87 hub](https://github.com/bamr87/bamr87) can propose fleet content for this file: its `dash-gen cv` projects the project registry into `_data/cv_portfolio.json` (these same Project/Skill shapes), and its `sync-cv` skill turns that into a reviewed merge PR here. Proposals only — nothing overwrites this file mechanically.

Edit it directly or through the app — either way, run `npm run build` and commit `CV.md` alongside your change. Facts only: never invent content that isn't true of the real CV.
