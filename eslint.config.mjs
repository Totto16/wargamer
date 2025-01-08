import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('airbnb-base'),
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  {
    rules: {
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],

      'no-prototype-builtins': 'off',
      'no-restricted-syntax': 'warn',
      'no-bitwise': 'off',
      'object-curly-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'operator-linebreak': 'off',
    },
  },
];
