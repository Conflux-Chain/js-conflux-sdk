const { CFX } = require('@conflux-dev/jsonrpc-spec');
const { Conflux } = require('../../src');
const rawFormatter = require('../../src/rpc/types/rawFormatter');

const {
  TESTNET_MOCK_SERVER,
  TESTNET_NETWORK_ID,
} = require('..');

const EXAMPLES = CFX.Examples.examples;

const cfxClient = new Conflux({
  url: TESTNET_MOCK_SERVER,
  networkId: TESTNET_NETWORK_ID,
  useVerboseAddress: true,
});

const rawFormatters = {
  'cfx_getStatus': rawFormatter.rawStatus,
  'cfx_getBlockByEpochNumber': rawFormatter.rawBlock,
  'cfx_getBlockByBlockNumber': rawFormatter.rawBlock,
  'cfx_getBlockByHash': rawFormatter.rawBlock,
  'cfx_getLogs': rawFormatter.rawLogs,
  'cfx_getTransactionByHash': rawFormatter.rawTransaction,
  'cfx_getTransactionReceipt': rawFormatter.rawReceipt,
  'cfx_gasPrice': rawFormatter.bigUIntHex,
  'cfx_getBalance': rawFormatter.bigUIntHex,
  'cfx_getStakingBalance': rawFormatter.bigUIntHex,
  'cfx_getCollateralForStorage': rawFormatter.bigUIntHex,
  'cfx_getNextNonce': rawFormatter.bigUIntHex,
  'cfx_epochNumber': rawFormatter.bigUIntHex,
  'cfx_clientVersion': rawFormatter.any,
  'cfx_getBestBlockHash': rawFormatter.any,
  'cfx_getAdmin': rawFormatter.any,
  'cfx_getCode': rawFormatter.any,
  'cfx_getStorageRoot': rawFormatter.any,
  'cfx_getBlocksByEpoch': rawFormatter.any,
  'cfx_getInterestRate': rawFormatter.bigUIntHex,
  'cfx_getAccumulateInterestRate': rawFormatter.bigUIntHex,
  'cfx_getSupplyInfo': rawFormatter.rawSupplyInfo,
  'cfx_getDepositList': rawFormatter.rawDepositList,
  'cfx_getVoteList': rawFormatter.rawVoteList,
  'cfx_getBlockRewardInfo': rawFormatter.rawRewardInfo,
  'cfx_getSponsorInfo': rawFormatter.rawSponsorInfo,
  'cfx_getAccount': rawFormatter.rawAccount,
  'cfx_getPoSEconomics': rawFormatter.rawPosEconomics,
};

test('GeneralRPCTest', async () => {
  // eslint-disable-next-line guard-for-in
  for (const key in rawFormatters) {
    const method = key.slice(4);
    const cases = EXAMPLES[key];
    for (const testCase of cases) {
      // eslint-disable-next-line no-continue
      if (testCase.error) continue;
      const result = await cfxClient.cfx[method](...testCase.params);
      expect(rawFormatters[key](result)).toEqual(testCase.result);
    }
  }
});
