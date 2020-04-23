/* eslint-disable import/no-extraneous-dependencies, no-console */
const { mkdirpSync, emptyDirSync, copySync } = require('fs-extra');
const { promisify } = require('util');
const walker = require('walker');
const prependFile = promisify(require('prepend-file'));

const transforms = [];

mkdirpSync('lib');
emptyDirSync('lib');
copySync('src', 'lib');

walker('lib').on('file', file => {
  if (file.endsWith('.js') && file !== 'lib/main.js' && file !== 'lib\\main.js') {
    transforms.push(prependFile(file, 'require = require(\'esm\')(module);\n'));
  }
});

Promise.all(transforms).then(() => {
  console.info(`Build finished, transformed ${transforms.length} files.`);
});
