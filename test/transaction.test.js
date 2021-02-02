const { Transaction } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';

test('Transaction', () => {
  const transaction = new Transaction({
    nonce: 0,
    gasPrice: 1,
    gas: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
    storageLimit: 0,
    epochHeight: 0,
    chainId: 1,
  });

  expect(transaction.nonce).toEqual(0);
  expect(transaction.gasPrice).toEqual(1);
  expect(transaction.gas).toEqual(21000);
  expect(transaction.to).toEqual('0x0123456789012345678901234567890123456789');
  expect(transaction.value).toEqual(0);
  expect(transaction.storageLimit).toEqual(0);
  expect(transaction.epochHeight).toEqual(0);
  expect(transaction.chainId).toEqual(1);
  expect(transaction.data).toEqual(undefined);
  expect(transaction.r).toEqual(undefined);
  expect(transaction.s).toEqual(undefined);
  expect(transaction.v).toEqual(undefined);
  expect(transaction.from).toEqual(undefined); // virtual attribute
  expect(transaction.hash).toEqual(undefined); // virtual attribute

  transaction.sign(KEY, 1);

  expect(transaction.r).toEqual('0xef53e4af065905cb5134f7de4e9434e71656f824e3e268a9babb4f14ff808113');
  expect(transaction.s).toEqual('0x407f05f44f79c1fd19262665d3efc29368e317fe5e77be27c0c1314b6a242a1e');
  expect(transaction.v).toEqual(1);
  expect(transaction.from).toEqual(ADDRESS);
  expect(transaction.hash).toEqual('0x9e463f32428c7c4026575d132e8c4e5d6fe387322fce5234103e52f4ab39b053');
  expect(transaction.recover()).toEqual('0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559');
  expect(transaction.serialize()).toEqual('0xf863df8001825208940123456789012345678901234567890123456789808080018001a0ef53e4af065905cb5134f7de4e9434e71656f824e3e268a9babb4f14ff808113a0407f05f44f79c1fd19262665d3efc29368e317fe5e77be27c0c1314b6a242a1e');
});

test('s starts with 0x00', () => {
  const transaction = new Transaction({
    nonce: 127,
    gasPrice: 1,
    gas: 21000,
    to: '0x0123456789012345678901234567890123456789',
    value: 0,
    storageLimit: 0,
    epochHeight: 0,
    chainId: 1,
  });

  transaction.sign(KEY, 1);

  expect(transaction.s).toEqual('0x233f41b647de5846856106a8bc0fb67ba4dc3c184d328e565547928adedc8f3c');
  expect(transaction.serialize()).toEqual('0xf863df7f01825208940123456789012345678901234567890123456789808080018001a0bde07fe87c58cf83c50a4787c637a05a521d5f8372bd8acb207504e8af2daee4a0233f41b647de5846856106a8bc0fb67ba4dc3c184d328e565547928adedc8f3c');
});
