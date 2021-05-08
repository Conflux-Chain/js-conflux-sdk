
  - util
    - format.js
        - format
            - [(static)any](#util/format.js/format/(static)any)
            - [(static)uInt](#util/format.js/format/(static)uInt)
            - [(static)bigInt](#util/format.js/format/(static)bigInt)
            - [(static)bigUInt](#util/format.js/format/(static)bigUInt)
            - [(static)bigUIntHex](#util/format.js/format/(static)bigUIntHex)
            - [(static)big](#util/format.js/format/(static)big)
            - [(static)fixed64](#util/format.js/format/(static)fixed64)
            - [(static)epochNumber](#util/format.js/format/(static)epochNumber)
            - [(static)hex](#util/format.js/format/(static)hex)
            - [(static)address](#util/format.js/format/(static)address)
            - [(static)hexAddress](#util/format.js/format/(static)hexAddress)
            - [(static)checksumAddress](#util/format.js/format/(static)checksumAddress)
            - [(static)blockHash](#util/format.js/format/(static)blockHash)
            - [(static)transactionHash](#util/format.js/format/(static)transactionHash)
            - [(static)privateKey](#util/format.js/format/(static)privateKey)
            - [(static)publicKey](#util/format.js/format/(static)publicKey)
            - [(static)hexBuffer](#util/format.js/format/(static)hexBuffer)
            - [(static)bytes](#util/format.js/format/(static)bytes)
            - [(static)boolean](#util/format.js/format/(static)boolean)
            - [(static)keccak256](#util/format.js/format/(static)keccak256)
    - sign.js
        - [keccak256](#util/sign.js/keccak256)
        - [checksumAddress](#util/sign.js/checksumAddress)
        - [randomBuffer](#util/sign.js/randomBuffer)
        - [randomPrivateKey](#util/sign.js/randomPrivateKey)
        - [privateKeyToPublicKey](#util/sign.js/privateKeyToPublicKey)
        - [publicKeyToAddress](#util/sign.js/publicKeyToAddress)
        - [privateKeyToAddress](#util/sign.js/privateKeyToAddress)
        - [ecdsaSign](#util/sign.js/ecdsaSign)
        - [ecdsaRecover](#util/sign.js/ecdsaRecover)
        - [encrypt](#util/sign.js/encrypt)
        - [decrypt](#util/sign.js/decrypt)

----------------------------------------

#### format.any <a id="util/format.js/format/(static)any"></a>

* **Parameters**

Name | Type  | Required | Default | Description
-----|-------|----------|---------|------------
arg  | `any` | true     |         |

* **Returns**

`any` arg

* **Examples**

```
> format.any(1)
 1
```

#### format.uInt <a id="util/format.js/format/(static)uInt"></a>

* **Parameters**

Name | Type                           | Required | Default | Description
-----|--------------------------------|----------|---------|------------
arg  | `number,BigInt,string,boolean` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
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

#### format.bigInt <a id="util/format.js/format/(static)bigInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
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

#### format.bigUInt <a id="util/format.js/format/(static)bigUInt"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`BigInt` 

* **Examples**

```
> format.bigUInt('0.0')
 0n
> format.bigUInt('-1')
 Error("not match bigUInt")
```

#### format.bigUIntHex <a id="util/format.js/format/(static)bigUIntHex"></a>

When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0")

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.bigUIntHex(100)
 "0x64"
> format.bigUIntHex('0x0a')
 "0xa"
> format.bigUIntHex(-1))
 Error("not match uintHex")
```

#### format.big <a id="util/format.js/format/(static)big"></a>

* **Parameters**

Name | Type                   | Required | Default | Description
-----|------------------------|----------|---------|------------
arg  | `number,string,BigInt` | true     |         |

* **Returns**

`Big` Big instance

* **Examples**

```
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

#### format.fixed64 <a id="util/format.js/format/(static)fixed64"></a>

* **Parameters**

Name | Type                       | Required | Default | Description
-----|----------------------------|----------|---------|------------
arg  | `string,number,BigInt,Big` | true     |         |

* **Returns**

`Number` 

* **Examples**

```
> format.fixed64('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
> format.fixed64('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 0.5
```

#### format.epochNumber <a id="util/format.js/format/(static)epochNumber"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------------------------------------------------------
arg  | `number,string` | true     |         | number or label, See [EPOCH_NUMBER](#CONST.js/EPOCH_NUMBER)

* **Returns**

`string` 

* **Examples**

```
> format.epochNumber(10)
 "0xa"
> format.epochNumber(EPOCH_NUMBER.LATEST_STATE)
 "latest_state"
> format.epochNumber('latest_mined')
 "latest_mined"
```

#### format.hex <a id="util/format.js/format/(static)hex"></a>

When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,BigInt,string,Buffer,boolean,null` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
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

#### format.address <a id="util/format.js/format/(static)address"></a>

Checks if a given string is a valid address.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|------------------------------------------------
address   | `string,Buffer` | true     |         |
networkId | `integer`       | true     |         |
verbose   | `boolean`       | false    | false   | if you want a address with type info, pass true

* **Returns**

`string` Hex string

* **Examples**

```
> format.address('0x0123456789012345678901234567890123456789', 1)
 "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"
> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
```

#### format.hexAddress <a id="util/format.js/format/(static)hexAddress"></a>

Checks if a given string is a valid hex address.
It will also check the checksum, if the address has upper and lowercase letters.

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|------------
address | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.hexAddress('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
> format.hexAddress('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
> format.hexAddress('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
 0x0123456789012345678901234567890123456789
```

#### ~~format.checksumAddress~~ <a id="util/format.js/format/(static)checksumAddress"></a>

Will convert an upper or lowercase address to a checksum address.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Checksum address hex string

* **Examples**

```
> format.checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0X1B716C51381E76900EBAA7999A488511A4E1FD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
> format.checksumAddress('0x1B716c51381e76900EBAA7999A488511A4E1fD0A')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```

#### format.blockHash <a id="util/format.js/format/(static)blockHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.transactionHash <a id="util/format.js/format/(static)transactionHash"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.privateKey <a id="util/format.js/format/(static)privateKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

#### format.publicKey <a id="util/format.js/format/(static)publicKey"></a>

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` Hex string

* **Examples**

```
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
```

#### format.hexBuffer <a id="util/format.js/format/(static)hexBuffer"></a>

* **Parameters**

Name | Type                                       | Required | Default | Description
-----|--------------------------------------------|----------|---------|------------
arg  | `number,string,BigInt,Buffer,boolean,null` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
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

#### format.bytes <a id="util/format.js/format/(static)bytes"></a>

If pass an string it will decode with ASCII encoding

* **Parameters**

Name | Type                  | Required | Default | Description
-----|-----------------------|----------|---------|------------
arg  | `string,Buffer,array` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> format.bytes('abcd')
 <Buffer 61 62 63 64>
> format.bytes([0, 1])
 <Buffer 00 01>
> format.bytes(Buffer.from([0, 1]))
 <Buffer 00 01>
```

#### format.boolean <a id="util/format.js/format/(static)boolean"></a>

* **Parameters**

Name | Type      | Required | Default | Description
-----|-----------|----------|---------|------------
arg  | `boolean` | true     |         |

* **Returns**

`boolean` 

* **Examples**

```
> format.boolean(true)
 true
> format.boolean(false)
 false
```

#### format.keccak256 <a id="util/format.js/format/(static)keccak256"></a>

Compute the keccak256 cryptographic hash of a value, returned as a hex string.

* **Parameters**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **Returns**

`string` 

* **Examples**

```
> format.keccak256('Transfer(address,address,uint256)')
 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
> format.keccak256(Buffer.from([0x42]))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256(format.hexBuffer('0x42'))
 "0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111"
> format.keccak256('0x42') // "0x42" as string and transfer to <Buffer 30 78 34 32> by ascii
 "0x3c1b2d38851281e9a7b59d10973b0c87c340ff1e76bde7d06bf6b9f28df2b8c0"
```

----------------------------------------

### keccak256 <a id="util/sign.js/keccak256"></a>

keccak 256

* **Parameters**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|------------
buffer | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> keccak256(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

----------------------------------------

### ~~checksumAddress~~ <a id="util/sign.js/checksumAddress"></a>

Makes a checksum address

> Note: support [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md)
> Note: not support [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) yet

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         | Hex string

* **Returns**

`string` 

* **Examples**

```
> checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a')
 "0x1B716c51381e76900EBAA7999A488511A4E1fD0a"
```

----------------------------------------

### randomBuffer <a id="util/sign.js/randomBuffer"></a>

gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

* **Parameters**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
size | `number` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```

----------------------------------------

### randomPrivateKey <a id="util/sign.js/randomPrivateKey"></a>

Gen a random PrivateKey buffer.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
entropy | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

----------------------------------------

### privateKeyToPublicKey <a id="util/sign.js/privateKeyToPublicKey"></a>

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

----------------------------------------

### publicKeyToAddress <a id="util/sign.js/publicKeyToAddress"></a>

Get account address by public key.

> Account address hex starts with '0x1'

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
publicKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> publicKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

----------------------------------------

### privateKeyToAddress <a id="util/sign.js/privateKeyToAddress"></a>

Get address by private key.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **Returns**

`Buffer` 

* **Examples**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

### ecdsaSign <a id="util/sign.js/ecdsaSign"></a>

Sign ecdsa

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
hash       | `Buffer` | true     |         |
privateKey | `Buffer` | true     |         |

* **Returns**

`object` ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```

----------------------------------------

### ecdsaRecover <a id="util/sign.js/ecdsaRecover"></a>

Recover ecdsa

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
hash      | `Buffer` | true     |         |
options   | `object` | true     |         |
options.r | `Buffer` | true     |         |
options.s | `Buffer` | true     |         |
options.v | `number` | true     |         |

* **Returns**

`Buffer` publicKey

* **Examples**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

### encrypt <a id="util/sign.js/encrypt"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
privateKey | `Buffer`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
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

----------------------------------------

### decrypt <a id="util/sign.js/decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
keystoreV3 | `object`        | true     |         |
password   | `string,Buffer` | true     |         |

* **Returns**

`Buffer` Buffer of private key

* **Examples**

```
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
  