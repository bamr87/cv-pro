# cv — the CV build, maintain & publish machine

> Amr's CV as code: one cv.json rendered to Markdown, LaTeX, HTML and PDF, with automated publishing and releases.

[![CI](https://github.com/bamr87/cv/actions/workflows/ci.yml/badge.svg)](https://github.com/bamr87/cv/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/bamr87/cv)](LICENSE)

## Overview

The CV of **Amr Abdel-Motaleb**, run like software: one canonical data file edited in **VS Code**, generated renders in every format, automated publishing, and scheduled freshness checks. The generation engine is ported from (and round-trips with) [**CV Builder Pro**](https://github.com/bamr87/cv-builder-pro), this repo's companion app.

**Read the CV**: [live site](https://bamr87.github.io/cv/) · [PDF](cv.pdf) · [Markdown](CV.md) · [releases](https://github.com/bamr87/cv/releases) (frozen snapshots).

## How the machine works

```text
                 VS Code (schema completion, cv-* snippets, watch task)
                                 │ edits
                                 ▼
                    ┌───────────────────────────┐
                    │      data/cv.json         │ ← import/export with CV Builder Pro
                    │  SINGLE SOURCE OF TRUTH   │ ← curated fleet proposals from the
                    │  (CVData contract)        │    bamr87 hub (dash-gen cv)
                    └────────────┬──────────────┘
                                 │  npm run build / watch   (builder/)
        ┌──────────┬─────────────┼───────────────┬───────────────┐
        ▼          ▼             ▼               ▼               ▼
      CV.md    sections/*.tex  dist/cv.txt   dist/index.html  dist/cv-*.tex
    (committed, (committed,    dist/cv.json  (Pages site)     (portable LaTeX
     sync-gated) sync-gated)   (ASCII/data)                    templates)
                     │
                     ▼
       cv.tex + resume.sty  =  LAYOUT ONLY  →  cv.pdf (compiled by CI)
                                 │
                                 ▼
              GitHub Pages  ·  GitHub Releases  ·  PR artifacts
```

**Content and layout are fully separated — there is no hand-mirrored copy of anything.** All content lives in `data/cv.json`; the engine renders it into every surface, including the `sections/*.tex` files that `cv.tex` inputs. `cv.tex` and `resume.sty` carry only typography, spacing, and section order — edit them for *looks*, never for *facts*. `CV.md` and `sections/*.tex` are committed-and-generated with a CI sync gate (`npm test`), so no surface can drift from the data.

## Routine loops

| Loop | Trigger | What happens |
| --- | --- | --- |
| **Build gate** | every PR / push (CI) | `standard-ci` runs `lint` (typecheck), `test` (data validation + `CV.md` sync), `build` |
| **Publish** | push to `main` touching CV inputs, weekly cron, manual | rebuild everything, recompile `cv.pdf`, deploy to [Pages](https://bamr87.github.io/cv/) |
| **Freshness** | weekly cron | if `data/cv.json` is >120 days old, an issue nags for a refresh |
| **Snapshot** | tag `vYYYY.MM.DD` or manual dispatch | GitHub release with recruiter-named PDF/MD/TXT/TeX/JSON assets — cut one every time the CV goes out the door |
| **LaTeX preview** | PR touching `*.tex`/`*.sty`/images | compiles the artisanal lane, uploads the PDF as a run artifact |
| **Tailoring** | [issue template](.github/ISSUE_TEMPLATE/tailor-cv.md) | paste a JD, `@claude` drafts a tailored variant into `jd/` as a PR |
| **Fleet sync** | hub-driven (`dash-gen cv` + `sync-cv` skill) | the [bamr87 hub](https://github.com/bamr87/bamr87) projects its project registry into `_data/cv_portfolio.json` (this repo's CVData shapes) and proposes curated merges into `data/cv.json` — projects/skills flow in from the fleet, never as an automatic overwrite |

## Editing the CV — VS Code is the main editor

Open this repo in VS Code (or a Codespace — `.devcontainer/` sets up Node and TeX Live automatically) and accept the recommended extensions. Then:

1. `npm install`, and start the **CV: watch** task (`Terminal → Run Task`, or `npm run watch`) — every save rebuilds every surface.
2. Edit `data/cv.json`. The JSON Schema gives completion, hover docs, and validation squiggles; type `cv-experience`, `cv-education`, `cv-project`, or `cv-skill` for a snippet of a new entry. Generated files are marked read-only in the editor so edits can only land in the data.
3. Preview as you type: open `dist/index.html` with **Live Preview** for the rendered CV, or `CV.md` with the built-in Markdown preview. For the PDF, run the **CV: PDF** task or open `cv.tex` with **LaTeX Workshop** (needs local TeX Live; CI compiles it for you otherwise).
4. Commit the data change **together with the regenerated `CV.md` + `sections/*.tex`** (the watch/build task already wrote them) and open a PR — `npm test` in CI fails on any drift.

Typography is a separate concern: edit `resume.sty` / `cv.tex` for looks (the **latex-preview** workflow attaches a compiled PDF to any PR touching them).

Other ways in, both landing on the same data file: **[CV Builder Pro](https://github.com/bamr87/cv-builder-pro)** (browser forms + AI parsing of an existing resume/PDF; use *Import cv.json* / *Export cv.json* to round-trip) and **fleet sync** (the hub proposes portfolio/skills updates — see below).

## Project structure
| Path | What it is |
| --- | --- |
| `data/cv.json` | **Single source of truth** — CVData, the schema shared with CV Builder Pro |
| `data/cv.schema.json` | JSON Schema for the contract (powers VS Code completion/validation) |
| `builder/` | The generation engine (TypeScript, ported from cv-builder-pro) + watch mode |
| `CV.md` | Generated Markdown render (committed, sync-gated) |
| `sections/*.tex` | **Generated** LaTeX content (committed, sync-gated — never hand-edit) |
| `cv.tex`, `resume.sty` | LaTeX **layout shell** → `cv.pdf` (edit for typography only) |
| `cv.pdf` | Latest render (recompiled by CI on publish) |
| `jd/` | Job descriptions + tailored CV variants |
| `dist/` | Build output (gitignored; published to Pages) |
| `.vscode/`, `.devcontainer/` | The editor kit: tasks, watch loop, snippets, schema wiring, extensions, Codespace image |
| `.github/workflows/` | The loops: `ci`, `publish`, `release`, `latex-preview`, `markdown-oneline`, `claude` |

## Commands

```bash
npm install        # deps (fleet policy: always-latest, no lockfile)
npm run build      # data/cv.json -> CV.md + sections/*.tex + dist/
npm run watch      # same, on every save (the VS Code editing loop)
npm run check      # are CV.md + sections/*.tex in sync? (CI gate)
npm run lint       # tsc --noEmit
npm test           # full gate: contract + sync + generator invariants
latexmk -pdf cv.tex  # PDF locally (or let CI / LaTeX Workshop do it)
```

## Fleet context

This repo is one of ~40 managed by the [bamr87/bamr87 dash](https://github.com/bamr87/bamr87) (registry: `_data/projects.yml`) and is vendored there as a git submodule — commit and push here first; the hub bumps its pointer afterwards. Its sibling [cv-builder-pro](https://github.com/bamr87/cv-builder-pro) provides the editing UI and AI parsing (paste a resume or PDF, get CVData back); this repo provides the data of record, the render pipeline, and the publishing automation.

## Development

```bash
npm test         # data contract, sync gates and generator invariants
npm run lint     # typecheck
npm run check    # verify CV.md is in sync
```

Full commands, conventions and gotchas for humans and AI agents live in [CLAUDE.md](CLAUDE.md).

## Contributing

Contributions are welcome via pull request. Use [Conventional Commits](https://www.conventionalcommits.org/) and keep the CI checks green. The fleet-wide workflow is described in the hub's [CONTRIBUTING.md](https://github.com/bamr87/bamr87/blob/main/CONTRIBUTING.md). AI agents should start with [CLAUDE.md](CLAUDE.md).

## Changelog

Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md); the full record is in the [commit history](https://github.com/bamr87/cv/commits/main).

## License

Released under the [MIT License](LICENSE).

---

<!-- bamr87-portfolio-footer -->
Part of the [bamr87 portfolio](https://github.com/bamr87) — browse every project on [Amr's GitHub profile](https://github.com/bamr87).
