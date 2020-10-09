const JSBI = require('jsbi');
const EventCoder = require('../../src/contract/event/EventCoder');

test('event', () => {
  const abi = {
    name: 'EventName',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
  };

  const log = {
    data: '0x000000000000000000000000000000000000000000000000000000000000000a',
    topics: [
      '0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7',
      '0x0000000000000000000000000123456789012345678901234567890123456789',
    ],
  };

  const coder = new EventCoder(abi);
  expect(coder.signature).toEqual('0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7');

  expect(coder.encodeTopics(['0x0123456789012345678901234567890123456789', null]))
    .toEqual(['0x0000000000000000000000000123456789012345678901234567890123456789']);

  expect(() => coder.encodeTopics(['0x0123456789012345678901234567890123456789']))
    .toThrow('length not match');

  expect([...coder.decodeLog(log)])
    .toEqual(['0x0123456789012345678901234567890123456789', JSBI.BigInt(10)]);
});

test('event.anonymous', () => {
  const abi = {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
  };

  const log = {
    data: '0x000000000000000000000000000000000000000000000000000000000000000a',
    topics: [
      '0x0000000000000000000000000123456789012345678901234567890123456789',
    ],
  };

  const coder = new EventCoder(abi);
  expect([...coder.decodeLog(log)])
    .toEqual(['0x0123456789012345678901234567890123456789', JSBI.BigInt(10)]);
});
