/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');

const PRIVATE_KEY = 'Your Private Key';

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  // ================================ Account ================================
  const account = cfx.Account(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('../contract/abi.json'),
    // code is unnecessary
    address: '0x87c23fe65347977112fb454050c82788822f8a0f',
  });

  const before = await contract.get(); // ret instance of JSBI.BigInt
  console.info(before.toString()); // "10", set by 'contract.constructor(10)'

  /*
   estimate gas if you not sure cfx.defaultGas is enough or not
   */
  const estimate = await contract.inc(1).estimateGasAndCollateral();
  console.info(JSON.stringify(estimate)); // {"gasUsed":"26950","storageCollateralized":"0"}

  /*
   send transaction to contract, `gas` is optional and use cfx.defaultGas as default.
   use `.confirmed()` to wait till transaction confirmed directly.
   */
  const receipt = await contract.inc(1).sendTransaction({
    from: account,
    // to: contract.address, // sdk fill auto
    // data: contract.inc(1).data // sdk fill auto
    // nonce, // if missing, sdk will fill by `cfx.getNextNonce(account)` auto
    // gas: estimate.gasUsed, // if missing, sdk will fill by `cfx.estimateGasAndCollateral(...)` got `gasUsed` auto
    // storageLimit: estimate.storageCollateralized, // if missing, sdk will fill by `cfx.estimateGasAndCollateral(...)` got `storageCollateralized` auto
    // gasPrice, // if missing, sdk will fill by `cfx.getGasPrice()` auto.
    // epochHeight, // if missing, sdk will fill by `cfx.getEpochNumber()` auto
  }).confirmed();

  console.info(JSON.stringify(receipt, null, 2));
  // {
  //   "index": 0,
  //   "epochNumber": 1366360,
  //   "outcomeStatus": 0,
  //   "gasUsed": "750000",
  //   "blockHash": "0xce2a679870bdddd060269f756af3a6203811d2fe7c87e0ed4e600d9cfa4a59bb",
  //   "contractCreated": null,
  //   "from": "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "logs": [
  //     {
  //       "address": "0x87c23fe65347977112fb454050c82788822f8a0f",
  //       "data": "0x000000000000000000000000000000000000000000000000000000000000000a",
  //       "topics": [
  //         "0xfceb437c298f40d64702ac26411b2316e79f3c28ffa60edfc891ad4fc8ab82ca",
  //         "0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
  //       ]
  //     }
  //   ],
  //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000800000008000002000000000000000000000000080000000000000",
  //   "stateRoot": "0xb35532e62dbca0347b68855b63d83eb7c2e42f7179abecf2d78c9ea7c91d2f76",
  //   "to": "0x87c23fe65347977112fb454050c82788822f8a0f",
  //   "transactionHash": "0x6464a9dfc938bee1427c5a8e5c1d1b880802f854f0a6183b34cde584b578d5a3"
  // }

  const after = await contract.get(); // ret instance of JSBI.BigInt
  console.info(after.toString()); // "11", data in block chain changed !!!

  // ================================ Query ================================
  /*
    solidity: `event Event(address indexed sender, uint count);`
    get logs filter by sender === account (address) and from epoch 1366360
   */
  const logs = await contract.Event(account, undefined).getLogs({ fromEpoch: 1366360 });

  console.info(JSON.stringify(logs, null, 2));
  // [
  //   {
  //     "epochNumber": 1366360,
  //     "logIndex": 0,
  //     "transactionIndex": 0,
  //     "transactionLogIndex": 0,
  //     "address": "0x87c23fe65347977112fb454050c82788822f8a0f",
  //     "blockHash": "0xce2a679870bdddd060269f756af3a6203811d2fe7c87e0ed4e600d9cfa4a59bb",
  //     "data": "0x000000000000000000000000000000000000000000000000000000000000000a",
  //     "topics": [
  //       "0xfceb437c298f40d64702ac26411b2316e79f3c28ffa60edfc891ad4fc8ab82ca",
  //       "0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b"
  //     ],
  //     "transactionHash": "0x6464a9dfc938bee1427c5a8e5c1d1b880802f854f0a6183b34cde584b578d5a3",
  //     "params": [
  //       "0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //       "10"
  //     ]
  //   }
  // ]
}

main().catch(e => console.error(e));
