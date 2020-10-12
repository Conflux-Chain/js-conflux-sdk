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
 * Await sleep.
 *
 * @memberOf utils
 * @param ms {number} - Sleep duration in ms.
 * @return {Promise<undefined>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loop execute `func` if it return `undefined`
 *
 * @memberOf utils
 * @param [options] {object}
 * @param [options.delta=1000] {number} - Loop transaction interval in ms.
 * @param [options.timeout=30*1000] {number} - Loop timeout in ms.
 * @param func {function} - Function to execute.
 * @return {Promise<*>}
 */
async function loop({ delta = 1000, timeout = 30 * 1000 }, func) {
  const startTime = Date.now();

  for (let lastTime = startTime; Date.now() - startTime < timeout; lastTime = Date.now()) {
    const ret = await func();
    if (ret !== undefined) {
      return ret;
    }

    await sleep(lastTime + delta - Date.now());
  }

  throw new Error(`Timeout after ${Date.now() - startTime} ms`);
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
  sleep,
  loop,
  alignBuffer,
  awaitTimeout,
};
