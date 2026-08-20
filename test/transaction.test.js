const { Transaction, format, sign } = require('../src');
const KEY = require('./index').TEST_KEY;

const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const networkId = 1;

const txMeta = {
  nonce: 0,
  gasPrice: 1,
  gas: 21000,
  to: '0x0123456789012345678901234567890123456789',
  value: 0,
  storageLimit: 0,
  epochHeight: 0,
  chainId: 1,
};
const MAINNET_TO = format.address(txMeta.to, 1029);

const rawTx = '0xf863df8001825208940123456789012345678901234567890123456789808080018001a0ef53e4af065905cb5134f7de4e9434e71656f824e3e268a9babb4f14ff808113a0407f05f44f79c1fd19262665d3efc29368e317fe5e77be27c0c1314b6a242a1e';

const tx2930Meta = {
  type: 1,
  nonce: 100,
  gasPrice: 100,
  gas: 100,
  to: '0x19578cf3c71eab48cf810c78b5175d5c9e6ef441',
  value: 100,
  data: format.hex(Buffer.from('Hello, World')),
  storageLimit: 100,
  epochHeight: 100,
  chainId: 100,
  accessList: [
    {
      address: '0x19578cf3c71eab48cf810c78b5175d5c9e6ef441',
      storageKeys: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      ],
    },
  ],
};

const tx1559Meta = {
  type: 2,
  nonce: 100,
  maxPriorityFeePerGas: 100,
  maxFeePerGas: 100,
  gas: 100,
  to: '0x19578cf3c71eab48cf810c78b5175d5c9e6ef441',
  value: 100,
  data: format.hex(Buffer.from('Hello, World')),
  storageLimit: 100,
  epochHeight: 100,
  chainId: 100,
  accessList: [
    {
      address: '0x19578cf3c71eab48cf810c78b5175d5c9e6ef441',
      storageKeys: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      ],
    },
  ],
};

test('Transaction', () => {
  const transaction = new Transaction(txMeta);

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

  transaction.sign(KEY, networkId);

  expect(transaction.r).toEqual('0xef53e4af065905cb5134f7de4e9434e71656f824e3e268a9babb4f14ff808113');
  expect(transaction.s).toEqual('0x407f05f44f79c1fd19262665d3efc29368e317fe5e77be27c0c1314b6a242a1e');
  expect(transaction.v).toEqual(1);
  expect(transaction.from).toEqual(ADDRESS);
  expect(transaction.hash).toEqual('0x9e463f32428c7c4026575d132e8c4e5d6fe387322fce5234103e52f4ab39b053');
  expect(transaction.recover()).toEqual('0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559');
  expect(transaction.serialize()).toEqual(rawTx);
});

test('Transaction.sign rejects mismatched to address networkId', () => {
  const transaction = new Transaction({
    ...txMeta,
    to: MAINNET_TO,
    chainId: 1,
  });

  expect(() => transaction.sign(KEY, networkId)).toThrow('`to` address\'s networkId does not match transaction chainId');
});

test('2930 tx encode', () => {
  const tx1 = new Transaction(Object.assign(tx2930Meta, {
    r: 1,
    s: 1,
    v: 0,
  }));

  const rlpEncode = tx1.encode(false);

  expect(format.hex(rlpEncode).startsWith('0x63667801')).toEqual(true);
  expect(format.hex(sign.keccak256(rlpEncode))).toEqual('0x690d58e271b90254e7954147846d5de0f76f3649510bb58a5f26e4fef8d601ba');
  expect(format.hex(tx1.encode(true))).toEqual('0x63667801f868f8636464649419578cf3c71eab48cf810c78b5175d5c9e6ef441646464648c48656c6c6f2c20576f726c64f838f79419578cf3c71eab48cf810c78b5175d5c9e6ef441e1a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef800101');
});

test('2930 tx sign', () => {
  const tx1 = new Transaction(tx1559Meta);
  tx1.sign(KEY);
  // console.log(tx1.serialize());
});

test('1559 tx encode', () => {
  const tx1 = new Transaction(Object.assign(tx1559Meta, {
    r: 1,
    s: 1,
    v: 0,
  }));

  const rlpEncode = tx1.encode(false);

  expect(format.hex(rlpEncode).startsWith('0x63667802')).toEqual(true);
  expect(format.hex(sign.keccak256(rlpEncode))).toEqual('0x3da56dbe2b76c41135c2429f3035cd79b1abb68902cf588075c30d4912e71cf3');
  expect(format.hex(tx1.encode(true))).toEqual('0x63667802f869f864646464649419578cf3c71eab48cf810c78b5175d5c9e6ef441646464648c48656c6c6f2c20576f726c64f838f79419578cf3c71eab48cf810c78b5175d5c9e6ef441e1a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef800101');
});

test('starts with 0x00', () => {
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

test('decodeRawTransaction', () => {
  const transaction = Transaction.decodeRaw(rawTx);
  expect(transaction.chainId).toEqual(1);
  expect(transaction.nonce).toEqual(BigInt(0));
  expect(transaction.to).toEqual(format.address('0x0123456789012345678901234567890123456789', transaction.chainId));

  // empty to address
  const deployTx = new Transaction({
    ...txMeta,
    to: null,
  });
  deployTx.sign(KEY, 1);

  const decodedDeployTx = Transaction.decodeRaw(deployTx.serialize());
  expect(decodedDeployTx.to).toEqual(null);

  // tx with data
  const data = format.hex(Buffer.from('Example data'));
  const dataTx = new Transaction({
    ...txMeta,
    data,
  });

  dataTx.sign(KEY, 1);

  const decodedDataTx = Transaction.decodeRaw(dataTx.serialize());
  expect(decodedDataTx.data).toEqual(data);
});

test('decodeRaw2930Tx', () => {
  const raw2930Tx = '0x63667801f8a8f8636464649419578cf3c71eab48cf810c78b5175d5c9e6ef441646464648c48656c6c6f2c20576f726c64f838f79419578cf3c71eab48cf810c78b5175d5c9e6ef441e1a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef01a0e3e73f1ae5a109b01f5f64b97c7eae0c870da2c050969916d0a440ac2eef0ca3a04e8c4415db648707bd6d4c7708793b04f5404ff38e873fb78f1a6474e36a2579';
  const transaction = Transaction.decodeRaw(raw2930Tx);
  expect(transaction.chainId).toEqual(100);
  expect(transaction.nonce).toEqual(BigInt(100));
  expect(transaction.to).toEqual(format.address('0x19578cf3c71eab48cf810c78b5175d5c9e6ef441', transaction.chainId));
  expect(transaction.value).toEqual(BigInt(100));
  expect(transaction.accessList.encode().length).toEqual(1);
});

test('decodeRaw1559Tx', () => {
  const raw1559Tx = '0x63667802f8a9f864646464649419578cf3c71eab48cf810c78b5175d5c9e6ef441646464648c48656c6c6f2c20576f726c64f838f79419578cf3c71eab48cf810c78b5175d5c9e6ef441e1a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef80a069a44af3ab58ea8be86d21262e900279adc674248a23df5771406545163c1383a0248424d9019fb6c0ecb59c0df3841623fada8fe829cf15e77b6d777accc7cfec';
  const transaction = Transaction.decodeRaw(raw1559Tx);
  expect(transaction.chainId).toEqual(100);
  expect(transaction.nonce).toEqual(BigInt(100));
  expect(transaction.to).toEqual(format.address('0x19578cf3c71eab48cf810c78b5175d5c9e6ef441', transaction.chainId));
  expect(transaction.value).toEqual(BigInt(100));
  expect(transaction.accessList.encode().length).toEqual(1);
  expect(transaction.maxFeePerGas).toEqual(BigInt(100));
  expect(transaction.maxPriorityFeePerGas).toEqual(BigInt(100));
});
