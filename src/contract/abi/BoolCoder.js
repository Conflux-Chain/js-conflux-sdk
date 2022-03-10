import { isBoolean } from 'lodash-es';
import { assert } from '../../util/index.js';
import JSBI from '../../util/jsbi.js';
import IntegerCoder from './IntegerCoder.js';

export default class BoolCoder extends IntegerCoder {
  static from({ type, ...options }) {
    if (type !== 'bool') {
      return undefined;
    }
    return new this({ ...options, type });
  }

  constructor({ type, name }) {
    super({ name });
    this.type = type;
  }

  /**
   * @param value {*}
   * @return {Buffer}
   */
  encode(value) {
    assert(isBoolean(value), {
      message: 'unexpected type',
      expect: 'boolean',
      got: value,
      coder: this,
    });

    return super.encode(value ? 1 : 0);
  }

  /**
   * @param stream {HexStream}
   * @return {boolean}
   */
  decode(stream) {
    return JSBI.notEqual(super.decode(stream), JSBI.BigInt(0));
  }
}
