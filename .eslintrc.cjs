// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
    extends: [
        'eslint:recommended',
        'plugin:unicorn/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/strict-type-checked',
        // not sure if we want this or not
        // 'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
    ],
    plugins: ['simple-import-sort', '@typescript-eslint', 'import'],
    parser: '@typescript-eslint/parser',
    parserOptions: { project: './tsconfig.json' },
    settings: { 'import/resolver': { typescript: {} } },
    rules: {
        'simple-import-sort/imports': [
            'error',
            {
                // Custom import grouping see https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
                // Type imports always go last in their group (we use String.raw to avoid a bunch of escaping)
                groups: [
                    // Side effect imports. (import './file.ts')
                    [String.raw`^\u0000`],
                    // Node.js builtins prefixed with `node:`. (they get enforced by 'unicorn/prefer-node-protocol')
                    [String.raw`^node:`, String.raw`^node:.*\u0000$`],
                    // Packages.
                    // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                    // But not local monorepo packages.
                    [String.raw`^@?\w`, String.raw`^@?\w.*\u0000$`],

                    // Local package imports.
                    // Anything that starts with a dot or ~/
                    [
                        String.raw`^\.`,
                        String.raw`^`,
                        String.raw`^~/`,
                        String.raw`^\..*\u0000$`,
                        String.raw`^[^.].*\u0000$`,
                        String.raw`^~/.*\u0000$`,
                    ],
                ],
            },
        ],

        'object-shorthand': ['error', 'always'],

        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: true,
                fixStyle: 'inline-type-imports',
            },
        ],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/require-await': 'off',

        'unicorn/no-null': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prefer-event-target': 'off',
        'unicorn/template-indent': ['error', { indent: 4 }],
    },
});
