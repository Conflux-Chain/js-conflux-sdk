const lodash = require('lodash');
const { assert, format } = require('../util');
const namedTuple = require('../util/namedTuple');
const BaseCoder = require('./BaseCoder');
const { pack, unpack } = require('./util');

class TupleCoder extends BaseCoder {
  static from({ type, name, components }, abiCoder) {
    if (type !== 'tuple') {
      return undefined;
    }
    return new this({ name, coders: components.map(abiCoder) });
  }

  constructor({ name, coders }) {
    super({ name });
    this.type = `(${coders.map(coder => coder.type).join(',')})`;
    this.size = coders.length;
    this.coders = coders;
    this.dynamic = lodash.some(coders, coder => coder.dynamic);
    this.names = coders.map((coder, index) => coder.name || `${index}`);
    this.NamedTuple = namedTuple(...this.names);
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    if (lodash.isPlainObject(array)) {
      array = this.NamedTuple.fromObject(array);
    }

    assert(Array.isArray(array), {
      message: 'unexpected type',
      expect: 'array',
      got: typeof array,
      coder: this,
    });

    assert(array.length === this.size, {
      message: 'length not match',
      expect: this.size,
      got: array.length,
      coder: this,
    });

    return pack(this.coders, array);
  }

  /**
   * @param stream {HexStream}
   * @return {NamedTuple}
   */
  decode(stream) {
    const array = unpack(this.coders, stream);
    return new this.NamedTuple(...array);
  }

  encodeIndex(value) {
    try {
      return format.hex64(value);
    } catch (e) {
      throw new Error('not supported encode tuple to index');
    }
  }

  decodeIndex(hex) {
    return hex;
  }
}

module.exports = TupleCoder;
