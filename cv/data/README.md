# data/ — the canonical CV

`cv.json` is the **single source of truth** for CV content, in the `CVData` shape defined by [cv-builder-pro's `src/types/cv.ts`](https://github.com/bamr87/cv-builder-pro/blob/main/src/types/cv.ts) and mirrored here in `builder/types.ts` + `cv.schema.json` (draft-07 JSON Schema, referenced via the file's `$schema` key so editors validate/complete as you type).

Every render — `CV.md`, the ASCII/LaTeX exports, the Pages site — is generated from this file by `npm run build`. CI fails if `CV.md` drifts from it.

Transcription notes (how the LaTeX original maps onto the schema):

- `experience[].description` carries the role's context line (Industry/Scope/Division) that the artisanal LaTeX renders as a meta block; `achievements` are the bullet items.
- `projects[]` consolidates the LaTeX "Projects – Enterprise Systems" section to one **engagement portfolio per employer** (the per-line detail lives on in `sections/projects.tex`); `technologies` holds the systems/tools list.
- `skills[]` includes a `Core Strengths` category mirroring `sections/strengths.tex`.
- Dates are `YYYY-MM` (the app's `<input type="month">` format); generators prettify them for display.
- Round-trip: **Import cv.json / Export JSON** in CV Builder Pro reads and writes this exact file (the `$schema` key is ignored by the app and stripped from the published copy).

Edit it directly or through the app — either way, run `npm run build` and commit `CV.md` alongside your change. Facts only: never invent content that isn't true of the real CV.
