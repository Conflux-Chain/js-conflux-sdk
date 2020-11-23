const { Drip } = require('../src');

test('Drip.fromCFX', () => {
  expect(() => Drip.fromCFX(null)).toThrow('Invalid number');
  expect(() => Drip.fromCFX(-1)).toThrow('not match "bigUInt"');
  expect(Drip.fromCFX(3.14).toString()).toEqual('3140000000000000000');
  expect(Drip.fromCFX(1e-18).toString()).toEqual('1');
  expect(() => Drip.fromCFX(1e-19)).toThrow('Cannot');

  expect(() => Drip.fromCFX('')).toThrow('Invalid number');
  expect(Drip.fromCFX('0.0').toString()).toEqual('0');
  expect(Drip.fromCFX('0x0a').toString()).toEqual('10000000000000000000');
  expect(Drip.fromCFX('1e-18').toString()).toEqual('1');
  expect(() => Drip.fromCFX('1e-19')).toThrow('Cannot');
});

test('Drip.fromGDrip', () => {
  expect(() => Drip.fromGDrip(null)).toThrow('Invalid number');
  expect(() => Drip.fromGDrip(-1)).toThrow('not match "bigUInt"');
  expect(Drip.fromGDrip(3.14).toString()).toEqual('3140000000');
  expect(Drip.fromGDrip(1e-9).toString()).toEqual('1');
  expect(() => Drip.fromGDrip(1e-10)).toThrow('Cannot');

  expect(() => Drip.fromGDrip('')).toThrow('Invalid number');
  expect(Drip.fromGDrip('0.0').toString()).toEqual('0');
  expect(Drip.fromGDrip('0x0a').toString()).toEqual('10000000000');
  expect(Drip.fromGDrip('1e-9').toString()).toEqual('1');
  expect(() => Drip.fromGDrip('1e-10')).toThrow('Cannot');
});

test('Drip', () => {
  expect(Drip('').toString()).toEqual('0');
  expect(Drip('0.0').toString()).toEqual('0');
  expect(Drip('0x0a').toString()).toEqual('10');
  expect(Drip(1e2).toString()).toEqual('100');
  expect((new Drip(1e2)).toString()).toEqual('100');

  expect(() => Drip()).toThrow('Cannot');
  expect(() => Drip(null)).toThrow('Cannot');
  expect(() => Drip(-1)).toThrow('not match "bigUInt"');
  expect(() => Drip(3.14)).toThrow('Cannot');
});

test('Drip.toXXX', () => {
  const drip = Drip.fromGDrip(3.14);

  expect(drip.toString()).toEqual('3140000000');
  expect(drip.toGDrip()).toEqual('3.14');
  expect(drip.toCFX()).toEqual('0.00000000314');

  expect(JSON.stringify(drip)).toEqual('"3140000000"');
});
