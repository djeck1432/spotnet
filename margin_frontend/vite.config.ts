import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			
		},
	},

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

