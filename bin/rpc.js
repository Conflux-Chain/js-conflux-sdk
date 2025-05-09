#!/usr/bin/env node
/* eslint-disable no-console */
const { program } = require('commander');
const { Conflux, Drip } = require('../src');

const mainnetMeta = {
  url: 'https://main.confluxrpc.com',
  networkId: 1029,
};

const testnetMeta = {
  url: 'https://test.confluxrpc.com',
  networkId: 1,
};

program
  .version('0.0.1')
  .name('sponsor')
  .option('-t, --testnet', 'Use Conflux testnet network');

program
  .command('cfx')
  .description('call methods in cfx namespace')
  .argument('<method>', 'RPC method name to call')
  .argument('[args...]', 'args')
  .action(cfx);

program
  .command('call')
  .description('call methods in cfx namespace')
  .argument('<namespace>', 'RPC namespace: cfx, pos, txpool, trace')
  .argument('<method>', 'RPC method name to call')
  .argument('[args...]', 'args')
  .action(call);

function _getClient() {
  const options = program.opts();
  const conflux = options.testnet ? new Conflux(testnetMeta) : new Conflux(mainnetMeta);
  return conflux;
}

/* function _getAccount(conflux) {
  if (!process.env.PRIVATE_KEY) {
    console.log('Please set PRIVATE_KEY environment variable to update sponsor');
    process.exit();
  }
  return conflux.wallet.addPrivateKey(process.env.PRIVATE_KEY);
} */

async function cfx(method, args) {
  const conflux = _getClient();
  if (!conflux.cfx[method]) {
    console.log(`${method} is not a valid cfx method`);
    return;
  }
  const result = await conflux.cfx[method](...args);
  console.log(`cfx_${method}: `, result);
}

async function call(namespace, method, args) {
  const conflux = _getClient();

  if (!conflux[namespace]) {
    console.log(`${namespace} is not a valid namespace`);
    return;
  }
  const methods = conflux[namespace];

  if (!methods[method]) {
    console.log(`${method} is not a valid ${namespace} method`);
    return;
  }
  const result = await methods[method](...args);
  console.log(`${namespace}_${method}: `, result);
}

program.parse(process.argv);
