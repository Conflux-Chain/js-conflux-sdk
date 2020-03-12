const JSBI = require('jsbi');
const { util: { unit } } = require('../../src');

test('unit', () => {
  expect(unit('CFX', 'CFX')(1)).toEqual(JSBI.BigInt(1));
  expect(unit('CFX', 'GDrip')(1)).toEqual(JSBI.BigInt(1e9));
  expect(unit('CFX', 'Drip')(1)).toEqual(JSBI.BigInt(1e18));

  expect(unit('GDrip', 'CFX')(1e9)).toEqual(JSBI.BigInt(1));
  expect(unit('GDrip', 'GDrip')(1)).toEqual(JSBI.BigInt(1));
  expect(unit('GDrip', 'Drip')(1)).toEqual(JSBI.BigInt(1e9));

  expect(unit('Drip', 'CFX')(1e18)).toEqual(JSBI.BigInt(1));
  expect(unit('Drip', 'GDrip')(1e9)).toEqual(JSBI.BigInt(1));
  expect(unit('Drip', 'Drip')(1)).toEqual(JSBI.BigInt(1));

  expect(() => unit('CFX', 'drip')).toThrow('"to" must in ["CFX","GDrip","Drip"], got "drip"');
  expect(() => unit('cfx', 'Drip')).toThrow('"from" must in ["CFX","GDrip","Drip"], got "cfx"');
});

test('fromCFXToGDrip', () => {
  expect(unit.fromCFXToGDrip(-0.1)).toEqual(JSBI.BigInt(-100000000));
  expect(unit.fromCFXToGDrip(123)).toEqual(JSBI.BigInt(123000000000));
  expect(unit.fromCFXToGDrip('123')).toEqual(JSBI.BigInt(123000000000));

  expect(unit.fromCFXToGDrip(0.123456789)).toEqual(JSBI.BigInt('123456789'));
  expect(() => unit.fromCFXToGDrip('0.1234567891')).toThrow('Cannot convert 123456789.1');
});

test('fromGDripToDrip', () => {
  expect(unit.fromGDripToDrip(-0.1)).toEqual(JSBI.BigInt(-100000000));
  expect(unit.fromGDripToDrip(123)).toEqual(JSBI.BigInt(123000000000));
  expect(unit.fromGDripToDrip('123')).toEqual(JSBI.BigInt(123000000000));

  expect(unit.fromGDripToDrip(0.123456789)).toEqual(JSBI.BigInt('123456789'));
  expect(() => unit.fromGDripToDrip('0.1234567891')).toThrow('Cannot convert 123456789.1');
});

test('fromDripToGDrip', () => {
  expect(unit.fromDripToGDrip(1000000000)).toEqual(JSBI.BigInt(1));
  expect(unit.fromDripToGDrip(-1000000000)).toEqual(JSBI.BigInt(-1));
  expect(() => unit.fromDripToGDrip(1100000000)).toThrow('Cannot convert 1.1');
});

test('fromGDripToCFX', () => {
  expect(unit.fromGDripToCFX(1000000000)).toEqual(JSBI.BigInt(1));
  expect(unit.fromGDripToCFX(-1000000000)).toEqual(JSBI.BigInt(-1));
  expect(() => unit.fromGDripToCFX(1100000000)).toThrow('Cannot convert 1.1');
});

test('fromCFXToDrip', () => {
  expect(unit.fromCFXToDrip(-0.1)).toEqual(JSBI.BigInt(-100000000000000000));
  expect(unit.fromCFXToDrip(123)).toEqual(JSBI.BigInt(123000000000000000000));
  expect(unit.fromCFXToDrip('123')).toEqual(JSBI.BigInt(123000000000000000000));

  expect(unit.fromCFXToDrip('0.123456789123456789')).toEqual(JSBI.BigInt('123456789123456789'));
  expect(() => unit.fromCFXToDrip('0.1234567891234567891')).toThrow('Cannot convert 123456789123456789.1');
});

test('fromDripToCFX', () => {
  expect(unit.fromDripToCFX('1000000000000000000')).toEqual(JSBI.BigInt(1));
  expect(unit.fromDripToCFX('-1000000000000000000')).toEqual(JSBI.BigInt(-1));

  expect(() => unit.fromDripToCFX('1100000000000000000')).toThrow('Cannot convert 1.1');
});
