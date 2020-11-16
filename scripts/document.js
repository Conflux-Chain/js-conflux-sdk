const fs = require('fs');
const lodash = require('lodash');
const jsdocToMd = require('@geekberry/jsdoc-to-md'); // eslint-disable-line import/no-extraneous-dependencies
const { sep } = require('path');

const markdown = jsdocToMd(`${__dirname}/../src`, {
  filter: filename => {
    const suffixArray = [
      `${sep}wallet${sep}Wallet.js`,
      `${sep}wallet${sep}PrivateKeyAccount.js`,
      `${sep}contract${sep}Contract.js`,
      `${sep}provider${sep}index.js`,
      `${sep}provider${sep}BaseProvider.js`,
      `${sep}provider${sep}HttpProvider.js`,
      `${sep}provider${sep}WebSocketProvider.js`,
      `${sep}subscribe${sep}PendingTransaction.js`,
      `${sep}subscribe${sep}Subscription.js`,
      `${sep}util${sep}format.js`,
      `${sep}util${sep}sign.js`,
      `${sep}CONST.js`,
      `${sep}Conflux.js`,
      `${sep}Message.js`,
      `${sep}Transaction.js`,
      `${sep}Drip.js`,
    ];

    if (lodash.some(suffixArray, suffix => filename.endsWith(suffix))) {
      console.log(`File "${filename}" parsing...`); // eslint-disable-line no-console
      return true;
    }
    return false;
  },
});

fs.writeFileSync(`${__dirname}/../docs/api.md`, `---
id: javascript_sdk
title: Javascript SDK
custom_edit_url: https://github.com/Conflux-Chain/js-conflux-sdk/edit/master/docs/api.md
keywords:
  - conflux
  - javascript
  - sdk
---

${markdown}
`);
