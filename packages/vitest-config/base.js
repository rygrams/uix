import { defineConfig } from "vitest/config"

/**
 * A shared Vitest configuration for the repository.
 */
export const baseConfig = defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
  },
})
