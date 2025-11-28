// # path: vite.config.ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Icons({
      // React JSX compiler for icon components
      compiler: "jsx",
      jsx: "react",
      // shorthand: auto-install icon sets when first used
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
