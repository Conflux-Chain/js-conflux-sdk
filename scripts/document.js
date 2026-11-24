const fs = require('fs');
const lodash = require('lodash');
const jsdocToMd = require('jsdoc-to-markdown'); // eslint-disable-line import/no-extraneous-dependencies
const { join, sep } = require('path');
const { replaceTSImport } = require('./replaceTSimport');

function listSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = join(directory, entry.name);
    return entry.isDirectory() ? listSourceFiles(filename) : [filename];
  });
}

async function generateMarkdown(filters, apiName) {
  const sourceDir = `${__dirname}/../src`;
  const files = listSourceFiles(sourceDir)
    .filter(filename => lodash.some(filters, suffix => filename.endsWith(suffix)));

  const markdown = (await Promise.all(files.map(async filename => {
    console.log(`File "${filename}" parsing...`); // eslint-disable-line no-console
    return jsdocToMd.render({ source: replaceTSImport({ source: fs.readFileSync(filename, 'utf8') }) });
  }))).join('\n');

  fs.writeFileSync(`${__dirname}/../docs/api/${apiName}.md`, `${markdown}`);
}

const APIs = [
  {
    name: 'Conflux',
    files: [
      `${sep}Conflux.js`,
    ],
  }, {
    name: 'Wallet',
    files: [
      `${sep}wallet${sep}Wallet.js`,
      `${sep}wallet${sep}PrivateKeyAccount.js`,
    ],
  }, {
    name: 'Provider',
    files: [
      `${sep}provider${sep}index.js`,
      `${sep}provider${sep}BaseProvider.js`,
      `${sep}provider${sep}HttpProvider.js`,
      `${sep}provider${sep}WebSocketProvider.js`,
    ],
  }, {
    name: 'Contract',
    files: [
      `${sep}contract${sep}Contract.js`,
    ],
  }, {
    name: 'Transaction',
    files: [
      `${sep}Transaction.js`,
    ],
  }, {
    name: 'Drip',
    files: [
      `${sep}Drip.js`,
    ],
  }, {
    name: 'utils',
    files: [
      `${sep}util${sep}format.js`,
      `${sep}util${sep}sign.js`,
    ],
  }, {
    name: 'Subscribe',
    files: [
      `${sep}subscribe${sep}PendingTransaction.js`,
      `${sep}subscribe${sep}Subscription.js`,
    ],
  }, {
    name: 'Misc',
    files: [
      `${sep}CONST.js`,
      `${sep}Message.js`,
    ],
  },
];

Promise.all(APIs.map(API => generateMarkdown(API.files, API.name))).catch(error => {
  console.error(error); // eslint-disable-line no-console
  process.exitCode = 1;
});
