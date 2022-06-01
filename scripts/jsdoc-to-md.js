/* eslint-disable import/no-extraneous-dependencies */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const { replaceTSImport } = require('./replaceTSimport');

const DOC_FOLDER = './docs/api/';

const files = [{
  source: './src/rpc/txpool.js',
  name: 'txpool.md',
}, {
  source: './src/rpc/pos.js',
  name: 'PoS.md',
}];

async function renderFile(fileMeta) {
  let source = fs.readFileSync(fileMeta.source, 'utf8');
  source = replaceTSImport({ source });
  const result = await jsdoc2md.render({
    // files: fileMeta.source,
    source,
  });
  fs.writeFileSync(`${DOC_FOLDER}${fileMeta.name}`, result);
}

async function main() {
  for (const file of files) {
    await renderFile(file);
  }
}

main().catch(console.error);
