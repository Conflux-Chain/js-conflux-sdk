import { assert } from '../../util/index.js';
import BaseCoder from './BaseCoder.js';

export default class NullCoder extends BaseCoder {
  static from({ type, ...options }) {
    if (type !== '') {
      return undefined;
    }
    return new this({ ...options, type: 'null' });
  }

  /**
   * @param value {null}
   * @return {Buffer}
   */
  encode(value) {
    assert(value === null, {
      message: 'unexpected type',
      expect: null,
      got: value,
      coder: this,
    });

    return Buffer.from('');
  }

  /**
   * @return {null}
   */
  decode() {
    return null;
  }
}
