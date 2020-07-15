/* eslint-disable */
/*
 each `epoch` has many `block`
 each `block` has many `transaction`

 tx.blockHash => block
 block.epochNumber => epoch
 */
const JSBI = require('jsbi');
const {
  Conflux,
  util: { format, sign },
} = require('../src'); // require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
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
    "size": 0,
    "timestamp": 0,
    "gasLimit": "30000000",
    "difficulty": "0",
    "transactions": [],
    "adaptive": false,
    "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
    "deferredReceiptsRoot": "0x09f8709ea9f344a810811a373b30861568f5686e649d6177fd92ea2db7477508",
    "deferredStateRoot": "0xb0c619be7029956fe5a960d078ee7592716ecda81fe4c780691ef2e24dd944b7",
    "hash": "0x6926086503ad161f028632172745d3579c1dd33edc341b7062b8a1907b60a3fd",
    "miner": "0x1000000000000000000000000000000000000060",
    "nonce": "0x0",
    "parentHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "powQuality": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "refereeHashes": [],
    "transactionsRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  }
  */

  // genesisBlock.parentHash is not a block, but keccak of empty
  console.log(genesisBlock.parentHash === format.hex(sign.sha3(''))); // true

  const parent = await conflux.getBlockByHash(genesisBlock.parentHash);
  console.log(parent); // null
}

/*
 user send a transaction and returned txHash.
 this example show how to find some useful info by txHash.
 */
async function findInformationAboutTransaction() {
  const txHash = '0xb2ba6cca35f0af99a9601d09ee19c1949d8130312550e3f5413c520c6d828f88';

  const transaction = await conflux.getTransactionByHash(txHash);
  console.log(transaction);

  const receipt = await conflux.getTransactionReceipt(txHash);
  console.log(receipt);

  const block = await conflux.getBlockByHash(transaction.blockHash);
  console.log(block);

  console.log(block.epochNumber === receipt.epochNumber); // true
  console.log(transaction.status === receipt.outcomeStatus); // true

  // receipt.gasFee = transaction.gasPrice * receipt.gasUsed
  console.log(JSBI.equal(receipt.gasFee, JSBI.multiply(transaction.gasPrice, receipt.gasUsed))); // true
}

async function main() {
  await getGenesisBlock();
  await findInformationAboutTransaction();
}

main().finally(() => conflux.close());
