import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // `npm run dev` serves on 5000, not Vite's usual 5173: sparkPlugin() in
    // vite.config.ts defaults the dev server port to 5000 (which is also why
    // `npm run kill` frees that port). Override with CYPRESS_BASE_URL.
    baseUrl: 'http://localhost:5000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false
  },
});
