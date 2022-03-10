import { Conflux, format } from '../src/index.js';

const conflux = new Conflux({
  url: 'http://localhost:12537',
  // url: 'https://test.confluxrpc.com',
  networkId: 1,
});
const account = conflux.wallet.addPrivateKey('0x7d2fb0bafa614aa26c1776b7dc2f79e1d0598aeaf57c6e526c35e9e427ac823f');
const targetAddress = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';

/* test('Populate tx', async () => {
  async function populate() {
    const tx = await conflux.cfx.populateTransaction({
      from: account.address,
      to: targetAddress,
      value: 1,
    });
    return tx;
  }

  await expect(populate()).resolves.toEqual({
    from: account.address,
  });
}); */

test('RPC methods request builder', () => {
  /**
   * RPC method request template
    expect(conflux.cfx.epochNumber.request()).toEqual({
      request: {
        method: '',
        params: [],
      },
      decoder: format.any,
    });
  */
  expect(conflux.cfx.getStatus.request()).toEqual({
    request: {
      method: 'cfx_getStatus',
      params: [],
    },
    decoder: format.status,
  });

  expect(conflux.cfx.getBalance.request(format.hexAddress(account.address))).toEqual({
    request: {
      method: 'cfx_getBalance',
      params: [account.address],
    },
    decoder: format.bigUInt,
  });

  expect(conflux.cfx.getBalance.request(account.address)).toEqual({
    request: {
      method: 'cfx_getBalance',
      params: [account.address],
    },
    decoder: format.bigUInt,
  });

  expect(conflux.cfx.epochNumber.request()).toEqual({
    request: {
      method: 'cfx_epochNumber',
      params: [],
    },
    decoder: format.uInt,
  });

  expect(conflux.cfx.epochNumber.request('latest_state')).toEqual({
    request: {
      method: 'cfx_epochNumber',
      params: ['latest_state'],
    },
    decoder: format.uInt,
  });

  expect(conflux.cfx.call.request({
    from: account.address,
    to: targetAddress,
    value: 1,
  })).toEqual({
    request: {
      method: 'cfx_call',
      params: [{
        from: account.address,
        to: targetAddress,
        value: '0x1',
      }, undefined],
    },
  });
});
