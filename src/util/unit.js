const format = require('./format');

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
 "1000000000000000000" // BigNumber

 * > unit('drip', 'cfx')(1)
 "0.000000000000000001" // BigNumber
 */
function unit(from, to) {
  const keys = Object.keys(UNIT_MATRIX);
  if (!keys.includes(from)) {
    throw new Error(`"from" must in ${JSON.stringify(keys)}, got "${from}"`);
  }
  if (!keys.includes(to)) {
    throw new Error(`"to" must in ${JSON.stringify(keys)}, got "${to}"`);
  }
  return value => format.bigNumber(value).times(UNIT_MATRIX[from][to]);
}

// ----------------------------------------------------------------------------
/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromCFXToGDrip(3.14)
 "3140000000"
 */
unit.fromCFXToGDrip = unit('cfx', 'gdrip');

/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromCFXToDrip(3.14)
 "3140000000000000000"
 */
unit.fromCFXToDrip = unit('cfx', 'drip');

/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromGDripToCFX(3.14)
 "0.00000000314"
 */
unit.fromGDripToCFX = unit('gdrip', 'cfx');

/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromGDripToDrip(3.14)
 "3140000000"
 */
unit.fromGDripToDrip = unit('gdrip', 'drip');

/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromDripToCFX(3.14)
 "0.00000000000000000314"
 */
unit.fromDripToCFX = unit('drip', 'cfx');

/**
 * @param {number|BigNumber|string}
 * @return {BigNumber}
 *
 * @example
 * > fromDripToGDrip(3.14)
 "0.00000000314"
 */
unit.fromDripToGDrip = unit('drip', 'gdrip');

module.exports = unit;
