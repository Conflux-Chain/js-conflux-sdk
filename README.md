# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
-----------------------

JavaScript Conflux Software Development Kit

## Installation

`npm install js-conflux-sdk`

## Quick Usage

### Nodejs
```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
  // initalize a Conflux object
  const conflux = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    logger: console, // for debug
  });
  // get balance
  const balance = await conflux.getBalance('0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
  console.log(balance); // 10098788868004995614504
}

main();
```
require deep nested file/dir  

``` javascript
const util = require('js-conflux-sdk/src/util');
```

### Frontend

#### umd
``` javascript
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
```

or if your bundler supports the [`browser` field](https://docs.npmjs.com/files/package.json#browser) in `package.json`  

``` javascript
import { Conflux } from 'js-conflux-sdk';
```

or  

``` html
<script type="text/javascript" src="node_modules/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>
<script type="text/javascript">
  const conflux = new window.Conflux.Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    logger: console,
  });
</script>
```

## Examples

* [Create conflux instance](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/0_create_conflux.js)
* [Account and balance](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/1_account_and_balance.js)
* [Send transaction](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/2_send_transaction.js)
* [Query epoch block transaction](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/3_epoch_block_transaction.js)
* [Contract deploy and call](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/4_contract_deploy_and_call.js)
* [Contract override](https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/5_contract_override.js)

### Send transaction simple

```js
const { Conflux, Drip } = require('js-conflux-sdk');

async function main() {
  const conflux = new Conflux({ url: 'http://testnet-jsonrpc.conflux-chain.org:12537' });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet
  
  const receipt = await conflux.sendTransaction({
    from: account.address, // sender address which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
  }).executed(); // wait till transaction executed and get receipt

  console.log(receipt); // outcomeStatus 0 means success
  /*
    {
      "index": 0,
      "epochNumber": 784649,
      "outcomeStatus": 0,
      "gasUsed": "21000",
      "gasFee": "21000000000000",
      "blockHash": "0xfa7c6d9d0c8ae436f1c9c785a316ac6cc4db16286eede3dd3d5c6a5a22ad5f9e",
      "contractCreated": null,
      "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "stateRoot": "0x166cbcbfd747505d91237ccd8f849fd6882ad0e6d8b9923ca3c44891cf2b8753",
      "to": "0x1ead8630345121d19ee3604128e5dc54b36e8ea6",
      "transactionHash": "0x50cd13d5f97dd867d4ca65e24eb642f6444c07d6af8143018c558df456f11e63"
    }
  */
}

main();
```

### Send transaction complete

For the detail explanation of these fields check [official doc](https://developer.conflux-chain.org/docs/conflux-doc/docs/send_transaction#installation).

```javascript
const { Conflux, Drip } = require('js-conflux-sdk');

async function main() {
  const conflux = new Conflux({ url: 'http://testnet-jsonrpc.conflux-chain.org:12537' });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet

  const estimate = await conflux.estimateGasAndCollateral({ to, value });
  const status = await conflux.getStatus();
  
  const txHash = await conflux.sendTransaction({
    from: account.address, // or just `from: account` 
    to: ADDRESS,
    value: Drip.fromGDrip(100), // 100 GDrip = 100000000000 Drip
    gas: estimate.gasUsed,
    storageLimit: estimate.storageCollateralized,
    chainId: status.chainId,
    data: null,
    nonce: await conflux.getNextNonce(ADDRESS),
    gasPrice: await conflux.getGasPrice(),
    epochHeight: await conflux.getEpochNumber(),  
  });
  console.log(txHash);
  
  // you might need wait minute here...
  await new Promise(resolve => setTimeout(resolve, 30*1000));
  
  const transaction = await conflux.getTransactionByHash(txHash);
  console.log(transaction);
  
  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log(receipt);
}

main();
```

### Deploy contract

```javascript
const { Conflux } = require('js-conflux-sdk');
const { abi, bytecode } = MINI_ERC20; // see https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/contract/miniERC20.json

async function main() {
  const conflux = new Conflux({ url: 'http://testnet-jsonrpc.conflux-chain.org:12537' });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet
  const contract = conflux.Contract({ abi, bytecode });

  const receipt = await contract.constructor('MiniERC20', 18, 'MC', 10000)
    .sendTransaction({ from: account })
    .executed();
  console.log(receipt);
  /*
  {
    "index": 0,
    "epochNumber": 318456,
    "outcomeStatus": 0,
    "gasUsed": "1054531",
    "gasFee": "1054531000000000",
    "blockHash": "0x4a8b07e2694e358af075f7a9e96e78842b77ac2d511e2ab33f6acfff34a5846c",
    "contractCreated": "0x8a9c270e1a99c05ca90ef0f0008b8f6444cf1a97",
    "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x0940d4870e25bae1e7a5e5d7c19411b41922c025aa3de61aea2be17759673b1a",
    "to": null,
    "transactionHash": "0x6f55e67b486b5ef0c658c6d50cb5b89a2a2ddfecc1a1f2e414bbbefe36ef8dd5"
  }
  */

  // create contract address "0x8a9c270e1a99c05ca90ef0f0008b8f6444cf1a97"
}

main();
```

### Call contract

```javascript
const { Conflux } = require('js-conflux-sdk');
const { abi } = MINI_ERC20; // see https://github.com/Conflux-Chain/js-conflux-sdk/blob/v1.x/example/contract/miniERC20.json

async function main() {
  const conflux = new Conflux({ url: 'http://testnet-jsonrpc.conflux-chain.org:12537' });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet
  const contract = conflux.Contract({ abi, address: '0x8a9c270e1a99c05ca90ef0f0008b8f6444cf1a97' });

  const name = await contract.name(); // call method without arguments
  console.log(name); // MiniERC20
  // use can set options by `contract.name().call({ from: account, ... })`

  const balance = await contract.balanceOf(account.address); // call method with arguments
  console.log(balance); // "10000" JSBI

  const txHash = await contract.transfer(ADDRESS, 10).sendTransaction({ from: account }); // send method transaction
  console.log(txHash); // 0xb31eb095b62bed1ef6fee6b7b4ee43d4127e4b42411e95f761b1fdab89780f1a
  // use can set options by `contract.transfer(ADDRESS, 10).sendTransaction({ from: account, gasPrice: <number>, ... })`
}

main();
```

## Document

* [API](https://github.com/Conflux-Chain/js-conflux-sdk/blob/master/api.md)

## Change log

[see](https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/CHANGE_LOG.md)

