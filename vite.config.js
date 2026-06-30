import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window", // Polyfill 'global' for Draft.js
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // If the file comes from node_modules, bundle it into 'vendor'
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
