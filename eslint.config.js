import { defineConfig } from '@mastondzn/eslint';

export default defineConfig({
    stylistic: false,

    typescript: {
        tsconfigPath: './tsconfig.json',
    },

    rules: {
        'unicorn/prevent-abbreviations': 'off',
    },
});
