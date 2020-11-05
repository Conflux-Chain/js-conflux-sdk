# Getting Start

Here is a quick start of how to use `js-conflux-sdk` to interact with conflux network. It will show you how to get account balance and send a transaction. You need Node.js installed to run the code below.


## Install

Install the SDK with npm.

```sh
$ npm install js-conflux-sdk
```

## Initialize the Conflux object and get balance
To interact with conflux network, we need a RPC endpoint for example: `https://test.confluxrpc.org` which is a conflux testnet RPC endpoint, we can use it directly.

```js
// import Conflux Class
const { Conflux } = require('js-conflux-sdk');

async function main() {
  // initialize a Conflux object
  const address = '0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
  const cfx = new Conflux({
    url: 'https://test.confluxrpc.org',
    // for debug: this will log all the RPC request and response to console
    logger: console,
  });
  // then we can use cfx to get balance of a conflux account
  const balance = await cfx.getBalance(address);
  console.log(balance.toString());
}

main();
```
The cfx object have a lot methods that correspond to Conflux RPC methods, `getBalance` will be the most common used one. The cfx methods will return a promise, you can use `async/await` syntax with it.

Besides `url` and `logger` Conflux have several other options you can check the [API]()

## Send a transaction
To send some CFX to another account, your account should have some balance of CFX. And you also need the privateKey of your account.

```js
// create account instance and add to wallet
const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); 
const hash = await conflux.sendTransaction({
    from: account.address, // sender address which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
});
```

That's it, it's very simple.


## Docs

1. [Official documentation](https://developer.conflux-chain.org/)
2. [RPC methods](https://developer.conflux-chain.org/docs/conflux-doc/docs/json_rpc)
3. [Subscribtion](https://developer.conflux-chain.org/docs/conflux-doc/docs/pubsub)