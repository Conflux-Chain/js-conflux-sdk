/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  // create contract instance by address, which deploy in `deploy.js`.
  const contract = cfx.Contract({
    address: '0xf30ffa8833e44f33f362399bd39cca004ff3ffe1',
    abi: require('./contract/abi.json'),
  });

  /**
   * call contract function.
   * `count` is a function name, see `solidity.sol`
   */
  console.log(await contract.count()); // 10n, set by 'contract.constructor(10)'

  /**
   * call contract function with params.
   * (Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the block chain.)
   */
  console.log(await contract.inc(1)); // 11n, 11=10+1

  /**
   * get a encode data
   * (if you not await a called method, it will not send a rpc call)
   */
  console.log(contract.inc(1).data); // 0x812600df0000000000000000000000000000000000000000000000000000000000000001

  /**
   * as you see, above call operation not change the count!
   */
  console.log(await contract.count()); // 10n

  /**
   * `self` is a function which emit a `SelfEvent` event, but will not level log cause `cfx_call` operate.
   */
  console.log(await contract.self()); // undefined

  const iter = contract.SelfEvent().getLogs({ fromEpoch: 228412, toEpoch: 228459 });
  for await (const log of iter) {
    console.log(log);
  }
}

main().catch(e => console.error(e));
