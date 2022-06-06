<a name="Account"></a>

## Account
Account abstract class

**Kind**: global class  

* [Account](#Account)
    * [new Account(address)](#new_Account_new)
    * [.signTransaction(options)](#Account+signTransaction) ⇒ <code>Promise.&lt;Transaction&gt;</code>
    * [.signMessage(message)](#Account+signMessage) ⇒ <code>Promise.&lt;Message&gt;</code>
    * [.toString()](#Account+toString) ⇒ <code>string</code>
    * [.toJSON()](#Account+toJSON) ⇒ <code>string</code>

<a name="new_Account_new"></a>

### new Account(address)

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="Account+signTransaction"></a>

### account.signTransaction(options) ⇒ <code>Promise.&lt;Transaction&gt;</code>
**Kind**: instance method of [<code>Account</code>](#Account)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="Account+signMessage"></a>

### account.signMessage(message) ⇒ <code>Promise.&lt;Message&gt;</code>
**Kind**: instance method of [<code>Account</code>](#Account)  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="Account+toString"></a>

### account.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>Account</code>](#Account)  
**Returns**: <code>string</code> - Address as string.  
<a name="Account+toJSON"></a>

### account.toJSON() ⇒ <code>string</code>
**Kind**: instance method of [<code>Account</code>](#Account)  
**Returns**: <code>string</code> - Address as JSON string.  
