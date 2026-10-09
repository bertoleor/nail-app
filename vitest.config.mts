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
    environmentOptions: {
      jsdom: {
        // NAIL-H3/L3: jsdom 29 throws SecurityError for localStorage on opaque
        // origins, which silently breaks every zustand persist store
        // (storage === undefined -> setState crashes). A real origin fixes it.
        url: "http://localhost:3000/",
      },
    },
    globals: true,
    // NAIL-H3/L3: jsdom 29 delegates localStorage to the Node runtime, which
    // only exposes it with --localstorage-file. Without this, window.localStorage
    // is undefined and every zustand persist store crashes on setState.
    // NOTE: Vitest 4 REMOVED test.poolOptions — execArgv is a top-level test
    // option now (the old poolOptions.forks.execArgv form is silently ignored).
    execArgv: [`--localstorage-file=${path.join(__dirname, ".vitest-localstorage.json")}`],
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["__tests__/setup.ts"],
  },
});
