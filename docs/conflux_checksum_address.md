Conflux Base32Check Addresses
===
As a new public chain, Conflux realizes high performance as well as compatibility with Ethereum. Conflux adopts address format compatible with Ethereum addresses, and thus is compatible with Ethereum Virtual Machine (EVM).
The advantage of the compatibility between Conflux and Ethereum is obvious:  it reduces the cost and difficulty of cross-chain migration. But there are also some problems. Since the addresses on Conflux and Ethereum are similar, users may loss their assets when performing cross-chain transactions using ShuttleFlow if they transfer to a mistake address, which is a serious problem. To improve user experience and reduce address mistakes when users use cross-chain functions, Conflux introduces a new address format: base32Check in [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md).

### Before CIP37
At first, Conflux adopts the address format similar with Ethereum, which is a hex40 address (hex code with a length of 40 bits). The difference is that Conflux differentiate the addresses with different starts: 0x1 for ordinary individual addresses, 0x8 for smart contracts and 0x0 for in-built contracts.

Only hex40 addresses with these three starts are available on Conflux. Some Ethereum addresses (with a 0x1 start) can be used as Conflux addresses, while a Conflux address has a 1/16 chance of being used as an Ethereum address.

Currently, there are three kinds of addresses:

* Ordinary addresses: `0x1`386b4185a223ef49592233b69291bbe5a80c527
* Smart contract addresses: `0x8`269f0add11b4915d78791470d091d25cff73ee5
* In-built contract addresses: `0x0`888000000000000000000000000000000000002

Because the addresses are not completely compatible on Conflux and Ethereum, users will loss assets when they use a wrong address. Ethereum has introduced a regulation with a checksum in [EIP55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md) to change the characters meeting the requirement into the upper case in order to prevent transferring to wrong addresses. Conflux also introduces regulations to change checksums.

* Non-chechsum address: 0x1386`b`4185`a`223`ef`49592233b69291bbe5a80`c`527
* Chechsum address: 0x1386`B`4185`A`223`EF`49592233b69291bbe5a80`C`527


### CIP37 Addresses
In order to solve the problems of mistakenly using wrong addresses, we introduces a brand new base32 checksum address format in [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md). Besides checksum, the new addresses also include information such as network, type.

Old address vs new address:

* hex40 address: `0x1`386b4185a223ef49592233b69291bbe5a80c527
* base32 address: cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91

The new addresses use customized base32 code address. Currently applied characters are: `abcdefghjkmnprstuvwxyz0123456789` (i, l, o, q removed).

In new format addresses, network types are included. Up to now there are three types: cfx，cfxtest，net[n]

* cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
* cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957
* net1921:aak2rra2njvd77ezwjvx04kkds9fzagfe65k87kwdf

Meanwhile, new addresses also include address type information, currently four types (types are usually in upper case):

* user: CFX:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6KU8SCZ91
* contract: CFX:TYPE.CONTRACT:ACB2RRA2NJVD77EZWJVX04KKDS9FZAGFE640XW9UAE
* builtin: CFX:TYPE.BUILTIN:AAEJUAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRWUC9JNB
* null: CFX:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0SFBNJM2

The two address formats (hex40 and base32) are convertible to each other. They are the same if converted to byte arrays. However, when converting hex40 addresses (starting with 0x) into base32check addresses, the network ID information is also required.

### Conflux Fullnode RPC
From v1.1.1, Conflux-rust will apply the new address format. If returns include address information, it will be in the new format.

If you use hex40 addresses to call RPC, it will return with an error:

```js
{
    "code": -32602,
    "message": "Invalid params: Invalid base32 address: zero or multiple prefixes."
}
```

If you use a wrong network type (eg. use a testnet address for the mainnet PRC), it will return with an error:

```js
{
    "code": -32602,
    "message": "Invalid parameters: address",
    "data": "\"network prefix unexpected: ours cfx, got cfxtest\""
}
```

When invoke conflux RPC related method, you can catch the error, the `message` and `data` will be helpful.

```js
try {
    const balance = await cfx.getBalance('0xxxxxxxx');
} catch(e) {
    console.log(e.message);
    console.log(e.data); // hex encoded data, can convert to string: Buffer.from(e.data, 'hex').toString()
}
```

If you use base32 address to call 1.1.0 or below RPC server, it will return with an error:

```js
"error": {
    "code": -32602,
    "message": "Invalid params: 0x prefix is missing."
}
```
### Contract
The new CIP-37 address will not affect interactions with smart contracts. Data constructed when calling smart contracts are still using hex40 addresses ultimately. The js-jdk will change the address format automatically. 

### js-conflux-sdk

From v1.5, js-sdk will start to support the new address format. networkId is needed when generating new addresses, so many functions increase an optional configuration `networkId`, 1029 as default. 

'NOTE' NetworkId needs to be set correctly before using Conflux Objects. Currently, there are two ways to set this:

When initializing a Conflux object, specify through the networkId option,
```js
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org',
    networkId: 1
});
```
The other is to obtain from RPC by calling conflux.updateNetworkId after initialization.
```js
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org',
});
await conflux.updateNetworkId();  // this line should be in a async function
```


#### util

`format.address` Return with new addresses, and add an optional configuration `networkId`, 1029 as default. Only when the input address is hex40, a second configuration is needed.

```js
format.address('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
// cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
format.address('0x1386b4185a223ef49592233b69291bbe5a80c527');
// cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
format.address('0x1386b4185a223ef49592233b69291bbe5a80c527', 1);
// cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957
format.address('0x1386b4185a223ef49592233b69291bbe5a80c527', 1, true);
// CFXTEST:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6D5R8E957
```

New function `format.hexAddress` returns with hex40 address.

```js
format.hexAddress('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
// 0x1386b4185a223ef49592233b69291bbe5a80c527
format.hexAddress('0x1386b4185a223ef49592233b69291bbe5a80c527');
// 0x1386b4185a223ef49592233b69291bbe5a80c527
```

The address format can be converted through these two functions.  
`format.checksumAddress` and `sign.checksumAddress` are tagged as deprecated, which means it may be removed or renamed in the future.


#### Methods added new parameter `networkId`

PrivateKeyAccount 
* Construction method
* Static method decrypt
* Static method random

Wallet 
* Construction method

Message
* sign


#### Conflux

Usage of Conflux is the same as before. The old and new formats are both supported, but addresses in return data will be in the new format.


#### Smart Contract Interaction
Basically, this improvement does not affect smart contract, so when interacting with smart contracts, hex40 addresses are still in use. 
But the SDK realizes compatibility processing. When you call smart contract methods, the new format will be supported when addresses are involved, and the returns and log decode involving addresses will also be in the new format.

Please note: if the method returns with non-Conflux addresses, the addresses will still be in hex40 format.
