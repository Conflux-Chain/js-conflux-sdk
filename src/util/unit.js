const UNIT_MATRIX = {
  cfx: { cfx: 1, gdrip: 1e9, drip: 1e18 },
  gdrip: { cfx: 1e-9, gdrip: 1, drip: 1e9 },
  drip: { cfx: 1e-18, gdrip: 1e-9, drip: 1 },
};

/**
 * Unit converter factory
 *
 * @param from {string} - Enum in ['cfx', 'gdrip', 'drip']
 * @param to {string} - Enum in ['cfx', 'gdrip', 'drip']
 * @return {function}
 *
 * @example
 * > unit('cfx', 'drip')(1)
 1000000000000000000n

 * > unit('drip', 'cfx')(1000000000000000000)
 1n
 */
function unit(from, to) {
  const keys = Object.keys(UNIT_MATRIX);
  if (!keys.includes(from)) {
    throw new Error(`"from" must in ${JSON.stringify(keys)}, got "${from}"`);
  }
  if (!keys.includes(to)) {
    throw new Error(`"to" must in ${JSON.stringify(keys)}, got "${to}"`);
  }

  const multiple = UNIT_MATRIX[from][to];
  const reciprocal = UNIT_MATRIX[to][from];

  return function (value) {
    return multiple > 1
      ? BigInt(value) * BigInt(multiple)
      : BigInt(value) / BigInt(reciprocal);
  };
}

// ----------------------------------------------------------------------------
/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromCFXToGDrip(123)
 123000000000n
 */
unit.fromCFXToGDrip = unit('cfx', 'gdrip');

/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromCFXToDrip(123)
 123000000000000000000n
 */
unit.fromCFXToDrip = unit('cfx', 'drip');

/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromGDripToCFX(123456789012)
 123n
 */
unit.fromGDripToCFX = unit('gdrip', 'cfx');

/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromGDripToDrip(123)
 123000000000n
 */
unit.fromGDripToDrip = unit('gdrip', 'drip');

/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromDripToCFX(123456789012345678901)
 123n
 */
unit.fromDripToCFX = unit('drip', 'cfx');

/**
 * @param {number|BigInt|string}
 * @return {BigInt}
 *
 * @example
 * > fromDripToGDrip(123456789012)
 123
 */
unit.fromDripToGDrip = unit('drip', 'gdrip');

module.exports = unit;
