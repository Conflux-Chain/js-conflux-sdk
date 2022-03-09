# Account

Account can be used to sign `Transaction` or `Message`. Wallet like Fluent can help you manage your accounts (privateKeys) and provide signing functions to you.
SDK also provide account manage and signing functions.

## Send transaction

```js
// If you want send transaction signed by your own private key, it's need add to wallet before you send transaction
const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';  // use your own private key
const account = conflux.wallet.addPrivateKey(privateKey);
await conflux.cfx.sendTransaction({
  from: account.address,
  to: 'cfxtest:xxxx',
  value: 100
});
```

## Random create

```js
// create through wallet
const account = conflux.wallet.addRandom();
// create though PrivateKeyAccount
const { PrivateKeyAccount } = require('js-conflux-sdk');
const networkId = 1;
const randomSeed = '0xfffff'; // any random buffer
const account = PrivateKeyAccount.random(randomSeed, networkId);
```

## Import keystore file

```js
const keystoreJson = {}; // read from keystore file
const account = conflux.wallet.addKeystore(keystoreJson, 'password');
```

## Export to keystore file

```js
const keystoreJson = account.encrypt('password');
```

## Sign message

The `Message` class can be used to sign an arbitrary message. 

```js
const { Message } = require('js-conflux-sdk');
const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // privateKey
const messageHash = '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba';

const signatureHexStr = Message.sign(privateKey, messageHash);
const publicKey = Message.recover(signatureHexStr, messageHash);
// Or you can build a Message instance

const msg = new Message('hello world');
console.log(msg.hash);
msg.sign(privateKey, networkId);
console.log(msg.r, msg.s, msg.v);
console.log(msg.from);
```