## Classes

<dl>
<dt><a href="#Conflux">Conflux</a></dt>
<dd><p>The Client class that provides an interface to the Conflux network.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ConfluxOption">ConfluxOption</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TransactionMeta">TransactionMeta</a> : <code><a href="#TransactionMeta">TransactionMeta</a></code></dt>
<dd></dd>
</dl>

<a name="Conflux"></a>

## Conflux
The Client class that provides an interface to the Conflux network.

**Kind**: global class  

* [Conflux](#Conflux)
    * [new Conflux([options])](#new_Conflux_new)
    * _instance_
        * [.version](#Conflux+version) : <code>string</code>
        * [.provider](#Conflux+provider) : <code>undefined</code> \| <code>undefined</code> \| <code>undefined</code> \| <code>undefined</code>
        * [.wallet](#Conflux+wallet) : <code>undefined</code>
        * ~~[.defaultGasPrice](#Conflux+defaultGasPrice) : <code>number</code> \| <code>string</code>~~
        * [.defaultGasRatio](#Conflux+defaultGasRatio) : <code>number</code>
        * [.defaultStorageRatio](#Conflux+defaultStorageRatio) : <code>number</code>
        * [.pos](#Conflux+pos) : <code>undefined</code>
        * [.trace](#Conflux+trace) : <code>undefined</code>
        * [.txpool](#Conflux+txpool) : <code>undefined</code>
        * [.cfx](#Conflux+cfx) : <code>undefined</code>
        * [.advanced](#Conflux+advanced) : <code>undefined</code>
        * [.request()](#Conflux+request)
        * [.Contract(options)](#Conflux+Contract) ⇒ <code>undefined</code>
        * [.InternalContract(name)](#Conflux+InternalContract) ⇒ <code>undefined</code>
        * [.CRC20(address)](#Conflux+CRC20) ⇒ <code>undefined</code>
        * [.BatchRequest()](#Conflux+BatchRequest) ⇒ <code>undefined</code>
        * [.close()](#Conflux+close)
        * [.updateNetworkId()](#Conflux+updateNetworkId)
        * [.getClientVersion()](#Conflux+getClientVersion) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.getSupplyInfo([epochNumber])](#Conflux+getSupplyInfo) ⇒ <code>Promise.&lt;SupplyInfo&gt;</code>
        * [.getStatus()](#Conflux+getStatus) ⇒ <code>Promise.&lt;ChainStatus&gt;</code>
        * [.getGasPrice()](#Conflux+getGasPrice) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getInterestRate([epochNumber])](#Conflux+getInterestRate) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getAccumulateInterestRate([epochNumber])](#Conflux+getAccumulateInterestRate) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getAccount(address, [epochNumber])](#Conflux+getAccount) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.getBalance(address, [epochNumber])](#Conflux+getBalance) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getStakingBalance(address, [epochNumber])](#Conflux+getStakingBalance) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getNextNonce(address, [epochNumber])](#Conflux+getNextNonce) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.getAdmin(address, [epochNumber])](#Conflux+getAdmin) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.getVoteList(address, [epochNumber])](#Conflux+getVoteList) ⇒ <code>Promise.&lt;Array.&lt;Vote&gt;&gt;</code>
        * [.getDepositList(address, [epochNumber])](#Conflux+getDepositList) ⇒ <code>Promise.&lt;Array.&lt;Deposit&gt;&gt;</code>
        * [.getEpochNumber([epochNumber])](#Conflux+getEpochNumber) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.getBlockByEpochNumber(epochNumber, [detail])](#Conflux+getBlockByEpochNumber) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
        * [.getBlockByBlockNumber(blockNumber, [detail])](#Conflux+getBlockByBlockNumber) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
        * [.getBlocksByEpochNumber(epochNumber)](#Conflux+getBlocksByEpochNumber) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
        * [.getBestBlockHash()](#Conflux+getBestBlockHash) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.getBlockByHash(blockHash, [detail])](#Conflux+getBlockByHash) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
        * [.getConfirmationRiskByHash(blockHash)](#Conflux+getConfirmationRiskByHash) ⇒ <code>Promise.&lt;(number\|null)&gt;</code>
        * [.getTransactionByHash(transactionHash)](#Conflux+getTransactionByHash) ⇒ <code>Promise.&lt;(Transaction\|null)&gt;</code>
        * [.getTransactionReceipt(transactionHash)](#Conflux+getTransactionReceipt) ⇒ <code>Promise.&lt;(TransactionReceipt\|null)&gt;</code>
        * [.sendRawTransaction(hex)](#Conflux+sendRawTransaction) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.sendTransaction(options, [...password])](#Conflux+sendTransaction) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.getCode(address, [epochNumber])](#Conflux+getCode) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.getStorageAt(address, position, [epochNumber])](#Conflux+getStorageAt) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
        * [.getStorageRoot(address, [epochNumber])](#Conflux+getStorageRoot) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getSponsorInfo(address, [epochNumber])](#Conflux+getSponsorInfo) ⇒ <code>Promise.&lt;SponsorInfo&gt;</code>
        * [.getAccountPendingInfo(address)](#Conflux+getAccountPendingInfo) ⇒ <code>Promise.&lt;AccountPendingInfo&gt;</code>
        * [.getAccountPendingTransactions(address)](#Conflux+getAccountPendingTransactions) ⇒ <code>Promise.&lt;AccountPendingTransactions&gt;</code>
        * [.getCollateralForStorage(address, [epochNumber])](#Conflux+getCollateralForStorage) ⇒ <code>Promise.&lt;BigInt&gt;</code>
        * [.call(options, [epochNumber])](#Conflux+call) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.estimateGasAndCollateral(options, [epochNumber])](#Conflux+estimateGasAndCollateral) ⇒ <code>Promise.&lt;EstimateResult&gt;</code>
        * [.estimateGasAndCollateralAdvance(options, [epochNumber])](#Conflux+estimateGasAndCollateralAdvance) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.checkBalanceAgainstTransaction(from, to, gas, gasPrice, storageLimit, [epochNumber])](#Conflux+checkBalanceAgainstTransaction) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getLogs([options])](#Conflux+getLogs) ⇒ <code>Promise.&lt;Array.&lt;Log&gt;&gt;</code>
        * [.traceBlock(blockHash)](#Conflux+traceBlock) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
        * [.traceTransaction(txHash)](#Conflux+traceTransaction) ⇒ <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code>
        * [.traceFilter(filter)](#Conflux+traceFilter) ⇒ <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code>
        * [.getEpochReceipts(epochNumber)](#Conflux+getEpochReceipts) ⇒ <code>Promise.&lt;Array.&lt;Array.&lt;object&gt;&gt;&gt;</code>
        * [.getEpochReceiptsByPivotBlockHash(pivotBlockHash)](#Conflux+getEpochReceiptsByPivotBlockHash) ⇒ <code>Promise.&lt;Array.&lt;Array.&lt;TransactionReceipt&gt;&gt;&gt;</code>
        * [.getPoSEconomics()](#Conflux+getPoSEconomics) ⇒ <code>Promise.&lt;PoSEconomics&gt;</code>
        * [.subscribe(name, ...args)](#Conflux+subscribe) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.subscribeEpochs([sub_epoch])](#Conflux+subscribeEpochs) ⇒ <code>Promise.&lt;Subscription&gt;</code>
        * [.subscribeNewHeads()](#Conflux+subscribeNewHeads) ⇒ <code>Promise.&lt;Subscription&gt;</code>
        * [.subscribeLogs([options])](#Conflux+subscribeLogs) ⇒ <code>Promise.&lt;Subscription&gt;</code>
        * [.unsubscribe(id)](#Conflux+unsubscribe) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.create(options)](#Conflux.create) ⇒ [<code>Conflux</code>](#Conflux)

<a name="new_Conflux_new"></a>

### new Conflux([options])

| Param | Type | Description |
| --- | --- | --- |
| [options] | [<code>ConfluxOption</code>](#ConfluxOption) | Conflux and Provider constructor options. |

**Example**  
```js
> const { Conflux } = require('js-conflux-sdk');
> const conflux = new Conflux({url:'https://test.confluxrpc.com', networkId: 1});
```
**Example**  
```js
> const conflux = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     logger: console,
   });
```
<a name="Conflux+version"></a>

### conflux.version : <code>string</code>
**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+provider"></a>

### conflux.provider : <code>undefined</code> \| <code>undefined</code> \| <code>undefined</code> \| <code>undefined</code>
Provider for rpc call

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+wallet"></a>

### conflux.wallet : <code>undefined</code>
Wallet for `sendTransaction` to get `Account` by `from` field

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+defaultGasPrice"></a>

### ~~conflux.defaultGasPrice : <code>number</code> \| <code>string</code>~~
***Deprecated***

Default gas price for following methods:
- `Conflux.sendTransaction`

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+defaultGasRatio"></a>

### conflux.defaultGasRatio : <code>number</code>
If transaction.gas is undefined, gas will be set by estimate,
cause gas used might be change during `estimateGasAndCollateral` and `sendTransaction`,
estimate value need to multiply by defaultGasRatio (>1.0) in case of gas not enough.

> transaction.gas = estimate.gasUsed * defaultGasRatio

Default gas price for following methods:
- `Conflux.sendTransaction`

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+defaultStorageRatio"></a>

### conflux.defaultStorageRatio : <code>number</code>
If transaction.storageLimit is undefined, storageLimit will be set by estimate,
cause storage limit might be change during `estimateGasAndCollateral` and `sendTransaction`,
estimate value need to multiply by defaultStorageRatio (>1.0) in case of storageLimit not enough.

> transaction.storageLimit = estimate.storageCollateralized * defaultStorageRatio

Default gas price for following methods:
- `Conflux.sendTransaction`

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+pos"></a>

### conflux.pos : <code>undefined</code>
pos RPC methods

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+trace"></a>

### conflux.trace : <code>undefined</code>
trace RPC methods

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+txpool"></a>

### conflux.txpool : <code>undefined</code>
txpool RPC methods

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+cfx"></a>

### conflux.cfx : <code>undefined</code>
cfx RPC methods

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+advanced"></a>

### conflux.advanced : <code>undefined</code>
Advanced RPC compose methods

**Kind**: instance property of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+request"></a>

### conflux.request()
Different kind provider API wrapper

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+Contract"></a>

### conflux.Contract(options) ⇒ <code>undefined</code>
A shout cut for `new Contract(options, conflux);`

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | See [Contract.constructor](Contract.md#Contract.js/constructor) |

<a name="Conflux+InternalContract"></a>

### conflux.InternalContract(name) ⇒ <code>undefined</code>
Create internal contract by default abi and address

- [AdminControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/AdminControl.sol)
- [SponsorWhitelistControl](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/SponsorWhitelistControl.sol)
- [Staking](https://github.com/Conflux-Chain/conflux-rust/blob/master/internal_contract/contracts/Staking.sol)

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>&quot;AdminControl&quot;</code> \| <code>&quot;SponsorWhitelistControl&quot;</code> \| <code>&quot;Staking&quot;</code> \| <code>&quot;ConfluxContext&quot;</code> \| <code>&quot;PoSRegister&quot;</code> \| <code>&quot;CrossSpaceCall&quot;</code> | Internal contract name |

**Example**  
```js
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
<a name="Conflux+CRC20"></a>

### conflux.CRC20(address) ⇒ <code>undefined</code>
Create an token CRC20 contract with standard CRC20 abi

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>undefined</code> - A token contract instance  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="Conflux+BatchRequest"></a>

### conflux.BatchRequest() ⇒ <code>undefined</code>
Return a BatchRequester instance which can used to build batch request and decode response data

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>undefined</code> - - A BatchRequester instance  
<a name="Conflux+close"></a>

### conflux.close()
close connection.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Example**  
```js
> conflux.close();
```
<a name="Conflux+updateNetworkId"></a>

### conflux.updateNetworkId()
Update conflux networkId from RPC

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+getClientVersion"></a>

### conflux.getClientVersion() ⇒ <code>Promise.&lt;string&gt;</code>
Get node client version

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
<a name="Conflux+getSupplyInfo"></a>

### conflux.getSupplyInfo([epochNumber]) ⇒ <code>Promise.&lt;SupplyInfo&gt;</code>
Get supply info

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;SupplyInfo&gt;</code> - Return supply info
- totalIssued `BigInt`: Total issued balance in `Drip`
- totalStaking `BigInt`: Total staking balance in `Drip`
- totalCollateral `BigInt`: Total collateral balance in `Drip`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getSupplyInfo()
   {
     totalCirculating: 28953062500000000000000n,
     totalCollateral: 28953062500000000000000n,
     totalIssued: 5033319899279074765657343554n,
     totalStaking: 25026010834970490328077641n
   }
```
<a name="Conflux+getStatus"></a>

### conflux.getStatus() ⇒ <code>Promise.&lt;ChainStatus&gt;</code>
Get status

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;ChainStatus&gt;</code> - Status information object
- chainId `number`: Chain id
- epochNumber `number`: Epoch number
- blockNumber `number`: Block number
- pendingTxNumber `number`: Pending transaction number
- bestHash `string`: The block hash of best pivot block  
**Example**  
```js
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
<a name="Conflux+getGasPrice"></a>

### conflux.getGasPrice() ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the current price per gas in Drip.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - Gas price in drip.  
**Example**  
```js
> await conflux.getGasPrice();
   1n
```
<a name="Conflux+getInterestRate"></a>

### conflux.getInterestRate([epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the interest rate of given parameter.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - The interest rate of given parameter.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getInterestRate();
   2522880000000n
```
<a name="Conflux+getAccumulateInterestRate"></a>

### conflux.getAccumulateInterestRate([epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the accumulate interest rate of given parameter.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - The accumulate interest rate of given parameter.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getAccumulateInterestRate()
   76357297457647044505744908994993n
```
<a name="Conflux+getAccount"></a>

### conflux.getAccount(address, [epochNumber]) ⇒ <code>Promise.&lt;undefined&gt;</code>
Return account related states of the given account

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;undefined&gt;</code> - Return the states of the given account:
- balance `BigInt`: the balance of the account.
- nonce `BigInt`: the nonce of the account's next transaction.
- codeHash `string`: the code hash of the account.
- stakingBalance `BigInt`: the staking balance of the account.
- collateralForStorage `BigInt`: the collateral storage of the account.
- accumulatedInterestReturn `BigInt`: accumulated unterest return of the account.
- admin `string`: admin of the account.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | address to get account. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
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
<a name="Conflux+getBalance"></a>

### conflux.getBalance(address, [epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the balance of the account of given address.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - The balance in Drip.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | The address to get the balance of. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getBalance("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   824812401057514588670n
```
<a name="Conflux+getStakingBalance"></a>

### conflux.getStakingBalance(address, [epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the balance of the staking account of given address.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - The staking balance in Drip.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to check for staking balance. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getStakingBalance('cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4', 'latest_state');
   0n
```
<a name="Conflux+getNextNonce"></a>

### conflux.getNextNonce(address, [epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the next nonce should be used by given address.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - The next nonce should be used by given address.  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address to get the numbers of transactions from. |
| [epochNumber] | <code>string</code> \| <code>number</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getNextNonce("cfxtest:aasb661u2r60uzn5h0c4h63hj76wtgf552r9ghu7a4");
   1449n
```
<a name="Conflux+getAdmin"></a>

### conflux.getAdmin(address, [epochNumber]) ⇒ <code>Promise.&lt;string&gt;</code>
Returns the admin of given contract.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Address to admin, or `null` if the contract does not exist.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> conflux.getAdmin('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   "CFXTEST:TYPE.USER:AASB661U2R60UZN5H0C4H63HJ76WTGF552R9GHU7A4"
```
<a name="Conflux+getVoteList"></a>

### conflux.getVoteList(address, [epochNumber]) ⇒ <code>Promise.&lt;Array.&lt;Vote&gt;&gt;</code>
Returns vote list of the given account.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Vote&gt;&gt;</code> - Vote list
- `array`:
  - amount `BigInt`: This is the number of tokens should be locked before
  - unlockBlockNumber `number`: This is the timestamp when the vote right will be invalid, measured in, the number of past blocks.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

<a name="Conflux+getDepositList"></a>

### conflux.getDepositList(address, [epochNumber]) ⇒ <code>Promise.&lt;Array.&lt;Deposit&gt;&gt;</code>
Returns deposit list of the given account.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Deposit&gt;&gt;</code> - Deposit list
- `array`:
  - amount `BigInt`: the number of tokens deposited
  - accumulatedInterestRate: `BigInt`: the accumulated interest rate at the time of the deposit
  - depositTime `number`: the time of the deposit  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

<a name="Conflux+getEpochNumber"></a>

### conflux.getEpochNumber([epochNumber]) ⇒ <code>Promise.&lt;number&gt;</code>
Returns the epoch number of given parameter.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;number&gt;</code> - integer of the current epoch number of given parameter.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getEpochNumber();
   443
```
<a name="Conflux+getBlockByEpochNumber"></a>

### conflux.getBlockByEpochNumber(epochNumber, [detail]) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
Returns information about a block by epoch number.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(Block\|null)&gt;</code> - See `getBlockByHash`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| epochNumber | <code>string</code> \| <code>number</code> |  | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |
| [detail] | <code>boolean</code> | <code>false</code> | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions. |

**Example**  
```js
> await conflux.getBlockByEpochNumber('latest_mined', true);
   {...}
```
<a name="Conflux+getBlockByBlockNumber"></a>

### conflux.getBlockByBlockNumber(blockNumber, [detail]) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
Returns information about a block by block number.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(Block\|null)&gt;</code> - See `getBlockByHash`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockNumber | <code>string</code> \| <code>number</code> |  |  |
| [detail] | <code>boolean</code> | <code>false</code> | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions. |

**Example**  
```js
> await conflux.getBlockByBlockNumber('0x123', true);
   {...}
```
<a name="Conflux+getBlocksByEpochNumber"></a>

### conflux.getBlocksByEpochNumber(epochNumber) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns hashes of blocks located in some epoch.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - Array of block hashes, sorted by execution(topological) order.  

| Param | Type | Description |
| --- | --- | --- |
| epochNumber | <code>string</code> \| <code>number</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getBlocksByEpochNumber(0);
   ['0xe677ae5206a5d67d9efa183d867b4b986ed82a3e62174a1488cf8364d58534ec']
```
<a name="Conflux+getBestBlockHash"></a>

### conflux.getBestBlockHash() ⇒ <code>Promise.&lt;string&gt;</code>
Returns the hash of best block.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;string&gt;</code> - hash of the best block.  
**Example**  
```js
> await conflux.getBestBlockHash();
   "0xb8bb355bfeaf055a032d5b7df719917c090ee4fb6fee42383004dfe8911d7daf"
```
<a name="Conflux+getBlockByHash"></a>

### conflux.getBlockByHash(blockHash, [detail]) ⇒ <code>Promise.&lt;(Block\|null)&gt;</code>
Returns information about a block by hash.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(Block\|null)&gt;</code> - A block object, or null when no block was found:
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

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockHash | <code>string</code> |  | hash of a block. |
| [detail] | <code>boolean</code> | <code>false</code> | If `true` it returns the full transaction objects, if `false` only the hashes of the transactions. |

**Example**  
```js
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
<a name="Conflux+getConfirmationRiskByHash"></a>

### conflux.getConfirmationRiskByHash(blockHash) ⇒ <code>Promise.&lt;(number\|null)&gt;</code>
Get the risk of the block could be reverted.
All block in one same epoch returned same risk number

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(number\|null)&gt;</code> - Number >0 and <1  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | Hash of a block |

**Example**  
```js
> await conflux.getConfirmationRiskByHash('0xaf4136d04e9e2cc470703251ec46f5913ab7955d526feed43771705e89c77390')
   1e-8
```
<a name="Conflux+getTransactionByHash"></a>

### conflux.getTransactionByHash(transactionHash) ⇒ <code>Promise.&lt;(Transaction\|null)&gt;</code>
Returns the information about a transaction requested by transaction hash.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(Transaction\|null)&gt;</code> - transaction object, or `null` when no transaction was found:
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

| Param | Type | Description |
| --- | --- | --- |
| transactionHash | <code>string</code> | hash of a transaction |

**Example**  
```js
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
<a name="Conflux+getTransactionReceipt"></a>

### conflux.getTransactionReceipt(transactionHash) ⇒ <code>Promise.&lt;(TransactionReceipt\|null)&gt;</code>
Returns the information about a transaction receipt requested by transaction hash.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(TransactionReceipt\|null)&gt;</code> - A transaction receipt object, or null when no transaction was found or the transaction was not executed yet:
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

| Param | Type | Description |
| --- | --- | --- |
| transactionHash | <code>string</code> | Hash of a transaction |

**Example**  
```js
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
<a name="Conflux+sendRawTransaction"></a>

### conflux.sendRawTransaction(hex) ⇒ <code>Promise.&lt;undefined&gt;</code>
Creates new message call transaction or a contract creation for signed transactions.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;undefined&gt;</code> - The transaction hash, or the zero hash if the transaction is not yet available.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> \| <code>Buffer</code> | The signed transaction data. |

**Example**  
```js
> await conflux.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
```
<a name="Conflux+sendTransaction"></a>

### conflux.sendTransaction(options, [...password]) ⇒ <code>Promise.&lt;undefined&gt;</code>
Sign and send transaction
if `from` field in `conflux.wallet`, sign by local account and send raw transaction,
else call `cfx_sendTransaction` and sign by remote wallet

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;undefined&gt;</code> - The PendingTransaction object.  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>TransactionMeta</code>](#TransactionMeta) | See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**) |
| [...password] | <code>string</code> | Password for remote node. |

**Example**  
```js
> txHash = await conflux.sendTransaction({from:account, to:address, value:0}); // send and get transaction hash
   "0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88"
```
**Example**  
```js
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
**Example**  
```js
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
**Example**  
```js
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
**Example**  
```js
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
<a name="Conflux+getCode"></a>

### conflux.getCode(address, [epochNumber]) ⇒ <code>Promise.&lt;string&gt;</code>
Returns the code of given contract.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Byte code of contract, or 0x if the contract does not exist.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getCode('cfxtest:acb2nsctbanb9ezbw0mx1gapve60thyurjmxkage0f');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```
<a name="Conflux+getStorageAt"></a>

### conflux.getStorageAt(address, position, [epochNumber]) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
Returns storage entries from a given contract.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;(string\|null)&gt;</code> - Storage entry of given query, or null if the it does not exist.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| position | <code>string</code> |  | The given position. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getStorageAt('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c', '0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9')
   "0x000000000000000000000000000000000000000000000000000000000000162e"
```
<a name="Conflux+getStorageRoot"></a>

### conflux.getStorageRoot(address, [epochNumber]) ⇒ <code>Promise.&lt;object&gt;</code>
Returns the storage root of a given contract.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;object&gt;</code> - A storage root object, or `null` if the contract does not exist
- delta `string`: storage root in the delta trie.
- intermediate `string`: storage root in the intermediate trie.
- snapshot `string`: storage root in the snapshot.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getStorageRoot('cfxtest:acdgzwyh9634bnuf4jne0tp3xmae80bwej1w4hr66c')
   {
      "delta": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "intermediate": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshot": "0x7bb7d43152e56f529fbef709aab7371b0672f2332ae0fb4786da350f664df5b4"
   }
```
<a name="Conflux+getSponsorInfo"></a>

### conflux.getSponsorInfo(address, [epochNumber]) ⇒ <code>Promise.&lt;SponsorInfo&gt;</code>
Returns the sponsor info of given contract.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;SponsorInfo&gt;</code> - A sponsor info object, if the contract doesn't have a sponsor, then the all fields in returned object will be 0:
- sponsorBalanceForCollateral `BigInt`: the sponsored balance for storage.
- sponsorBalanceForGas `BigInt`: the sponsored balance for gas.
- sponsorGasBound `BigInt`: the max gas could be sponsored for one transaction.
- sponsorForCollateral `string`: the address of the storage sponsor.
- sponsorForGas `string`: the address of the gas sponsor.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to contract. |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getSponsorInfo('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   {
      sponsorBalanceForCollateral: 410625000000000000000n,
      sponsorBalanceForGas: 9999999993626232440n,
      sponsorGasBound: 10000000000n,
      sponsorForCollateral: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX',
      sponsorForGas: 'CFXTEST:TYPE.CONTRACT:ACGZZ08M8Z2YWKEDA0JZU52FGAZ9U95Y1YV785YANX'
   }
```
<a name="Conflux+getAccountPendingInfo"></a>

### conflux.getAccountPendingInfo(address) ⇒ <code>Promise.&lt;AccountPendingInfo&gt;</code>
Return pending info of an account

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;AccountPendingInfo&gt;</code> - An account pending info object.
- localNonce `BigInt`: then next nonce can use in the transaction pool
- nextPendingTx `string`: the hash of next pending transaction
- pendingCount `BigInt`: the count of pending transactions
- pendingNonce `BigInt`: the nonce of pending transaction  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address to account |

<a name="Conflux+getAccountPendingTransactions"></a>

### conflux.getAccountPendingTransactions(address) ⇒ <code>Promise.&lt;AccountPendingTransactions&gt;</code>
Return pending transactions of one account

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;AccountPendingTransactions&gt;</code> - An account's pending transactions and info.
- pendingTransactions `Array`: pending transactions
- firstTxStatus `Object`: the status of first pending tx
- pendingCount `BigInt`: the count of pending transactions  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 address |

<a name="Conflux+getCollateralForStorage"></a>

### conflux.getCollateralForStorage(address, [epochNumber]) ⇒ <code>Promise.&lt;BigInt&gt;</code>
Returns the size of the collateral storage of given address, in Byte.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;BigInt&gt;</code> - - The collateral storage in Byte.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> |  | Address to check for collateral storage. |
| [epochNumber] |  | <code>&#x27;latest_state&#x27;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

**Example**  
```js
> await conflux.getCollateralForStorage('cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw')
   89375000000000000000n
```
<a name="Conflux+call"></a>

### conflux.call(options, [epochNumber]) ⇒ <code>Promise.&lt;string&gt;</code>
Virtually call a contract, return the output data.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The output data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | [<code>TransactionMeta</code>](#TransactionMeta) |  | See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**) |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

<a name="Conflux+estimateGasAndCollateral"></a>

### conflux.estimateGasAndCollateral(options, [epochNumber]) ⇒ <code>Promise.&lt;EstimateResult&gt;</code>
Virtually call a contract, return the estimate gas used and storage collateralized.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;EstimateResult&gt;</code> - A estimate result object:
- `BigInt` gasUsed: The gas used.
- `BigInt` gasLimit: The gas limit.
- `BigInt` storageCollateralized: The storage collateralized in Byte.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | [<code>TransactionMeta</code>](#TransactionMeta) |  | See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**) |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [format.epochNumber](utils.md#util/format.js/format/(static)epochNumber) |

<a name="Conflux+estimateGasAndCollateralAdvance"></a>

### conflux.estimateGasAndCollateralAdvance(options, [epochNumber]) ⇒ <code>Promise.&lt;object&gt;</code>
Estimate a transaction's gas and storageCollateralize, check whether user's balance is enough for fee and value

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;object&gt;</code> - A estimate result with advance info object:
- `BigInt` gasUsed: The gas used.
- `BigInt` gasLimit: The gas limit.
- `BigInt` storageCollateralized: The storage collateralized in Byte.
- `BigInt` balance: The balance of the options.from.
- `Boolean` isBalanceEnough: indicate balance is enough for gas and storage fee
- `Boolean` isBalanceEnoughForValueAndFee: indicate balance is enough for gas and storage fee plus value
- `Boolean` willPayCollateral: false if the transaction is eligible for storage collateral sponsorship, true otherwise
- `Boolean` willPayTxFee: false if the transaction is eligible for gas sponsorship, true otherwise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | [<code>TransactionMeta</code>](#TransactionMeta) |  | See [estimateGasAndCollateral](#Conflux.js/Conflux/estimateGasAndCollateral) |
| [epochNumber] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;latest_state&#x27;&quot;</code> | See [estimateGasAndCollateral](#Conflux.js/Conflux/estimateGasAndCollateral) |

<a name="Conflux+checkBalanceAgainstTransaction"></a>

### conflux.checkBalanceAgainstTransaction(from, to, gas, gasPrice, storageLimit, [epochNumber]) ⇒ <code>Promise.&lt;object&gt;</code>
Check whether transaction sender's balance is enough for gas and storage fee

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;object&gt;</code> - A check result object:
- `Boolean` isBalanceEnough: indicate balance is enough for gas and storage fee
- `Boolean` willPayCollateral: false if the transaction is eligible for storage collateral sponsorship, true otherwise
- `Boolean` willPayTxFee: false if the transaction is eligible for gas sponsorship, true otherwise  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>string</code> | sender address |
| to | <code>string</code> | target address |
| gas | <code>string</code> \| <code>number</code> | gas limit (in drip) |
| gasPrice | <code>string</code> \| <code>number</code> | gas price (in drip) |
| storageLimit | <code>string</code> \| <code>number</code> | storage limit (in byte) |
| [epochNumber] | <code>string</code> \| <code>number</code> | optional epoch number |

<a name="Conflux+getLogs"></a>

### conflux.getLogs([options]) ⇒ <code>Promise.&lt;Array.&lt;Log&gt;&gt;</code>
Returns logs matching the filter provided.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Log&gt;&gt;</code> - Array of log, that the logs matching the filter provided:
- address `string`: Address this event originated from.
- topics `string[]`: Array of topics.
- data `string`: The data containing non-indexed log parameter.
- blockHash `string`: Hash of the block where the log in.
- epochNumber `number`: Epoch number of the block where the log in.
- transactionHash `string`: Hash of the transaction where the log in.
- transactionIndex `string`: Transaction index in the block.
- logIndex `number`: Log index in block.
- transactionLogIndex `number`: Log index in transaction.  

| Param | Type |
| --- | --- |
| [options] | <code>LogFilter</code> | 

**Example**  
```js
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
<a name="Conflux+traceBlock"></a>

### conflux.traceBlock(blockHash) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Return block's execution trace.

> Note: need RPC server open trace_block method

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Array of transaction traces.  

| Param | Type | Description |
| --- | --- | --- |
| blockHash | <code>string</code> | block hash |

**Example**  
```js
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
<a name="Conflux+traceTransaction"></a>

### conflux.traceTransaction(txHash) ⇒ <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code>
Return transaction's trace

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code> - Array of traces.  

| Param | Type | Description |
| --- | --- | --- |
| txHash | <code>string</code> | transaction hash |

**Example**  
```js
> await conflux.traceTransaction('0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88')
```
<a name="Conflux+traceFilter"></a>

### conflux.traceFilter(filter) ⇒ <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code>
Return traces that satisfy an filter

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Trace&gt;&gt;</code> - Array of traces.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>TraceFilter</code> | trace filters |

**Example**  
```js
> await conflux.traceFilter({
      fromEpoch: 1,
      toEpoch: 100,
      count: 100,
      after: 100,
      blockHashes: ['0xaf0e1d773dee28c95bcfa5480ed663fcc695b32c8c1dd81f57ff61ff09f55f88'],
      actionTypes: ['call_result']
    })
```
<a name="Conflux+getEpochReceipts"></a>

### conflux.getEpochReceipts(epochNumber) ⇒ <code>Promise.&lt;Array.&lt;Array.&lt;object&gt;&gt;&gt;</code>
Return one epoch's all receipts

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Array.&lt;object&gt;&gt;&gt;</code> - Array of array receipts.  

| Param | Type | Description |
| --- | --- | --- |
| epochNumber | <code>number</code> \| <code>string</code> | epoch number |

**Example**  
```js
> await conflux.getEpochReceipts('0x6')
```
<a name="Conflux+getEpochReceiptsByPivotBlockHash"></a>

### conflux.getEpochReceiptsByPivotBlockHash(pivotBlockHash) ⇒ <code>Promise.&lt;Array.&lt;Array.&lt;TransactionReceipt&gt;&gt;&gt;</code>
Return one epoch's all receipts by pivot block hash

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Array.&lt;Array.&lt;TransactionReceipt&gt;&gt;&gt;</code> - Array of array receipts.  

| Param | Type | Description |
| --- | --- | --- |
| pivotBlockHash | <code>string</code> | epoch pivot block hash |

**Example**  
```js
> await conflux.getEpochReceiptsByPivotBlockHash('0x12291776d632d966896b6c580f3201cd2e2a3fd672378fc7965aa7f7058282b2')
```
<a name="Conflux+getPoSEconomics"></a>

### conflux.getPoSEconomics() ⇒ <code>Promise.&lt;PoSEconomics&gt;</code>
Return PoS summary info

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;PoSEconomics&gt;</code> - PoS summary info
- distributablePosInterest `number`: Currently total distributable PoS interest (Drip)
- lastDistributeBlock `number`: Last distribute block number
- totalPosStakingTokens `number`: Total token amount (Drip) staked in PoS  
<a name="Conflux+subscribe"></a>

### conflux.subscribe(name, ...args) ⇒ <code>Promise.&lt;string&gt;</code>
Subscribe event by name and got id, and provider will emit event by id

> Note: suggest use `conflux.subscribeXXX` to subscribe

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Id of subscription  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Subscription name |
| ...args | <code>array</code> | Subscription arguments |

**Example**  
```js
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
<a name="Conflux+subscribeEpochs"></a>

### conflux.subscribeEpochs([sub_epoch]) ⇒ <code>Promise.&lt;Subscription&gt;</code>
The epochs topic streams consensus results: the total order of blocks, as expressed by a sequence of epochs.
The returned series of epoch numbers is monotonically increasing with an increment of one.
If you see the same epoch twice, this suggests a pivot chain reorg has happened (this might happen for recent epochs).
For each epoch, the last hash in epochHashesOrdered is the hash of the pivot block.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Subscription&gt;</code> - EventEmitter instance with the follow events:
- 'data':
  - epochNumber `number`: epoch number
  - epochHashesOrdered `array`: epoch block hash in order
    - `string`: block hash  

| Param | Type | Description |
| --- | --- | --- |
| [sub_epoch] | <code>string</code> | Available values are latest_mined(default value) and latest_state |

**Example**  
```js
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
<a name="Conflux+subscribeNewHeads"></a>

### conflux.subscribeNewHeads() ⇒ <code>Promise.&lt;Subscription&gt;</code>
The newHeads topic streams all new block headers participating in the consensus.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Subscription&gt;</code> - EventEmitter instance with the follow events:
- 'data': see `getBlockByHash`  
**Example**  
```js
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
<a name="Conflux+subscribeLogs"></a>

### conflux.subscribeLogs([options]) ⇒ <code>Promise.&lt;Subscription&gt;</code>
The logs topic streams all logs matching a certain filter, in order.
In case of a pivot chain reorg (which might affect recent logs), a special revert message is sent.
All logs received previously that belong to epochs larger than the one in this message should be considered invalid.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;Subscription&gt;</code> - EventEmitter instance with the follow events:
- 'data': see `getLogs`
- 'revert':
  - revertTo 'number': epoch number  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> |  |
| [options.address] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Search contract addresses. If null, match all. If specified, log must be produced by one of these addresses. |
| [options.topics] | <code>array</code> | Search topics. Logs can have 4 topics: the function signature and up to 3 indexed event arguments. The elements of topics match the corresponding log topics. Example: ["0xA", null, ["0xB", "0xC"], null] matches logs with "0xA" as the 1st topic AND ("0xB" OR "0xC") as the 3rd topic. If null, match all. |

**Example**  
```js
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
**Example**  
```js
> subscription.on('revert', data=>console.log(data))
   { revertTo: 568230 }
   { revertTo: 568231 }
```
<a name="Conflux+unsubscribe"></a>

### conflux.unsubscribe(id) ⇒ <code>Promise.&lt;boolean&gt;</code>
Unsubscribe subscription.

**Kind**: instance method of [<code>Conflux</code>](#Conflux)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Is success  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>Subscription</code> | Subscription id |

**Example**  
```js
> id = await conflux.subscribe('epochs');
> await conflux.unsubscribe(id);
   true
> await conflux.unsubscribe(id);
   false
```
**Example**  
```js
> subscription = await conflux.subscribeLogs();
> await conflux.unsubscribe(subscription);
   true
```
<a name="Conflux.create"></a>

### Conflux.create(options) ⇒ [<code>Conflux</code>](#Conflux)
Create a Conflux instance with networdId set up

**Kind**: static method of [<code>Conflux</code>](#Conflux)  

| Param | Type |
| --- | --- |
| options | [<code>ConfluxOption</code>](#ConfluxOption) | 

<a name="ConfluxOption"></a>

## ConfluxOption : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [options.defaultGasPrice] | <code>string</code> \| <code>number</code> |  | The default gas price in drip to use for transactions. |
| [options.defaultGasRatio] | <code>number</code> | <code>1.1</code> | The ratio to multiply by gas. |
| [options.defaultStorageRatio] | <code>number</code> | <code>1.1</code> | The ratio to multiply by storageLimit. |
| [options.url] | <code>string</code> |  | Url of Conflux node to connect. |
| [options.retry] | <code>number</code> |  | Retry times if request error occurs. |
| [options.timeout] | <code>number</code> |  | Request time out in ms |
| [options.logger] | <code>Object</code> |  | Logger object with 'info' and 'error' method. |
| [options.networkId] | <code>number</code> |  | Connected RPC's networkId |
| [options.useWechatProvider] | <code>boolean</code> |  | Use wechat provider |
| [options.useHexAddressInParameter] | <code>boolean</code> |  | Use hex address in parameter |
| [options.useVerboseAddress] | <code>boolean</code> |  | Use verbose address |

<a name="TransactionMeta"></a>

## TransactionMeta : [<code>TransactionMeta</code>](#TransactionMeta)
**Kind**: global typedef  
