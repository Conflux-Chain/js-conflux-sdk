# Overview
The purpose of this page is to give you a sense of everything js-conflux-sdk can do and serve as a quick reference guide

## Pre-requisites

1. Node.js environment to install this SDK
2. Conflux account with some CFX (Use Conflux Portal to create account and get testnet CFX from faucet)
3. Conflux RPC endpoint, for example `http://test.confluxrpc.org/v2` is a testnet RPC endpoint


## Initialize
After installing `js-conflux-sdk` (via npm), you’ll need to specify the provider url. You can use the 
mainnet(https://main.confluxrpc.org/v2), or testnet(https://test.confluxrpc.org/v2), or [run your own Conflux node](https://developer.conflux-chain.org/docs/conflux-doc/docs/independent_chain).

### Testnet

With a RPC endpoint we can initialize a Conflux object, which can be used to send JSON RPC request.

```javascript
const { Conflux } = require('js-conflux-sdk');
// initialize a Conflux object
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org/v2',
    logger: console, // for debug
    networkId: 1,
});
```

Besides `url` and `logger` you can pass [other options](../api.md) to initialize a Conflux object


## Add account
Private keys are required to approve any transaction made on your behalf, `conflux.wallet` provide utility help you manage your accounts

```js
conflux.wallet.addPrivateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
```

Only after you add your account to wallet, then you can use them send transactions.


## Send JSON-RPC request
There are a lot methods on cfx object which are one-to-one with Conflux node RPC methods. 
All conflux methods will return a promise, so you can use it with `async/await` syntax.

```javascript

async function main() {
  // get balance
  const balance = await conflux.getBalance('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
  console.log(balance.toString()); // 10098788868004995614504
}

main();
```

Besides balance you can get a lot blockchain information through it, for example: nonce, block, transaction, receipt and so on.
You can check [API](../api.md) and [RPC](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc)

### Conflux hex address
In Conflux network there are three kind address:

* Normal address `0x1` prefix: `0x1386B4185A223EF49592233b69291bbe5a80C527`
* Contract address `0x8` prefix: `0x80a17fd515c1fc819e87e606c058490ac1f14ca7`
* Internal contract address `0x0888` prefix: `0x0888000000000000000000000000000000000000`

So normally a ethereum's address cann't used as conflux address, otherwise it starts with `0x1`

Notice: one address can have two form `checksumed` and `not checksumed`, these two actually are same account. For example
`0x1386B4185A223EF49592233b69291bbe5a80C527` and `0x1386b4185a223ef49592233b69291bbe5a80c527` which point to same account.

### Conflux base32 checksum address
From `conflux-rust 1.1.1` Conflux has switch to base32Checksum address for example `cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957`.
It was introduced by [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md). `js-conflux-sdk` add support for it from version `1.5.10`, check [here](./conflux_checksum_address.md) for details.


### Send Transaction
Check [here](./how_to_send_tx.md) for details

### chainId
`chainId` is used to distinguish different network and prevent replay attack, currently:

* mainnet: `1029`
* testnet: `1`


### RPC endpoint
1. `mainnet`: https://main.confluxrpc.org
2. `testnet`: https://test.confluxrpc.org

### Hex value and epochNumber and tags
You can find the epochNumber doc at official developer [RPC doc](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc#hex-value-encoding)


### JSBI
Because in blockchain world there are a lot big numbers (uint256), only modern JS VM and Node.js support `BigInt`, so we use JSBI in browser environment to handle these big number.
For how to use [JSBI](https://www.npmjs.com/package/jsbi) check it's documentation

Note: jsbi currently cann't pretty log, you need convert it to string before log.

```js
const max = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
console.log(String(max));
// → '9007199254740991'
console.log(max.toString()); // directly log a jsbi is very ugly
// JSBI(2) [ -1, 2097151, sign: false ]
```

Note: When a js integer is bigger than `Number.MAX_SAFE_INTEGER` (2^53 - 1 or 9,007,199,254,740,991) you should use [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) to contain it.


### Drip
In Conflux network there are there unit: CFX, Drip, Gdrip. Drip is the minimum unit in Conflux  1 CFX=10^18Drip, 1Gdrip=10^9Drip. When getting account's balance, send transaction, specify gasPrice, all unit will be Drip. 
The SDK has provide a class Drip, which can use to easily convert between different unit.

```js
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

```js
const { Conflux } = require('js-conflux-sdk');

async function main() {
  // initialize a Conflux object
  const cfx = new Conflux({
      url: 'ws://localhost:12535',
      logger: console, // for debug
  });
  // get balance
  const balance = await cfx.getBalance('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
  console.log(balance.toString()); // 10098788868004995614504

  // you need manual close the websocket connection
  cfx.close();
}

main();
```

### Pub/Sub

Conflux node support pub/sub makes it possible to query certain items on an ongoing basis, without polling through the JSON-RPC HTTP interface, currently three topics are supported: `newHeads`, `epochs`, `logs`, for detail explain of Pub/Sub check the [official doc](https://developer.conflux-chain.org/docs/conflux-doc/docs/pubsub)

Use JS SDK it will be very easy to use Pub/Sub.

```js
const { Conflux } = require('js-conflux-sdk');

async function main() {
  const cfx = new Conflux({
      url: 'ws://localhost:12535',
  });
  // sub
  let newHeadEmitter = await cfx.subscribeNewHeads();
  newHeadEmitter.on('data', console.log);
  let logEmitter = await cfx.subscribeLogs();
  logEmitter.on('data', console.log);
  let epochEmitter = await cfx.subscribeEpochs();
  epochEmitter.on('data', console.log);
  // unsubscribe
  cfx.unsubscribe(epochEmitter);
}

main();
```

### Interact with contract
You can use this SDK get and update contract state, we have a complete [documentation](./interact_with_contract.md) for you.


### Type conversion
If you want convert a hex to number, or uint, you can use `format`, for example:

```js
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

```js
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
