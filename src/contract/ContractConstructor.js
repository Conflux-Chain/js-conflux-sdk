import ContractMethod from './ContractMethod';
import { FunctionCoder } from '../abi';

export default class ContractConstructor extends ContractMethod {
  constructor(cfx, contract, fragment, bytecode) {
    super(cfx, contract, 'constructor');
    this.bytecode = bytecode;

    this.coder = new FunctionCoder(fragment);
    this.coder.decodeOutputs = hex => hex; // FIXME: unknown constructor call return hex mean, just return it
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
    return this.coder.decodeInputs(data);
  }
}
