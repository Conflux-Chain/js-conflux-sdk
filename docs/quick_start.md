# Quickstart

> All code starting with a $ is meant to run on your terminal. All code starting with a &gt; is meant to run in a node.js interpreter.

## Install

Install the SDK with npm.

```text
$ npm install js-conflux-sdk
```

## Using Conflux

This library depends on a connection to an Conflux node. These connections normally called Providers and there are several ways to configure them. This guide will use Conflux testnet provider `https://test.confluxrpc.com`.

### Povider: Official testnet

The quickest way to interact with the Conflux blockchain is using a remote node provider, like official testnet. You can connect to a remote node by specifying the endpoint.

```javascript
// import Conflux Class
const { Conflux } = require('js-conflux-sdk');
// initialize a Conflux object
const conflux = new Conflux({
    url: 'https://test.confluxrpc.com', // testnet provider
    logger: console, // for debug: this will log all the RPC request and response to console
    networkId: 1,  // note networkId is required to initiat
    // timeout: 300 * 1000, // request timeout in ms, default 300*1000 ms === 5 minute
});
```

## Getting balance

Then we can use the Conflux instance get blockchain data.

```javascript
async function main() {
  // use conflux to get balance (in Drip) of a conflux address
  const address = 'cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957';
  const balance = await conflux.cfx.getBalance(address);
  console.log(balance);
}

main();
```

The conflux instance have a lot methods that correspond to Conflux RPC methods, such as `getBalance` map to RPC `cfx_getBalance`. Call these methods will return a promise or thenable, which means you can use it with ES6 `async/await` syntax.

## Transfer `CFX`

CFX is the native token of Conflux network, can be transfered from one address to another address through transaction.
To send one account's CFX, you must know address's private key.

```js
// ... conflux init code
// NOTE: before send transaction, `from`'s privateKey must add to wallet first.
const account = conflux.wallet.addPrivateKey('0xxxxxxxxxx');
const targetAddress = 'cfxtest:xxxxxxx';
let pendingTx = conflux.cfx.sendTransaction({
  from: account.address,
  to: targetAddress,
  value: 1 // the unit is drip
});
let txHash = await pendingTx;
// 0xedcfece4cc7a128992c18147cdc2b9ee58861249c97889654932d3162f78b556
let tx = await pendingTx.mined();
// tx
```

## Work with Wallet Plugin

`js-conflux-sdk` can be used in browser, and co-work with [FluentWallet](https://fluentwallet.com/), by simply set the Fluent exported `window.conflux` as SDK instance's provider.

```js
// Step1 - initialize the Conflux object without url
// If you load the js-conflux-sdk through script tag:
let cfxClient = new TreeGraph.Conflux({
  networkId: 1,
});
// If you use bundler to develop your frontend project, 
import { Conflux } from 'js-conflux-sdk';
let cfxClient = new Conflux({
  networkId: 1,
});

// Step2 - set window.conflux (provided by Fluent wallet) as client's provider
cfxClient.provider = window.conflux;

// Then you can retrive blockchain data and send transaction with the cfxClient

cfxClient.cfx.getStatus().then(console.log);

cfxClient.cfx.sendTransaction({
  from: 'Your fluent wallet choosen account address',
  to: 'The target address',
  value: 1
})
```
