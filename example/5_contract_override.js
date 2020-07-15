/* eslint-disable */
const { Conflux } = require('../src'); // require('js-conflux-sdk');
const { abi, bytecode } = require('./contract/override.json');

const conflux = new Conflux({ url: 'http://testnet-jsonrpc.conflux-chain.org:12537' });
const contract = conflux.Contract({
  abi,
  bytecode,
  address: '0x8b9c462016188e8cb3b897d6951589043c2d4535', // deployed contract address
});

function showContract() {
  console.log(contract);
  /*
  {
    constructor: [Function: bound call],
    abi: ContractABICoder { * },
    address: undefined,
    func: [Function: bound call],
    Event: [Function: bound call],
    'func(uint256,string)': [Function: bound call],
    '0x1c0138e8': [Function: bound call],
    'func(string)': [Function: bound call],
    '0x1c713525': [Function: bound call],
    'func(bool)': [Function: bound call],
    '0x4f6db4e2': [Function: bound call],
    'func(uint256)': [Function: bound call],
    '0x7f98a45e': [Function: bound call],
    'func((uint256,string))': [Function: bound call],
    '0x9f04158f': [Function: bound call],
    'func(address)': [Function: bound call],
    '0xb8550dc7': [Function: bound call],
    'func(bytes)': [Function: bound call],
    '0xbff8ad84': [Function: bound call],
    'func(int256)': [Function: bound call],
    '0xce625915': [Function: bound call],
    'Event(bool)': [Function: bound call],
    '0x404e952466ce335bcd5dc15385d7d4710eea42951cc4681496db72c1d5d2c464': [Function: bound call],
    'Event(address)': [Function: bound call],
    '0x50d7c806d0f7913f321946784dee176a42aa55b5dd83371fc57dcedf659085e0': [Function: bound call],
    'Event(int256)': [Function: bound call],
    '0x091ec8db73409a58d1b5de8095b8c29f29ef7c43c6a6d9077554201b64cda010': [Function: bound call],
    'Event(uint256)': [Function: bound call],
    '0x510e730eb6600b4c67d51768c6996795863364461fee983d92d5e461f209c7cf': [Function: bound call],
    'Event(bytes)': [Function: bound call],
    '0x758c7cf107fab3cfdc5aefab966cd9e69c3f368761f7a218a18283c1fbb5574c': [Function: bound call],
    'Event(string)': [Function: bound call],
    '0x8892e0cf71abc548dd039256eccac2634fe4a4ac120c01efacb9fc4bed3fe60d': [Function: bound call],
    'Event(uint256,string,string)': [Function: bound call],
    '0xfe4b40b99fc4d2ba7b64c6d861716d72fa2039aacb671b8ad45849f4e6afdfb4': [Function: bound call],
    'Event((uint256,string),(uint256,string))': [Function: bound call],
    '0x361b71fc19d19550804f10e3915dc4bdecd482b2d4660691def90f91cbfd74c0': [Function: bound call]
  }
   */
}

/*
 this example show SDK behavior of override methods.
 */
function argumentOverride() {
  let tx;

  tx = contract.func(true);
  console.log(tx.method.signature); // 0x4f6db4e2
  console.log(tx.method.type); // "func(bool)"

  try {
    contract.func(1); // 1 could hit `int` or `uint`
  } catch (e) {
    console.log(e); // can not determine override "func(uint256)|func(int256)" with args (1)
  }

  tx = contract['0x7f98a45e'](1); // use method signature to determine which will be use
  console.log(tx.method.type); // "func(uint256)"

  tx = contract['0xce625915'](1); // use method signature to determine which will be use
  console.log(tx.method.type); // "func(int256)"

  tx = contract['func(uint256)'](1); // use method type to determine which will be use
  console.log(tx.method.type); // "func(uint256)"
  console.log(tx.method.signature); // 0x7f98a45e
  console.log(tx.data); // "0x7f98a45e0000000000000000000000000000000000000000000000000000000000000001"

  tx = contract['func(int256)'](1); // use method type to determine which will be use
  console.log(tx.method.type); // "func(int256)"
  console.log(tx.method.signature); // 0xce625915
  console.log(tx.data); // "0xce6259150000000000000000000000000000000000000000000000000000000000000001"

  tx = contract['func(int256)']('100'); // number accept string or hex string
  console.log(tx.method.type); // "func(int256)"
  console.log(tx.method.signature); // 0xce625915
  console.log(tx.data); // "0xce6259150000000000000000000000000000000000000000000000000000000000000064"

  try {
    contract.func('100'); // string can be implicit conversion to int
  } catch (e) {
    console.log(e); // can not determine override "func(string)|func(uint256)|func(bytes)|func(int256)" with args (100)
  }

  try {
    contract.func('abc'); // string can be implicit conversion to bytes
  } catch (e) {
    console.log(e); // can not determine override "func(string)|func(bytes)" with args (abc)
  }

  try {
    contract.func('0x0123456789012345678901234567890123456789');
  } catch (e) {
    console.log(e); // can not determine override "func(string)|func(uint256)|func(address)|func(bytes)|func(int256)" with args (0x0123456789012345678901234567890123456789)
  }

  tx = contract.func(Buffer.from('abc'));
  console.log(tx.method.type); // "func(bytes)"

  tx = contract.func([61, 62, 63]);
  console.log(tx.method.type); // "func(bytes)"

  tx = contract.func(1, '100'); // override is clear in this case
  console.log(tx.method.type); // "func(uint256,string)"
  console.log(tx.method.signature); // 0x1c0138e8

  tx = contract.func({ str: '100', num: 1 }); // override is clear in this case
  console.log(tx.method.type); // "func((uint256,string))"
  console.log(tx.method.signature); // 0x9f04158f
}

/*
  user can use <Event>(...<arg>) to gen topics filter
 */
function eventOverride() {
  let filter;
  filter = contract.Event(true);
  console.log(filter.event.type); // "Event(bool)"
  console.log(filter.topics);
  /*
  [
    '0x404e952466ce335bcd5dc15385d7d4710eea42951cc4681496db72c1d5d2c464',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
  ]
   */

  try {
    contract.Event();
  } catch (e) {
    console.log(e); // can not match override "Event(bool),Event(address),Event(int256),Event(uint256),Event(bytes),Event(string),Event(uint256,string,string),Event((uint256,string),(uint256,string))" with args ()
  }

  try {
    contract.Event(null);
  } catch (e) {
    console.log(e); // can not determine override "Event(bool)|Event(address)|Event(int256)|Event(uint256)|Event(bytes)|Event(string)" with args ()
  }

  try {
    contract.Event(1);
  } catch (e) {
    console.log(e); // can not determine override "Event(int256)|Event(uint256)" with args (1)
  }

  filter = contract.Event(-1);
  console.log(filter.event.type); // "Event(int256)"
  console.log(filter.topics);
  /*
  [
    '0x091ec8db73409a58d1b5de8095b8c29f29ef7c43c6a6d9077554201b64cda010',
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  ]
   */

  filter = contract.Event(null, null);
  console.log(filter.event.type); // "Event((uint256,string),(uint256,string))"
  console.log(filter.topics);
  /*
  [
    '0x361b71fc19d19550804f10e3915dc4bdecd482b2d4660691def90f91cbfd74c0',
    null
  ]
   */

  filter = contract.Event(null, null, null);
  console.log(filter.event.type); // "Event(uint256,string,string)"
  console.log(filter.topics);
  /*
  [
    '0xfe4b40b99fc4d2ba7b64c6d861716d72fa2039aacb671b8ad45849f4e6afdfb4',
    null,
    null
  ]
   */
}

/*
 example show how to send method of this override contact
 */
async function sendManyTransaction() {
  const accountAlice = conflux.Account({ privateKey: '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393' });

  let receipt;

  receipt = await accountAlice.sendTransaction(contract.func(true)).executed();
  console.log(receipt.transactionHash); // 0x4ae0e7eb978f23298b572719205b360e45c020a4c98a15ffa2f5492b6404b1c2

  receipt = await accountAlice.sendTransaction(contract['func(uint256)'](1)).executed();
  console.log(receipt.transactionHash); // 0x61119d922a5b417c7bd04197a162b3eb6185b34362316e36923a5b392fee98d3

  receipt = await accountAlice.sendTransaction(contract['func(int256)'](1)).executed();
  console.log(receipt.transactionHash); // 0xd31c7501e5f73c3d74c655e0ec9dc70339e03b1a409e469f495dda8770f8f403

  // send a address
  receipt = await accountAlice.sendTransaction(contract['func(address)']('0x0123456789012345678901234567890123456789')).executed();
  console.log(receipt.transactionHash); // 0x0d88070c8338f8ace59b72888449d965b91c93ba67831f496821c5cdbda6e543

  // send 20 bytes Buffer
  receipt = await accountAlice.sendTransaction(contract.func(Buffer.from('0x0123456789012345678901234567890123456789'))).executed();
  console.log(receipt.transactionHash); // 0xaaeaf9be17522d9307c601dbbde09d11d4a36c557b5aeda6652446bb67f41ef8

  // send 42 chars string
  receipt = await accountAlice.sendTransaction(contract['func(string)']('0x0123456789012345678901234567890123456789')).executed();
  console.log(receipt.transactionHash); // 0x6d3d9d6471c6438d733b5fd8ca87790384831dfef792c3ccde601b774364cb0a

  receipt = await accountAlice.sendTransaction(contract.func(1, 'abc')).executed();
  console.log(receipt.transactionHash); // 0x0302df36f2bb3e21cd160d009541cc59608837f21678a0821a9efefc01c66c92

  receipt = await accountAlice.sendTransaction(contract.func({ str: 'abc', num: 1 })).executed();
  console.log(receipt.transactionHash); // 0xfc8e1753623c6e842e55d2a7a18a44eb0df80d2f80ce616cfaded0f0eb3fb249
}

/*
 for exist transaction and receipt, user could try to decode them with contract.abi
 */
async function decodeByContract() {
  const txHash = '0x4ae0e7eb978f23298b572719205b360e45c020a4c98a15ffa2f5492b6404b1c2'; // "func(bool)"
  // const txHash = '0x61119d922a5b417c7bd04197a162b3eb6185b34362316e36923a5b392fee98d3'; // "func(uint256)"
  // const txHash = '0xd31c7501e5f73c3d74c655e0ec9dc70339e03b1a409e469f495dda8770f8f403'; // "func(int256)"
  // const txHash = '0x0d88070c8338f8ace59b72888449d965b91c93ba67831f496821c5cdbda6e543'; // "func(address)"
  // const txHash = '0xaaeaf9be17522d9307c601dbbde09d11d4a36c557b5aeda6652446bb67f41ef8'; // "func(bytes)"
  // const txHash = '0x6d3d9d6471c6438d733b5fd8ca87790384831dfef792c3ccde601b774364cb0a'; // "func(string)"
  // const txHash = '0x0302df36f2bb3e21cd160d009541cc59608837f21678a0821a9efefc01c66c92'; // "func(uint256,string)"
  // const txHash = '0xfc8e1753623c6e842e55d2a7a18a44eb0df80d2f80ce616cfaded0f0eb3fb249'; // "func((uint256,string))"

  const transaction = await conflux.getTransactionByHash(txHash);
  console.log('transaction', JSON.stringify(transaction, null, 2));

  const methodArg = contract.abi.decodeData(transaction.data);
  console.log(JSON.stringify(methodArg, null, 2)); // all int/uint will transfer to JSBI instance
  /*
  {
    "name": "func",
    "fullName": "func(uint256 num)",
    "type": "func(uint256)",
    "signature": "0x7f98a45e",
    "array": [
      "1"
    ],
    "object": {
      "num": "1"
    }
  }
  */

  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log('receipt', JSON.stringify(receipt, null, 2));

  for (const log of receipt.logs) {
    const eventArg = contract.abi.decodeLog(log);
    console.log(JSON.stringify(eventArg, null, 2));
    /*
    {
      "name": "Event",
      "fullName": "Event(bool indexed boolean)",
      "type": "Event(bool)",
      "signature": "0x404e952466ce335bcd5dc15385d7d4710eea42951cc4681496db72c1d5d2c464",
      "array": [
        true
      ],
      "object": {
        "boolean": true
      }
    }
    */
  }
}

async function main() {
  showContract();
  argumentOverride();
  eventOverride();
  // await sendManyTransaction();
  await decodeByContract();
}

main().finally(() => conflux.close());
