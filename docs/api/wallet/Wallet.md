<a name="Wallet"></a>

## Wallet
Wallet to manager accounts.

**Kind**: global class  

* [Wallet](#Wallet)
    * [new Wallet(networkId)](#new_Wallet_new)
    * [.setNetworkId(networkId)](#Wallet+setNetworkId)
    * [.has(address)](#Wallet+has) ⇒ <code>boolean</code>
    * [.delete(address)](#Wallet+delete) ⇒ <code>boolean</code>
    * [.clear()](#Wallet+clear)
    * [.set(address, account)](#Wallet+set) ⇒ <code>any</code>
    * [.get(address)](#Wallet+get) ⇒ <code>Account</code>
    * [.addPrivateKey(privateKey)](#Wallet+addPrivateKey) ⇒ <code>PrivateKeyAccount</code>
    * [.addRandom([entropy])](#Wallet+addRandom) ⇒ <code>PrivateKeyAccount</code>
    * [.addKeystore(keystore, password)](#Wallet+addKeystore) ⇒ <code>PrivateKeyAccount</code>

<a name="new_Wallet_new"></a>

### new Wallet(networkId)

| Param | Type |
| --- | --- |
| networkId | <code>number</code> | 

<a name="Wallet+setNetworkId"></a>

### wallet.setNetworkId(networkId)
Set network id

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type |
| --- | --- |
| networkId | <code>number</code> | 

<a name="Wallet+has"></a>

### wallet.has(address) ⇒ <code>boolean</code>
Check if address exist

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="Wallet+delete"></a>

### wallet.delete(address) ⇒ <code>boolean</code>
Drop one account by address

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="Wallet+clear"></a>

### wallet.clear()
Drop all account in wallet

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  
<a name="Wallet+set"></a>

### wallet.set(address, account) ⇒ <code>any</code>
**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>any</code> | Key of account, usually is `address` |
| account | <code>any</code> | Account instance |

<a name="Wallet+get"></a>

### wallet.get(address) ⇒ <code>Account</code>
**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="Wallet+addPrivateKey"></a>

### wallet.addPrivateKey(privateKey) ⇒ <code>PrivateKeyAccount</code>
**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> \| <code>Buffer</code> | Private key of account |

<a name="Wallet+addRandom"></a>

### wallet.addRandom([entropy]) ⇒ <code>PrivateKeyAccount</code>
**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type | Description |
| --- | --- | --- |
| [entropy] | <code>string</code> \| <code>Buffer</code> | Entropy of random account |

<a name="Wallet+addKeystore"></a>

### wallet.addKeystore(keystore, password) ⇒ <code>PrivateKeyAccount</code>
**Kind**: instance method of [<code>Wallet</code>](#Wallet)  

| Param | Type | Description |
| --- | --- | --- |
| keystore | <code>object</code> | Keystore version 3 object. |
| password | <code>string</code> \| <code>Buffer</code> | Password for keystore to decrypt with. |

