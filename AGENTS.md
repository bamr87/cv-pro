<!-- kit: sdlc v0.1.0 · AGENTS.md is the CANONICAL agent instructions file (decision D4, UPS-AGENT-07/08).
     Keep these six `##` headings (UPS-AGENT-07 checks they exist, in any order; add your own headings as needed). CLAUDE.md is a pointer to this file and carries no rules of its own. -->

# cv-pro

## What this repo is

Amr's CV as code and the CV Builder Pro app, in one repository. `cv/` holds the canonical data (`cv/data/cv.json`), the CVData contract (`cv/data/cv.schema.json`) and every render of it (Markdown, LaTeX, HTML, PDF); `app/` holds the React builder that imports and exports that same data. A change is done when the half you touched passes its own `npm test`, and, if you changed the contract, `app/contract/cv.schema.json` is byte-identical to `cv/data/cv.schema.json` (that is what `app`'s test gates).

## Stack & commands

Each half has its own dependencies; run commands from inside it.

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
```

## Layout

| Path | What |
| --- | --- |
| `cv/` | The CV machine: `data/` (cv.json + schema), `builder/` (renders), `sections/` and `jd/` (curated content), `tools/` |
| `app/` | CV Builder Pro: `src/`, `contract/` (vendored schema), `cypress/` (e2e), `scripts/` (the contract gate) |
| `.github/workflows/ci.yml` | The fleet's shared standard gate |

Each half keeps its own `README.md`, `CHANGELOG.md`, `CLAUDE.md` and `LICENSE`; read the one for the half you are changing. The nested `.github/workflows/` under each half are kept as reference and do not run from here.

## Conventions

- **Backlog of record:** GitHub Issues with the fleet labels. Pick up issues labelled `agent:ready`; never touch `agent:hold` or `human-review`.
- **Definition of Done:** the checklist in `.github/pull_request_template.md` (the fleet default is inherited when the repo has none). Every box is ticked before merge.
- **Decisions:** ADRs in `docs/adr/NNNN-slug.md`, indexed in `docs/adr/README.md`. Add one for anything hard to reverse.
- **Commits:** Conventional Commits (`feat fix docs style refactor test chore perf ci build`). The PR title is the squash subject.
- **Branches:** `feature/`, `fix/`, `docs/`, `refactor/`, `test/` or `chore/` off `main`.
- **Changelog:** `CHANGELOG.md` records notable changes; each half keeps its own as well.
- **The CV stays human-curated:** the hub's `sync-cv` skill proposes a merge into `cv/data/cv.json`; nothing writes it automatically.
- **Never:** push to `main` directly, commit lockfiles or secrets, suppress type errors, leave empty exception handlers, or edit generated files by hand.

## Fleet context

Member of the bamr87 fleet. The standards live in the hub: <https://github.com/bamr87/bamr87/tree/main/specs> (the Universal Project Standard). Commit here first; the hub bumps its submodule pointer afterwards.

## Standard deviations

- UPS-REPO-02: tests live beside each half (`cv/builder/*.test.ts`, `app/cypress/`), not under `tests/`. The two halves are imported repositories that keep their own layout.

## Governance

Read [`docs/constitution.md`](docs/constitution.md) before changing anything: it is the highest-precedence rule set here and wins over this file when they disagree. It changes only through a numbered record in [`docs/amendments/`](docs/amendments/), ratified by the maintainer merging the PR; agents propose, never merge. Every user-facing feature has a stable id in [`features/features.yml`](features/features.yml) with `status`, location and the PRD requirement ids it serves; the PRD's "Feature catalog" block is generated from it (`python3 <bamr87/bamr87>/tools/governance_lint.py prd-sync . --write`; check with `… check .`). Never hand-edit that block or `CHANGELOG.md`.
