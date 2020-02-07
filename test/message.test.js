const { Message } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ADDRESS = '0xfcad0b19bb29d4674531d6f115237e16afce377c';

test('Message.sign({message})', () => {
  const msg = new Message({ message: 'Hello World' });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual(undefined);
  expect(msg.s).toEqual(undefined);
  expect(msg.v).toEqual(undefined);
  expect(msg.from).toEqual(undefined); // virtual attribute
  expect(msg.signature).toEqual(undefined); // virtual attribute

  msg.sign(KEY);

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute

  msg.v = 0;
  expect(msg.from).not.toEqual(ADDRESS);
});

test('Message.sign({hash})', () => {
  const msg = new Message({
    hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual(undefined);
  expect(msg.s).toEqual(undefined);
  expect(msg.v).toEqual(undefined);
  expect(msg.from).toEqual(undefined); // virtual attribute
  expect(msg.signature).toEqual(undefined); // virtual attribute

  msg.sign(KEY);

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message.sign({})', () => {
  const msg = new Message({});

  expect(() => msg.sign(KEY)).toThrow('not match hex');
});

test('Message.recover({message,r,s,v})', () => {
  const msg = new Message({
    message: 'Hello World',
    r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
    s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
    v: 1,
  });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message.recover({hash,r,s,v})', () => {
  const msg = new Message({
    hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
    r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
    s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
    v: 1,
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message.recover({message,signature})', () => {
  const msg = new Message({
    message: 'Hello World',
    signature: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101',
  });

  expect(msg.message).toEqual('Hello World');
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message.recover({hash,signature})', () => {
  const msg = new Message({
    hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
    signature: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101',
  });

  expect(msg.message).toEqual(undefined);
  expect(msg.hash).toEqual('0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2');
  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
  expect(msg.from).toEqual(ADDRESS); // virtual attribute
  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message encode signature', () => {
  const msg = new Message({
    r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
    s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
    v: 1,
  });

  expect(msg.signature).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101'); // virtual attribute
});

test('Message decode signature', () => {
  const msg = new Message({
    signature: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101',
  });

  expect(msg.r).toEqual('0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6');
  expect(msg.s).toEqual('0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81');
  expect(msg.v).toEqual(1);
});

test('Message OverrideError', () => {
  expect(() => new Message()).toThrow('Cannot destructure property');

  expect(() => new Message({
    message: 'Hello World',
    hash: '0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2',
  })).toThrow('OverrideError, can not set `message` with `hash`');

  expect(() => new Message({
    signature: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd632efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da8101',
    r: '0xe6bfbd768a421b9051fe86310f0f1eef9d5df65288b53f54d663f887a5b4bcd6',
    s: '0x32efb64ccc67d7245545175953e811bc237fd83ab8722d8be0a66e92ec39da81',
    v: 1,
  })).toThrow('OverrideError, can not set `signature` with `r` or `s` or `v`');
});
