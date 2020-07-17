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
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });
  // get balance
  const balance = await cfx.getBalance('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
  console.log(balance); // 937499420597305000n
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
  const cfx = new window.Conflux.Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });
</script>
```

## Complete usage

### Send an transaction
If you want send a transaction to conflux network, you can use the SDK's `sendTransaction` method, for example:

```js
const account = cfx.Account(PRIVATE_KEY); // create account instance
const txHash = await cfx.sendTransaction({
    from: account, // from account instance and will by sign by account.privateKey
    to: "0x-another-address", // accept address string or account instance
    value: util.unit.fromCFXToDrip(0.125), // use unit to transfer from CFX to Drip
});
const tx = await cfx.getTransactionByHash(txHash);  // status 0x0 means success
const txReceipt = await cfx.getTransactionReceipt(txHash);  // outcomeStatus 0x0 means success
```
That's it, it's so easy. Besides `from`, `to`, `value` there are other fields you can set and should know:

* gas
* gasPrice
* epochHeight
* chainId
* data
* `storageLimit`
* nonce

For the detail explanation of these fields check [official doc](https://developer.conflux-chain.org/docs/conflux-doc/docs/send_transaction#installation).

You should pay more attention to `storageLimit`, it's a conflux special tx parameter, if you transaction execute failed or stucked in tx pool, you can try this parameter.

If you have encounter problem when sending transaction, you should check `nonce`, `gas`, `storageLimit` and your balance.
After adjust your parameter you can send a new transaction with same(or correct) nonce and higher gasPrice.

### Advanced usage of `sendTransaction`
The SDK's `sendTransaction` and `sendRawTransaction` method have several advance method will be helpful.

```js
let txParameters = {
  from: account,
  to: "0x-a-address",
  value: "0x100"
};
const txHash = await cfx.sendTransaction(txParameters);  // send the tx and return a hash
const tx = await cfx.sendTransaction(txParameters).get();  // will also get the tx by hash
const tx = await cfx.sendTransaction(txParameters).mined();  // wait tx mined and return the tx
const receipt = await cfx.sendTransaction(txParameters).executed();  // wait tx executed and return receipt
const receipt = await cfx.sendTransaction(txParameters).confirmed();  // wait tx confirmed and return receipt
```

### Deploy or interact with contract
If you use this SDK, probability you want to deploy a contract or interact with a contract.
When deploy a contract you need contract's `bytecode` and `abi`

```js
// create contract instance
const contract = cfx.Contract({
  abi: USER_YOUR_CONTRACT_ABI,
  bytecode: USER_YOUR_CONTRACT_BYTECODE,
});
// deploy the contract, and get `contractCreated`
const receipt = await contract.constructor()  // fill the parameter to your constructor
  .sendTransaction({ from: account })  // you can set other tx parameters such as: gas, gasPrice, storageLimit and so on (leave `to` empty)
  .confirmed();
console.log(receipt); // contract address is receipt.contractCreated
```

With a deployed contract's address and abi, you can interact with it: query or change contract state.
```js
const contract = cfx.Contract({
    abi: YOUR_CONTRACT_ABI,
    address: 'YOUR-CONTRACT-ADDRESS',
});
// query contract state
let ret = await contract.get(); // `get` is a method of your contract
console.log(ret.toString()); 
// change contract state by send a transaction
const receipt = await contract.inc(1).sendTransaction({  // `inc` is also your contract's method 
  from: account,  // you can set other tx parameter such as `gas`, `gasPrice`, `storageLimit` and so on
}).confirmed();
```

## Document

* [Example](https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/example)
* [API](https://github.com/Conflux-Chain/js-conflux-sdk/blob/master/api.md)


## Change log

[see](https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/CHANGE_LOG.md)


