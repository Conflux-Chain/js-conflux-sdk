- CONST.js
    - [EPOCH_NUMBER](#CONST.js/EPOCH_NUMBER)
    - [MIN_GAS_PRICE](#CONST.js/MIN_GAS_PRICE)
    - [TRANSACTION_GAS](#CONST.js/TRANSACTION_GAS)
    - [TRANSACTION_STORAGE_LIMIT](#CONST.js/TRANSACTION_STORAGE_LIMIT)
    - [MAINNET_ID](#CONST.js/MAINNET_ID)
    - [TESTNET_ID](#CONST.js/TESTNET_ID)
    - [ZERO_ADDRESS_HEX](#CONST.js/ZERO_ADDRESS_HEX)
    - [PENDING_TX_STATUS](#CONST.js/PENDING_TX_STATUS)
- Message.js
    - Message
        - [(static)sign](#Message.js/Message/(static)sign)
        - [(static)recover](#Message.js/Message/(static)recover)
        - [**constructor**](#Message.js/Message/**constructor**)
        - [hash(getter)](#Message.js/Message/hash(getter))
        - [from(getter)](#Message.js/Message/from(getter))
        - [sign](#Message.js/Message/sign)

----------------------------------------

## EPOCH_NUMBER <a id="CONST.js/EPOCH_NUMBER"></a>

epochNumber label

- `LATEST_MINED` 'latest_mined': latest epoch.
- `LATEST_STATE` 'latest_state': latest state, about 5 epoch less then `LATEST_MINED`
- `LATEST_FINALIZED` 'latest_finalized': latest epoch which finalized by PoS chain.
- `LATEST_CONFIRMED` 'latest_confirmed': latest epoch which confirmation risk less 1e-8.
- `LATEST_CHECKPOINT` 'latest_checkpoint': latest check point epoch.
- `EARLIEST` 'earliest': earliest epoch number, same as 0.

----------------------------------------

## MIN_GAS_PRICE <a id="CONST.js/MIN_GAS_PRICE"></a>

`number`

min gas price for transaction

* **Examples**

```
> CONST.MIN_GAS_PRICE
 1
```

----------------------------------------

## TRANSACTION_GAS <a id="CONST.js/TRANSACTION_GAS"></a>

`number`

gas use for pure transfer transaction

* **Examples**

```
> CONST.TRANSACTION_GAS
 21000
```

----------------------------------------

## TRANSACTION_STORAGE_LIMIT <a id="CONST.js/TRANSACTION_STORAGE_LIMIT"></a>

`number`

storage limit for pure transfer transaction

----------------------------------------

## MAINNET_ID <a id="CONST.js/MAINNET_ID"></a>

`number`

mainnet chainId

----------------------------------------

## TESTNET_ID <a id="CONST.js/TESTNET_ID"></a>

`number`

testnet chainId

----------------------------------------

## ZERO_ADDRESS_HEX <a id="CONST.js/ZERO_ADDRESS_HEX"></a>

`string`

zero address

----------------------------------------

## PENDING_TX_STATUS <a id="CONST.js/PENDING_TX_STATUS"></a>

pending transaction status

- `FUTURE_NONCE` 'futureNonce': pending because future nonce
- `NOT_ENOUGH_CASH` 'notEnoughCash': pending because insufficient balance

----------------------------------------

## Message <a id="Message.js/Message"></a>



### Message.sign <a id="Message.js/Message/(static)sign"></a>

Signs the hash with the privateKey.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
privateKey  | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **Returns**

`string` The signature as hex string.

* **Examples**

```
> Message.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
```

### Message.recover <a id="Message.js/Message/(static)recover"></a>

Recovers the signers publicKey from the signature.

* **Parameters**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
signature   | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **Returns**

`string` The publicKey as hex string.

* **Examples**

```
> Message.recover(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
```

### Message.prototype.**constructor** <a id="Message.js/Message/**constructor**"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
message | `string` | true     |         |

* **Returns**

`Message` 

* **Examples**

```
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

### Message.prototype.hash <a id="Message.js/Message/hash(getter)"></a>

Getter of message hash include signature.

> Note: calculate every time.

* **Returns**

`string` 

### Message.prototype.from <a id="Message.js/Message/from(getter)"></a>

Getter of sender address.

> Note: calculate every time.

* **Returns**

`string,undefined` If ECDSA recover success return address, else return undefined.

### Message.prototype.sign <a id="Message.js/Message/sign"></a>

Sign message and set 'r','s','v' and 'hash'.

* **Parameters**

Name       | Type      | Required | Default | Description
-----------|-----------|----------|---------|------------------------
privateKey | `string`  | true     |         | Private key hex string.
networkId  | `Integer` | true     |         | Network id of account

* **Returns**

`Message` 