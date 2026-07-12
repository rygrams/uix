import { defineConfig, mergeConfig } from "vitest/config"
import swc from "unplugin-swc"
import { baseConfig } from "./base.js"

/**
 * A custom Vitest configuration for backend (NestJS / Node) apps.
 *
 * The SWC plugin emits decorator metadata (reading the app's tsconfig) so
 * NestJS dependency injection works under Vitest.
 */
export const nodeConfig = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
    },
    oxc: false,
    plugins: [swc.vite({ module: { type: "es6" } })],
  }),
)
