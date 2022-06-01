const lodash = require('lodash');
const { WORD_BYTES } = require('../CONST');

function assert(bool, value) {
  if (!bool) {
    if (lodash.isPlainObject(value)) {
      value = JSON.stringify(value);
    }
    throw new Error(value);
  }
}

/**
 * @param {Buffer} buffer
 * @param {boolean} alignLeft
 * @return {Buffer}
 */
function alignBuffer(buffer, alignLeft = false) {
  const count = WORD_BYTES - (buffer.length % WORD_BYTES);
  if (0 < count && count < WORD_BYTES) {
    buffer = alignLeft
      ? Buffer.concat([buffer, Buffer.alloc(count)])
      : Buffer.concat([Buffer.alloc(count), buffer]);
  }

  return buffer;
}

function awaitTimeout(promise, timeout) {
  return new Promise((resolve, reject) => {
    const error = new Error(`Timeout after ${timeout} ms`);
    const timer = setTimeout(() => reject(error), timeout);
    promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function decodeHexEncodedStr(hexEncodedStr) {
  return Buffer.from(hexEncodedStr.slice(2), 'hex').toString();
}

function isHexString(v) {
  return lodash.isString(v) && v.match(/^0x[0-9A-Fa-f]*$/);
}

function isBytes(value) {
  if (value == null) { return false; }
  if (value.constructor === Uint8Array) { return true; }
  if (typeof value === 'string') { return false; }
  if (value.length == null) { return false; }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (typeof v !== 'number' || v < 0 || v >= 256 || (v % 1)) {
      return false;
    }
  }
  return true;
}

function validAddressPrefix(addressBuf) {
  // eslint-disable-next-line no-bitwise
  const prefix = addressBuf[0] & 0xf0;
  return prefix === 0x10 || prefix === 0x80 || prefix === 0x00;
}

module.exports = {
  assert,
  alignBuffer,
  awaitTimeout,
  decodeHexEncodedStr,
  isHexString,
  isBytes,
  validAddressPrefix,
  sleep,
};
