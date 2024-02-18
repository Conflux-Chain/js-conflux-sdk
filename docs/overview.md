# Overview

The purpose of this page is to give you a sense of everything js-conflux-sdk can do and serve as a quick reference guide

## Pre-requisites

1. Node.js environment to install this SDK
2. Conflux account with some CFX (Use FluentWallet to create account and get testnet CFX from [faucet](http://faucet.confluxnetwork.org/))
3. Conflux RPC endpoint, for example `https://test.confluxrpc.com` is a testnet RPC endpoint

## Initialize

After installing `js-conflux-sdk` (via npm), you’ll need to specify the provider url. You can use the mainnet([https://main.confluxrpc.com](https://main.confluxrpc.com)), or testnet([https://test.confluxrpc.com](https://test.confluxrpc.com)), or [run your own Conflux node](https://doc.confluxnetwork.org/docs/general/run-a-node/Overview).

### Testnet

With a RPC endpoint we can initialize a Conflux object, which can be used to send JSON RPC request.

```javascript
const { Conflux } = require('js-conflux-sdk');
// initialize a Conflux object
const conflux = new Conflux({
    url: 'https://test.confluxrpc.com',
    logger: console, // for debug
    networkId: 1,  // networkId is also need to pass
});
```

```js
// Conflux class also have a static method `create`, can be used to create a new instance with no need to set networkId option
async function main() {
  const conflux = await Conflux.create({
    url: "https://test.confluxrpc.com",
  });
}
```

Besides `url` and `logger` you can pass [other options](https://github.com/Conflux-Chain/js-conflux-sdk/tree/faec50e6c2dd16158b114d0d4de228d7b2ca7535/api.md) to initialize a Conflux object

### Add account

Private keys are required to approve any transaction made on your behalf, `conflux.wallet` provide utility help you manage your accounts

```javascript
conflux.wallet.addPrivateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
```

**Only after you add your account to wallet, then you can use them send transactions.**

### Send JSON-RPC request

There are a lot methods on cfx object which are one-to-one with [Conflux node RPC methods](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace). All conflux methods will return a promise, so you can use it with `async/await` syntax.

```javascript
async function main() {
  // get balance
  const balance = await conflux.cfx.getBalance('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
  console.log(balance.toString()); // 10098788868004995614504
}

main();
```

Besides balance you can get a lot blockchain information through it, for example: nonce, block, transaction, receipt and so on. You can check [API](https://github.com/Conflux-Chain/js-conflux-sdk/tree/faec50e6c2dd16158b114d0d4de228d7b2ca7535/api.md) and [RPC](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace)

### Conflux hex address

**Note: from Conflux-rust v1.1.1 we have import a new base32 encoded address, the hex address can not be used then.**

### Conflux base32 checksum address

From `conflux-rust 1.1.1` Conflux has switch to base32Checksum address for example `cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957`. It was introduced by [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md). `js-conflux-sdk` add support for it from version `1.5.10`, check [here](conflux_checksum_address.md) for details.

### Send Transaction

```js
// first add account's private key to wallet
const account = conflux.wallet.addPrivateKey('0xxxxxxxxxx');
const targetAddress = 'cfxtest:xxxxxxx';
let hash = await conflux.cfx.sendTransaction({
  from: account.address,
  to: targetAddress,
  value: 1 // the unit is drip
});

// check tx status through it's hash
let transaction = await conflux.cfx.getTransactionByHash(hash); // normally need half minute to get transaction info
console.log(transaction);
```

Check [here](how_to_send_tx.md) for details

### chainId

`chainId` is used to distinguish different network and prevent replay attack, currently:

* mainnet: `1029`
* testnet: `1`

### RPC endpoint

1. `mainnet`: [https://main.confluxrpc.com](https://main.confluxrpc.com)
2. `testnet`: [https://test.confluxrpc.com](https://test.confluxrpc.com)

### Hex value and epochNumber and tags

You can find the epochNumber doc at official developer [RPC doc](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#hex-value-encoding)

### JSBI

Because in blockchain world there are a lot big numbers (uint256), only modern JS VM and Node.js support `BigInt`, so we use JSBI in browser environment to handle these big number. For how to use [JSBI](https://www.npmjs.com/package/jsbi) check it's documentation

Note: jsbi currently cann't pretty log, you need convert it to string before log.

```javascript
const max = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
console.log(String(max));
// → '9007199254740991'
console.log(max.toString()); // directly log a jsbi is very ugly
// JSBI(2) [ -1, 2097151, sign: false ]
```

Note: When a js integer is bigger than `Number.MAX_SAFE_INTEGER` (2^53 - 1 or 9,007,199,254,740,991) you should use [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) to contain it.

### Drip

In Conflux network there are there unit: CFX, Drip, Gdrip. Drip is the minimum unit in Conflux 1 CFX=10^18Drip, 1Gdrip=10^9Drip. When getting account's balance, send transaction, specify gasPrice, all unit will be Drip. The SDK has provide a class Drip, which can use to easily convert between different unit.

```javascript
import {Drip} from "js-conflux-sdk"

let drip1 = Drip.fromCFX(1);
console.log(drip1);
// 1000-000-000-000-000-000
let drip2 = Drip.fromGDrip(1);
console.log(drip1);
// 1000-000-000
let drip3 = new Drip(1);
console.log(drip3);
// 1
console.log(drip3.toCFX());
// 1
console.log(drip1.toGdrip());
// 1000-000-000
```

### Websocket provider

The SDK also provide a websocket provider, and the default Conflux node ws port is `12535`.

```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
  // initialize a Conflux object
  const conflux = new Conflux({
      url: 'ws://localhost:12535',
      logger: console, // for debug
  });
  // get balance
  const balance = await conflux.cfx.getBalance('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
  console.log(balance.toString()); // 10098788868004995614504

  // you need manual close the websocket connection
  conflux.close();
}

main();
```

### Pub/Sub

Conflux node support pub/sub makes it possible to query certain items on an ongoing basis, without polling through the JSON-RPC HTTP interface, currently three topics are supported: `newHeads`, `epochs`, `logs`, for detail explain of Pub/Sub check the [official doc](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pubsub)

Use JS SDK it will be very easy to use Pub/Sub.

```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
  const conflux = new Conflux({
      url: 'ws://localhost:12535',
  });
  // sub
  let newHeadEmitter = await conflux.subscribeNewHeads();
  newHeadEmitter.on('data', console.log);
  let logEmitter = await conflux.subscribeLogs();
  logEmitter.on('data', console.log);
  let epochEmitter = await conflux.subscribeEpochs();
  epochEmitter.on('data', console.log);
  // unsubscribe
  conflux.unsubscribe(epochEmitter);
}

main();
```

### Interact with contract

Quick demo of interact with contract: query balance of one CRC20 token

```js
async function main() {
  const FC_ADDRESS = "cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2";
  const contract = conflux.CRC20(FC_ADDRESS);
  const balance = await contract.balanceOf('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
  console.log(`FC balance: ${balance}`);
}
```

You can use this SDK get and update contract state, we have a complete [documentation](interact_with_contract.md) for you.

### Type conversion

If you want convert a hex to number, or uint, you can use `format`, for example:

```javascript
const { format } = require('js-conflux-sdk');
format.uInt('0x10');
// 16
format.bigUInt('0.0')
// 0n
format.hex(1)
// "0x01"
```

### Sign

The SDK also provide most common used crypto utilities in `sign`

```javascript
const { sign } = require('js-conflux-sdk');
// generate a random buffer
let buf = sign.randomBuffer(0);
// 
let keccakHash = sign.keccak256(buf);
// random generate a private key
let privateKey = sign.randomPrivateKey(buf);
// get public key from private key
let pubKey = sign.privateKeyToPublicKey(privateKey);
// get address from public key
let address = sign.publicKeyToAddress(pubKey);
// use private key sign (ecdsa) a buffer
let signResult = sign.ecdsaSign(buf, privateKey);
// recover public key from signature and buf, then convert it to address
sign.publicKeyToAddress(sign.ecdsaRecover(buf, sign.ecdsaSign(signResult, privateKey)))
```
