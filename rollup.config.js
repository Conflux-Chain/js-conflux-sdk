import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import path from 'path';
import pkg from './package.json';

export default [
  {
    input: pkg.main,
    plugins: [
      resolve({
        mainFields: ['module', 'main', 'browser'],
        preferBuiltins: true,
        rootDir: path.resolve(__dirname, './'),
      }),
      builtins(),
      commonjs(),
      json(),
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: [
                  'last 1 version',
                ],
              },
              modules: false,
              loose: false,
            },
          ],
        ],
      }),
    ],
    output: [
      {
        format: 'umd',
        name: 'JsConfluxSDK',
        file: 'build/js-conflux-sdk.umd.js',
      },
      {
        format: 'esm',
        name: 'JsConfluxSDK',
        file: 'build/js-conflux-sdk.esm.js',
      },
      {
        format: 'cjs',
        name: 'JsConfluxSDK',
        file: 'build/js-conflux-sdk.cjs.js',
      },
    ],
  },
];
