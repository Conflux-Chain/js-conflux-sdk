# Interact with contract

In Conflux world you may often need to interact with contracts, with JS SDK this can be done very easy.

## How to deploy a contract

One contract must be created before interacting with it. To create a contract you can develop it with `solidity`. Then compile it with solidity compiler or [cfxtruffle](http://github.com/conflux-chain/truffle), you will get `bytecode` and `abi`. With `bytecode`, `abi` you can deploy it by send a transaction.

```javascript
const { Conflux } = require('js-conflux-sdk');
const { abi, bytecode } = MINI_ERC20; // see https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/example/contract/miniERC20.json

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key

async function main() {
  const conflux = new Conflux({ 
    url: 'https://test.confluxrpc.com',
    networkId: 1,
  });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY);

  // 1. initialize a contract with abi and bytecode
  const contract = conflux.Contract({ abi, bytecode });

  // 2. specify constructor's parameter, if constructor need no parameter leave it empty
  const receipt = await contract.constructor('MiniERC20', 18, 'MC', 10000)
  // 3. send transaction to deploy the contract, you can specify any transaction parameter here  
    .sendTransaction({ from: account })   
    .executed();
  console.log(receipt);
  // 4. If your transaction executed successfully then you have deploy a new contract
  // 5. The receipt.contractCreated is the address of the new deployed contract
  /*
  {
    "index": 0,
    "epochNumber": 318456,
    "outcomeStatus": 0,
    "gasUsed": 1054531n,
    "gasFee": 1054531000000000n,
    "blockHash": "0x4a8b07e2694e358af075f7a9e96e78842b77ac2d511e2ab33f6acfff34a5846c",
    "contractCreated": "CFXTEST:TYPE.CONTRACT:ACFK2K2SDMP6A1FKB52TAAENV7WEKX24W6KKF7RF0E",
    "from": "cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x0940d4870e25bae1e7a5e5d7c19411b41922c025aa3de61aea2be17759673b1a",
    "to": null,
    "transactionHash": "0x6f55e67b486b5ef0c658c6d50cb5b89a2a2ddfecc1a1f2e414bbbefe36ef8dd5"
  }
  */

  // created contract address: "CFXTEST:TYPE.CONTRACT:ACFK2K2SDMP6A1FKB52TAAENV7WEKX24W6KKF7RF0E"
}

main().catch(console.log);
```

Check the transaction you will find the tx data is the contract bytecode and constructor's encoded signature.

## How to get and update contract's state

After you got the contract address, you can interact with it. The Conflux network makes a distinction between writing data to the network and reading data from it, and this distinction plays a significant part in how you write your application, and this behavior is very like Ethereum network. In general, writing data is called a transaction whereas reading data is called a call. Transactions and calls are treated very differently, and have the [following characteristics](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#reading-and-writing-data).

```javascript
const { Conflux } = require('js-conflux-sdk');
const { abi } = MINI_ERC20;

async function main() {
  const conflux = new Conflux({ 
    url: 'https://test.confluxrpc.com',
    networkId: 1,
  });
  const account = conflux.wallet.addPrivateKey(PRIVATE_KEY);
  // 1. initialize contract with abi and address
  const contract = conflux.Contract({ abi, address: 'cfxtest:acfk2k2sdmp6a1fkb52taaenv7wekx24w6kkf7rf0e' });
  // 2. call method to get contract state
  const name = await contract.name(); 
  console.log(name); // MiniERC20
  // 3. user can set options by `contract.name().call({ from: account, ... })`

  // 4. call method with arguments
  const balance = await contract.balanceOf(account.address); 
  console.log(balance); // 10000n

  // 5. change contract state by send a transaction
  const transactionHash = await contract.transfer(ADDRESS, 10).sendTransaction({ from: account }); 
  console.log(transactionHash); // 0xb31eb095b62bed1ef6fee6b7b4ee43d4127e4b42411e95f761b1fdab89780f1a

  // 6. estimate contract method gas and storage
  const estimated = await contract.transfer(ADDRESS, 10).estimateGasAndCollateral({from: account}, epochNumber);

  // 7. get contract method data
  const transferMethodData = contract.transfer(ADDRESS, 10).data;
}

main();
```

## How to play with InternalContract

Conflux network has provide Internal Contracts `AdminControl`, `SponsorWhitelistControl`, `Staking`, these internal contract are very helpful to contract developer, for detail documentation check [official doc](https://developer.confluxnetwork.org/conflux-rust/internal_contract/internal_contract). This SDK have fully support for Internal Contract, you can use them like this.

```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
    const conflux = new Conflux({ 
        url: 'https://test.confluxrpc.com',
        networkId: 1,
    });

    // 1. get internal contract through InternalContract method and pass the internal contract name
    const sponsor = conflux.InternalContract('SponsorWhitelistControl');
    const gasSponsor = await sponsor.getSponsorForGas('cfxtest:acg6rb7s9h1be63zjrhbyc5mc4w3jhk5p6eempe9hk');
}
main();
```

Available internal contracts:

* `AdminControl`
* `SponsorWhitelistControl`
* `Staking`
* `PoSRegister`
* `CrossSpaceCall`
* `ParamsControl`

## How to get log

### Get log through tranction receipt

If an transaction emit some logs, you can find them in transaction receipt's `logs` field. Which is an log array, each log will have three fields:

* `address`
* `data`
* `topics`

```js
let receipt = await conflux.cfx.getTransactionReceipt('0x24017dac1fb595a57196d8f6b05cd8b06292dcf14e7c594eac41daeeaa374ed0');
console.log(receipt.logs);
/*
[
    {
        "address": "CFX:TYPE.CONTRACT:ACA13SUYK7MBGXW9Y3WBJN9VD136SWU6S21TG67XMB",
        "data": "0x000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "topics": [
            "0x06b541ddaa720db2b10a4d0cdac39b8d360425fc073085fac19bc82614677987",
            "0x00000000000000000000000080ae6a88ce3351e9f729e8199f2871ba786ad7c5",
            "0x0000000000000000000000001dc05200485776b79f195a1e617dbccb6826f1c4",
            "0x0000000000000000000000008dfa3b664cd6a62bc30f31a9f167f68806ef3488"
        ]
    }
]
*/
```

### Get log with `cfx_getLogs` method

Also there is an RPC [`cfx_getLogs`](https://developer.confluxnetwork.org/conflux-doc/docs/json_rpc#cfx_getlogs) to get logs. An filter object is need to invoke this method.

```js
let logs = await conflux.cfx.getLogs({
  fromEpoch: 100,
  toEpoch: 200,
  address: 'cfx:type.contract:acc7uawf5ubtnmezvhu9dhc6sghea0403y2dgpyfjp',
  limit: 100
});

/*
[
   {
      epochNumber: 39802,
      logIndex: 2,
      transactionIndex: 0,
      transactionLogIndex: 2,
      address: 'CFXTEST:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXA2GC31EUW',
      blockHash: '0xca00158a2a508170278d5bdc5ca258b6698306dd8c30fdba32266222c79e57e6',
      data: '0x',
      topics: [
        '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde',
        '0x0000000000000000000000001c1e72f0c37968557b3d85a3f32747792798bbde'
      ],
      transactionHash: '0xeb75f47002720311f1709e36d7f7e9a91ee4aaa469a1de892839cb1ef66a9939'
    }
]
*/
```

How to build the filter `topics`

```js
// initialize a contract instance with abi and address
let fc = conflux.Contract({
  abi: CRC20_ABI,
});

// This example will use ERC20's "Transfer" event as example
// Get event signature
console.log('Event signature: ', fc.Transfer.signature);

// Get event topics by invoke encodeTopics method with parameters as array
console.log(fc.Transfer.encodeTopics([account.address, targetAddress, 100]));

// Get an event's log filter, which can be used as 
console.log(fc.Transfer(account.address, targetAddress, 100));

// Get "Transfer" logs
let logs = await fc.Transfer(account.address, targetAddress, 100).getLogs();

// Subscribe to "Transfer" logs
let sub = await fc.Transfer(account.address, targetAddress, 100).subscribeLogs();
sub.on('data', console.log);
```

### Subscribe logs with websocket

With websocket's advantage, logs can be subscribed:

```js
let logFilter = {
  address: token_address,
  // other filter options
};

let subers = cfx.subscribeLogs(logs);
subers.on("data", console.log);
```

### How to decode log

With contract's abi, you can decode the event log data:

```js
const abi = [
  // your contract ABI
];
let contract = cfx.Contract({abi});
let decoded = contract.abi.decodeLog(log);
console.log(decoded);
```

## MISC

### BigNumber

> Note: when interacting with contract and if your parameter is bigger than `Number.MAX_SAFE_INTEGER`, you should use string represention of the number or BigInt.

```javascript
// use string
await contract.deposit('90071992547409910').sendTransaction({from: 'cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76'});
// or use hex string
await contract.deposit('0x13ffffffffffff0').sendTransaction({from: 'cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76'});
// not use number
// await contract.deposit(Number.MAX_SAFE_INTEGER * 10);
```

### MethodOverride

If there are several methods that have same name in one contract. In most situation SDK can choose the right method through arguments. But sometimes you will encounter with error `Error: can not match override "xxxx" with args` for example `Error: can not match override "placeBid(uint256,address)|placeBid(uint256)" with args`, this is because SDK can not determine invoke which method through args.

For this situation user can invoke method through `whole method signature`

```js
await contract['placeBid(uint256,address)'])(123, 'cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76');
// or
await contract['placeBid(uint256)'](123);
```