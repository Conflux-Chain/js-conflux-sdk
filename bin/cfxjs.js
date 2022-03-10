#!/usr/bin/env node
import { program } from 'commander';
import sign from '../src/util/sign.js';
import format from '../src/util/format.js';

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
