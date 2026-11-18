import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // Serve the repo-root public/ as this app's static directory. It holds the
  // fleet page-feedback kit (fleet-feedback.js, fleet-feedback-capture.js),
  // vendored byte-identical from the hub and upgraded only by its fan-out
  // (bamr87/bamr87 tools/fanout.sh --kit feedback), which looks for it there.
  // Never copy or edit those files under app/.
  publicDir: resolve(import.meta.dirname, '../public'),
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
