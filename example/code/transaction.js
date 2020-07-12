/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');

const PRIVATE_KEY = 'Your Private Key';
const ADDRESS = util.sign.privateKeyToAddress(PRIVATE_KEY);

// The signerCollection usually come from a 3rd-party key storage, such as MetaMask-like
// brower extension, app wallet, or cold wallet. 
const signerCollection = address => {
  if (address !== ADDRESS) {
    // return the trivial function if signer for the given address does not exist
    return () => {}
  }
  return async tx => {
    // Should notify the user what transaction is requesting for signature, and ask the user
    // whether they agree to sign. When agreed, fetch the private key, sign the transaction, 
    // and only return the signature. Therefore, the private key is never exposed.
    return util.sign.ecdsaSign(util.sign.sha3(tx.encode(false)), util.format.buffer(PRIVATE_KEY));
  };
};

const cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
  defaultGas: 1000000,
  logger: console,
});

// const account = cfx.Account(PRIVATE_KEY); // create account instance from PRIVATE_KEY
const account = cfx.Account(ADDRESS, signerCollection); // create account instance from ADDRESS & signerCollection

async function main() {
  console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  case1(); // send and get hash

  // case2(); // get promise and await step by step

  // case3(); // sign transaction and send raw manual
}

main().catch(e => console.error(e));

// ============================================================================
async function case1() {
  const txHash = await cfx.sendTransaction({
    from: account, // from account instance and will by sign by account.privateKey
    // nonce, // if missing, sdk will fill by `cfx.getNextNonce(account)` auto
    // gasPrice, // if missing, sdk will fill by `cfx.getGasPrice()` auto.
    // gas: estimate.gasUsed, // if missing, sdk will fill by `cfx.estimateGasAndCollateral(...)` got `gasUsed` auto
    to: account, // accept address string or account instance, here to self for example
    value: util.unit.fromCFXToDrip(0.125), // use unit to transfer from CFX to Drip
    // storageLimit: estimate.storageCollateralized, // if missing, sdk will fill by `cfx.estimateGasAndCollateral(...)` got `storageCollateralized` auto
    // epochHeight, // if missing, sdk will fill by `cfx.getEpochNumber()` auto
    // data: null, optional
  });
  console.log(txHash); // 0x23392c12a2dcb4910956bdbc8217e893b0db9b868bd6545f1e06fea5fba2ba05

  // FIXME: you might need wait few seconds here

  const tx = await cfx.getTransactionByHash(txHash);
  console.info(JSON.stringify(tx, null, 2));

  const receipt = await cfx.getTransactionReceipt(txHash);
  console.info(JSON.stringify(receipt, null, 2));
}

// ----------------------------------------------------------------------------
async function case2() {
  const promise = cfx.sendTransaction({
    from: account,
    to: account.address,
    value: util.unit.fromCFXToDrip(0.256),
  });
  // got `LazyPromise` instance promise, but not send RPC here yet.

  const txHash = await promise; // send RPC and await to get txHash
  console.log(txHash); // "0xcec63532922f505f5cc4c384edea2f5140cc3ba0a8e8d0ccac225026c25fcc6f"

  const packedTx = await promise.get(); // await to get txHash
  console.log(JSON.stringify(packedTx, null, 2)); // "transactionIndex", "status", "blockHash" still null
  // {
  //   "nonce": 27467821,
  //   "value": "256000000000000000",
  //   "gasPrice": "100",
  //   "gas": "1000000",
  //   "v": 0,
  //   "transactionIndex": null,
  //   "status": null,
  //   "blockHash": null,
  //   "chainId": "0x0",
  //   "contractCreated": null,
  //   "data": "0x",
  //   "epochHeight": "0x14f6eb",
  //   "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "hash": "0xcec63532922f505f5cc4c384edea2f5140cc3ba0a8e8d0ccac225026c25fcc6f",
  //   "r": "0x9e0c73c509e0ee644522e6678058e628666d1aaa58b7c4a5cf7600189c067539",
  //   "s": "0x168b8d48354566271e429ae76f62f47269a4de90c682027cf6a34924fe521231",
  //   "storageLimit": "0x0",
  //   "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
  // }

  const minedTx = await promise.mined(); // await till mined
  console.log(JSON.stringify(minedTx, null, 2)); // "transactionIndex", "status", "blockHash" filled
  // {
  //   "nonce": 27467821,
  //   "value": "256000000000000000",
  //   "gasPrice": "100",
  //   "gas": "1000000",
  //   "v": 0,
  //   "transactionIndex": 0,
  //   "status": 0,
  //   "blockHash": "0xe9f799f5abb20c866cb69588bc20f9d7d66cd304a58c5c184c580de57a5c9f0e",
  //   "chainId": "0x0",
  //   "contractCreated": null,
  //   "data": "0x",
  //   "epochHeight": "0x14f6eb",
  //   "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "hash": "0xcec63532922f505f5cc4c384edea2f5140cc3ba0a8e8d0ccac225026c25fcc6f",
  //   "r": "0x9e0c73c509e0ee644522e6678058e628666d1aaa58b7c4a5cf7600189c067539",
  //   "s": "0x168b8d48354566271e429ae76f62f47269a4de90c682027cf6a34924fe521231",
  //   "storageLimit": "0x0",
  //   "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
  // }

  const executedReceipt = await promise.executed(); // await till executed
  console.log(JSON.stringify(executedReceipt, null, 2)); // outcomeStatus === 0 means success
  // {
  //   "index": 0,
  //   "epochNumber": 1373932,
  //   "outcomeStatus": 0,
  //   "gasUsed": "750000",
  //   "blockHash": "0xe9f799f5abb20c866cb69588bc20f9d7d66cd304a58c5c184c580de57a5c9f0e",
  //   "contractCreated": null,
  //   "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "logs": [],
  //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  //   "stateRoot": "0xaeaaea141466b9c5da0dc82128340929de1877c8c11013bdd3e7c995af6db942",
  //   "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "transactionHash": "0xcec63532922f505f5cc4c384edea2f5140cc3ba0a8e8d0ccac225026c25fcc6f"
  // }

  const confirmedReceipt = await promise.confirmed({ threshold: 0.01 }); // await till risk coefficient < threshold
  console.log(JSON.stringify(confirmedReceipt, null, 2));
  // {
  //   "index": 0,
  //   "epochNumber": 1373932,
  //   "outcomeStatus": 0,
  //   "gasUsed": "750000",
  //   "blockHash": "0xe9f799f5abb20c866cb69588bc20f9d7d66cd304a58c5c184c580de57a5c9f0e",
  //   "contractCreated": null,
  //   "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "logs": [],
  //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  //   "stateRoot": "0xaeaaea141466b9c5da0dc82128340929de1877c8c11013bdd3e7c995af6db942",
  //   "to": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "transactionHash": "0xcec63532922f505f5cc4c384edea2f5140cc3ba0a8e8d0ccac225026c25fcc6f"
  // }
}

// ----------------------------------------------------------------------------
async function case3() {
  const nonce = await cfx.getNextNonce(account.address);

  const epochNumber = await cfx.getEpochNumber();

  const gasPrice = await cfx.getGasPrice();

  const estimate = await cfx.estimateGasAndCollateral({
    from: account.address,
    to: account.address,
    value: util.unit.fromGDripToDrip(789),
  });

  const tx = await account.signTransaction({
    nonce,
    gasPrice: Number(gasPrice) > 0 ? gasPrice : 1, // at lest 1 Drip
    gas: estimate.gasUsed,
    to: account.address,
    value: util.unit.fromGDripToDrip(789),
    storageLimit: estimate.storageCollateralized,
    epochHeight: epochNumber,
    chainId: 0, // must be 0
    data: null,
  });

  console.log(JSON.stringify(tx, null, 2));
  console.log(tx.from === account.address); // true
  console.log(tx.hash); // 0x733c8445b8f729e3eebf105bf687ffd382091fa2bf21a9da837da018f5894c1d
  console.log(tx.serialize()); // 0xf86feb8401a3202e80825208941bd9e9be525ab967e633bcdaeac8bd572...

  const receipt = await cfx.sendRawTransaction(tx.serialize()).confirmed(); // await till confirmed directly
  console.log(JSON.stringify(receipt, null, 2));
}
