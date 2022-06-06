<a name="PersonalMessage"></a>

## PersonalMessage
**Kind**: global class  

* [PersonalMessage](#PersonalMessage)
    * [new PersonalMessage(message)](#new_PersonalMessage_new)
    * [.personalMessage(message)](#PersonalMessage.personalMessage) ⇒ <code>string</code>
    * [.personalHash(message)](#PersonalMessage.personalHash) ⇒ <code>string</code>
    * [.sign(privateKey, message)](#PersonalMessage.sign) ⇒ <code>string</code>
    * [.recover(signature, message)](#PersonalMessage.recover) ⇒ <code>string</code>
    * [.recoverPortalPersonalSign(signature, message)](#PersonalMessage.recoverPortalPersonalSign) ⇒ <code>string</code>

<a name="new_PersonalMessage_new"></a>

### new PersonalMessage(message)
Assemble the personal message hash


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> \| <code>Buffer</code> | The origin message |

<a name="PersonalMessage.personalMessage"></a>

### PersonalMessage.personalMessage(message) ⇒ <code>string</code>
Assemble the personal message

**Kind**: static method of [<code>PersonalMessage</code>](#PersonalMessage)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> \| <code>Buffer</code> | The origin message |

<a name="PersonalMessage.personalHash"></a>

### PersonalMessage.personalHash(message) ⇒ <code>string</code>
Assemble the personal message hash

**Kind**: static method of [<code>PersonalMessage</code>](#PersonalMessage)  
**Returns**: <code>string</code> - The personal message hash  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> \| <code>Buffer</code> | The origin message |

<a name="PersonalMessage.sign"></a>

### PersonalMessage.sign(privateKey, message) ⇒ <code>string</code>
Signs the hash with the privateKey.

**Kind**: static method of [<code>PersonalMessage</code>](#PersonalMessage)  
**Returns**: <code>string</code> - The signature as hex string.  

| Param | Type |
| --- | --- |
| privateKey | <code>string</code> \| <code>Buffer</code> | 
| message | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> PersonalMessage.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   'Hello world!',
   )
   "0xa2d98c5d47b35ba4ebdf03e2d9496312355dccc609bf38c93f19cc9f970e131d0e95504eb3c786714ab703f6924876704bc44bb71680802a87b4c4d2599ac96a00"
```
<a name="PersonalMessage.recover"></a>

### PersonalMessage.recover(signature, message) ⇒ <code>string</code>
Recovers the signers publicKey from the signature.

**Kind**: static method of [<code>PersonalMessage</code>](#PersonalMessage)  
**Returns**: <code>string</code> - The publicKey as hex string.  

| Param | Type |
| --- | --- |
| signature | <code>string</code> \| <code>Buffer</code> | 
| message | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> PersonalMessage.recover(
   '0xa2d98c5d47b35ba4ebdf03e2d9496312355dccc609bf38c93f19cc9f970e131d0e95504eb3c786714ab703f6924876704bc44bb71680802a87b4c4d2599ac96a00',
   'Hello world!',
   )
   "0x5e3eb3a2fbe124c62b382f078a1766c5b0b1306c38a496aa49e3702024a06cffe9da86ab15e4d017b6ef12794e9fe1751ce261a7b7c03be0c5b81ab9b040668a"
```
<a name="PersonalMessage.recoverPortalPersonalSign"></a>

### PersonalMessage.recoverPortalPersonalSign(signature, message) ⇒ <code>string</code>
Recovers the wallet signers publicKey from the signature.

**Kind**: static method of [<code>PersonalMessage</code>](#PersonalMessage)  
**Returns**: <code>string</code> - The publicKey as hex string.  

| Param | Type |
| --- | --- |
| signature | <code>string</code> | 
| message | <code>string</code> | 

**Example**  
```js
> PersonalMessage.recoverPortalPersonalSign(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"

   > PersonalMessage.recoverPortalPersonalSign(
   '0x5f8499879ce281ff083f5716de68ab6d05b176edbb27b6c5882ab482dc00478e33679f15a30bc60510faab49c2bd0bf883ad0a45ad3160e424b35cddcc1ee85d1c',
   'Hello World',
   )
   "0x41f3b66efde8121599072d1c215c88682f491c4f9e3b2345667a3f9f4adb8449b3de23832f435f4d923872ed043449ee7843a0bfc3594c46c982ab5297009f78"
```
