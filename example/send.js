/* eslint-disable */

const Conflux = require('../src');

const PRIVATE_KEY = 'Your Private Key';

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
    address: '0xf30ffa8833e44f33f362399bd39cca004ff3ffe1',
    abi: require('./contract/abi.json'),
    // code: require('./code.json'), unnecessary
  });

  console.log(await contract.count()); // 10n, set by 'contract.constructor(10)'

  /*
   estimate gas if you not sure cfx.defaultGas is enough or not
   */
  const estimateIncGas = await contract.inc(1).estimateGas();
  console.log(estimateIncGas); // 26950n

  /*
   send transaction to contract, `gas` is optional and use cfx.defaultGas as default.
   use `.confirmed()` to wait till transaction confirmed directly.
   */
  const receipt = await contract.inc(1).sendTransaction({ from: account, gas: estimateIncGas }).confirmed();
  console.log(receipt);
  // {
  //   index: 0,
  //   epochNumber: 233560,
  //   outcomeStatus: 0,
  //   gasUsed: 26950n,
  //   blockHash: '0xc16ba05ec2921e21129f265c13cc88d579ff9e80206f9181be95cf6ce98d6f22',
  //   contractCreated: null,
  //   from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   logs: [],
  //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  //   stateRoot: '0x5426d5a953308ddc1a8e8ab6fb88fe95d3ff7fb8910f396b436ed20956ed3794',
  //   to: '0xf30ffa8833e44f33f362399bd39cca004ff3ffe1',
  //   transactionHash: '0x438247448eb97b9d2e71ee3f40bb2b7cd086f2e84f8d730561c5236cdc727ea6'
  // }

  console.log(await contract.count()); // 11n, data in block chain changed !!!

  // FIXME: user might need to wait few seconds here

  // ============================= Advance Usage ==============================
  /*
   use subscribe promise to trace transaction step by step
   */
  const promise = contract.inc(1).sendTransaction({ from: account }); // not await !!!

  // get transaction hash
  const txHash = await promise;
  console.log(txHash);
  // "0x7f52b883bda00323cc44848abb3e1944395d2d69d3c884986b4aca2ef2de849c"

  // get transaction immediate, `blockHash` still in this moment
  const getTx = await promise.get();
  console.log(getTx);
  // {
  //   nonce: 2,
  //   value: 0n,
  //   gasPrice: 100n,
  //   gas: 1000000n,
  //   v: 1,
  //   transactionIndex: null,
  //   status: null,
  //   blockHash: null,
  //   contractCreated: null,
  //   data: '0x812600df0000000000000000000000000000000000000000000000000000000000000001',
  //   from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   hash: '0x7f52b883bda00323cc44848abb3e1944395d2d69d3c884986b4aca2ef2de849c',
  //   r: '0x490164c23913460ee9312955c3f8d9186d9cf029978f2ae717ffd16826f1706f',
  //   s: '0x2f2bd7975f4c804ec3b94e4d799a0bb07e929beb8ad35848307f2cad3df78ff8',
  //   to: '0xf30ffa8833e44f33f362399bd39cca004ff3ffe1'
  // }

  // wait till transaction to be mined, and `blockHash` filled.
  const minedTx = await promise.mined();
  console.log(minedTx);
  // {
  //   transactionIndex: 0,
  //   status: 0,
  //   blockHash: '0x679f316fbdbf6951393ddcbf36939ff44b024b7ee3416fe0b50cf75f347e3ce1',
  //   contractCreated: null,
  //   hash: '0x7f52b883bda00323cc44848abb3e1944395d2d69d3c884986b4aca2ef2de849c',
  //   ...
  // }

  // wait till transaction to be executed, and can get receipt now.
  const executedReceipt = await promise.executed();
  console.log(executedReceipt);
  // {
  //   index: 0,
  //   epochNumber: 233652,
  //   outcomeStatus: 0,
  //   gasUsed: 26950n,
  //   blockHash: '0x679f316fbdbf6951393ddcbf36939ff44b024b7ee3416fe0b50cf75f347e3ce1',
  //   contractCreated: null,
  //   from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   logs: [],
  //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  //   stateRoot: '0xa152983752e927a1e41c58155b11892362f29c6b1fa6cf3264be02d6f05d16a2',
  //   to: '0xf30ffa8833e44f33f362399bd39cca004ff3ffe1',
  //   transactionHash: '0x7f52b883bda00323cc44848abb3e1944395d2d69d3c884986b4aca2ef2de849c'
  // }

  // wait till transaction revert risk < 0.01
  const confirmedReceipt = await promise.confirmed({ threshold: 0.01 });
  console.log(confirmedReceipt); // same as above
}

main().catch(e => console.error(e));
