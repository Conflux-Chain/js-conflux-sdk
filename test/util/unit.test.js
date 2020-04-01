const unit = require('../../src/util/unit');

test('unit', () => {
  expect(unit('CFX', 'CFX')(1)).toEqual('1');
  expect(unit('CFX', 'GDrip')(1)).toEqual('1000000000');
  expect(unit('CFX', 'Drip')(1)).toEqual('1000000000000000000');

  expect(unit('GDrip', 'CFX')(1e9)).toEqual('1');
  expect(unit('GDrip', 'GDrip')(1)).toEqual('1');
  expect(unit('GDrip', 'Drip')(1)).toEqual('1000000000');

  expect(unit('Drip', 'CFX')(1e18)).toEqual('1');
  expect(unit('Drip', 'GDrip')(1e9)).toEqual('1');
  expect(unit('Drip', 'Drip')(1)).toEqual('1');

  expect(() => unit('CFX', 'drip')).toThrow('"to" must in ["CFX","GDrip","Drip"], got "drip"');
  expect(() => unit('cfx', 'Drip')).toThrow('"from" must in ["CFX","GDrip","Drip"], got "cfx"');
});

test('fromCFXToGDrip', () => {
  expect(unit.fromCFXToGDrip(-0.1)).toEqual('-100000000');
  expect(unit.fromCFXToGDrip(123)).toEqual('123000000000');
  expect(unit.fromCFXToGDrip('123')).toEqual('123000000000');

  expect(unit.fromCFXToGDrip(0.123456789)).toEqual('123456789');
  expect(unit.fromCFXToGDrip(0.1234567891)).toEqual('123456789.1');
});

test('fromGDripToDrip', () => {
  expect(unit.fromGDripToDrip(-0.1)).toEqual('-100000000');
  expect(unit.fromGDripToDrip(123)).toEqual('123000000000');
  expect(unit.fromGDripToDrip('123')).toEqual('123000000000');

  expect(unit.fromGDripToDrip(0.123456789)).toEqual('123456789');
  expect(unit.fromGDripToDrip(0.1234567891)).toEqual('123456789.1');
});

test('fromDripToGDrip', () => {
  expect(unit.fromDripToGDrip(1000000000)).toEqual('1');
  expect(unit.fromDripToGDrip(-1000000000)).toEqual('-1');
  expect(unit.fromDripToGDrip(1100000000)).toEqual('1.1');
});

test('fromGDripToCFX', () => {
  expect(unit.fromGDripToCFX(1000000000)).toEqual('1');
  expect(unit.fromGDripToCFX(-1000000000)).toEqual('-1');
  expect(unit.fromGDripToCFX(1100000000)).toEqual('1.1');
});

test('fromCFXToDrip', () => {
  expect(unit.fromCFXToDrip(-0.1)).toEqual('-100000000000000000');
  expect(unit.fromCFXToDrip(123)).toEqual('123000000000000000000');
  expect(unit.fromCFXToDrip('123')).toEqual('123000000000000000000');

  expect(unit.fromCFXToDrip('0.123456789123456789')).toEqual('123456789123456789');
  expect(unit.fromCFXToDrip('0.1234567891234567891')).toEqual('123456789123456789.1');
});

test('fromDripToCFX', () => {
  expect(unit.fromDripToCFX('1000000000000000000')).toEqual('1');
  expect(unit.fromDripToCFX('-1000000000000000000')).toEqual('-1');
  expect(unit.fromDripToCFX('1100000000000000000')).toEqual('1.1');
});
