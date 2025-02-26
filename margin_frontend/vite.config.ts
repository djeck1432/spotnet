import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    name: "react",
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
    },
    exclude: ["test/browser/**/*"],
  },
});

