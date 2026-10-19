# cv-pro — the CV machine and its builder, in one repository

> Amr's CV as code and the CV Builder Pro app, consolidated: `cv/` holds the canonical data, the CVData contract and every render; `app/` holds the React builder that edits it.

## Overview

Two repositories used to carry one workflow. [bamr87/cv](https://github.com/bamr87/cv) kept the CV as data (`cv.json`), rendered it to Markdown, LaTeX, HTML and PDF, and published it; [bamr87/cv-builder-pro](https://github.com/bamr87/cv-builder-pro) was the web app that imports and exports that same `cv.json`, with a vendored copy of the schema and a contract gate that turned red whenever the two drifted. They now live side by side, imported with their full history, so the contract is one file away instead of one repository away.

| Path | Was | What it is |
|---|---|---|
| [`cv/`](cv/) | bamr87/cv | The CV build, maintain and publish machine: `cv/data/cv.json` is the single source of truth (the CVData contract is `cv/data/cv.schema.json`), `cv/builder/` renders it, `cv/sections/` and `cv/jd/` hold the curated content. |
| [`app/`](app/) | bamr87/cv-builder-pro | CV Builder Pro: a React + TypeScript + Tailwind app with LaTeX templates, Markdown/PDF export and optional AI parsing. `app/contract/cv.schema.json` is the byte-identical copy its `npm test` gates against. |

Each half keeps its own README, scripts and commands; run them from inside `cv/` or `app/`.

## Status

This repository is the consolidation of the two originals. Their histories were rewritten with `git filter-repo --to-subdirectory-filter` and merged, so `git log` and `git blame` under `cv/` and `app/` work as they did before; commit hashes changed, bare issue references were qualified (`bamr87/cv#N`, `bamr87/cv-builder-pro#N`) and tags were not imported. The nested `.github/workflows/` under each half do not run from here and are kept as the reference for porting:

- `cv/`: the CI, LaTeX preview, publish (GitHub Pages) and release-please workflows.
- `app/`: CI and the contract gate.

The root `ci.yml` is the fleet's shared standard gate. Until the publish and release workflows are ported, the originals remain where the live site and releases come from.

## Development

```bash
(cd cv && npm install && npm test)        # renders + validator
(cd app && npm install && npm test)       # CVData contract gate
(cd app && npm run dev)                   # the builder on its dev server
```

## License

MIT — see [LICENSE](LICENSE).
