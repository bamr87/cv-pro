# cv — the CV build, maintain & publish machine

The CV of **Amr Abdel-Motaleb**, run like software: one canonical data file, generated renders in every format, automated publishing, and scheduled freshness checks. The generation engine is ported from (and round-trips with) [**CV Builder Pro**](https://github.com/bamr87/cv-builder-pro), this repo's companion editor app.

**Read the CV**: [live site](https://bamr87.github.io/cv/) · [PDF](cv.pdf) · [Markdown](CV.md) · [releases](https://github.com/bamr87/cv/releases) (frozen snapshots).

## How the machine works

```text
                    ┌───────────────────────────┐
   edit directly →  │      data/cv.json         │  ← import/export with
   (or via PR)      │  (canonical CVData, the   │    CV Builder Pro
                    │   cv-builder-pro schema)  │
                    └────────────┬──────────────┘
                                 │  npm run build  (builder/ — engine ported
                                 ▼                  from cv-builder-pro)
        ┌──────────┬─────────────┼──────────────┬─────────────┐
        ▼          ▼             ▼              ▼             ▼
      CV.md    dist/cv.txt  dist/cv-*.tex  dist/index.html  dist/cv.json
    (committed) (ASCII)     (generated       (Pages site)   (published data)
                             LaTeX lane)
                                 +
                    cv.tex + resume.sty + sections/*.tex
                    (artisanal LaTeX lane → cv.pdf, compiled by CI)
                                 │
                                 ▼
              GitHub Pages  ·  GitHub Releases  ·  PR artifacts
```

There are **two LaTeX lanes** by design. The *artisanal lane* (`cv.tex`, `resume.sty`, `sections/*.tex`) is the hand-tuned typography that produces the real `cv.pdf` — edit it like prose. The *generated lane* (`dist/cv-minimal.tex`, `dist/cv-academic.tex`) is rendered from `data/cv.json` by the engine and always tracks the data. When you change substance (a new role, project, or skill), update `data/cv.json` **and** mirror it into the artisanal sections; CI's sync gate only enforces data ↔ `CV.md`, so the LaTeX mirror is on you (or on `@claude`).

## Routine loops

| Loop | Trigger | What happens |
| --- | --- | --- |
| **Build gate** | every PR / push (CI) | `standard-ci` runs `lint` (typecheck), `test` (data validation + `CV.md` sync), `build` |
| **Publish** | push to `main` touching CV inputs, weekly cron, manual | rebuild everything, recompile `cv.pdf`, deploy to [Pages](https://bamr87.github.io/cv/) |
| **Freshness** | weekly cron | if `data/cv.json` is >120 days old, an issue nags for a refresh |
| **Snapshot** | tag `vYYYY.MM.DD` or manual dispatch | GitHub release with recruiter-named PDF/MD/TXT/TeX/JSON assets — cut one every time the CV goes out the door |
| **LaTeX preview** | PR touching `*.tex`/`*.sty`/images | compiles the artisanal lane, uploads the PDF as a run artifact |
| **Tailoring** | [issue template](.github/ISSUE_TEMPLATE/tailor-cv.md) | paste a JD, `@claude` drafts a tailored variant into `jd/` as a PR |

## Editing the CV

Direct edit (any editor — the JSON Schema in `data/cv.schema.json` gives completion/validation):

```bash
npm install
$EDITOR data/cv.json
npm run build     # regenerates CV.md + dist/; commit CV.md with your change
npm test          # what CI runs: contract validation + sync check
```

Visual edit — round-trip through [CV Builder Pro](https://github.com/bamr87/cv-builder-pro):

1. Run the app, use **Export → Import cv.json** to load `data/cv.json`.
2. Edit in the forms, then **Export → JSON** to download the updated `cv.json`.
3. Replace `data/cv.json`, run `npm run build`, and open a PR.

Never edit `CV.md` by hand — it is generated, and CI fails if it drifts from the data.

## Repo map

| Path | What it is |
| --- | --- |
| `data/cv.json` | **Single source of truth** — CVData, the schema shared with CV Builder Pro |
| `data/cv.schema.json` | JSON Schema for the contract |
| `builder/` | The generation engine (TypeScript, ported from cv-builder-pro) |
| `CV.md` | Generated Markdown render (committed, sync-gated) |
| `cv.tex`, `resume.sty`, `sections/` | Artisanal LaTeX lane → `cv.pdf` |
| `cv.pdf` | Latest artisanal render (recompiled by CI on publish) |
| `jd/` | Job descriptions + tailored CV variants |
| `dist/` | Build output (gitignored; published to Pages) |
| `.github/workflows/` | The loops: `ci`, `publish`, `release`, `latex-preview`, `markdown-oneline`, `claude` |

## Commands

```bash
npm install        # deps (fleet policy: always-latest, no lockfile)
npm run build      # data/cv.json -> CV.md + dist/
npm run check      # is CV.md in sync? (CI gate)
npm run lint       # tsc --noEmit
npm test           # full gate: contract + sync + generator invariants
latexmk -pdf cv.tex  # artisanal PDF locally (or let CI do it)
```

## Fleet context

This repo is one of ~40 managed by the [bamr87/bamr87 dash](https://github.com/bamr87/bamr87) (registry: `_data/projects.yml`) and is vendored there as a git submodule — commit and push here first; the hub bumps its pointer afterwards. Its sibling [cv-builder-pro](https://github.com/bamr87/cv-builder-pro) provides the editing UI and AI parsing (paste a resume or PDF, get CVData back); this repo provides the data of record, the render pipeline, and the publishing automation.
