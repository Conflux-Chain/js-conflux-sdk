---
id: javascript_sdk
title: Javascript SDK
custom_edit_url: https://github.com/Conflux-Chain/js-conflux-sdk/edit/master/docs/api.md
keywords:
  - conflux
  - javascript
  - sdk
---

- CONST.js
    - [EPOCH_NUMBER](#CONST.js/EPOCH_NUMBER)
    - [MIN_GAS_PRICE](#CONST.js/MIN_GAS_PRICE)
    - [TRANSACTION_GAS](#CONST.js/TRANSACTION_GAS)
    - [TRANSACTION_STORAGE_LIMIT](#CONST.js/TRANSACTION_STORAGE_LIMIT)
    - [MAINNET_ID](#CONST.js/MAINNET_ID)
    - [TESTNET_ID](#CONST.js/TESTNET_ID)
- Conflux.js
    - Conflux
        - [**constructor**](#Conflux.js/Conflux/**constructor**)
        - [provider](#Conflux.js/Conflux/provider)
        - [wallet](#Conflux.js/Conflux/wallet)
        - [defaultGasPrice](#Conflux.js/Conflux/defaultGasPrice)
        - [defaultGasRatio](#Conflux.js/Conflux/defaultGasRatio)
        - [defaultStorageRatio](#Conflux.js/Conflux/defaultStorageRatio)
        - [Contract](#Conflux.js/Conflux/Contract)
        - [InternalContract](#Conflux.js/Conflux/InternalContract)
        - [close](#Conflux.js/Conflux/close)
        - [updateNetworkId](#Conflux.js/Conflux/updateNetworkId)
        - [getSupplyInfo](#Conflux.js/Conflux/getSupplyInfo)
        - [getStatus](#Conflux.js/Conflux/getStatus)
        - [getGasPrice](#Conflux.js/Conflux/getGasPrice)
        - [getInterestRate](#Conflux.js/Conflux/getInterestRate)
        - [getAccumulateInterestRate](#Conflux.js/Conflux/getAccumulateInterestRate)
        - [getAccount](#Conflux.js/Conflux/getAccount)
        - [getBalance](#Conflux.js/Conflux/getBalance)
        - [getStakingBalance](#Conflux.js/Conflux/getStakingBalance)
        - [getNextNonce](#Conflux.js/Conflux/getNextNonce)
        - [getAdmin](#Conflux.js/Conflux/getAdmin)
        - [getVoteList](#Conflux.js/Conflux/getVoteList)
        - [getDepositList](#Conflux.js/Conflux/getDepositList)
        - [getEpochNumber](#Conflux.js/Conflux/getEpochNumber)
        - [getBlockByEpochNumber](#Conflux.js/Conflux/getBlockByEpochNumber)
        - [getBlocksByEpochNumber](#Conflux.js/Conflux/getBlocksByEpochNumber)
        - [getBestBlockHash](#Conflux.js/Conflux/getBestBlockHash)
        - [getBlockByHash](#Conflux.js/Conflux/getBlockByHash)
        - [getConfirmationRiskByHash](#Conflux.js/Conflux/getConfirmationRiskByHash)
        - [getTransactionByHash](#Conflux.js/Conflux/getTransactionByHash)
        - [getTransactionReceipt](#Conflux.js/Conflux/getTransactionReceipt)
        - [sendRawTransaction](#Conflux.js/Conflux/sendRawTransaction)
        - [sendTransaction](#Conflux.js/Conflux/sendTransaction)
        - [getCode](#Conflux.js/Conflux/getCode)
        - [getStorageAt](#Conflux.js/Conflux/getStorageAt)
        - [getStorageRoot](#Conflux.js/Conflux/getStorageRoot)
        - [getSponsorInfo](#Conflux.js/Conflux/getSponsorInfo)
        - [getCollateralForStorage](#Conflux.js/Conflux/getCollateralForStorage)
        - [call](#Conflux.js/Conflux/call)
        - [estimateGasAndCollateral](#Conflux.js/Conflux/estimateGasAndCollateral)
        - [getLogs](#Conflux.js/Conflux/getLogs)
        - [traceBlock](#Conflux.js/Conflux/traceBlock)
        - [subscribe](#Conflux.js/Conflux/subscribe)
        - [subscribeEpochs](#Conflux.js/Conflux/subscribeEpochs)
        - [subscribeNewHeads](#Conflux.js/Conflux/subscribeNewHeads)
        - [subscribeLogs](#Conflux.js/Conflux/subscribeLogs)
        - [unsubscribe](#Conflux.js/Conflux/unsubscribe)
- Drip.js
    - Drip
        - [(static)fromCFX](#Drip.js/Drip/(static)fromCFX)
        - [(static)fromGDrip](#Drip.js/Drip/(static)fromGDrip)
        - [**constructor**](#Drip.js/Drip/**constructor**)
        - [toCFX](#Drip.js/Drip/toCFX)
        - [toGDrip](#Drip.js/Drip/toGDrip)
- Message.js
    - Message
        - [(static)sign](#Message.js/Message/(static)sign)
        - [(static)recover](#Message.js/Message/(static)recover)
        - [**constructor**](#Message.js/Message/**constructor**)
        - [hash(getter)](#Message.js/Message/hash(getter))
        - [from(getter)](#Message.js/Message/from(getter))
        - [sign](#Message.js/Message/sign)
- Transaction.js
    - Transaction
        - [**constructor**](#Transaction.js/Transaction/**constructor**)
        - [hash(getter)](#Transaction.js/Transaction/hash(getter))
        - [sign](#Transaction.js/Transaction/sign)
        - [recover](#Transaction.js/Transaction/recover)
        - [encode](#Transaction.js/Transaction/encode)
        - [serialize](#Transaction.js/Transaction/serialize)
- contract
    - Contract.js
        - Contract
            - [**constructor**](#contract/Contract.js/Contract/**constructor**)
- provider
    - BaseProvider.js
        - BaseProvider
            - [**constructor**](#provider/BaseProvider.js/BaseProvider/**constructor**)
            - [requestId](#provider/BaseProvider.js/BaseProvider/requestId)
            - [call](#provider/BaseProvider.js/BaseProvider/call)
            - [batch](#provider/BaseProvider.js/BaseProvider/batch)
    - HttpProvider.js
        - [HttpProvider](#provider/HttpProvider.js/HttpProvider)
    - WebSocketProvider.js
        - WebSocketProvider
            - [**constructor**](#provider/WebSocketProvider.js/WebSocketProvider/**constructor**)
    - index.js
        - [providerFactory](#provider/index.js/providerFactory)
- subscribe
    - PendingTransaction.js
        - PendingTransaction
            - [get](#subscribe/PendingTransaction.js/PendingTransaction/get)
            - [mined](#subscribe/PendingTransaction.js/PendingTransaction/mined)
            - [executed](#subscribe/PendingTransaction.js/PendingTransaction/executed)
            - [confirmed](#subscribe/PendingTransaction.js/PendingTransaction/confirmed)
    - Subscription.js
        - [Subscription](#subscribe/Subscription.js/Subscription)
- util
    - format.js
        - format
            - [(static)any](#util/format.js/format/(static)any)
            - [(static)uInt](#util/format.js/format/(static)uInt)
            - [(static)bigInt](#util/format.js/format/(static)bigInt)
            - [(static)bigUInt](#util/format.js/format/(static)bigUInt)
            - [(static)bigUIntHex](#util/format.js/format/(static)bigUIntHex)
            - [(static)big](#util/format.js/format/(static)big)
            - [(static)fixed64](#util/format.js/format/(static)fixed64)
            - [(static)epochNumber](#util/format.js/format/(static)epochNumber)
            - [(static)hex](#util/format.js/format/(static)hex)
            - [(static)address](#util/format.js/format/(static)address)
            - [(static)hexAddress](#util/format.js/format/(static)hexAddress)
            - [(static)checksumAddress](#util/format.js/format/(static)checksumAddress)
            - [(static)blockHash](#util/format.js/format/(static)blockHash)
            - [(static)transactionHash](#util/format.js/format/(static)transactionHash)
            - [(static)privateKey](#util/format.js/format/(static)privateKey)
            - [(static)publicKey](#util/format.js/format/(static)publicKey)
            - [(static)hexBuffer](#util/format.js/format/(static)hexBuffer)
            - [(static)bytes](#util/format.js/format/(static)bytes)
            - [(static)boolean](#util/format.js/format/(static)boolean)
            - [(static)keccak256](#util/format.js/format/(static)keccak256)
    - sign.js
        - [keccak256](#util/sign.js/keccak256)
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
- wallet
    - PrivateKeyAccount.js
        - PrivateKeyAccount
            - [(static)random](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random)
            - [(static)decrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt)
            - [**constructor**](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**)
            - [encrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt)
            - [signTransaction](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction)
            - [signMessage](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage)
    - Wallet.js
        - Wallet
            - [has](#wallet/Wallet.js/Wallet/has)
            - [delete](#wallet/Wallet.js/Wallet/delete)
            - [clear](#wallet/Wallet.js/Wallet/clear)
            - [set](#wallet/Wallet.js/Wallet/set)
            - [get](#wallet/Wallet.js/Wallet/get)
            - [addPrivateKey](#wallet/Wallet.js/Wallet/addPrivateKey)
            - [addRandom](#wallet/Wallet.js/Wallet/addRandom)
            - [addKeystore](#wallet/Wallet.js/Wallet/addKeystore)

----------------------------------------

## EPOCH_NUMBER <a id="CONST.js/EPOCH_NUMBER"></a>

epochNumber label

- `LATEST_MINED` 'latest_mined': latest epoch.
- `LATEST_STATE` 'latest_state': latest state, about 5 epoch less then `LATEST_MINED`
- `LATEST_CONFIRMED` 'latest_confirmed': latest epoch which confirmation risk less 1e-8.
- `LATEST_CHECKPOINT` 'latest_checkpoint': latest check point epoch.
- `EARLIEST` 'earliest': earliest epoch number, same as 0.

----------------------------------------

## MIN_GAS_PRICE <a id="CONST.js/MIN_GAS_PRICE"></a>

`number`

min gas price for transaction

* **Examples**

```
> CONST.MIN_GAS_PRICE
 1
```

----------------------------------------

## TRANSACTION_GAS <a id="CONST.js/TRANSACTION_GAS"></a>

`number`

gas use for pure transfer transaction

* **Examples**

```
> CONST.TRANSACTION_GAS
 21000
```

----------------------------------------

## TRANSACTION_STORAGE_LIMIT <a id="CONST.js/TRANSACTION_STORAGE_LIMIT"></a>

`number`

storage limit for pure transfer transaction

----------------------------------------

## MAINNET_ID <a id="CONST.js/MAINNET_ID"></a>

`number`

mainnet chainId

----------------------------------------

## TESTNET_ID <a id="CONST.js/TESTNET_ID"></a>

`number`

testnet chainId

----------------------------------------

## Conflux <a id="Conflux.js/Conflux"></a>

A sdk of conflux.

### Conflux.prototype.**constructor** <a id="Conflux.js/Conflux/**constructor**"></a>

* **Parameters**

Name                        | Type            | Required | Default | Description
----------------------------|-----------------|----------|---------|-------------------------------------------------------
options                     | `object`        | false    |         | Conflux and Provider constructor options.
options.defaultGasPrice     | `string,number` | false    |         | The default gas price in drip to use for transactions.
options.defaultGasRatio     | `number`        | false    | 1.1     | The ratio to multiply by gas.
options.defaultStorageRatio | `number`        | false    | 1.1     | The ratio to multiply by storageLimit.
options.url                 | `string`        | false    |         | Url of Conflux node to connect.
options.timeout             | `number`        | false    |         | Request time out in ms
options.logger              | `Object`        | false    |         | Logger object with 'info' and 'error' method.

* **Examples**

```
> const { Conflux } = require('js-conflux-sdk');
> const conflux = new Conflux({url:'http://test.confluxrpc.org', networkId: 1});
```

```
> const conflux = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
```

### Conflux.prototype.provider <a id="Conflux.js/Conflux/provider"></a>

`WebsocketProvider,HttpProvider,BaseProvider`

Provider for rpc call

### Conflux.prototype.wallet <a id="Conflux.js/Conflux/wallet"></a>

`Wallet`

Wallet for `sendTransaction` to get `Account` by `from` field

### ~~Conflux.prototype.defaultGasPrice~~ <a id="Conflux.js/Conflux/defaultGasPrice"></a>

`number,string`

Default gas price for following methods:
- `Conflux.sendTransaction`

### Conflux.prototype.defaultGasRatio <a id="Conflux.js/Conflux/defaultGasRatio"></a>

`number`

If transaction.gas is undefined, gas will be set by estimate,
cause gas used might be change during `estimateGasAndCollateral` and `sendTransaction`,
estimate value need to multiply by defaultGasRatio (>1.0) in case of gas not enough.

> transaction.gas = estimate.gasUsed * defaultGasRatio

Default gas price for following methods:
- `Conflux.sendTransaction`

### Conflux.prototype.defaultStorageRatio <a id="Conflux.js/Conflux/defaultStorageRatio"></a>

`number`

If transaction.storageLimit is undefined, storageLimit will be set by estimate,
cause storage limit might be change during `estimateGasAndCollateral` and `sendTransaction`,
estimate value need to multiply by defaultStorageRatio (>1.0) in case of storageLimit not enough.

> transaction.storageLimit = estimate.storageCollateralized * defaultStorageRatio

Default gas price for following methods:
- `Conflux.sendTransaction`

### Conflux.prototype.Contract <a id="Conflux.js/Conflux/Contract"></a>

A shout cut for `new Contract(options, conflux);`

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-----------------------------------------------------
options | `object` | true     |         | See [Contract.constructor](#Contract.js/constructor)

* **Returns**

`Contract` - A Contract instance

### Conflux.prototype.InternalContract <a id="Conflux.js/Conflux/InternalContract"></a>

Create internal contract by default abi and address

- [AdminControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/AdminControl.sol)
- [SponsorWhitelistControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/SponsorWhitelistControl.sol)
- [Staking](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/Staking.sol)

* **Parameters**

Name | Type                                                 | Required | Default | Description
-----|------------------------------------------------------|----------|---------|-----------------------
name | `"AdminControl","SponsorWhitelistControl","Staking"` | true     |         | Internal contract name

* **Returns**

`Contract` 

* **Examples**

```
> conflux.InternalContract('AdminControl')
   {
    constructor: [Function: bound call],
    abi: ContractABI { * },
    address: '0x0888000000000000000000000000000000000000',
    destroy: [Function: bound call],
    getAdmin: [Function: bound call],
    setAdmin: [Function: bound call],
    'destroy(address)': [Function: bound call],
    '0x00f55d9d': [Function: bound call],
    'getAdmin(address)': [Function: bound call],
    '0x64efb22b': [Function: bound call],
    'setAdmin(address,address)': [Function: bound call],
    '0xc55b6bb7': [Function: bound call]
  }
```

### Conflux.prototype.close <a id="Conflux.js/Conflux/close"></a>

close connection.

* **Examples**

```
> conflux.close();
```

### Conflux.prototype.updateNetworkId <a id="Conflux.js/Conflux/updateNetworkId"></a>

Update conflux networkId from RPC

### Conflux.prototype.getSupplyInfo <a id="Conflux.js/Conflux/getSupplyInfo"></a>

Get supply info

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` Return supply info
- totalIssued `BigInt`: Total issued balance in `Drip`
- totalStaking `BigInt`: Total staking balance in `Drip`
- totalCollateral `BigInt`: Total collateral balance in `Drip`

* **Examples**

```
> await conflux.getSupplyInfo()
   {
     totalCirculating: 28953062500000000000000n,  
     totalCollateral: 28953062500000000000000n,
     totalIssued: 5033319899279074765657343554n,
     totalStaking: 25026010834970490328077641n
   }
```

### Conflux.prototype.getStatus <a id="Conflux.js/Conflux/getStatus"></a>

Get status

* **Returns**

`Promise.<object>` Status information object
- chainId `number`: Chain id
- epochNumber `number`: Epoch number
- blockNumber `number`: Block number
- pendingTxNumber `number`: Pending transaction number
- bestHash `string`: The block hash of best pivot block

* **Examples**

```
> await conflux.getStatus()
   {
      chainId: 1029,
      networkId: 1029,
      epochNumber: 1117476,
      blockNumber: 2230973,
      pendingTxNumber: 4531,
      bestHash: '0x8d581f13fa0548f2751450a7dabd871777875c9ccdf0d8bd629e07a7a5a7917a'
   }
```

### Conflux.prototype.getGasPrice <a id="Conflux.js/Conflux/getGasPrice"></a>

Returns the current price per gas in Drip.

* **Returns**

`Promise.<BigInt>` Gas price in drip.

* **Examples**

```
> await conflux.getGasPrice();
   1n
```

### Conflux.prototype.getInterestRate <a id="Conflux.js/Conflux/getInterestRate"></a>

Returns the interest rate of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The interest rate of given parameter.

* **Examples**

```
> await conflux.getInterestRate();
   2522880000000n
```

### Conflux.prototype.getAccumulateInterestRate <a id="Conflux.js/Conflux/getAccumulateInterestRate"></a>

Returns the accumulate interest rate of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The accumulate interest rate of given parameter.

* **Examples**

```
> await conflux.getAccumulateInterestRate()
   76357297457647044505744908994993n
```

### Conflux.prototype.getAccount <a id="Conflux.js/Conflux/getAccount"></a>

Return account related states of the given account

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | address to get account.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` Return the states of the given account:
- balance `BigInt`: the balance of the account.
- nonce `BigInt`: the nonce of the account's next transaction.
- codeHash `string`: the code hash of the account.
- stakingBalance `BigInt`: the staking balance of the account.
- collateralForStorage `BigInt`: the collateral storage of the account.
- accumulatedInterestReturn `BigInt`: accumulated unterest return of the account.
- admin `string`: admin of the account.

* **Examples**

```
> await conflux.getAccount('cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4');
   {
      accumulatedInterestReturn: 0n,
      balance: 824812401057514588670n,
      collateralForStorage: 174187500000000000000n,
      nonce: 1449n,
      stakingBalance: 0n,
      admin: 'CFXTEST:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6F0VRCSW',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
   }
```

### Conflux.prototype.getBalance <a id="Conflux.js/Conflux/getBalance"></a>

Returns the balance of the account of given address.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | The address to get the balance of.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The balance in Drip.

* **Examples**

```
> await conflux.getBalance("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   824812401057514588670n
```

### Conflux.prototype.getStakingBalance <a id="Conflux.js/Conflux/getStakingBalance"></a>

Returns the balance of the staking account of given address.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to check for staking balance.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The staking balance in Drip.

* **Examples**

```
> await conflux.getStakingBalance('cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4', 'latest_state');
   0n
```

### Conflux.prototype.getNextNonce <a id="Conflux.js/Conflux/getNextNonce"></a>

Returns the next nonce should be used by given address.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------
address     | `string`        | true     |         | The address to get the numbers of transactions from.
epochNumber | `string,number` | false    |         | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` The next nonce should be used by given address.

* **Examples**

```
> await conflux.getNextNonce("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   1449n
```

### Conflux.prototype.getAdmin <a id="Conflux.js/Conflux/getAdmin"></a>

Returns the admin of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<string>` Address to admin, or `null` if the contract does not exist.

* **Examples**

```
> conflux.getAdmin('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   "CFXTEST:TYPE.USER:AASB661U2R60UZN5H0C4H63HJ76WTGF552R9GHU7A4"
```

### Conflux.prototype.getVoteList <a id="Conflux.js/Conflux/getVoteList"></a>

Returns vote list of the given account.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<Array.<object>>` Vote list
- `array`:
  - amount `BigInt`: This is the number of tokens should be locked before
  - unlockBlockNumber `number`: This is the timestamp when the vote right will be invalid, measured in, the number of past blocks.

### Conflux.prototype.getDepositList <a id="Conflux.js/Conflux/getDepositList"></a>

Returns deposit list of the given account.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<Array.<object>>` Deposit list
- `array`:
  - amount `BigInt`: the number of tokens deposited
  - accumulatedInterestRate: `BigInt`: the accumulated interest rate at the time of the deposit
  - depositTime `number`: the time of the deposit

### Conflux.prototype.getEpochNumber <a id="Conflux.js/Conflux/getEpochNumber"></a>

Returns the epoch number of given parameter.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<number>` integer of the current epoch number of given parameter.

* **Examples**

```
> await conflux.getEpochNumber();
   443
```

### Conflux.prototype.getBlockByEpochNumber <a id="Conflux.js/Conflux/getBlockByEpochNumber"></a>

Returns information about a block by epoch number.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------------------------------------
epochNumber | `string,number` | true     |         | See [format.epochNumber](#util/format.js/format/(static)epochNumber)
detail      | `boolean`       | false    | false   | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

* **Returns**

`Promise.<(object|null)>` See `getBlockByHash`

* **Examples**

```
> await conflux.getBlockByEpochNumber('latest_mined', true);
   {...}
```

### Conflux.prototype.getBlocksByEpochNumber <a id="Conflux.js/Conflux/getBlocksByEpochNumber"></a>

Returns hashes of blocks located in some epoch.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|---------------------------------------------------------------------
epochNumber | `string,number` | true     |         | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<Array.<string>>` Array of block hashes, sorted by execution(topological) order.

* **Examples**

```
> await conflux.getBlocksByEpochNumber(0);
   ['0xe677ae5206a5d67d9efa183d867b4b986ed82a3e62174a1488cf8364d58534ec']
```

### Conflux.prototype.getBestBlockHash <a id="Conflux.js/Conflux/getBestBlockHash"></a>

Returns the hash of best block.

* **Returns**

`Promise.<string>` hash of the best block.

* **Examples**

```
> await conflux.getBestBlockHash();
   "0xb8bb355bfeaf055a032d5b7df719917c090ee4fb6fee42383004dfe8911d7daf"
```

### Conflux.prototype.getBlockByHash <a id="Conflux.js/Conflux/getBlockByHash"></a>

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
- gasLimit `BigInt`: The maximum gas allowed in this block.
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
> await conflux.getBlockByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390');
   {
      epochNumber: 6,
      blame: 0,
      height: 6,
      size: 352,
      timestamp: 1603901780,
      gasLimit: 30000000n,
      gasUsed: 61118n,
      difficulty: 20000000000n,
      transactions: [
        '0xaad69c8c814aec3e418b68f60917c607920a531e7082dd2c642323b43ecadb94',
        '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce'
      ],
      adaptive: false,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508',
      deferredStateRoot: '0x50c0fcbc5bafa7d1dba7b19c87629830106a6be8d0adf505cdc656bb43535d69',
      hash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      miner: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      nonce: '0x17d86f2f6',
      parentHash: '0xc8a412b4b77b48d61f694975f032d109f26bb0f9fc02e4b221d67a382fab386b',
      powQuality: '0x5a0f86a6f4',
      refereeHashes: [
        '0x73cd891aea310e2c0b8644de91746c7353cebfffb780126bc06101b20689c893'
      ],
      transactionsRoot: '0xd2f08676484ba2a3738194f44542eb29fb290b8ed74bf007f132fe51d89b2e7c'
    }
```

### Conflux.prototype.getConfirmationRiskByHash <a id="Conflux.js/Conflux/getConfirmationRiskByHash"></a>

Get the risk of the block could be reverted.
All block in one same epoch returned same risk number

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|----------------
blockHash | `string` | true     |         | Hash of a block

* **Returns**

`Promise.<(number|null)>` Number >0 and <1

* **Examples**

```
> await conflux.getConfirmationRiskByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390')
   1e-8
```

### Conflux.prototype.getTransactionByHash <a id="Conflux.js/Conflux/getTransactionByHash"></a>

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
- epochHeight `number`: epoch height
- from `string`: address of the sender.
- gas `BigInt`: gas provided by the sender.
- gasPrice `number`: gas price provided by the sender in Drip.
- hash `string`: hash of the transaction.
- nonce `BigInt`: the number of transactions made by the sender prior to this one.
- r `string`: ECDSA signature r
- s `string`: ECDSA signature s
- status `number`: 0 for success, 1 for error occured, `null` when the transaction is skipped or not packed.
- storageLimit `BigInt`: storage limit in bytes
- chainId `number`: chain id
- to `string`: address of the receiver. null when its a contract creation transaction.
- transactionIndex `number`: integer of the transactions's index position in the block. `null` when its pending.
- v `string`: ECDSA recovery id
- value `BigInt`: value transferred in Drip.

* **Examples**

```
> await conflux.getTransactionByHash('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      nonce: 0n,
      gasPrice: 10n,
      gas: 200000n,
      value: 0n,
      storageLimit: 1024n,
      epochHeight: 0,
      chainId: 1029,
      v: 1,
      status: 0,
      transactionIndex: 1,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      data: '0xfebe49090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000162788589c8e386863f217faef78840919fb2854',
      from: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6',
      hash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      r: '0x495da01ae9f445847022a8bc7df0198577ba75f88b26699f61afb435bb9c50bc',
      s: '0x2291051b1c53db1d6bfe2fb29be1bf512d063e726dc6b98aaf0f2259b7456be0',
      to: 'CFXTEST:TYPE.USER:AATXETSP0KDARPDB5STDYEX11DR3X6SB0J2XZETSG6'
    }
```

### Conflux.prototype.getTransactionReceipt <a id="Conflux.js/Conflux/getTransactionReceipt"></a>

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
- outcomeStatus `number`:  the outcome status code, 0 was successful, 1 for an error occurred in the execution.
- logsBloom `string`: Bloom filter for light clients to quickly retrieve related logs.
- logs `object[]`: Array of log objects, which this transaction generated.
- gasCoveredBySponsor `boolean`: `true` if this transaction's gas fee was covered by the sponsor.
- storageCoveredBySponsor `boolean`: `true` if this transaction's storage collateral was covered by the sponsor.
- storageCollateralized `BigInt`: the amount of storage collateral this transaction required.
- storageReleased `array`: array of storage change objects, each specifying an address and the corresponding amount of storage collateral released
  - address `string`: address released
  - collaterals `BigInt`: corresponding amount of storage collateral released

* **Examples**

```
> await conflux.getTransactionReceipt('0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce');
   {
      index: 1,
      epochNumber: 6,
      outcomeStatus: 0,
      gasUsed: 30559n,
      gasFee: 1500000n,
      blockHash: '0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390',
      contractCreated: null,
      from: 'CFXTEST:TYPE.USER:AAJJ1C2XGRKDY8RPG2828UPAN4A5BBSZNYB28K0PHS',
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      stateRoot: '0xd6a7c2c14cb0d1233010acca98e114db5a10e0b94803d23b01a6777b7fd3b2fd',
      to: 'CFXTEST:TYPE.CONTRACT:ACB59FK6VRYH8DJ5VYVEHJ9APZHPD72RDP2FVP77R9',
      transactionHash: '0xbf7110474779ba2404433ef39a24cb5b277186ef1e6cb199b0b60907b029a1ce',
      txExecErrorMsg: null,
      gasCoveredBySponsor: false,
      storageCoveredBySponsor: false,
      storageCollateralized: 0n,
      storageReleased: [
        address: '0x0000000000000000000000000000000000000001',
        collaterals: 640n,
      ],
    }
```

### Conflux.prototype.sendRawTransaction <a id="Conflux.js/Conflux/sendRawTransaction"></a>

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

### Conflux.prototype.sendTransaction <a id="Conflux.js/Conflux/sendTransaction"></a>

Sign and send transaction
if `from` field in `conflux.wallet`, sign by local account and send raw transaction,
else call `cfx_sendTransaction` and sign by remote wallet

* **Parameters**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|---------------------------------------------------------------
options  | `object` | true     |         | See [Transaction](#Transaction.js/Transaction/**constructor**)
password | `string` | false    |         | Password for remote node.

* **Returns**

`Promise.<PendingTransaction>` The PendingTransaction object.

* **Examples**

```
> txHash = await conflux.sendTransaction({from:account, to:address, value:0}); // send and get transaction hash
   "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
```

```
> packedTx = await conflux.sendTransaction({from:account, to:address, value:0}).get(); // await till transaction packed
   {
    "nonce": 8n,
    "value": 0n,
    "gasPrice": 1000000000n,
    "gas": 21000n,
    "v": 0,
    "transactionIndex": null,
    "status": null,
    "storageLimit": 0n,
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": null,
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76"
   }
```

```
> minedTx = await conflux.sendTransaction({from:account, to:address, value:0}).mined(); // await till transaction mined
   {
    "nonce": 8n,
    "value": 0n,
    "gasPrice": 1000000000n,
    "gas": 21000n,
    "v": 0,
    "transactionIndex": 0,
    "status": 0,
    "storageLimit": 0n,
    "chainId": 1,
    "epochHeight": 791394,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "data": "0x",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "hash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88",
    "r": "0x245a1a86ae405eb72c1eaf98f5e22baa326fcf8262abad2c4a3e5bdcf2e912b5",
    "s": "0x4df8058887a4dd8aaf60208accb3e57292a50ff06a117df6e54f7f56176248c0",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76"
   }
```

```
> executedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).executed(); // await till transaction executed
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": 21000n,
    "gasFee": 21000000000000n,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }
```

```
> confirmedReceipt = await conflux.sendTransaction({from:account, to:address, value:0}).confirmed(); // await till risk coefficient < threshold (default 1e-8)
   {
    "index": 0,
    "epochNumber": 791402,
    "outcomeStatus": 0,
    "gasUsed": 21000n,
    "gasFee": 21000000000000n,
    "blockHash": "0xdb2d2d438dcdee8d61c6f495bd363b1afb68cb0fdff16582c08450a9ca487852",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x510d680cdbf60d34bcd987b3bf9925449c0839a7381dc8fd8222d2c7ee96122d",
    "to": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "transactionHash": "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
   }
```

### Conflux.prototype.getCode <a id="Conflux.js/Conflux/getCode"></a>

Returns the code of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<string>` Byte code of contract, or 0x if the contract does not exist.

* **Examples**

```
> await conflux.getCode('cfxtest:acb2nsctbanb9ezbw0mx1gapve60thyurjmxkage0f');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```

### Conflux.prototype.getStorageAt <a id="Conflux.js/Conflux/getStorageAt"></a>

Returns storage entries from a given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
position    | `string`        | true     |                | The given position.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<(string|null)>` Storage entry of given query, or null if the it does not exist.

* **Examples**

```
> await conflux.getStorageAt('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
```

### Conflux.prototype.getStorageRoot <a id="Conflux.js/Conflux/getStorageRoot"></a>

Returns the storage root of a given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` A storage root object, or `null` if the contract does not exist
- delta `string`: storage root in the delta trie.
- intermediate `string`: storage root in the intermediate trie.
- snapshot `string`: storage root in the snapshot.

* **Examples**

```
> await conflux.getStorageRoot('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c')
   {
      "delta": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "intermediate": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshot": "0x7bb7d43152e56f529fbef709aab7371b0672f2332ae0fb4786da350f664df5b4"
   }
```

### Conflux.prototype.getSponsorInfo <a id="Conflux.js/Conflux/getSponsorInfo"></a>

Returns the sponsor info of given contract.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
address     | `string`        | true     |                | Address to contract.
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
- sponsorBalanceForCollateral `BigInt`: the sponsored balance for storage.
- sponsorBalanceForGas `BigInt`: the sponsored balance for gas.
- sponsorGasBound `BigInt`: the max gas could be sponsored for one transaction.
- sponsorForCollateral `string`: the address of the storage sponsor.
- sponsorForGas `string`: the address of the gas sponsor.

* **Examples**

```
> await conflux.getSponsorInfo('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   {
      sponsorBalanceForCollateral: 410625000000000000000n,
      sponsorBalanceForGas: 9999999993626232440n,
      sponsorGasBound: 10000000000n,
      sponsorForCollateral: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX',
      sponsorForGas: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX'
   }
```

### Conflux.prototype.getCollateralForStorage <a id="Conflux.js/Conflux/getCollateralForStorage"></a>

Returns the size of the collateral storage of given address, in Byte.

* **Parameters**

Name        | Type     | Required | Default        | Description
------------|----------|----------|----------------|---------------------------------------------------------------------
address     | `string` | true     |                | Address to check for collateral storage.
epochNumber |          | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<BigInt>` - The collateral storage in Byte.

* **Examples**

```
> await conflux.getCollateralForStorage('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   89375000000000000000n
```

### Conflux.prototype.call <a id="Conflux.js/Conflux/call"></a>

Virtually call a contract, return the output data.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
options     | `object`        | true     |                | See [Transaction](#Transaction.js/Transaction/**constructor**)
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<string>` The output data.

### Conflux.prototype.estimateGasAndCollateral <a id="Conflux.js/Conflux/estimateGasAndCollateral"></a>

Virtually call a contract, return the estimate gas used and storage collateralized.

* **Parameters**

Name        | Type            | Required | Default        | Description
------------|-----------------|----------|----------------|---------------------------------------------------------------------
options     | `object`        | true     |                | See [Transaction](#Transaction.js/Transaction/**constructor**)
epochNumber | `string,number` | false    | 'latest_state' | See [format.epochNumber](#util/format.js/format/(static)epochNumber)

* **Returns**

`Promise.<object>` A estimate result object:
- `BigInt` gasUsed: The gas used.
- `BigInt` gasLimit: The gas limit.
- `BigInt` storageCollateralized: The storage collateralized in Byte.

### Conflux.prototype.getLogs <a id="Conflux.js/Conflux/getLogs"></a>

Returns logs matching the filter provided.

* **Parameters**

Name                | Type                    | Required | Default             | Description
--------------------|-------------------------|----------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options             | `object`                | false    |                     |
options.fromEpoch   | `string,number`         | false    | 'latest_checkpoint' | See [format.epochNumber](#util/format.js/format/(static)epochNumber). Search will be applied from this epoch number.
options.toEpoch     | `string,number`         | false    | 'latest_state'      | See [format.epochNumber](#util/format.js/format/(static)epochNumber). Search will be applied up until (and including) this epoch number.
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
      address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
      fromEpoch: 39802,
      toEpoch: 39802,
      limit: 1,
      topics: ['0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'],
    });
   [
   {
      epochNumber: 39802,
      logIndex: 2,
      transactionIndex: 0,
      transactionLogIndex: 2,
      address: 'CFXTEST:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXA2GC31EUW',
      blockHash: '0xca00158a2a508170278d5bdc5ca258b6698306dd8c30fdba32266222c79e57e6',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde'
      ],
      transactionHash: '0xeb75f47002720311f1709e36d7f7e9a91ee4aaa469a1de892839cb1ef66a9939'
    }
   ]
```

### Conflux.prototype.traceBlock <a id="Conflux.js/Conflux/traceBlock"></a>

Return block's execution trace.

> Note: need RPC server open trace_block method

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
blockHash | `string` | true     |         | block hash

* **Returns**

`Promise.<Array.<object>>` Array of transaction traces.

* **Examples**

```
> await conflux.traceBlock('0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88')
   {
        "transactionTraces": [
            {
                "traces": [
                    {
                        "action": {
                            "callType": "call",
                            "from": "CFXTEST:TYPE.USER:AAP6SU0S2UZ36X19HSCP55SR6N42YR1YK6HX8D8SD1",
                            "gas": "311592",
                            "input": "0x",
                            "to": "CFXTEST:TYPE.CONTRACT:ACCKUCYY5FHZKNBXMEEXWTAJ3BXMEG25B2NUF6KM25",
                            "value": "0"
                        },
                        "type": "call"
                    }
                ]
            },
            {
                "traces": [
                    {
                        "action": {
                            "from": "CFXTEST:TYPE.USER:AAR75DU3V36MG4U2DHAG44B40H6K4M2ARY46G0ECMB",
                            "gas": "83962",
                            "init": "0x",
                            "value": "0"
                        },
                        "type": "create"
                    }
                ]
            }
        ]
    }
```

### Conflux.prototype.subscribe <a id="Conflux.js/Conflux/subscribe"></a>

Subscribe event by name and got id, and provider will emit event by id

> Note: suggest use `conflux.subscribeXXX` to subscribe

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-----------------------
name    | `string` | true     |         | Subscription name
...args | `array`  | true     |         | Subscription arguments

* **Returns**

`Promise.<string>` Id of subscription

* **Examples**

```
> conflux = new Conflux({url:'ws://127.0.0.1:12535'})
> id = await conflux.subscribe('epochs');
   "0x8fe7879a1681e9b9"
> conflux.provider.on(id, data=>console.log(data));
   {
     epochHashesOrdered: [
       '0x0eff33578346b8e8347af3bae948eb7f4f5c27add9dbcfeb55eaf7cb3640088f',
       '0xb0cedac34a06ebcb42c3446a6bb2df1f0dcd9d83061f550460e387d19a4d8e91'
     ],
     epochNumber: '0x8cb32'
   }
```

### Conflux.prototype.subscribeEpochs <a id="Conflux.js/Conflux/subscribeEpochs"></a>

The epochs topic streams consensus results: the total order of blocks, as expressed by a sequence of epochs.
The returned series of epoch numbers is monotonically increasing with an increment of one.
If you see the same epoch twice, this suggests a pivot chain reorg has happened (this might happen for recent epochs).
For each epoch, the last hash in epochHashesOrdered is the hash of the pivot block.

* **Returns**

`Promise.<Subscription>` EventEmitter instance with the follow events:
- 'data':
  - epochNumber `number`: epoch number
  - epochHashesOrdered `array`: epoch block hash in order
    - `string`: block hash

* **Examples**

```
> subscription = await conflux.subscribeEpochs()
> subscription.on('data', data=>console.log(data))
   {
     epochNumber: 566031,
     epochHashesOrdered: [
       '0x2820dbb5c4126455ad37bc88c635ae1f35e0d4f85c74300c01828f57ea1e5969',
       '0xd66b801335ba01e2448df52e59da584b54fc7ee7c2f8160943c097e1ebd23038'
     ]
    }
   {
     epochNumber: 566032,
     epochHashesOrdered: [
       '0x899606b462f0141d672aaea8497c82aebbd7b16d266fad71e9d5093b5c6d392e',
       '0xf6093d19c4df3645cd972e9f791fe0db3a1ab70881023a8aee63f64e0c3ca152'
     ]
   }
```

### Conflux.prototype.subscribeNewHeads <a id="Conflux.js/Conflux/subscribeNewHeads"></a>

The newHeads topic streams all new block headers participating in the consensus.

* **Returns**

`Promise.<Subscription>` EventEmitter instance with the follow events:
- 'data': see `getBlockByHash`

* **Examples**

```
> subscription = await conflux.subscribeNewHeads()
> subscription.on('data', data=>console.log(data))
   {
      difficulty: 368178587115n,
      epochNumber: null,
      gasLimit: 30000000n,
      height: 1118247,
      timestamp: 1605005752,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x7ae0d5716513206755b6f7c95272b79dbc225759b6e17727e19c2f15c3166bda',
      deferredStateRoot: '0x3cf5deba77c8aa9072f1e972d6a97db487a0ce88455f371eb8ac8fa77321cb9d',
      hash: '0x194675173abbc5aab50326136008774eea1a289e6722c973dfed12b703ee5f2a',
      miner: 'CFXTEST:TYPE.USER:AAPKCJR28DG976FZR43C5HF1RWN5XV8T1U8V8JW8A4',
      nonce: '0x799d35f695950fd6',
      parentHash: '0x4af3cf8cb358e75acad282ffa4b578b6211ea9eeb7cf87c282f120d8a1c809df',
      powQuality: '0xe7ac17feab',
      refereeHashes: [],
      transactionsRoot: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
```

### Conflux.prototype.subscribeLogs <a id="Conflux.js/Conflux/subscribeLogs"></a>

The logs topic streams all logs matching a certain filter, in order.
In case of a pivot chain reorg (which might affect recent logs), a special revert message is sent.
All logs received previously that belong to epochs larger than the one in this message should be considered invalid.

* **Parameters**

Name            | Type                    | Required | Default | Description
----------------|-------------------------|----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options         | `object`                | false    |         |
options.address | `string,Array.<string>` | false    |         | Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses.
options.topics  | `array`                 | false    |         | Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all.

* **Returns**

`Promise.<Subscription>` EventEmitter instance with the follow events:
- 'data': see `getLogs`
- 'revert':
  - revertTo 'number': epoch number

* **Examples**

```
> subscription = await conflux.subscribeLogs()
> subscription.on('data', data=>console.log(data))
   {
     epochNumber: 568224,
     logIndex: 0,
     transactionIndex: 0,
     transactionLogIndex: 0,
     address: 'CFXTEST:TYPE.CONTRACT:ACCS4PG151C99AZPE6RSK37R40YNEMYRSE9P475E82',
     blockHash: '0xc02689eea6a507250838463c13e6b633479e2757dfb7e9b2593d5c31b54adb63',
     data: '0x0000000000000000000000000000000000000000000000000000000000000001',
     topics: [
       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
       '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
     ],
     transactionHash: '0x950ddec9ce3b42c4d8ca120722fa318ae64dc2e24553201f55f68c00bfd9cc4c'
   }
```

```
> subscription.on('revert', data=>console.log(data))
   { revertTo: 568230 }
   { revertTo: 568231 }
```

### Conflux.prototype.unsubscribe <a id="Conflux.js/Conflux/unsubscribe"></a>

Unsubscribe subscription.

* **Parameters**

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|----------------
id   | `string,Subscription` | true     |         | Subscription id

* **Returns**

`Promise.<boolean>` Is success

* **Examples**

```
> id = await conflux.subscribe('epochs');
> await conflux.unsubscribe(id);
   true
> await conflux.unsubscribe(id);
   false
```

```
> subscription = await conflux.subscribeLogs();
> await conflux.unsubscribe(subscription);
   true
```

----------------------------------------

## Drip <a id="Drip.js/Drip"></a>

Positive decimal integer string in `Drip`

### Drip.fromCFX <a id="Drip.js/Drip/(static)fromCFX"></a>

Get `Drip` string from `CFX`

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `string,number` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> Drip.fromCFX(3.14)
   [String (Drip): '3140000000000000000']
> Drip.fromCFX('0xab')
   [String (Drip): '171000000000000000000']
```

### Drip.fromGDrip <a id="Drip.js/Drip/(static)fromGDrip"></a>

Get `Drip` string from `GDrip`

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `string,number` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> Drip.fromGDrip(3.14)
   [String (Drip): '3140000000']
> Drip.fromGDrip('0xab')
   [String (Drip): '171000000000']
```

### Drip.prototype.**constructor** <a id="Drip.js/Drip/**constructor**"></a>

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `number,string` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> Drip(1.00)
   [String (Drip): '1']
> Drip('0xab')
   [String (Drip): '171']
```

### Drip.prototype.toCFX <a id="Drip.js/Drip/toCFX"></a>

Get `CFX` number string

* **Returns**

`string` 

* **Examples**

```
> Drip(1e9).toCFX()
   "0.000000001"
```

### Drip.prototype.toGDrip <a id="Drip.js/Drip/toGDrip"></a>

Get `GDrip` number string

* **Returns**

`string` 

* **Examples**

```
> Drip(1e9).toGDrip()
   "1"
```

----------------------------------------

## Message <a id="Message.js/Message"></a>



### Message.sign <a id="Message.js/Message/(static)sign"></a>

Signs the hash with the privateKey.

> TODO support [CIP 23](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-23.md)

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

### Message.recover <a id="Message.js/Message/(static)recover"></a>

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

### Message.prototype.**constructor** <a id="Message.js/Message/**constructor**"></a>

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
   "cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7"
> msg.r
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c"
> msg.s
   "0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f"
> msg.v
   1
```

### Message.prototype.hash <a id="Message.js/Message/hash(getter)"></a>

Getter of message hash include signature.

> Note: calculate every time.

* **Returns**

`string` 

### Message.prototype.from <a id="Message.js/Message/from(getter)"></a>

Getter of sender address.

> Note: calculate every time.

* **Returns**

`string,undefined` If ECDSA recover success return address, else return undefined.

### Message.prototype.sign <a id="Message.js/Message/sign"></a>

Sign message and set 'r','s','v' and 'hash'.

* **Parameters**

Name       | Type      | Required | Default | Description
-----------|-----------|----------|---------|------------------------
privateKey | `string`  | true     |         | Private key hex string.
networkId  | `Integer` | false    | 1029    | Network id of account

* **Returns**

`Message` 

----------------------------------------

## Transaction <a id="Transaction.js/Transaction"></a>



### Transaction.prototype.**constructor** <a id="Transaction.js/Transaction/**constructor**"></a>

Create a transaction.

* **Parameters**

Name                 | Type            | Required | Default | Description
---------------------|-----------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options              | `object`        | true     |         |
options.from         | `string`        | false    |         | The sender address.
options.nonce        | `string,number` | false    |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice     | `string,number` | false    |         | The price of gas for this transaction in drip.
options.gas          | `string,number` | false    |         | The amount of gas to use for the transaction (unused gas is refunded).
options.to           | `string`        | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value        | `string,number` | false    |         | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.storageLimit | `string,number` | false    |         | The storage limit specified by the sender.
options.epochHeight  | `string,number` | false    |         | The epoch proposed by the sender. Note that this is NOT the epoch of the block containing this transaction.
options.chainId      | `string,number` | false    |         | The chain ID specified by the sender.
options.data         | `string,Buffer` | false    |         | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r            | `string,Buffer` | false    |         | ECDSA signature r
options.s            | `string,Buffer` | false    |         | ECDSA signature s
options.v            | `number`        | false    |         | ECDSA recovery id

* **Returns**

`Transaction` 

### Transaction.prototype.hash <a id="Transaction.js/Transaction/hash(getter)"></a>

Getter of transaction hash include signature.

> Note: calculate every time.

* **Returns**

`string,undefined` If transaction has r,s,v return hex string, else return undefined.

### Transaction.prototype.sign <a id="Transaction.js/Transaction/sign"></a>

Sign transaction and set 'r','s','v'.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | Private key hex string.
networkId  | `number` | true     |         | fullnode's network id.

* **Returns**

`Transaction` 

### Transaction.prototype.recover <a id="Transaction.js/Transaction/recover"></a>

Recover public key from signed Transaction.

* **Returns**

`string` 

### Transaction.prototype.encode <a id="Transaction.js/Transaction/encode"></a>

Encode rlp.

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------
includeSignature | `boolean` | false    | false   | Whether or not to include the signature.

* **Returns**

`Buffer` 

### Transaction.prototype.serialize <a id="Transaction.js/Transaction/serialize"></a>

Get the raw transaction hex string.

* **Returns**

`string` Hex string

----------------------------------------

### Contract <a id="contract/Contract.js/Contract"></a>

Contract with all its methods and events defined in its abi.

#### Contract.prototype.**constructor** <a id="contract/Contract.js/Contract/**constructor**"></a>

> contract "code" definition:
```
6080................6080.................a264.........0033...............................
| <-                     create contract transaction `data`                          -> |
| <- deploy code -> | <- runtime code -> | <- metadata -> | <- constructor arguments -> |
| <-                contract `bytecode`                -> |
                    | <-       code as `getCode`       -> |
```

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
> const contract = conflux.Contract({ abi, bytecode, address });
   {
      abi: ContractABI { contract: [Circular *1] },
      address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
      constructor: [Function: bound call],
      name: [Function: bound call],
      'name()': [Function: bound call],
      '0x06fdde03': [Function: bound call],
      balanceOf: [Function: bound call],
      'balanceOf(address)': [Function: bound call],
      '0x70a08231': [Function: bound call],
      send: [Function: bound call],
      'send(address,uint256,bytes)': [Function: bound call],
      '0x9bd9bbc6': [Function: bound call],
      Transfer: [Function: bound call],
      'Transfer(address,address,uint256)': [Function: bound call],
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': [Function: bound call]
   }
> contract.constructor.bytecode; // input code
   "0x6080..."
```

```
> const contract = conflux.Contract({
   address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
   abi: [
      {
        type: 'function',
        name: 'name',
        inputs: [],
        outputs: [{ type: 'string' }],
      },
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
      {
        name: 'send',
        type: 'function',
        inputs: [
          { type: 'address', name: 'recipient' },
          { type: 'uint256', name: 'amount' },
          { type: 'bytes', name: 'data' },
        ],
        outputs: [{ type: 'bool' }],
      },
    ]
   });
> contract.address
   "cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw"
> await contract.name(); // call a method without parameter, get decoded return value.
   "FansCoin"
> await contract.name().call({ to: '0x8b8689c7f3014a4d86e4d1d0daaf74a47f5e0f27' }); // call a method with options
   "conflux USDT"
> await contract.balanceOf('0x19c742cec42b9e4eff3b84cdedcde2f58a36f44f'); // call a method with parameters, get decoded return value.
   10000000000000000000n
> transaction = await conflux.getTransactionByHash('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeData(transaction.data)
   {
      name: 'send',
      fullName: 'send(address recipient, uint256 amount, bytes data)',
      type: 'send(address,uint256,bytes)',
      signature: '0x9bd9bbc6',
      array: [
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n,
        <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      ],
      object: {
        recipient: '0x80bb30efc5683758128b404fe5da03432eb16634',
        amount: 60000000000000000000n,
        data: <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      }
    }
> receipt = await conflux.getTransactionReceipt('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeLog(receipt.logs[1]);
   {
      name: 'Transfer',
      fullName: 'Transfer(address indexed from, address indexed to, uint256 value)',
      type: 'Transfer(address,address,uint256)',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      array: [
        '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n
      ],
      object: {
        from: '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        to: '0x80bb30efc5683758128b404fe5da03432eb16634',
        value: 60000000000000000000n
      }
    }
```

----------------------------------------

### BaseProvider <a id="provider/BaseProvider.js/BaseProvider"></a>



#### BaseProvider.prototype.**constructor** <a id="provider/BaseProvider.js/BaseProvider/**constructor**"></a>

* **Parameters**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|-------------------------------
options         | `object` | false    |         |
options.url     | `string` | true     |         | Full json rpc http url
options.timeout | `number` | false    | 60*1000 | Request time out in ms
options.logger  | `object` | false    |         | Logger with `info` and `error`

* **Returns**

`BaseProvider` 

#### BaseProvider.prototype.requestId <a id="provider/BaseProvider.js/BaseProvider/requestId"></a>

Gen a random json rpc id.
It is used in `call` method, overwrite it to gen your own id.

* **Returns**

`string` 

#### BaseProvider.prototype.call <a id="provider/BaseProvider.js/BaseProvider/call"></a>

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

#### BaseProvider.prototype.batch <a id="provider/BaseProvider.js/BaseProvider/batch"></a>

Batch call json rpc methods with params

* **Parameters**

Name  | Type             | Required | Default | Description
------|------------------|----------|---------|-------------------------------------------
array | `Array.<object>` | true     |         | Array of object with "method" and "params"

* **Returns**

`Promise.<Array>` 

* **Examples**

```
> await provider.batch([
  { method: 'cfx_epochNumber' },
  { method: 'cfx_getBalance', params: ['cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp'] },
  { method: 'InValidInput' },
])
   [ '0x3b734d', '0x22374d959c622f74728', RPCError: Method not found ]
```

----------------------------------------

### HttpProvider <a id="provider/HttpProvider.js/HttpProvider"></a>

Http protocol json rpc provider.

----------------------------------------

### WebSocketProvider <a id="provider/WebSocketProvider.js/WebSocketProvider"></a>

Websocket protocol json rpc provider.

#### WebSocketProvider.prototype.**constructor** <a id="provider/WebSocketProvider.js/WebSocketProvider/**constructor**"></a>

* **Parameters**

Name                                        | Type             | Required | Default  | Description
--------------------------------------------|------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------
options                                     | `object`         | false    |          | See [W3CWebSocket](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/W3CWebSocket.md)
options.url                                 | `string`         | true     |          | Full json rpc http url
options.timeout                             | `number`         | false    | 60*1000  | Request time out in ms
options.logger                              | `object`         | false    |          | Logger with `info` and `error`
options.protocols                           | `Array.<string>` | false    |          | See [w3](https://www.w3.org/TR/websockets/)
options.origin                              | `string`         | false    |          |
options.headers                             | `object`         | false    |          |
options.requestOptions                      | `object`         | false    |          |
options.clientConfig                        | `object`         | false    |          | See [websocket/lib/WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/WebSocketClient.md)
options.clientConfig.maxReceivedFrameSize   | `number`         | false    | 0x100000 | 1MiB max frame size.
options.clientConfig.maxReceivedMessageSize | `number`         | false    | 0x800000 | 8MiB max message size, only applicable if assembleFragments is true
options.clientConfig.closeTimeout           | `number`         | false    | 5000     | The number of milliseconds to wait after sending a close frame for an acknowledgement to come back before giving up and just closing the socket.

* **Returns**

`WebSocketProvider` 

----------------------------------------

### providerFactory <a id="provider/index.js/providerFactory"></a>

* **Parameters**

Name        | Type     | Required | Default | Description
------------|----------|----------|---------|------------
options     | `object` | true     |         |
options.url | `string` | true     |         |

* **Returns**

`WebsocketProvider,HttpProvider,BaseProvider` 

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
    url: 'http://main.confluxrpc.org',
    timeout: 60 * 60 * 1000,
    logger: console,
  }
 HttpProvider {
    url: 'http://main.confluxrpc.org',
    timeout: 3600000,
    logger: {...}
  }
```

----------------------------------------

### Subscription <a id="subscribe/Subscription.js/Subscription"></a>

Subscription event emitter

----------------------------------------

#### format.any <a id="util/format.js/format/(static)any"></a>

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

#### format.uInt <a id="util/format.js/format/(static)uInt"></a>

* **Parameters**

Name | Type                           | Required | Default | Description
-----|--------------------------------|----------|---------|------------
arg  | `number,BigInt,string,boolean` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
> format.uInt(-3.14)
 Error("not match uint")
> format.uInt(null)
 Error("not match number")
> format.uInt('0')
 0
> format.uInt(1)
 1
> format.uInt(BigInt(100))
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

#### format.bigInt <a id="util/format.js/format/(static)bigInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
> format.bigInt(-3.14)
 Error("Cannot convert -3.14 to a BigInt")
> format.bigInt('0.0')
 0n
> format.bigInt('-1')
 -1n
> format.bigInt(1)
 1n
> format.bigInt(BigInt(100))
 100n
> format.bigInt('0x10')
 16n
> format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 9007199254740992n
```

#### format.bigUInt <a id="util/format.js/format/(static)bigUInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
> format.bigUInt('0.0')
 0n
> format.bigUInt('-1')
 Error("not match bigUInt")
```

#### format.bigUIntHex <a id="util/format.js/format/(static)bigUIntHex"></a>

When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.bigUIntHex(100)
 "0x64"
> format.bigUIntHex('0x0a')
 "0xa"
> format.bigUIntHex(-1))
 Error("not match uintHex")
```

#### format.big <a id="util/format.js/format/(static)big"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`Big` Big instance

* **Examples**

```
> format.big('0b10').toString()
 '2'
> format.big('0O10').toString()
 '8'
> format.big('010').toString()
 '10'
> format.big('0x10').toString()
 '16'
> format.big(3.14).toString()
 '3.14'
> format.big('-03.140').toString()
 '-3.14'
> format.big(null)
 Error('Invalid number')
```

#### format.fixed64 <a id="util/format.js/format/(static)fixed64"></a>

* **Parameters**

Name | Type                       | Required | Default | Description
-----|----------------------------|----------|---------|------------
arg  | `string,number,BigInt,Big` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
> format.fixed64('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
> format.fixed64('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 0.5
```

#### format.epochNumber <a id="util/format.js/format/(static)epochNumber"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------------------------------------------------------
arg  | `number,string` | true     |         | number or label, See [EPOCH_NUMBER](#CONST.js/EPOCH_NUMBER)

* **Returns**

`string` 

* **Examples**

```
> format.epochNumber(10)
 "0xa"
> format.epochNumber(EPOCH_NUMBER.LATEST_STATE)
 "latest_state"
> format.epochNumber('latest_mined')
 "latest_mined"
```

#### format.hex <a id="util/format.js/format/(static)hex"></a>

When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,BigInt,string,Buffer,boolean,null` | true     |         |

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

#### format.address <a id="util/format.js/format/(static)address"></a>

Checks if a given string is a valid address.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|------------
address   | `string,Buffer` | true     |         |
networkId | `integer`       | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.address('0x0123456789012345678901234567890123456789', 1)
 "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
```

#### format.hexAddress <a id="util/format.js/format/(static)hexAddress"></a>

Checks if a given string is a valid hex address.
It will also check the checksum, if the address has upper and lowercase letters.

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|------------
address | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.hexAddress('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
> format.hexAddress('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
> format.hexAddress('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
 0x0123456789012345678901234567890123456789
```

#### ~~format.checksumAddress~~ <a id="util/format.js/format/(static)checksumAddress"></a>

Will convert an upper or lowercase address to a checksum address.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Checksum address hex string

* **Examples**

```
> format.checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0X1B716C51381E76900EBAA7999A488511A4E1FD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0x1B716c51381e76900EBAA7999A488511A4E1fD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```

#### format.blockHash <a id="util/format.js/format/(static)blockHash"></a>

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

#### format.transactionHash <a id="util/format.js/format/(static)transactionHash"></a>

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

#### format.privateKey <a id="util/format.js/format/(static)privateKey"></a>

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

#### format.publicKey <a id="util/format.js/format/(static)publicKey"></a>

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

#### format.hexBuffer <a id="util/format.js/format/(static)hexBuffer"></a>

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,string,BigInt,Buffer,boolean,null` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.hexBuffer(Buffer.from([0, 1]))
 <Buffer 00 01>
> format.hexBuffer(null)
 <Buffer >
> format.hexBuffer(1024)
 <Buffer 04 00>
> format.hexBuffer('0x0a')
 <Buffer 0a>
> format.hexBuffer(true)
 <Buffer 01>
> format.hexBuffer(3.14)
 Error("not match hex")
```

#### format.bytes <a id="util/format.js/format/(static)bytes"></a>

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
> format.bytes([0, 1])
 <Buffer 00 01>
> format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
```

#### format.boolean <a id="util/format.js/format/(static)boolean"></a>

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

#### format.keccak256 <a id="util/format.js/format/(static)keccak256"></a>

Compute the keccak256 cryptographic hash of a value, returned as a hex string.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` 

* **Examples**

```
> format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
> format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
```

----------------------------------------

### keccak256 <a id="util/sign.js/keccak256"></a>

keccak 256

* **Parameters**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|------------
buffer | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> keccak256(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

----------------------------------------

### ~~checksumAddress~~ <a id="util/sign.js/checksumAddress"></a>

Makes a checksum address

> Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
> Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         | Hex string

* **Returns**

`string` 

* **Examples**

```
> checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```

----------------------------------------

### randomBuffer <a id="util/sign.js/randomBuffer"></a>

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

### randomPrivateKey <a id="util/sign.js/randomPrivateKey"></a>

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

### privateKeyToPublicKey <a id="util/sign.js/privateKeyToPublicKey"></a>

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

----------------------------------------

### publicKeyToAddress <a id="util/sign.js/publicKeyToAddress"></a>

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
> publicKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

----------------------------------------

### privateKeyToAddress <a id="util/sign.js/privateKeyToAddress"></a>

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

### ecdsaSign <a id="util/sign.js/ecdsaSign"></a>

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

### ecdsaRecover <a id="util/sign.js/ecdsaRecover"></a>

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

### encrypt <a id="util/sign.js/encrypt"></a>

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

### decrypt <a id="util/sign.js/decrypt"></a>

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

### PrivateKeyAccount <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount"></a>



#### PrivateKeyAccount.random <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random"></a>

Create a new PrivateKeyAccount with random privateKey.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|--------------------------
entropy   | `string,Buffer` | false    |         | Entropy of random account
networkId | `Integer`       | false    | 1029    | network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.random()
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: 'cfxtest:aass3rfcwjz1ab9cg5rtbv61531fmwnsuuy8c26f20'
    }
> PrivateKeyAccount.random() // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: 'cfxtest:aanpezyvznsdg29zu20wpudwnbhx7t4gcpzcnkzjd2'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: 'cfxtest:aajx4wn2kwarr8h71uf880w40dp6x91feac1n6ur3s'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
// gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: 'cfxtest:aat0h9htkmzjvub61rsk9p4n64s863suza6zu7d2rr'
    }
```

#### PrivateKeyAccount.decrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|---------------------------------------
keystore  | `object`        | true     |         | Keystore version 3 object.
password  | `string,Buffer` | true     |         | Password for keystore to decrypt with.
networkId | `Integer`       | false    | 1029    | Network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.decrypt({
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
  }, 'password');
   PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.**constructor** <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**"></a>

Create a account by privateKey.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account
networkId  | `Integer`       | false    |         | Network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   PrivateKeyAccount {
    address: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.encrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt"></a>

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

#### PrivateKeyAccount.prototype.signTransaction <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction"></a>

Sign a transaction.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|----------------------------------------------
options | `object` | true     |         | See [Transaction](Transaction.js/constructor)

* **Returns**

`Promise.<Transaction>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> transaction = account.signTransaction({
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
    })

   Transaction {
      from: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      to: undefined,
      value: undefined,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
      data: undefined,
      v: 0,
      r: '0x096f4e00ac15f6bd6e09937e99f0e54aaa2dd0f4c6bd8421e1e81b0e8bd30723',
      s: '0x41e63a41ede0cbb8ccfaa827423c654dcdc09fb1aa1c3a7233566544aff4cd9a'
    }
```

#### PrivateKeyAccount.prototype.signMessage <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage"></a>

Sign a string.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
options | `string` | true     |         |

* **Returns**

`Promise.<Message>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> message = account.signMessage('Hello World')
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```

----------------------------------------

### Wallet <a id="wallet/Wallet.js/Wallet"></a>

Wallet to manager accounts.

#### Wallet.prototype.has <a id="wallet/Wallet.js/Wallet/has"></a>

Check if address exist

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.delete <a id="wallet/Wallet.js/Wallet/delete"></a>

Drop one account by address

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.clear <a id="wallet/Wallet.js/Wallet/clear"></a>

Drop all account in wallet

#### Wallet.prototype.set <a id="wallet/Wallet.js/Wallet/set"></a>

* **Parameters**

Name    | Type      | Required | Default | Description
--------|-----------|----------|---------|-------------------------------------
address | `string`  | true     |         | Key of account, usually is `address`
account | `Account` | true     |         | Account instance

* **Returns**

`Wallet` 

#### Wallet.prototype.get <a id="wallet/Wallet.js/Wallet/get"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`Account` 

#### Wallet.prototype.addPrivateKey <a id="wallet/Wallet.js/Wallet/addPrivateKey"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addRandom <a id="wallet/Wallet.js/Wallet/addRandom"></a>

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|--------------------------
entropy | `string,Buffer` | false    |         | Entropy of random account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addKeystore <a id="wallet/Wallet.js/Wallet/addKeystore"></a>

* **Parameters**

Name     | Type            | Required | Default | Description
---------|-----------------|----------|---------|---------------------------------------
keystore | `object`        | true     |         | Keystore version 3 object.
password | `string,Buffer` | true     |         | Password for keystore to decrypt with.

* **Returns**

`PrivateKeyAccount` 
