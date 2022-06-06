<a name="PendingTransaction"></a>

## PendingTransaction
**Kind**: global class  

* [PendingTransaction](#PendingTransaction)
    * [new PendingTransaction(conflux, func, args)](#new_PendingTransaction_new)
    * [.get([options])](#PendingTransaction+get) ⇒ <code>Promise.&lt;(Transaction\|null)&gt;</code>
    * [.mined([options])](#PendingTransaction+mined) ⇒ <code>Promise.&lt;Transaction&gt;</code>
    * [.executed([options])](#PendingTransaction+executed) ⇒ <code>Promise.&lt;TransactionReceipt&gt;</code>
    * [.confirmed([options])](#PendingTransaction+confirmed) ⇒ <code>Promise.&lt;TransactionReceipt&gt;</code>

<a name="new_PendingTransaction_new"></a>

### new PendingTransaction(conflux, func, args)
PendingTransaction constructor.


| Param | Type |
| --- | --- |
| conflux | <code>Conflux</code> | 
| func | <code>function</code> | 
| args | <code>array</code> | 

<a name="PendingTransaction+get"></a>

### pendingTransaction.get([options]) ⇒ <code>Promise.&lt;(Transaction\|null)&gt;</code>
Get transaction by hash.

**Kind**: instance method of [<code>PendingTransaction</code>](#PendingTransaction)  
**Returns**: <code>Promise.&lt;(Transaction\|null)&gt;</code> - See [Conflux.getTransactionByHash](#Conflux.js/getTransactionByHash)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.delay] | <code>number</code> | <code>0</code> | Defer execute after `delay` ms. |

<a name="PendingTransaction+mined"></a>

### pendingTransaction.mined([options]) ⇒ <code>Promise.&lt;Transaction&gt;</code>
Async wait till transaction been mined.

- blockHash !== null

**Kind**: instance method of [<code>PendingTransaction</code>](#PendingTransaction)  
**Returns**: <code>Promise.&lt;Transaction&gt;</code> - See [Conflux.getTransactionByHash](#Conflux.js/getTransactionByHash)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.delta] | <code>number</code> | <code>1000</code> | Loop transaction interval in ms. |
| [options.timeout] | <code>number</code> | <code>60*1000</code> | Loop timeout in ms. |

<a name="PendingTransaction+executed"></a>

### pendingTransaction.executed([options]) ⇒ <code>Promise.&lt;TransactionReceipt&gt;</code>
Async wait till transaction been executed.

- mined
- receipt !== null
- receipt.outcomeStatus === 0

**Kind**: instance method of [<code>PendingTransaction</code>](#PendingTransaction)  
**Returns**: <code>Promise.&lt;TransactionReceipt&gt;</code> - See [Conflux.getTransactionReceipt](#Conflux.js/getTransactionReceipt)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.delta] | <code>number</code> | <code>1000</code> | Loop transaction interval in ms. |
| [options.timeout] | <code>number</code> | <code>5*60*1000</code> | Loop timeout in ms. |

<a name="PendingTransaction+confirmed"></a>

### pendingTransaction.confirmed([options]) ⇒ <code>Promise.&lt;TransactionReceipt&gt;</code>
Async wait till transaction been confirmed.

- executed
- transaction block risk coefficient < threshold

**Kind**: instance method of [<code>PendingTransaction</code>](#PendingTransaction)  
**Returns**: <code>Promise.&lt;TransactionReceipt&gt;</code> - See [Conflux.getTransactionReceipt](#Conflux.js/getTransactionReceipt)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.delta] | <code>number</code> | <code>1000</code> | Loop transaction interval in ms. |
| [options.timeout] | <code>number</code> | <code>30*60*1000</code> | Loop timeout in ms. |
| [options.threshold] | <code>number</code> | <code>1e-8</code> | Number in range (0,1) |

