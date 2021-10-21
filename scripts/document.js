const fs = require('fs');
const lodash = require('lodash');
const jsdocToMd = require('@geekberry/jsdoc-to-md'); // eslint-disable-line import/no-extraneous-dependencies
const { sep } = require('path');

function generateMarkdown(filters, apiName) {
  const markdown = jsdocToMd(`${__dirname}/../src`, {
    filter: filename => {
      if (lodash.some(filters, suffix => filename.endsWith(suffix))) {
        console.log(`File "${filename}" parsing...`); // eslint-disable-line no-console
        return true;
      }
      return false;
    },
  });

  fs.writeFileSync(`${__dirname}/../docs/api/${apiName}.md`, `
  ${markdown}
  `);
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

for (const API of APIs) {
  generateMarkdown(API.files, API.name);
}
