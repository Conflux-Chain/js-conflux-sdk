# sign methods

## Recover ConfluxPortal's personal_sign message

To verify portal's personal_sign method signed signature, developer need to recover publicKey or address from it and message. `PersonalMessage` class provide a static method can do this.

```js
const { PersonalMessage } = require('js-conflux-sdk');
const message = 'Hello World';
const signature = '0xxxxx';

// message can be a normal string, or a hex encoded string
const publicKey = PersonalMessage.recoverPortalPersonalSign(signature, message);
// 0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559
```

## CIP-23 personal_sign

The SDK has provide a  `PersonalMessage` class with can be used to personal_sign a message.

```js
const { PersonalMessage } = require('js-conflux-sdk');
const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // use your own private key here
const message = 'Hello World';
const signature = PersonalMessage.sign(privateKey, message);
// 0xd72ea2020802d6dfce0d49fc1d92a16b43baa58fc152d6f437d852a014e0c5740b3563375b0b844a835be4f1521b4ae2a691048622f70026e0470acc5351043a01
const publicKey = PersonalMessage.recover(signature, message);
// 0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559
```

## CIP-23 typedDataSign

Conflux also have support for typed data sign through [CIP23](https://github.com/Conflux-Chain/CIPs/blob/2d9fdbdb08f66f705348669a6cd85e2d53509e97/CIPs/cip-23.md), which is similar to [EIP712](https://eips.ethereum.org/EIPS/eip-712).

There is a Node.js package [`cip-23`](https://www.npmjs.com/package/cip-23) which provide some utility functions that can help with signing and verifying CIP-23 based messages

```json
{
  "types": {
    "CIP23Domain": [
      { "name": "name", "type": "string" },
      { "name": "version", "type": "string" },
      { "name": "chainId", "type": "uint256" },
      { "name": "verifyingContract", "type": "address" }
    ],
    "Person": [
      { "name": "name", "type": "string" },
      { "name": "wallet", "type": "address" }
    ],
    "Mail": [
      { "name": "from", "type": "Person" },
      { "name": "to", "type": "Person" },
      { "name": "contents", "type": "string" }
    ]
  },
  "primaryType": "Mail",
  "domain": {
    "name": "Ether Mail",
    "version": "1",
    "chainId": 1,
    "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
  },
  "message": {
    "from": {
      "name": "Cow",
      "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
    },
    "to": {
      "name": "Bob",
      "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
    },
    "contents": "Hello, Bob!"
  }
}
```

```js
import { getMessage } from 'cip-23';
import { sign } from 'js-conflux-sdk';

const typedData = { /*...*/ };
const message = getMessage(typedData).toString('hex'); // Build message
// 1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e
const messageHash = getMessage(typedData, true).toString('hex'); // Build message hash
// be609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2
const privateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // use your own private key here
// Sign message hash with private key
const sig = sign.ecdsaSign(messageHash, privateKey);
```

## Useful links

1. [MetaMask sign methods](https://docs.metamask.io/guide/signing-data.html)
2. [CIP23](https://github.com/Conflux-Chain/CIPs/blob/2d9fdbdb08f66f705348669a6cd85e2d53509e97/CIPs/cip-23.md)
3. [EIP712](https://eips.ethereum.org/EIPS/eip-712)
4. [EIP712 is here: What to expect and how to use it](https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26)