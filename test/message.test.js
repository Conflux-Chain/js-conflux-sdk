const Message = require('../src/Message');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

test('Message.sign', () => {
  const msg = new Message('Hello World');

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual(undefined);
  expect(msg.r).toEqual(undefined);
  expect(msg.s).toEqual(undefined);
  expect(msg.v).toEqual(undefined);
  expect(msg.from).toEqual(undefined); // virtual attribute

  msg.sign(KEY);

  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute

  msg.v = 0;
  expect(msg.from).not.toEqual(ADDRESS);
});

test('Message.recover', () => {
  const msg = new Message({
    hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
    r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
    s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
    v: 1,
  });

  expect(msg.from).toEqual(ADDRESS); // virtual attribute
});
