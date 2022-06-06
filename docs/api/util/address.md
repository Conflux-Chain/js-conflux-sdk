## Functions

<dl>
<dt><a href="#ethChecksumAddress">ethChecksumAddress(address)</a> ⇒ <code>string</code></dt>
<dd><p>Makes a ethereum checksum address</p>
<blockquote>
<p>Note: support <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md">EIP-55</a>
Note: not support <a href="https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md">RSKIP60</a> yet</p>
</blockquote>
</dd>
<dt><a href="#ethAddressToCfxAddress">ethAddressToCfxAddress(address)</a> ⇒ <code>string</code></dt>
<dd><p>Convert an ethereum address to conflux hex address by replace it&#39;s first letter to 1</p>
</dd>
<dt><a href="#cfxMappedEVMSpaceAddress">cfxMappedEVMSpaceAddress(address)</a> ⇒ <code>string</code></dt>
<dd><p>Calculate CFX space address&#39;s mapped EVM address</p>
</dd>
</dl>

<a name="ethChecksumAddress"></a>

## ethChecksumAddress(address) ⇒ <code>string</code>
Makes a ethereum checksum address

> Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
> Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Hex string |

**Example**  
```js
> ethChecksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```
<a name="ethAddressToCfxAddress"></a>

## ethAddressToCfxAddress(address) ⇒ <code>string</code>
Convert an ethereum address to conflux hex address by replace it's first letter to 1

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="cfxMappedEVMSpaceAddress"></a>

## cfxMappedEVMSpaceAddress(address) ⇒ <code>string</code>
Calculate CFX space address's mapped EVM address

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

**Example**  
```js
> cfxMappedEVMSpaceAddress(cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91)
"0x12Bf6283CcF8Ad6ffA63f7Da63EDc217228d839A"
```
