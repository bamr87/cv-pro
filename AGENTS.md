<!-- kit: sdlc v0.1.0 · AGENTS.md is the CANONICAL agent instructions file (decision D4, UPS-AGENT-07/08).
     Keep these six `##` headings (UPS-AGENT-07 checks they exist, in any order; add your own headings as needed). CLAUDE.md is a pointer to this file and carries no rules of its own. -->

# cv-pro

> Amr's CV as code (cv/) and the CV Builder Pro app that edits it (app/), in one repository that shares one CVData contract.

## What this repo is

Amr's CV as code and the CV Builder Pro app, in one repository. `cv/` holds the canonical data (`cv/data/cv.json`), the CVData contract (`cv/data/cv.schema.json`) and every render of it (Markdown, LaTeX, HTML, PDF); `app/` holds the React builder that imports and exports that same data. A change is done when the half you touched passes its own `npm test`, and, if you changed the contract, `app/contract/cv.schema.json` is byte-identical to `cv/data/cv.schema.json`. `app`'s test gates the app against its vendored copy; nothing gates the copy against the source yet, so run the `cmp` below.

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

# the contract: the vendored copy must match the source byte for byte
cmp app/contract/cv.schema.json cv/data/cv.schema.json

# docs: the index in docs/README.md is generated from each document's summary line
python3 tools/docs_index.py --check     # rebuild with --write
```

## Layout

| Path | What |
| --- | --- |
| `cv/` | The CV machine: `data/` (cv.json + schema), `builder/` (renders), `sections/` and `jd/` (curated content), `tools/` |
| `app/` | CV Builder Pro: `src/`, `contract/` (vendored schema), `cypress/` (e2e), `scripts/` (the contract gate) |
| `docs/` | Docs index and the decision log (`docs/adr/`) |
| `tools/` | `docs_index.py`, vendored from the hub |
| `features/`, `verify/`, `public/` | Feature index, verification scenarios, the fleet page-feedback widget (hub kits) |
| `.github/workflows/ci.yml` | The fleet's shared standard gate |

Each half keeps its own `README.md`, `CHANGELOG.md`, `AGENTS.md` (with a `CLAUDE.md` pointer) and `LICENSE`; read the one for the half you are changing. The nested `.github/workflows/` under each half are kept as reference and do not run from here.

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

Member of the bamr87 fleet, vendored as the `projects/cv-pro` submodule of the hub [bamr87/bamr87](https://github.com/bamr87/bamr87). The standards live in the hub: <https://github.com/bamr87/bamr87/tree/main/specs> (the Universal Project Standard). Commit here first; the hub bumps its submodule pointer afterwards. The hub's `sync-cv` skill proposes CV merges from the registry (`_data/cv_portfolio.json`), and the fleet-pulse doctor and issue pipeline open PRs here; none of them merges.

## Standard deviations

- UPS-REPO-02: tests live beside each half (`cv/builder/*.test.ts`, `app/cypress/`), not under `tests/`. The two halves are imported repositories that keep their own layout.
