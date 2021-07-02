#!/usr/bin/env node
const { program } = require('commander');
const sign = require('../src/util/sign');
const format = require('../src/util/format');

program.version('0.0.1')
  .name('cfxjs');

program.command('genEthCMPTaccount')
  .description('Generate a ethereum compatible account')
  .action(genCompatibleAccount);

program.parse(process.argv);

function genCompatibleAccount() {
  while (true) {
    const privateKey = sign.randomPrivateKey();
    const publicKey = sign.privateKeyToPublicKey(privateKey);
    let address = sign.keccak256(publicKey).slice(-20);
    address = format.hex(address);
    if (address.startsWith('0x1')) {
      console.log('PrivateKey: ', format.hex(privateKey));
      console.log('Address: ', address);
      break;
    }
  }
}
