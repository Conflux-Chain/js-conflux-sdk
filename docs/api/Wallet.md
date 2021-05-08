
  - wallet
    - PrivateKeyAccount.js
        - PrivateKeyAccount
            - [(static)random](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random)
            - [(static)decrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt)
            - [**constructor**](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**)
            - [encrypt](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt)
            - [signTransaction](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction)
            - [signMessage](#wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage)
    - Wallet.js
        - Wallet
            - [has](#wallet/Wallet.js/Wallet/has)
            - [delete](#wallet/Wallet.js/Wallet/delete)
            - [clear](#wallet/Wallet.js/Wallet/clear)
            - [set](#wallet/Wallet.js/Wallet/set)
            - [get](#wallet/Wallet.js/Wallet/get)
            - [addPrivateKey](#wallet/Wallet.js/Wallet/addPrivateKey)
            - [addRandom](#wallet/Wallet.js/Wallet/addRandom)
            - [addKeystore](#wallet/Wallet.js/Wallet/addKeystore)

----------------------------------------

### PrivateKeyAccount <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount"></a>



#### PrivateKeyAccount.random <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)random"></a>

Create a new PrivateKeyAccount with random privateKey.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|--------------------------
entropy   | `string,Buffer` | false    |         | Entropy of random account
networkId | `Integer`       | false    |         | network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.random()
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: 'cfxtest:aass3rfcwjz1ab9cg5rtbv61531fmwnsuuy8c26f20'
    }
> PrivateKeyAccount.random() // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: 'cfxtest:aanpezyvznsdg29zu20wpudwnbhx7t4gcpzcnkzjd2'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: 'cfxtest:aajx4wn2kwarr8h71uf880w40dp6x91feac1n6ur3s'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
// gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: 'cfxtest:aat0h9htkmzjvub61rsk9p4n64s863suza6zu7d2rr'
    }
```

#### PrivateKeyAccount.decrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/(static)decrypt"></a>

Decrypt account encrypt info.

* **Parameters**

Name      | Type            | Required | Default | Description
----------|-----------------|----------|---------|---------------------------------------
keystore  | `object`        | true     |         | Keystore version 3 object.
password  | `string,Buffer` | true     |         | Password for keystore to decrypt with.
networkId | `Integer`       | true     |         | Network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> PrivateKeyAccount.decrypt({
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
  }, 'password');
   PrivateKeyAccount {
    address: '0x1cad0b19bb29d4674531d6f115237e16afce377c',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.**constructor** <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/**constructor**"></a>

Create a account by privateKey.

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account
networkId  | `Integer`       | true     |         | Network id of account

* **Returns**

`PrivateKeyAccount` 

* **Examples**

```
> new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   PrivateKeyAccount {
    address: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```

#### PrivateKeyAccount.prototype.encrypt <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/encrypt"></a>

Encrypt account privateKey to object.

* **Parameters**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
password | `string` | true     |         |

* **Returns**

`object` - keystoreV3 object

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> account.encrypt('password')
   {version:3, id:..., address:..., crypto:...}
```

#### PrivateKeyAccount.prototype.signTransaction <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signTransaction"></a>

Sign a transaction.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|----------------------------------------------
options | `object` | true     |         | See [Transaction](Transaction.js/constructor)

* **Returns**

`Promise.<Transaction>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> transaction = account.signTransaction({
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
    })

   Transaction {
      from: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
      nonce: 0,
      gasPrice: 100,
      gas: 10000,
      to: undefined,
      value: undefined,
      storageLimit: 10000,
      epochHeight: 100,
      chainId: 0,
      data: undefined,
      v: 0,
      r: '0x096f4e00ac15f6bd6e09937e99f0e54aaa2dd0f4c6bd8421e1e81b0e8bd30723',
      s: '0x41e63a41ede0cbb8ccfaa827423c654dcdc09fb1aa1c3a7233566544aff4cd9a'
    }
```

#### PrivateKeyAccount.prototype.signMessage <a id="wallet/PrivateKeyAccount.js/PrivateKeyAccount/signMessage"></a>

Sign a string.

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
options | `string` | true     |         |

* **Returns**

`Promise.<Message>` 

* **Examples**

```
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> message = account.signMessage('Hello World')
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```

----------------------------------------

### Wallet <a id="wallet/Wallet.js/Wallet"></a>

Wallet to manager accounts.

#### Wallet.prototype.has <a id="wallet/Wallet.js/Wallet/has"></a>

Check if address exist

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.delete <a id="wallet/Wallet.js/Wallet/delete"></a>

Drop one account by address

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`boolean` 

#### Wallet.prototype.clear <a id="wallet/Wallet.js/Wallet/clear"></a>

Drop all account in wallet

#### Wallet.prototype.set <a id="wallet/Wallet.js/Wallet/set"></a>

* **Parameters**

Name    | Type      | Required | Default | Description
--------|-----------|----------|---------|-------------------------------------
address | `string`  | true     |         | Key of account, usually is `address`
account | `Account` | true     |         | Account instance

* **Returns**

`Wallet` 

#### Wallet.prototype.get <a id="wallet/Wallet.js/Wallet/get"></a>

* **Parameters**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         |

* **Returns**

`Account` 

#### Wallet.prototype.addPrivateKey <a id="wallet/Wallet.js/Wallet/addPrivateKey"></a>

* **Parameters**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|-----------------------
privateKey | `string,Buffer` | true     |         | Private key of account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addRandom <a id="wallet/Wallet.js/Wallet/addRandom"></a>

* **Parameters**

Name    | Type            | Required | Default | Description
--------|-----------------|----------|---------|--------------------------
entropy | `string,Buffer` | false    |         | Entropy of random account

* **Returns**

`PrivateKeyAccount` 

#### Wallet.prototype.addKeystore <a id="wallet/Wallet.js/Wallet/addKeystore"></a>

* **Parameters**

Name     | Type            | Required | Default | Description
---------|-----------------|----------|---------|---------------------------------------
keystore | `object`        | true     |         | Keystore version 3 object.
password | `string,Buffer` | true     |         | Password for keystore to decrypt with.

* **Returns**

`PrivateKeyAccount` 
  