<a name="Message"></a>

## Message
Class provide message sign utilities.

**Kind**: global class  

* [Message](#Message)
    * [new Message(message)](#new_Message_new)
    * _instance_
        * [.hash](#Message+hash) ⇒ <code>string</code>
        * [.from](#Message+from) ⇒ <code>string</code> \| <code>undefined</code>
        * [.r](#Message+r) ⇒ <code>string</code>
        * [.s](#Message+s) ⇒ <code>string</code>
        * [.v](#Message+v) ⇒ <code>number</code>
        * [.sign(privateKey, networkId)](#Message+sign) ⇒ [<code>Message</code>](#Message)
    * _static_
        * [.sign(privateKey, messageHash)](#Message.sign) ⇒ <code>string</code>
        * [.recover(signature, messageHash)](#Message.recover) ⇒ <code>string</code>

<a name="new_Message_new"></a>

### new Message(message)

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

**Example**  
```js
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
<a name="Message+hash"></a>

### message.hash ⇒ <code>string</code>
Getter of message hash include signature.

> Note: calculate every time.

**Kind**: instance property of [<code>Message</code>](#Message)  
<a name="Message+from"></a>

### message.from ⇒ <code>string</code> \| <code>undefined</code>
Getter of sender address.

> Note: calculate every time.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> \| <code>undefined</code> - If ECDSA recover success return address, else return undefined.  
<a name="Message+r"></a>

### message.r ⇒ <code>string</code>
Get signatures r

**Kind**: instance property of [<code>Message</code>](#Message)  
<a name="Message+s"></a>

### message.s ⇒ <code>string</code>
Get signatures s

**Kind**: instance property of [<code>Message</code>](#Message)  
<a name="Message+v"></a>

### message.v ⇒ <code>number</code>
Get signatures v

**Kind**: instance property of [<code>Message</code>](#Message)  
<a name="Message+sign"></a>

### message.sign(privateKey, networkId) ⇒ [<code>Message</code>](#Message)
Sign message and set 'r','s','v' and 'hash'.

**Kind**: instance method of [<code>Message</code>](#Message)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Private key hex string. |
| networkId | <code>number</code> | Network id of account |

<a name="Message.sign"></a>

### Message.sign(privateKey, messageHash) ⇒ <code>string</code>
Signs the hash with the privateKey.

**Kind**: static method of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The signature as hex string.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> \| <code>Buffer</code> | Private key used to sign message |
| messageHash | <code>string</code> \| <code>Buffer</code> | The message hash need to be signed |

**Example**  
```js
> Message.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
```
<a name="Message.recover"></a>

### Message.recover(signature, messageHash) ⇒ <code>string</code>
Recovers the signers publicKey from the signature.

**Kind**: static method of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The publicKey as hex string.  

| Param | Type |
| --- | --- |
| signature | <code>string</code> \| <code>Buffer</code> | 
| messageHash | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> Message.recover(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
```
