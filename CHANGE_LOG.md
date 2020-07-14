# change log

## v0.13.3

* Account.encrypt returned address drop '0x' prefix

## v0.13.2

* use scrypt-js

## v0.13.1

* RPC returned all number as hex

* fix `sendTransaction`, `call`, `estimateGasAndCollateral` shallow copy `options`

## v0.13.0

* `Account.decrypt` required keystoreV3 object as input, and put `password` as second parameter

```
// old
Account.decrypt('password', {salt:..., iv:..., cipher:..., mac:...})

// new
Account.decrypt({
  version: 3,
  id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
  address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
  crypto: {
    ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
    cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
      n: 8192,
      r: 8,
      p: 1
    },
    mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
  }
}, 'password')

```

* `Account.prototype.encrypt` returned keystoreV3 format object
```
const account = new Account('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

// old
account.encrypt('password')
/*
{
  algorithm: 'aes-128-ctr', 
  N: 8192, 
  r: 8, 
  p: 1, 
  dkLen: 32, 
  salt: '0xb662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc', 
  iv: '0x85b5e092c1c32129e3d27df8c581514d',
  cipher: '0xa8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
  mac: '0xcc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
}
*/

// new
account.encrypt('password')
/*
{
  version: 3,
  id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
  address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
  crypto: {
    ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
    cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
      n: 8192,
      r: 8,
      p: 1
    },
    mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
  }
}
*/
```

* epochNumber accept `earliest`, `latest_checkpoint`, `latest_confirmed` label

## v0.12.0

* add `getAdmin`

```
await cfx.getAdmin('0x89996a8aefb2228593aae723d47f9517eef1341d')
// "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8"
```

* sendTransaction accept privateKey as `from`

```
cfx.sendTransaction({
  from: PRIVATE_KEY, // accept Account instance or privateKey
  to: ADDRESS, // accept Account instance or address
  ...,
})
```

* create Account accept address

```
new Account(PRIVATE_KEY); // {privateKey:'0x...', publicKey: '0x...', address: '0x...'}
new Account(PUBLIC_KEY); // {publicKey: '0x...', address: '0x...'}
new Account(ADDRESS); // {address: '0x...'}
```

## v0.11.0

* defaultGasPrice, only use for sendTransaction

```
cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
})

// old
cfx.call({
  address: '0x...',
  data: '0x...',
}); // => cfx_call{defaultGasPrice:'0x64',address:'0x...',data:'0x...'}


// new
cfx.call({
  address: '0x...',
  data: '0x...',
}); // => cfx_call{address:'0x...',data:'0x...'}
```

* remove defaultEpoch, defaultChainId, defaultGas, defaultStorageLimit

```
// old
cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultEpoch: 'latest_state',
  defaultChainId: 1,
  defaultGasPrice: 100,
  defaultGas: 10,
  defaultStorageLimit: 1,
})

// new
cfx = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
})

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
