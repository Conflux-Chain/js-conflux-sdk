/* eslint-disable import/no-extraneous-dependencies */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs-extra');
const path = require('path');
const { replaceTSImport } = require('./replaceTSimport');

const DOC_FOLDER = './docs/api/';

const files = [
  './src/Conflux.js',
  './src/CONST.js',
  './src/Drip.js',
  './src/Message.js',
  './src/PersonalMessage.js',
  './src/Transaction.js',
  './src/rpc/txpool.js',
  './src/rpc/pos.js',
  './src/subscribe/PendingTransaction.js',
  './src/provider/BaseProvider.js',
  './src/provider/index.js',
  './src/provider/HttpProvider.js',
  './src/provider/WebSocketProvider.js',
  './src/wallet/Wallet.js',
  './src/wallet/Account.js',
  './src/wallet/index.js',
  './src/wallet/PrivateKeyAccount.js',
  './src/util/address.js',
  './src/util/sign.js',
  './src/util/format.js',
];

async function renderFile(fileMeta) {
  let source = fs.readFileSync(fileMeta, 'utf8');
  source = replaceTSImport({ source });
  const result = await jsdoc2md.render({ source });
  // calculate the final markdown file name
  let fileName = path.join(DOC_FOLDER, fileMeta.replace('./src/', ''));
  fileName = fileName.replace('.js', '.md');
  await fs.ensureFile(fileName);
  fs.writeFileSync(fileName, result);
}

async function main() {
  for (const file of files) {
    await renderFile(file);
  }
}

main().catch(console.error);
