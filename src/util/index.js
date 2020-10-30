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
 * @param buffer {Buffer}
 * @param alignLeft {boolean}
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

module.exports = {
  assert,
  alignBuffer,
  awaitTimeout,
};
