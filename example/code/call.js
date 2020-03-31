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
    abi: require('../contract/abi.json'),
    // code is unnecessary
    address: '0x8de528bc539e9be1fe5682f597e1e83f6b4e841b',
  });

  console.log(await cfx.getCode(contract.address)); // same as './contract/code.json'
  // 0x608060405234801561001057600080fd5b50600436106100415...

  let ret;
  /**
   * call contract function.
   * `get` is a function name, see `solidity.sol`
   */
  ret = await contract.get(); // ret instance of JSBI.BigInt
  console.log(ret.toString()); // "10", set by 'contract.constructor(10)'

  /**
   * call contract function with params.
   * (Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the block chain.)
   */
  ret = await contract.inc(1);
  console.log(ret.toString()); // "11", 11=10+1

  /**
   * as you see, above call operation not change the get!
   */
  ret = await contract.get();
  console.log(ret.toString()); // "10"

  /**
   * get a encode data
   * (if you not await a called method, it will not send a rpc call)
   */
  console.log(contract.inc(1).data); // 0x812600df0000000000000000000000000000000000000000000000000000000000000001
}

main().catch(e => console.error(e));
