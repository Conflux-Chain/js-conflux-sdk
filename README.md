# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)

JavaScript Conflux Software Development Kit is a complete library for interacting with the Conflux Blockchain.

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
* [Conflux RPC endpoints](https://github.com/conflux-fans/conflux-rpc-endpoints)


## Quick Start

### Nodejs

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

CDN links

* [`jsdelivr`](https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js)

## SDK version relation with Conflux-rust

How to know SDK's version
```js
const { Conflux } = require('js-conflux-sdk');
const cfx = new Conflux({
  url: 'xxxx',
  networkId: 1,
});
console.log(cfx.version);
```

How to know fullnode's version
```js
const clientVersion = await cfx.getClientVersion();
console.log(clientVersion);
```

js-conflux-sdk | conflux-rust(node)
-------------- | -------------
v1.7.0+        | v1.1.5+
v1.6.0+        | v1.1.3+
v1.5.11+       | v1.1.1+
