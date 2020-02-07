/* eslint-disable import/no-extraneous-dependencies */
const browserify = require('browserify');
const babelify = require('babelify');
const commonShake = require('common-shakeify');
const fs = require('fs');
const exorcist = require('exorcist');
const esmify = require('esmify');
const pkg = require('./package.json');

const browserifyOptions = {
  debug: true, // gen inline sourcemap to extract with exorcist
  standalone: 'Conflux', // generate a umd file to load directly into browser
  detectGlobals: true, // detect __diranme process global __filename
};

const OUTPUT_FILE_NAME = 'js-conflux-sdk';
const ENTRY_POINT = pkg.main;

browserify(browserifyOptions)
  .add(ENTRY_POINT)
  .ignore('crypto')
  .plugin('tinyify')
  .bundle()
  .pipe(exorcist(`./dist/${OUTPUT_FILE_NAME}.umd.min.js.map`))
  .pipe(fs.createWriteStream(`./dist/${OUTPUT_FILE_NAME}.umd.min.js`));

browserify(browserifyOptions)
  .add(ENTRY_POINT)
  .ignore('crypto')
  .transform(babelify.configure({ presets: ['@babel/preset-env'] }))
  .plugin(commonShake)
  .plugin(esmify)
  .bundle()
  .pipe(fs.createWriteStream(`./dist/${OUTPUT_FILE_NAME}.esm.js`));
