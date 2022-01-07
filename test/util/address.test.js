const { address } = require('../../src');

const MAINNET_ADDRESS = 'cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91';
const TESTNET_ADDRESS = 'cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957';
const mappedAddress = '0x12Bf6283CcF8Ad6ffA63f7Da63EDc217228d839A';

test('shorten', () => {
  expect(address.shortenCfxAddress(MAINNET_ADDRESS)).toEqual('cfx:aak...ku8scz91');
  expect(address.shortenCfxAddress(MAINNET_ADDRESS, true)).toEqual('cfx:aak...cz91');
  expect(address.shortenCfxAddress(TESTNET_ADDRESS)).toEqual('cfxtest:aak...e957');
  expect(address.shortenCfxAddress(TESTNET_ADDRESS, true)).toEqual('cfxtest:aak...e957');
});

test('cfxMappedEVMSpaceAddress', () => {
  expect(address.cfxMappedEVMSpaceAddress(MAINNET_ADDRESS)).toEqual(mappedAddress);
  expect(address.cfxMappedEVMSpaceAddress(TESTNET_ADDRESS)).toEqual(mappedAddress);
});
