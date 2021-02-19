/* eslint-disable */
const { Conflux, Transaction, format } = require('../src'); // require('js-conflux-sdk');
const { abi, bytecode } = require('./contract/miniERC20.json');

const conflux = new Conflux({ 
    url: 'http://test.confluxrpc.org/v2',
    networkId: 1,
});
const accountAlice = conflux.wallet.addPrivateKey('0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393');
const addressBob = 'cfxtest:aatm5bvugvjwdyp86ruecmhf5vmng5ysy2pehzpz9h';
const miniERC20 = conflux.Contract({ abi, bytecode }); // or `conflux.Contract({ abi, bytecode, address })` for existed contract
miniERC20.address = 'cfxtest:acf4f4b8vzpm4r8kdnnw7j43pgcg0fx3hpkze0zzeu'; // patch address from `deployContract`

function showContract() {
  console.log(miniERC20);
  /*
  {
    constructor: [Function: bound call],
    abi: ContractABICoder { * },
    address: '0x8fad845b67532204a20bd54481a819fe6d0df02e',
    allowance: [Function: bound call],
    allowed: [Function: bound call],
    approve: [Function: bound call],
    balanceOf: [Function: bound call],
    balances: [Function: bound call],
    decimals: [Function: bound call],
    name: [Function: bound call],
    symbol: [Function: bound call],
    totalSupply: [Function: bound call],
    transfer: [Function: bound call],
    transferFrom: [Function: bound call],
    Approval: [Function: bound call],
    Transfer: [Function: bound call],
    'allowance(address,address)': [Function: bound call],
    '0xdd62ed3e': [Function: bound call],
    'allowed(address,address)': [Function: bound call],
    '0x5c658165': [Function: bound call],
    'approve(address,uint256)': [Function: bound call],
    '0x095ea7b3': [Function: bound call],
    'balanceOf(address)': [Function: bound call],
    '0x70a08231': [Function: bound call],
    'balances(address)': [Function: bound call],
    '0x27e235e3': [Function: bound call],
    'decimals()': [Function: bound call],
    '0x313ce567': [Function: bound call],
    'name()': [Function: bound call],
    '0x06fdde03': [Function: bound call],
    'symbol()': [Function: bound call],
    '0x95d89b41': [Function: bound call],
    'totalSupply()': [Function: bound call],
    '0x18160ddd': [Function: bound call],
    'transfer(address,uint256)': [Function: bound call],
    '0xa9059cbb': [Function: bound call],
    'transferFrom(address,address,uint256)': [Function: bound call],
    '0x23b872dd': [Function: bound call],
    'Approval(address,address,uint256)': [Function: bound call],
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': [Function: bound call],
    'Transfer(address,address,uint256)': [Function: bound call],
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': [Function: bound call]
  }
   */
}

/*
 deploy contract with parameters
 */
async function deployContract() {
  /*
  `miniERC20.constructor` is construct method of `MiniERC20` contract,
  send constructor encoded transaction to deploy a contract,
  await till transaction `executed` to get receipt.
   */
  const receipt = await miniERC20
    .constructor('MiniERC20', 18, 'MC', 10000)
    .sendTransaction({ from: accountAlice })
    .executed();

  console.log('receipt', JSON.stringify(receipt, null, 2));
  // outcomeStatus == 0 means success, got created contract address '0x8ba2e83e8d58ad37c91ad72ea35961846b16793b'
  /*
  receipt {
    "index": 0,
    "epochNumber": 711763,
    "outcomeStatus": 0,
    "gasUsed": "1054467",
    "gasFee": "1054467000000000",
    "blockHash": "0xb70ae9034ee2393f02d9afa4c5b2624f17f78ebdc06f6ec00c9421246fde1717",
    "contractCreated": "CFXTEST:TYPE.CONTRACT:ACF4F4B8VZPM4R8KDNNW7J43PGCG0FX3HPKZE0ZZEU",
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "stateRoot": "0x27ef34b1b70e3ee86d3154086c79d9ec8e391e33ffad046f232e47826079237a",
    "to": null,
    "transactionHash": "0x0215231b0f9f108dee4fc2a7b12f32ab5e14992d59506c05f96410fe6715c1d1",
    "txExecErrorMsg": null
  }
   */
}

async function getCodeOfDeployedContract() {
  const bytecode = await conflux.getCode(miniERC20.address);
  console.log(bytecode); // "0x608060405234801561001..."
}

/*
 use `<contract instance>.<method name>(...<arguments>)` to create a `MethodTransaction`
 use await to request `cfx_call` rpc and decode returned value with abi by SDK.
 */
async function callMethod() {
  const name = await miniERC20.name(); // call view method
  console.log(name); // "MiniERC20"

  const balance = await miniERC20.balanceOf(accountAlice); // call method with parameters
  console.log(balance); // 10000
}

/*
 some times method need extra options to call with
 */
async function callMethodWithOptions() {
  try {
    await miniERC20.transfer(addressBob, 1); // virtually call a method for simulate execute
  } catch (e) {
    // error message decoded from rpc returned hex
    console.log(e); // Error: balances not enough
  }

  /*
   method required `from` option to check balance.
   set extra options with `.options({...})` to bind default value
   */
  const result = await miniERC20.transfer(addressBob, 1).call({ from: accountAlice.address });
  console.log(result); // true
}

/*
 contract method principle is encode arguments to data, and return a Transaction instance with it.
 */
function methodCreateReturnedTransaction() {
  const tx = miniERC20.transfer(addressBob, 1); // No, await !!!
  console.log(tx instanceof Transaction); // true
  console.log(tx); // bind `address` from miniERC20 contract, encode and bind `data` from arguments by abi
  /*
  MethodTransaction {
    from: undefined,
    nonce: undefined,
    gasPrice: undefined,
    gas: undefined,
    to: 'cfxtest:ach45bc5p7kwebfcbtmykarjdh9g4dtuf2xt5gdnap',
    value: undefined,
    storageLimit: undefined,
    epochHeight: undefined,
    chainId: undefined,
    data: '0xa9059cbb0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea60000000000000000000000000000000000000000000000000000000000000001',
    v: undefined,
    r: undefined,
    s: undefined
  }
  */

  const { data } = miniERC20.transfer(addressBob, 1);
  console.log(data); // use method to gen encoded data only
  // 0xa9059cbb0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea60000000000000000000000000000000000000000000000000000000000000001
}

async function sendMethodTransaction() {
  console.log(await miniERC20.balanceOf(accountAlice)); // 10000
  console.log(await miniERC20.balanceOf(addressBob)); // 0

  // Alice sign and send transaction to give 1 MiniERC20 coin (MC) to Bob
  const receipt = await miniERC20
    .transfer(addressBob, 1)
    .sendTransaction({ from: accountAlice.address })
    .executed();
  console.log('receipt', JSON.stringify(receipt, null, 2));
  /*
  receipt {
    "index": 0,
    "epochNumber": 712300,
    "outcomeStatus": 0,
    "gasUsed": "36095",
    "gasFee": "36095000000000",
    "blockHash": "0xc200d8effdaa334bd1520407c76d97f65ee262592a6cba4742a8626d631a2f90",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [
      {
        "address": "0x8ba2e83e8d58ad37c91ad72ea35961846b16793b",
        "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
          "0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6"
        ]
      }
    ],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000010000000000000080000000800000000000000200000000000020000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000800000000000000000020000000000000000000000000000000000",
    "stateRoot": "0x2e4df17d8d8acb7d227820e5bc428fd4362745037c029087f974978b8081a4d7",
    "to": "CFXTEST:TYPE.CONTRACT:ACF4F4B8VZPM4R8KDNNW7J43PGCG0FX3HPKZE0ZZEU",
    "transactionHash": "0xde4849d5d22e36706830f35f4b7c4b7cc8328547c297288d0cb761a49f378596",
    "txExecErrorMsg": null
  }
   */

  console.log(await miniERC20.balanceOf(accountAlice)); // 9999
  console.log(await miniERC20.balanceOf(addressBob)); // 1
}

/*
 user also could fill options manual, such as `nonce`,`gasPrice`,`gas`.
 but you must familiarize how to fill them,
 for example `miniERC20.transfer` will check from address, empty `from` will exit method with less gas.

 > estimate.gasUsed > estimateWithOutFrom.gasUsed

 but user should use estimate.gasUsed here
 */
async function sendMethodTransactionWithEstimate() {
  const methodTx = miniERC20.transfer(addressBob, 1);
  console.log(methodTx.constructor.name); // "MethodTransaction"
  console.log(methodTx instanceof Transaction); // true

  const estimate = await methodTx.estimateGasAndCollateral({ from: accountAlice });
  console.log(JSON.stringify(estimate, null, 2));
  /*
  {
    "gasUsed": "36095",
    "storageCollateralized": "0"
  }
   */

  const receipt = await methodTx.sendTransaction({
    from: accountAlice.address, // but `from` is unnecessary when actual send
    nonce: await conflux.getNextNonce(accountAlice),
    gas: format.big(estimate.gasUsed).times(1.1).toFixed(0), // you could multiply `gas` like this
    storageLimit: estimate.storageCollateralized,
    gasPrice: 1,
  }).executed();

  console.log('receipt', JSON.stringify(receipt, null, 2));
  /*
  receipt {
    "index": 0,
    "epochNumber": 713890,
    "outcomeStatus": 0,
    "gasUsed": "36095",
    "gasFee": "36095",
    "blockHash": "0xde7807ecd87fe88513ebb93229fc026b9048dfce7a1515e6e35928498d6d644a",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [
      {
        "address": "CFXTEST:TYPE.CONTRACT:ACF4F4B8VZPM4R8KDNNW7J43PGCG0FX3HPKZE0ZZEU",
        "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
          "0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6"
        ]
      }
    ],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000010000000000000080000000800000000000000200000000000020000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000800000000000000000020000000000000000000000000000000000",
    "stateRoot": "0x36933825d7e407dc95cb9ca997f34d039a403422e4de3431edc7bb6355e09cd6",
    "to": "CFXTEST:TYPE.CONTRACT:ACF4F4B8VZPM4R8KDNNW7J43PGCG0FX3HPKZE0ZZEU",
    "transactionHash": "0xc34af56110beb61067aa110fd7fa3b4c5ea21078564991977161d4efbe53b9fe",
    "txExecErrorMsg": null
  }
   */
}

async function signAndSendMethodTransaction() {
  const { to, data } = miniERC20.transfer(addressBob, 1);
  const estimate = await conflux.estimateGasAndCollateral({ from: accountAlice.address, to, data });
  const status = await conflux.getStatus();
  const epochNumber = await conflux.getEpochNumber();
  const gasPrice = await conflux.getGasPrice();
  const nonce = await conflux.getNextNonce(accountAlice.address);

  const transaction = new Transaction({
    nonce,
    gasPrice,
    gas: estimate.gasUsed,
    to,
    value: 0,
    storageLimit: estimate.storageCollateralized,
    epochHeight: epochNumber,
    chainId: status.chainId,
    data,
  });
  transaction.sign(accountAlice.privateKey);
  console.log(JSON.stringify(transaction, null, 2));
  /*
  {
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "nonce": "21",
    "gasPrice": "1",
    "gas": "36095",
    "to": "CFXTEST:TYPE.CONTRACT:ACH45BC5P7KWEBFCBTMYKARJDH9G4DTUF2XT5GDNAP",
    "value": 0,
    "storageLimit": "0",
    "epochHeight": 1091585,
    "chainId": 1,
    "data": "0xa9059cbb0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea60000000000000000000000000000000000000000000000000000000000000001",
    "v": 1,
    "r": "0xfbdbbb29d4d35680ca45b37c73e892eea37ee80cde8230e56bb038c8ba0b2fc1",
    "s": "0x4d6adafe191393b6bf14a7de74054920039af7308730539510be55da808ed1bf"
  }
   */

  const receipt = await conflux.sendRawTransaction(transaction.serialize()).executed();
  console.log('receipt', JSON.stringify(receipt, null, 2));
  /*
  receipt {
    "index": 0,
    "epochNumber": 1091590,
    "outcomeStatus": 0,
    "gasUsed": "36095",
    "gasFee": "36095",
    "blockHash": "0xa0ddbe02d203da002f4ad34ac9b1979e3971f4876a4b1acb29b609c2f3bbd2fa",
    "contractCreated": null,
    "from": "CFXTEST:TYPE.USER:AAR7X4R8MKRNW39GGS8RZ40J1ZNWH5MRRPUFPR2U76",
    "logs": [
      {
        "address": "CFXTEST:TYPE.CONTRACT:ACH45BC5P7KWEBFCBTMYKARJDH9G4DTUF2XT5GDNAP",
        "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b",
          "0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6"
        ]
      }
    ],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000080000000000000000000000200000000000020000000000000000000000000000000000000000000010000000000000000000010000000000000000000000000002000000000000000000000000000000000000000000800000000000000000000000800000000000000000020000000000000000000000000000000000",
    "stateRoot": "0x732dd8c11326fd3a5844905cf155fc240ac1aed5a93bab2dc5587267bc40d42f",
    "to": "CFXTEST:TYPE.CONTRACT:ACH45BC5P7KWEBFCBTMYKARJDH9G4DTUF2XT5GDNAP",
    "transactionHash": "0x3ca6b95d2150fd163a86fc7a5bc70f8f4f0a39f316c1193a19277b008678ee1f"
    "txExecErrorMsg": null
  }
   */
}

/*
 list contract logs of Transfer event
 */
async function getLogsOfTransfer() {
  const { address, topics } = miniERC20.Transfer(null, null, null); // any `_from`, any `_to`, any `_value`

  const logs = await conflux.getLogs({ address, topics, fromEpoch: 713890, toEpoch: 713890 });
  console.log(logs);
  /*
  [
    {
      epochNumber: 1084606,
      logIndex: 0,
      transactionIndex: 0,
      transactionLogIndex: 0,
      address: 'CFXTEST:TYPE.CONTRACT:ACH45BC5P7KWEBFCBTMYKARJDH9G4DTUF2XT5GDNAP',
      blockHash: '0x18c2a27de3b8254f17dc72921b670b07a494413c3dcd48a23380f3361e212563',
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000001bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        '0x0000000000000000000000001ead8630345121d19ee3604128e5dc54b36e8ea6'
      ],
      transactionHash: '0xf44a127d9263c018bcc6b2af7e9a58e8b437c84a2bbb9fd73dea7e9a8aec2d4f'
    },
    ...
  ]
   */

  for (const log of logs) {
    const eventArg = miniERC20.abi.decodeLog(log);
    console.log(eventArg);
    /*
    {
      name: 'Transfer',
      fullName: 'Transfer(address indexed _from, address indexed _to, uint256 _value)',
      type: 'Transfer(address,address,uint256)',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      array: [
        '0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        '0x1ead8630345121d19ee3604128e5dc54b36e8ea6',
        '1'
      ],
      object: {
        _from: '0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
        _to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6',
        _value: '1'
      }
    }
    */
  }
}

/*
 Warning! some example might send a transaction. please test them one by one
 */
async function main() {
  showContract();

  // await deployContract();
  // await getCodeOfDeployedContract();
  // await callMethod();
  // await callMethodWithOptions();

  // methodCreateReturnedTransaction();

  // await sendMethodTransaction();
  // await sendMethodTransactionWithEstimate();
  // await signAndSendMethodTransaction();

  // await getLogsOfTransfer();
}

main().finally(() => conflux.close());
