import { defineConfig, mergeConfig } from "vitest/config"
import { nodeConfig } from "@app/vitest-config/node"

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ["test/**/*.e2e-spec.ts"],
    },
  }),
)
