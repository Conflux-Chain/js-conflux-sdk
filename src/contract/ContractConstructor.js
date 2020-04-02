import ContractMethod from './ContractMethod';
import { ConstructorCoder } from '../abi';

export default class ContractConstructor extends ContractMethod {
  constructor(cfx, contract) {
    super(cfx, contract, 'constructor');
    this.bytecode = undefined;

    this.coder = new ConstructorCoder();
  }

  async add(fragment) {
    // constructor can not be override
    this.coder = new ConstructorCoder(fragment);
  }

  call(...args) {
    if (!this.bytecode) {
      throw new Error('contract.constructor.bytecode is empty');
    }

    const to = this.contract.address;
    const data = `${this.bytecode}${this.coder.encodeInputs(args).substring(2)}`;
    return new ContractMethod.Called(this.cfx, this.coder, { to, data });
  }

  decodeData(hex) {
    const data = hex.slice(this.bytecode.length);

    const namedTuple = this.coder.decodeInputs(data);
    return {
      name: this.name,
      fullName: this.coder.fullName,
      type: this.coder.type,
      signature: null,
      array: [...namedTuple],
      object: namedTuple.toObject(),
    };
  }
}
