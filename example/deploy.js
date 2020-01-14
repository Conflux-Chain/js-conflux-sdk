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

  console.log(cfx.defaultGasPrice); // 100
  console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.wallet.add(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('./contract/abi.json'),
    code: require('./contract/code.json'),
  });

  // estimate deploy contract gas use
  const estimateDeployGas = await contract.constructor(10).estimateGas();
  console.log(estimateDeployGas); // "173978n"

  // deploy the contract
  const { contractCreated } = await contract.constructor(10)
    .sendTransaction({
      from: account,
      // gas: estimateDeployGas, // if not set gas, will use 'cfx.defaultGas'
    })
    .confirmed();

  console.log(contractCreated); // 0xf30ffa8833e44f33f362399bd39cca004ff3ffe1
  contract.address = contractCreated;

  // FIXME: user might need to wait few seconds here

  console.log(await cfx.getCode(contractAddress));

  /*
   call contract method.
   'count' is a method name, see solidity.sol
   */
  console.log(await contract.count()); // 10n, set by 'contract.constructor(10)'
}

main().catch(e => console.error(e));
