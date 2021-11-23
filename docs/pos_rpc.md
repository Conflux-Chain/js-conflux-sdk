# PoS RPC

## Available methods

Check the PoS [OPEN-RPC documentation](https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/conflux-fans/conflux-rpc-doc/pos/pos-openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false)

## How to use

All PoS RPC methods are available at `Conflux` object's `pos` attribute.

```js
const { Conflux } = require('js-conflux-sdk');
const conflux = new Conflux({
  url: 'http://localhost:12537',
  networkId: 1
});

async function main() {
  const status = await conflux.pos.getStatus();
  console.log(status);
  // { blockNumber: 69, epoch: 2, pivotDecision: 15650 }
}

main().catch(console.log);
```
