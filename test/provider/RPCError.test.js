const RPCError = require('../../src/provider/RPCError');

describe('RPCError.paramsErrorDetail', () => {
  test('returns data for legacy Invalid params errors without changing the message', () => {
    const error = new RPCError({
      code: -32602,
      message: 'Invalid params',
      data: 'invalid epoch number',
    });

    expect(error.message).toEqual('Invalid params');
    expect(error.data).toEqual('invalid epoch number');
    expect(error.paramsErrorDetail()).toEqual('invalid epoch number');
  });

  test.each([
    ['Invalid params: invalid epoch number', 'invalid epoch number'],
    ['Invalid parameters: invalid epoch number', 'invalid epoch number'],
    ['Invalid params:   invalid epoch number   ', 'invalid epoch number'],
  ])('extracts the detail from %s', (message, detail) => {
    const error = new RPCError({ code: -32602, message });

    expect(error.message).toEqual(message);
    expect(error.paramsErrorDetail()).toEqual(detail);
  });

  test.each([
    { code: -32601, message: 'Method not found' },
    { code: -32602, message: 'Invalid params' },
    { code: -32602, message: 'Invalid params', data: '' },
    { code: -32602, message: 'Invalid params', data: { reason: 'invalid epoch number' } },
  ])('returns null when no parameter error detail is available', object => {
    const error = new RPCError(object);

    expect(error.paramsErrorDetail()).toBeNull();
  });
});
