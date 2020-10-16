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
    .toEqual(['0x0123456789012345678901234567890123456789', `${BigInt(10)}`]);
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
  const tuple = coder.decodeLog(log);
  expect([...tuple]).toEqual(['0x0123456789012345678901234567890123456789', `${BigInt(10)}`]);
  expect(tuple.toObject()).toEqual({
    account: '0x0123456789012345678901234567890123456789',
    number: `${BigInt(10)}`,
  });
});

test('event without name', () => {
  const abi = {
    type: 'event',
    name: 'Event',
    inputs: [
      {
        type: 'uint256',
        name: undefined,
      },
    ],
  };

  const log = {
    topics: [
      '0x510e730eb6600b4c67d51768c6996795863364461fee983d92d5e461f209c7cf',
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000003',
  };

  const coder = new EventCoder(abi);
  const tuple = coder.decodeLog(log);
  expect([...tuple]).toEqual(['3']);
  expect(tuple.toObject()).toEqual({ 0: '3' });
});

test('event without inputs', () => {
  const abi = {
    type: 'event',
    name: 'Event',
  };

  const log = {
    topics: [
      '0x57050ab73f6b9ebdd9f76b8d4997793f48cf956e965ee070551b9ca0bb71584e',
    ],
  };

  const coder = new EventCoder(abi);
  const tuple = coder.decodeLog(log);
  expect([...tuple]).toEqual([]);
  expect(tuple.toObject()).toEqual({});
});
