# js-conflux-sdk

JavaScript Conflux Software Development Kit

## Installation

`npm install js-conflux-sdk`

## Usage

[api document](https://github.com/Conflux-Chain/js-conflux-sdk/blob/master/api.md)

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

## Example

[example](https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/example)
