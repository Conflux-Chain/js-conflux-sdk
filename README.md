# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
-----------------------

JavaScript Conflux Software Development Kit

## Documentation

* [Overview](./docs/overview.md)
* [Complete document for sending transaction](./docs/how_to_send_tx.md)
* [Interact with contract](./docs/interact_with_contract.md)
* [SDK support for CIP37 address](./docs/conflux_checksum_address.md)
* [API](./docs/api.md)
* [Error handling](./docs/error_handling.md)
* [Conflux Official document](https://developer.conflux-chain.org/docs/introduction/en/conflux_overview)
* [Conflux RPC endpoints](https://github.com/conflux-fans/conflux-rpc-endpoints)

## v1.5.10 Key Features
Added support for [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md) address.
And this version can only work based on `conflux-rust v1.1.1` or above.

The biggest difference you `must know` is that a new field `networkId` was added when you initialize the class `Conflux`.
If you still want to use the hex40 format address when calling RPC methods, `networkId must be set`.
Only with `networkId`, conflux can figure out the right CIP37 address from hex40 address.

There are two ways you can set it. You can specify `networkId` when initializing the conflux object.
```js
const conflux = new Conflux({
    url: 'https://test.confluxrpc.org/v2',
    networkId: 1
});
```

Or you can use the static method `create` to create a `Conflux` instance.
```js
const conflux = await Conflux.create({
    url: 'https://test.confluxrpc.org/v2',
});
```

If you forget to set the networkId, you will see a warning.

Another big change is `format.address` will return the CIP-37 address.

```js
format.address('0x0123456789012345678901234567890123456789', 1)  // second parameter networkId is required when passing a hex40 address
// "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
format.address('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
// "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
```

More details in the [complete changelog](./CHANGE_LOG.md)

## Quick Start

### Nodejs
```javascript
const { Conflux } = require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'https://test.confluxrpc.org/v2',
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

``` html
<script type="text/javascript" src="node_modules/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>
<script type="text/javascript">
  const conflux = new window.Conflux.Conflux({
    url: 'https://test.confluxrpc.org/v2',
    logger: console,
    networkId: 1,
  });
</script>
```

CDN links

* [`jsdelivr`](https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js)


## TODO

* support [CIP 23](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-23.md)
