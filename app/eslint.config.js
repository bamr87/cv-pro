import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  // Application source: React 19 + TypeScript, bundled by Vite for the browser.
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Pre-existing `any` usage (Firebase payloads, pdfjs items, the Spark
      // global). Reported so it can be paid down, but not a merge blocker.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // The LaTeX templates are one big template literal holding *nested*
  // template-literal source. The `\$\{...\}` / `\}` escapes are deliberate and
  // kept symmetric for readability; they are no-ops to JS, so no-useless-escape
  // fires ~160 times here with nothing real to fix.
  {
    files: ['src/lib/latex-templates.ts'],
    rules: { 'no-useless-escape': 'off' },
  },
  // Build/tooling config files run in Node.
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  // Cypress end-to-end specs.
  {
    extends: [js.configs.recommended],
    files: ['cypress/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
)
