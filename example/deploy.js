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
  console.log(estimateDeployGas.toString()); // 173978

  // deploy the contract
  const { contractCreated } = await contract.constructor(10)
    .sendTransaction({
      from: account,
      // gas: estimateDeployGas, // if not set gas, will use 'cfx.defaultGas'
    })
    .confirmed();

  console.log(contractCreated); // 0x32116df84f12e1fc936720a57bbdcba2a1e1ff05
  contract.address = contractCreated;

  // FIXME: user might need to wait few seconds here

  console.log(await cfx.getCode(contractAddress));

  /*
   call contract method.
   'count' is a method name, see solidity.sol
   */
  console.log(await contract.count()); // BigNumber { _hex: '0x0a' }, 10 in hex set by 'contract.constructor(10)'
}

main().catch(e => console.error(e));
