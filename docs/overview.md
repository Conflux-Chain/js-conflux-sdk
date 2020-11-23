# Overview
The purpose of this page is to give you a sense of everything js-conflux-sdk can do and to serve as a quick reference guide

## Pre-requisites

1. Node.js environment to install this SDK
2. Conflux account with some CFX (Use Conflux Portal to create account and get testnet CFX from faucet)
3. Conflux RPC endpoint, for example `http://test.confluxrpc.org` is a testnet RPC endpoint


## Initialize
After installing `js-conflux-sdk` (via npm), you’ll need to specify the provider url. You can use the 
mainnet(https://main.confluxrpc.org), or testnet(https://test.confluxrpc.org), or [run your own Conflux node](https://developer.conflux-chain.org/docs/conflux-doc/docs/independent_chain).

### Testnet

With a RPC endpoint we can initialize a Conflux object, which can be used to send JSON RPC request.

```javascript
const { Conflux } = require('js-conflux-sdk');
// initialize a Conflux object
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org',
    logger: console, // for debug
});
```

Besides `url` and `logger` you can pass [other options](../api.md) to initialize a Conflux object


## Add account
Private keys are required to approve any transaction made on your behalf, `conflux.wallet` provide utility help you manage your accounts

```js
conflux.wallet.addPrivateKey('your-private-key');
```

Only after you add your account to wallet, then you can use them send transactions.


## Send JSON-RPC request
There are a lot methods on cfx object which are one-to-one with Conflux node RPC methods. 
All conflux methods will return a promise, so you can use it with `async/await` syntax.

```javascript

async function main() {
  // get balance
  const balance = await conflux.getBalance('0x1386B4185A223EF49592233b69291bbe5a80C527');
  console.log(balance.toString()); // 10098788868004995614504
}

main();
```

Besides balance you can get a lot blockchain information through it, for example: nonce, block, transaction, receipt and so on.
You can check [API](../api.md) and [RPC](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc)

### Conflux address
In Conflux network there are three kind address:

* Normal address `0x1` prefix: `0x1386B4185A223EF49592233b69291bbe5a80C527`
* Contract address `0x8` prefix: `0x80a17fd515c1fc819e87e606c058490ac1f14ca7`
* Internal contract address `0x0888` prefix: `0x0888000000000000000000000000000000000000`

So normally a ethereum's address cann't used as conflux address, otherwise it starts with `0x1`

Notice: one address can have two form `checksumed` and `not checksumed`, these two actually are same account. For example
`0x1386B4185A223EF49592233b69291bbe5a80C527` and `0x1386b4185a223ef49592233b69291bbe5a80c527` which point to same account.


### Send Transaction
For detail explanation of send transaction check [here](./how_to_send_tx.md)

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

```js
const previouslyMaxSafeInteger = 9007199254740991n

const alsoHuge = BigInt(9007199254740991)
// ↪ 9007199254740991n

const hugeString = BigInt("9007199254740991")
// ↪ 9007199254740991n

const hugeHex = BigInt("0x1fffffffffffff")
// ↪ 9007199254740991n

const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111")
// ↪ 9007199254740991n
```


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
  const balance = await cfx.getBalance('0x1386B4185A223EF49592233b69291bbe5a80C527');
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




