# contract/ — the two-repo CVData contract

`cv.schema.json` is a **byte-identical vendored copy** of [bamr87/cv `data/cv.schema.json`](https://github.com/bamr87/cv/blob/main/data/cv.schema.json) — that repo is the source of truth for the CVData shape this app edits and exports.

`npm test` (`scripts/contract-check.mjs`) gates this repo against it: the Cypress fixture must validate against the schema, and every property the schema declares must exist in `src/types/cv.ts`. So a contract change that lands in bamr87/cv without landing here turns this repo's CI red the moment the copy is refreshed — and a local type change the schema doesn't know about fails immediately.

Updating the contract (always backward-compatibly, per the two-repo rule):

1. Land the change in bamr87/cv first (`builder/types.ts` + `data/cv.schema.json` + its validator).
2. Copy the schema here verbatim: `curl -fsSL https://raw.githubusercontent.com/bamr87/cv/main/data/cv.schema.json > contract/cv.schema.json` (or plain file copy — keep it byte-identical so diffs against upstream stay trivial).
3. Mirror the shape in `src/types/cv.ts` (+ forms/serializers as needed) and run `npm test`.
