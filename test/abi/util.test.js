const format = require('../../src/util/format');
const { padBuffer } = require('../../src/abi/util');

test('padBuffer', () => {
  const buffer0 = padBuffer('0x');
  expect(buffer0.length).toEqual(0);

  const buffer20 = padBuffer('0x0123456789012345678901234567890123456789');
  expect(buffer20.length).toEqual(32);
  expect(format.hex(buffer20)).toEqual('0x0000000000000000000000000123456789012345678901234567890123456789');

  const buffer32 = padBuffer('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  expect(buffer32.length).toEqual(32);
  expect(format.hex(buffer32)).toEqual('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

  const buffer33 = padBuffer('0xff0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  expect(buffer33.length).toEqual(32 * 2);
  expect(format.hex(buffer33)).toEqual('0x' +
    '00000000000000000000000000000000000000000000000000000000000000ff' +
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  );
});
