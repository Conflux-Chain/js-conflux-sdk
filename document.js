const fs = require('fs');
const lodash = require('lodash');
const jsdocToMd = require('@geekberry/jsdoc-to-md'); // eslint-disable-line import/no-extraneous-dependencies

const markdown = jsdocToMd(`${__dirname}/src`, {
  filter: filename => {
    const suffixArray = [
      'Conflux.js',
      'Account.js',
      'Contract.js',
      'Transaction.js',
      'Message.js',

      'provider\\BaseProvider.js',
      'provider\\HttpProvider.js',
      'provider\\WebsocketProvider.js',

      'util\\format.js',
      'util\\sign.js',
      'util\\unit.js',
    ];

    if (lodash.some(suffixArray, suffix => filename.endsWith(suffix))) {
      console.log(`File "${filename}" parsing...`); // eslint-disable-line no-console
      return true;
    }
    return false;
  },
});

fs.writeFileSync('./api.md', markdown);
