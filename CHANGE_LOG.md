# change log

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
