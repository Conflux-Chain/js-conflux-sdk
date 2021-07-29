const { PersonalMessage, sign, format } = require('../src');

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const NET_ID = 1;
const message = 'Hello World';

test('new PersonalMessage(string)', () => {
  const messageHex = format.hex(Buffer.from(message));
  const msg = new PersonalMessage(message);
  const personalMsg = msg._prefix + messageHex.length + messageHex;
  expect(msg.hash).toEqual(format.hex(sign.keccak256(personalMsg)));
  expect(msg._originMsg).toEqual(message);
  expect(msg._personalMsg).toEqual(personalMsg);
  msg.sign(KEY, NET_ID);
  expect(msg.signature).toEqual(PersonalMessage.sign(KEY, message));
  expect(msg.from).toEqual(ADDRESS);
});

test('PersonalMessage.sign/recover', () => {
  const sig = '0xf2e2c43e45ddb5dedd72f9fd147556ec2b81c7a3ef1032b70d2786d759c9aa341663904c46beba7472de4ada0474e47b8dc018c717d344388938e1d66e33c7cb01';
  expect(PersonalMessage.sign(KEY, message)).toEqual(sig);
  expect(PersonalMessage.recover(sig, message)).toEqual(PUBLIC);
});
