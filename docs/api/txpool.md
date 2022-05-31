## Classes

<dl>
<dt><a href="#TxPool">TxPool</a></dt>
<dd><p>Class contains txpool RPC methods</p>
</dd>
</dl>

<a name="TxPool"></a>

## TxPool
Class contains txpool RPC methods

**Kind**: global class  
<a name="new_TxPool_new"></a>

### new TxPool(conflux)
TxPool constructor.

**Returns**: [<code>TxPool</code>](#TxPool) - The TxPool instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>Conflux</code> | A Conflux instance |

<a name="nextNonce"></a>

## .nextNonce ⇒ <code>Promise.&lt;number&gt;</code>
Get user next nonce in transaction pool

**Kind**: instance member  
**Returns**: <code>Promise.&lt;number&gt;</code> - The next usable nonce  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address of the account |

**Example** *(Example usage of txpool.nextNonce)*  
```js
await conflux.txpool.nextNonce('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
// returns 100
```
