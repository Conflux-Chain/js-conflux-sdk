# How to send a Conflux Transaction

## Send transaction simple
It can be very easy to send a simple transaction(transfer some CFX to another address), all you need is `from`, `to`, `value` and `from`'s privateKey.

```js
const { Conflux, Drip } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key
const ADDRESS = 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp';

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
  });
  
  const sender = conflux.wallet.addPrivateKey(PRIVATE_KEY); // add private to local wallet
  const transactionHash = await conflux.sendTransaction({
    from: sender.address, // account address or instance which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
  });
  
  console.log(transactionHash); // suggest store transactionHash in disk !!!
  // 0x22e5ffefe4da995ebcb2847762b7acb1c03fd17c9ab010272965fa63c9590d6e
  
  // you might need wait seconds here...
  await new Promise(resolve => setTimeout(resolve, 60 * 1000));

  const transaction = await conflux.getTransactionByHash(txHash);
  console.log(transaction); // get transaction from remote
  /*
  {
    nonce: 13584n,
    gasPrice: 1n,
    gas: 75000n,
    value: 100000000000000000n,
    storageLimit: 2048n,
    epochHeight: 1344622,
    chainId: 1,
    v: 1,
    status: 0,
    transactionIndex: 3,
    blockHash: '0x4ee16b530f6b6951122c1305b262eef5251ebff03498bc510610ed45fb72a014',
    contractCreated: null,
    data: '0x',
    from: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    hash: '0x22e5ffefe4da995ebcb2847762b7acb1c03fd17c9ab010272965fa63c9590d6e',
    r: '0x162f2b49022528ba65fa35be2b93b8554d1910f7993201f1e755e5a29c7f8a53',
    s: '0x2106ce156aea46ffe8438b8a4057e116b4d1c8551158ae2cf1e4679924e433d8',
    to: 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp'
  }
  */

  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log(receipt); // get receipt from remote
  /*
  {
    index: 3,
    epochNumber: 1344628,
    outcomeStatus: 0,
    gasUsed: 54349n,
    gasFee: 56250n,
    blockHash: '0x4ee16b530f6b6951122c1305b262eef5251ebff03498bc510610ed45fb72a014',
    contractCreated: null,
    from: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    logs: [],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    stateRoot: '0xf8d93f9f783605572fb48beb81e7450b25eae2eeb28310429c862a5c1956bd71',
    to: 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp',
    transactionHash: '0x22e5ffefe4da995ebcb2847762b7acb1c03fd17c9ab010272965fa63c9590d6e',
    txExecErrorMsg: null
  }
  */
}

main();
```

If you can get the transaction receipt and it's `outcomeStatus` is `0`, congratulate you have send a transaction successfully.

> Note: before sending transaction, you should add an account to wallet with `conflux.wallet.addPrivateKey(PRIVATE_KEY)`

### Transaction's stage
After sending, a transaction could be in several different states, [here](https://developer.conflux-chain.org/docs/conflux-doc/docs/send_transaction#track-my-transaction) is a detail explanation of transaction life cycle.

You can get a transaction's state by it `status` or it's receipt's `outcomeStatus`
`tx.status`
* `null` The tx has not mined or executed
* `0` Tx execute success
* `1` Tx execute failed

Only after a transaction executed, you can get it's receipt. The `receipt.outcomeStatus` may have two value:

* `0` Tx execute success
* `1` Tx execute failed

Correspond to transaction stages, the SDK has provide several advanced `sendTransaction` usage:

```js
const { Conflux, Drip } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key
const ADDRESS = 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp';

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
  });
  
  const sender = conflux.wallet.addPrivateKey(PRIVATE_KEY);
  
  const pendingTransaction = conflux.sendTransaction({
    from: sender.address, // account address or instance which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
  }); // NOTE: without await, transaction not send yet

  const transactionHash = await pendingTransaction; // send and await endpoint return transaction hash
  console.log(transactionHash);

  // usually wait about 2 seconds
  const packedTransaction = await pendingTransaction.get(); // await endpoint packed transaction
  console.log(packedTransaction); // `blockHash` might still be `null`

  // usually wait about 5 seconds
  const minedTransaction = await pendingTransaction.mined(); // await transaction mined
  console.log(minedTransaction); // already have `blockHash`
  
  // usually wait about 10 seconds
  const executedReceipt = await pendingTransaction.executed(); // await transaction executed
  console.log(executedReceipt); // if `outcomeStatus` equal 0, return receipt, else throw error

  // usually wait about 50 seconds
  const confirmedReceipt = await pendingTransaction.confirmed(); // await transaction confirmed
  console.log(confirmedReceipt); // usually same as executedReceipt, but transaction block risk is <= 1e-8
}

main();
```

Note: the `mined`, `executed`, `confirmed` methods maybe will take a long time, and will be timeout.


## Send transaction complete

Besides `from`, `to`, `value` there are several other fields could be filled with:

* `nonce`: optional, the nonce of a transaction to keep the order of your sending transactions, increase one by one. If missing, the result of cfx_getNextNonce will be automatically filled in and it works for general scenarios. Some cases, like sending a lot of transactions in a short period. It's recommended to maintain the nonce on your own.
* `gasPrice`: optional, the price in Drip that you would like to pay for each gas consumed. If missing, the result of cfx_gasPrice will be automatically filled in, which is the median of recent transactions.
* `gas`: optional, the max gas you would like to use in the transaction. After the end of transaction processing, the unused gas will be refunded if used_gas >= gas * 0.75. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general scenarios.
* `to`: the receiver of the transaction, could be a personal account(start with 1) or contract(start with 8). Leave a null here to deploy a contract.
* `value`: the value (in Drip) to be transferred.
* `storageLimit`: optional, the max storage (in Byte) you would like to collateralize in the transaction. If missing, the result of cfx_estimateGasAndCollateral will be automatically filled in and it works for general senarios.
* `epochHeight`: optional, a transaction is can be verified only in epochs in the range [epochHeight - 10000, epochHeight + 10000], so it's a timeout mechanism. If missing, the result of cfx_epochNumber will be automatically filled in and it works for general scenarios.
* `data`: optional, it's either an attached message of a transaction or a function signature of a contract call. If missing, a null will be filled into it.
* `chainId`: optional, it used for dealing with a hard fork or preventing a transaction replay attack. If missing SDK will get it from RPC.
* `from`: The sender account(with private key) to sign the transaction.

Compare with ethereum Conflux transaction have three new field: `storageLimit`, `epochHeight`, `chainId`


```js
const { Conflux, Drip } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key
const ADDRESS = 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp';

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
  });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet
  
  const estimate = await conflux.estimateGasAndCollateral({ to, value });
  const status = await conflux.getStatus();

  const transactionHash = await conflux.sendTransaction({
    from: account.address, // sender address which added into conflux.wallet
    to: ADDRESS, // receiver address
    value: Drip.fromCFX(0.1), // 0.1 CFX = 100000000000000000 Drip
    data: null,
    gas: estimate.gasUsed,
    storageLimit: 0,
    chainId: status.chainId,
    nonce: await conflux.getNextNonce(account.address),
    gasPrice: await conflux.getGasPrice(),
    epochHeight: await conflux.getEpochNumber(),
  }); 
  
  console.log(transactionHash);
}

main();
```

## How much `gas` and `storageLimit` a transaction need
If you are just transfer CFX, the gas should be `21000`, if you are interact with a contract it's a little complicated.
Normally you can estimate it by call `estimateGasAndCollateral`.

```js
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org/v2',
    logger: console, // for debug
    defaultGasPrice: 1,
    defaultGasRatio: 1.1,
    defaultStorageRatio: 1.1,
    networkId: 1,
});
```

### `gasPrice`
When sending transaction if you specify the `gasPrice` it will be used, if not it will try to use `cfx.defaultGasPrice` you can specify it when you initiallize the cfx object.

If both `gasPrice` and `defaultGasPrice` is not specified, the SDK will fill the result of `getGasPrice()` to it.

Currentlly set the gasPrice to `1 Drip` will enough to send most transactions.

### `gas`
First you can specify the tx.`gas`, if you don't it will use the result of `estimateGasAndCollateral.gasUsed`, and this value will be multiply a ratio `defaultGasRatio` (default 1.1), because the estimate result sometimes are not accurate, normally estimated `gasUsed` will not enough.

### `storageLimit`
Same as `gas` you can specify `storageLimit` when you send transaction (unit is Byte), if not

## SendRawTransaction
The `sendTransaction` will get `from`'s privateKey from wallet, use it sign transaction and invoke `sendRawTransaction` method, if you have a raw transaction you can use it directly. the `sendRawTransaction` method also can use `get`, `mined`, `executed`, `confirmed` method.

```js
const { Conflux, Transaction } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key
const ADDRESS = 'cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp';

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
  });

  const transaction = new Transaction({
    to: ADDRESS, // receiver address
    nonce: 1, // sender next nonce
    value: 1,
    gas: 21000,
    gasPrice: 1,
    storageLimit: 0,
    epochHeight: 100,
    chainId: 1, // endpoint status.chainId
    data: '0x'
  });

  transaction.sign(PRIVATE_KEY, 1); // sender privateKey

  const transactionHash = await conflux.sendRawTransaction(transaction.serialize());
  console.log(transactionHash)
}

main();
```

### Why my transaction is always pending ?
If your transaction alway pending in the pool, normally you have use a incorrect `nonce` or your `balance` is not enough. You can get the transaction info by it's hash, and check it's nonce with your account's nonce, and check your balance is enough to cover the value + gasPrice * gas + storageLimit.

### Why my transaction failed?
If your transaction is failed, you can find reason in below ways:

1. Is your balance is enough cover your tx: check `value`, `gas`, `storageLimit`
2. Is your `gas` is enough, is your `storageLimit` enough
2. Check receipt's `txExecErrorMsg` for detail error message

### How to send a transaction with a note
If you want send a transaction with a note, you can specify it through `data`, the tricky is you need convert your message to a hex string.

```js
const { Conflux, format } = require('js-conflux-sdk');

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
  });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY); // create account instance and add to wallet
 
  const transactionHash = await conflux.sendTransaction({
    from: account.address,
    to: account.address, // if data is not contract bytecode, must have `to` address
    data: format.bytes('Hello World')
  });
  console.log(transactionHash); 
}

main()
```
