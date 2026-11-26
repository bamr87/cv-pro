// Security gate for the AI settings (bamr87/cv-pro#40). Runs as part of
// `npm test`. /settings sits behind <Protected>, so an unauthenticated
// Cypress run never renders it; this static check holds the rules instead.
//
//  1. The API key field in src/pages/SettingsPage.tsx is masked by default
//     (type password, no autocomplete/spellcheck), labelled, and has a
//     show/hide toggle with aria-pressed and an accessible name.
//  2. The settings load error is surfaced, never swallowed.
//  3. firestore.rules exists, scopes users/{uid}/** to its owner and denies
//     every other path; firebase.json points at it.

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0;
const check = (cond, msg) => {
  if (cond) console.log(`ok: ${msg}`);
  else {
    failures += 1;
    console.error(`FAIL: ${msg}`);
  }
};

// 1-2. Settings page
const page = readFileSync(join(root, 'src', 'pages', 'SettingsPage.tsx'), 'utf8');
const inputs = page.match(/<Input\b[\s\S]*?\/>/g) ?? [];
const keyInput = inputs.find((tag) => /value=\{apiKey\}/.test(tag)) ?? '';
check(keyInput !== '', 'SettingsPage renders an <Input value={apiKey}>');
check(
  /type=\{\s*showKey\s*\?\s*'text'\s*:\s*'password'\s*\}/.test(keyInput) &&
    /useState\(false\)/.test(page.match(/\[showKey,\s*setShowKey\]\s*=\s*useState\([^)]*\)/)?.[0] ?? ''),
  'API key input is type="password" by default (showKey starts false)',
);
check(/autoComplete="off"/.test(keyInput), 'API key input has autoComplete="off"');
check(/spellCheck=\{false\}/.test(keyInput), 'API key input has spellCheck={false}');
const id = keyInput.match(/\bid="([^"]+)"/)?.[1];
check(Boolean(id) && page.includes(`htmlFor="${id}"`), 'API key input id is matched by a label htmlFor');
const toggle = (page.match(/<Button\b[\s\S]*?<\/Button>/g) ?? []).find((tag) => /aria-pressed/.test(tag)) ?? '';
check(
  /aria-pressed=\{showKey\}/.test(toggle) && /aria-label=/.test(toggle) && /setShowKey/.test(toggle),
  'a show/hide toggle sets showKey and carries aria-pressed and aria-label',
);
check(!page.includes('// noop'), 'no swallowed "// noop" catch in SettingsPage');
const loadEffect = page.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[user\]\);/)?.[0] ?? '';
check(
  /catch\s*\(\s*e\b[^)]*\)\s*\{\s*toast\.error\([^;]*\be\??\.message/.test(loadEffect),
  'the settings load effect catch calls toast.error with the error message',
);

// 3. Firestore rules
const rulesPath = join(root, 'firestore.rules');
check(existsSync(rulesPath), 'firestore.rules exists');
if (existsSync(rulesPath)) {
  const rules = readFileSync(rulesPath, 'utf8').replace(/\/\/.*$/gm, '');
  const flat = rules.replace(/\s+/g, ' ');
  check(
    flat.includes(
      'match /users/{uid}/{document=**} { allow read, write: if request.auth != null && request.auth.uid == uid; }',
    ),
    'rules scope users/{uid}/{document=**} to its owner',
  );
  check(
    flat.includes('match /{document=**} { allow read, write: if false; }'),
    'rules deny every other path by default',
  );
  const allows = rules.match(/allow [^;]*;/g) ?? [];
  check(allows.length === 2, `rules contain exactly the two allow statements (found ${allows.length})`);
}
const fbPath = join(root, 'firebase.json');
let fb = {};
try {
  fb = JSON.parse(readFileSync(fbPath, 'utf8'));
} catch {
  fb = {};
}
check(fb?.firestore?.rules === 'firestore.rules', 'firebase.json points firestore.rules at the rules file');

if (failures > 0) {
  console.error(`\nsecurity check failed with ${failures} problem(s). See SECURITY.md.`);
  process.exit(1);
}
console.log('\nsecurity check passed.');
