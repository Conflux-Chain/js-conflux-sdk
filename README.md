# js-conflux-sdk

JavaScript Conflux Software Development Kit

## Installation

`npm install js-conflux-sdk`

## Usage

[api document](https://github.com/Conflux-Chain/js-conflux-sdk/blob/master/api.md)

### Nodejs
```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  const balance = await cfx.getBalance('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
  console.log(balance); // 937499420597305000n
}

main();
```
require deep nested file/dir  

``` javascript
const util = require('js-conflux-sdk/lib/util');
```

### Frontend

#### esm
``` javascript
import { Conflux } from 'js-conflux-sdk';
import { util } from 'js-conflux-sdk/esm/util';
```

Note: This assumes bundler will read the [package.json browser
field](https://docs.npmjs.com/files/package.json#browser) as module entry. For
bundlers don't support that, additional configurations needs to be add to
support that. Please checkout the bundlers documentation.

#### umd
``` javascript
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
```

or  

``` html
<script type="text/javascript" src="node_modules/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>
<script type="text/javascript">
  const cfx = new window.Conflux.Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });
</script>
```

## Example

[example](https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/example)
