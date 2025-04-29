//import tailwindcss from "@tailwindcss/vite";
//import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
//import react from "@vitejs/plugin-react";
//import { defineConfig } from "vitest/config";

//export default defineConfig({
//plugins: [
//TanStackRouterVite({
//target: "react",
//autoCodeSplitting: true,
//}),
//react(),
//tailwindcss(),
//],
//test: {
//globals: true,
//environment: "jsdom",
//},
//});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
});
