// The app's Markdown and ASCII exports ARE the CV build machine's exporters
// (cv/builder), imported rather than copied, so the app and the published
// CV.md / cv.txt can never drift apart again (bamr87/cv-pro#28). Both modules
// depend only on cv/builder/types.ts, which mirrors src/types/cv.ts (the
// shared contract in contract/cv.schema.json).
export { exportToMarkdown } from '../../../cv/builder/markdown.ts';
export { exportToASCII } from '../../../cv/builder/ascii.ts';
