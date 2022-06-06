## Classes

<dl>
<dt><a href="#Transaction">Transaction</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TransactionMeta">TransactionMeta</a> : <code>CallRequest</code></dt>
<dd></dd>
</dl>

<a name="Transaction"></a>

## Transaction
**Kind**: global class  

* [Transaction](#Transaction)
    * [new Transaction(options)](#new_Transaction_new)
    * _instance_
        * [.hash](#Transaction+hash) ⇒ <code>string</code> \| <code>undefined</code>
        * [.sign(privateKey, networkId)](#Transaction+sign) ⇒ [<code>Transaction</code>](#Transaction)
        * [.recover()](#Transaction+recover) ⇒ <code>string</code>
        * [.encode([includeSignature])](#Transaction+encode) ⇒ <code>Buffer</code>
        * [.serialize()](#Transaction+serialize) ⇒ <code>string</code>
    * _static_
        * [.decodeRaw(raw)](#Transaction.decodeRaw) ⇒ [<code>Transaction</code>](#Transaction)

<a name="new_Transaction_new"></a>

### new Transaction(options)
Create a transaction.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.from] | <code>string</code> | The sender address. |
| [options.nonce] | <code>string</code> \| <code>number</code> | This allows to overwrite your own pending transactions that use the same nonce. |
| [options.gasPrice] | <code>string</code> \| <code>number</code> | The price of gas for this transaction in drip. |
| [options.gas] | <code>string</code> \| <code>number</code> | The amount of gas to use for the transaction (unused gas is refunded). |
| [options.to] | <code>string</code> | The destination address of the message, left undefined for a contract-creation transaction. |
| [options.value] | <code>string</code> \| <code>number</code> | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction. |
| [options.storageLimit] | <code>string</code> \| <code>number</code> | The storage limit specified by the sender. |
| [options.epochHeight] | <code>string</code> \| <code>number</code> | The epoch proposed by the sender. Note that this is NOT the epoch of the block containing this transaction. |
| [options.chainId] | <code>string</code> \| <code>number</code> | The chain ID specified by the sender. |
| [options.data] | <code>string</code> \| <code>Buffer</code> | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code. |
| [options.r] | <code>string</code> \| <code>Buffer</code> | ECDSA signature r |
| [options.s] | <code>string</code> \| <code>Buffer</code> | ECDSA signature s |
| [options.v] | <code>number</code> | ECDSA recovery id |

<a name="Transaction+hash"></a>

### transaction.hash ⇒ <code>string</code> \| <code>undefined</code>
Getter of transaction hash include signature.

> Note: calculate every time.

**Kind**: instance property of [<code>Transaction</code>](#Transaction)  
**Returns**: <code>string</code> \| <code>undefined</code> - If transaction has r,s,v return hex string, else return undefined.  
<a name="Transaction+sign"></a>

### transaction.sign(privateKey, networkId) ⇒ [<code>Transaction</code>](#Transaction)
Sign transaction and set 'r','s','v'.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Private key hex string. |
| networkId | <code>number</code> | fullnode's network id. |

<a name="Transaction+recover"></a>

### transaction.recover() ⇒ <code>string</code>
Recover public key from signed Transaction.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
<a name="Transaction+encode"></a>

### transaction.encode([includeSignature]) ⇒ <code>Buffer</code>
Encode rlp.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [includeSignature] | <code>boolean</code> | <code>false</code> | Whether or not to include the signature. |

<a name="Transaction+serialize"></a>

### transaction.serialize() ⇒ <code>string</code>
Get the raw transaction hex string.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: <code>string</code> - Hex string  
<a name="Transaction.decodeRaw"></a>

### Transaction.decodeRaw(raw) ⇒ [<code>Transaction</code>](#Transaction)
Decode rlp encoded raw transaction hex string

**Kind**: static method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>Transaction</code>](#Transaction) - A Transaction instance  

| Param | Type | Description |
| --- | --- | --- |
| raw | <code>string</code> | rlp encoded transaction hex string |

<a name="TransactionMeta"></a>

## TransactionMeta : <code>CallRequest</code>
**Kind**: global typedef  
