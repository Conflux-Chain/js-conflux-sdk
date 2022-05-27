const lodash = require('lodash');
const { WORD_BYTES } = require('../../CONST');
const { assert } = require('../../util');
const format = require('../../util/format');
const namedTuple = require('../../util/namedTuple');
const BaseCoder = require('./BaseCoder');
const { uIntCoder } = require('./IntegerCoder');

class Pointer extends Number {}

/**
 * @param {BaseCoder[]} coders
 * @param {array} array
 * @return {Buffer}
 */
function pack(coders, array) {
  let offset = 0;
  const staticList = [];
  const dynamicList = [];

  lodash.zip(coders, array)
    .forEach(([coder, value]) => {
      const buffer = coder.encode(value);

      if (coder.dynamic) {
        offset += WORD_BYTES;
        staticList.push(new Pointer(dynamicList.length)); // push index of dynamic to static
        dynamicList.push(buffer);
      } else {
        offset += buffer.length;
        staticList.push(buffer);
      }
    });

  // write back the dynamic address
  staticList.forEach((pointer, index) => {
    if (pointer instanceof Pointer) {
      staticList[index] = uIntCoder.encode(offset);
      offset += dynamicList[pointer].length;
    }
  });

  return Buffer.concat([...staticList, ...dynamicList]);
}

/**
 *
 * @param {BaseCoder[]} coders
 * @param {import('../../util/HexStream')} stream
 * @return {array}
 */
function unpack(coders, stream) {
  const startIndex = stream.index;

  const array = coders.map(coder => {
    if (coder.dynamic) {
      const offset = format.uInt(uIntCoder.decode(stream)); // XXX: BigInt => Number, for length is enough.
      return new Pointer(startIndex + offset * 2);
    } else {
      return coder.decode(stream);
    }
  });

  lodash.zip(coders, array)
    .forEach(([coder, value], index) => {
      if (value instanceof Pointer) {
        assert(Number(value) === stream.index, {
          message: 'stream.index error',
          expect: value,
          got: stream.index,
          coder,
          stream,
        });

        array[index] = coder.decode(stream);
      }
    });

  return array;
}

class TupleCoder extends BaseCoder {
  static from({ type, components, ...options }, valueCoder) {
    if (type !== 'tuple') {
      return undefined;
    }
    return new this({ ...options, coders: components.map(valueCoder) });
  }

  constructor({ name, coders }) {
    super({ name });
    this.type = `(${coders.map(coder => coder.type).join(',')})`;
    this.size = coders.length;
    this.coders = coders;
    this.dynamic = lodash.some(coders, coder => coder.dynamic);
    this.names = coders.map((coder, index) => coder.name || `${index}`);
    /** @type {object} */
    this.NamedTuple = namedTuple(...this.names);
  }

  /**
   * @param {array} array
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
   * @param {import('../../util/HexStream')} stream
   * @return {NamedTuple}
   */
  decode(stream) {
    const array = unpack(this.coders, stream);
    return new this.NamedTuple(...array);
  }

  encodeTopic(value) {
    try {
      return format.hex64(value);
    } catch (e) {
      // TODO https://solidity.readthedocs.io/en/v0.7.4/abi-spec.html#encoding-of-indexed-event-parameters
      throw new Error('not supported encode tuple to index');
    }
  }

  decodeTopic(hex) {
    return hex;
  }
}

module.exports = TupleCoder;
module.exports.pack = pack;
module.exports.unpack = unpack;
