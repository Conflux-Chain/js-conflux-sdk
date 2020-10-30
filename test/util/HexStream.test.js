const HexStream = require('../../src/util/HexStream');

test('HexStream', () => {
  const stream = new HexStream(
    'a000000000000000000000000000000000000000000000000000000000000001' +
    'b000000000000000000000000000000000000000000000000000000000000002',
  );

  expect(stream.read(0)).toEqual('');
  expect(stream.read(2)).toEqual('01');
  expect(stream.read(2, true)).toEqual('b0');
  expect(() => stream.read(2)).toThrow('length not match');
});
