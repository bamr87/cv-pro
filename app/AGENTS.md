# CV Builder Pro (app/)

> How to work in the app/ half of cv-pro: the commands, the architecture of CV Builder Pro, and its conventions.

Guidance for AI coding agents working in **app/**. The repository-wide rules are in the root [AGENTS.md](../AGENTS.md).

## What this is

**CV Builder Pro** — a client-side React app for building CVs/resumes and exporting them to Markdown, ASCII, and LaTeX, with optional AI parsing of pasted text or PDFs. Scaffolded from the **GitHub Spark** template.

This directory is one half of [bamr87/cv-pro](../README.md), imported with its history from bamr87/cv-builder-pro. Commit in cv-pro; the hub bumps its submodule pointer afterwards (root [AGENTS.md](../AGENTS.md) § Fleet context). The nested `.github/workflows/` here are kept as the reference for porting and do not run from cv-pro.

## Commands

```bash
npm install
npm run dev        # dev server on :5000 — sparkPlugin() in vite.config.ts pins the port, it is NOT Vite's 5173 (npm run kill frees it)
npm run build      # tsc -b --noCheck && vite build  — NOTE: --noCheck means type errors do NOT fail the build
npm run lint       # eslint .
npm run preview    # serve the production dist/
npm run kill       # fuser -k 5000/tcp
```

**Tests** — `npm test` runs the **contract gate** (`scripts/contract-check.mjs`): the Cypress fixture must validate against `contract/cv.schema.json` (a byte-identical vendored copy of `cv/data/cv.schema.json` — see `contract/README.md`), and `src/types/cv.ts` must contain every contract property. Standard-ci runs it. E2E tests are Cypress specs (`cypress/e2e/*.cy.js`) that hit a **running** dev server at `http://localhost:5000` (see `cypress.config.js`). Sonner toasts render as `[data-sonner-toast]` — assert on that, not on a class. Start `npm run dev` first, then:
```bash
npx cypress run                                   # headless, all specs
npx cypress run --spec cypress/e2e/cv-builder.cy.js   # single spec
npx cypress open                                  # interactive
```
Because `build` is type-unchecked, rely on `npm run lint` and `npx tsc --noEmit -p tsconfig.json` (currently clean) for type safety; CI-style type validation is not wired up.

## Architecture

**Single source of CV state.** All CV content lives in one `CVData` object held by `usePersistedState('cv-data', defaultCVData)` in [src/components/cv/CVBuilder.tsx](src/components/cv/CVBuilder.tsx). `usePersistedState` ([src/lib/usePersistedState.ts](src/lib/usePersistedState.ts)) is a `useState`+`localStorage` wrapper — there is no Redux/Zustand/Context for CV data. Each tab's form is a controlled component receiving a slice and an `onChange` that spreads back into the whole object (`setCvData(cur => ({ ...cur, experience }))`). The `CVData` shape is the contract for everything; it's defined in [src/types/cv.ts](src/types/cv.ts) (with `defaultCVData`).

**Firebase is optional and gated.** [src/lib/firebase.ts](src/lib/firebase.ts) initializes from `VITE_FIREBASE_*` env vars inside a try/catch and exports a `firebaseReady` boolean. If env vars are missing, init is skipped silently and `firebaseReady` is `false`. **CV editing and all exports work fully offline** — only Sign In and AI parsing require Firebase. Always guard auth/Firestore code with `firebaseReady` (and the `auth`/`db` exports, which are `undefined` when not ready), following the pattern in [src/context/AuthContext.tsx](src/context/AuthContext.tsx).

**AI parsing flow.** Auth ([AuthContext](src/context/AuthContext.tsx), Firebase email/password) exists almost entirely to store AI settings. The user enters a provider + API key on [SettingsPage](src/pages/SettingsPage.tsx), saved to Firestore at `users/{uid}/settings/ai`. [AIParser](src/components/cv/AIParser.tsx) reads that doc, optionally extracts text from a PDF via [src/lib/pdf.ts](src/lib/pdf.ts) (pdfjs-dist), then calls [src/lib/aiClient.ts](src/lib/aiClient.ts) `parseCvText`, which does a **direct browser `fetch`** to the chosen provider (xAI Grok / OpenAI / Affinda) and returns a JSON string (throwing with the provider's own error text on a non-2xx response). AIParser then hands that string to `parseCVData` from [src/lib/cv-json.ts](src/lib/cv-json.ts) — the same normalizer the cv.json import uses, so ids are backfilled and anything outside the contract shape is rejected before `onParsed` replaces `cvData`. API keys are user-entered and stored in Firestore — never put provider keys in env vars.

**Export pipeline.** [src/lib/export-utils.ts](src/lib/export-utils.ts) builds Markdown/ASCII strings from `CVData` and exposes `downloadFile` (Blob + anchor click). [src/lib/latex-templates.ts](src/lib/latex-templates.ts) holds the selectable `latexTemplates` and `generateLaTeX(template, data)` — which LaTeX-escapes all interpolated values (`escapeLatex`) during normalization, so user content like `C#`/`FP&A` compiles. [ExportSection](src/components/cv/ExportSection.tsx) wires format choice → generator → `downloadFile`. To add an export format or LaTeX template, add to these two files and surface it in ExportSection.

**Canonical JSON round-trip (bamr87/cv).** [src/lib/cv-json.ts](src/lib/cv-json.ts) serializes/parses the canonical `cv.json` — the exact file the sibling [`../cv/`](../cv/) half keeps as `cv/data/cv.json` and renders/publishes from (its `builder/` engine is a Node port of this app's exporters; VS Code is that repo's primary editor, this app is the visual/AI-intake companion). ExportSection's "Data File" panel exposes Import/Export; import backfills missing `id`s and tolerates unknown keys. `parseCVData` is the single entry point for untrusted CV JSON — both the Import button and the AI parser go through it, so validation only has to be right in one place. **The `CVData` shape in [src/types/cv.ts](src/types/cv.ts) is a two-repo contract**: change it only backward-compatibly, land it in `../cv/` first (`cv/builder/types.ts` + `cv/data/cv.schema.json`), then refresh the vendored `contract/cv.schema.json` here — `npm test` enforces the alignment.

**Routing/shell.** [src/App.tsx](src/App.tsx) wraps everything in `AuthProvider` + `BrowserRouter`. `/` is the builder, `/login`, `/settings` (behind a `Protected` route). [src/main.tsx](src/main.tsx) mounts under a `react-error-boundary` ([src/ErrorFallback.tsx](src/ErrorFallback.tsx)).

## Conventions specific to this repo

- **Path alias `@` → `src`** (vite.config + tsconfig `paths`). Imports use `@/components/...`, `@/lib/...`, etc.
- **UI is shadcn/ui** (`new-york` style, see `components.json`) under `src/components/ui/` — generated primitives; add new ones with the shadcn CLI rather than hand-rolling. App-specific components live in `src/components/cv/`.
- **Two icon libraries coexist**: `@phosphor-icons/react` (used in the CV components) and `lucide-react` (shadcn default). Match whatever the file already imports.
- **Tailwind v4** via the `@tailwindcss/vite` plugin (no `postcss` pipeline to configure). Styles split across `src/main.css`, `src/index.css`, `src/styles/theme.css`.
- **Spark scaffolding is load-bearing.** `vite.config.ts` includes `sparkPlugin()` and `createIconImportProxy()` marked `// DO NOT REMOVE`; `main.tsx` imports `@github/spark/spark`; `spark.json`/`runtime.config.json` carry the Spark app id. A `spark` global (LLM helper, KV store, user info) is declared in [src/vite-end.d.ts](src/vite-end.d.ts) — nothing in `src/` calls it today; AI parsing goes through `aiClient.ts` instead. Don't strip these unless intentionally de-Sparking the project.
- `strictNullChecks` is on but full `strict` is not. Per the fleet rule, don't suppress type errors with `as any` / `@ts-ignore` (a couple of legacy `@ts-ignore`s exist around pdfjs typings).
