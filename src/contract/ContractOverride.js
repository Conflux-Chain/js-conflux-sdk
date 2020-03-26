import callable from '../lib/callable';

export default class ContractOverride extends Array {
  constructor(...args) {
    super(...args);

    return callable(this, this.call.bind(this));
  }

  call(...args) {
    const typeArray = [];
    for (const instance of this) {
      try {
        return instance(...args);
      } catch (e) {
        typeArray.push(instance.coder.type);
      }
    }

    throw new Error(`can not match "${typeArray.join(',')}" with args (${args.join(',')})`);
  }
}
