const lodash = require('lodash');
const ContractABICoder = require('./ContractABICoder');
const ContractConstructor = require('./ContractConstructor');
const ContractMethod = require('./ContractMethod');
const ContractEvent = require('./ContractEvent');
const ContractMethodOverride = require('./ContractMethodOverride');
const ContractEventOverride = require('./ContractEventOverride');

/**
 * Contract with all its methods and events defined in its abi.
 */
class Contract {
  /**
   * @param options {object}
   * @param options.abi {array} - The json interface for the contract to instantiate
   * @param [options.address] {string} - The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
   * @param [options.bytecode] {string} - The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
   * @param conflux {Conflux} - Conflux instance.
   * @return {object}
   *
   * @example
   * > const contract = conflux.Contract({ abi, bytecode });

   * > contract.constructor.bytecode; // input code
   "0x6080604052600080..."

   * @example
   * > const contract = conflux.Contract({ abi, address });
   * > contract.address
   "0xc3ed1a06471be1d3bcd014051fbe078387ec0ad8"

   * > await contract.count(); // call a method without parameter, get decoded return value.
   "100"
   * > await contract.inc(1); // call a method with parameters, get decoded return value.
   "101"
   * > await contract.count().options({ from: account }); // call a method from a account.
   "100"

   * > transaction = await conflux.getTransactionByHash('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
   * > await contract.abi.decodeData(transaction.data)
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

   * > receipt = await conflux.getTransactionReceipt('0x8a5f48c2de0f1bdacfe90443810ad650e4b327a0d19ce49a53faffb224883e42');
   * > contract.abi.decodeLog(receipt.logs[0]);
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
  constructor({ abi, address, bytecode }, conflux) {
    const abiTable = lodash.groupBy(abi, 'type');

    this.constructor = new ContractConstructor(lodash.first(abiTable.constructor), bytecode, this, conflux);
    this.abi = new ContractABICoder(this); // XXX: Create a method named `abi` in solidity is a `Warning`.
    this.address = address; // XXX: Create a method named `address` in solidity is a `ParserError`

    const methodArray = lodash.map(abiTable.function, fragment => new ContractMethod(fragment, this, conflux));
    const eventArray = lodash.map(abiTable.event, fragment => new ContractEvent(fragment, this, conflux));

    // name to instance
    lodash.forEach(lodash.groupBy(methodArray, 'name'), (array, name) => {
      this[name] = array.length === 1 ? lodash.first(array) : new ContractMethodOverride(array, this, conflux);
    });
    lodash.forEach(lodash.groupBy(eventArray, 'name'), (array, name) => {
      this[name] = array.length === 1 ? lodash.first(array) : new ContractEventOverride(array, this, conflux);
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
