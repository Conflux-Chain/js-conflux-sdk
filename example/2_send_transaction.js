/* eslint-disable */
const { Conflux, Transaction, Drip } = require('../src'); // require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'http://test.confluxrpc.org/v2',
  networkId: 1,
  // logger: console, // use console to print log
});

const accountAlice = conflux.wallet.addPrivateKey('0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393', 1);
const addressBob = 'cfxtest:aatm5bvugvjwdyp86ruecmhf5vmng5ysy2pehzpz9h';

/*
 the simplest way to send a transaction.
 user only care about sender account, receiver address and value
 */
async function sendTransactionSimple() {
  console.log(await conflux.getBalance(accountAlice)); // 96283101378499979000
  console.log(await conflux.getBalance(addressBob)); // 0

  // alice send some CFX to bob
  const txHash = await conflux.sendTransaction({
    from: accountAlice.address, // `conflux.wallet.has(accountAlice.address)` must be true
    to: addressBob,
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
  });

  console.log(txHash); // 0x50cd13d5f97dd867d4ca65e24eb642f6444c07d6af8143018c558df456f11e63

  // you might need wait seconds here...
  console.log('waiting...');
  await new Promise(resolve => setTimeout(resolve, 30 * 1000));

  const transaction = await conflux.getTransactionByHash(txHash);
  console.log('transaction', JSON.stringify(transaction, null, 2));
  /*
  {
    "nonce": "3",
    "value": "100000000000000000",
    "gasPrice": "1000000000",
    "gas": "21000",
    "v": 0,
    "transactionIndex": 0,
    "status": 0,
    "storageLimit": "0",
    "chainId": 1,
    "epochHeight": 784646,
    "blockHash": "0xfa7c6d9d0c8ae436f1c9c785a316ac6cc4db16286eede3dd3d5c6a5a22ad5f9e",
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "hash": "0x50cd13d5f97dd867d4ca65e24eb642f6444c07d6af8143018c558df456f11e63",
    "r": "0x50c599cb158968f7f0e38bd37fd20e585275de03dc52698425544ad6d8e4f55e",
    "s": "0x524a536e57bb036f31bb44b325a5162e83e2afb4c76925fb787c3f61c85b8853",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H"
  }
   */

  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log('receipt', JSON.stringify(receipt, null, 2));
  /*
  {
    "index": 0,
    "epochNumber": 784649,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000000000000",
    "blockHash": "0xfa7c6d9d0c8ae436f1c9c785a316ac6cc4db16286eede3dd3d5c6a5a22ad5f9e",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x166cbcbfd747505d91237ccd8f849fd6882ad0e6d8b9923ca3c44891cf2b8753",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "transactionHash": "0x50cd13d5f97dd867d4ca65e24eb642f6444c07d6af8143018c558df456f11e63"
  }
  */

  console.log(await conflux.getBalance(accountAlice)); // 96183080378499979000
  console.log(await conflux.getBalance(addressBob)); // 0
}

/*
 this function show how many fields inner transaction and how to fill them by sdk.
 */
async function sendTransactionComplete() {
  const to = addressBob;
  const value = Drip.fromGDrip(100); // 100 GDrip = 100000000000 Drip
  const estimate = await conflux.estimateGasAndCollateral({ to, value });

  const status = await conflux.getStatus();
  const epochNumber = await conflux.getEpochNumber();
  const gasPrice = await conflux.getGasPrice();
  const nonce = await conflux.getNextNonce(accountAlice.address);

  const options = {
    from: accountAlice.address,
    nonce,
    gasPrice,
    gas: estimate.gasUsed,
    to,
    value,
    storageLimit: estimate.storageCollateralized,
    epochHeight: epochNumber,
    chainId: status.chainId,
    data: null,
  };

  console.log(JSON.stringify(options, null, 2));
  /*
  {
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "nonce": "20",
    "gasPrice": "1",
    "gas": "21000",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "value": "100000000000",
    "storageLimit": "0",
    "epochHeight": 710101,
    "chainId": 1,
    "data": null
  }
   */

  const txHash = await conflux.sendTransaction(options);
  console.log(txHash); // 0xc9eb9cb5d6d38de141f87be36510135d569b5a3d8313b7dc365988f4af717c32

  let receipt = null;
  while (true) {
    // try to get receipt every 1000 ms
    receipt = await conflux.getTransactionReceipt(txHash);
    if (receipt) {
      break;
    }

    console.log('tx not executed');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('receipt', JSON.stringify(receipt, null, 2));
  /*
  receipt {
    "index": 1,
    "epochNumber": 710106,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000",
    "blockHash": "0x200369f5def036b4bc7c58bbbc9b1ea036065c73c2aa0ffe79738f1ac7e718de",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x46f33aab3426a61c34b2e0bf3c4b512b0c6d5911f8f13885816098c77edd2184",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "transactionHash": "0xb081916702938d6957c764d91f7e4cc6537ce8883aa5dc6f572011ef54d3ad19",
    "txExecErrorMsg": null
  }
  */
}

/*
 this function split sign and send transaction operate,
 so user can sign or send in different way.
 */
async function signAndSendTransactionManual() {
  const options = {
    nonce: await conflux.getNextNonce(accountAlice.address), // or just `getNextNonce(accountAlice)`
    gasPrice: 1000000000,
    gas: 21000,
    to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
  };

  const transaction = await accountAlice.signTransaction(options); // just sign, not send to node yet
  console.log(transaction instanceof Transaction); // true
  console.log(transaction);
  /*
    Transaction {
    from: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    nonce: 6,
    gasPrice: 1000000000,
    gas: 21000,
    to: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
    v: 1,
    r: '0xb1e32ebbd78453bb76fe90d5743bf6177240b55509296d51e75265878eec01a4',
    s: '0x6593aa89f53fbc5814b54da923f6ee98dd8e4a281ee55b20aae31afd2d89a182'
  }
   */

  console.log(transaction.hash); // 0x3c13cee1caa4848d2005dbf26c4952ecf9f43908d882d4868c871ade0d34977a
  console.log(transaction.serialize()); // 0xf86feb06843b9aca00825208941ead8630345121d19ee3604128e5dc54b36e8ea685174876e80080830c0ae6018001a0b1e32ebbd78453bb76fe90d5743bf6177240b55509296d51e75265878eec01a4a06593aa89f53fbc5814b54da923f6ee98dd8e4a281ee55b20aae31afd2d89a182

  const txHash = await conflux.sendRawTransaction(transaction.serialize()); // send hex string here
  console.log(txHash); // 0x3c13cee1caa4848d2005dbf26c4952ecf9f43908d882d4868c871ade0d34977a
}

/*
 some times user just want to sign transaction sync without create any Account instance.
 `Transaction.prototype.sign` is used to sign transaction with a private key.
 PrivateKeyAccount.prototype.signTransaction also call this method to sign.
 */
function signTransactionByPrivateKey() {
  const transaction = new Transaction({
    nonce: 6,
    gasPrice: 1000000000,
    gas: 21000,
    to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
  });

  console.log(transaction); // `from, v, r, s` still empty
  /*
  Transaction {
    from: undefined,
    nonce: 6,
    gasPrice: 1000000000,
    gas: 21000,
    to: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
    v: undefined,
    r: undefined,
    s: undefined
  }
  */

  transaction.sign(accountAlice.privateKey);
  console.log(transaction); // `from, v, r, s` filled
  /*
  Transaction {
    from: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    nonce: 6,
    gasPrice: 1000000000,
    gas: 21000,
    to: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
    v: 1,
    r: '0xb1e32ebbd78453bb76fe90d5743bf6177240b55509296d51e75265878eec01a4',
    s: '0x6593aa89f53fbc5814b54da923f6ee98dd8e4a281ee55b20aae31afd2d89a182'
  }
  */

  transaction.sign('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'); // any other privateKey
  console.log(transaction); // `from, v, r, s` changed
  /*
  Transaction {
    from: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    nonce: 6,
    gasPrice: 1000000000,
    gas: 21000,
    to: 'CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H',
    value: 100000000000,
    storageLimit: 0,
    epochHeight: 789222,
    chainId: 1,
    data: null,
    v: 0,
    r: '0xef00d7647a00c781ecff231669bee273690ca4eaecd5fa45f15839b73d2d570c',
    s: '0x30559d67b84f91ac4062b8346d9b42723a164a5e2e19882380c05b8efe7ecde9'
  }
   */
}

/*
 this example show how to subscribe transaction sending stepwise
 Note: it's unnecessary to await transaction step by step, in most case just:

 > `const receipt = await account.sendTransaction({...}).executed();`

 to get receipt directly
 */
async function subscribeTransaction() {
  // NO await !!!
  const pendingTransaction = conflux.sendTransaction({
    from: accountAlice,
    to: accountAlice, // to self as a example
    value: 0,
  }); // not send transaction yet

  console.log(pendingTransaction.constructor.name); // "PendingTransaction"

  const sendTimestamp = Date.now();
  const txHash = await pendingTransaction; // send and await to get transactionHash from node
  console.log(txHash); // 0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88

  const packedTx = await pendingTransaction.get(); // await to get txHash
  // "transactionIndex", "status", "blockHash" still null
  console.log(`packed after ${Date.now() - sendTimestamp} ms`, JSON.stringify(packedTx, null, 2));
  /*
  packed after 3433 ms {
    "nonce": "8",
    "value": "0",
    "gasPrice": "1000000000",
    "gas": "21000",
    "v": 0,
    "transactionIndex": null,
    "status": null,
    "storageLimit": "0",
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": null,
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H"
  }
   */

  const minedTx = await pendingTransaction.mined();
  // "transactionIndex", "status", "blockHash" filled
  console.log(`mined after ${Date.now() - sendTimestamp} ms`, JSON.stringify(minedTx, null, 2));
  /*
  mined after 9482 ms {
    "nonce": "8",
    "value": "0",
    "gasPrice": "1000000000",
    "gas": "21000",
    "v": 0,
    "transactionIndex": 0,
    "status": 0,
    "storageLimit": "0",
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H"
  }
   */

  const executedReceipt = await pendingTransaction.executed();
  // outcomeStatus === 0 means success
  console.log(`executed after ${Date.now() - sendTimestamp} ms`, JSON.stringify(executedReceipt, null, 2));
  /*
  executed after 14556 ms {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000000000000",
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
  }
   */

  const confirmedReceipt = await pendingTransaction.confirmed();
  // await till risk coefficient < threshold (default 1e-8)
  console.log(`confirmed after ${Date.now() - sendTimestamp} ms`, JSON.stringify(confirmedReceipt, null, 2));
  /*
  confirmed after 53710 ms {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": "21000",
    "gasFee": "21000000000000",
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AATM5BVUGVJWDYP86RUECMHF5VMNG5YSY2PEHZPZ9H",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
  }
   */
}

/*
 Warning! some example might send a transaction. please test them ont by one
 */
async function main() {
  // await sendTransactionSimple();
  // await sendTransactionComplete();
  // await signAndSendTransactionManual();
  signTransactionByPrivateKey();
  // await subscribeTransaction();
}

main().finally(() => conflux.close());
