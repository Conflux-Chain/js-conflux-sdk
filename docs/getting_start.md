# Getting Start

Here is a quick start of how to use `js-conflux-sdk` to interact with conflux network. It will show you how to get account balance and send a transaction. You need Node.js installed to run the code below.


## Install

Install the SDK with npm.

```
npm install js-conflux-sdk
```

## Initialize the Conflux instance and call method
To interact with conflux network, we need a RPC endpoint for example: `https://test.confluxrpc.org` which is a conflux testnet RPC endpoint, we can use it directly.

```js
// import Conflux Class
const { Conflux, Drip } = require('js-conflux-sdk');

async function main() {
  // initialize a Conflux object
  const conflux = new Conflux({
    url: 'https://main.confluxrpc.org', // main net endpoint
    // url: 'https://test.confluxrpc.org', // test net endpoint
    
    // timeout: 300 * 1000, // request timeout in ms, default 300*1000 ms === 5 minute
    // logger: console, // for debug: this will log all the RPC request and response to console
  });
  
  // then we can use conflux to get balance (in Drip) of a conflux account
  const balance = await conflux.getBalance('0x1f323dccb24606b061db9e3a1277b8db99f1c1b2');
  console.log(balance); // 3308889829789826719958034n
  console.log(Drip(balance).toCFX()); // 3308889.829789826719958034
}

main();
```

The conflux instance have a lot methods that correspond to Conflux RPC methods, such as `getBalance` map to RPC `cfx_getBalance`. Call these methods will return a promise or thenable.

Conflux have other methods and options, you can check with [API](../api.md)

## Docs

1. [Official developer documentation](https://developer.conflux-chain.org/)
2. [RPC](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc)
3. [Subscribtion](https://developer.conflux-chain.org/docs/conflux-doc/docs/pubsub)
4. [Conflux Portal](https://portal.conflux-chain.org/)
