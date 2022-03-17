import { zip, some, isPlainObject } from 'lodash-es';
import { WORD_BYTES } from '../../CONST.js';
import { assert } from '../../util/index.js';
import format from '../../util/format.js';
import namedTuple from '../../util/namedTuple.js';
import BaseCoder from './BaseCoder.js';
import { uIntCoder } from './IntegerCoder.js';

class Pointer extends Number {}

/**
 * @param coders {BaseCoder[]}
 * @param array {array}
 * @return {Buffer}
 */
export function pack(coders, array) {
  let offset = 0;
  const staticList = [];
  const dynamicList = [];

  zip(coders, array)
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
 * @param coders {BaseCoder[]}
 * @param stream {HexStream}
 * @return {array}
 */
export function unpack(coders, stream) {
  const startIndex = stream.index;

  const array = coders.map(coder => {
    if (coder.dynamic) {
      const offset = format.uInt(uIntCoder.decode(stream)); // XXX: BigInt => Number, for length is enough.
      return new Pointer(startIndex + offset * 2);
    } else {
      return coder.decode(stream);
    }
  });

  zip(coders, array)
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

export default class TupleCoder extends BaseCoder {
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
    this.dynamic = some(coders, coder => coder.dynamic);
    this.names = coders.map((coder, index) => coder.name || `${index}`);
    this.NamedTuple = namedTuple(...this.names);
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    if (isPlainObject(array)) {
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
