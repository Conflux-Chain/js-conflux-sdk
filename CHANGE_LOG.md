# change log

## v0.11.0

* defaultGasPrice, defaultGas, defaultStorageLimit only use for sendTransaction

```
// old
cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
  defaultGas: 10,
  defaultStorageLimit: 1,
})

cfx.call({
  address: '0x...',
  data: '0x...',
}); // => cfx_call{defaultGasPrice:'0x64', defaultGas:'0xa',defaultStorageLimit:'0x1',address:'0x...',data:'0x...'}


// new
cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
})

cfx.call({
  address: '0x...',
  data: '0x...',
}); // => cfx_call{address:'0x...',data:'0x...'}
```

* remove defaultEpoch, defaultChainId

```
// old
cfx = new Conflux({
  defaultEpoch: 'latest_state',
  defaultChainId: 1,
})

// new
// user could `epochNumber` and `chainId` manual on each method.
```

## v0.10.3

* fix broken sourcemap

## v0.10.2

* fix: include crypto into browserify build

```
// old
ConfluxJSSDK.util.sign.randomPrivateKey() // TypeError randomBytes is not a function

```

## v0.10.1

* add format.bytes

```
format.bytes('abcd'); // <Buffer 61 62 63 64>
format.bytes([0, 1, 2, 3]); // <Buffer 00 01 02 03>
```

* add contract method & event type or signature indexes

```
// solidity
function override(bytes memory str) public
function override(string memory str) public
```

```
contract.override('str'); // Error: can not determine override

contract['override(string)']('str'); // specify override method by type
contract['0x227ffd52']('str'); // specify override method by signature
```


## v0.10.0-alpha

* add `getStatus`

```
cfx.getStatus()
```

* remove `getRiskCoefficient` and replace with `getConfirmationRiskByHash`

```
// old
cfx.getRiskCoefficient(epochNumber)

// new
cfx.getConfirmationRiskByHash(blockHash)
```

* remove `getAccount` cause it's internal RPC.

* use `require` replace `import` to gen code.

## v0.9.2

* add defaultStorageLimit and defaultChainId for Conflux

```
// old
const cfx = new Conflux({
  url: 'http://localhost:8000',
  defaultGasPrice: 100,
  defaultGas: 100000,
})

// new
const cfx = new Conflux({
  url: 'http://localhost:8000',
  defaultGasPrice: 100,
  defaultGas: 100000,
  defaultStorageLimit: 4096,
  defaultChainId: 0,
})
```

## v0.9.1

* abi implicitly converting string to number

solidity method: `function add(uint,uint) public returns (uint);`

```
// old
await contract.add(1, '2'); // error! can not accept string 

// new version
await contract.add(1, '2'); // good, converting string to number
```

## v0.9.0-beta

* format nonce as JSBI.BigInt

```
nonce = await cfx.getNextNonce(...)

// old
100000

// new
JSBI.BigInt(100000)
```

* format transaction fields

```
tx = await cfx.getTransactionByHash(txHash)
// old
{
  storageLimit: "0x64",
  chainId: "0x0",
  epochHeight: "0x400",
  ...
}

// new
{
  storageLimit: JSBI.BigInt(100), // JSBI
  chainId: 0,
  epochHeight: 1024,
  ...
}
```

* unit return string

```
// old
unit.fromCFXToGDrip(123) => JSBI.BigInt(123000000000)
unit.fromCFXToGDrip('0.1234567891') => Error('Cannot convert JSBI.BigInt')

// new
unit.fromCFXToGDrip(123) => "123000000000"
unit.fromCFXToGDrip('0.1234567891') => "123456789.1"
```

* contract fields "code" rename to "bytecode"

```
// old
cfx.Contract({code, abi, address})

// new
cfx.Contract({bytecode, abi, address})
```

* abi decodeData and decodeLog return object

```
result = contract.abi.decodeData('0x....')

// old
["Tom", JSBI.BigInt(18)]

// new
{
  name: 'func'
  fullName: 'func(string name, uint age)',
  type: 'func(string,uint)',
  signature: '0x812600df',
  array: ["Tom", JSBI.BigInt(18)],
  object: {
    name: "Tom",
    age: JSBI.BigInt(18),
  }
}
```
