const BigNumber = require('bignumber.js');
const { converter } = require('../../src/util/unit');

test('converter', () => {
  expect(converter('cfx', 'cfx')(1)).toEqual(BigNumber(1));
  expect(converter('cfx', 'gdrip')(1)).toEqual(BigNumber(1e9));
  expect(converter('cfx', 'drip')(1)).toEqual(BigNumber(1e18));

  expect(converter('gdrip', 'cfx')(1)).toEqual(BigNumber(1e-9));
  expect(converter('gdrip', 'gdrip')(1)).toEqual(BigNumber(1));
  expect(converter('gdrip', 'drip')(1)).toEqual(BigNumber(1e9));

  expect(converter('drip', 'cfx')(1)).toEqual(BigNumber(1e-18));
  expect(converter('drip', 'gdrip')(1)).toEqual(BigNumber(1e-9));
  expect(converter('drip', 'drip')(1)).toEqual(BigNumber(1));

  expect(() => converter('CFX', 'drip')).toThrow('"from" must in ["cfx","gdrip","drip"], got "CFX"');
  expect(() => converter('cfx', 'Drip')).toThrow('"to" must in ["cfx","gdrip","drip"], got "Drip"');
});
