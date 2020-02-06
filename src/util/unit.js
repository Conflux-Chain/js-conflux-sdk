const JSBI = require('jsbi');

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
 JSBI.BigInt(1000000000000000000)

 * > unit('drip', 'cfx')(1000000000000000000)
 JSBI.BigInt(1)
 */
export default function unit(from, to) {
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
      ? JSBI.multiply(JSBI.BigInt(value), JSBI.BigInt(multiple))
      : JSBI.divide(JSBI.BigInt(value), JSBI.BigInt(reciprocal));
  };
}

// ----------------------------------------------------------------------------
/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromCFXToGDrip(123)
 JSBI.BigInt(123000000000)
 */
unit.fromCFXToGDrip = unit('cfx', 'gdrip');

/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromCFXToDrip(123)
 JSBI.BigInt(123000000000000000000)
 */
unit.fromCFXToDrip = unit('cfx', 'drip');

/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromGDripToCFX(123456789012)
 JSBI.BigInt(123)
 */
unit.fromGDripToCFX = unit('gdrip', 'cfx');

/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromGDripToDrip(123)
 JSBI.BigInt(123000000000)
 */
unit.fromGDripToDrip = unit('gdrip', 'drip');

/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromDripToCFX(123456789012345678901)
 JSBI.BigInt(123)
 */
unit.fromDripToCFX = unit('drip', 'cfx');

/**
 * @param value {number|JSBI|string}
 * @return {JSBI}
 *
 * @example
 * > fromDripToGDrip(123456789012)
 JSBI.BigInt(123)
 */
unit.fromDripToGDrip = unit('drip', 'gdrip');
