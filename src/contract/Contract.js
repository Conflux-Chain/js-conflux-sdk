import ContractABICoder from './ContractABICoder';
import ContractConstructor from './ContractConstructor';
import ContractFunction from './ContractFunction';
import ContractEvent from './ContractEvent';
import ContractOverride from './ContractOverride';

/**
 * Contract with all its methods and events defined in its abi.
 */
export default class Contract {
  /**
   *
   * @param cfx {Conflux} - Conflux instance.
   * @param options {object}
   * @param options.abi {array} - The json interface for the contract to instantiate
   * @param [options.address] {string} - The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
   * @param [options.code] {string} - The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
   * @return {object}
   *
   * @example
   * > const contract = cfx.Contract({ abi, code });
   * > contract instanceof Contract;
   true

   * > contract.abi; // input abi
   [{type:'constructor', inputs:[...]}, ...]

   * > contract.constructor.code; // input code
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
     params: NamedTuple(num) [ 100n ]
   }

   * > await contract.count(); // data in block chain changed by transaction.
   101n

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
      name: "SelfEvent",
      params: NamedTuple(sender,current) [
        '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        100n
      ]
    }
   */
  constructor(cfx, { abi, address, code }) {
    let constructorFragment = { type: 'constructor', inputs: [] };

    abi.forEach(fragment => {
      if (fragment.type === 'constructor') {
        constructorFragment = fragment;
      } else if (fragment.type === 'function') {
        const func = new ContractFunction(cfx, this, fragment);

        if (this[fragment.name] instanceof ContractOverride) {
          this[fragment.name].push(func);
        } else if (this[fragment.name] instanceof ContractFunction) {
          this[fragment.name] = new ContractOverride(this[fragment.name], func);
        } else {
          this[fragment.name] = func;
        }
      } else if (fragment.type === 'event') {
        const event = new ContractEvent(cfx, this, fragment);

        if (this[fragment.name] instanceof ContractOverride) {
          this[fragment.name].push(event);
        } else if (this[fragment.name] instanceof ContractEvent) {
          this[fragment.name] = new ContractOverride(this[fragment.name], event);
        } else {
          this[fragment.name] = event;
        }
      } else {
        // see https://solidity.readthedocs.io/en/v0.5.13/contracts.html#fallback-function
      }
    });

    // cover this.constructor
    this.constructor = new ContractConstructor(cfx, this, constructorFragment); // XXX: set before `this.abi=`
    this.constructor.code = code;

    this.abi = new ContractABICoder(this); // XXX: Create a method named `abi` in solidity is a `Warning`.
    this.address = address; // XXX: Create a method named `address` in solidity is a `ParserError`
  }
}
