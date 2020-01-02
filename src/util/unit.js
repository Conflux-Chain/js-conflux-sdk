const format = require('./format');

const UNIT_MATRIX = {
  cfx: { cfx: 1, gdrip: 1e9, drip: 1e18 },
  gdrip: { cfx: 1e-9, gdrip: 1, drip: 1e9 },
  drip: { cfx: 1e-18, gdrip: 1e-9, drip: 1 },
};

/**
 * Unit transfer function factory
 *
 * @param from {string} - Enum in ['cfx', 'gdrip', 'drip']
 * @param to {string} - Enum in ['cfx', 'gdrip', 'drip']
 * @return {function}
 *
 * @example
 * > converter('cfx', 'drip')(1)
 "1000000000000000000" // BigNumber

 * > converter('drip', 'cfx')(1)
 "0.000000000000000001" // BigNumber
 */
function converter(from, to) {
  const keys = Object.keys(UNIT_MATRIX);
  if (!keys.includes(from)) {
    throw new Error(`"from" must in ${JSON.stringify(keys)}, got "${from}"`);
  }
  if (!keys.includes(to)) {
    throw new Error(`"to" must in ${JSON.stringify(keys)}, got "${to}"`);
  }
  return value => format.bigNumber(value).times(UNIT_MATRIX[from][to]);
}

module.exports = {
  converter,

  fromCFXToCFX: converter('cfx', 'cfx'),
  fromCFXToGDrip: converter('cfx', 'gdrip'),
  fromCFXToDrip: converter('cfx', 'drip'),

  fromGDripToCFX: converter('gdrip', 'cfx'),
  fromGDripToGDrip: converter('gdrip', 'gdrip'),
  fromGDripToDrip: converter('gdrip', 'drip'),

  fromDripToCFX: converter('drip', 'cfx'),
  fromDripToGDrip: converter('drip', 'gdrip'),
  fromDripToDrip: converter('drip', 'drip'),
};
