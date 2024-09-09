# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)

JavaScript Conflux Software Development Kit is a complete library for interacting with the **[Conflux Blockchain Core Space](https://doc.confluxnetwork.org/docs/core/Overview)** in both Node.js and browser environment.

Featured with:

* Full support of Conflux Network Core Space's JSON-RPC API
* Wallet management
* Meta-classes create JavaScript objects from any contract ABI, including ABIv2 and Human-Readable ABI
* Unit(CFX, Drip) conversion
* Common utilities:
  1. Address conversion
  2. ABI/RLP encoding/decoding
  3. Crypto utilities
  4. Type conversion
* Extensive documentation and examples

For the Conflux eSpace JS SDK, consider using one of the following robust libraries: [ethers.js](https://docs.ethers.org/v6/), [viem](https://viem.sh/), or [web3.js](https://web3js.readthedocs.io/en/v1.10.0/)

## Docs

* [js-conflux-sdk documentation](https://confluxnetwork.gitbook.io/js-conflux-sdk)
* [SDK API doc](./docs/api/README.md)
* [Examples](./example/README.md)
* [Community examples](https://github.com/conflux-fans/js-sdk-example)
* [Fullnode JSONRPC API](https://doc.confluxnetwork.org/docs/core/build/json-rpc/)
* [Public RPC Provider Endpoints](https://doc.confluxnetwork.org/docs/core/conflux_rpcs)
* [Testnet faucet](https://faucet.confluxnetwork.org/)
* [Core Space Documentation](https://doc.confluxnetwork.org/docs/core/Overview)
* [FAQs](./docs/FAQs.md)

## Install

Install through npm

```sh
npm install js-conflux-sdk
```

## How to import

### Nodejs

Use in Node.js script

```javascript
const { Conflux } = require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,  // Note: network is required
  logger: console, // for debug
});
```

require deep nested file/dir

```javascript
const util = require('js-conflux-sdk/src/util');
```

### Frontend

#### umd

The front-packed package is located in `js-conflux-sdk`'s dist folder.

```javascript
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
```

or if your bundler supports the [`browser` field](https://docs.npmjs.com/files/package.json#browser) in `package.json`

```javascript
import { Conflux } from 'js-conflux-sdk';
```

or

```html
<script type="text/javascript" src="node_modules/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>
<script type="text/javascript">
  const conflux = new window.TreeGraph.Conflux({
    url: 'https://test.confluxrpc.com',
    logger: console,
    networkId: 1,
  });
</script>
```

From `v2.0` the exported root class to browser window name changed from Conflux to `TreeGraph`

Or you can use public CDN links:

* [`jsdelivr`](https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js)

## Quick Start

After importing the package, you can use the `Conflux` class instance to interact with the Conflux network, such as querying the balance of an account, sending a transaction.

```javascript
const { Conflux, Drip } = require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,  // Note: network is required
  logger: console, // for debug
});

const exampleAddress = 'cfxtest:aar8jzybzv0fhzreav49syxnzut8s0jt1a1pdeeuwb';

async function main() {
  const balance = await conflux.cfx.getBalance(exampleAddress);
  console.log(`Balance of ${exampleAddress} is ${Drip(balance).toCFX()} CFX`);

  const account = await conflux.wallet.addPrivateKey(process.env.PRIVATE_KEY); // prepare and set your private key as environment variable

  const txHash = await conflux.cfx.sendTransaction({
    from: account.address,
    to: exampleAddress,
    value: Drip.fromCFX(1), // send 1 CFX
  });

  console.log(`Transaction hash: ${txHash}`);

  // after the transaction is executed, you can query the receipt, and the receiver should have 1 CFX more
}

main().catch(console.error);
```

For more guides and examples, please refer to the [SDK documentation](https://confluxnetwork.gitbook.io/js-conflux-sdk).

## Address conversion performance

To gain an address conversion(hex->base32 or reverse) performance boost, you can install [`@conflux-dev/conflux-address-rust`](https://github.com/conflux-fans/conflux-address-rust-binding) in your project. Which will be used to replace the purejs version and can gain a `10-100` performance boost.

Note: @conflux-dev/conflux-address-rust required a rust environment to install.

## SDK version relation with Conflux-rust

How to know SDK's version

```js
const { Conflux } = require('js-conflux-sdk');
const conflux = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,
});
console.log(conflux.version);
// 2.0.0
```

How to know fullnode's version

```js
const clientVersion = await conflux.cfx.getClientVersion();
console.log(clientVersion);
// conflux-rust-2.0.0
```

js-conflux-sdk | conflux-rust(node)
-------------- | -------------
v2.4.0+        | v2.4.0+
v2.0.0+        | v2.0.0+
v1.7.0+        | v1.1.5+
v1.6.0+        | v1.1.3+
v1.5.11+       | v1.1.1+

## Related Projects | Tools

* [CIP-23](https://github.com/conflux-fans/cip-23) can be used to work with Conflux signTypedData
* [hardhat-conflux](https://github.com/conflux-chain/hardhat-conflux) hardhat plugin that can be used to interact with Conflux Core Network Contracts
* [@conflux-dev/hdwallet](https://github.com/Conflux-Chain/ts-conflux-sdk/tree/main/packages/hdwallet) HD Wallet
