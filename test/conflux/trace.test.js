import { Conflux, CONST } from '../../src/index.js';

const conflux = new Conflux({
  url: 'https://test-internal.confluxrpc.com',
  networkId: 1,
});

// Testnet transaction hash that have trace
const t1 = '0x7c00b7815606cf5a30cc78033cd1bc2580c744c0cd5159f8194a3bdb5894d19c'; // common CFX transfer
// const t2 = '0xdeffba5291f0d669ca63514f2f9c95fd313fcf6c2855ec929076225890113b59'; // Contract deployment
// const t3 = '0xb2ce40bbf57f09851a1a0240038dce73f94481c4168c0c88024318482598c9fa'; // FC contract interaction
// const t4 = '0x989b5b28cec1b3675417ba1648eb2a87e269ff48edd0a3056cc272986b4e6512'; // Internal contract interaction

test('traceTransaction', async () => {
  const traces = await conflux.trace.transaction(t1);
  expect(traces).toBeInstanceOf(Array);
  expect(traces.length).toBeGreaterThan(0);
  expect(traces[0]).toBeInstanceOf(Object);
  expect(traces[0]).toHaveProperty('action');
  expect(traces[0]).toHaveProperty('epochNumber');
  expect(typeof traces[0].epochNumber).toBe('number');
  expect(traces[0]).toHaveProperty('epochHash');
  expect(traces[0]).toHaveProperty('blockHash');
  expect(traces[0]).toHaveProperty('transactionHash');
  expect(traces[0]).toHaveProperty('transactionPosition');
  expect(traces[0]).toHaveProperty('valid');
  // The first trace should be gas_payment internal_transfer_action
  expect(traces[0]).toHaveProperty('type', CONST.ACTION_TYPES.INTERNAL_TRANSFER_ACTION);
  expect(traces[0]).toHaveProperty('action.from');
  expect(traces[0]).toHaveProperty('action.fromSpace');
  expect(traces[0]).toHaveProperty('action.fromPocket');
  expect(traces[0]).toHaveProperty('action.to');
  expect(traces[0]).toHaveProperty('action.toSpace');
  expect(traces[0]).toHaveProperty('action.toPocket');
  expect(traces[0]).toHaveProperty('action.value');
  expect(typeof traces[0].action.value).toBe('bigint');
  // The second should be common call trace
  expect(traces[1]).toHaveProperty('type', CONST.ACTION_TYPES.CALL);
  expect(traces[1]).toHaveProperty('action.from');
  expect(traces[1]).toHaveProperty('action.callType');
  expect(traces[1]).toHaveProperty('action.gas');
  expect(traces[1]).toHaveProperty('action.input');
  expect(traces[1]).toHaveProperty('action.space');
  expect(traces[1]).toHaveProperty('action.to');
  expect(traces[1]).toHaveProperty('action.value');
  expect(typeof traces[1].action.value).toBe('bigint');
  // The third should be common call result trace
  expect(traces[2]).toHaveProperty('type', CONST.ACTION_TYPES.CALL_RESULT);
  expect(traces[2]).toHaveProperty('action.outcome');
  expect(traces[2]).toHaveProperty('action.returnData');
  expect(traces[2]).toHaveProperty('action.gasLeft');
});

/*
test('traceBlock', async () => {
});

test('traceFilter', async () => {
});
*/
