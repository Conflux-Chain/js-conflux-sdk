/* eslint-disable import/no-extraneous-dependencies */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const files = [
  './src/rpc/txpool.js',
  './src/rpc/pos.js',
];

async function main() {
  const result = await jsdoc2md.render({ files });
  fs.writeFileSync('docs/api/PoS.md', result);
}

main().catch(console.log);
