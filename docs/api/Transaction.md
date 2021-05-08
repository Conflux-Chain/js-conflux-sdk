
  - Transaction.js
    - Transaction
        - [**constructor**](#Transaction.js/Transaction/**constructor**)
        - [hash(getter)](#Transaction.js/Transaction/hash(getter))
        - [sign](#Transaction.js/Transaction/sign)
        - [recover](#Transaction.js/Transaction/recover)
        - [encode](#Transaction.js/Transaction/encode)
        - [serialize](#Transaction.js/Transaction/serialize)

----------------------------------------

## Transaction <a id="Transaction.js/Transaction"></a>



### Transaction.prototype.**constructor** <a id="Transaction.js/Transaction/**constructor**"></a>

Create a transaction.

* **Parameters**

Name                 | Type            | Required | Default | Description
---------------------|-----------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options              | `object`        | true     |         |
options.from         | `string`        | false    |         | The sender address.
options.nonce        | `string,number` | false    |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice     | `string,number` | false    |         | The price of gas for this transaction in drip.
options.gas          | `string,number` | false    |         | The amount of gas to use for the transaction (unused gas is refunded).
options.to           | `string`        | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value        | `string,number` | false    |         | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.storageLimit | `string,number` | false    |         | The storage limit specified by the sender.
options.epochHeight  | `string,number` | false    |         | The epoch proposed by the sender. Note that this is NOT the epoch of the block containing this transaction.
options.chainId      | `string,number` | false    |         | The chain ID specified by the sender.
options.data         | `string,Buffer` | false    |         | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r            | `string,Buffer` | false    |         | ECDSA signature r
options.s            | `string,Buffer` | false    |         | ECDSA signature s
options.v            | `number`        | false    |         | ECDSA recovery id

* **Returns**

`Transaction` 

### Transaction.prototype.hash <a id="Transaction.js/Transaction/hash(getter)"></a>

Getter of transaction hash include signature.

> Note: calculate every time.

* **Returns**

`string,undefined` If transaction has r,s,v return hex string, else return undefined.

### Transaction.prototype.sign <a id="Transaction.js/Transaction/sign"></a>

Sign transaction and set 'r','s','v'.

* **Parameters**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | Private key hex string.
networkId  | `number` | true     |         | fullnode's network id.

* **Returns**

`Transaction` 

### Transaction.prototype.recover <a id="Transaction.js/Transaction/recover"></a>

Recover public key from signed Transaction.

* **Returns**

`string` 

### Transaction.prototype.encode <a id="Transaction.js/Transaction/encode"></a>

Encode rlp.

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------
includeSignature | `boolean` | false    | false   | Whether or not to include the signature.

* **Returns**

`Buffer` 

### Transaction.prototype.serialize <a id="Transaction.js/Transaction/serialize"></a>

Get the raw transaction hex string.

* **Returns**

`string` Hex string
  