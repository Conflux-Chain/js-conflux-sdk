const Message = require('../src/Message');
const { sha3 } = require('../src/util/sign');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';

test('new Message(string)', () => {
  const msg = new Message('Hello World');

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba'); // virtual attribute
  expect(msg.r).toEqual(undefined); // virtual attribute
  expect(msg.s).toEqual(undefined); // virtual attribute
  expect(msg.v).toEqual(undefined); // virtual attribute
  expect(msg.from).toEqual(undefined); // virtual attribute
  expect(msg.signature).toEqual(undefined);

  msg.sign(KEY);

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba'); // virtual attribute
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c'); // virtual attribute
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f'); // virtual attribute
  expect(msg.v).toEqual(1); // virtual attribute
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');
});

test('Message.sign/recover', () => {
  const signature = Message.sign(KEY, sha3('Hello World'));
  expect(signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01');

  const publicKey = Message.recover(signature, sha3('Hello World'));
  expect(publicKey).toEqual(PUBLIC);
});
