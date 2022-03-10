import { WORD_BYTES } from '../CONST.js';
import { isPlainObject, isString } from 'lodash-es';
import { readFileSync } from 'fs';

export function assert(bool, value) {
  if (!bool) {
    if (isPlainObject(value)) {
      value = JSON.stringify(value);
    }
    throw new Error(value);
  }
}

/**
 * @param buffer {Buffer}
 * @param alignLeft {boolean}
 * @return {Buffer}
 */
export function alignBuffer(buffer, alignLeft = false) {
  const count = WORD_BYTES - (buffer.length % WORD_BYTES);
  if (0 < count && count < WORD_BYTES) {
    buffer = alignLeft
      ? Buffer.concat([buffer, Buffer.alloc(count)])
      : Buffer.concat([Buffer.alloc(count), buffer]);
  }

  return buffer;
}

export function awaitTimeout(promise, timeout) {
  return new Promise((resolve, reject) => {
    const error = new Error(`Timeout after ${timeout} ms`);
    const timer = setTimeout(() => reject(error), timeout);
    promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
  });
}

export function decodeHexEncodedStr(hexEncodedStr) {
  return Buffer.from(hexEncodedStr.slice(2), 'hex').toString();
}

export function isHexString(v) {
  return isString(v) && v.match(/^0x[0-9A-Fa-f]*$/);
}

export function isBytes(value) {
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

export function validAddressPrefix(addressBuf) {
  // eslint-disable-next-line no-bitwise
  const prefix = addressBuf[0] & 0xf0;
  return prefix === 0x10 || prefix === 0x80 || prefix === 0x00;
}

export function readJSON(jsonFilePath) {
  const json = JSON.parse(readFileSync(jsonFilePath), 'utf8');
  return json
}

export default {
  validAddressPrefix,
  isBytes,
  isHexString,
  decodeHexEncodedStr,
  awaitTimeout,
  alignBuffer,
  assert,
  readJSON,
};
