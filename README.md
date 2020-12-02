# js-conflux-sdk

[![npm](https://img.shields.io/npm/v/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
[![npm](https://img.shields.io/npm/dm/js-conflux-sdk.svg)](https://www.npmjs.com/package/js-conflux-sdk)
-----------------------

JavaScript Conflux Software Development Kit

## 1.0 Key features

1. Add `cfx.wallet` to manage multiple accounts, which has replace v0.13's `cfx.Account`.
2. Add `cfx.InternalContract(name)` to interact with Conflux internal contracts.
3. Add websocket provider, support pub/sub
4. Provide `Drip` to easily convert unit between CFX, Drip, Gdrip
5. Use `JSBI` for front-end, native `BigInt` for back-end

Check the [complete changelog](./CHANGE_LOG.md)

## Quick Usage

### Nodejs
```javascript
const { Conflux } = require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'http://test.confluxrpc.org',
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
    url: 'http://test.confluxrpc.org',
    logger: console,
  });
</script>
```

## Documentation

* [Quick Intro (Recommend to read)](./docs/quick_intro.md)
* [Complete document for send transaction](./docs/how_to_send_tx.md)
* [Interacting with contract](./docs/interact_with_contract.md)
* [API](./docs/api.md)
* [Internal Contract API](./docs/internal_contracts.md)

## TODO

* support [CIP 23](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-23.md)
