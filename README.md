# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)

JavaScript Conflux Software Development Kit is a complete library for interacting with the Conflux Blockchain in both Node.js and browser environment.

Features:

* Can be used in both browser and Node.js environment
* Connect to Conflux node over HTTP/Websocket JSON-RPC
* Meta-classes create JavaScript objects from any contract ABI
* Account utilities
* Type converter, sign and hash utilities
* Extensive [documentation](https://confluxnetwork.gitbook.io/js-conflux-sdk/)
* Builtin support for CRC20 and Internal Contracts

## Docs

* [Overview](docs/overview.md)
* [Complete document for sending transaction](docs/how_to_send_tx.md)
* [Interact with contract](docs/interact_with_contract.md)
* [SDK support for CIP37 address](docs/conflux_checksum_address.md)
* [API](docs/api/README.md)
* [Error handling](docs/error_handling.md)
* [Conflux Official document](https://developer.conflux-chain.org/docs/introduction/en/conflux_overview)
* [Public availabel RPC service](https://github.com/conflux-fans/conflux-rpc-endpoints)
* [Examples](https://github.com/conflux-fans/js-sdk-example)
* [Fullnode RPC document](https://developer.confluxnetwork.org/conflux-doc/docs/json_rpc)

Check [SDK's documentation](https://confluxnetwork.gitbook.io/js-conflux-sdk/) site for more info.

## Install

Install through npm

```sh
$ npm install js-conflux-sdk
```

## How to import

### Nodejs

Use in Node.js script

```javascript
const { Conflux } = require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,
  logger: console, // for debug
});
```

require deep nested file/dir

```javascript
const util = require('js-conflux-sdk/src/util');
```

### Frontend

#### umd

The front packed package is located in `js-conflux-sdk`'s dist folder.

```javascript
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
```

or if your bundler supports the [`browser` field](https://docs.npmjs.com/files/package.json#browser) in `package.json`

```javascript
import { Conflux } from 'js-conflux-sdk';
```

or

```markup
<script type="text/javascript" src="node_modules/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>
<script type="text/javascript">
  const conflux = new window.Conflux.Conflux({
    url: 'https://test.confluxrpc.com',
    logger: console,
    networkId: 1,
  });
</script>
```

Or you can use public CDN links:

* [`jsdelivr`](https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js)

## Address conversion performance

To gain a address conversion(hex->base32 or reverse) performance boost, you can install [`@conflux-dev/conflux-address-rust`](https://github.com/conflux-fans/conflux-address-rust-binding) in your project. Which will be used to relace the purejs version and can gain a `10-100` performance boost.

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
// conflux-rust-1.2.0-beta-9
```

js-conflux-sdk | conflux-rust(node)
-------------- | -------------
v2.0.0+        | v1.2.0+
v1.7.0+        | v1.1.5+
v1.6.0+        | v1.1.3+
v1.5.11+       | v1.1.1+
