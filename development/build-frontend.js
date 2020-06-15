/* eslint-disable import/no-extraneous-dependencies */
const { mkdirpSync } = require('fs-extra');
const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const exorcist = require('exorcist');

const browserifyOptions = {
  browserField: 'browserify-browser',
  entries: ['./src/index.js'],
  debug: true, // gen inline sourcemap to extract with exorcist
  standalone: 'Conflux', // generate a umd file to load directly into browser
  detectGlobals: true, // detect __diranme process global __filename
};

const OUTPUT_FILE_NAME = 'js-conflux-sdk';

mkdirpSync('dist');

// use babel to remove unused lodash code
// https://www.blazemeter.com/blog/the-correct-way-to-import-lodash-libraries-a-benchmark/
const babelTransform = babelify.configure({
  presets: ['@babel/preset-env'],
  plugins: [
    'lodash',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
});

browserify(browserifyOptions)
  .ignore('crypto')
  .transform(babelTransform)
  .plugin('tinyify')
  .bundle()
  .pipe(exorcist(`./dist/${OUTPUT_FILE_NAME}.umd.min.js.map`))
  .pipe(fs.createWriteStream(`./dist/${OUTPUT_FILE_NAME}.umd.min.js`));
