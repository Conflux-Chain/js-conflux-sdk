/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const minify = require('minify-stream');
const { mkdirpSync } = require('fs-extra');
const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const exorcist = require('exorcist');
const mold = require('mold-source-map');

const browserifyOptions = {
  browserField: 'browserify-browser',
  entries: ['./src/index.js'],
  debug: true, // gen inline sourcemap to extract with exorcist
  standalone: 'Conflux', // generate a umd file to load directly into browser
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
  .transform(babelTransform)
  .bundle()
  .pipe(minify())
  .pipe(mold.transformSourcesRelativeTo(path.resolve(__dirname, '../')))
  .pipe(exorcist(`./dist/${OUTPUT_FILE_NAME}.umd.min.js.map`))
  .pipe(fs.createWriteStream(`./dist/${OUTPUT_FILE_NAME}.umd.min.js`));
