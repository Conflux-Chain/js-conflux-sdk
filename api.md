---
id: javascript_sdk
title: Javascript SDK
custom_edit_url: https://github.com/Conflux-Chain/js-conflux-sdk/edit/master/api.md
keywords:
  - conflux
  - javascript
  - sdk
---

- account
    - index.js
        - [accountFactory](#account/index.js/accountFactory)
    - PrivateKeyAccount.js
        - [PrivateKeyAccount](#account/PrivateKeyAccount.js/PrivateKeyAccount)
- Conflux.js
    - [Conflux](#Conflux.js/Conflux)
- contract
    - Contract.js
        - [Contract](#contract/Contract.js/Contract)
- Message.js
    - [Message](#Message.js/Message)
- provider
    - BaseProvider.js
        - [BaseProvider](#provider/BaseProvider.js/BaseProvider)
    - HttpProvider.js
        - [HttpProvider](#provider/HttpProvider.js/HttpProvider)
    - index.js
        - [providerFactory](#provider/index.js/providerFactory)
- Transaction.js
    - [Transaction](#Transaction.js/Transaction)
- util
    - sign.js
        - [sha3](#util/sign.js/sha3)
        - [checksumAddress](#util/sign.js/checksumAddress)
        - [randomBuffer](#util/sign.js/randomBuffer)
        - [randomPrivateKey](#util/sign.js/randomPrivateKey)
        - [privateKeyToPublicKey](#util/sign.js/privateKeyToPublicKey)
        - [publicKeyToAddress](#util/sign.js/publicKeyToAddress)
        - [privateKeyToAddress](#util/sign.js/privateKeyToAddress)
        - [ecdsaSign](#util/sign.js/ecdsaSign)
        - [ecdsaRecover](#util/sign.js/ecdsaRecover)
        - [encrypt](#util/sign.js/encrypt)
        - [decrypt](#util/sign.js/decrypt)
    - unit.js
        - [unit](#util/unit.js/unit)

----------------------------------------

## accountFactory <a id="account/index.js/accountFactory"></a>

* **Parameters**

Name               | Type            | Required | Default | Description
-------------------|-----------------|----------|---------|--------------------------------------------
options            | `object`        | true     |         |
options.privateKey | `string,Buffer` | false    |         | Private key of account
options.keystore   | `object`        | false    |         | Keystore version 3 to decode private key
options.password   | `string,Buffer` | false    |         | Password of keystore
options.random     | `boolean`       | false    |         | Is gen account private key by random Buffer
options.entropy    | `string,Buffer` | false    |         | Entropy of random account
conflux            | `Conflux`       | false    |         | Conflux instance to connected with

* **Returns**

`BaseAccount` 

* **Examples**

```
> accountFactory({ privateKey:'0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' })
 PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  }
```

```
> accountFactory({ random: true })
 PrivateKeyAccount {
    address: '0x15963e53096ddc12d4cd75fa56fae2851af018a1',
    publicKey: '0x9bbf094935f3f6d107496844b71b97435378d1cddeb7213c380a664513c95af50d9cc9e906cde8ea12795cdd74297b62f845bc7e77e8366d8a29fba9d18987c2',
    privateKey: '0xf0456ad16e8689601b0012fe855c293f4e557c62738ff36a66f5ece3d1b851d8'
  }
> accountFactory({ entropy: randomBuffer(32) })
 PrivateKeyAccount {
    address: '0x1f2b907176958b2a5a09f40dafee7119bc2e06a8',
    publicKey: '0x0f5e8fd193256f78b512feebfce8b7baca9eea642d7e9df2b68452bf58105a96440c31ef535c6ee4e5d6033b79151c2152fce646b10da51a0392affd29b64eeb',
    privateKey: '0x432bed0c45596b1d734af06ff876c46ab48317e8f10bf68b8d3dd0894d8cce0b'
  }
```

```
> accountFactory({ keystore, password });
 PrivateKeyAccount {
    address: '0x15abcfe17ae631aa93051988e5a49f737ca319cf',
    publicKey: '0x21301d39fdfbb7222c168660ac845e0edf6c40de012d0b452f6703190484f557ffe996531e5ea242b98a5adc5556d25589ec98b1c0ff5694ede8bf52a301d14d',
    privateKey: '0x7bb5398ce0ef4f8f8ab9f80c6a700973554882e5b2b1e10e0efe02fb5c5383bc'
  }
```

----------------------------------------

## PrivateKeyAccount <a id="account/PrivateKeyAccount.js/PrivateKeyAccount"></a>



## PrivateKeyAccount.random <a id="account/PrivateKeyAccount.js/random"></a>

Create a new PrivateKeyAccount with random privateKey.

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|------------
entropy | `string,Buffer` | false    |         |
conflux | `Conflux`       | false    |         |

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.random()
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: '0x1cecb4a2922b7007e236daf0c797de6e55496e84'
    }
> PrivateKeyAccount.random() // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0x16c25691aadc3363f5862d264072584f3ebf4613'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x113d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
// gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x1f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
    }
```

## PrivateKeyAccount.decrypt <a id="account/PrivateKeyAccount.js/decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name     | Type            | Required | Default | Description
---------|-----------------|----------|---------|------------
keystore | `object`        | true     |         |
password | `string,Buffer` | true     |         |
conflux  | `Conflux`       | false    |         |

* **Returns**

`PrivateKeyAccount` 

## PrivateKeyAccount.prototype.constructor <a id="account/PrivateKeyAccount.js/constructor"></a>

Create a account by privateKey.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
privateKey | `string,Buffer` | true     |         |
conflux    | `Conflux`       | true     |         |

* **Returns**

`PrivateKeyAccount` 

## PrivateKeyAccount.prototype.encrypt <a id="account/PrivateKeyAccount.js/encrypt"></a>

Encrypt account privateKey to object.

* **Parameters**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
password | `string` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> account.encrypt('password')
   {version:3, id:..., address:..., crypto:...}
```

## PrivateKeyAccount.prototype.signTransaction <a id="account/PrivateKeyAccount.js/signTransaction"></a>

Sign a transaction.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|----------------------------------------------
options | `object` | true     |         | See [Transaction](Transaction.js/constructor)

* **Returns**

`Promise.<Transaction>` 

## PrivateKeyAccount.prototype.signMessage <a id="account/PrivateKeyAccount.js/signMessage"></a>

Sign a string.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
message | `string` | true     |         |

* **Returns**

`Promise.<Message>` 

* **Examples**

```
> const account = new PrivateKeyAccount(undefined, '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> const msg = account.signMessage('Hello World!')
> console.log(msg);
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```

----------------------------------------

## Conflux <a id="Conflux.js/Conflux"></a>

A sdk of conflux.

## Conflux.prototype.constructor <a id="Conflux.js/constructor"></a>

* **Parameters**

Name                    | Type            | Required | Default | Description
------------------------|-----------------|----------|---------|-------------------------------------------------------
options                 | `object`        | false    |         | Conflux and Provider constructor options.
options.defaultGasPrice | `string,number` | false    |         | The default gas price in drip to use for transactions.

* **Examples**

```
> const { Conflux } = require('js-conflux-sdk');
> const conflux = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
```

```
> const conflux = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
```

## ~~Conflux.prototype.defaultGasPrice~~ <a id="Conflux.js/defaultGasPrice"></a>

`number,string`

Default gas price for following methods:
- `Conflux.sendTransaction`

## Conflux.prototype.Account <a id="Conflux.js/Account"></a>

A shout cut for `accountFactory(options, conflux);`

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-------------------------------------------------------
options | `object` | true     |         | See [accountFactory](#account/index.js/accountFactory)

* **Returns**

`BaseAccount` account instance

* **Examples**

```
> account = conflux.Account({privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'})
```

## Conflux.prototype.Contract <a id="Conflux.js/Contract"></a>

A shout cut for `new Contract(options, conflux);`

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-----------------------------------------------------
options | `object` | true     |         | See [Contract.constructor](#Contract.js/constructor)

* **Returns**

`Contract` 

## Conflux.prototype.close <a id="Conflux.js/close"></a>

close connection.

* **Examples**

```
> conflux.close();
```

## Conflux.prototype.getStatus <a id="Conflux.js/getStatus"></a>

Get status

* **Returns**

`Promise.<object>` Status information object
- `number` chainId: Chain id
- `number` epochNumber: Epoch number
- `number` blockNumber: Block number
- `number` pendingTxNumber: Pending transaction number
- `string` bestHash: The block hash of best pivot block

## Conflux.prototype.getGasPrice <a id="Conflux.js/getGasPrice"></a>

Returns the current price per gas in Drip.

* **Returns**

`Promise.<JSBI>` Gas price in drip.

* **Examples**

```
> await conflux.getGasPrice();
   "0"
```

## Conflux.prototype.getInterestRate <a id="Conflux.js/getInterestRate"></a>

Returns the interest rate of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` The interest rate of given parameter.

## Conflux.prototype.getAccumulateInterestRate <a id="Conflux.js/getAccumulateInterestRate"></a>

Returns the accumulate interest rate of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` The accumulate interest rate of given parameter.

## Conflux.prototype.getAccount <a id="Conflux.js/getAccount"></a>

Return account related states of the given account

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | address to get account.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<object>` States of the given account:
balance `JSBI`: the balance of the account.
nonce `JSBI`: the nonce of the account's next transaction.
codeHash `string`: the code hash of the account.
stakingBalance `JSBI`: the staking balance of the account.
collateralForStorage `JSBI`: the collateral storage of the account.
accumulatedInterestReturn `JSBI`: accumulated unterest return of the account.
admin `string`: admin of the account.

## Conflux.prototype.getBalance <a id="Conflux.js/getBalance"></a>

Returns the balance of the account of given address.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | The address to get the balance of.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` The current balance in Drip.

* **Examples**

```
> await conflux.getBalance("0x1000000000000000000000000000000000000060");
   "0"
```

## Conflux.prototype.getStakingBalance <a id="Conflux.js/getStakingBalance"></a>

Returns the balance of the staking account of given address.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to check for staking balance.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` The current staking balance in Drip.

* **Examples**

```
> await conflux.getStakingBalance('0xc94770007dda54cF92009BFF0dE90c06F603a09f', 'latest_state');
   "158972490234375000"
```

## Conflux.prototype.getNextNonce <a id="Conflux.js/getNextNonce"></a>

Returns the next nonce should be used by given address.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|-----------------------------------------------------
address     | `string`        | true     |         | The address to get the numbers of transactions from.
epochNumber | `string,number` | false    |         | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` The next nonce should be used by given address.

* **Examples**

```
> await conflux.getNextNonce("0x1be45681ac6c53d5a40475f7526bac1fe7590fb8");
   "3"
```

## Conflux.prototype.getAdmin <a id="Conflux.js/getAdmin"></a>

Returns the admin of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<string>` Address to admin, or `null` if the contract does not exist.

* **Examples**

```
> conflux.getAdmin('0x8af71f222b6e05b47d8385fe437fe2f2a9ec1f1f')
   "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c"
```

## Conflux.prototype.getEpochNumber <a id="Conflux.js/getEpochNumber"></a>

Returns the epoch number of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<number>` integer of the current epoch number of given parameter.

* **Examples**

```
> await conflux.getEpochNumber();
   443
```

## Conflux.prototype.getBlockByEpochNumber <a id="Conflux.js/getBlockByEpochNumber"></a>

Returns information about a block by epoch number.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------------------------------------
epochNumber | `string,number` | true     |         | See [format.sendTx](#util/format.js/epochNumber)
detail      | `boolean`       | false    | false   | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

* **Returns**

`Promise.<(object|null)>` See `getBlockByHash`

* **Examples**

```
> await conflux.getBlockByEpochNumber('latest_mined', true);
   {...}
```

## Conflux.prototype.getBlocksByEpochNumber <a id="Conflux.js/getBlocksByEpochNumber"></a>

Returns hashes of blocks located in some epoch.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|-------------------------------------------------
epochNumber | `string,number` | true     |         | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<Array.<string>>` Array of block hashes, sorted by execution(topological) order.

* **Examples**

```
> await conflux.getBlocksByEpochNumber(0);
   ['0xe677ae5206a5d67d9efa183d867b4b986ed82a3e62174a1488cf8364d58534ec']
```

## Conflux.prototype.getBestBlockHash <a id="Conflux.js/getBestBlockHash"></a>

Returns the hash of best block.

* **Returns**

`Promise.<string>` hash of the best block.

* **Examples**

```
> await conflux.getBestBlockHash();
   "0xb8bb355bfeaf055a032d5b7df719917c090ee4fb6fee42383004dfe8911d7daf"
```

## Conflux.prototype.getBlockByHash <a id="Conflux.js/getBlockByHash"></a>

Returns information about a block by hash.

* **Parameters**

Name      | Type      | Required | Default | Description
----------|-----------|----------|---------|---------------------------------------------------------------------------------------------------
blockHash | `string`  | true     |         | hash of a block.
detail    | `boolean` | false    | false   | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

* **Returns**

`Promise.<(object|null)>` A block object, or null when no block was found:
- adaptive `boolean`: If `true` the weight of the block is adaptive under GHAST rule, if `false` otherwise.
- blame `number`: If 0, then no blocks are blamed on its parent path, If greater than 0, then the nearest blamed block on the parent path is blame steps away.
- deferredLogsBloomHash `string`: The bloom hash of deferred logs.
- deferredReceiptsRoot `string`: The hash of the receipts of the block after deferred execution.
- deferredStateRoot `string`: The root of the final state trie of the block after deferred execution.
- difficulty `string`: Integer string of the difficulty for this block.
- epochNumber `number|null`: The current block epoch number in the client's view. null when it's not in best block's past set and the epoch number is not determined.
- gasLimit `JSBI`: The maximum gas allowed in this block.
- hash `string|null`: Hash of the block. `null` when its pending block.
- height `number`: The block heights. `null` when its pending block.
- miner `string`: The address of the beneficiary to whom the mining rewards were given.
- nonce `string`: Hash of the generated proof-of-work. `null` when its pending block.
- parentHash `string`: Hash of the parent block.
- powQuality `string`:Hash of the generated proof-of-work. `null` when its pending block.
- refereeHashes `string[]`: Array of referee hashes.
- size `number`: Integer the size of this block in bytes.
- timestamp `number`: The unix timestamp for when the block was collated.
- transactions `string[]|object[]`: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
- transactionsRoot `string`: The hash of the transactions of the block.

* **Examples**

```
> await conflux.getBlockByHash('0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7');
   {
      "epochNumber": 455,
      "blame": 0,
      "height": 455,
      "size": 122,
      "timestamp": 1594912954,
      "gasLimit": "30000000",
      "difficulty": "30000",
      "transactions": [
        "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8"
      ],
      "adaptive": false,
      "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
      "deferredReceiptsRoot": "0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508",
      "deferredStateRoot": "0x2124f4f35df1abeb01a43ed25c6b7ea5a56bbc2bdb3ab3feb096e3911e522181",
      "hash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "miner": "0x100000000000000000000000000000000000007c",
      "nonce": "0xcc2eadd8c5c369ff",
      "parentHash": "0x9ced22205ac0fe96ad27be9c0add073ce49582220b8fd1006edf16a402aef9b4",
      "powQuality": "0x167d3",
      "refereeHashes": [],
      "transactionsRoot": "0x5a31184b86d8b88a3860649c17a4b7b4d3c7ef35fea971afb1f44081feff5b60"
    }
```

## Conflux.prototype.getConfirmationRiskByHash <a id="Conflux.js/getConfirmationRiskByHash"></a>

Get the risk of the block could be reverted.
All block in one same epoch returned same risk number

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|----------------
blockHash | `string` | true     |         | Hash of a block

* **Returns**

`Promise.<(number|null)>` Number >0 and <1

## Conflux.prototype.getTransactionByHash <a id="Conflux.js/getTransactionByHash"></a>

Returns the information about a transaction requested by transaction hash.

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|----------------------
transactionHash | `string` | true     |         | hash of a transaction

* **Returns**

`Promise.<(object|null)>` transaction object, or `null` when no transaction was found:
- blockHash `string`: hash of the block where this transaction was in and got executed. `null` when its pending.
- contractCreated `string|null`: address of created contract. `null` when it's not a contract creating transaction
- data `string`: the data send along with the transaction.
- epochHeight `number`: TODO
- from `string`: address of the sender.
- gas `JSBI`: gas provided by the sender.
- gasPrice `number`: gas price provided by the sender in Drip.
- hash `string`: hash of the transaction.
- nonce `JSBI`: the number of transactions made by the sender prior to this one.
- r `string`: ECDSA signature r
- s `string`: ECDSA signature s
- status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
- storageLimit `JSBI`: TODO
- chainId `number`: TODO
- to `string`: address of the receiver. null when its a contract creation transaction.
- transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
- v `string`: ECDSA recovery id
- value `JSBI`: value transferred in Drip.

* **Examples**

```
> await conflux.getTransactionByHash('0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8');
   {
      "nonce": "0",
      "value": "1000000000000000000000000000000000",
      "gasPrice": "3",
      "gas": "16777216",
      "v": 1,
      "transactionIndex": 0,
      "status": 0,
      "storageLimit": "65536",
      "chainId": 2,
      "epochHeight": 454,
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "data": "0x",
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "hash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8",
      "r": "0x85f6729aa1e709202318bd6746c4a232a379eaa4cd9c2ea24c7babdbd09085cd",
      "s": "0x7101e1e2ee4ddfcef8879358df0cb0792f34712116f100b76c8e9582625acd2f",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c"
   }
```

## Conflux.prototype.getTransactionReceipt <a id="Conflux.js/getTransactionReceipt"></a>

Returns the information about a transaction receipt requested by transaction hash.

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|----------------------
transactionHash | `string` | true     |         | Hash of a transaction

* **Returns**

`Promise.<(object|null)>` A transaction receipt object, or null when no transaction was found or the transaction was not executed yet:
- transactionHash `string`: Hash of the given transaction.
- index `number`: Transaction index within the block.
- blockHash `string`: Hash of the block where this transaction was in and got executed.
- epochNumber `number`: Epoch number of the block where this transaction was in and got executed.
- from `string`: Address of the sender.
- to `string`: Address of the receiver. `null` when its a contract creation transaction.
- gasUsed `number`: Gas used the transaction.
- contractCreated `string|null`: Address of created contract. `null` when it's not a contract creating transaction.
- stateRoot `string`: Hash of the state root.
- outcomeStatus `number`:  the outcome status code, 0 was successful, 1 EVM reverted the transaction.
- logsBloom `string`: Bloom filter for light clients to quickly retrieve related logs.
- logs `object[]`: Array of log objects, which this transaction generated.

* **Examples**

```
> await conflux.getTransactionReceipt('0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8');
   {
      "index": 0,
      "epochNumber": 455,
      "outcomeStatus": 0,
      "gasUsed": "21000",
      "gasFee": "37748736",
      "blockHash": "0x0909bdb39910d743e7e9b68f24afbbf187349447b161c4716bfd278fd7a0cbc7",
      "contractCreated": null,
      "from": "0x1be45681ac6c53d5a40475f7526bac1fe7590fb8",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "stateRoot": "0x19d109e6fe9f5a75cc54543af4beab08c0f23fdf95eea33b1afe5a9ef8b770dc",
      "to": "0x144aa8f554d2ffbc81e0aa0f533f76f5220db09c",
      "transactionHash": "0xe6b56ef6a2be1987b0353a316cb02c78493673c31adb847b947d47c3936d89a8"
    }
```

## Conflux.prototype.sendRawTransaction <a id="Conflux.js/sendRawTransaction"></a>

Creates new message call transaction or a contract creation for signed transactions.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|-----------------------------
hex  | `string,Buffer` | true     |         | The signed transaction data.

* **Returns**

`Promise.<PendingTransaction>` The transaction hash, or the zero hash if the transaction is not yet available.

* **Examples**

```
> await conflux.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
```

## Conflux.prototype.getCode <a id="Conflux.js/getCode"></a>

Returns the code of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<string>` Byte code of contract, or 0x if the contract does not exist.

* **Examples**

```
> await conflux.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```

## Conflux.prototype.getStorageAt <a id="Conflux.js/getStorageAt"></a>

Returns storage entries from a given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to contract.
position    | `string`        | true     |                | The given position.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<string>` Storage entry of given query, or null if the it does not exist.

## Conflux.prototype.getStorageRoot <a id="Conflux.js/getStorageRoot"></a>

Returns the storage root of a given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<object>` A storage root object, or `null` if the contract does not exist
- delta `string`: storage root in the delta trie.
- intermediate `string`: storage root in the intermediate trie.
- snapshot `string`: storage root in the snapshot.

## Conflux.prototype.getSponsorInfo <a id="Conflux.js/getSponsorInfo"></a>

Returns the sponsor info of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<object>` A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
- sponsorBalanceForCollateral `JSBI`: the sponsored balance for storage.
- sponsorBalanceForGas `JSBI`: the sponsored balance for gas.
- sponsorGasBound `JSBI`: the max gas could be sponsored for one transaction.
- sponsorForCollateral `string`: the address of the storage sponsor.
- sponsorForGas `string`: the address of the gas sponsor.

## Conflux.prototype.getCollateralForStorage <a id="Conflux.js/getCollateralForStorage"></a>

Returns the size of the collateral storage of given address, in Byte.

* **Parameters**

Name        | Type     | Required | Default        | Description
------------|----------|----------|----------------|-------------------------------------------------
address     | `string` | true     |                | Address to check for collateral storage.
epochNumber |          | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<JSBI>` - The collateral storage in Byte.

* **Examples**

```
> await conflux.getCollateralForStorage('0xc94770007dda54cf92009bff0de90c06f603a09f')
   "158972490234375000"
```

## Conflux.prototype.call <a id="Conflux.js/call"></a>

Virtually call a contract, return the output data.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|-------------------------------------------------
options     | `object`        | true     |                | See [format.sendTx](#util/format.js/sendTx)
epochNumber | `string,number` | false    | 'latest_state' | See [format.sendTx](#util/format.js/epochNumber)

* **Returns**

`Promise.<string>` The output data.

## Conflux.prototype.estimateGasAndCollateral <a id="Conflux.js/estimateGasAndCollateral"></a>

Virtually call a contract, return the estimate gas used and storage collateralized.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|----------------------------------------------------
options | `object` | true     |         | See [format.estimateTx](#util/format.js/estimateTx)

* **Returns**

`Promise.<object>` A estimate result object:
- `BigInt` gasUsed: The gas used.
- `BigInt` storageCollateralized: The storage collateralized in Byte.

## Conflux.prototype.getLogs <a id="Conflux.js/getLogs"></a>

Returns logs matching the filter provided.

* **Parameters**

Name                | Type                    | Required | Default             | Description
--------------------|-------------------------|----------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options             | `object`                | false    |                     |
options.fromEpoch   | `string,number`         | false    | 'latest_checkpoint' | See [format.sendTx](#util/format.js/epochNumber). Search will be applied from this epoch number.
options.toEpoch     | `string,number`         | false    | 'latest_state'      | See [format.sendTx](#util/format.js/epochNumber). Search will be applied up until (and including) this epoch number.
options.blockHashes | `Array.<string>`        | false    |                     | Array of up to 128 block hashes that the search will be applied to. This will override from/to epoch fields if it's not null
options.address     | `string,Array.<string>` | false    |                     | Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
options.topics      | `array`                 | false    |                     | Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.
options.limit       | `number`                | false    |                     | Return the last limit logs

* **Returns**

`Promise.<Array.<object>>` Array of log, that the logs matching the filter provided:
- address `string`: Address this event originated from.
- topics `string[]`: Array of topics.
- data `string`: The data containing non-indexed log parameter.
- blockHash `string`: Hash of the block where the log in.
- epochNumber `number`: Epoch number of the block where the log in.
- transactionHash `string`: Hash of the transaction where the log in.
- transactionIndex `string`: Transaction index in the block.
- logIndex `number`: Log index in block.
- transactionLogIndex `number`: Log index in transaction.

* **Examples**

```
> await conflux.getLogs({
      address: '0x866aca87ff33a0ae05d2164b3d999a804f583222',
      fromEpoch: 0,
      toEpoch: 'latest_mined',
      limit: 1,
      topics: ['0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153']
    });
   [
   {
        "address": "0x866aca87ff33a0ae05d2164b3d999a804f583222",
        "blockHash": "0x0ecbc75aca22cd1566a18c6a7a55f235ae12684c2749b40ac91262d6e8783b0b",
        "data": "0x",
        "epochNumber": 1504,
        "logIndex": 2,
        "topics": [
          "0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153",
          "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c",
          "0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b",
          "0x000000000000000000000000873c4bd4d847bcf7dc066bf4a7cd31dcf182258c"
        ],
        "transactionHash": "0x2a696f7be50c364333bc145f082e79da3a6e730318b7f7822e3e1fe22e42560b",
        "transactionIndex": 0,
        "transactionLogIndex": 2
      }
   ]
```

----------------------------------------

## Contract <a id="contract/Contract.js/Contract"></a>

Contract with all its methods and events defined in its abi.

## Contract.prototype.constructor <a id="contract/Contract.js/constructor"></a>

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------------------------------------------------------------------
options          | `object`  | true     |         |
options.abi      | `array`   | true     |         | The json interface for the contract to instantiate
options.address  | `string`  | false    |         | The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
options.bytecode | `string`  | false    |         | The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
conflux          | `Conflux` | true     |         | Conflux instance.

* **Returns**

`object` 

* **Examples**

```
> const contract = conflux.Contract({ abi, bytecode });
> contract.constructor.bytecode; // input code
   "0x6080604052600080..."
```

```
> const contract = conflux.Contract({ abi, address });
> contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"
> await contract.count(); // call a method without parameter, get decoded return value.
   "100"
> await contract.inc(1); // call a method with parameters, get decoded return value.
   "101"
> await contract.count().options({ from: account }); // call a method from a account.
   "100"
> transaction = await conflux.getTransactionByHash('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
> await contract.abi.decodeData(transaction.data)
   {
      name: 'inc',
      fullName: 'inc(uint256 num)',
      type: 'inc(uint256)',
      signature: '0x7f98a45e',
      array: [ JSBI.BigInt(101) ],
      object: { num: JSBI.BigInt(101) }
   }
> await contract.count(); // data in block chain changed by transaction.
   JSBI.BigInt(101)
> receipt = await conflux.getTransactionReceipt('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
> contract.abi.decodeLog(receipt.logs[0]);
   {
      name: 'SelfEvent',
      fullName: 'SelfEvent(address indexed sender, uint256 current)',
      type: 'SelfEvent(address,uint256))',
      signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      array: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', JSBI.BigInt(100) ],
      object: {
        sender: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        current: JSBI.BigInt(100),
      },
    }
```

----------------------------------------

## Message <a id="Message.js/Message"></a>



## Message.sign <a id="Message.js/sign"></a>

Signs the hash with the privateKey.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
privateKey  | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **Returns**

`string` The signature as hex string.

* **Examples**

```
> Message.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
```

## Message.recover <a id="Message.js/recover"></a>

Recovers the signers publicKey from the signature.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
signature   | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **Returns**

`string` The publicKey as hex string.

* **Examples**

```
> Message.recover(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
```

## Message.prototype.constructor <a id="Message.js/constructor"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
message | `string` | true     |         |

* **Returns**

`Message` 

* **Examples**

```
> msg = new Message('Hello World');
   Message {
      message: 'Hello World',
    }
> msg.sign('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
> msg.signature
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
> msg.hash
   "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"
> msg.from
   "0x1cad0b19bb29d4674531d6f115237e16afce377c"
> msg.r
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c"
> msg.s
   "0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f"
> msg.v
   1
```

## Message.prototype.hash (getter) <a id="Message.js/hash (getter)"></a>

Getter of message hash include signature.

> Note: calculate every time.

* **Returns**

`string` 

## Message.prototype.from (getter) <a id="Message.js/from (getter)"></a>

Getter of sender address.

> Note: calculate every time.

* **Returns**

`string,undefined` If ECDSA recover success return address, else return undefined.

## Message.prototype.sign <a id="Message.js/sign"></a>

Sign message and set 'r','s','v' and 'hash'.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | Private key hex string.

* **Returns**

`Message` 

----------------------------------------

## BaseProvider <a id="provider/BaseProvider.js/BaseProvider"></a>



## BaseProvider.prototype.constructor <a id="provider/BaseProvider.js/constructor"></a>

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|-------------------------------
options         | `object` | false    |         |
options.url     | `string` | true     |         | Full json rpc http url
options.timeout | `number` | false    | 60*1000 | Request time out in ms
options.logger  | `object` | false    |         | Logger with `info` and `error`

* **Returns**

`BaseProvider` 

## BaseProvider.prototype.requestId <a id="provider/BaseProvider.js/requestId"></a>

Gen a random json rpc id.
It is used in `call` method, overwrite it to gen your own id.

* **Returns**

`string` 

----------------------------------------

## HttpProvider <a id="provider/HttpProvider.js/HttpProvider"></a>

Http protocol json rpc provider.

## HttpProvider.prototype.call <a id="provider/HttpProvider.js/call"></a>

Call a json rpc method with params

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------------------
method    | `string` | true     |         | Json rpc method name.
...params | `array`  | false    |         | Json rpc method params.

* **Returns**

`Promise.<*>` Json rpc method return value.

* **Examples**

```
> await provider.call('cfx_epochNumber');
> await provider.call('cfx_getBlockByHash', blockHash);
```

----------------------------------------

## providerFactory <a id="provider/index.js/providerFactory"></a>

* **Parameters**

Name        | Type     | Required | Default | Description
------------|----------|----------|---------|------------
options     | `object` | true     |         |
options.url | `string` | true     |         |

* **Returns**

`HttpProvider,BaseProvider` 

* **Examples**

```
> providerFactory()
 BaseProvider {
    url: undefined,
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
```

```
> providerFactory({ url: 'http://localhost:12537' })
 HttpProvider {
    url: 'http://localhost:12537',
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
> providerFactory({
    url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
    timeout: 60 * 60 * 1000,
    logger: console,
  }
 HttpProvider {
    url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
    timeout: 3600000,
    logger: {...}
  }
```

----------------------------------------

## Transaction <a id="Transaction.js/Transaction"></a>



## Transaction.prototype.constructor <a id="Transaction.js/constructor"></a>

Create a transaction.

* **Parameters**

Name                 | Type            | Required | Default | Description
---------------------|-----------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options              | `object`        | true     |         |
options.from         | `string`        | true     |         | The sender address.
options.nonce        | `string,number` | true     |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice     | `string,number` | true     |         | The price of gas for this transaction in drip.
options.gas          | `string,number` | true     |         | The amount of gas to use for the transaction (unused gas is refunded).
options.to           | `string`        | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value        | `string,number` | false    | 0       | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.storageLimit | `string,number` | true     |         | TODO
options.epochHeight  | `string,number` | true     |         | TODO
options.chainId      | `string,number` | false    | 0       | TODO
options.data         | `string,Buffer` | false    | '0x'    | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r            | `string,Buffer` | false    |         | ECDSA signature r
options.s            | `string,Buffer` | false    |         | ECDSA signature s
options.v            | `number`        | false    |         | ECDSA recovery id

* **Returns**

`Transaction` 

## Transaction.prototype.hash (getter) <a id="Transaction.js/hash (getter)"></a>

Getter of transaction hash include signature.

> Note: calculate every time.

* **Returns**

`string,undefined` If transaction has r,s,v return hex string, else return undefined.

## Transaction.prototype.sign <a id="Transaction.js/sign"></a>

Sign transaction and set 'r','s','v'.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | Private key hex string.

* **Returns**

`Transaction` 

## Transaction.prototype.recover <a id="Transaction.js/recover"></a>

Recover public key from signed Transaction.

* **Returns**

`string` 

## Transaction.prototype.encode <a id="Transaction.js/encode"></a>

Encode rlp.

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------
includeSignature | `boolean` | false    | false   | Whether or not to include the signature.

* **Returns**

`Buffer` 

## Transaction.prototype.serialize <a id="Transaction.js/serialize"></a>

Get the raw transaction hex string.

* **Returns**

`string` Hex string

----------------------------------------

## format.any <a id="util/format.js/any"></a>

* **Parameters**

Name | Type  | Required | Default | Description
-----|-------|----------|---------|------------
arg  | `any` | true     |         |

* **Returns**

`any` arg

* **Examples**

```
> format.any(1)
 1
```

## format.hex <a id="util/format.js/hex"></a>

When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

* **Parameters**

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | `number,JSBI,string,Buffer,boolean,null` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.hex(null)
 '0x'
> format.hex(1)
 "0x01"
> format.hex(256)
 "0x0100"
> format.hex(true)
 "0x01"
> format.hex(Buffer.from([1,10,255]))
 "0x010aff"
> format.hex("0x0a")
 "0x0a"
```

## format.uInt <a id="util/format.js/uInt"></a>

* **Parameters**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
> format.uInt(-3.14)
 Error("cannot be converted to a JSBI")
> format.uInt(null)
 Error("Cannot convert null to a JSBI")
> format.uInt('0')
 0
> format.uInt(1)
 1
> format.uInt(JSBI(100))
 100
> format.uInt('0x10')
 16
> format.uInt('')
 0
> format.uInt(true)
 1
> format.uInt(false)
 0
> format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.bigInt <a id="util/format.js/bigInt"></a>

* **Parameters**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **Returns**

`JSBI` 

* **Examples**

```
> format.bigInt(-3.14)
 Error("not match bigInt")
> format.bigInt('0.0')
 JSBI.BigInt(0)
> format.bigInt('-1')
 JSBI.BigInt(-1)
> format.bigInt(1)
 JSBI.BigInt(1)
> format.bigInt(JSBI(100))
 JSBI.BigInt(100)
> format.bigInt('0x10')
 JSBI.BigInt(16)
> format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.bigUInt <a id="util/format.js/bigUInt"></a>

* **Parameters**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **Returns**

`JSBI` 

* **Examples**

```
> format.bigUInt('0.0')
 JSBI.BigInt(0)
> format.bigUInt('-1')
 Error("not match bigUInt")
```

## format.hexUInt <a id="util/format.js/hexUInt"></a>

When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

* **Parameters**

Name | Type                    | Required | Default | Description
-----|-------------------------|----------|---------|------------
arg  | `number,string,boolean` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.hexUInt(100)
 "0x64"
> format.hexUInt(10)
 "0xa"
> format.hexUInt(3.50)
 "0x4"
> format.hexUInt(3.49)
 "0x3"
> format.hexUInt(-1))
 Error("not match uintHex")
```

## format.riskNumber <a id="util/format.js/riskNumber"></a>

* **Parameters**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
hex  | `string` | true     |         |

* **Returns**

`number` 

* **Examples**

```
> format.riskNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
> format.riskNumber('0xe666666666666666666666666666666666666666666666666666666666666665')
 0.9
```

## format.epochNumber <a id="util/format.js/epochNumber"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|-----------------------------------------------------
arg  | `number,string` | true     |         | number or string in ['latest_state', 'latest_mined']

* **Returns**

`string` 

* **Examples**

```
> format.epochNumber(10)
 "0xa"
> format.epochNumber('latest_state')
 "latest_state"
> format.epochNumber('latest_mined')
 "latest_state"
```

## format.address <a id="util/format.js/address"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
```

## format.publicKey <a id="util/format.js/publicKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
```

## format.privateKey <a id="util/format.js/privateKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.signature <a id="util/format.js/signature"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

## format.blockHash <a id="util/format.js/blockHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.transactionHash <a id="util/format.js/transactionHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.buffer <a id="util/format.js/buffer"></a>

* **Parameters**

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | `number,JSBI,string,Buffer,boolean,null` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.buffer(Buffer.from([0, 1]))
 <Buffer 00 01>
> format.buffer(null)
 <Buffer >
> format.buffer(1024)
 <Buffer 04 00>
> format.buffer('0x0a')
 <Buffer 0a>
> format.buffer(true)
 <Buffer 01>
> format.buffer(3.14)
 Error("not match hex")
```

## format.bytes <a id="util/format.js/bytes"></a>

* **Parameters**

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|------------
arg  | `string,Buffer,array` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.bytes('abcd')
 <Buffer 61 62 63 64>
> format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
> format.bytes([0, 1])
 <Buffer 00 01>
```

## format.boolean <a id="util/format.js/boolean"></a>

* **Parameters**

Name | Type      | Required | Default | Description
-----|-----------|----------|---------|------------
arg  | `boolean` | true     |         |

* **Returns**

`boolean` 

* **Examples**

```
> format.boolean(true)
 true
> format.boolean(false)
 false
```

----------------------------------------

## sha3 <a id="util/sign.js/sha3"></a>

alias of keccak256

* **Parameters**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|------------
buffer | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> sha3(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

----------------------------------------

## checksumAddress <a id="util/sign.js/checksumAddress"></a>

Makes a checksum address

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         | Hex string

* **Returns**

`string` 

* **Examples**

```
> checksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
 "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
```

----------------------------------------

## randomBuffer <a id="util/sign.js/randomBuffer"></a>

gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

* **Parameters**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
size | `number` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```

----------------------------------------

## randomPrivateKey <a id="util/sign.js/randomPrivateKey"></a>

Gen a random PrivateKey buffer.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
entropy | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

----------------------------------------

## privateKeyToPublicKey <a id="util/sign.js/privateKeyToPublicKey"></a>

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

----------------------------------------

## publicKeyToAddress <a id="util/sign.js/publicKeyToAddress"></a>

Get account address by public key.

> Account address hex starts with '0x1'

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
publicKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

----------------------------------------

## privateKeyToAddress <a id="util/sign.js/privateKeyToAddress"></a>

Get address by private key.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

## ecdsaSign <a id="util/sign.js/ecdsaSign"></a>

Sign ecdsa

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
hash       | `Buffer` | true     |         |
privateKey | `Buffer` | true     |         |

* **Returns**

`object` ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```

----------------------------------------

## ecdsaRecover <a id="util/sign.js/ecdsaRecover"></a>

Recover ecdsa

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
hash      | `Buffer` | true     |         |
options   | `object` | true     |         |
options.r | `Buffer` | true     |         |
options.s | `Buffer` | true     |         |
options.v | `number` | true     |         |

* **Returns**

`Buffer` publicKey

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

## encrypt <a id="util/sign.js/encrypt"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
privateKey | `Buffer`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
> encrypt(Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'), 'password')
 {
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
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
```

----------------------------------------

## decrypt <a id="util/sign.js/decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
keystoreV3 | `object`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`Buffer` Buffer of private key

* **Examples**

```
> decrypt({
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
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
 <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef>
```

----------------------------------------

## unit <a id="util/unit.js/unit"></a>

Unit converter factory

* **Parameters**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|---------------------------------
from | `string` | true     |         | Enum in ['CFX', 'GDrip', 'Drip']
to   | `string` | true     |         | Enum in ['CFX', 'GDrip', 'Drip']

* **Returns**

`string` 

* **Examples**

```
> unit('CFX', 'Drip')(1)
 "1000000000000000000"
> unit('Drip', 'CFX')(1000000000000000000)
 "1"
```

```
> unit.fromCFXToGDrip(123)
 "123000000000"
```

```
> fromCFXToDrip(123)
 "123000000000000000000"
```

```
> fromGDripToCFX(123000000000)
 "123"
```

```
> fromGDripToDrip(123)
 "123000000000"
```

```
> fromDripToCFX(123000000000000000000)
 "123"
```

```
> fromDripToGDrip(123000000000)
 "123"
```
