## Functions

<dl>
<dt><a href="#any">any(arg)</a> ⇒ <code><a href="#any">any</a></code></dt>
<dd><p>Do nothing for the given value.</p>
</dd>
<dt><a href="#uInt">uInt(arg)</a> ⇒ <code>number</code></dt>
<dd><p>format input to number</p>
</dd>
<dt><a href="#bigInt">bigInt(arg)</a> ⇒ <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#bigIntFromBuffer">bigIntFromBuffer(arg)</a> ⇒ <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#bigUInt">bigUInt(arg)</a> ⇒ <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#bigUIntHex">bigUIntHex(arg)</a> ⇒ <code>string</code></dt>
<dd><p>When encoding QUANTITIES (integers, numbers): encode as hex, prefix with &quot;0x&quot;, the most compact representation (slight exception: zero should be represented as &quot;0x0&quot;)</p>
</dd>
<dt><a href="#big">big(arg)</a> ⇒ <code>Big</code></dt>
<dd></dd>
<dt><a href="#fixed64">fixed64(arg)</a> ⇒ <code>Number</code></dt>
<dd></dd>
<dt><a href="#epochNumber">epochNumber(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#hex">hex(arg)</a> ⇒ <code>string</code></dt>
<dd><p>When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with &quot;0x&quot;, two hex digits per byte.</p>
</dd>
<dt><a href="#hex40">hex40(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#address">address(address, networkId, [verbose])</a> ⇒ <code>string</code></dt>
<dd><p>Checks if a given string is a valid address.</p>
</dd>
<dt><a href="#hexAddress">hexAddress(address)</a> ⇒ <code>string</code></dt>
<dd><p>Checks if a given string is a valid hex address.
It will also check the checksum, if the address has upper and lowercase letters.</p>
</dd>
<dt><del><a href="#checksumAddress">checksumAddress(arg)</a> ⇒ <code>string</code></del></dt>
<dd><p>Will convert an upper or lowercase address to a checksum address.</p>
</dd>
<dt><a href="#blockHash">blockHash(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#transactionHash">transactionHash(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#privateKey">privateKey(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#publicKey">publicKey(arg)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#hexBuffer">hexBuffer(arg)</a> ⇒ <code>Buffer</code></dt>
<dd></dd>
<dt><a href="#bytes">bytes(arg)</a> ⇒ <code>Buffer</code></dt>
<dd><p>It can only be in hex format If want to pass a string</p>
</dd>
<dt><a href="#boolean">boolean(arg)</a> ⇒ <code><a href="#boolean">boolean</a></code></dt>
<dd></dd>
<dt><a href="#keccak256">keccak256(arg)</a> ⇒ <code>string</code></dt>
<dd><p>Compute the keccak256 cryptographic hash of a value, returned as a hex string.</p>
</dd>
</dl>

<a name="any"></a>

## any(arg) ⇒ [<code>any</code>](#any)
Do nothing for the given value.

**Kind**: global function  
**Returns**: [<code>any</code>](#any) - arg  

| Param | Type |
| --- | --- |
| arg | [<code>any</code>](#any) | 

**Example**  
```js
> format.any(1)
 1
```
<a name="uInt"></a>

## uInt(arg) ⇒ <code>number</code>
format input to number

**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>BigInt</code> \| <code>string</code> \| [<code>boolean</code>](#boolean) | 

**Example**  
```js
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
<a name="bigInt"></a>

## bigInt(arg) ⇒ <code>BigInt</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>string</code> \| <code>BigInt</code> | 

**Example**  
```js
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
<a name="bigIntFromBuffer"></a>

## bigIntFromBuffer(arg) ⇒ <code>BigInt</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>Buffer</code> | 

<a name="bigUInt"></a>

## bigUInt(arg) ⇒ <code>BigInt</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>string</code> \| <code>BigInt</code> | 

**Example**  
```js
> format.bigUInt('0.0')
 0n
> format.bigUInt('-1')
 Error("not match bigUInt")
```
<a name="bigUIntHex"></a>

## bigUIntHex(arg) ⇒ <code>string</code>
When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>string</code> \| <code>BigInt</code> | 

**Example**  
```js
> format.bigUIntHex(100)
 "0x64"
> format.bigUIntHex('0x0a')
 "0xa"
> format.bigUIntHex(-1))
 Error("not match uintHex")
```
<a name="big"></a>

## big(arg) ⇒ <code>Big</code>
**Kind**: global function  
**Returns**: <code>Big</code> - Big instance  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>string</code> \| <code>BigInt</code> | 

**Example**  
```js
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
<a name="fixed64"></a>

## fixed64(arg) ⇒ <code>Number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>number</code> \| <code>BigInt</code> \| <code>Big</code> | 

**Example**  
```js
> format.fixed64('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
> format.fixed64('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 0.5
```
<a name="epochNumber"></a>

## epochNumber(arg) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>number</code> \| <code>string</code> | number or label, See [EPOCH_NUMBER](Misc.md#CONST.js/EPOCH_NUMBER) |

**Example**  
```js
> format.epochNumber(10)
 "0xa"
> format.epochNumber(EPOCH_NUMBER.LATEST_STATE)
 "latest_state"
> format.epochNumber('latest_mined')
 "latest_mined"
```
<a name="hex"></a>

## hex(arg) ⇒ <code>string</code>
When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>BigInt</code> \| <code>string</code> \| <code>Buffer</code> \| [<code>boolean</code>](#boolean) \| <code>null</code> | 

**Example**  
```js
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
<a name="hex40"></a>

## hex40(arg) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - hex40 address  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

<a name="address"></a>

## address(address, networkId, [verbose]) ⇒ <code>string</code>
Checks if a given string is a valid address.

**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> \| <code>Buffer</code> |  |  |
| networkId | <code>number</code> |  |  |
| [verbose] | [<code>boolean</code>](#boolean) | <code>false</code> | if you want a address with type info, pass true |

**Example**  
```js
> format.address('0x0123456789012345678901234567890123456789', 1)
 "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
```
<a name="hexAddress"></a>

## hexAddress(address) ⇒ <code>string</code>
Checks if a given string is a valid hex address.
It will also check the checksum, if the address has upper and lowercase letters.

**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| address | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.hexAddress('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
> format.hexAddress('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
> format.hexAddress('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
 0x0123456789012345678901234567890123456789
```
<a name="checksumAddress"></a>

## ~~checksumAddress(arg) ⇒ <code>string</code>~~
***Deprecated***

Will convert an upper or lowercase address to a checksum address.

**Kind**: global function  
**Returns**: <code>string</code> - Checksum address hex string  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0X1B716C51381E76900EBAA7999A488511A4E1FD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0x1B716c51381e76900EBAA7999A488511A4E1fD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```
<a name="blockHash"></a>

## blockHash(arg) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```
<a name="transactionHash"></a>

## transactionHash(arg) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```
<a name="privateKey"></a>

## privateKey(arg) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```
<a name="publicKey"></a>

## publicKey(arg) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Hex string  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
```
<a name="hexBuffer"></a>

## hexBuffer(arg) ⇒ <code>Buffer</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>number</code> \| <code>string</code> \| <code>BigInt</code> \| <code>Buffer</code> \| [<code>boolean</code>](#boolean) \| <code>null</code> | 

**Example**  
```js
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
<a name="bytes"></a>

## bytes(arg) ⇒ <code>Buffer</code>
It can only be in hex format If want to pass a string

**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> \| <code>array</code> | 

**Example**  
```js
> format.bytes('0xabcd')
 <Buffer ab cd>
> format.bytes([0, 1])
 <Buffer 00 01>
> format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
```
<a name="boolean"></a>

## boolean(arg) ⇒ [<code>boolean</code>](#boolean)
**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | [<code>boolean</code>](#boolean) | 

**Example**  
```js
> format.boolean(true)
 true
> format.boolean(false)
 false
```
<a name="keccak256"></a>

## keccak256(arg) ⇒ <code>string</code>
Compute the keccak256 cryptographic hash of a value, returned as a hex string.

**Kind**: global function  

| Param | Type |
| --- | --- |
| arg | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
> format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
```
