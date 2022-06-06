## Constants

<dl>
<dt><a href="#WORD_BYTES">WORD_BYTES</a> : <code>number</code></dt>
<dd></dd>
<dt><a href="#WORD_CHARS">WORD_CHARS</a> : <code>number</code></dt>
<dd></dd>
<dt><a href="#UINT_BOUND">UINT_BOUND</a> : <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#MAX_UINT">MAX_UINT</a> : <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#MIN_GAS_PRICE">MIN_GAS_PRICE</a> : <code>number</code></dt>
<dd><p>Min gas price for transaction</p>
</dd>
<dt><a href="#TRANSACTION_GAS">TRANSACTION_GAS</a> : <code>number</code></dt>
<dd><p>Gas use for pure transfer transaction</p>
</dd>
<dt><a href="#TRANSACTION_STORAGE_LIMIT">TRANSACTION_STORAGE_LIMIT</a> : <code>number</code></dt>
<dd><p>Storage limit for pure transfer transaction</p>
</dd>
<dt><a href="#MAINNET_ID">MAINNET_ID</a> : <code>number</code></dt>
<dd><p>Mainnet chainId</p>
</dd>
<dt><a href="#TESTNET_ID">TESTNET_ID</a> : <code>number</code></dt>
<dd><p>Testnet chainId</p>
</dd>
<dt><a href="#ZERO_ADDRESS_HEX">ZERO_ADDRESS_HEX</a> : <code>string</code></dt>
<dd><p>Zero address</p>
</dd>
<dt><a href="#ZERO_HASH">ZERO_HASH</a> : <code>string</code></dt>
<dd></dd>
<dt><a href="#KECCAK_EMPTY">KECCAK_EMPTY</a> : <code>string</code></dt>
<dd><p>KECCAK (i.e. Keccak) hash of the empty bytes string.</p>
</dd>
</dl>

<a name="EPOCH_NUMBER"></a>

## EPOCH\_NUMBER : <code>enum</code>
Enum for epochNumber tag

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| LATEST_MINED | <code>string</code> | <code>&quot;latest_mined&quot;</code> | 
| LATEST_STATE | <code>string</code> | <code>&quot;latest_state&quot;</code> | 
| LATEST_FINALIZED | <code>string</code> | <code>&quot;latest_finalized&quot;</code> | 
| LATEST_CONFIRMED | <code>string</code> | <code>&quot;latest_confirmed&quot;</code> | 
| LATEST_CHECKPOINT | <code>string</code> | <code>&quot;latest_checkpoint&quot;</code> | 
| EARLIEST | <code>string</code> | <code>&quot;earliest&quot;</code> | 

<a name="PENDING_TX_STATUS"></a>

## PENDING\_TX\_STATUS : <code>enum</code>
Pending transaction status

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| FUTURE_NONCE | <code>string</code> | <code>&quot;futureNonce&quot;</code> | 
| NOT_ENOUGH_CASH | <code>string</code> | <code>&quot;notEnoughCash&quot;</code> | 

<a name="ACTION_TYPES"></a>

## ACTION\_TYPES : <code>enum</code>
Enum for trace action types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| CALL | <code>string</code> | <code>&quot;call&quot;</code> | 
| CREATE | <code>string</code> | <code>&quot;create&quot;</code> | 
| CALL_RESULT | <code>string</code> | <code>&quot;call_result&quot;</code> | 
| CREATE_RESULT | <code>string</code> | <code>&quot;create_result&quot;</code> | 
| INTERNAL_TRANSFER_ACTION | <code>string</code> | <code>&quot;internal_transfer_action&quot;</code> | 

<a name="POCKET_ENUM"></a>

## POCKET\_ENUM : <code>enum</code>
Enum for trace pocket types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| BALANCE | <code>string</code> | <code>&quot;balance&quot;</code> | 
| STAKING_BALANCE | <code>string</code> | <code>&quot;staking_balance&quot;</code> | 
| STORAGE_COLLATERAL | <code>string</code> | <code>&quot;storage_collateral&quot;</code> | 
| SPONSOR_BALANCE_FOR_GAS | <code>string</code> | <code>&quot;sponsor_balance_for_gas&quot;</code> | 
| SPONSOR_BALANCE_FOR_COLLATERAL | <code>string</code> | <code>&quot;sponsor_balance_for_collateral&quot;</code> | 
| MINT_BURN | <code>string</code> | <code>&quot;mint_burn&quot;</code> | 
| GAS_PAYMENT | <code>string</code> | <code>&quot;gas_payment&quot;</code> | 

<a name="CALL_TYPES"></a>

## CALL\_TYPES : <code>enum</code>
Enum for trace call types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>string</code> | <code>&quot;none&quot;</code> | 
| CALL | <code>string</code> | <code>&quot;call&quot;</code> | 
| CALL_CODE | <code>string</code> | <code>&quot;callcode&quot;</code> | 
| DELEGATE_CALL | <code>string</code> | <code>&quot;delegatecall&quot;</code> | 
| STATIC_CALL | <code>string</code> | <code>&quot;staticcall&quot;</code> | 

<a name="CREATE_TYPES"></a>

## CREATE\_TYPES : <code>enum</code>
Enum for trace create types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>string</code> | <code>&quot;none&quot;</code> | 
| CREATE | <code>string</code> | <code>&quot;create&quot;</code> | 
| CREATE2 | <code>string</code> | <code>&quot;create2&quot;</code> | 

<a name="SPACE_ENUM"></a>

## SPACE\_ENUM : <code>enum</code>
Enum for space type

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>string</code> | <code>&quot;none&quot;</code> | 
| NATIVE | <code>string</code> | <code>&quot;native&quot;</code> | 
| EVM | <code>string</code> | <code>&quot;evm&quot;</code> | 

<a name="CALL_STATUS"></a>

## CALL\_STATUS : <code>enum</code>
Enum for trace call status

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| SUCCESS | <code>string</code> | <code>&quot;success&quot;</code> | 
| REVERTED | <code>string</code> | <code>&quot;reverted&quot;</code> | 
| FAIL | <code>string</code> | <code>&quot;fail&quot;</code> | 

<a name="TX_STATUS"></a>

## TX\_STATUS : <code>enum</code>
Enum for transaction.status and receipt.outcomeStatus

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| UNEXECUTE | <code>number</code> | <code></code> | 
| SUCCESS | <code>number</code> | <code>0</code> | 
| FAIL | <code>number</code> | <code>1</code> | 
| SKIP | <code>number</code> | <code>2</code> | 

<a name="ADDRESS_TYPES"></a>

## ADDRESS\_TYPES : <code>enum</code>
Enum for address types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| USER | <code>string</code> | <code>&quot;user&quot;</code> | 
| CONTRACT | <code>string</code> | <code>&quot;contract&quot;</code> | 
| BUILTIN | <code>string</code> | <code>&quot;builtin&quot;</code> | 
| NULL | <code>string</code> | <code>&quot;null&quot;</code> | 

<a name="WORD_BYTES"></a>

## WORD\_BYTES : <code>number</code>
**Kind**: global constant  
<a name="WORD_CHARS"></a>

## WORD\_CHARS : <code>number</code>
**Kind**: global constant  
<a name="UINT_BOUND"></a>

## UINT\_BOUND : <code>BigInt</code>
**Kind**: global constant  
<a name="MAX_UINT"></a>

## MAX\_UINT : <code>BigInt</code>
**Kind**: global constant  
<a name="MIN_GAS_PRICE"></a>

## MIN\_GAS\_PRICE : <code>number</code>
Min gas price for transaction

**Kind**: global constant  
**Example**  
```js
> CONST.MIN_GAS_PRICE
 1000000000
```
<a name="TRANSACTION_GAS"></a>

## TRANSACTION\_GAS : <code>number</code>
Gas use for pure transfer transaction

**Kind**: global constant  
**Example**  
```js
> CONST.TRANSACTION_GAS
 21000
```
<a name="TRANSACTION_STORAGE_LIMIT"></a>

## TRANSACTION\_STORAGE\_LIMIT : <code>number</code>
Storage limit for pure transfer transaction

**Kind**: global constant  
**Example**  
```js
> CONST.TRANSACTION_STORAGE_LIMIT
 0
```
<a name="MAINNET_ID"></a>

## MAINNET\_ID : <code>number</code>
Mainnet chainId

**Kind**: global constant  
**Example**  
```js
> CONST.MAINNET_ID
 1029
```
<a name="TESTNET_ID"></a>

## TESTNET\_ID : <code>number</code>
Testnet chainId

**Kind**: global constant  
**Example**  
```js
> CONST.TESTNET_ID
 1
```
<a name="ZERO_ADDRESS_HEX"></a>

## ZERO\_ADDRESS\_HEX : <code>string</code>
Zero address

**Kind**: global constant  
**Example**  
```js
> ZERO_ADDRESS
 0x0000000000000000000000000000000000000000
```
<a name="ZERO_HASH"></a>

## ZERO\_HASH : <code>string</code>
**Kind**: global constant  
<a name="KECCAK_EMPTY"></a>

## KECCAK\_EMPTY : <code>string</code>
KECCAK (i.e. Keccak) hash of the empty bytes string.

**Kind**: global constant  
