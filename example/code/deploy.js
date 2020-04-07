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

  console.log(cfx.defaultGasPrice); // 100
  console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('../contract/abi.json'),
    bytecode: require('../contract/bytecode.json'),
    // address is empty and wait for deploy
  });

  // estimate deploy contract gas use
  const estimate = await contract.constructor(10).estimateGasAndCollateral();
  console.log(JSON.stringify(estimate)); // {"gasUsed":"175050","storageCollateralized":"64"}

  // deploy the contract, and get `contractCreated`
  const receipt = await contract.constructor(10)
    .sendTransaction({ from: account })
    .confirmed();
  console.log(receipt); // receipt.contractCreated: 0x8de528bc539e9be1fe5682f597e1e83f6b4e841b
  // {
  //   index: 0,
  //   epochNumber: 1276551,
  //   outcomeStatus: 0,
  //   gasUsed: 175050n,
  //   blockHash: '0x0d770a1d2036e10a019891ffc3e7ccba86a6fc1a48d7faf53f32329378986b21',
  //   contractCreated: '0x8de528bc539e9be1fe5682f597e1e83f6b4e841b',
  //   from: '0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  //   logs: [],
  //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  //   stateRoot: '0x2fc5606ffda21fdb04c98e403fd396e1f3cf768873b08cbf1d67103f1c65932c',
  //   to: null,
  //   transactionHash: '0x2cde7233206b505730b779fded515317bbbc112d30de62e790db8361fe5e9df3'
  // }
}

main().catch(e => console.error(e));
