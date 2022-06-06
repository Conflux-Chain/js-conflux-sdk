## Functions

<dl>
<dt><a href="#encodeCfxAddress encode hex40 address to base32 address">encodeCfxAddress encode hex40 address to base32 address(address, numberId, [verbose])</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#decodeCfxAddress decode base32 address to hex40 address">decodeCfxAddress decode base32 address to hex40 address(address)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#isValidCfxAddress check if the address is valid">isValidCfxAddress check if the address is valid(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#verifyCfxAddress verify base32 address if pass return true if not throw error">verifyCfxAddress verify base32 address if pass return true if not throw error(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#hasNetworkPrefix check if the address has network prefix">hasNetworkPrefix check if the address has network prefix(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#simplifyCfxAddress simplify base32 address to non verbose address">simplifyCfxAddress simplify base32 address to non verbose address(address)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#shortenCfxAddress">shortenCfxAddress(address)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#isZeroAddress">isZeroAddress(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isInternalContractAddress">isInternalContractAddress(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isValidHexAddress">isValidHexAddress(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isValidCfxHexAddress check if the address is valid conflux hex address">isValidCfxHexAddress check if the address is valid conflux hex address(address)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
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

<a name="encodeCfxAddress encode hex40 address to base32 address"></a>

## encodeCfxAddress encode hex40 address to base32 address(address, numberId, [verbose]) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - base32 string address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> \| <code>Buffer</code> | hex40 address |
| numberId | <code>number</code> | networkId |
| [verbose] | <code>boolean</code> | if true, return verbose address |

<a name="decodeCfxAddress decode base32 address to hex40 address"></a>

## decodeCfxAddress decode base32 address to hex40 address(address) ⇒ <code>object</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="isValidCfxAddress check if the address is valid"></a>

## isValidCfxAddress check if the address is valid(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="verifyCfxAddress verify base32 address if pass return true if not throw error"></a>

## verifyCfxAddress verify base32 address if pass return true if not throw error(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="hasNetworkPrefix check if the address has network prefix"></a>

## hasNetworkPrefix check if the address has network prefix(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="simplifyCfxAddress simplify base32 address to non verbose address"></a>

## simplifyCfxAddress simplify base32 address to non verbose address(address) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - return a non verbose address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="shortenCfxAddress"></a>

## shortenCfxAddress(address) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - Return a short address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="isZeroAddress"></a>

## isZeroAddress(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="isInternalContractAddress"></a>

## isInternalContractAddress(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | base32 string |

<a name="isValidHexAddress"></a>

## isValidHexAddress(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | hex string |

<a name="isValidCfxHexAddress check if the address is valid conflux hex address"></a>

## isValidCfxHexAddress check if the address is valid conflux hex address(address) ⇒ <code>boolean</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | hex string |

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
