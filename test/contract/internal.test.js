const { Conflux } = require('../../src');

const conflux = new Conflux();

test('AdminControl', () => {
  const contract = conflux.InternalContract('AdminControl');

  expect(contract.address).toEqual('0x0888000000000000000000000000000000000000');
  expect(contract.constructor).toBeDefined();
});

test('SponsorWhitelistControl', () => {
  const contract = conflux.InternalContract('SponsorWhitelistControl');

  expect(contract.address).toEqual('0x0888000000000000000000000000000000000001');
  expect(contract.constructor).toBeDefined();
});

test('Staking', () => {
  const contract = conflux.InternalContract('Staking');

  expect(contract.address).toEqual('0x0888000000000000000000000000000000000002');
  expect(contract.constructor).toBeDefined();
});

test('NOT EXIST', () => {
  expect(() => conflux.InternalContract('NOT EXIST')).toThrow('can not find internal contract');
});
