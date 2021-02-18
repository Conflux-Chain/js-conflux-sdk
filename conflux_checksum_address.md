Conflux base32Check addresses
===
Conflux 做为新一代的公链，不止具有超高的性能，同时保持了对以太坊生态的兼容：使用格式兼容的地址；实现了兼容 EVM 的虚拟机。
保持兼容的好处是降低迁移的成本和门槛。但相似的地址也带来了不少问题，比如通过 shuttleflow 进行跨链操作的时候，经常因为地址相似而混用
并导致资产丢失。资产丢失是一个非常严重的问题，为了优化跨链体验，减少地址用错的问题，Conflux 在[CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md) 中尝试引入一种新的地址格式: base32Check。


### Before CIP37 
Conflux 最初大体沿用了以太坊的地址格式，即十六进制编码，长度为40 的 hex40 地址，但对地址进行了空间划分，包括 0x1开头的普通地址，0x8开头的合约地址，0x0开头的内置合约地址。
只有此三个字符开头的 hex40 地址才是有效的 Conflux 地址。一个 0x1 开头的 Conflux 地址可以用作以太坊地址，反之则不一定行。

目前 Conflux 有如下三种地址:
* 普通地址：`0x1`386b4185a223ef49592233b69291bbe5a80c527
* 合约地址：`0x8`269f0add11b4915d78791470d091d25cff73ee5
* 内置合约：`0x0`888000000000000000000000000000000000002

正是因为地址的不完全兼容，在跨链的时候使用了错误链的地址，导致资产丢失。另外以太坊在 [EIP55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md) 引入了一个带有校验和的地址规范，其将地址中满足某些条件的字符转成大写，从而防止地址输入错误。Conflux 同样引入了改校验规则。

* 非checksum地址: 0x1386`b`4185`a`223`ef`49592233b69291bbe5a80`c`527
* 带checksum地址: 0x1386`B`4185`A`223`EF`49592233b69291bbe5a80`C`527

### CIP37 地址
为了解决地址混淆用错的问题，在 [CIP37](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-37.md) 引入了全新的 base32 带校验和的地址，该地址除校验和外还可以包含网络，类型等信息。

新旧地址对比：
* hex40 地址：`0x1`386b4185a223ef49592233b69291bbe5a80c527
* base32地址：cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91

新地址规范采用自定义字符的 base32 编码地址，目前使用的字符如下：`abcdefghjkmnprstuvwxyz0123456789`

在新格式地中，同时包含了网络类型信息，目前包括三种：cfx，cfxtest，net[n]

* cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
* cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957
* net1921:aak2rra2njvd77ezwjvx04kkds9fzagfe65k87kwdf

除此之外地址中还可以包含可选类型信息，目前有四种类型(带类型的地址一般以大写表示)：
* user: CFX:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6KU8SCZ91
* contract: CFX:TYPE.CONTRACT:ACB2RRA2NJVD77EZWJVX04KKDS9FZAGFE640XW9UAE
* builtin: CFX:TYPE.BUILTIN:AAEJUAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRWUC9JNB
* null: CFX:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0SFBNJM2

hex40 地址和 CIP37 地址是可以互相转换，转换为 byte 数组是一样的。

### Conflux fullnode RPC
Conflux-rust 从版本 `1.1.1` 开始将会使用新地址格式，凡是请求参数，返回结果中包含地址的地方，均使用新格式地址。并且会返回带有类型信息的地址。

RPC 调用时如果你使用了 hex40 地址，会返回如下错误：
```js
{
    "code": -32602,
    "message": "Invalid params: Invalid base32 address: zero or multiple prefixes."
}
```

如果你使用了错误 network 的地址（主网 RPC 服务，使用了测试网的地址），会返回如下错误：
```js
{
    "code": -32602,
    "message": "Invalid parameters: address",
    "data": "\"network prefix unexpected: ours cfx, got cfxtest\""
}
```

### 合约
新的 CIP37 地址，不会影响到合约的交互，调用合约构造的 data 本质还是用的 hex40 地址。但 js-sdk 会自动做地址格式的转换。

### js-conflux-sdk

js-sdk 从 v1.5 开始支持新地址格式，因为新地址的生成需要 networkId 信息，因此许多函数增加了可选参数 `networkId` 默认 1029。

`NOTE` Conflux 对象在使用前需要正确的设置 networkId，目前提供了两种设置方式:

一是在初始化 Conflux 对象时，通过 networkId 选项指定，
```js
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org',
    networkId: 1
});
```
另外一种是在初始化后，通过调用 conflux.updateNetworkId 从 RPC 获取。
```js
const conflux = new Conflux({
    url: 'http://test.confluxrpc.org',
});
await conflux.updateNetworkId();  // this line should be in a async function
```

#### util

`format.address` 返回新格式地址，并且增加了可选参数 `networkId` 默认值为 1029。只有当传入 hex40 地址的时候，才需要传递第二个参数

```js
format.address('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
// cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
format.address('0x1386b4185a223ef49592233b69291bbe5a80c527');
// cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91
format.address('0x1386b4185a223ef49592233b69291bbe5a80c527', 1);
// cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957
```

新增方法 `format.hexAddress` 返回 hex40 地址

```js
format.hexAddress('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
// 0x1386b4185a223ef49592233b69291bbe5a80c527
format.hexAddress('0x1386b4185a223ef49592233b69291bbe5a80c527');
// 0x1386b4185a223ef49592233b69291bbe5a80c527
```

此两个方法可以实现两种地址的相互转换。
另外  `format.checksumAddress`, `sign.checksumAddress` 方法被标为了 deprecated, 将来可能会被移除或重命名。


#### 如下方法增加了 networkId 参数

PrivateKeyAccount 
* 构造方法
* 静态方法 decrypt
* 静态方法 random

Wallet 
* 构造方法

Message
* sign

Transaction
* sign


#### Conflux

Conflux 的使用方法跟之前保持一致，支持新旧两种地址格式，返回数据中包含地址的地方均返回新格式地址。

#### 合约交互
此次地址调整，本质上不影响合约，即最终同合约交互时仍使用 hex40 格式地址。
但 SDK 同样做了兼容处理，在调用合约方法时，涉及到地址的地方支持新格式地址，返回结果及 log decode 也会返回新格式地址。

注意：如果合约方法返回结果为地址数据，且返回的是非 conflux 地址，返回的仍然是 hex40 的形式。
