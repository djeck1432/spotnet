import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    name: "react",
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
    },
  },
});
