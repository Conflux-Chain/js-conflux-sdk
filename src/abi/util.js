const lodash = require('lodash');
const JSBI = require('jsbi');
const { assert, format } = require('../util');

const WORD_BYTES = 32; // byte number pre abi word
const UINT_BOUND = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(256));
const MAX_UINT = JSBI.subtract(UINT_BOUND, JSBI.BigInt(1));

class Pointer extends Number {}

/**
 * @param buffer {Buffer}
 * @param alignLeft {boolean}
 * @return {Buffer}
 */
function padBuffer(buffer, alignLeft = false) {
  buffer = format.buffer(buffer); // accept hex

  const count = WORD_BYTES - (buffer.length % WORD_BYTES);
  if (0 < count && count < WORD_BYTES) {
    buffer = alignLeft
      ? Buffer.concat([buffer, Buffer.alloc(count)])
      : Buffer.concat([Buffer.alloc(count), buffer]);
  }

  return buffer;
}

/**
 * @param value {number|string}
 * @return {Buffer}
 */
function encodeUInt256(value) {
  const number = format.bigUInt(value);

  assert(JSBI.LE(number, MAX_UINT), {
    message: 'bound error',
    expect: `<= ${MAX_UINT}`,
    got: number.toString(),
    coder: this,
    value,
  });

  return padBuffer(format.hex(number));
}

/**
 * @param stream {HexStream}
 * @return {JSBI}
 */
function decodeUInt256(stream) {
  return format.bigInt(`0x${stream.read(64)}`);
}

/**
 * @param coders {BaseCoder[]}
 * @param array {array}
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
      staticList[index] = encodeUInt256(offset);
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
function unpack(coders, stream) {
  const startIndex = stream.index;

  const array = coders.map(coder => {
    if (coder.dynamic) {
      const offset = Number(decodeUInt256(stream));
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

module.exports = {
  WORD_BYTES,
  MAX_UINT,
  UINT_BOUND,
  padBuffer,
  encodeUInt256,
  decodeUInt256,
  pack,
  unpack,
};
