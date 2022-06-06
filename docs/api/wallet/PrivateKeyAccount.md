<a name="PrivateKeyAccount"></a>

## PrivateKeyAccount
**Kind**: global class  

* [PrivateKeyAccount](#PrivateKeyAccount)
    * [new PrivateKeyAccount(privateKey, networkId)](#new_PrivateKeyAccount_new)
    * _instance_
        * [.encrypt(password)](#PrivateKeyAccount+encrypt) ⇒ <code>object</code>
        * [.signTransaction(options)](#PrivateKeyAccount+signTransaction) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.signMessage(options)](#PrivateKeyAccount+signMessage) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * _static_
        * [.random(entropy, networkId)](#PrivateKeyAccount.random) ⇒ [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)
        * [.decrypt(keystore, password, networkId)](#PrivateKeyAccount.decrypt) ⇒ [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)

<a name="new_PrivateKeyAccount_new"></a>

### new PrivateKeyAccount(privateKey, networkId)
Create a account by privateKey.


| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> \| <code>Buffer</code> | Private key of account |
| networkId | <code>number</code> | Network id of account |

**Example**  
```js
> new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
   PrivateKeyAccount {
    address: 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7',
    publicKey: '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
```
<a name="PrivateKeyAccount+encrypt"></a>

### privateKeyAccount.encrypt(password) ⇒ <code>object</code>
Encrypt account privateKey to object.

**Kind**: instance method of [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)  
**Returns**: <code>object</code> - - keystoreV3 object  

| Param | Type |
| --- | --- |
| password | <code>string</code> | 

**Example**  
```js
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> account.encrypt('password')
   {version:3, id:..., address:..., crypto:...}
```
<a name="PrivateKeyAccount+signTransaction"></a>

### privateKeyAccount.signTransaction(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
Sign a transaction.

**Kind**: instance method of [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | See [Transaction](Transaction.md#Transaction.js/Transaction/**constructor**) |

**Example**  
```js
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
<a name="PrivateKeyAccount+signMessage"></a>

### privateKeyAccount.signMessage(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
Sign a string.

**Kind**: instance method of [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)  

| Param | Type |
| --- | --- |
| options | <code>string</code> | 

**Example**  
```js
> account = new PrivateKeyAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> message = account.signMessage('Hello World')
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```
<a name="PrivateKeyAccount.random"></a>

### PrivateKeyAccount.random(entropy, networkId) ⇒ [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)
Create a new PrivateKeyAccount with random privateKey.

**Kind**: static method of [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)  

| Param | Type | Description |
| --- | --- | --- |
| entropy | <code>string</code> \| <code>Buffer</code> | Entropy of random account, if pass undefined will random generate a buffer |
| networkId | <code>number</code> | network id of account |

**Example**  
```js
> PrivateKeyAccount.random(undefined, 1)
   PrivateKeyAccount {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: 'cfxtest:aass3rfcwjz1ab9cg5rtbv61531fmwnsuuy8c26f20'
    }
> PrivateKeyAccount.random(undefined, 1) // gen a different account from above
   PrivateKeyAccount {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: 'cfxtest:aanpezyvznsdg29zu20wpudwnbhx7t4gcpzcnkzjd2'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 1);
   PrivateKeyAccount {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: 'cfxtest:aajx4wn2kwarr8h71uf880w40dp6x91feac1n6ur3s'
    }
> PrivateKeyAccount.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 1);
// gen a different account from above, even use same entropy
   PrivateKeyAccount {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: 'cfxtest:aat0h9htkmzjvub61rsk9p4n64s863suza6zu7d2rr'
    }
```
<a name="PrivateKeyAccount.decrypt"></a>

### PrivateKeyAccount.decrypt(keystore, password, networkId) ⇒ [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)
Decrypt account encrypt info.

**Kind**: static method of [<code>PrivateKeyAccount</code>](#PrivateKeyAccount)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>object</code> | Keystore version 3 object. |
| password | <code>string</code> \| <code>Buffer</code> | Password for keystore to decrypt with. |
| networkId | <code>number</code> | Network id of account |

**Example**  
```js
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
