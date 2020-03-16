/* eslint-disable no-bitwise */

import JSBI from 'jsbi';
import lodash from 'lodash';
import format from '../util/format';
import { assert } from '../util';
import { sha3 } from '../util/sign';
import namedTuple from '../lib/namedTuple';
import HexStream from './HexStream';

const WORD_BYTES = 32; // byte number pre abi word
const ZERO_BUFFER = format.buffer('0x0000000000000000000000000000000000000000000000000000000000000000');
const MAX_UINT = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(WORD_BYTES * 8));

export function padBuffer(buffer, alignLeft = false) {
  buffer = format.buffer(buffer); // accept hex

  const count = WORD_BYTES - (buffer.length % WORD_BYTES);
  if (0 < count && count < WORD_BYTES) {
    buffer = alignLeft
      ? Buffer.concat([buffer, ZERO_BUFFER.slice(0, count)])
      : Buffer.concat([ZERO_BUFFER.slice(0, count), buffer]);
  }

  return buffer;
}

// ----------------------------------------------------------------------------
class Pointer extends Number {}

/**
 * @param coders {Coder[]}
 * @param array {array}
 * @return {Buffer}
 */
function _pack(coders, array) {
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
      staticList[index] = UINT_CODER.encode(offset);
      offset += dynamicList[pointer].length;
    }
  });

  return Buffer.concat([...staticList, ...dynamicList]);
}

/**
 *
 * @param coders {Coder[]}
 * @param stream {HexStream}
 * @return {array}
 */
function _unpack(coders, stream) {
  const startIndex = stream.index;

  const array = coders.map(coder => {
    if (coder.dynamic) {
      const offset = Number(UINT_CODER.decode(stream));
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

// ============================================================================
class Coder {
  static from(component) {} // eslint-disable-line no-unused-vars

  constructor({ type, name }) {
    this.type = type;
    this.name = name;
    this.dynamic = false;
  }

  /**
   * @return {Buffer}
   */
  encode(value) {} // eslint-disable-line no-unused-vars

  /**
   * @param stream {HexStream}
   * @return {*}
   */
  decode(stream) {} // eslint-disable-line no-unused-vars

  encodeIndex(value) {
    return this.encode(value);
  }

  decodeIndex(hex) {
    return this.decode(HexStream(hex));
  }
}

class NullCoder extends Coder {
  static from({ type, name }) {
    if (type !== '') {
      return undefined;
    }
    return new this({ name, type: 'null' });
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

class BoolCoder extends Coder {
  static from({ type, name }) {
    if (type !== 'bool') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param value {*}
   * @return {Buffer}
   */
  encode(value) {
    return padBuffer(format.hex(Boolean(value)));
  }

  /**
   * @param stream {HexStream}
   * @return {boolean}
   */
  decode(stream) {
    return JSBI.notEqual(UINT_CODER.decode(stream), JSBI.BigInt(0));
  }
}

class AddressCoder extends Coder {
  static from({ type, name }) {
    if (type !== 'address') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param address {string}
   * @return {Buffer}
   */
  encode(address) {
    return padBuffer(format.address(address));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    return format.address(`0x${stream.read(40)}`);
  }
}

class IntegerCoder extends Coder {
  static from({ type, name }) {
    const match = type.match(/^(int|uint)([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, label, bits] = match;
    return new this({
      name,
      type: label,
      signed: !label.startsWith('u'),
      bits: bits ? parseInt(bits, 10) : undefined,
    });
  }

  constructor({ name, type, signed = false, bits = 256 } = {}) {
    assert(Number.isInteger(bits) && 0 < bits && bits <= 256 && (bits % 8 === 0), {
      message: 'invalid bits',
      expect: 'integer && 0<bits<=256 && bits%8==0',
      got: bits,
      coder: { name, type, signed },
    });

    super({ name });
    this.type = `${type}${bits}`;
    this.signed = signed;
    this.size = bits / 8;
    this.bound = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(bits - (this.signed ? 1 : 0)));
  }

  /**
   * @param value {number|JSBI|string}
   * @return {Buffer}
   */
  encode(value) {
    let number = JSBI.BigInt(value);
    let twosComplement = number;

    if (this.signed && JSBI.LT(number, JSBI.BigInt(0))) {
      twosComplement = JSBI.add(number, this.bound);
      number = JSBI.add(number, MAX_UINT);
    }

    assert(JSBI.LE(JSBI.BigInt(0), twosComplement) && JSBI.LT(twosComplement, this.bound), {
      message: 'bound error',
      expect: `0<= && <${this.bound}`,
      got: twosComplement.toString(),
      coder: this,
      value,
    });

    return padBuffer(format.hex(number));
  }

  /**
   * @param stream {HexStream}
   * @return {JSBI}
   */
  decode(stream) {
    let value = JSBI.BigInt(`0x${stream.read(this.size * 2)}`); // 16: read out naked hex string

    if (this.signed && JSBI.GE(value, this.bound)) {
      const mask = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(this.size * 8));
      value = JSBI.subtract(value, mask);
    }

    return value;
  }
}

class BytesCoder extends Coder {
  static from({ type, name }) {
    const match = type.match(/^bytes([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, size] = match;
    return new this({
      name,
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && size <= WORD_BYTES, {
        message: 'invalid size',
        expect: `integer && <=${WORD_BYTES}`,
        got: size,
        coder: { name },
      });
    }

    super({ name });
    this.type = `bytes${size > 0 ? size : ''}`;
    this.size = size;
    this.dynamic = Boolean(size === undefined);
  }

  /**
   * @param value {ArrayLike}
   * @return {Buffer}
   */
  encode(value) {
    assert(Buffer.isBuffer(value), {
      message: 'value type error',
      expect: Buffer.name,
      got: value.constructor.name,
      coder: this,
    });

    if (this.size !== undefined) {
      assert(value.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: value.length,
        coder: this,
      });
    }

    let buffer = padBuffer(value, true);
    if (this.size === undefined) {
      buffer = Buffer.concat([UINT_CODER.encode(value.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {Buffer}
   */
  decode(stream) {
    let length = this.size;
    if (length === undefined) {
      length = Number(UINT_CODER.decode(stream));
    }

    return Buffer.from(stream.read(length * 2, true), 'hex');
  }

  encodeIndex(value) {
    assert(Buffer.isBuffer(value), {
      message: 'value type error',
      expect: Buffer.name,
      got: value.constructor.name,
      coder: this,
    });

    return sha3(value);
  }

  decodeIndex(hex) {
    return hex;
  }
}

class StringCoder extends BytesCoder {
  static from({ type, name }) {
    if (type !== 'string') {
      return undefined;
    }
    return new this({ type, name });
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
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encode(Buffer.from(value, 'utf8'));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    const bytes = super.decode(stream);
    return bytes.toString('utf8');
  }

  encodeIndex(value) {
    assert(lodash.isString(value), {
      message: 'value type error',
      expect: 'string',
      got: value.constructor.name,
      coder: this,
    });

    return super.encodeIndex(Buffer.from(value, 'utf8'));
  }
}

class ArrayCoder extends Coder {
  static from({ type, name, components }) {
    const match = type.match(/^(.*)\[([0-9]*)]$/);
    if (!match) {
      return undefined;
    }

    const [, subType, size] = match;
    return new this({
      name,
      coder: getCoder({ type: subType, components }),
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, coder, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && 0 < size, {
        message: 'invalid size',
        expect: 'integer && >0',
        got: size,
        coder: { name },
      });
    }

    super({ name });
    this.type = `${coder.type}[${size > 0 ? size : ''}]`;
    this.size = size;
    this.coder = coder;
    this.dynamic = Boolean(size === undefined) || coder.dynamic;
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    assert(Array.isArray(array), {
      message: 'unexpected type',
      expect: 'array',
      got: typeof array,
      coder: this,
    });

    if (this.size !== undefined) {
      assert(array.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: array.length,
        coder: this,
      });
    }

    const coders = lodash.range(array.length).map(() => this.coder);
    let buffer = _pack(coders, array);
    if (this.size === undefined) {
      buffer = Buffer.concat([UINT_CODER.encode(array.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {array}
   */
  decode(stream) {
    let length = this.size;

    if (length === undefined) {
      length = Number(UINT_CODER.decode(stream));
    }

    const coders = lodash.range(length).map(() => this.coder);
    return _unpack(coders, stream);
  }

  encodeIndex(value) {
    try {
      return format.hex64(value);
    } catch (e) {
      throw new Error('not supported encode array to index');
    }
  }

  decodeIndex(hex) {
    return hex;
  }
}

class TupleCoder extends Coder {
  static from({ type, name, components }) {
    if (type !== 'tuple') {
      return undefined;
    }
    return new this({ name, coders: components.map(getCoder) });
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

    return _pack(this.coders, array);
  }

  /**
   * @param stream {HexStream}
   * @return {NamedTuple}
   */
  decode(stream) {
    const array = _unpack(this.coders, stream);
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

// ----------------------------------------------------------------------------
const UINT_CODER = new IntegerCoder();

/**
 * Get coder by abi component.
 *
 * @param component {object}
 * @param component.type {string}
 * @param [component.name] {string}
 * @param [component.components] {array} - For TupleCoder
 * @return {Coder}
 */
export function getCoder(component) {
  // must parse ArrayCoder first, others sorted by probability
  const coder = ArrayCoder.from(component)
    || TupleCoder.from(component)
    || AddressCoder.from(component)
    || IntegerCoder.from(component)
    || StringCoder.from(component)
    || BytesCoder.from(component)
    || BoolCoder.from(component)
    || NullCoder.from(component);

  assert(coder instanceof Coder, {
    message: 'can not found matched coder',
    component,
  });

  return coder;
}
