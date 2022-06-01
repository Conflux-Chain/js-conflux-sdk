const { decode } = require('rlp');
/*
  prefix    | delta | note          | code
  ----------|-------|---------------|--------------------------------------------------------------
  0x00~0x7f |   127 | single buffer | <buffer[0]>
  0x80~0xb7 |    55 | short buffer  | <0x80+length(buffer)>, ...<buffer>
  0xb8~0xbf |     7 | long buffer   | <0xb8+length(length(buffer))>, ...<length(buffer)>, ...<buffer>
  0xc0~0xf7 |    55 | short array   | <0xc0+length(array.bytes)>, ...<array.bytes>
  0xf8~0xff |     7 | long array    | <0xf8+length(length(array.bytes))>, ...<length(array.bytes)>, ...<array.bytes>
 */

const SHORT_RANGE = 55;
const BUFFER_OFFSET = 0x80;
const ARRAY_OFFSET = 0xc0;

function concat(...args) {
  return Buffer.concat(args.map(value => {
    if (Buffer.isBuffer(value)) {
      return value;
    }

    if (Number.isSafeInteger(value) && value >= 0) {
      const hex = value.toString(16);
      return Buffer.from(hex.length % 2 ? `0${hex}` : hex, 'hex');
    }

    throw new Error(`invalid value, expect unsigned integer or buffer, got ${value}`);
  }));
}

// ----------------------------------------------------------------------------
/**
 * @param {Array|Buffer} value
 * @return {Buffer}
 */
function encode(value) {
  if (Buffer.isBuffer(value)) {
    return encodeBuffer(value);
  }

  if (Array.isArray(value)) {
    return encodeArray(value);
  }

  throw new Error(`invalid value, expect buffer or array, got ${value}`);
}

/**
 * @param {number} length
 * @param {number} offset - Enum of [BUFFER_OFFSET=0x80, ARRAY_OFFSET=0xc0]
 * @return {Buffer}
 */
function encodeLength(length, offset) {
  if (length <= SHORT_RANGE) {
    return concat(length + offset);
  } else {
    const lengthBuffer = concat(length);
    return concat(offset + SHORT_RANGE + lengthBuffer.length, lengthBuffer);
  }
}

/**
 * @param {Buffer} buffer
 * @return {Buffer}
 */
function encodeBuffer(buffer) {
  if (buffer.length === 1 && buffer[0] === 0) {
    buffer = Buffer.from('');
  }

  return buffer.length === 1 && buffer[0] < BUFFER_OFFSET
    ? buffer
    : concat(encodeLength(buffer.length, BUFFER_OFFSET), buffer);
}

/**
 * @param {Array} array
 * @return {Buffer}
 */
function encodeArray(array) {
  const buffer = concat(...array.map(encode));
  return concat(encodeLength(buffer.length, ARRAY_OFFSET), buffer);
}

// TODO decode

module.exports = { encode, decode };
