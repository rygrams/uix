import { defineConfig, mergeConfig } from "vitest/config"
import { baseConfig } from "./base.js"

/**
 * A custom Vitest configuration for front-end (React) apps.
 */
export const reactConfig = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "jsdom",
    },
  }),
)
