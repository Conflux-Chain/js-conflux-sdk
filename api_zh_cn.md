---
id: javascript_sdk_zh_cn
title: Javascript SDK
custom_edit_url: https://github.com/Conflux-Chain/js-conflux-sdk/edit/master/api_zh_cn.md
keywords:
  - conflux
  - javascript
  - sdk
---

- Account.js
    - [Account](#Account.js/Account)
- Conflux.js
    - [Conflux](#Conflux.js/Conflux)
- contract
    - Contract.js
        - [Contract](#contract/Contract.js/Contract)
- Message.js
    - [Message](#Message.js/Message)
- provider
    - BaseProvider.js
        - [BaseProvider](#provider/BaseProvider.js/BaseProvider)
    - HttpProvider.js
        - [HttpProvider](#provider/HttpProvider.js/HttpProvider)
- Transaction.js
    - [Transaction](#Transaction.js/Transaction)
- util
    - sign.js
        - [sha3](#util/sign.js/sha3)
        - [checksumAddress](#util/sign.js/checksumAddress)
        - [randomBuffer](#util/sign.js/randomBuffer)
        - [randomPrivateKey](#util/sign.js/randomPrivateKey)
        - [privateKeyToPublicKey](#util/sign.js/privateKeyToPublicKey)
        - [publicKeyToAddress](#util/sign.js/publicKeyToAddress)
        - [privateKeyToAddress](#util/sign.js/privateKeyToAddress)
        - [ecdsaSign](#util/sign.js/ecdsaSign)
        - [ecdsaRecover](#util/sign.js/ecdsaRecover)
        - [encrypt](#util/sign.js/encrypt)
        - [decrypt](#util/sign.js/decrypt)
    - unit.js
        - [unit](#util/unit.js/unit)

----------------------------------------

## Account <a id="Account.js/Account"></a>

*无描述*

## Account.random <a id="Account.js/random"></a>

用随机私钥创建一个新账户。

* **参数**

Name    | Type | Required | Default | Description
--------|------|----------|---------|------------
entropy |      | true     |         |

* **返回值**

`Account` 

* **举例**

```
> Account.random()
   Account {
      privateKey: '0xd28edbdb7bbe75787b84c5f525f47666a3274bb06561581f00839645f3c26f66',
      publicKey: '0xc42b53ae2ef95fee489948d33df391c4a9da31b7a3e29cf772c24eb42f74e94ab3bfe00bf29a239c17786a5b921853b7c5344d36694db43aa849e401f91566a5',
      address: '0x1cecb4a2922b7007e236daf0c797de6e55496e84'
    }
> Account.random() // gen a different account from above
   Account {
      privateKey: '0x1b67150f56f49556ef7e3899024d83c125d84990d311ec08fa98aa1433bc0f53',
      publicKey: '0xd442207828ffd4dad918fea0d75d42dbea1fe5e3789c00a82e18ce8229714eae3f70b12f2f1abd795ad3e5c52a5a597289eb5096548438c233431f498b47b9a6',
      address: '0x16c25691aadc3363f5862d264072584f3ebf4613'
    }
> Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
   Account {
      privateKey: '0x1d41e006afd28ea339922d8ab4be93154a14d4f1b6d0ad4e7aabf807e7536a5f',
      publicKey: '0x4c07c75d3fdc5b1d6afef6ec374b0eaac86bcaa771a1d536bc4ce6f111b1c60e414b370e4cf31bf7770ae6818a3518c485398a43857d9053153f6eb4f5644a90',
      address: '0x113d49784c80d6f8fdbc0bef5a5ab0d9c9fee520'
    }
> Account.random('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
// gen a different account from above, even use same entropy
   Account {
      privateKey: '0x5a34ff3318674c33209ce856218890e9a6ee3811e8a51e3094ed1e6a94bf58ef',
      publicKey: '0xe530d77c3ed6115cb46ba79821085bf67d2a7a8c808c1d52dec03fd7a82e569c2136dba84b21d40f46d90484722b21a9d5a8038495adf93f2eed564ababa2422',
      address: '0x1f63fcef4aaa88c03cbb5c9fb34be69dee65d0a8'
    }
```

## Account.decrypt <a id="Account.js/decrypt"></a>

解密账户加密信息。

* **参数**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
password | `string` | true     |         |
info     | `object` | true     |         |

* **返回值**

`Account` 

## Account.prototype.constructor <a id="Account.js/constructor"></a>

用私钥创建一个账户。

* **参数**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|------------
privateKey | `string,Buffer` | true     |         |

* **返回值**

`Account` 

## Account.prototype.encrypt <a id="Account.js/encrypt"></a>

把账户私钥加密成对象。

* **参数**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
password | `string` | true     |         |

* **返回值**

`Object` 

## Account.prototype.signTransaction <a id="Account.js/signTransaction"></a>

签名交易。

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------------
options | `object` | true     |         | 参见“Transaction”部分

* **返回值**

`Transaction` 

## Account.prototype.signMessage <a id="Account.js/signMessage"></a>

签名字符串。

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
message | `string` | true     |         |

* **返回值**

`Message` 

* **举例**

```
> const account = new Account('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
> const msg = account.signMessage('Hello World!')
> console.log(msg);
   Message {
      message: 'Hello World',
      signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'
    }
```

## Account.prototype.toString <a id="Account.js/toString"></a>

*无描述*

* **返回值**

`String` 账户地址为字符串。

----------------------------------------

## Conflux <a id="Conflux.js/Conflux"></a>

Conflux 的 SDK

## Conflux.prototype.constructor <a id="Conflux.js/constructor"></a>

*无描述*

* **参数**

Name                        | Type            | Required | Default        | Description
----------------------------|-----------------|----------|----------------|-----------------------------------------------------------
options                     | `object`        | false    |                | Conflux和提供者构造函数选项。
options.url                 | `string`        | false    | ''             | 提供者创建的url。
options.defaultEpoch        | `string,number` | false    | "latest_state" | 默认epochNumber.
options.defaultGasPrice     | `string,number` | false    |                | 交易使用的默认gas价格，以drip为单位。
options.defaultGas          | `string,number` | false    |                | 一个交易默认的最大gas提供量。
options.defaultStorageLimit | `string,number` | false    |                | 一个交易的默认最大存储字节限制。
options.defaultChainId      | `number`        | false    |                | 已连接网络的默认链ID。

* **举例**

```
> const { Conflux } = require('js-conflux-sdk');
> const cfx = new Conflux({url:'http://testnet-jsonrpc.conflux-chain.org:12537'});
```

```
> const cfx = new Conflux({
     url: 'http://localhost:8000',
     defaultGasPrice: 100,
     defaultGas: 100000,
     defaultStorageLimit: 4096,
     defaultChainId: 0,
     logger: console,
   });
```

## ~~Conflux.prototype.defaultEpoch~~ <a id="Conflux.js/defaultEpoch"></a>

`number,string`

以下方法为默认epoch编号：
- `Conflux.getBalance`
- `Conflux.getNextNonce`
- `Conflux.getCode`
- `Conflux.call`

## ~~Conflux.prototype.defaultGasPrice~~ <a id="Conflux.js/defaultGasPrice"></a>

`number,string`

以下方法为默认gas价格：
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`

## ~~Conflux.prototype.defaultGas~~ <a id="Conflux.js/defaultGas"></a>

`number,string`

以下方法为默认gas限制：
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`

## ~~Conflux.prototype.defaultStorageLimit~~ <a id="Conflux.js/defaultStorageLimit"></a>

`number,string`

以下方法为默认存储限制：
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`

## ~~Conflux.prototype.defaultChainId~~ <a id="Conflux.js/defaultChainId"></a>

`number`

以下方法为默认链ID：
- `Conflux.sendTransaction`
- `Conflux.call`
- `Conflux.estimateGas`

## Conflux.prototype.setProvider <a id="Conflux.js/setProvider"></a>

创建并设置 `provider`.

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------------------------
url     | `string` | true     |         | 提供者创建的url。
options | `object` | false    |         | 提供者构造函数选项。

* **返回值**

`Object` 

* **举例**

```
> cfx.provider;
   HttpProvider {
     url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
     timeout: 60000,
     ...
   }
> cfx.setProvider('http://localhost:8000');
> cfx.provider;
   HttpProvider {
     url: 'http://localhost:8000',
     timeout: 60000,
     ...
   }
```

## Conflux.prototype.Account <a id="Conflux.js/Account"></a>

`new Account(privateKey);`的快捷命令

* **参数**

Name       | Type            | Required | Default | Description
-----------|-----------------|----------|---------|--------------------------
privateKey | `string,Buffer` | true     |         | 参见`Account.constructor`

* **返回值**

`Account` 

## Conflux.prototype.Contract <a id="Conflux.js/Contract"></a>

`new Contract(cfx, options);`的快捷命令

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|---------------------------
options | `object` | true     |         | 参见`Contract.constructor`

* **返回值**

`Contract` 

## Conflux.prototype.close <a id="Conflux.js/close"></a>

关闭连接

* **举例**

```
> cfx.close();
```

## Conflux.prototype.getStatus <a id="Conflux.js/getStatus"></a>

获取状态

* **返回值**

`Promise.<object>` 状态信息对象
- `number` chainId: 链ID
- `number` epochNumber: Epoch编号
- `number` blockNumber: 区块编号
- `number` pendingTxNumber: 没有确认的交易编号
- `string` bestHash: 最佳主区块的区块哈希值

## Conflux.prototype.getGasPrice <a id="Conflux.js/getGasPrice"></a>

返回当前gas价格的Oracle。gas价格由最新区块的中位gas价格决定。

* **返回值**

`Promise.<JSBI>` gas价格，以drip为单位。

* **举例**

```
> await cfx.getGasPrice();
   "0"
```

## Conflux.prototype.getEpochNumber <a id="Conflux.js/getEpochNumber"></a>

返回客户端所在的当前的epochNumber。

* **参数**

Name        | Type            | Required | Default      | Description
------------|-----------------|----------|--------------|-----------------------------------------
epochNumber | `string,number` | false    | latest_mined | 末尾epochNumber要计算的余额。

* **返回值**

`Promise.<number>` EpochNumber

* **举例**

```
> await cfx.getEpochNumber();
   200109
```

## Conflux.prototype.getLogs <a id="Conflux.js/getLogs"></a>

获取过去的日志，匹配给定选项。

* **参数**

Name                | Type                    | Required | Default | Description
--------------------|-------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
options             | `object`                | false    |         |
options.fromEpoch   | `string,number`         | false    |         | 起视区块的数量(>=), 'latest_mined' or 'latest_state'.
options.toEpoch     | `string,number`         | false    |         | 终止区块的数量(<=), 'latest_mined' or 'latest_state'.
options.blockHashes | `Array.<string>`        | false    |         | 区块哈希值列表
options.address     | `string,Array.<string>` | false    |         | 从特定账户获取日志所需的地址或地址列表。
options.topics      | `array`                 | false    |         | 值数组，每个值都必须出现在日志条目中。顺序很重要，如果你想让每一个，用null，例如：[null, '0x12...']。也可以为每个主题传递一个带有该主题选项的数组，例如：[null, ['option1', 'option2']]。
options.limit       | `number`                | false    |         | 限制日志编号。

* **返回值**

`Promise.<LogIterator>` 日志对象数组。
- `string` address: 事件起源的地址。
- `string[]` topics: 数组，最多包含4个32字节的主题，主题1-3包含事件的索引参数。
- `string` data: 数据包含非索引日志参数。
- `string` type: TODO
- `boolean` removed: TODO
- `number` epochNumber: 日志所在的epoch编号。未确认时无效。
- `string` blockHash: 事件被创建的区块的哈希值。未确认时无效。
- `string` transactionHash: 事件被创建的交易的哈希值。
- `string` transactionIndex: 事件被创建的交易索引位置的整数。
- `number` logIndex: 区块中事件索引位置的整数。
- `number` transactionLogIndex: 交易中时间索引参数的整数。

* **举例**

```
> await cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 0,
      toEpoch: 'latest_mined',
      limit: 1,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ]
    });

   [
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      blockHash: '0x701afee0ffc49aaebadf0e6618b6ec1715d31e7aa639e2e00dc8df10994e0283',
      data: '0x',
      epochNumber: 542556,
      logIndex: 0,
      removed: false,
      topics: [
        '0xb818399ffd68e821c34de8d5fbc5aeda8456fdb9296fc1b02bf6245ade7ebbd4',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ],
      transactionHash: '0x5a301d2c342709d7de9da24bd096ab3754ea328b016d85ab3410d375616f5d0d',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined'
     },
   ]
```

```
> logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })
> await logIter.next({threshold: 0.01, delta: 1000});
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
> await logIter.next();
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
> await logIter.next();
   undefined
```

```
> logIter = cfx.getLogs({
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      fromEpoch: 'latest_mined',
      limit: 2,
      })
> for await (const log of iter) {
       console.log(log);
     }
   {
      address: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
      ...
   }
   ...
```

## Conflux.prototype.getBalance <a id="Conflux.js/getBalance"></a>

获取给定epochNumber的地址余额。

* **参数**

Name        | Type            | Required | Default           | Description
------------|-----------------|----------|-------------------|-----------------------------------------
address     | `string`        | true     |                   | 获取余额的地址。
epochNumber | `string,number` | false    | this.defaultEpoch | 末尾epochNumber要计算的余额。

* **返回值**

`Promise.<JSBI>` 地址余额，以Drip为单位。

* **举例**

```
> let balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
> balance;
   1793636034970586632n
> balance = await cfx.getBalance("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
> balance.toString(10);
   "0"
```

## Conflux.prototype.getNextNonce <a id="Conflux.js/getNextNonce"></a>

获取下一个交易随机数的地址。

* **参数**

Name        | Type            | Required | Default           | Description
------------|-----------------|----------|-------------------|-----------------------------------------------------
address     | `string`        | true     |                   | 从中获取交易数量的地址。
epochNumber | `string,number` | false    | this.defaultEpoch | 从中计算交易数的末尾epochNumber。

* **返回值**

`Promise.<number>` 

* **举例**

```
> await cfx.getNextNonce("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b");
   61
> await cfx.getNextNonce("0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b", 0);
   0
```

## Conflux.prototype.getConfirmationRiskByHash <a id="Conflux.js/getConfirmationRiskByHash"></a>

获取区块的风险值，可能会被退回。
同一个epoch中的所有区块返回同一个风险值。

* **参数**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
blockHash | `string` | true     |         |

* **返回值**

`Promise.<(number|null)>` 

## Conflux.prototype.getBlockByEpochNumber <a id="Conflux.js/getBlockByEpochNumber"></a>

获取主区块信息的epochNumber。

* **参数**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|--------------------------------------------------------------
epochNumber | `string,number` | true     |         | EpochNumber or string in ["latest_state", "latest_mined"]
detail      | `boolean`       | false    | false   | `true` 返回交易对象, `false` 返回TxHash数组

* **返回值**

`Promise.<(object|null)>` 区块信息 (与`getBlockByHash`相同).

* **举例**

```
> await cfx.getBlockByEpochNumber(449);
   {
     hash: '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40',
     ...
   }
```

## Conflux.prototype.getBlocksByEpochNumber <a id="Conflux.js/getBlocksByEpochNumber"></a>

获取一个epochNumber的区块哈希值数组。

* **参数**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|----------------------------------------------------------
epochNumber | `string,number` | true     |         | EpochNumber或["latest_state", "latest_mined"]中的字符串

* **返回值**

`Promise.<Array.<string>>` 区块哈希值数组，最后一个是这个epochNumber的主区块哈希值。

* **举例**

```
> await cfx.getBlocksByEpochNumber(0);
   ['0x2da120ad267319c181b12136f9e36be9fba59e0d818f6cc789f04ee937b4f593']
> await cfx.getBlocksByEpochNumber(449);
   [
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   ]
```

## Conflux.prototype.getBestBlockHash <a id="Conflux.js/getBestBlockHash"></a>

> TODO

* **返回值**

`Promise.<string>` 

* **举例**

```
> await cfx.getBestBlockHash();
   "0x43ddda130fff8539b9f3c431aa1b48e021b3744aacd224cbd4bcdb64373f3dd5"
```

## Conflux.prototype.getBlockByHash <a id="Conflux.js/getBlockByHash"></a>

返回匹配这个区块哈希值的区块。

* **参数**

Name      | Type      | Required | Default | Description
----------|-----------|----------|---------|--------------------------------------------------------------
blockHash | `string`  | true     |         | 要获取的区块的哈希值。
detail    | `boolean` | false    | false   | `true` 返回交易对象, `false` 返回TxHash数组

* **返回值**

`Promise.<(object|null)>` 区块信息对象。
- `string` miner: 获得采矿奖励的受益人地址。
- `string|null` hash: 区块的哈希值，未确认时无效。
- `string` parentHash: 母区块的哈希值。
- `string[]` refereeHashes: 裁判哈希值数组。
- `number|null` epochNumber: 客户端视图下当前区块的epochNumber，不在最佳区块过去的集中时无效。
- `boolean|null` stable: 区块是否稳定，未确认稳定时无效。
- `string` nonce: 生成的工作量证明的哈希值，未确认区块无效。
- `number` gas: 这个区块中允许的最大的gas。
- `string` difficulty: 这个区块中难点的整数字符串。
- `number` height: 区块高度，未确认区块无效。
- `number` size: 区块大小的整数，以字节为单位。
- `number` blame: 如果没有什么可追溯的，则为0；如果该块追溯到其第k个祖先的状态信息，则为k。
- `boolean` adaptive: 区块的权重是否自适应。
- `number` timestamp: 整理该块时的unix时间戳。
- `string` transactionsRoot: 这个区块交易的哈希值。
- `string[]` transactions: 交易对象的数组，或是32字节的交易哈希值，取决于最后一个给定参数。
- `string` deferredLogsBloomHash: 延迟区块的日志布隆过滤器的哈希值。
- `string` deferredReceiptsRoot: 延迟执行后的区块收据的哈希值。
- `string` deferredStateRoot: 延迟执行后区块的最终状态特里的根哈希值。
- `object` deferredStateRootWithAux: 延迟状态树的根哈希值信息。

* **举例**

```
> await cfx.getBlockByHash('0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80');
   {
      epochNumber: 231939,
      height: 231939,
      size: 384,
      timestamp: 1578972801,
      gasLimit: 3000000000n,
      difficulty: 29649377n,
      transactions: [
        '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530'
      ],
      stable: true,
      adaptive: false,
      blame: 0,
      deferredLogsBloomHash: '0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5',
      deferredReceiptsRoot: '0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c',
      deferredStateRoot: '0xa930f70fc49e1ab5441031775138817ff951421fad1298b69cda26a10f1fe2b9',
      hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
      miner: '0x0000000000000000000000000000000000000014',
      nonce: '0xd7adc50635950329',
      parentHash: '0xd601491dc9e0f80ceccbf0142490fcb47a4e1801d6fcea34119ffc338b59712c',
      refereeHashes: [
        '0x6826206c6eaa60a6950182f90d2a608c07c7af6802131204f7365c1e96b1f85c'
      ],
      transactionsRoot: '0xe26c8940951305914fa69b0a8e431255962cfe95f2481283ec08437eceec03e2'
    }
```

```
> await cfx.getBlockByHash('0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40', true);
   {
    hash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
    transactions: [
      {
        nonce: 1,
        value: 0n,
        gasPrice: 10n,
        gas: 10000000n,
        v: 1,
        transactionIndex: 0,
        status: 0,
        blockHash: '0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80',
        contractCreated: null,
        data: '0x47e7ef2400000000000000000000000099b52de54f2f922fbd6e46d99654d2063bd7f0dc00000000000000000000000000000000000000000000000000000000000003e8',
        from: '0x99b52de54f2f922fbd6e46d99654d2063bd7f0dc',
        hash: '0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530',
        r: '0xdc383e4afb5b389e4074e6d4acbb847fd0908bbca60602d66e60169f1340630',
        s: '0x14efbc60c095b507609639b219d233418a7fc7ee835902e69e1735897b45fb38',
        to: '0x28d995f3818426dbbe8e357cc1cdb67be043b0df'
      }
    ],
    ...
   }
```

## Conflux.prototype.getBlockByHashWithPivotAssumption <a id="Conflux.js/getBlockByHashWithPivotAssumption"></a>

如果`epochNumber`的主区块是`pivotBlockHash`，用`blockHash`获取区块。

* **参数**

Name           | Type     | Required | Default | Description
---------------|----------|----------|---------|----------------------------------------------------------------
blockHash      | `string` | true     |         | epochNumber为`epochNumber`的区块的哈希值。
pivotBlockHash | `string` | true     |         | `epochNumber`的主区块的哈希值。
epochNumber    | `number` | true     |         | EpochNumber或["latest_state", "latest_mined"]中的字符串

* **返回值**

`Promise.<object>` 区块信息(与`getBlockByHash`相同).

* **举例**

```
> await cfx.getBlockByHashWithPivotAssumption(
   '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
   '0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40'
   449,
   );
   {
     hash: '0x3d8b71208f81fb823f4eec5eaf2b0ec6b1457d381615eff2fbe24605ea333c39',
     ...
   }
```

## Conflux.prototype.getTransactionByHash <a id="Conflux.js/getTransactionByHash"></a>

返回一个匹配给定交易哈希值的交易。

* **参数**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|----------------------
txHash | `string` | true     |         | 交易哈希值

* **返回值**

`Promise.<(object|null)>` 交易信息对象。
- `string` blockHash: 交易所在并且被执行的区块的哈希值，未确认时无效。
- `number` transactionIndex: 区块中交易索引位置的整数。
- `string` hash: 交易哈希值。
- `number` nonce: 在这次交易前交易发起者进行过的交易数量。
- `string` from: 发起者的地址
- `string` to: 接收者的地址，合约创建的交易无效
- `string` value: 转账价值，以Drip为单位。
- `string` data: 伴随交易发出的数据。
- `number` gas: 发起者提供的gas。
- `number` gasPrice: 发起者提供的gas价格，以Drip为单位。
- `string` status: '0x0'成功执行; '0x1'异常发生，但是nonce值增加; '0x2' 异常发生，并且nonce值没有增加.
- `string|null` contractCreated: 如果交易是合约创建的，则表示已创建的合约地址，否则无效。
- `string` r: ECDSA 签名 r
- `string` s: ECDSA 签名 s
- `string` v: ECDSA 恢复 ID

* **举例**

```
> await cfx.getTransactionByHash('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
      "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
      "transactionIndex": 0,
      "hash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914",
      "nonce": 0,
      "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
      "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
      "value": "1000000000000000000"
      "data": "0x",
      "gas": 21000,
      "gasPrice": "819",
      "status": 0,
      "contractCreated": null,
      "r": "0x88e43a02a653d5895ffa5495718a5bd772cb157776108c5c22cee9beff890650",
      "s": "0x24e3ba1bb0d11c8b1da8d969ecd0c5e2372326a3de71ba1231c876c0efb2c0a8",
      "v": 0,
    }
```

## Conflux.prototype.getTransactionReceipt <a id="Conflux.js/getTransactionReceipt"></a>

返回交易接收方的交易哈希值。

> 注意：未确认的交易接收者不适用，返回null。

* **参数**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|----------------------
txHash | `string` | true     |         | 交易哈希值。

* **返回值**

`Promise.<(object|null)>` - `number` outcomeStatus: `0`: 交易成功, `1`: EVM 退回了交易。
- `string` stateRoot: 交易执行的状态树的根哈希值。
- `number` epochNumber: 交易所在的EpochNumber。
- `string` blockHash: 交易所在的区块哈希值。
- `string` transactionHash: 交易哈希值。
- `number` index: 区块中交易索引位置的整数
- `string` from: 交易发起者的地址
- `string` to: 接收者的地址，合约发起的交易接收者地址无效。
- `string|null` contractCreated: 如果是合约发起的交易，则为合约地址，否则无效。
- `number` gasUsed: 特定单个交易所使用的gas总量。
- `[object]` logs: 这个交易产生的日志对象数组
- `[string]` logs[].address: 在`LOG`操作点执行的合约地址。
- `[string]` logs[].topics: 与`LOG`操作相关的主题。
- `[string]` logs[].data: 与`LOG`操作相关的数据。
- `string` logsBloom: Log bloom.

* **举例**

```
> await cfx.getTransactionReceipt('0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914');
   {
    "outcomeStatus": 0,
    "stateRoot": "0x3854f64be6c124dffd0ddca57270846f0f43a119ea681b4e5d022ade537d9f07",
    "epochNumber": 449,
    "blockHash": "0x59339ff28bc235cceac9fa588ebafcbf61316e6a8c86c7a1d7239b9445d98e40",
    "transactionHash": "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
    "index": 0,
    "from": "0xa70ddf9b9750c575db453eea6a041f4c8536785a",
    "to": "0x63f0a574987f6893e068a08a3fb0e63aec3785e6",
    "contractCreated": null,
    "gasUsed": 21000,
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   }
```

## Conflux.prototype.sendTransaction <a id="Conflux.js/sendTransaction"></a>

如果数据字段包含代码，则创建新的消息调用交易或合约创建交易。
> FIXME: rpc `cfx_sendTransaction` 还未执行。

> 注意：如果`from`选项是`Account`的一个实例，这个方法会通过本地账户签名。并且用`cfx_sendRawTransaction`发出，否则将会用`cfx_sendTransaction`发出。

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|--------------------
options | `object` | true     |         | 参见`format.sendTx`

* **返回值**

`Promise.<PendingTransaction>` 未确认交易对象.

* **举例**

```
> // TODO call with address, need `cfx_sendTransaction`
```

```
> const account = cfx.Account(KEY);
> await cfx.sendTransaction({
      from: account, // from account instance will sign by local.
      to: ADDRESS,
      value: Drip.fromCFX(0.023),
    });
   "0x459473cb019bb59b935abf5d6e76d66564aafa313efd3e337b4e1fa6bd022cc9"
```

```
> await cfx.sendTransaction({
      from: account,
      to: account, // to account instance
      value: Drip.fromCFX(0.03),
    }).get(); // send then get transaction by hash.
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0xf2b258b49d33dd22419526e168ebb79b822889cf8317ce1796e816cce79e49a2",
    "contractCreated": null,
    "data": "0x",
    "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "nonce": 111,
    "status": null,
    "to": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
    "value": "30000000000000000",
    ...
   }
```

```
> const promise = cfx.sendTransaction({ // Not await here, just get promise
      from: account1,
      to: ADDRESS1,
      value: Drip.fromCFX(0.007),
    });
> await promise; // transaction
   "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688"
> await promise.get(); // get transaction
   {
    "blockHash": null,
    "transactionIndex": null,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }
> await promise.mined(); // wait till transaction mined
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "transactionIndex": 0,
    "hash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    ...
   }
> await promise.executed(); // wait till transaction executed in right status. and return it's receipt.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }
> await promise.confirmed(); // wait till transaction risk coefficient '<' threshold.
   {
    "blockHash": "0xe9b22ce311003e26c7330ac54eea9f8afea0ffcd4905828f27c9e2c02f3a00f7",
    "index": 0,
    "transactionHash": "0x91fbdfb33f3a585f932c627abbe268c7e3aedffc1633f9338f9779c64702c688",
    "outcomeStatus": 0,
    ...
   }
```

## Conflux.prototype.sendRawTransaction <a id="Conflux.js/sendRawTransaction"></a>

签名交易。此账户需要解除锁定。

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------------------
hex  | `string,Buffer` | true     |         | 原始交易字符串。

* **返回值**

`Promise.<PendingTransaction>` 未确认交易对象。参见`sendTransaction`

* **举例**

```
> await cfx.sendRawTransaction('0xf85f800382520894bbd9e9b...');
   "0xbe007c3eca92d01f3917f33ae983f40681182cf618defe75f490a65aac016914"
```

## Conflux.prototype.getCode <a id="Conflux.js/getCode"></a>

获取特定地址的代码。

* **参数**

Name        | Type            | Required | Default           | Description
------------|-----------------|----------|-------------------|----------------------------------------------------------
address     | `string`        | true     |                   | 需要获取代码的合约地址。
epochNumber | `string,number` | false    | this.defaultEpoch | EpochNumber或["latest_state", "latest_mined"]中的字符串

* **返回值**

`Promise.<string>`代码十六进制字符串。

* **举例**

```
> await cfx.getCode('0xb385b84f08161f92a195953b980c8939679e906a');
   "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd1460375780638..."
```

## Conflux.prototype.call <a id="Conflux.js/call"></a>

执行消息调用交易，直接在节点虚拟机中执行，但是不要铸到区块链上。

* **参数**

Name        | Type            | Required | Default           | Description
------------|-----------------|----------|-------------------|----------------------------------------
options     | `object`        | true     |                   | 参见`format.sendTx`
epochNumber | `string,number` | false    | this.defaultEpoch | 需要执行调用的末尾epochNumber。

* **返回值**

`Promise.<string>`合约方法返回值的十六进制字节。

## Conflux.prototype.estimateGasAndCollateral <a id="Conflux.js/estimateGasAndCollateral"></a>

执行消息调用或交易，返回使用的gas总量。

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------------------
options | `object` | true     |         | 参见`format.estimateTx`

* **返回值**

`Promise.<object>`模拟调用/交易使用的gas和存储空间。
- `BigInt` gasUsed: 使用的gas。
- `BigInt` storageCollateralized:抵押的存储空间，以字节为单位。

----------------------------------------

## Contract <a id="contract/Contract.js/Contract"></a>

Contract with all its methods and events defined in its abi.
与ABI中定义方法和事件形成合约

## Contract.prototype.constructor <a id="contract/Contract.js/constructor"></a>

*无描述*

* **参数**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------------------------------------------------------------------
cfx              | `Conflux` | true     |         | Conflux实例
options          | `object`  | true     |         |
options.abi      | `array`   | true     |         | 合约实例化的json接口
options.address  | `string`  | false    |         | 要调用的智能合约地址，随后可以用`contract.address = '0x1234...'`添加。
options.bytecode | `string`  | false    |         | 合约的字节码，随后可以用`contract.constructor.code = '0x1234...'`添加。

* **返回值**

`object` 

* **举例**

```
> const contract = cfx.Contract({ abi, bytecode });
> contract.constructor.bytecode; // input code
   "0x6080604052600080..."
```

```
> const contract = cfx.Contract({ abi, address });
> contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"
> await contract.count(); // call a method without parameter, get decoded return value.
   100n
> await contract.inc(1); // call a method with parameters, get decoded return value.
   101n
> await contract.count().call({ from: account }); // call a method from a account.
   100n
> await contract.count().estimateGas();
   21655n
> await contract.count().estimateGas({ from: ADDRESS, nonce: 68 }); // if from is a address string, nonce is required
   21655n
// send transaction from account instance, then wait till confirmed, and get receipt.
> await contract.inc(1)
   .sendTransaction({ from: account1 })
   .confirmed({ threshold: 0.01, timeout: 30 * 1000 });
   {
     "blockHash": "0xba948c8925f6d7f14faf540c3b9e6d24d33c78168b2dd81a6021a50949d9f0d7",
     "index": 0,
     "transactionHash": "0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42",
     "outcomeStatus": 0,
     ...
   }
> tx = await cfx.getTransactionByHash('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
> await contract.abi.decodeData(tx.data)
   {
      name: 'inc',
      fullName: 'inc(uint256 num)',
      type: 'inc(uint256)',
      signature: '0x7f98a45e',
      array: [ JSBI.BigInt(101) ],
      object: { num: JSBI.BigInt(101) }
   }
> await contract.count(); // data in block chain changed by transaction.
   JSBI.BigInt(101)
> logs = await contract.SelfEvent(account1.address).getLogs()
   [
   {
      address: '0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8',
      blockHash: '0xc8cb678891d4914aa66670e3ebd7a977bb3e38d2cdb1e2df4c0556cb2c4715a4',
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      epochNumber: 545896,
      logIndex: 0,
      removed: false,
      topics: [
        '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
        '0x000000000000000000000000bbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
      ],
      transactionHash: '0x9100f4f84f711aa358e140197e9d2e5aab1f99751bc26a660d324a8282fc54d0',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined',
      params: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', '10' ]
     }
   ]
> contract.abi.decodeLog(logs[0]);
   {
      name: 'SelfEvent',
      fullName: 'SelfEvent(address indexed sender, uint256 current)',
      type: 'SelfEvent(address,uint256))',
      signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      array: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', JSBI.BigInt(100) ],
      object: {
        sender: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        current: JSBI.BigInt(100),
      },
    }
```

----------------------------------------

## Message <a id="Message.js/Message"></a>

*无描述*

## Message.sign <a id="Message.js/sign"></a>

用私钥签名哈希值。

* **参数**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
privateKey  | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **返回值**

`string` 签名是十六进制字符串。

* **举例**

```
> Message.sign(
   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // privateKey
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01"
```

## Message.recover <a id="Message.js/recover"></a>

从签名中恢复签名者的公钥。

* **参数**

Name        | Type            | Required | Default | Description
------------|-----------------|----------|---------|------------
signature   | `string,Buffer` | true     |         |
messageHash | `string,Buffer` | true     |         |

* **返回值**

`string` 公钥是十六进制字符串

* **举例**

```
> Message.recover(
   '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
   '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
   )
   "0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559"
```

## Message.prototype.constructor <a id="Message.js/constructor"></a>

*无描述*

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
message | `string` | true     |         |

* **返回值**

`Message` 

* **举例**

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
   "0x1cad0b19bb29d4674531d6f115237e16afce377c"
> msg.r
   "0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c"
> msg.s
   "0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f"
> msg.v
   1
```

## Message.prototype.hash (getter) <a id="Message.js/hash (getter)"></a>

消息哈希值的获取器，包括签名。

> 注意：每次都要计算。

* **返回值**

`string` 

## Message.prototype.from (getter) <a id="Message.js/from (getter)"></a>

发起者地址获取器。

> 注意：每次都要计算。

* **返回值**

`string,undefined` 如果ECDSA成功恢复，则返回地址，否则返回undefined。

## Message.prototype.sign <a id="Message.js/sign"></a>

签名消息，设置'r','s','v' 和 'hash'.

* **参数**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | 私钥，十六进制字符串。

* **返回值**

`Message` 

----------------------------------------

## BaseProvider <a id="provider/BaseProvider.js/BaseProvider"></a>

*无描述*

## BaseProvider.prototype.constructor <a id="provider/BaseProvider.js/constructor"></a>

*无描述*

* **参数**

Name            | Type     | Required | Default | Description
----------------|----------|----------|---------|-------------------------------
url             | `string` | true     |         | 完整的 json rpc http url
options         | `object` | false    |         |
options.timeout | `number` | false    | 60*1000 | 请求超时（以毫秒为单位）
options.logger  | `object` | false    |         | 带有`info`和`error`的记录器

* **返回值**

`BaseProvider` 

## BaseProvider.prototype.requestId <a id="provider/BaseProvider.js/requestId"></a>

生成一个随机的 json rpcID。
在`call`方法中使用，覆盖它生成你自己的ID。

* **返回值**

`string` 

----------------------------------------

## HttpProvider <a id="provider/HttpProvider.js/HttpProvider"></a>

Http协议json rpc提供者。

## HttpProvider.prototype.constructor <a id="provider/HttpProvider.js/constructor"></a>

*无描述*

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|-------------------------------
url     | `string` | true     |         | 完整的json rpc http url
options | `object` | false    |         | 参见`BaseProvider.constructor`

* **返回值**

`HttpProvider` 

* **举例**

```
> const provider = new HttpProvider('http://testnet-jsonrpc.conflux-chain.org:12537', {logger: console});
```

## HttpProvider.prototype.call <a id="provider/HttpProvider.js/call"></a>

用参数调用json rpc方法

* **参数**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------------------
method    | `string` | true     |         | Json rpc方法名。
...params | `array`  | false    |         | Json rpc方法名。

* **返回值**

`Promise.<*>` Json rpc方法返回值。

* **举例**

```
> await provider.call('cfx_epochNumber');
> await provider.call('cfx_getBlockByHash', blockHash);
```

----------------------------------------

## Transaction <a id="Transaction.js/Transaction"></a>

*无描述*

## Transaction.prototype.constructor <a id="Transaction.js/constructor"></a>

创建一笔交易。

* **参数**

Name                 | Type            | Required | Default | Description
---------------------|-----------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options              | `object`        | true     |         |
options.nonce        | `string,number` | true     |         | 允许使用同一个nonce覆盖你的未确认交易。
options.gasPrice     | `string,number` | true     |         | 此交易的gas价格，以drip为单位。
options.gas          | `string,number` | true     |         | 此交易使用的gas总量（未使用的将会被退回）。
options.to           | `string`        | false    |         | 消息目的地址，合约创建的交易中保持为未被定义。
options.value        | `string,number` | false    | 0       | 交易中的转账价值，以drip为单位，在合约创建的交易中，是指捐赠价值。
options.storageLimit | `string,number` | true     |         | TODO
options.epochHeight  | `string,number` | true     |         | TODO
options.chainId      | `string,number` | false    | 0       | TODO
options.data         | `string,Buffer` | false    | '0x'    | 合约上函数调用数据的ABI字节字符串，或者是指合约创建的交易中的初始化代码。
options.r            | `string,Buffer` | false    |         | ECDSA 签名 r
options.s            | `string,Buffer` | false    |         | ECDSA 签名 s
options.v            | `number`        | false    |         | ECDSA 签名 id

* **返回值**

`Transaction` 

## Transaction.prototype.hash (getter) <a id="Transaction.js/hash (getter)"></a>

交易哈希值获取器，包含签名。

> 注意：每次都要计算

* **返回值**

`string,undefined` 如果交易包含 r,s,v，则返回十六进制字符串，否则返回undefined。

## Transaction.prototype.from (getter) <a id="Transaction.js/from (getter)"></a>

发起者地址获取器。

> 注意：每次都要计算

* **返回值**

`string,undefined` 如果ECDSA成功恢复，返回地址，否则返回undefined。

## Transaction.prototype.sign <a id="Transaction.js/sign"></a>

签名交易，设置'r','s','v'.

* **参数**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------------------
privateKey | `string` | true     |         | 私钥，十六进制字符串。

* **返回值**

`Transaction` 

## Transaction.prototype.recover <a id="Transaction.js/recover"></a>

从已签名的交易中恢复公钥。

* **返回值**

`string` 

## Transaction.prototype.encode <a id="Transaction.js/encode"></a>

加密rlp.

* **参数**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------
includeSignature | `boolean` | false    | false   |是否包含签名

* **返回值**

`Buffer` 

## Transaction.prototype.serialize <a id="Transaction.js/serialize"></a>

获取原始的tx十六进制字符串。

* **返回值**

`string` 十六进制字符串。

----------------------------------------

## format.any (setter) <a id="util/format.js/any (setter)"></a>

*无描述*

* **参数**

Name | Type  | Required | Default | Description
-----|-------|----------|---------|------------
arg  | `any` | true     |         |

* **返回值**

`any` arg

* **举例**

```
> format.any(1)
 1
```

## format.hex (setter) <a id="util/format.js/hex (setter)"></a>

加密未格式化数据（字节数组、账户地址、哈希值、字节码数组）时：加密为十六进制，前缀“0x”， 每个字节包含两位十六进制字符。

* **参数**

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | `number,JSBI,string,Buffer,boolean,null` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.hex(null)
 '0x'
> format.hex(1)
 "0x01"
> format.hex(256)
 "0x0100"
> format.hex(true)
 "0x01"
> format.hex(Buffer.from([1,10,255]))
 "0x010aff"
> format.hex("0x0a")
 "0x0a"
```

## format.uInt (setter) <a id="util/format.js/uInt (setter)"></a>

*无描述*

* **参数**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **返回值**

`Number` 

* **举例**

```
> format.uInt(-3.14)
 Error("cannot be converted to a JSBI")
> format.uInt(null)
 Error("Cannot convert null to a JSBI")
> format.uInt('0')
 0
> format.uInt(1)
 1
> format.uInt(JSBI(100))
 100
> format.uInt('0x10')
 16
> format.uInt('')
 0
> format.uInt(true)
 1
> format.uInt(false)
 0
> format.uInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.bigInt (setter) <a id="util/format.js/bigInt (setter)"></a>

*无描述*

* **参数**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **返回值**

`JSBI` 

* **举例**

```
> format.bigInt(-3.14)
 Error("not match bigInt")
> format.bigInt('0.0')
 JSBI.BigInt(0)
> format.bigInt('-1')
 JSBI.BigInt(-1)
> format.bigInt(1)
 JSBI.BigInt(1)
> format.bigInt(JSBI(100))
 JSBI.BigInt(100)
> format.bigInt('0x10')
 JSBI.BigInt(16)
> format.bigInt(Number.MAX_SAFE_INTEGER + 1) // unsafe integer
 Error("not match uint")
```

## format.bigUInt (setter) <a id="util/format.js/bigUInt (setter)"></a>

*无描述*

* **参数**

Name | Type                         | Required | Default | Description
-----|------------------------------|----------|---------|------------
arg  | `number,JSBI,string,boolean` | true     |         |

* **返回值**

`JSBI` 

* **举例**

```
> format.bigUInt('0.0')
 JSBI.BigInt(0)
> format.bigUInt('-1')
 Error("not match bigUInt")
```

## format.hexUInt (setter) <a id="util/format.js/hexUInt (setter)"></a>

加密数量（整数、数字）时：加密为十六进制，前缀“0x”，最简洁的表示法（少数例外：0需要用“0x0”表示）

* **参数**

Name | Type                    | Required | Default | Description
-----|-------------------------|----------|---------|------------
arg  | `number,string,boolean` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.hexUInt(100)
 "0x64"
> format.hexUInt(10)
 "0xa"
> format.hexUInt(3.50)
 "0x4"
> format.hexUInt(3.49)
 "0x3"
> format.hexUInt(-1))
 Error("not match uintHex")
```

## format.riskNumber (setter) <a id="util/format.js/riskNumber (setter)"></a>

*无描述*

* **参数**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
hex  | `string` | true     |         |

* **返回值**

`number` 

* **举例**

```
> format.riskNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
 1
> format.riskNumber('0xe666666666666666666666666666666666666666666666666666666666666665')
 0.9
```

## format.epochNumber (setter) <a id="util/format.js/epochNumber (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|-----------------------------------------------------
arg  | `number,string` | true     |         | ['latest_state', 'latest_mined']中的数字或字符串

* **返回值**

`string` 

* **举例**

```
> format.epochNumber(10)
 "0xa"
> format.epochNumber('latest_state')
 "latest_state"
> format.epochNumber('latest_mined')
 "latest_state"
```

## format.address (setter) <a id="util/format.js/address (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.address('0x0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
> format.address('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match address")
```

## format.publicKey (setter) <a id="util/format.js/publicKey (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.publicKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 Error("not match publicKey")
```

## format.privateKey (setter) <a id="util/format.js/privateKey (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.signature (setter) <a id="util/format.js/signature (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` 十六进制字符串

## format.blockHash (setter) <a id="util/format.js/blockHash (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` Hex string

* **举例**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.txHash (setter) <a id="util/format.js/txHash (setter)"></a>

*无描述*

* **参数**

Name | Type            | Required | Default | Description
-----|-----------------|----------|---------|------------
arg  | `string,Buffer` | true     |         |

* **返回值**

`string` 十六进制字符串

* **举例**

```
> format.privateKey('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
 "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
> format.privateKey('0x0123456789012345678901234567890123456789')
 Error("not match hex64")
```

## format.buffer (setter) <a id="util/format.js/buffer (setter)"></a>

*无描述*

* **参数**

Name | Type                                     | Required | Default | Description
-----|------------------------------------------|----------|---------|------------
arg  | `number,JSBI,string,Buffer,boolean,null` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> format.buffer(Buffer.from([0, 1]))
 <Buffer 00 01>
> format.buffer(null)
 <Buffer >
> format.buffer(1024)
 <Buffer 04 00>
> format.buffer('0x0a')
 <Buffer 0a>
> format.buffer(true)
 <Buffer 01>
> format.buffer(3.14)
 Error("not match hex")
```

## format.boolean (setter) <a id="util/format.js/boolean (setter)"></a>

*无描述*

* **参数**

Name | Type      | Required | Default | Description
-----|-----------|----------|---------|------------
arg  | `boolean` | true     |         |

* **返回值**

`boolean` 

* **举例**

```
> format.boolean(true)
 true
> format.boolean(false)
 false
```

----------------------------------------

## sha3 <a id="util/sign.js/sha3"></a>

keccak256的别名

* **参数**

Name   | Type     | Required | Default | Description
-------|----------|----------|---------|------------
buffer | `Buffer` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> sha3(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

----------------------------------------

## checksumAddress <a id="util/sign.js/checksumAddress"></a>

创建校验和地址

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
address | `string` | true     |         | 十六进制字符串

* **返回值**

`string` 

* **举例**

```
> checksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
 "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
```

----------------------------------------

## randomBuffer <a id="util/sign.js/randomBuffer"></a>

用`size`字节生成随机缓冲器。

> 注意：调用`crypto.randomBytes`

* **参数**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|------------
size | `number` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```

----------------------------------------

## randomPrivateKey <a id="util/sign.js/randomPrivateKey"></a>

生成一个随机私钥缓冲器。

* **参数**

Name    | Type     | Required | Default | Description
--------|----------|----------|---------|------------
entropy | `Buffer` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

----------------------------------------

## privateKeyToPublicKey <a id="util/sign.js/privateKeyToPublicKey"></a>

*无描述*

* **参数**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **返回值**

`Buffer` 

----------------------------------------

## publicKeyToAddress <a id="util/sign.js/publicKeyToAddress"></a>

用公钥获取账户地址。

> 账户地址是“0x1”开头的十六进制。

* **参数**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
publicKey | `Buffer` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

----------------------------------------

## privateKeyToAddress <a id="util/sign.js/privateKeyToAddress"></a>

用私钥获取地址

* **参数**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
privateKey | `Buffer` | true     |         |

* **返回值**

`Buffer` 

* **举例**

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

## ecdsaSign <a id="util/sign.js/ecdsaSign"></a>

签名 ecdsa

* **参数**

Name       | Type     | Required | Default | Description
-----------|----------|----------|---------|------------
hash       | `Buffer` | true     |         |
privateKey | `Buffer` | true     |         |

* **返回值**

`object` ECDSA 签名对象。
- r {Buffer}
- s {Buffer}
- v {number}

* **举例**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```

----------------------------------------

## ecdsaRecover <a id="util/sign.js/ecdsaRecover"></a>

恢复 ecdsa

* **参数**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------
hash      | `Buffer` | true     |         |
options   | `object` | true     |         |
options.r | `Buffer` | true     |         |
options.s | `Buffer` | true     |         |
options.v | `number` | true     |         |

* **返回值**

`Buffer` 公钥

* **举例**

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------------------------------------

## encrypt <a id="util/sign.js/encrypt"></a>

*无描述*

* **参数**

Name     | Type     | Required | Default | Description
---------|----------|----------|---------|------------
key      | `Buffer` | true     |         |
password | `Buffer` | true     |         |
options  | `object` | true     |         |

* **返回值**

`object` Encrypt info
- salt {Buffer}
- iv {Buffer}
- cipher {Buffer}
- mac {Buffer}
- algorithm {string}
- N {number}
- r {number}
- p {number}
- dkLen {number}

----------------------------------------

## decrypt <a id="util/sign.js/decrypt"></a>

*无描述*

* **参数**

Name              | Type     | Required | Default       | Description
------------------|----------|----------|---------------|------------
password          | `Buffer` | true     |               |
options           | `object` | true     |               |
options.algorithm | `string` | false    | 'aes-128-ctr' |
options.N         | `number` | false    | 8192          |
options.r         | `number` | false    | 8             |
options.p         | `number` | false    | 1             |
options.dkLen     | `number` | false    | 32            |
options.salt      | `Buffer` | true     |               |
options.iv        | `Buffer` | true     |               |
options.cipher    | `Buffer` | true     |               |
options.mac       | `Buffer` | true     |               |

* **返回值**

`Buffer` 

----------------------------------------

## unit <a id="util/unit.js/unit"></a>

单位换算器工厂

* **参数**

Name | Type     | Required | Default | Description
-----|----------|----------|---------|---------------------------------
from | `string` | true     |         | Enum in ['CFX', 'GDrip', 'Drip']
to   | `string` | true     |         | Enum in ['CFX', 'GDrip', 'Drip']

* **返回值**

`string` 

* **举例**

```
> unit('CFX', 'Drip')(1)
 "1000000000000000000"
> unit('Drip', 'CFX')(1000000000000000000)
 "1"
```

```
> unit.fromCFXToGDrip(123)
 "123000000000"
```

```
> fromCFXToDrip(123)
 "123000000000000000000"
```

```
> fromGDripToCFX(123000000000)
 "123"
```

```
> fromGDripToDrip(123)
 "123000000000"
```

```
> fromDripToCFX(123000000000000000000)
 "123"
```

```
> fromDripToGDrip(123000000000)
 "123"
```