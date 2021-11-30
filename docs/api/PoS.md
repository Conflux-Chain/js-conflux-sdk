## Classes

<dl>
<dt><a href="#TxPool">TxPool</a></dt>
<dd><p>Class contains txpool RPC methods</p>
</dd>
<dt><a href="#PoS">PoS</a></dt>
<dd><p>Class contains pos RPC methods</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#nextNonce">nextNonce</a> ⇒ <code>Promise.&lt;number&gt;</code></dt>
<dd><p>Get user next nonce in txpool</p>
</dd>
<dt><a href="#getStatus">getStatus</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccount">getAccount</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getBlockByHash">getBlockByHash</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getBlockByNumber">getBlockByNumber</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommittee">getCommittee</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getTransactionByNumber">getTransactionByNumber</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getRewardsByEpoch">getRewardsByEpoch</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
</dl>

<a name="TxPool"></a>

## TxPool
Class contains txpool RPC methods

**Kind**: global class  
<a name="new_TxPool_new"></a>

### new TxPool(conflux)
TxPool constructor.

**Returns**: <code>object</code> - The TxPool instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>object</code> | A Conflux instance |

<a name="PoS"></a>

## PoS
Class contains pos RPC methods

**Kind**: global class  
<a name="new_PoS_new"></a>

### new PoS(conflux)
Create PoS instance

**Returns**: <code>object</code> - The PoS instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>object</code> | The Conflux object |

<a name="nextNonce"></a>

## nextNonce ⇒ <code>Promise.&lt;number&gt;</code>
Get user next nonce in txpool

**Kind**: global variable  
**Returns**: <code>Promise.&lt;number&gt;</code> - - The next usable nonce  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address of the account |

<a name="getStatus"></a>

## getStatus ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  
**Returns**: <code>Promise.&lt;Object&gt;</code> - PoS status object  
<a name="getAccount"></a>

## getAccount ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>Hash</code> | Account address |
| [blockNumber] | <code>BlockNumber</code> | Optional block number |

<a name="getBlockByHash"></a>

## getBlockByHash ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Hash</code> | The hash of PoS block |

<a name="getBlockByNumber"></a>

## getBlockByNumber ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| blockNumber | <code>BlockNumber</code> | The number of PoS block |

<a name="getCommittee"></a>

## getCommittee ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| [blockNumber] | <code>BlockNumber</code> | Optional block number |

<a name="getTransactionByNumber"></a>

## getTransactionByNumber ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| txNumber | <code>TransactionNumber</code> | The number of transaction |

<a name="getRewardsByEpoch"></a>

## getRewardsByEpoch ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| epoch | <code>Epoch</code> | A PoS epoch number |

