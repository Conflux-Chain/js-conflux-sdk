const { Rlp, Hex } = require('ox');
const format = require('./format');

/**
 * @param {Array|Buffer} value
 * @return {Buffer}
 */
function encode(value) {
  const hexValue = bufferToHex(value);
  const res = Rlp.fromHex(hexValue, { as: 'Bytes' });
  return Buffer.from(res);
}

/**
 * @param {hex} rlp
 * @return {Buffer|Array}
 */
function decode(rlp) {
  const values = Rlp.toBytes(rlp);
  return rlpUint8ArrayToBuffer(values);
}

function rlpUint8ArrayToBuffer(uint8Array) {
  if (!Array.isArray(uint8Array)) {
    return Buffer.from(uint8Array);
  }

  return uint8Array.map(value => rlpUint8ArrayToBuffer(value));
}

function bufferToHex(buffer) {
  if (Buffer.isBuffer(buffer)) {
    return Hex.from(format.hex(buffer));
  }

  if (Array.isArray(buffer)) {
    return buffer.map(bufferToHex);
  }

  throw new Error(`invalid value, expect buffer or array, got ${buffer}`);
}

module.exports = { encode, decode };
