# CV Builder Pro

AI-powered CV/Resume builder with LaTeX templates, multiple export formats, and optional AI parsing. Built with React + TypeScript, Tailwind, and shadcn/ui.

### Key Features
- Personal, Experience, Education, Skills, Projects sections with validation
- Persistent local storage for CV data (no account required)
- Exports: Markdown (.md), ASCII Text (.txt), LaTeX source (.tex) with selectable templates
- Optional AI CV parsing from pasted text or PDF (requires sign-in + API key)
- Minimal auth layer using Firebase (email/password) to store AI settings

## Tech Stack
- React 19, TypeScript, Vite 6
- Tailwind CSS 4, Radix UI + shadcn/ui
- Firebase Auth + Firestore (for AI settings only)
- pdfjs-dist for PDF text extraction

## Quick Start
1) Install dependencies
```bash
npm install
```

2) Configure environment (optional but required for auth/AI)
Create `.env.local` in the project root with your Firebase config:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
If Firebase env vars are not set, the app still works offline for CV editing and exports, but Sign In and AI parsing are disabled.

3) Run the app
```bash
npm run dev
```
Open the URL printed by Vite.

## Usage
### Build your CV
- Navigate the tabs: Personal → Experience → Education → Skills → Projects
- Your data auto-saves to the browser (local storage). Use the "Save Progress" button anytime.

### Export
- Go to the Export tab
- Choose format: Markdown, ASCII, or LaTeX (.tex)
- For LaTeX, pick a template (Minimal Professional or Academic Scholar)
- Use Quick actions for one-click common exports

### AI Parser (optional)
AI parsing extracts structured CV data from pasted text or PDF.
- Sign in: Top-right → Sign in (email/password)
- Open Settings and set your AI provider + API key (supported: xAI Grok, OpenAI, Affinda)
- Go to AI Parser tab and either:
  - Upload a .txt or .pdf file, or
  - Paste your CV text
- Click "Parse CV with AI". Review/adjust the imported data, then export.

Notes:
- PDF support uses text extraction via pdf.js (layout may be imperfect depending on the source)
- Your AI API key is saved under your user in Firestore; CV content remains in your browser storage

## Project Structure
- `src/components/cv` — Forms, AI parser, export panel, main `CVBuilder`
- `src/types/cv.ts` — Strongly-typed CV data model
- `src/lib` — Firebase init, export helpers, LaTeX templates, PDF extraction, AI client
- `src/pages` — `LoginPage`, `SettingsPage`

### Data Model (excerpt)
```ts
export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    honors?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: Array<{ category: string; skills: string[] }>;
  certifications: string[];
  languages: string[];
}
```

### LaTeX Templates
Two starter templates are included and selectable in the Export tab:
- Minimal Professional (Article-based)
- Academic Scholar (moderncv)

Generated `.tex` can be compiled externally (e.g., Overleaf) if you don’t have a local LaTeX toolchain.

## Scripts
- `npm run dev` — Start dev server
- `npm run build` — Type-check then build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Lint source
- `npm run optimize` — Vite dependency optimization

## Environment & Security
- Do not embed AI provider API keys in client env vars; use the in-app Settings page so keys are stored per-user in Firestore
- If Firebase is not configured, auth and AI features are disabled, but local editing and exports continue to work

## Deployment
Deploy the built `dist` to any static host (e.g., Vercel, Netlify). Remember to set Firebase env vars in your hosting platform if you want auth/AI to work.

## License
MIT — see `LICENSE`.
