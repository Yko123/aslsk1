/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// base "./" lets the built site (dist/) open from any folder or static host.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { host: "127.0.0.1" },
  test: { include: ["src/**/*.test.ts"] },
});
