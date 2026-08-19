# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**CV Builder Pro** — a client-side React app for building CVs/resumes and exporting them to Markdown, ASCII, and LaTeX, with optional AI parsing of pasted text or PDFs. Scaffolded from the **GitHub Spark** template.

This directory is the `bamr87/cv-builder-pro` repo, vendored as a **submodule** of the `bamr87/bamr87` monorepo. Commit changes here and push to `cv-builder-pro` first, then bump the pointer in the parent repo — see the parent `../../CLAUDE.md` for the full submodule workflow.

## Commands

```bash
npm install
npm run dev        # Vite dev server (Vite default :5173; npm run kill frees :5000 per parent compose config)
npm run build      # tsc -b --noCheck && vite build  — NOTE: --noCheck means type errors do NOT fail the build
npm run lint       # eslint .
npm run preview    # serve the production dist/
npm run kill       # fuser -k 5000/tcp
```

**Tests** — there is no `npm test`. Tests are Cypress e2e specs (`cypress/e2e/*.cy.js`) that hit a **running** dev server at `http://localhost:5173` (see `cypress.config.js`). Start `npm run dev` first, then:
```bash
npx cypress run                                   # headless, all specs
npx cypress run --spec cypress/e2e/cv-builder.cy.js   # single spec
npx cypress open                                  # interactive
```
Because `build` is type-unchecked, rely on `npm run lint` and the editor for type safety; CI-style type validation is not wired up.

## Architecture

**Single source of CV state.** All CV content lives in one `CVData` object held by `usePersistedState('cv-data', defaultCVData)` in [src/components/cv/CVBuilder.tsx](src/components/cv/CVBuilder.tsx). `usePersistedState` ([src/lib/usePersistedState.ts](src/lib/usePersistedState.ts)) is a `useState`+`localStorage` wrapper — there is no Redux/Zustand/Context for CV data. Each tab's form is a controlled component receiving a slice and an `onChange` that spreads back into the whole object (`setCvData(cur => ({ ...cur, experience }))`). The `CVData` shape is the contract for everything; it's defined in [src/types/cv.ts](src/types/cv.ts) (with `defaultCVData`).

**Firebase is optional and gated.** [src/lib/firebase.ts](src/lib/firebase.ts) initializes from `VITE_FIREBASE_*` env vars inside a try/catch and exports a `firebaseReady` boolean. If env vars are missing, init is skipped silently and `firebaseReady` is `false`. **CV editing and all exports work fully offline** — only Sign In and AI parsing require Firebase. Always guard auth/Firestore code with `firebaseReady` (and the `auth`/`db` exports, which are `undefined` when not ready), following the pattern in [src/context/AuthContext.tsx](src/context/AuthContext.tsx).

**AI parsing flow.** Auth ([AuthContext](src/context/AuthContext.tsx), Firebase email/password) exists almost entirely to store AI settings. The user enters a provider + API key on [SettingsPage](src/pages/SettingsPage.tsx), saved to Firestore at `users/{uid}/settings/ai`. [AIParser](src/components/cv/AIParser.tsx) reads that doc, optionally extracts text from a PDF via [src/lib/pdf.ts](src/lib/pdf.ts) (pdfjs-dist), then calls [src/lib/aiClient.ts](src/lib/aiClient.ts) `parseCvText`, which does a **direct browser `fetch`** to the chosen provider (xAI Grok / OpenAI / Affinda) and returns a JSON string. AIParser then JSON-parses it, backfills missing `id`s, and calls `onParsed` to replace `cvData`. API keys are user-entered and stored in Firestore — never put provider keys in env vars.

**Export pipeline.** [src/lib/export-utils.ts](src/lib/export-utils.ts) builds Markdown/ASCII strings from `CVData` and exposes `downloadFile` (Blob + anchor click). [src/lib/latex-templates.ts](src/lib/latex-templates.ts) holds the selectable `latexTemplates` and `generateLaTeX(template, data)` — which LaTeX-escapes all interpolated values (`escapeLatex`) during normalization, so user content like `C#`/`FP&A` compiles. [ExportSection](src/components/cv/ExportSection.tsx) wires format choice → generator → `downloadFile`. To add an export format or LaTeX template, add to these two files and surface it in ExportSection.

**Canonical JSON round-trip (bamr87/cv).** [src/lib/cv-json.ts](src/lib/cv-json.ts) serializes/parses the canonical `cv.json` — the exact file the sibling [bamr87/cv](https://github.com/bamr87/cv) repo keeps as `data/cv.json` and renders/publishes from (its `builder/` engine is a Node port of this app's exporters). ExportSection's "Data File" panel exposes Import/Export; import backfills missing `id`s (same convention as AIParser) and tolerates unknown keys. **The `CVData` shape in [src/types/cv.ts](src/types/cv.ts) is a two-repo contract**: change it only backward-compatibly, and land the same change in bamr87/cv's `builder/types.ts` + `data/cv.schema.json`.

**Routing/shell.** [src/App.tsx](src/App.tsx) wraps everything in `AuthProvider` + `BrowserRouter`. `/` is the builder, `/login`, `/settings` (behind a `Protected` route). [src/main.tsx](src/main.tsx) mounts under a `react-error-boundary` ([src/ErrorFallback.tsx](src/ErrorFallback.tsx)).

## Conventions specific to this repo

- **Path alias `@` → `src`** (vite.config + tsconfig `paths`). Imports use `@/components/...`, `@/lib/...`, etc.
- **UI is shadcn/ui** (`new-york` style, see `components.json`) under `src/components/ui/` — generated primitives; add new ones with the shadcn CLI rather than hand-rolling. App-specific components live in `src/components/cv/`.
- **Two icon libraries coexist**: `@phosphor-icons/react` (used in the CV components) and `lucide-react` (shadcn default). Match whatever the file already imports.
- **Tailwind v4** via the `@tailwindcss/vite` plugin (no `postcss` pipeline to configure). Styles split across `src/main.css`, `src/index.css`, `src/styles/theme.css`.
- **Spark scaffolding is load-bearing.** `vite.config.ts` includes `sparkPlugin()` and `createIconImportProxy()` marked `// DO NOT REMOVE`; `main.tsx` imports `@github/spark/spark`; `spark.json`/`runtime.config.json` carry the Spark app id. A `spark` global LLM helper is declared in AIParser. Don't strip these unless intentionally de-Sparking the project.
- `strictNullChecks` is on but full `strict` is not. Per the parent repo rule, don't suppress type errors with `as any` / `@ts-ignore` (a couple of legacy `@ts-ignore`s exist around pdfjs typings).
