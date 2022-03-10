import { PersonalMessage, sign, format } from '../src/index.js';

const KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const PUBLIC = '0x4646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559';
const ADDRESS = 'cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7';
const NET_ID = 1;
const message = 'Hello World';

test('new PersonalMessage(string)', () => {
  const messageBuf = Buffer.from(message);
  const msg = new PersonalMessage(message);
  const personalMsg = msg._prefix + messageBuf.length + message;
  expect(msg.hash).toEqual(format.hex(sign.keccak256(personalMsg)));
  expect(msg._originMsg).toEqual(message);
  expect(msg._personalMsg).toEqual(personalMsg);
  msg.sign(KEY, NET_ID);
  expect(msg.signature).toEqual(PersonalMessage.sign(KEY, message));
  expect(msg.from).toEqual(ADDRESS);
});

test('PersonalMessage.sign/recover', () => {
  const sig = '0xd72ea2020802d6dfce0d49fc1d92a16b43baa58fc152d6f437d852a014e0c5740b3563375b0b844a835be4f1521b4ae2a691048622f70026e0470acc5351043a01';
  expect(PersonalMessage.sign(KEY, message)).toEqual(sig);
  expect(PersonalMessage.recover(sig, message)).toEqual(PUBLIC);
});
