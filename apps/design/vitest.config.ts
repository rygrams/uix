import { defineConfig, mergeConfig } from 'vitest/config'
import { reactConfig } from '@app/vitest-config/react'

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ['app/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
)
