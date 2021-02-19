/* eslint-disable */
const { Conflux } = require('../src'); // require('js-conflux-sdk');
const { abi, bytecode } = require('./contract/override.json');

const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
});
const contract = conflux.Contract({
  abi,
  bytecode,
  address: 'CFXTEST:TYPE.CONTRACT:ACHW2F6URHT5Y0NCEC2RENBFJND5ZAVW8EBS5F9E7Z', // deployed contract address
});

function showContract() {
  console.log(contract);
  /*
  {
    abi: ContractABI { contract: [Circular *1] },
    address: '0x8b9c462016188e8cb3b897d6951589043c2d4535',
    constructor: [Function: bound call],
    func: [Function: bound call],
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
    Event: [Function: bound call],
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

async function deployOverrideContract() {
  const receipt = await contract.constructor()
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt);
}

/*
 example show how to send method of this override contact
 */
async function sendManyTransaction() {
  const accountAlice = conflux.wallet.addPrivateKey('0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393');

  let receipt;

  receipt = await contract.func(true)
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0xa8232dff88ec0df10e6d825336066242587b7a5f48489c7131348326887e55f9

  receipt = await contract['func(uint256)'](1)
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0x9da801fba71d437287b2dd16302c140ecbf2e636d7d37ad8559d93ff66e591c3

  receipt = await contract['func(int256)'](1)
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0xe4f9a381480852233c60484de88361e6840503d1a4d95054a593f9d91f5f6a9c

  // send a address
  receipt = await contract['func(address)']('0x0123456789012345678901234567890123456789')
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0x3be2243ddf821877a87a40cb9dd9727d917a420b69f36c7cffb93b3804e23cce

  // send 20 bytes Buffer
  receipt = await contract.func(Buffer.from('0x0123456789012345678901234567890123456789'))
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0x9c731012a2605083948763bf26c07804376fca4766551c1edd444c109fb9bc4a

  // send 42 chars string
  receipt = await contract['func(string)']('0x0123456789012345678901234567890123456789')
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0x781c5058b41f09a782440b2373ec03d7522840217d0401e82d3c1401cada48b9

  receipt = await contract.func(1, 'abc')
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0xf1d6df14fbb48d3ea22ef76bfb6a3f79bddd79c083717ec41152853ce8835f64

  receipt = await contract.func({ str: 'abc', num: 1 })
    .sendTransaction({ from: accountAlice })
    .executed();
  console.log(receipt.transactionHash); // 0x03384c844ecc14fb8a667b3e7e244a122cafd35d6c3d76c1228406075e19eefa
}

/*
 for exist transaction and receipt, user could try to decode them with contract.abi
 */
async function decodeByContract() {
  const txHash = '0xa8232dff88ec0df10e6d825336066242587b7a5f48489c7131348326887e55f9'; // "func(bool)"
  // const txHash = '0x9da801fba71d437287b2dd16302c140ecbf2e636d7d37ad8559d93ff66e591c3'; // "func(uint256)"
  // const txHash = '0xe1862521c322b8422a0f4c2edf82af71e9d46dee0046719f4fbc35888cdd9ceb'; // "func(int256)"
  // const txHash = '0x2f90d4bec009708d9389a57fb6e2cffbe8937f8e9280db0b715cc619ae12d461'; // "func(address)"
  // const txHash = '0x9c731012a2605083948763bf26c07804376fca4766551c1edd444c109fb9bc4a'; // "func(bytes)"
  // const txHash = '0x781c5058b41f09a782440b2373ec03d7522840217d0401e82d3c1401cada48b9'; // "func(string)"
  // const txHash = '0xf1d6df14fbb48d3ea22ef76bfb6a3f79bddd79c083717ec41152853ce8835f64'; // "func(uint256,string)"
  // const txHash = '0x03384c844ecc14fb8a667b3e7e244a122cafd35d6c3d76c1228406075e19eefa'; // "func((uint256,string))"

  const transaction = await conflux.getTransactionByHash(txHash);
  // console.log('transaction', JSON.stringify(transaction, null, 2));

  const methodArg = contract.abi.decodeData(transaction.data);
  console.log(JSON.stringify(methodArg, null, 2));
  /*
  {
    "name": "func",
    "fullName": "func(bool boolean)",
    "type": "func(bool)",
    "signature": "0x4f6db4e2",
    "array": [
      true
    ],
    "object": {
      "boolean": true
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
  // await deployOverrideContract();
  // await sendManyTransaction();
  await decodeByContract();
}

main().finally(() => conflux.close());
