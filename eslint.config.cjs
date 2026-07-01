// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const storybook = require("eslint-plugin-storybook");
const nx = require('@nx/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:e2e'],
            },
            {
              sourceTag: 'domain:cv',
              onlyDependOnLibsWithTags: ['domain:cv', 'domain:shared'],
            },
            {
              sourceTag: 'domain:scribo',
              onlyDependOnLibsWithTags: ['domain:scribo', 'domain:shared'],
            },
            {
              sourceTag: 'domain:shared',
              onlyDependOnLibsWithTags: ['domain:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: jsoncParser,
    },
  },
];
