const { Hex } = require('../../src/utils/type');
const HexStream = require('../../src/abi/HexStream');

test('padBuffer', () => {
  const buffer0 = HexStream.padBuffer('0x');
  expect(buffer0.length).toEqual(0);

  const buffer20 = HexStream.padBuffer('0x0123456789012345678901234567890123456789');
  expect(buffer20.length).toEqual(32);
  expect(Hex(buffer20)).toEqual('0x0000000000000000000000000123456789012345678901234567890123456789');

  const buffer32 = HexStream.padBuffer('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  expect(buffer32.length).toEqual(32);
  expect(Hex(buffer32)).toEqual('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

  const buffer33 = HexStream.padBuffer('0xff0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  expect(buffer33.length).toEqual(32 * 2);
  expect(Hex(buffer33)).toEqual('0x' +
    '00000000000000000000000000000000000000000000000000000000000000ff' +
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  );
});

test('HexStream', () => {
  const stream = HexStream.from('0x' +
    'a000000000000000000000000000000000000000000000000000000000000001' +
    'b000000000000000000000000000000000000000000000000000000000000002',
  );

  expect(stream.read(0)).toEqual('');
  expect(stream.read(1)).toEqual('01');
  expect(stream.read(1, true)).toEqual('b0');
  expect(() => stream.read(1)).toThrow('length not match');
});
