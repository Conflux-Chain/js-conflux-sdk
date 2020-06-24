const lodash = require('lodash');
const ContractABICoder = require('./ContractABICoder');
const ContractConstructor = require('./ContractConstructor');
const ContractMethod = require('./ContractMethod');
const ContractEvent = require('./ContractEvent');

/**
 * Contract with all its methods and events defined in its abi.
 */
class Contract {
  /**
   *
   * @param cfx {Conflux} - Conflux instance.
   * @param options {object}
   * @param options.abi {array} - The json interface for the contract to instantiate
   * @param [options.address] {string} - The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
   * @param [options.bytecode] {string} - The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
   * @return {object}
   *
   * @example
   * > const contract = cfx.Contract({ abi, bytecode });

   * > contract.constructor.bytecode; // input code
   "0x6080604052600080..."

   * @example
   * > const contract = cfx.Contract({ abi, address });
   * > contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"

   * > await contract.count(); // call a method without parameter, get decoded return value.
   100n
   * > await contract.inc(1); // call a method with parameters, get decoded return value.
   101n
   * > await contract.count().call({ from: account }); // call a method from a account.
   100n
   * > await contract.count().estimateGas();
   21655n
   * > await contract.count().estimateGas({ from: ADDRESS, nonce: 68 }); // if from is a address string, nonce is required
   21655n

   * // send transaction from account instance, then wait till confirmed, and get receipt.
   * > await contract.inc(1)
   .sendTransaction({ from: account1 })
   .confirmed({ threshold: 0.01, timeout: 30 * 1000 });
   {
     "blockHash": "0xba948c8925f6d7f14faf540c3b9e6d24d33c78168b2dd81a6021a50949d9f0d7",
     "index": 0,
     "transactionHash": "0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42",
     "outcomeStatus": 0,
     ...
   }

   * > tx = await cfx.getTransactionByHash('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
   * > await contract.abi.decodeData(tx.data)
   {
      name: 'inc',
      fullName: 'inc(uint256 num)',
      type: 'inc(uint256)',
      signature: '0x7f98a45e',
      array: [ JSBI.BigInt(101) ],
      object: { num: JSBI.BigInt(101) }
   }

   * > await contract.count(); // data in block chain changed by transaction.
   JSBI.BigInt(101)

   * > logs = await contract.SelfEvent(account1.address).getLogs()
   [
   {
      address: '0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8',
      blockHash: '0xc8cb678891d4914aa66670e3ebd7a977bb3e38d2cdb1e2df4c0556cb2c4715a4',
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      epochNumber: 545896,
      logIndex: 0,
      removed: false,
      topics: [
        '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
        '0x000000000000000000000000bbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'
      ],
      transactionHash: '0x9100f4f84f711aa358e140197e9d2e5aab1f99751bc26a660d324a8282fc54d0',
      transactionIndex: 0,
      transactionLogIndex: 0,
      type: 'mined',
      params: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', '10' ]
     }
   ]

   * > contract.abi.decodeLog(logs[0]);
   {
      name: 'SelfEvent',
      fullName: 'SelfEvent(address indexed sender, uint256 current)',
      type: 'SelfEvent(address,uint256))',
      signature: '0xc4c01f6de493c58245fb681341f3a76bba9551ce81b11cbbb5d6d297844594df',
      array: [ '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b', JSBI.BigInt(100) ],
      object: {
        sender: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        current: JSBI.BigInt(100),
      },
    }
   */
  constructor(cfx, { abi, address, bytecode }) {
    const abiTable = lodash.groupBy(abi, 'type');

    this.constructor = new ContractConstructor(cfx, this, lodash.first(abiTable.constructor), bytecode);
    this.abi = new ContractABICoder(this); // XXX: Create a method named `abi` in solidity is a `Warning`.
    this.address = address; // XXX: Create a method named `address` in solidity is a `ParserError`

    const methodArray = lodash.map(abiTable.function, fragment => new ContractMethod(cfx, this, fragment));
    const eventArray = lodash.map(abiTable.event, fragment => new ContractEvent(cfx, this, fragment));

    // name to instance
    lodash.forEach(lodash.groupBy(methodArray, 'name'), (array, name) => {
      this[name] = array.length === 1
        ? lodash.first(array) // no override
        : new ContractMethod.ContractMethodOverride(cfx, this, array);
    });
    lodash.forEach(lodash.groupBy(eventArray, 'name'), (array, name) => {
      this[name] = array.length === 1
        ? lodash.first(array) // no override
        : new ContractEvent.ContractEventOverride(cfx, this, array);
    });

    // type to instance
    // signature for contract abi decoder to decode
    methodArray.forEach(method => {
      this[method.type] = method;
      this[method.signature] = method; // signature for contract abi decoder to decode
    });
    eventArray.forEach(event => {
      this[event.type] = event;
      this[event.signature] = event; // signature for contract abi decoder to decode
    });
  }
}

module.exports = Contract;
