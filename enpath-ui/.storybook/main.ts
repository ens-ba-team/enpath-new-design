import type { StorybookConfig } from '@storybook/nextjs-vite';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';

// Foundations pages read Tokens/*.tokens.json and Machine Readable/ (token usage, story titles),
// which sit outside enpath-ui: let the dev server serve those folders too.
const tokensDir = fileURLToPath(new URL('../../Tokens', import.meta.url));
const machineReadableDir = fileURLToPath(new URL('../../Machine Readable', import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
    "@storybook/addon-themes"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  viteFinal: async (config) => {
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [
      ...(config.server.fs.allow ?? [searchForWorkspaceRoot(process.cwd())]),
      tokensDir,
      machineReadableDir,
    ];
    return config;
  },
};
export default config;
