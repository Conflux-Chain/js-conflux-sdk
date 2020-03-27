const { Message } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = '0x1cad0b19bb29d4674531d6f115237e16afce377c';

test('Message.sign({message})', () => {
  const msg = new Message({ message: 'Hello World' });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual(undefined);
  expect(msg.s).toEqual(undefined);
  expect(msg.v).toEqual(undefined);
  expect(msg.from).toEqual(undefined); // virtual attribute
  expect(msg.signature).toEqual(undefined); // virtual attribute
  expect(() => msg.recover()).toThrow('not match hex');

  msg.sign(KEY);

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);

  msg.v = 0;
  expect(msg.from).not.toEqual(ADDRESS);
});

test('Message.sign({hash})', () => {
  const msg = new Message({
    hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual(undefined);
  expect(msg.s).toEqual(undefined);
  expect(msg.v).toEqual(undefined);
  expect(msg.from).toEqual(undefined); // virtual attribute
  expect(msg.signature).toEqual(undefined); // virtual attribute

  msg.sign(KEY);

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);
});

test('Message.sign({})', () => {
  const msg = new Message({});

  expect(() => msg.sign(KEY)).toThrow('not match hex');
});

test('Message.recover({message,r,s,v})', () => {
  const msg = new Message({
    message: 'Hello World',
    r: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c',
    s: '0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f',
    v: 1,
  });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);
});

test('Message.recover({hash,r,s,v})', () => {
  const msg = new Message({
    hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
    r: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c',
    s: '0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f',
    v: 1,
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);
});

test('Message.recover({message,signature})', () => {
  const msg = new Message({
    message: 'Hello World',
    signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
  });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);
});

test('Message.recover({hash,signature})', () => {
  const msg = new Message({
    hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
    signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba');
  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(msg.recover()).toEqual(PUBLIC);
});

test('Message encode signature', () => {
  const msg = new Message({
    r: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c',
    s: '0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f',
    v: 1,
  });

  expect(msg.signature).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01'); // virtual attribute
  expect(() => msg.recover()).toThrow('not match hex');
});

test('Message decode signature', () => {
  const msg = new Message({
    signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
  });

  expect(msg.r).toEqual('0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c');
  expect(msg.s).toEqual('0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f');
  expect(msg.v).toEqual(1);
  expect(() => msg.recover()).toThrow('not match hex');
});

test('Message OverrideError', () => {
  expect(() => new Message()).toThrow('Cannot destructure property');

  expect(() => new Message({
    message: 'Hello World',
    hash: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba',
  })).toThrow('OverrideError, can not set `message` with `hash`');

  expect(() => new Message({
    signature: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f01',
    r: '0x6e913e2b76459f19ebd269b82b51a70e912e909b2f5c002312efc27bcc280f3c',
    s: '0x29134d382aad0dbd3f0ccc9f0eb8f1dbe3f90141d81574ebb6504156b0d7b95f',
    v: 1,
  })).toThrow('OverrideError, can not set `signature` with `r` or `s` or `v`');
});
