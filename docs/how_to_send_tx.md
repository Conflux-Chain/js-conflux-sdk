# How to send a Conflux Transaction

### A simple CFX transfer
It can be very easy to send a simple transaction(transfer some CFX to another address), all you need is `from`, `to`, `value` and `from`'s privateKey.

```javascript
const { Drip } = require('js-conflux-sdk');

async function main() {
  // Note: first you need initialize a Conflux object
  // create account instance and add to wallet
  const PRIVATE_KEY = "";
  const ADDRESS = "";
  const account = cfx.wallet.addPrivateKey(PRIVATE_KEY); 
  
  // This will send a CFX transfer transaction to a RPC endpoint, it will return the tx hash
  const txHash = await cfx.sendTransaction({
    from: account.address, // sender address which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
  }); 
  console.log(txHash);

  // You can get the tx info 
  const tx = await cfx.getTransactionByHash(txHash);
  /*
    {
      "nonce": "0",
      "value": "1000000000000000000000000000000000",
      "gasPrice": "3",
      "gas": "16777216",
      "v": 1,
      "transactionIndex": 0,
      "status": 0,
      "storageLimit": "65536",
      "chainId": 1,
      "epochHeight": 454,
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "data": "0x",
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "hash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8",
      "r": "0x85f6729aa1e709202318bd6746c4a232a379eaa4cd9c2ea24c7babdbd09085cd",
      "s": "0x7101e1e2ee4ddfcef8879358df0cb0792f34712116f100b76c8e9582625acd2f",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c"
   }
  */

  // the receipt will not generate immediately, so wait a while maybe 5s
  const receipt = await cfx.getTransactionReceipt(txHash);
  /*
  {
      "index": 0,
      "epochNumber": 455,
      "outcomeStatus": 0,
      "gasUsed": "21000",
      "gasFee": "37748736",
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "stateRoot": "0x19d109e6fe9f5a75cc54543af4beab08c0f23fdf95eea33b1afe5a9ef8b770dc",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c",
      "transactionHash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8"
    }
  */
}

main();
```

If you can get the transaction receipt and it's `outcomeStatus` is `0`, congratulate you have send a transaction successfully.


### Transaction's stage
After sending, a transaction could be in several different states, [here](https://developer.conflux-chain.org/docs/conflux-doc/docs/send_transaction#track-my-transaction) is a detail explanation of transaction life cycle.

You can get a transaction's state by it `status` or it's receipt's `outcomeStatus`
`tx.status`
* `null` The tx has not mined or executed
* `0` Tx execute success
* `1` Tx execute failed

Only after a transaction executed, you can get it's receipt. The `receipt.outcomeStatus` may have two value:

* `0` Tx execute success
* `1` Tx execute failed

Correspond to transaction stages, the SDK has provide several advanced `sendTransaction` usage:

```js
let txParameters = {
  from: account,
  to: "0x-a-address",
  value: "0x100"
};
const txHash = await cfx.sendTransaction(txParameters);  // send the tx and return a hash
const tx = await cfx.sendTransaction(txParameters).get();  // send the tx and return the tx
const tx = await cfx.sendTransaction(txParameters).mined();  // wait tx mined and return the tx
const receipt = await cfx.sendTransaction(txParameters).executed();  // wait tx executed and return receipt
const receipt = await cfx.sendTransaction(txParameters).confirmed();  // wait tx confirmed and return receipt
```

Note: the `mined`, `executed`, `confirmed` methods maybe will take a long time, and will be timeout, these methods are not recommended in production.


### A complete transaction

Besides `from`, `to`, `value` there are several other fields could be filled with:

* `nonce`: optional, the nonce of a transaction to keep the order of your sending transactions, increase one by one. If missing, the result of cfx_getNextNonce will be automatically filled in and it works for general scenarios. Some cases, like sending a lot of transactions in a short period. It's recommended to maintain the nonce on your own.
* `gasPrice`: optional, the price in Drip that you would like to pay for each gas consumed. If missing, the result of cfx_gasPrice will be automatically filled in, which is the median of recent transactions.
* `gas`: optional, the max gas you would like to use in the transaction. After the end of transaction processing, the unused gas will be refunded if used_gas >= gas * 0.75. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general scenarios.
* `to`: the receiver of the transaction, could be a personal account(start with 1) or contract(start with 8). Leave a null here to deploy a contract.
* `value`: the value (in Drip) to be transferred.
* `storageLimit`: optional, the max storage (in Byte) you would like to collateralize in the transaction. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general senarios.
* `epochHeight`: optional, a transaction is can be verified only in epochs in the range [epochHeight - 10000, epochHeight + 10000], so it's a timeout mechanism. If missing, the result of cfx_epochNumber will be automatically filled in and it works for general scenarios.
* `data`: optional, it's either an attached message of a transaction or a function signature of a contract call. If missing, a null will be filled into it.
* `chainId`: optional, it used for dealing with a hard fork or preventing a transaction replay attack. If missing SDK will get it from RPC.
* `from`: The sender account(with private key) to sign the transaction.

Compare with ethereum Conflux transaction have three new field: `storageLimit`, `epochHeight`, `chainId`


```js
const txHash = await cfx.sendTransaction({
    from: account.address, // sender address which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
    nonce: 100,
    gas: 21000,
    gasPrice: new Drip(1),
    storageLimit: 0,
    epochHeight: await cfx.getEpochNumber(),
    data: null,
    chainId: 1,
}); 
console.log(txHash);
```

### How much `gas` and `storageLimit` a transaction need
If you are just transfer CFX, the gas should be `21000`, if you are interact with a contract it's a little complicated.
Normally you can estimate it by call `estimateGasAndCollateral`.

##### `gasPrice`
When sending transaction if you specify the `gasPrice` it will be used, if not it will try to use `cfx.defaultGasPrice` you can specify it when you initiallize the cfx object.

```js
const cfx = new Conflux({
    url: 'http://test.confluxrpc.org',
    logger: console, // for debug
    defaultGasPrice: 1
});
```
If both `gasPrice` and `defaultGasPrice` is not specified, the SDK will fill the result of `getGasPrice()` to it.

Currentlly set the gasPrice to `1 Drip` will enough to send most transactions.

##### `gas`
First you can specify the tx.`gas`, if you don't it will use the result of `estimateGasAndCollateral.gasUsed`, and this value will be multiply a ratio `defaultGasRatio` (default 1.1), because the estimate result sometimes are not accurate, normally estimated `gasUsed` will not enough.

```js
const cfx = new Conflux({
    url: 'http://test.confluxrpc.org',
    logger: console, // for debug
    defaultGasRatio: 1.1
});
```

##### `storageLimit`
Same as `gas` you can specify `storageLimit` when you send transaction (unit is Byte), if not

```js
const cfx = new Conflux({
    url: 'http://test.confluxrpc.org',
    logger: console, // for debug
    defaultStorageRatio: 1.1
});
```

### SendRawTransaction
The `sendTransaction` will use get `from`'s privateKey from wallet, use it sign transaction and invoke `sendRawTransaction` method, if you have a raw transaction you can use it directly. the `sendRawTransaction` method also can use `get`, `mined`, `executed`, `confirmed` method.


### Why my transaction is always pending ?
If your transaction alway pending in the pool, normally you have use a incorrect `nonce` or your `balance` is not enough. You can get the transaction info by it's hash, and check it's nonce with your account's nonce, and check your balance is enough to cover the value + gasPrice * gas + storageLimit.

### Why my transaction failed?
If your transaction is failed, you can find reason in below ways:

1. Is your balance is enough cover your tx: check `value`, `gas`, `storageLimit`
2. Is your `gas` is enough, is your `storageLimit` enough
2. Check receipt's `txExecErrorMsg` for detail error message

### How to send a transaction with a note
If you want send a transaction with a note, you can specify it through `data`, the tricky is you need convert your message to a hex string.

```js
const hex = require('string-hex');
let hexString = '0x' + hex("This is the transaction note");

let result = await cfx.sendTransaction({
    from: address,
    to: '0x1292d4955bb47F5153B88Ca12C7A9E4048f09839',
    value: Drip.fromGDrip(0.001),
    data: hexString
});
```

### How to build a raw transaction
Build a `Transaction`, sign it with privateKey, then you can get a raw transaction.

```js
import {Transaction} from 'js-conflux-sdk';
let tx = new Transaction({
    from: '0x1be45681ac6c53d5a40475f7526bac1fe7590fb8',
    nonce: 1,
    to: '0x1be45681ac6c53d5a40475f7526bac1fe7590fb8',
    value: 1,
    gas: 21000,
    gasPrice: 1,
    storageLimit: 0,
    epochHeight: 100,
    chainId: 1,
    data: "0x"
});
const privateKey = "....";
tx.sign(privateKey);
let rawTx = tx.serialize();
```
