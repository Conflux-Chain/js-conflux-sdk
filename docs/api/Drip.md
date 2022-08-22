<a name="Drip"></a>

## Drip
Positive decimal integer string in `Drip`

**Kind**: global class  

* [Drip](#Drip)
    * [new Drip(value)](#new_Drip_new)
    * _instance_
        * [.toCFX()](#Drip+toCFX) ⇒ <code>string</code>
        * [.toGDrip()](#Drip+toGDrip) ⇒ <code>string</code>
    * _static_
        * [.fromCFX(value)](#Drip.fromCFX) ⇒ [<code>Drip</code>](#Drip)
        * [.fromGDrip(value)](#Drip.fromGDrip) ⇒ [<code>Drip</code>](#Drip)

<a name="new_Drip_new"></a>

### new Drip(value)

| Param | Type |
| --- | --- |
| value | <code>number</code> \| <code>string</code> \| <code>BigInt</code> | 

**Example**  
```js
> new Drip(1.00)
   [String (Drip): '1']
> new Drip('0xab')
   [String (Drip): '171']
```
<a name="Drip+toCFX"></a>

### drip.toCFX() ⇒ <code>string</code>
Get `CFX` number string

**Kind**: instance method of [<code>Drip</code>](#Drip)  
**Example**  
```js
> Drip(1e9).toCFX()
   "0.000000001"
```
<a name="Drip+toGDrip"></a>

### drip.toGDrip() ⇒ <code>string</code>
Get `GDrip` number string

**Kind**: instance method of [<code>Drip</code>](#Drip)  
**Example**  
```js
> Drip(1e9).toGDrip()
   "1"
```
<a name="Drip.fromCFX"></a>

### Drip.fromCFX(value) ⇒ [<code>Drip</code>](#Drip)
Get `Drip` string from `CFX`

**Kind**: static method of [<code>Drip</code>](#Drip)  

| Param | Type |
| --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>BigInt</code> | 

**Example**  
```js
> Drip.fromCFX(3.14)
   [String (Drip): '3140000000000000000']
> Drip.fromCFX('0xab')
   [String (Drip): '171000000000000000000']
```
<a name="Drip.fromGDrip"></a>

### Drip.fromGDrip(value) ⇒ [<code>Drip</code>](#Drip)
Get `Drip` string from `GDrip`

**Kind**: static method of [<code>Drip</code>](#Drip)  

| Param | Type |
| --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>BigInt</code> | 

**Example**  
```js
> Drip.fromGDrip(3.14)
   [String (Drip): '3140000000']
> Drip.fromGDrip('0xab')
   [String (Drip): '171000000000']
```
