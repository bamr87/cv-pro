// Contract gate: keep this app aligned with the bamr87/cv CVData contract
// (contract/cv.schema.json, vendored verbatim from that repo — see
// contract/README.md). Runs as `npm test`, which the fleet's standard-ci
// picks up automatically.
//
//  1. The Cypress round-trip fixture must validate against the schema —
//     it doubles as the golden example of a cv.json this app must accept.
//  2. Every property the schema declares must appear in src/types/cv.ts,
//     so a contract change landed upstream cannot silently miss the types.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(readFileSync(join(root, 'contract', 'cv.schema.json'), 'utf8'));
const fixture = JSON.parse(readFileSync(join(root, 'cypress', 'fixtures', 'cv.json'), 'utf8'));
const typesSource = readFileSync(join(root, 'src', 'types', 'cv.ts'), 'utf8');

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`FAIL: ${msg}`);
};
const ok = (msg) => console.log(`ok: ${msg}`);

// 1. fixture validates against the vendored schema
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (validate(fixture)) {
  ok('cypress/fixtures/cv.json validates against contract/cv.schema.json');
} else {
  for (const err of validate.errors ?? []) {
    fail(`fixture ${err.instancePath || '/'}: ${err.message}`);
  }
}

// 2. every schema-declared property exists in src/types/cv.ts
const declared = new Set();
const collect = (node) => {
  if (!node || typeof node !== 'object') return;
  if (node.properties) {
    for (const key of Object.keys(node.properties)) {
      if (key !== '$schema') declared.add(key);
      collect(node.properties[key]);
    }
  }
  if (node.items) collect(node.items);
  for (const def of Object.values(node.definitions ?? {})) collect(def);
};
collect(schema);

const missing = [...declared].filter((key) => !new RegExp(`\\b${key}\\??:`).test(typesSource));
if (missing.length === 0) {
  ok(`all ${declared.size} contract properties are present in src/types/cv.ts`);
} else {
  for (const key of missing) {
    fail(`schema property "${key}" is missing from src/types/cv.ts — mirror the contract change`);
  }
}

if (failures > 0) {
  console.error(`\ncontract check failed with ${failures} problem(s). See contract/README.md for the update procedure.`);
  process.exit(1);
}
console.log('\ncontract check passed.');
