import lodash from 'lodash';

export function assert(bool, value) {
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
export function sleep(ms) {
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
export async function loop({ delta = 1000, timeout = 30 * 1000 }, func) {
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

export function decorate(instance, name, func) {
  const method = instance[name];
  instance[name] = (...params) => func(method.bind(instance), params);
}
