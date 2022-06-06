## Functions

<dl>
<dt><a href="#keccak256">keccak256(buffer)</a> ⇒ <code>Buffer</code></dt>
<dd><p>keccak 256</p>
</dd>
<dt><del><a href="#checksumAddress">checksumAddress(address)</a> ⇒ <code>string</code></del></dt>
<dd><p>Makes a checksum address</p>
<blockquote>
<p>Note: support <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md">EIP-55</a>
Note: not support <a href="https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md">RSKIP60</a> yet</p>
</blockquote>
</dd>
<dt><a href="#randomBuffer">randomBuffer(size)</a> ⇒ <code>Buffer</code></dt>
<dd><p>gen a random buffer with <code>size</code> bytes.</p>
<blockquote>
<p>Note: call <code>crypto.randomBytes</code></p>
</blockquote>
</dd>
<dt><a href="#randomPrivateKey">randomPrivateKey(entropy)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Gen a random PrivateKey buffer.</p>
</dd>
<dt><a href="#privateKeyToPublicKey">privateKeyToPublicKey(privateKey)</a> ⇒ <code>Buffer</code></dt>
<dd></dd>
<dt><a href="#publicKeyToAddress">publicKeyToAddress(publicKey)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Get account address by public key.</p>
<blockquote>
<p>Account address hex starts with &#39;0x1&#39;</p>
</blockquote>
</dd>
<dt><a href="#privateKeyToAddress">privateKeyToAddress(privateKey)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Get address by private key.</p>
</dd>
<dt><a href="#ecdsaSign">ecdsaSign(hash, privateKey)</a> ⇒ <code>object</code></dt>
<dd><p>Sign ecdsa</p>
</dd>
<dt><a href="#ecdsaRecover">ecdsaRecover(hash, options)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Recover ecdsa</p>
</dd>
<dt><a href="#encrypt">encrypt(privateKey, password)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#decrypt">decrypt(keystoreV3, password)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Decrypt account encrypt info.</p>
</dd>
</dl>

<a name="keccak256"></a>

## keccak256(buffer) ⇒ <code>Buffer</code>
keccak 256

**Kind**: global function  

| Param | Type |
| --- | --- |
| buffer | <code>Buffer</code> | 

**Example**  
```js
> keccak256(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```
<a name="checksumAddress"></a>

## ~~checksumAddress(address) ⇒ <code>string</code>~~
***Deprecated***

Makes a checksum address

> Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
> Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Hex string |

**Example**  
```js
> checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```
<a name="randomBuffer"></a>

## randomBuffer(size) ⇒ <code>Buffer</code>
gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

**Kind**: global function  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

**Example**  
```js
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```
<a name="randomPrivateKey"></a>

## randomPrivateKey(entropy) ⇒ <code>Buffer</code>
Gen a random PrivateKey buffer.

**Kind**: global function  

| Param | Type |
| --- | --- |
| entropy | <code>Buffer</code> | 

**Example**  
```js
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```
**Example**  
```js
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```
<a name="privateKeyToPublicKey"></a>

## privateKeyToPublicKey(privateKey) ⇒ <code>Buffer</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 

<a name="publicKeyToAddress"></a>

## publicKeyToAddress(publicKey) ⇒ <code>Buffer</code>
Get account address by public key.

> Account address hex starts with '0x1'

**Kind**: global function  

| Param | Type |
| --- | --- |
| publicKey | <code>Buffer</code> \| <code>string</code> | 

**Example**  
```js
> publicKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```
<a name="privateKeyToAddress"></a>

## privateKeyToAddress(privateKey) ⇒ <code>Buffer</code>
Get address by private key.

**Kind**: global function  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 

**Example**  
```js
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```
<a name="ecdsaSign"></a>

## ecdsaSign(hash, privateKey) ⇒ <code>object</code>
Sign ecdsa

**Kind**: global function  
**Returns**: <code>object</code> - ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}  

| Param | Type |
| --- | --- |
| hash | <code>Buffer</code> | 
| privateKey | <code>Buffer</code> | 

**Example**  
```js
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```
<a name="ecdsaRecover"></a>

## ecdsaRecover(hash, options) ⇒ <code>Buffer</code>
Recover ecdsa

**Kind**: global function  
**Returns**: <code>Buffer</code> - publicKey  

| Param | Type |
| --- | --- |
| hash | <code>Buffer</code> | 
| options | <code>object</code> | 
| options.r | <code>Buffer</code> | 
| options.s | <code>Buffer</code> | 
| options.v | <code>number</code> | 

**Example**  
```js
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```
<a name="encrypt"></a>

## encrypt(privateKey, password) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - - keystoreV3 object  

| Param | Type |
| --- | --- |
| privateKey | <code>Buffer</code> | 
| password | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> encrypt(Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'), 'password')
 {
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }
```
<a name="decrypt"></a>

## decrypt(keystoreV3, password) ⇒ <code>Buffer</code>
Decrypt account encrypt info.

**Kind**: global function  
**Returns**: <code>Buffer</code> - Buffer of private key  

| Param | Type |
| --- | --- |
| keystoreV3 | <code>object</code> | 
| keystoreV3.version | <code>number</code> | 
| keystoreV3.crypto | <code>object</code> | 
| keystoreV3.crypto.ciphertext | <code>string</code> | 
| keystoreV3.crypto.cipherparams | <code>object</code> | 
| keystoreV3.crypto.cipherparams.iv | <code>string</code> | 
| keystoreV3.crypto.cipher | <code>string</code> | 
| keystoreV3.crypto.kdf | <code>string</code> | 
| keystoreV3.crypto.kdfparams | <code>object</code> | 
| keystoreV3.crypto.kdfparams.dklen | <code>number</code> | 
| keystoreV3.crypto.kdfparams.salt | <code>string</code> | 
| keystoreV3.crypto.kdfparams.n | <code>number</code> | 
| keystoreV3.crypto.kdfparams.r | <code>number</code> | 
| keystoreV3.crypto.kdfparams.p | <code>number</code> | 
| keystoreV3.crypto.mac | <code>string</code> | 
| password | <code>string</code> \| <code>Buffer</code> | 

**Example**  
```js
> decrypt({
    version: 3,
    id: '0bb47ee0-aac3-a006-2717-03877afa15f0',
    address: '1cad0b19bb29d4674531d6f115237e16afce377c',
    crypto: {
      ciphertext: 'a8ec41d2440311ce897bacb6f7942f3235113fa17c4ae6732e032336038a8f73',
      cipherparams: { iv: '85b5e092c1c32129e3d27df8c581514d' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'b662f09bdf6751ac599219732609dceac430bc0629a7906eaa1451555f051ebc',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: 'cc89df7ef6c27d284526a65cabf8e5042cdf1ec1aa4ee36dcf65b965fa34843d'
    }
  }, 'password')
 <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef>
```
