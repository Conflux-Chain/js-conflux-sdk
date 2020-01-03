const BigNumber = require('bignumber.js');
const unit = require('../../src/util/unit');

test('unit', () => {
  expect(unit('cfx', 'cfx')(1)).toEqual(BigNumber(1));
  expect(unit('cfx', 'gdrip')(1)).toEqual(BigNumber(1e9));
  expect(unit('cfx', 'drip')(1)).toEqual(BigNumber(1e18));

  expect(unit('gdrip', 'cfx')(1)).toEqual(BigNumber(1e-9));
  expect(unit('gdrip', 'gdrip')(1)).toEqual(BigNumber(1));
  expect(unit('gdrip', 'drip')(1)).toEqual(BigNumber(1e9));

  expect(unit('drip', 'cfx')(1)).toEqual(BigNumber(1e-18));
  expect(unit('drip', 'gdrip')(1)).toEqual(BigNumber(1e-9));
  expect(unit('drip', 'drip')(1)).toEqual(BigNumber(1));

  expect(() => unit('CFX', 'drip')).toThrow('"from" must in ["cfx","gdrip","drip"], got "CFX"');
  expect(() => unit('cfx', 'Drip')).toThrow('"to" must in ["cfx","gdrip","drip"], got "Drip"');
});

test('fromCFXToGDrip', () => {
  expect(unit.fromCFXToGDrip(3.14)).toEqual(BigNumber(3140000000));
});

test('fromCFXToDrip', () => {
  expect(unit.fromCFXToDrip(3.14)).toEqual(BigNumber(3140000000000000000));
});

test('fromGDripToCFX', () => {
  expect(unit.fromGDripToCFX(3.14)).toEqual(BigNumber(0.00000000314));
});

test('fromGDripToDrip', () => {
  expect(unit.fromGDripToDrip(3.14)).toEqual(BigNumber(3140000000));
});

test('fromDripToCFX', () => {
  expect(unit.fromDripToCFX(3.14)).toEqual(BigNumber(0.00000000000000000314));
});

test('fromDripToGDrip', () => {
  expect(unit.fromDripToGDrip(3.14)).toEqual(BigNumber(0.00000000314));
});
