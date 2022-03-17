import { isString } from 'lodash-es';
import { assert } from '../../util/index.js';
import BytesCoder from './BytesCoder.js';

export default class StringCoder extends BytesCoder {
  static from({ type, ...options }) {
    if (type !== 'string') {
      return undefined;
    }
    return new this({ ...options, type });
  }

  constructor({ type, name }) {
    super({ name, size: undefined });
    this.type = type;
  }

  /**
   * @param value {string} - string in utf8
   * @return {Buffer}
   */
  encode(value) {
    assert(isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encode(Buffer.from(value));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    const bytes = super.decode(stream);
    return bytes.toString();
  }

  encodeTopic(value) {
    assert(isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encodeTopic(Buffer.from(value));
  }
}
