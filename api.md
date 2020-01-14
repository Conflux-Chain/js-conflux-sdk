
----------
# Account




## Account.constructor

Create a account by privateKey.

### Parameters

Name       | Type          | Required | Default | Description
-----------|---------------|----------|---------|------------
privateKey | string,Buffer | true     |         |

### Return

`Account` 


## Account.signTransaction

Sign a transaction.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------------
options | object | true     |         | See 'Transaction'

### Return

`Transaction` 


## Account.toString



### Parameters

`void`

### Return

`string` Account address as string.


## Account.random

Create a new Account with random privateKey.

### Parameters

Name    | Type | Required | Default | Description
--------|------|----------|---------|------------
entropy |      | true     |         |

### Return

`Account` 

### Example

```
> Account.random()
   Account {
      privateKey: '0x1a402b7c1a7417dc7236c152df5861a24d60a7beca7890bae10ccfb85e9ed037',
      address: '0xf0bf7c4ebb8b0acde3529aafd05b0bac7edb6ddc'
    }> Account.random() // gen a different account from above
   Account {
      privateKey: '0x08c9201ea1de182f67a794f4a2ef3dfeb8f0bdf9488a78006c79048d08553299',
      address: '0xa5ec380e0378df6399b887ad1d45b60c8f3631f6'
    }> Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   Account {
      privateKey: '0x6238653ddcd62238d7b47dd70a6059d9978b771cd99388fd6423f6a3a54be535',
      address: '0x20e3118c92c8f16e2307308c67db06cdd3978e13'
    }> Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');// gen a different account from above, even use same entropy
   Account {
      privateKey: '0x4d6a462c78e7603ae4707672a4716799e9ebce4e267de42a0402665eee4a4e62',
      address: '0x881302cd9a3d85ccb7048ff5e679c23b5e80c0eb'
    }
```

----------
# Conflux

A sdk of conflux.

## Conflux.defaultEpoch (deprecated)

Default epoch number for following methods:
- `Conflux.getBalance`
- `Conflux.getTransactionCount`
- `Conflux.getCode`
- `Conflux.call`
`number,string`


## Conflux.defaultGasPrice (deprecated)

Default gas price for following methods:
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`
`number,string`


## Conflux.defaultGas (deprecated)

Default gas limit for following methods:
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`
`number,string`


## Conflux.constructor



### Parameters

Name                    | Type          | Required | Default        | Description
------------------------|---------------|----------|----------------|-------------------------------------------------------
options                 | object        | false    |                | Conflux and Provider constructor options.
options.url             | string        | false    | ''             | Url of provider to create.
options.defaultEpoch    | string,number | false    | "latest_state" | Default epochNumber.
options.defaultGasPrice | string,number | false    |                | The default gas price in drip to use for transactions.
options.defaultGas      | string,number | false    |                | The default maximum gas provided for a transaction.

### Return

`void`

### Example

```
> const Conflux = require('conflux-web');> const cfx = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
```

```
> const cfx = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     defaultGas: 100000,
     logger: console,
   });
```

## Conflux.setProvider

Create and set `provider`.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------------------------
url     | string | true     |         | Url of provider to create.
options | object | false    |         | Provider constructor options.

### Return

`Object` 

### Example

```
> cfx.provider;
   HttpProvider {
     url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
     timeout: 60000,
     ...
   }> cfx.setProvider('http://localhost:8000');> cfx.provider;
   HttpProvider {
     url: 'http://localhost:8000',
     timeout: 60000,
     ...
   }
```

## Conflux.Account

A shout cut for `new Account(privateKey);`

### Parameters

Name       | Type          | Required | Default | Description
-----------|---------------|----------|---------|--------------------------
privateKey | string,Buffer | true     |         | See `Account.constructor`

### Return

`Account` 


## Conflux.Contract

A shout cut for `new Contract(cfx, options);`

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|---------------------------
options | object | true     |         | See `Contract.constructor`

### Return

`Contract` 


## Conflux.close

close connection.

### Parameters

`void`

### Return

`void`

### Example

```
> cfx.close();
```

## Conflux.getGasPrice

Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.

### Parameters

`void`

### Return

`Promise.<BigInt>` Gas price in drip.

### Example

```
> await cfx.getGasPrice();
   "0"
```

## Conflux.getEpochNumber

Returns the current epochNumber the client is on.

### Parameters

Name        | Type          | Required | Default      | Description
------------|---------------|----------|--------------|-----------------------------------------
epochNumber | string,number | false    | latest_mined | The end epochNumber to count balance of.

### Return

`Promise.<number>` EpochNumber

### Example

```
> await cfx.getEpochNumber();
   200109
```

## Conflux.getLogs

Gets past logs, matching the given options.

### Parameters

Name                | Type                  | Required | Default | Description
--------------------|-----------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options             | object                | false    |         |
options.fromEpoch   | string,number         | false    |         | The number of the start block. (>=)
options.toEpoch     | string,number         | false    |         | The number of the stop block.(<=)
options.blockHashes | Array.<string>        | false    |         | The block hash list
options.address     | string,Array.<string> | false    |         | An address or a list of addresses to only get logs from particular account(s).
options.topics      | array                 | false    |         | An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
options.limit       | number                | false    |         | Limit log number.

### Return

`Promise.<LogIterator>` Array of log objects.
- `string` address: Address this event originated from.
- `string[]` topics: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the event.
- `string` data: The data containing non-indexed log parameter.
- `string` type: TODO
- `boolean` removed: TODO
- `number` epochNumber: The epochNumber this log was created in. null when still pending.
- `string` blockHash: Hash of the block this event was created in. null when it’s still pending.
- `string` transactionHash: Hash of the transaction this event was created in.
- `string` transactionIndex: Integer of the transaction’s index position the event was created in.
- `number` logIndex: Integer of the event index position in the block.
- `number` transactionLogIndex: Integer of the event index position in the transaction.

### Example

```
> await cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 0,
      toEpoch: 'latest_mined',
      limit: 1,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ]
    });

   [
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      blockHash: '0x701afee0ffc49aaebadf0e6618b6ec1715d31e7aa639e2e00dc8df10994e0283',
      data: '0x',
      epochNumber: 542556,
      logIndex: 0,
      removed: false,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ],
      transactionHash: '0x5a301d2c342709d7de9da24bd096ab3754ea328b016d85ab3410d375616f5d0d',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined'
     },
   ]
```

```
> logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })> await logIter.next({threshold: 0.01, delta: 1000});
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }> await logIter.next();
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }> await logIter.next();
   undefined
```

```
> logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })> for await (const log of iter) {
       console.log(log);
     }
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
   ...
```

## Conflux.getBalance

Get the balance of an address at a given epochNumber.

### Parameters

Name        | Type          | Required | Default           | Description
------------|---------------|----------|-------------------|-----------------------------------------
address     | string        | true     |                   | The address to get the balance of.
epochNumber | string,number | false    | this.defaultEpoch | The end epochNumber to count balance of.

### Return

`Promise.<BigInt>` Address balance number in drip.

### Example

```
> let balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");> balance;
   1793636034970586632n> balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);> balance.toString(10);
   "0"
```

## Conflux.getTransactionCount

Get the numbers of transactions sent from this address.

### Parameters

Name        | Type          | Required | Default           | Description
------------|---------------|----------|-------------------|-----------------------------------------------------
address     | string        | true     |                   | The address to get the numbers of transactions from.
epochNumber | string,number | false    | this.defaultEpoch | The end epochNumber to count transaction of.

### Return

`Promise.<number>` 

### Example

```
> await cfx.getTransactionCount("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   61> await cfx.getTransactionCount("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   0
```

## Conflux.getBlockByEpochNumber

Get the epochNumber pivot block info.

### Parameters

Name        | Type          | Required | Default | Description
------------|---------------|----------|---------|--------------------------------------------------------------
epochNumber | string,number | true     |         | EpochNumber or string in ["latest_state", "latest_mined"]
detail      | boolean       | false    | false   | `true` return transaction object, `false` return TxHash array

### Return

`Promise.<(object|null)>` The block info (same as `getBlockByHash`).

### Example

```
> await cfx.getBlockByEpochNumber(449);
   {
     hash: '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40',
     ...
   }
```

## Conflux.getBlocksByEpochNumber

Get block hash array of a epochNumber.

### Parameters

Name        | Type          | Required | Default | Description
------------|---------------|----------|---------|----------------------------------------------------------
epochNumber | string,number | true     |         | EpochNumber or string in ["latest_state", "latest_mined"]

### Return

`Promise.<Array.<string>>` Block hash array, last one is the pivot block hash of this epochNumber.

### Example

```
> await cfx.getBlocksByEpochNumber(0);
   ['0x2da120ad267319c181b12136f9e36be9fba59e0d818f6cc789f04ee937b4f593']> await cfx.getBlocksByEpochNumber(449);
   [
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   ]
```

## Conflux.getBestBlockHash

> TODO

### Parameters

`void`

### Return

`Promise.<string>` 

### Example

```
> await cfx.getBestBlockHash();
   "0x43ddda130fff8539b9f3c431aa1b48e021b3744aacd224cbd4bcdb64373f3dd5"
```

## Conflux.getBlockByHash

Returns a block matching the block hash.

### Parameters

Name      | Type    | Required | Default | Description
----------|---------|----------|---------|--------------------------------------------------------------
blockHash | string  | true     |         | The hash of block to be get.
detail    | boolean | false    | false   | `true` return transaction object, `false` return TxHash array

### Return

`Promise.<(object|null)>` Block info object.
- `string` miner: The address of the beneficiary to whom the mining rewards were given.
- `string|null` hash: Hash of the block. `null` when its pending block.
- `string` parentHash: Hash of the parent block.
- `string[]` refereeHashes: Array of referee hashes.
- `number|null` epochNumber: The current block epochNumber in the client's view. `null` when it's not in best block's past set.
- `boolean|null` stable: If the block stable or not. `null` for pending stable.
- `string` nonce: Hash of the generated proof-of-work. `null` when its pending block.
- `number` gas: The maximum gas allowed in this block.
- `string` difficulty: Integer string of the difficulty for this block.
- `number` height: The block heights. `null` when its pending block.
- `number` size: Integer the size of this block in bytes.
- `number` blame: 0 if there's nothing to blame; k if the block is blaming on the state info of its k-th ancestor.
- `boolean` adaptive: If the block's weight adaptive or not.
- `number` timestamp: The unix timestamp for when the block was collated.
- `string` transactionsRoot: The hash of the transactions of the block.
- `string[]` transactions: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
- `string` deferredLogsBloomHash: The hash of the deferred block's log bloom filter
- `string` deferredReceiptsRoot: The hash of the receipts of the block after deferred execution.
- `string` deferredStateRoot: The root of the final state trie of the block after deferred execution.
- `object` deferredStateRootWithAux: Information of deferred state root

### Example

```
> await cfx.getBlockByHash('0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80');
   {
      epochNumber: 231939,
      height: 231939,
      size: 384,
      timestamp: 1578972801,
      gasLimit: 3000000000n,
      difficulty: 29649377n,
      transactions: [
        '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530'
      ],
      stable: true,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c',
      deferredStateRoot: '0xa930f70fc49e1ab5441031775138817ff951421fad1298b69cda26a10f1fe2b9',
      hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
      miner: '0x0000000000000000000000000000000000000014',
      nonce: '0xd7adc50635950329',
      parentHash: '0xd601491dc9e0f80ceccbf0142490fcb47a4e1801d6fcea34119ffc338b59712c',
      refereeHashes: [
        '0x6826206c6eaa60a6950182f90d2a608c07c7af6802131204f7365c1e96b1f85c'
      ],
      transactionsRoot: '0xe26c8940951305914fa69b0a8e431255962cfe95f2481283ec08437eceec03e2'
    }
```

```
> await cfx.getBlockByHash('0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40', true);
   {
    hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
    transactions: [
      {
        nonce: 1,
        value: 0n,
        gasPrice: 10n,
        gas: 10000000n,
        v: 1,
        transactionIndex: 0,
        status: 0,
        blockHash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
        contractCreated: null,
        data: '0x47e7ef2400000000000000000000000099b52de54f2f922fbd6e46d99654d2063bd7f0dc00000000000000000000000000000000000000000000000000000000000003e8',
        from: '0x99b52de54f2f922fbd6e46d99654d2063bd7f0dc',
        hash: '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530',
        r: '0xdc383e4afb5b389e4074e6d4acbb847fd0908bbca60602d66e60169f1340630',
        s: '0x14efbc60c095b507609639b219d233418a7fc7ee835902e69e1735897b45fb38',
        to: '0x28d995f3818426dbbe8e357cc1cdb67be043b0df'
      }
    ],
    ...
   }
```

## Conflux.getBlockByHashWithPivotAssumption

Get block by `blockHash` if pivot block of `epochNumber` is `pivotBlockHash`.

### Parameters

Name           | Type   | Required | Default | Description
---------------|--------|----------|---------|----------------------------------------------------------------
blockHash      | string | true     |         | Block hash which epochNumber expect to be `epochNumber`.
pivotBlockHash | string | true     |         | Block hash which expect to be the pivot block of `epochNumber`.
epochNumber    | number | true     |         | EpochNumber or string in ["latest_state", "latest_mined"]

### Return

`Promise.<object>` The block info (same as `getBlockByHash`).

### Example

```
> await cfx.getBlockByHashWithPivotAssumption(
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   449,
   );
   {
     hash: '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
     ...
   }
```

## Conflux.getTransactionByHash

Returns a transaction matching the given transaction hash.

### Parameters

Name   | Type   | Required | Default | Description
-------|--------|----------|---------|----------------------
txHash | string | true     |         | The transaction hash.

### Return

`Promise.<(object|null)>` Transaction info object
- `string` blockHash: Hash of the block where this transaction was in and got executed. `null` when its pending.
- `number` transactionIndex: Integer of the transactions index position in the block.
- `string` hash: Hash of the transaction.
- `number` nonce: The number of transactions made by the sender prior to this one.
- `string` from: Address of the sender.
- `string` to: Address of the receiver. null when its a contract creation transaction.
- `string` value: Value transferred in Drip.
- `string` data: The data send along with the transaction.
- `number` gas: Gas provided by the sender.
- `number` gasPrice: Gas price provided by the sender in Drip.
- `string` status: '0x0' successful execution; '0x1' exception happened but nonce still increased; '0x2' exception happened and nonce didn't increase.
- `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
- `string` r: ECDSA signature r
- `string` s: ECDSA signature s
- `string` v: ECDSA recovery id

### Example

```
> await cfx.getTransactionByHash('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
      "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
      "transactionIndex": 0,
      "hash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914",
      "nonce": 0,
      "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
      "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
      "value": "1000000000000000000"
      "data": "0x",
      "gas": 21000,
      "gasPrice": "819",
      "status": 0,
      "contractCreated": null,
      "r": "0x88e43a02a653d5895ffa5495718a5bd772cb157776108c5c22cee9beff890650",
      "s": "0x24e3ba1bb0d11c8b1da8d969ecd0c5e2372326a3de71ba1231c876c0efb2c0a8",
      "v": 0,
    }
```

## Conflux.getTransactionReceipt

Returns the receipt of a transaction by transaction hash.

> Note: The receipt is not available for pending transactions and returns null.

### Parameters

Name   | Type   | Required | Default | Description
-------|--------|----------|---------|----------------------
txHash | string | true     |         | The transaction hash.

### Return

`Promise.<(object|null)>` - `number` outcomeStatus: `0`: the transaction was successful, `1`: EVM reverted the transaction.
- `string` stateRoot: The state root of transaction execution.
- `number` epochNumber: EpochNumber where this transaction was in.
- `string` blockHash: Hash of the block where this transaction was in.
- `string` transactionHash: Hash of the transaction.
- `number` index: Integer of the transactions index position in the block.
- `string` from: Address of the sender.
- `string` to: Address of the receiver. null when its a contract creation transaction.
- `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
- `number` gasUsed: The amount of gas used by this specific transaction alone.
- `[object]` logs: Array of log objects, which this transaction generated.
- `[string]` logs[].address: The address of the contract executing at the point of the `LOG` operation.
- `[string]` logs[].topics: The topics associated with the `LOG` operation.
- `[string]` logs[].data: The data associated with the `LOG` operation.
- `string` logsBloom: Log bloom.

### Example

```
> await cfx.getTransactionReceipt('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
    "outcomeStatus": 0,
    "stateRoot": "0x3854f64be6c124dffd0ddca57270846f0f43a119ea681b4e5d022ade537d9f07",
    "epochNumber": 449,
    "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
    "transactionHash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
    "index": 0,
    "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
    "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
    "contractCreated": null,
    "gasUsed": 21000,
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   }
```

## Conflux.sendTransaction

Creates new message call transaction or a contract creation, if the data field contains code.

> FIXME: rpc `cfx_sendTransaction` not implement yet.

> NOTE: if `from` options is a instance of `Account`, this methods will sign by account local and send by `cfx_sendRawTransaction`, else send by `cfx_sendTransaction`

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|--------------------
options | object | true     |         | See `format.sendTx`

### Return

`Promise.<PendingTransaction>` The PendingTransaction object.

### Example

```
> // TODO call with address, need `cfx_sendTransaction`
```

```
> const account = cfx.Account(KEY);> await cfx.sendTransaction({
      from: account, // from account instance will sign by local.
      to: ADDRESS,
      value: Drip.fromCFX(0.023),
    });
   "0x459473cb019bb59b935abf5d6e76d66564aafa313efd3e337b4e1fa6bd022cc9"
```

```
> await cfx.sendTransaction({
      from: account,
      to: account, // to account instance
      value: Drip.fromCFX(0.03),
    }).get(); // send then get transaction by hash.
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0xf2b258b49d33dd22419526e168ebb79b822889cf8317ce1796e816cce79e49a2",
    "contractCreated": null,
    "data": "0x",
    "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "nonce": 111,
    "status": null,
    "to": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "value": "30000000000000000",
    ...
   }
```

```
> const promise = cfx.sendTransaction({ // Not await here, just get promise
      from: account1,
      to: ADDRESS1,
      value: Drip.fromCFX(0.007),
    });> await promise; // transaction
   "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688"> await promise.get(); // get transaction
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }> await promise.mined(); // wait till transaction mined
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "transactionIndex": 0,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }> await promise.executed(); // wait till transaction executed in right status. and return it's receipt.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }> await promise.confirmed(); // wait till transaction risk coefficient '<' threshold.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }
```

## Conflux.sendRawTransaction

Signs a transaction. This account needs to be unlocked.

### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|------------------------
hex  | string,Buffer | true     |         | Raw transaction string.

### Return

`Promise.<PendingTransaction>` The PendingTransaction object. See `sendTransaction`

### Example

```
> await cfx.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
```

## Conflux.getCode

Get the code at a specific address.

### Parameters

Name        | Type          | Required | Default           | Description
------------|---------------|----------|-------------------|----------------------------------------------------------
address     | string        | true     |                   | The contract address to get the code from.
epochNumber | string,number | false    | this.defaultEpoch | EpochNumber or string in ["latest_state", "latest_mined"]

### Return

`Promise.<string>` Code hex string

### Example

```
> await cfx.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```

## Conflux.call

Executes a message call transaction, which is directly executed in the VM of the node,
but never mined into the block chain.

### Parameters

Name        | Type          | Required | Default           | Description
------------|---------------|----------|-------------------|----------------------------------------
options     | object        | true     |                   | See `format.sendTx`
epochNumber | string,number | false    | this.defaultEpoch | The end epochNumber to execute call of.

### Return

`Promise.<string>` Hex bytes the contract method return.


## Conflux.estimateGas

Executes a message call or transaction and returns the amount of the gas used.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------------------
options | object | true     |         | See `format.estimateTx`

### Return

`Promise.<BigInt>` The used gas for the simulated call/transaction.


----------
# contract.Contract

Contract with all its methods and events defined in its abi.


## Contract.constructor



### Parameters

Name            | Type    | Required | Default | Description
----------------|---------|----------|---------|-----------------------------------------------------------------------------------------------------
cfx             | Conflux | true     |         | Conflux instance.
options         | object  | true     |         |
options.abi     | array   | true     |         | The json interface for the contract to instantiate
options.address | string  | false    |         | The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
options.code    | string  | false    |         | The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`

### Return

`object` 

### Example

```
> const contract = cfx.Contract({ abi, code });> contract instanceof Contract;
   true> contract.abi; // input abi
   [{type:'constructor', inputs:[...]}, ...]> contract.constructor.code; // input code
   "0x6080604052600080..."
```

```
> const contract = cfx.Contract({ abi, address });> contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"> await contract.count(); // call a method without parameter, get decoded return value.
   100n> await contract.inc(1); // call a method with parameters, get decoded return value.
   101n> await contract.count().call({ from: account }); // call a method from a account.
   100n> await contract.count().estimateGas();
   21655n> await contract.count().estimateGas({ from: ADDRESS, nonce: 68 }); // if from is a address string, nonce is required
   21655n// send transaction from account instance, then wait till confirmed, and get receipt.> await contract.inc(1)
   .sendTransaction({ from: account1 })
   .confirmed({ threshold: 0.01, timeout: 30 * 1000 });
   {
     "blockHash": "0xba948c8925f6d7f14faf540c3b9e6d24d33c78168b2dd81a6021a50949d9f0d7",
     "index": 0,
     "transactionHash": "0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42",
     "outcomeStatus": 0,
     ...
   }> tx = await cfx.getTransactionByHash('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');> await contract.abi.decodeData(tx.data)
   {
     name: 'inc',
     params: NamedTuple(num) [ 100n ]
   }> await contract.count(); // data in block chain changed by transaction.
   101n> logs = await contract.SelfEvent(account1.address).getLogs()
   [
   {
      address: '0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8',
      blockHash: '0xc8cb678891d4914aa66670e3ebd7a977bb3e38d2cdb1e2df4c0556cb2c4715a4',
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      epochNumber: 545896,
      logIndex: 0,
      removed: false,
      topics: [
        '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
        '0x000000000000000000000000bbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
      ],
      transactionHash: '0x9100f4f84f711aa358e140197e9d2e5aab1f99751bc26a660d324a8282fc54d0',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined',
      params: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', '10' ]
     }
   ]> contract.abi.decodeLog(logs[0]);
   {
      name: "SelfEvent",
      params: NamedTuple(sender,current) [
        '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        100n
      ]
    }
```

----------
# provider.HttpProvider

Http protocol json rpc provider.


## HttpProvider.constructor



### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|-------------------------------
url     | string | true     |         | Full json rpc http url
options | object | false    |         | See `BaseProvider.constructor`

### Return

`HttpProvider` 

### Example

```
> const provider = new HttpProvider('http://testnet-jsonrpc.conflux-chain.org:12537', {logger: console});
```

## HttpProvider.call

Call a json rpc method with params

### Parameters

Name      | Type   | Required | Default | Description
----------|--------|----------|---------|------------------------
method    | string | true     |         | Json rpc method name.
...params | array  | false    |         | Json rpc method params.

### Return

`Promise.<*>` Json rpc method return value.

### Example

```
> await provider.call('cfx_epochNumber');> await provider.call('cfx_getBlockByHash', blockHash);
```

----------
# Transaction




## Transaction.constructor

Create a transaction.

### Parameters

Name             | Type          | Required | Default | Description
-----------------|---------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options          | object        | true     |         |
options.nonce    | string,number | true     |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice | string,number | true     |         | The price of gas for this transaction in drip.
options.gas      | string,number | true     |         | The amount of gas to use for the transaction (unused gas is refunded).
options.to       | string        | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value    | string,number | false    | 0       | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.data     | string,Buffer | false    | '0x'    | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r        | string,Buffer | false    |         | ECDSA signature r
options.s        | string,Buffer | false    |         | ECDSA signature s
options.v        | number        | false    |         | ECDSA recovery id

### Return

`Transaction` 


## Transaction.hash

Getter of transaction hash include signature.

> Note: calculate every time.

### Parameters

`void`

### Return

`string,undefined` If transaction has r,s,v return hex string, else return undefined.


## Transaction.from

Getter of sender address.

> Note: calculate every time.

### Parameters

`void`

### Return

`string,undefined` If ECDSA recover success return address, else return undefined.


## Transaction.sign

Sign transaction and set 'r','s','v'.

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------------------
privateKey | string | true     |         | Private key hex string.

### Return

`void`


## Transaction.encode

Encode rlp.

### Parameters

Name             | Type    | Required | Default | Description
-----------------|---------|----------|---------|-----------------------------------------
includeSignature | boolean | false    | false   | Whether or not to include the signature.

### Return

`Buffer` 


## Transaction.serialize

Get the raw tx hex string.

### Parameters

`void`

### Return

`string` Hex string


----------
# util.format




## format.any



### Parameters

Name | Type | Required | Default | Description
-----|------|----------|---------|------------
arg  | any  | true     |         |

### Return

`any` arg

### Example

```
> format.any(1)
 1
```

## format.hex

When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

### Parameters

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | number,BigInt,string,Buffer,boolean,null | true     |         |

### Return

`string` Hex string

### Example

```
> format.hex(null)
 '0x'> format.hex(1)
 "0x01"> format.hex(256)
 "0x0100"> format.hex(true)
 "0x01"> format.hex(Buffer.from([1,10,255]))
 "0x010aff"> format.hex("0x0a")
 "0x0a"
```

## format.bigUInt



### Parameters

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | number,BigInt,string,boolean | true     |         |

### Return

`BigInt` 

### Example

```
> format.uint(-3.14)
 Error("not match uint")> format.uint('0')
 0n> format.uint(1)
 1n> format.uint(BigInt(100))
 100n> format.uint('0x10')
 16n> format.uint(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.uint



### Parameters

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | number,BigInt,string,boolean | true     |         |

### Return

`Number` 

### Example

```
> format.uint(-3.14)
 Error("cannot be converted to a BigInt")> format.uint(null)
 Error("Cannot convert null to a BigInt")> format.uint('0')
 0> format.uint(1)
 1> format.uint(BigInt(100))
 100> format.uint('0x10')
 16> format.uint('')
 0> format.uint(true)
 1> format.uint(false)
 0> format.uint(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.numberHex

When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

### Parameters

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|------------
arg  | number,string,boolean | true     |         |

### Return

`string` Hex string

### Example

```
> format.numberHex(100)
 "0x64"> format.numberHex(10)
 "0xa"> format.numberHex(3.50)
 "0x4"> format.numberHex(3.49)
 "0x3"> format.numberHex(-1))
 Error("not match uintHex")
```

## format.epochNumber



### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|-----------------------------------------------------
arg  | number,string | true     |         | number or string in ['latest_state', 'latest_mined']

### Return

`string` 

### Example

```
> format.epochNumber(10)
 "0xa"> format.epochNumber('latest_state')
 "latest_state"> format.epochNumber('latest_mined')
 "latest_state"
```

## format.address



### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|------------
arg  | string,Buffer | true     |         |

### Return

`string` Hex string

### Example

```
> format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match hex40")
```

## format.privateKey



### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|------------
arg  | string,Buffer | true     |         |

### Return

`string` Hex string

### Example

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.blockHash



### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|------------
arg  | string,Buffer | true     |         |

### Return

`string` Hex string

### Example

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.txHash



### Parameters

Name | Type          | Required | Default | Description
-----|---------------|----------|---------|------------
arg  | string,Buffer | true     |         |

### Return

`string` Hex string

### Example

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.buffer



### Parameters

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | number,BigInt,string,Buffer,boolean,null | true     |         |

### Return

`Buffer` 

### Example

```
> format.buffer(Buffer.from([0, 1]))
 <Buffer 00 01>> format.buffer(null)
 <Buffer >> format.buffer(1024)
 <Buffer 04 00>> format.buffer('0x0a')
 <Buffer 0a>> format.buffer(true)
 <Buffer 01>> format.buffer(3.14)
 Error("not match hex")
```

## format.boolean



### Parameters

Name | Type    | Required | Default | Description
-----|---------|----------|---------|------------
arg  | boolean | true     |         |

### Return

`boolean` 

### Example

```
> format.boolean(true)
 true> format.boolean(false)
 false
```

----------
# util.sign




## sign.sha3

sha3

### Parameters

Name   | Type   | Required | Default | Description
-------|--------|----------|---------|------------
buffer | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> sha3(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

## sign.checksumAddress

Makes a checksum address

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------
address | string | true     |         | Hex string

### Return

`string` 

### Example

```
> checksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
 "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
```

## sign.randomBuffer

gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|------------
size | number | true     |         |

### Return

`Buffer` 

### Example

```
> randomBuffer(0)
 <Buffer >> randomBuffer(1)
 <Buffer 33>> randomBuffer(1)
 <Buffer 5a>
```

## sign.randomPrivateKey

Gen a random PrivateKey buffer.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------
entropy | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

## sign.publicKeyToAddress

Get address by public key.

### Parameters

Name      | Type   | Required | Default | Description
----------|--------|----------|---------|------------
publicKey | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

## sign.privateKeyToAddress

Get address by private key.

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------
privateKey | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

## sign.ecdsaSign

Sign ecdsa

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------
hash       | Buffer | true     |         |
privateKey | Buffer | true     |         |

### Return

`object` ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}

### Example

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```

## sign.ecdsaRecover

Recover ecdsa

### Parameters

Name      | Type   | Required | Default | Description
----------|--------|----------|---------|------------
hash      | Buffer | true     |         |
options   | object | true     |         |
options.r | Buffer | true     |         |
options.s | Buffer | true     |         |
options.v | number | true     |         |

### Return

`Buffer` publicKey

### Example

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------
# util.unit




## unit.fromCFXToGDrip



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromCFXToGDrip(123)
 123000000000n
```

## unit.fromCFXToDrip



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromCFXToDrip(123)
 123000000000000000000n
```

## unit.fromGDripToCFX



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromGDripToCFX(123456789012)
 123n
```

## unit.fromGDripToDrip



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromGDripToDrip(123)
 123000000000n
```

## unit.fromDripToCFX



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromDripToCFX(123456789012345678901)
 123n
```

## unit.fromDripToGDrip



### Parameters

Name | Type                 | Required | Default | Description
-----|----------------------|----------|---------|------------
     | number,BigInt,string | true     |         |

### Return

`BigInt` 

### Example

```
> fromDripToGDrip(123456789012)
 123
```

## unit.unit

Unit converter factory

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|---------------------------------
from | string | true     |         | Enum in ['cfx', 'gdrip', 'drip']
to   | string | true     |         | Enum in ['cfx', 'gdrip', 'drip']

### Return

`function` 

### Example

```
> unit('cfx', 'drip')(1)
 1000000000000000000n> unit('drip', 'cfx')(1000000000000000000)
 1n
```