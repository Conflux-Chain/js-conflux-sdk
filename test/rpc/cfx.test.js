/* eslint-disable no-continue */
const { CFX } = require('@conflux-dev/jsonrpc-spec');
const { Conflux, format } = require('../../src');
const {
  TESTNET_MOCK_SERVER,
  TESTNET_NETWORK_ID,
  isHash,
  ZERO_HASH,
} = require('..');

const EXAMPLES = CFX.Examples.examples;

const cfxClient = new Conflux({
  url: TESTNET_MOCK_SERVER,
  networkId: TESTNET_NETWORK_ID,
});

test('getStatus', async () => {
  const status = await cfxClient.cfx.getStatus();
  const expectStatus = await EXAMPLES.cfx_getStatus[0].result;

  expect(Number.isInteger(status.chainId)).toEqual(true);
  expect(Number.isInteger(status.epochNumber)).toEqual(true);
  expect(Number.isInteger(status.blockNumber)).toEqual(true);
  expect(Number.isInteger(status.networkId)).toEqual(true);
  expect(Number.isInteger(status.ethereumSpaceChainId)).toEqual(true);
  expect(Number.isInteger(status.latestCheckpoint)).toEqual(true);
  expect(Number.isInteger(status.latestConfirmed)).toEqual(true);
  expect(Number.isInteger(status.latestFinalized)).toEqual(true);
  expect(Number.isInteger(status.latestState)).toEqual(true);
  expect(isHash(status.bestHash)).toEqual(true);

  expect(format.bigUIntHex(status.epochNumber)).toEqual(expectStatus.epochNumber);
});

test('getSupplyInfo', async () => {
  const supplyInfo = await cfxClient.cfx.getSupplyInfo();
  const expectSupply = EXAMPLES.cfx_getSupplyInfo[0].result;

  expect(typeof supplyInfo.totalCirculating).toEqual('bigint');
  expect(typeof supplyInfo.totalCollateral).toEqual('bigint');
  expect(typeof supplyInfo.totalEspaceTokens).toEqual('bigint');
  expect(typeof supplyInfo.totalIssued).toEqual('bigint');
  expect(typeof supplyInfo.totalStaking).toEqual('bigint');

  expect(format.bigUIntHex(supplyInfo.totalCirculating)).toEqual(expectSupply.totalCirculating);
  expect(format.bigUIntHex(supplyInfo.totalCollateral)).toEqual(expectSupply.totalCollateral);
  expect(format.bigUIntHex(supplyInfo.totalStaking)).toEqual(expectSupply.totalStaking);
});

test('getBlockByEpochNumber', async () => {
  const cases = EXAMPLES.cfx_getBlockByEpochNumber;
  const normalCases = cases.filter(c => c.error === undefined);
  // gasUsed, epochNumber, blockNumber, powQuality, posReference, size maybe is null
  for (const c of normalCases) {
    const { params, result } = c;
    const block = await cfxClient.cfx.getBlockByEpochNumber(...params);
    expect(block.hash).toEqual(result.hash);
    expect(Array.isArray(block.custom)).toEqual(true);
    expect(Array.isArray(block.transactions)).toEqual(true);
    expect(Array.isArray(block.refereeHashes)).toEqual(true);
    expect(block.deferredLogsBloomHash.length).toEqual(66);
    expect(block.deferredReceiptsRoot.length).toEqual(66);
    expect(block.deferredStateRoot.length).toEqual(66);
    expect(block.posReference === null || isHash(block.posReference)).toEqual(true);
    if (params[0] === 'latest_mined') {
      expect(block.gasUsed).toEqual(BigInt(0));
    }

    // check transaction index
    // genesis block's transaction index is null
    if (params[0] !== '0x0' && params[1] && block.transactions.length > 1) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < block.transactions.length; i++) {
        expect(block.transactions[i].index).toEqual(i);
      }
    }
  }
});

test('cfx_getBlockByHash', async () => {
  const cases = EXAMPLES.cfx_getBlockByHash;
  for (const c of cases) {
    const { params, result } = c;
    const block = await cfxClient.cfx.getBlockByHash(...params);
    if (params[0] === ZERO_HASH) {
      expect(block).toEqual(null);
      continue;
    }
    blockBasicCheck(block);
    expect(block.hash).toEqual(result.hash);
  }
});

test('cfx_getBlocksByEpoch', async () => {
  const cases = EXAMPLES.cfx_getBlocksByEpoch;
  for (const c of cases) {
    const { params, result } = c;
    const blockHashes = await cfxClient.cfx.getBlocksByEpoch(...params);
    expect(Array.isArray(blockHashes)).toEqual(true);
    expect(blockHashes.length).toEqual(result.length);
    // eslint-disable-next-line guard-for-in
    for (const i in blockHashes) {
      expect(blockHashes[i]).toEqual(result[i]);
    }
  }
});

test('cfx_getBlockByBlockNumber', async () => {
  const cases = EXAMPLES.cfx_getBlockByBlockNumber;
  const normalCases = cases.filter(c => c.error === undefined);
  for (const c of normalCases) {
    const { params, result } = c;
    const block = await cfxClient.cfx.getBlockByBlockNumber(...params);
    if (result) {
      expect(block.hash).toEqual(result.hash);
      expect(blockBasicCheck(block)).toEqual(true);
    } else {
      expect(block).toEqual(null);
    }
  }
});

function blockBasicCheck(block) {
  if (!block) return true;
  expect(Array.isArray(block.custom)).toEqual(true);
  expect(Array.isArray(block.transactions)).toEqual(true);
  expect(Array.isArray(block.refereeHashes)).toEqual(true);
  expect(block.deferredLogsBloomHash.length).toEqual(66);
  expect(block.deferredReceiptsRoot.length).toEqual(66);
  expect(block.deferredStateRoot.length).toEqual(66);
  expect(block.posReference === null || isHash(block.posReference)).toEqual(true);
  return true;
}
