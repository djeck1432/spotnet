import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
    plugins: [
        TanStackRouterVite({
            target: "react",
            autoCodeSplitting: false,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "react-icons": path.resolve(__dirname, "node_modules/react-icons"),
            "react-icons/hi": path.resolve(__dirname, "node_modules/react-icons/hi/index.js"),
        },
    },
    optimizeDeps: {
        include: ["react-icons", "react-icons/hi"],
        exclude: ["react-icons/hi"],
        force: true,
    },
    ssr: {
        noExternal: ["react-icons", "react-icons/hi"],
    },
    server: {
        proxy: {
            "/api": {
                target: "http://backend:8000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});
