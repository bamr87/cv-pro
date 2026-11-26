Thanks for helping make GitHub safe for everyone.

# Security

GitHub takes the security of our software products and services seriously, including all of the open source code repositories managed through our GitHub organizations, such as [GitHub](https://github.com/GitHub).

Even though [open source repositories are outside of the scope of our bug bounty program](https://bounty.github.com/index.html#scope) and therefore not eligible for bounty rewards, we will ensure that your finding gets passed along to the appropriate maintainers for remediation. 

## Reporting Security Issues

If you believe you have found a security vulnerability in any GitHub-owned repository, please report it to us through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please send an email to opensource-security[@]github.com.

Please include as much of the information listed below as you can to help us better understand and resolve the issue:

  * The type of issue (e.g., buffer overflow, SQL injection, or cross-site scripting)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Policy

See [GitHub's Safe Harbor Policy](https://docs.github.com/en/site-policy/security-policies/github-bug-bounty-program-legal-safe-harbor#1-safe-harbor-terms)

## AI API keys and Firestore rules (cv-pro)

- **Where keys live.** The AI provider key a user enters on the Settings page is stored per user, **in plaintext**, in a Firestore field: `users/{uid}/settings/ai` → `{provider, apiKey}`. It is not encrypted at rest beyond what Firestore itself provides, and the browser sends it directly to the provider. The Settings field masks the key on screen (`type="password"`, `autoComplete="off"`, a show/hide toggle); masking hides it from shoulder-surfing and screen shares, not from anyone who can read the document.
- **Who can read them.** [firestore.rules](firestore.rules) allows a signed-in user to read and write only their own `users/{uid}/**` subtree and denies every other path. `npm test` (`scripts/security-check.mjs`) fails if the rules or the masked field regress.
- **Deploying the rules.** The rules take effect only once deployed to the Firebase project. From `app/` (where `firebase.json` points at the file): `firebase deploy --only firestore:rules`. Deploy them before pointing a production build at a project, and again after any change to `firestore.rules`.
