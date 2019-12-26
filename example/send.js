/* eslint-disable */

const Conflux = require('../src');

const PRIVATE_KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717b....................';

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  // ================================ Account ================================
  const account = cfx.wallet.add(PRIVATE_KEY); // create account instance

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    address: '0x32116df84f12e1fc936720a57bbdcba2a1e1ff05',
    abi: require('./contract/abi.json'),
    // code: require('./code.json'), unnecessary
  });

  console.log(JSON.stringify(await contract.count())); // "10" set by 'contract.constructor(10)'

  /*
   estimate gas if you not sure cfx.defaultGas is enough or not
   */
  const estimateIncGas = await contract.inc(1).estimateGas();
  console.log(estimateIncGas); // 26950

  /*
   send transaction to contract, `gas` is optional and use cfx.defaultGas as default.
   use `.confirmed()` to wait till transaction confirmed directly.
   */
  const receipt = await contract.inc(1).sendTransaction({ from: account, gas: estimateIncGas }).confirmed();
  console.log(receipt);
  // {
  //   blockHash: '0x278cc391a8fecfd9294e9cb20c837bd4f8d6692b3b5ff9ae48b17e88a600c4a0',
  //   contractCreated: null,
  //   epochNumber: 389862,
  //   from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   gasUsed: BigNumber { s: 1, e: 4, c: [ 26950 ] },
  //   index: 0,
  //   logs: [],
  //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  //   outcomeStatus: 0,
  //   stateRoot: '0x7a3af18a984f5c0fdb4d0895f3b1bfda2989ba2af3aa826ff56f9c3f8d63d0e9',
  //   to: '0xbd72de06cd4a94ad31ed9303cf32a2bccb82c404',
  //   transactionHash: '0x254d0dac130c9ac5b23abdb1a65a2ac7f20c8fcc0c5e3a8e3e45aa6f58111f19'
  // }

  console.log(JSON.stringify(await contract.count())); // "11", data in block chain changed !!!

  // FIXME: user might need to wait few seconds here

  // ============================= Advance Usage ==============================
  /*
   use subscribe promise to trace transaction step by step
   */
  const promise = contract.inc(1).sendTransaction({ from: account }); // not await !!!

  // get transaction hash
  const txHash = await promise;
  console.log(txHash);
  // "0xb0920df2ab4fe635304ca80e87a2c6c91a0bb29eefa5b8f2efab5a5dc23a197f"

  // get transaction immediate, `blockHash` still in this moment
  const getTx = await promise.get();
  console.log(getTx);
  // {
  //   "blockHash": null,
  //   "contractCreated": null,
  //   "data": "0x812600df0000000000000000000000000000000000000000000000000000000000000001",
  //   "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "gas": "1000000",
  //   "gasPrice": "100",
  //   "hash": "0xb0920df2ab4fe635304ca80e87a2c6c91a0bb29eefa5b8f2efab5a5dc23a197f",
  //   "nonce": 23,
  //   "r": "0x4993a3b854ce6e24d79728fbd68c5abd99675f88d97174d97b4824fecc2c64fe",
  //   "s": "0x21df8be0bdb0ed187b0c3fc55ea7d43e5ebdd2c59bc3a62fb5aecee5f4c69f3e",
  //   "status": null,
  //   "to": "0x32116df84f12e1fc936720a57bbdcba2a1e1ff05",
  //   "transactionIndex": null,
  //   "v": 0,
  //   "value": "0"
  // }

  // wait till transaction to be mined, and `blockHash` filled.
  const minedTx = await promise.mined();
  console.log(minedTx);
  // {
  //   "blockHash": "0xd7832660edfa30cbfedb04056ba867399b32cc4175af73be42d9c625d8c0b728",
  //   "contractCreated": null,
  //   "data": "0x812600df0000000000000000000000000000000000000000000000000000000000000001",
  //   "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "gas": "1000000",
  //   "gasPrice": "100",
  //   "hash": "0xb0920df2ab4fe635304ca80e87a2c6c91a0bb29eefa5b8f2efab5a5dc23a197f",
  //   "nonce": 23,
  //   "r": "0x4993a3b854ce6e24d79728fbd68c5abd99675f88d97174d97b4824fecc2c64fe",
  //   "s": "0x21df8be0bdb0ed187b0c3fc55ea7d43e5ebdd2c59bc3a62fb5aecee5f4c69f3e",
  //   "status": 0,
  //   "to": "0x32116df84f12e1fc936720a57bbdcba2a1e1ff05",
  //   "transactionIndex": 0,
  //   "v": 0,
  //   "value": "0"
  // }

  // wait till transaction to be executed, and can get receipt now.
  const executedReceipt = await promise.executed();
  console.log(executedReceipt);
  // {
  //   "blockHash": "0xd7832660edfa30cbfedb04056ba867399b32cc4175af73be42d9c625d8c0b728",
  //   "contractCreated": null,
  //   "epochNumber": 774008,
  //   "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "gasUsed": "26950",
  //   "index": 0,
  //   "logs": [],
  //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  //   "outcomeStatus": 0,
  //   "stateRoot": "0x27b8c390f75de6acd06d1898340b294321debf47faf9467fc4226ead1e38b218",
  //   "to": "0x32116df84f12e1fc936720a57bbdcba2a1e1ff05",
  //   "transactionHash": "0xb0920df2ab4fe635304ca80e87a2c6c91a0bb29eefa5b8f2efab5a5dc23a197f"
  // }

  // wait till transaction revert risk < 0.01
  const confirmedReceipt = await promise.confirmed({ threshold: 0.01 });
  console.log(confirmedReceipt);
  // {
  //   "blockHash": "0xd7832660edfa30cbfedb04056ba867399b32cc4175af73be42d9c625d8c0b728",
  //   "contractCreated": null,
  //   "epochNumber": 774008,
  //   "from": "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
  //   "gasUsed": "26950",
  //   "index": 0,
  //   "logs": [],
  //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  //   "outcomeStatus": 0,
  //   "stateRoot": "0x27b8c390f75de6acd06d1898340b294321debf47faf9467fc4226ead1e38b218",
  //   "to": "0x32116df84f12e1fc936720a57bbdcba2a1e1ff05",
  //   "transactionHash": "0xb0920df2ab4fe635304ca80e87a2c6c91a0bb29eefa5b8f2efab5a5dc23a197f"
  // }
}

main().catch(e => console.error(e));
