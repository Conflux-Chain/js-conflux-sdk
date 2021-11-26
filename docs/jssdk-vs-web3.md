# Contrast with web3.js

`js-conflux-sdk` is Conflux network's javascript SDK, if you are familiar with Ethereum's web3.js, this guide can help you quickly know how to use `js-conflux-sdk`.

## Install

web3: 

* npm: `npm install web3`
* pure js: link the `dist/web3.min.js`

js-conflux-sdk:

* npm: `npm install js-conflux-sdk`
* pure js: link the `dist/js-conflux-sdk.umd.min.js`

## Import & initialize

web3:

```js
// In Node.js use: const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
```

js-conflux-sdk:

```js
const { Conflux } = require('js-conflux-sdk');
// In browser: const Conflux = window.TreeGraph.Conflux;

const conflux = new Conflux({
  url: "https://test.confluxrpc.com",
  networkId: 1
});
```

### Invoke client's RPC method

web3:

```js
// get balance
await web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
// get nonce
await web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
// get block
await web3.eth.getBlock('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
// get transaction
await web3.eth.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
// get tx receipt
await web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
```

js-conflux-sdk:

```js
// get balance
await conflux.cfx.getBalance('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp');
// get nonce
await conflux.cfx.getNextNonce('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp');
// get block
await conflux.cfx.getBlockByHash('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
// get transaction
await conflux.cfx.getTransactionByHash('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
// get tx receipt
await conflux.cfx.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
```

### Account manage

web3:

```js
// create
const account = web3.eth.accounts.create();
/*
{
    address: "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01",
    privateKey: "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709",
    signTransaction: function(tx){...},
    sign: function(data){...},
    encrypt: function(password){...}
}
*/
// import private key
web3.eth.accounts.privateKeyToAccount(privateKey);
// signTransaction
const txInfo = {
    to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    value: '1000000000',
    gas: 2000000
};
account.signTransaction(txInfo)
web3.eth.accounts.signTransaction(txInfo, account.privateKey);
```

js-conflux-sdk:

```js
// create
const account = conflux.wallet.addRandom(privateKey);
// import private key
const account2 = conflux.wallet.addPrivateKey();
// signTransaction
const txInfo = {
    to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    value: '1000000000',
    gas: 2000000
};
```

### Sending Transactions

web3:

```js
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
// signTransaction
const txInfo = {
    to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    value: '1000000000',
    gas: 2000000
};
const tx = await account.signTransaction(txInfo);
const hash = await web3.eth.sendRawTransaction(tx.rawTransaction);
```

js-conflux-sdk:

```js
const account = conflux.wallet.addPrivateKey(privateKey);
const hash = await conflux.cfx.sendTransaction({
  from: account.address,
  to: 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp',
  value: '1000000000',
  gas: 2000000
});
```

#### Tx state checker

web3:

```js
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('sending', function(payload){ ... })
.once('sent', function(payload){ ... })
.once('transactionHash', function(hash){ ... })
.once('receipt', function(receipt){ ... })
.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
.on('error', function(error){ ... })
.then(function(receipt){
    // will be fired once the receipt is mined
});
```

js-conflux-sdk:

```js
const pendingTx = conflux.cfx.sendTransaction({
  from: 'cfxtest:123...',
  to: 'cfxtest:456...',
  value: 1
});

const hash = await pendingTx;

const tx = await pendingTx.get();

tx = await pendingTx.mined();

const receipt = await pendingTx.executed();

receipt = await pendingTx.confirmed();
```

### Interact with contract

To interact with contract, you must know it's `abi`, `bytecode`, `address`

#### Deploy contract

web3:

```js
const contract = new web3.eth.Contract(abi);

await contract.deploy({
  data: bytecode,
  arguments: [arg1, arg2]
});
```

js-conflux-sdk:

```js
const contract = conflux.Contract({
  abi,
  bytecode,
});

const hash = await contract.constructor(arg1, arg2).sendTransaction({
  from: account
});

// wait tx packed and executed

const receipt = await conflux.cfx.getTransactionReceipt(hash);

console.log('Contract address: ', receipt.contractCreated);
```

#### Call methods

web3:

```js
const contract = new web3.eth.Contract(abi, address);
let result = await contract.methods.myMethod(123).call({
  from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
});
```

js-conflux-sdk

```js
const contract = conflux.Contract({
  abi,
  address
});
let result = await contract.myMethod(123).call({
  from: "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp",
});
```

#### Update contract state

web3:

```js
let receipt = await contract.methods.updateStateMethod(123).send({
  from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
});
```

js-conflux-sdk:

```js
let receipt = await contract.updateStateMethod(123).sendTransaction({
  from: "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
}).executed();
```

### Utilities

#### Unit convert

web3:

```js
web3.utils.toWei('1', 'ether');
> "1000000000000000000"

web3.utils.toWei('1', 'Gwei')
> "1000000000"

web3.utils.fromWei('1', 'ether');
> "0.000000000000000001"

web3.utils.fromWei('1', 'Gwei');
> "0.000000001"
```

js-conflux-sdk:

```js
const { Drip } = require('js-conflux-sdk');

Drip.fromCFX(1).toString()
> "1000000000000000000"

Drip.fromGDrip(1).toString();
> "1000000000"

new Drip(1).toCFX();
> "0.000000000000000001"

new Drip(1).toGDrip();
> "0.000000001"
```

#### hex encoding

web3:

```js
web3.utils.toHex('234');
> "0xea"

web3.utils.toHex(234);
> "0xea"

web3.utils.toHex(new BN('234'));
> "0xea"

web3.utils.toHex(new BigNumber('234'));
> "0xea"

web3.utils.toHex('I have 100€');
> "0x49206861766520313030e282ac"
```

js-conflux-sdk:

```js
const { format } = require('js-conflux-sdk');

format.hex(234)
> '0xea'

format.hex(BigInt(123))
> '0x7b'

format.hex(Buffer.from('hello world'))
> '0x68656c6c6f20776f726c64'
```

#### keccak

web3:

```js
web3.utils.sha3('234'); // taken as string
> "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"
```

js-conflux-sdk:

```js
format.keccak256(Buffer.from('234'))
> "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"
```

#### 