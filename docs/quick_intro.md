# Quick intro
This is the javascript SDK for Conflux network. You can use it interact with Conflux node.
Here is a quick introduction for how to use it.

### Pre-requisite
Here are some pre requisite to use this SDK.

1. Node.js environment to install this SDK
2. Conflux account with some CFX (Use Conflux Portal to create account and get testnet CFX)
3. Conflux RPC endpoint, for example http://test.confluxrpc.org is a testnet RPC endpoint


### Install

```sh
$ npm install js-conflux-sdk
```

### Initialize
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


### Send JSON-RPC request
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

* mainnet is `1029`
* testnet is `1`

### Hex value and epochNumber and tags
You can find the epochNumber doc at official developer [RPC doc](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc#hex-value-encoding)


### JSBI
Because in blockchain world there are a lot big numbers (uint256), Javascript's native number cann't work with them, so we use JSBI to handle these big number.
For how to use [JSBI](https://www.npmjs.com/package/jsbi) check it's documentation

Note: jsbi currently cann't pretty log, you need convert it to string before log.

```js
const max = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
console.log(String(max));
// → '9007199254740991'
console.log(max.toString()); // directly log a jsbi is very ugly
// JSBI(2) [ -1, 2097151, sign: false ]
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




