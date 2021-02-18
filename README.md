# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
-----------------------

JavaScript Conflux Software Development Kit

## 1.5.10 Key features
v1.5.10 add support for [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md) address.
And only work with `conflux-rust v1.1.1` or above.

The biggest difference you `must to know` is class `Conflux`'s init option add a new field `networkId`.
If you still want use hex40 address when invoke RPC methods, `networkId must be set`, 
only with `networkId` conflux can firgure out a right CIP37 address from hex40 address.

There are two way you can set it. You can specify `networkId` when initiate the conflux object
```js
const conflux = new Conflux({
    url: 'https://test.confluxrpc.org/v2',
    networkId: 1
});
```

Or you can create a `Conflux` instance with `create` static method
```js
const conflux = await Conflux.create({
    url: 'https://test.confluxrpc.org/v2',
});
```

If you forgot to set networkId, you will see warning about it.

Another big change is `format.address` will return CIP-37 address.

```js
format.address('0x0123456789012345678901234567890123456789', 1)  // second parameter networkId is required when passing a hex40 address
// "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
format.address('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
// "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
```

Check detail in the [complete changelog](./CHANGE_LOG.md)

## Quick Usage

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

CDN services such as `jsdelivr` provide link you can directly use for example:
https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js

## Documentation

* [Overview](./docs/overview.md)
* [Complete document for sending transaction](./docs/how_to_send_tx.md)
* [Interacting with contract](./docs/interact_with_contract.md)
* [SDK support for CIP37 address](./docs/conflux_checksum_address.md)
* [API](./docs/api.md)
* [Conflux Official document](https://developer.conflux-chain.org/docs/introduction/en/conflux_overview)
* [Conflux RPC endpoints](https://github.com/conflux-fans/conflux-rpc-endpoints)

## TODO

* support [CIP 23](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-23.md)
