# CLAUDE.md

Guidance for AI coding agents (Claude Code, Copilot, Cursor) working in **cv**.

## What this is

The CV of Amr Abdel-Motaleb run as a build machine, edited primarily in VS Code: `data/cv.json` (canonical CVData, schema shared with [bamr87/cv-builder-pro](https://github.com/bamr87/cv-builder-pro)) is the single source of truth, rendered by the TypeScript engine in `builder/` into Markdown (`CV.md`), the LaTeX content sections (`sections/*.tex` — both committed + sync-gated), ASCII, portable LaTeX templates, and the HTML Pages site; `cv.tex` + `resume.sty` are the layout-only shell that turns the generated sections into `cv.pdf`. See `README.md` for the full architecture and the VS Code editing loop (`.vscode/` tasks, watch mode, snippets).

## Stack & commands

```bash
# install dependencies:
npm install
# run the build (data/cv.json -> CV.md + sections/*.tex + dist/):
npm run build
# rebuild on every save (the VS Code editing loop; also the "CV: watch" task):
npm run watch
# run tests (data contract + CV.md/sections sync gates + generator invariants):
npm test
# lint (typecheck):
npm run lint
# verify CV.md is in sync without writing:
npm run check
# artisanal PDF (optional locally; CI compiles it in publish/latex-preview):
latexmk -pdf cv.tex
```

## Rules of the machine

- **`data/cv.json` is the single source of truth.** Content changes start there — never in a render. `CV.md` and `sections/*.tex` are generated and committed; `npm test` fails on any drift, so always run `npm run build` and commit the regenerated surfaces together with the data change.
- **Layout ≠ content.** `cv.tex` + `resume.sty` carry typography/spacing/section order only — edit them for looks, never to add or change facts. `sections/*.tex` and `dist/**` are never hand-edited.
- **The CVData contract is shared** with cv-builder-pro (`src/types/cv.ts` there, `builder/types.ts` + `data/cv.schema.json` here). Schema changes must land in both repos, backward-compatibly.
- **This is real personal data.** Transcribe, reorder, and reformat — never invent facts, dates, employers, or credentials. Tailored variants (from the `jd/` loop) go in `jd/*.tailored.json`, not in `data/cv.json`.
- Generated PDFs/renders belong in releases and Pages, not the working tree (`cv.pdf` is the one committed render; the publish workflow recompiles it).

## Conventions

- Conventional Commits: `type(scope): description` (`feat`/`fix`/`docs`/`refactor`/`test`/`chore`/`ci`).
- Default branch is `main` — branch from it and open a PR; never push to it directly.
- README-First, README-Last: read the nearest `README.md` before changing a
  directory, and update it after.
- Don't suppress type errors (`as any`, `@ts-ignore`, `# type: ignore`) or
  leave empty exception handlers.
- Markdown prose is one paragraph per line (`markdown-oneline` gate; fix with `python3 tools/unwrap-prose.py --write`).
- Dependencies follow the fleet's always-latest policy: `"*"` ranges, no lockfiles committed.

## Fleet context

This repo is one of ~40 managed by the [bamr87/bamr87 dash](https://github.com/bamr87/bamr87) (registry: `_data/projects.yml`; tiered baseline: `docs/STANDARDS.md`). It is vendored there as a git submodule: commit and push changes **here** first — the hub only bumps its pointer afterwards. Shared CI, release, schema, and agent kits are seeded from the hub's `templates/`; prefer adopting those over hand-rolling equivalents.
