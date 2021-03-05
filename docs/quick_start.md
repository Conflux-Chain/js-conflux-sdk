# Quickstart

> All code starting with a $ is meant to run on your terminal. All code starting with a > is meant to run in a node.js interpreter.

## Install

Install the SDK with npm.

```
npm install js-conflux-sdk
```

## Using Conflux
This library depends on a connection to an Conflux node. These connections normally called Providers and there are several ways to configure them. This guide will use Conflux testnet provider `https://test.confluxrpc.org/v2`.

### Povider: Official testnet
The quickest way to interact with the Conflux blockchain is using a remote node provider, like official testnet. You can connect to a remote node by specifying the endpoint.

```js
// import Conflux Class
const { Conflux } = require('js-conflux-sdk');
// initialize a Conflux object
const conflux = new Conflux({
    url: 'https://test.confluxrpc.org/2', // testnet provider
    logger: console, // for debug: this will log all the RPC request and response to console
    networkId: 1,
    // timeout: 300 * 1000, // request timeout in ms, default 300*1000 ms === 5 minute
});
```

## Getting balance
Then we can use the Conflux instance get blockchain data.

```js
async function main() {
  // use conflux to get balance (in Drip) of a conflux address
  const address = 'cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957';
  const balance = await conflux.getBalance(address);
  console.log(balance);
}

main();
```

The conflux instance have a lot methods that correspond to Conflux RPC methods, such as `getBalance` map to RPC `cfx_getBalance`. Call these methods will return a promise or thenable, which means you can use it with ES6 `async/await` syntax.

For the detail documentation of Conflux methods and options, you can check with [fullnode RPC](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc) and [JS-SDK API](./api.md)
