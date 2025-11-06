import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    conditions: ["module", "import", "default"],
  },
  optimizeDeps: {
    include: ["@reduxjs/toolkit", "framer-motion", "motion"],
    esbuildOptions: {
      conditions: ["module", "import", "default"],
    },
  },
});
