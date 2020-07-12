const lodash = require('lodash');
const sign = require('./sign');
const unit = require('./unit');
const format = require('./format');

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

function decorate(instance, name, func) {
  const method = instance[name];
  instance[name] = (...params) => func(method.bind(instance), params);
}

function uuidV4() {
  return [
    sign.randomBuffer(4),
    sign.randomBuffer(2),
    sign.randomBuffer(2),
    sign.randomBuffer(2),
    sign.randomBuffer(6),
  ].map(buffer => buffer.toString('hex')).join('-');
}

module.exports = { sign, unit, format, assert, sleep, loop, decorate, uuidV4 };
