const { Drip } = require('../src');

test('Drip.fromCFX', () => {
  expect(() => Drip.fromCFX(null)).toThrow('Invalid number');
  expect(() => Drip.fromCFX(-1)).toThrow('not match bigUInt');
  expect(Drip.fromCFX(3.14)).toEqual('3140000000000000000');
  expect(Drip.fromCFX(1e-18)).toEqual('1');
  expect(() => Drip.fromCFX(1e-19)).toThrow('not match bigUInt');

  expect(() => Drip.fromCFX('')).toThrow('Invalid number');
  expect(Drip.fromCFX('0.0')).toEqual('0');
  expect(Drip.fromCFX('0x0a')).toEqual('10000000000000000000');
  expect(Drip.fromCFX('1e-18')).toEqual('1');
  expect(() => Drip.fromCFX('1e-19')).toThrow('not match bigUInt');
});

test('Drip.fromGDrip', () => {
  expect(() => Drip.fromGDrip(null)).toThrow('Invalid number');
  expect(() => Drip.fromGDrip(-1)).toThrow('not match bigUInt');
  expect(Drip.fromGDrip(3.14)).toEqual('3140000000');
  expect(Drip.fromGDrip(1e-9)).toEqual('1');
  expect(() => Drip.fromGDrip(1e-10)).toThrow('not match bigUInt');

  expect(() => Drip.fromGDrip('')).toThrow('Invalid number');
  expect(Drip.fromGDrip('0.0')).toEqual('0');
  expect(Drip.fromGDrip('0x0a')).toEqual('10000000000');
  expect(Drip.fromGDrip('1e-9')).toEqual('1');
  expect(() => Drip.fromGDrip('1e-10')).toThrow('not match bigUInt');
});

test('Drip.fromDrip', () => {
  expect(() => Drip.fromDrip(null)).toThrow('Invalid number');
  expect(() => Drip.fromDrip(-1)).toThrow('not match bigUInt');
  expect(() => Drip.fromDrip(3.14)).toThrow('not match bigUInt');
  expect(Drip.fromDrip(1e2)).toEqual('100');

  expect(() => Drip.fromDrip('')).toThrow('Invalid number');
  expect(Drip.fromDrip('0.0')).toEqual('0');
  expect(Drip.fromDrip('0x0a')).toEqual('10');
  expect(Drip.fromDrip('1e2')).toEqual('100');
});

test('Drip.toXXX', () => {
  const drip = Drip.fromGDrip(3.14);

  expect(drip.toString()).toEqual('3140000000');
  expect(drip.toDrip()).toEqual('3140000000');
  expect(drip.toGDrip()).toEqual('3.14');
  expect(drip.toCFX()).toEqual('0.00000000314');

  expect(JSON.stringify(drip)).toEqual('"3140000000"');
});
