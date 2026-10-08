import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      exclude: ["node_modules/", "__tests__/", "**/*.d.ts", "**/*.config.*", "src/app/**/page.tsx"],
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    globals: true,
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["__tests__/setup.ts"],
  },
});
