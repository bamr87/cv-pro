# cv-pro — the CV machine and its builder, in one repository

> Amr's CV as code and the CV Builder Pro app, consolidated: `cv/` holds the canonical data, the CVData contract and every render; `app/` holds the React builder that edits it.

[![CI](https://github.com/bamr87/cv-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/bamr87/cv-pro/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/bamr87/cv-pro)](LICENSE)

## Overview

Two repositories used to carry one workflow. [bamr87/cv](https://github.com/bamr87/cv) kept the CV as data (`cv.json`), rendered it to Markdown, LaTeX, HTML and PDF, and published it; [bamr87/cv-builder-pro](https://github.com/bamr87/cv-builder-pro) was the web app that imports and exports that same `cv.json`, with a vendored copy of the schema and a contract gate that turned red whenever the two drifted. They now live side by side, imported with their full history, so the contract is one file away instead of one repository away.

| Path | Was | What it is |
|---|---|---|
| [`cv/`](cv/) | bamr87/cv | The CV build, maintain and publish machine: `cv/data/cv.json` is the single source of truth (the CVData contract is `cv/data/cv.schema.json`), `cv/builder/` renders it, `cv/sections/` and `cv/jd/` hold the curated content. |
| [`app/`](app/) | bamr87/cv-builder-pro | CV Builder Pro: a React + TypeScript + Tailwind app with LaTeX templates, Markdown/PDF export and optional AI parsing. `app/contract/cv.schema.json` is the byte-identical copy its `npm test` gates against. |

## Features

- **One source of truth:** `cv/data/cv.json`, validated against the CVData contract `cv/data/cv.schema.json`.
- **Every render from it:** `cv/builder/` writes Markdown (`CV.md`), the LaTeX sections behind `cv.pdf`, ASCII, portable LaTeX templates and the HTML Pages site; the committed renders are sync-gated by `npm test`.
- **A visual editor for the same data:** CV Builder Pro edits, imports and exports `cv.json`, with Markdown, ASCII and LaTeX export and optional AI parsing of pasted text or PDFs.
- **A contract gate between them:** `app`'s `npm test` checks its fixture against the vendored schema and that `src/types/cv.ts` declares every schema property; the vendored copy stays byte-identical to `cv/data/cv.schema.json`.
- **Human-curated:** fleet proposals for the CV arrive as reviewed pull requests; nothing writes `cv/data/cv.json` automatically.

## Quick start

Each half has its own dependencies and commands; run them from inside `cv/` or `app/`.

```bash
# cv/ — Node + tsx renders of cv.json (the PDF render needs a TeX install)
(cd cv && npm install)
(cd cv && npm run build)      # render every output
(cd cv && npm test)           # render + validate against the contract
(cd cv && npm run lint)       # tsc --noEmit

# app/ — React, TypeScript, Vite, Tailwind
(cd app && npm install)
(cd app && npm run dev)       # dev server on port 5000
(cd app && npm run build)     # tsc -b --noCheck && vite build
(cd app && npm run lint)      # eslint .
(cd app && npm test)          # the CVData contract gate (scripts/contract-check.mjs)
(cd app && npx cypress run)   # e2e, against a running dev server

# the contract: the vendored copy must match the source byte for byte
cmp app/contract/cv.schema.json cv/data/cv.schema.json

# docs: the index in docs/README.md is generated from each document's summary line
python3 tools/docs_index.py --check     # rebuild with --write
```

## Status

This repository is the consolidation of the two originals. Their histories were rewritten with `git filter-repo --to-subdirectory-filter` and merged, so `git log` and `git blame` under `cv/` and `app/` work as they did before; commit hashes changed, bare issue references were qualified (`bamr87/cv#N`, `bamr87/cv-builder-pro#N`) and tags were not imported. The nested `.github/workflows/` under each half do not run from here and are kept as the reference for porting:

- `cv/`: the CI, LaTeX preview, publish (GitHub Pages) and release-please workflows.
- `app/`: CI and the contract gate.

The root `ci.yml` is the fleet's shared standard gate. Until the publish and release workflows are ported, the originals remain where the live site and releases come from.

## Documentation

The [docs index](docs/README.md) lists every document with a one-line summary. Each half documents itself: [cv/README.md](cv/README.md) (the machine, its routine loops and the VS Code editing loop) and [app/README.md](app/README.md) (usage, project structure, testing). Decisions are recorded in [docs/adr/](docs/adr/README.md).

## Project structure

| Path | What |
|---|---|
| `cv/` | The CV machine: `data/` (cv.json + schema), `builder/` (renders), `sections/` and `jd/` (curated content) |
| `app/` | CV Builder Pro: `src/`, `contract/` (vendored schema), `cypress/` (e2e), `scripts/` (the contract gate) |
| `docs/` | Docs index and the decision log |
| `tools/` | The docs index generator, vendored from the hub |
| `features/`, `verify/`, `public/` | Feature index, verification scenarios and the page-feedback widget |

## Development

The commands are the [Quick start](#quick-start) block. A change is done when the half you touched passes its own `npm test`, and a contract change leaves `app/contract/cv.schema.json` byte-identical to `cv/data/cv.schema.json`. Conventions, the Definition of Done and the do-nots for humans and AI agents live in [AGENTS.md](AGENTS.md), with each half's own `AGENTS.md` for the details of that half.

## Contributing

Contributions are welcome via pull request. Use [Conventional Commits](https://www.conventionalcommits.org/) and keep the CI checks green. The fleet-wide workflow is described in the hub's [CONTRIBUTING.md](https://github.com/bamr87/bamr87/blob/main/CONTRIBUTING.md). AI agents start with [AGENTS.md](AGENTS.md); [CLAUDE.md](CLAUDE.md) imports it for Claude Code.

## Changelog

Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md), and each half keeps its own ([cv/CHANGELOG.md](cv/CHANGELOG.md), [app/CHANGELOG.md](app/CHANGELOG.md)); the full record is in the [commit history](https://github.com/bamr87/cv-pro/commits/main).

## License

MIT — see [LICENSE](LICENSE).

---

<!-- bamr87-portfolio-footer -->
Part of the [bamr87 portfolio](https://github.com/bamr87) — browse every project on [Amr's GitHub profile](https://github.com/bamr87).
