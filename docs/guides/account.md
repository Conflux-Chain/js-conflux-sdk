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

## HD Wallet

If you want to use account from mnemonic, there is a independent package `@conflux-dev/hdwallet` can fullfill your requirements.

First step is install it by npm

```sh
$ npm install @conflux-dev/hdwallet
```

Then you can use it to get the private key and add it to conflux wallet.

```js
const { HDWallet } = require('@conflux-dev/hdwallet');

const mnemonic = 'faint also eye industry survey unhappy boil public lemon myself cube sense';
const rootNode = new HDWallet(mnemonic);

const privateKey0 = wallet.getPrivateKeyByIndex(0);
const account0 = conflux.wallet.addPrivateKey(privateKey0);
console.log(privateKey0.toString('hex'));
// 40d0f137665463584cc57fce2b761572a85d1cbf1601fc93d001c129b2a11c92
console.log(account0.address);
// cfxtest:aargrnff46pmuy2g1mmrntctkhr5mzamh6nmg361n0

const privateKey1 = wallet.getPrivateKey("m/44'/503'/0'/0/1");
const account1 = conflux.wallet.addPrivateKey(privateKey1);
```