# Interact with contract
In Conflux world you may often need to interact with contracts, with JS SDK this can be done very easy.

>Note: when interacting with contract and if your parameter is bigger than `Number.MAX_SAFE_INTEGER`, you should use string represention of the number or BigInt.

```js
// use string
await contract.deposit('90071992547409910').sendTransaction({from: 'cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76'});
// or use hex string
await contract.deposit('0x13ffffffffffff0').sendTransaction({from: 'cfxtest:aar7x4r8mkrnw39ggs8rz40j1znwh5mrrpufpr2u76'});
// not use number
// await contract.deposit(Number.MAX_SAFE_INTEGER * 10);
```

### How to deploy a contract
One contract must be created before interacting with it. To create a contract you can write it with `solidity`.
Then compile it with solidity compiler or [cfxtruffle](http://github.com/conflux-chain/truffle), you will get `bytecode` and `abi`. With `bytecode`, `abi` you can deploy it by send a transaction.

```js
const { Conflux } = require('js-conflux-sdk');
const { abi, bytecode } = MINI_ERC20; // see https://github.com/Conflux-Chain/js-conflux-sdk/tree/master/example/contract/miniERC20.json

const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // sender private key

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
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

### How to get and update contract's state

After you got the contract address, you can interact with it. The Conflux network makes a distinction between writing data to the network and reading data from it, and this distinction plays a significant part in how you write your application, and this behavior is very like Ethereum network. In general, writing data is called a transaction whereas reading data is called a call. Transactions and calls are treated very differently, and have the [following characteristics](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#reading-and-writing-data).

```javascript
const { Conflux } = require('js-conflux-sdk');
const { abi } = MINI_ERC20;

async function main() {
  const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
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

  // 4. change contract state by send a transaction
  const transactionHash = await contract.transfer(ADDRESS, 10).sendTransaction({ from: account }); 
  console.log(transactionHash); // 0xb31eb095b62bed1ef6fee6b7b4ee43d4127e4b42411e95f761b1fdab89780f1a
}

main();
```

### How to play with InternalContract
Conflux network has provide three Internal Contract `AdminControl`, `SponsorWhitelistControl`, `Staking`, these internal contract are very helpful to contract developer, for detail documentation check [official doc](https://developer.conflux-chain.org/docs/conflux-rust/internal_contract/internal_contract). This SDK have fully support for Internal Contract, you can use them like this.

```javascript
const { Conflux } = require('js-conflux-sdk');

async function main() {
    const conflux = new Conflux({ 
        url: 'http://test.confluxrpc.org/v2',
        networkId: 1,
    });
    
    // 1. get internal contract through InternalContract method and pass the internal contract name
    const sponsor = conflux.InternalContract('SponsorWhitelistControl');
    const gasSponsor = await sponsor.getSponsorForGas('cfxtest:acg6rb7s9h1be63zjrhbyc5mc4w3jhk5p6eempe9hk');
}
main();
```