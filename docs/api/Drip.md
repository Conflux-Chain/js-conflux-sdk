
  - Drip.js
    - Drip
        - [(static)fromCFX](#Drip.js/Drip/(static)fromCFX)
        - [(static)fromGDrip](#Drip.js/Drip/(static)fromGDrip)
        - [**constructor**](#Drip.js/Drip/**constructor**)
        - [toCFX](#Drip.js/Drip/toCFX)
        - [toGDrip](#Drip.js/Drip/toGDrip)

----------------------------------------

## Drip <a id="Drip.js/Drip"></a>

Positive decimal integer string in `Drip`

### Drip.fromCFX <a id="Drip.js/Drip/(static)fromCFX"></a>

Get `Drip` string from `CFX`

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `string,number` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> Drip.fromCFX(3.14)
   [String (Drip): '3140000000000000000']
> Drip.fromCFX('0xab')
   [String (Drip): '171000000000000000000']
```

### Drip.fromGDrip <a id="Drip.js/Drip/(static)fromGDrip"></a>

Get `Drip` string from `GDrip`

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `string,number` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> Drip.fromGDrip(3.14)
   [String (Drip): '3140000000']
> Drip.fromGDrip('0xab')
   [String (Drip): '171000000000']
```

### Drip.prototype.**constructor** <a id="Drip.js/Drip/**constructor**"></a>

* **Parameters**

Name  | Type            | Required | Default | Description
------|-----------------|----------|---------|------------
value | `number,string` | true     |         |

* **Returns**

`Drip` 

* **Examples**

```
> new Drip(1.00)
   [String (Drip): '1']
> new Drip('0xab')
   [String (Drip): '171']
```

### Drip.prototype.toCFX <a id="Drip.js/Drip/toCFX"></a>

Get `CFX` number string

* **Returns**

`string` 

* **Examples**

```
> Drip(1e9).toCFX()
   "0.000000001"
```

### Drip.prototype.toGDrip <a id="Drip.js/Drip/toGDrip"></a>

Get `GDrip` number string

* **Returns**

`string` 

* **Examples**

```
> Drip(1e9).toGDrip()
   "1"
```
  