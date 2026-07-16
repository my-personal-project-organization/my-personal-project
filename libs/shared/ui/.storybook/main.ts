// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/angular-vite';
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { mergeConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { workspaceRoot } from '@nx/devkit';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp")
  ],
  framework: {
    name: getAbsolutePath("@storybook/angular-vite"),
    options: {
      compodoc: false,
    },
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [nxViteTsPaths()],
      css: {
        // Vite's postcss config search stops at the nearest ancestor
        // package.json (libs/shared/ui/package.json) because this repo has
        // no npm/pnpm workspaces marker, so it never reaches the root
        // .postcssrc.json that wires up @tailwindcss/postcss. Point the
        // search explicitly at the workspace root to pick it up.
        postcss: workspaceRoot,
      },
    });
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
