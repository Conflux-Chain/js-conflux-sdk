/* eslint-disable */
/*
 each `epoch` has many `block`
 each `block` has many `transaction`

 tx.blockHash => block
 block.epochNumber => epoch
 */
const JSBI = require('jsbi');
const { Conflux, sign, format } = require('../src'); // require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'http://test.confluxrpc.org/v2',
  networkId: 1,
});

async function getGenesisBlock() {
  const genesisBlock = await conflux.getBlockByEpochNumber(0);

  console.log('genesisBlock', JSON.stringify(genesisBlock, null, 2));
  // as you see, genesisBlock.timestamp === 0
  /*
  genesisBlock {
    "epochNumber": 0,
    "blame": 0,
    "height": 0,
    "size": 108,
    "timestamp": 0,
    "gasLimit": "30000000",
    "gasUsed": null,
    "difficulty": "0",
    "transactions": [
      "0x952535c89db77abac5006cc3a5020e9c1da9a23f616e0293e94a3fa380a5d9be"
    ],
    "adaptive": false,
    "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
    "deferredReceiptsRoot": "0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508",
    "deferredStateRoot": "0x867d0d102ed7eb638e25ab718c4ac4ba3d7fa0d87748382d9580b25f608dc80a",
    "hash": "0x2cfd947cd88b0876a0c7e696698188f8ea3b82dcdc239e32255e6f046045f595",
    "miner": "CFXTEST:TYPE.USER:AAJAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAV2WGH9U7",
    "nonce": "0x0",
    "parentHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "powQuality": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "refereeHashes": [],
    "transactionsRoot": "0x835cd391da58faedec5486f31c3392ed21386b3926d3ac5301c4c8af5cf8e27f"
  }
  */

  // genesisBlock.parentHash is not a block, but keccak of empty
  console.log(genesisBlock.parentHash === format.hex(sign.keccak256(''))); // true

  const parent = await conflux.getBlockByHash(genesisBlock.parentHash);
  console.log(parent); // null
}

/*
 user send a transaction and returned txHash.
 this example show how to find some useful info by txHash.
 */
async function findInformationAboutTransaction() {
  const txHash = '0x288243d348cf4ab60ed87b20a0442eea8672feb452a1522f6ccaeea3df1a545d';

  const transaction = await conflux.getTransactionByHash(txHash);
  console.log(transaction);

  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log(receipt);

  const block = await conflux.getBlockByHash(transaction.blockHash);
  console.log(block);

  console.log(block.epochNumber === receipt.epochNumber); // true
  console.log(transaction.status === receipt.outcomeStatus); // true
}

async function main() {
  await getGenesisBlock();
  await findInformationAboutTransaction();
}

main().finally(() => conflux.close());
