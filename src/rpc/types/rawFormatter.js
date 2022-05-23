const format = require('../../util/format');

// Reverse formatters

format.rawStatus = format({
  networkId: format.bigUIntHex,
  chainId: format.bigUIntHex,
  epochNumber: format.bigUIntHex,
  blockNumber: format.bigUIntHex,
  pendingTxNumber: format.bigUIntHex,
  latestCheckpoint: format.bigUIntHex,
  latestConfirmed: format.bigUIntHex,
  latestFinalized: format.bigUIntHex,
  latestState: format.bigUIntHex,
  ethereumSpaceChainId: format.bigUIntHex,
}, {
  name: 'format.rawStatus',
});

format.rawTransaction = format({
  nonce: format.bigUIntHex,
  gasPrice: format.bigUIntHex,
  gas: format.bigUIntHex,
  value: format.bigUIntHex,
  storageLimit: format.bigUIntHex,
  epochHeight: format.bigUIntHex,
  chainId: format.bigUIntHex,
  v: format.bigUIntHex,
  status: format.bigUIntHex.$or(null),
  transactionIndex: format.bigUIntHex.$or(null),
}, {
  name: 'format.rawTransaction',
}).$or(null);

format.rawReceipt = format({
  index: format.bigUIntHex,
  epochNumber: format.bigUIntHex,
  outcomeStatus: format.bigUIntHex.$or(null),
  gasUsed: format.bigUIntHex,
  gasFee: format.bigUIntHex,
  storageCollateralized: format.bigUIntHex,
  storageReleased: [{
    collaterals: format.bigUIntHex,
  }],
}, {
  name: 'format.rawReceipt',
}).$or(null);

format.rawLog = format({
  epochNumber: format.bigUIntHex,
  logIndex: format.bigUIntHex,
  transactionIndex: format.bigUIntHex,
  transactionLogIndex: format.bigUIntHex,
}, {
  name: 'format.rawLog',
});

format.rawLogs = format([format.rawLog]);

format.rawBlock = format({
  epochNumber: format.bigUIntHex.$or(null),
  blockNumber: format.bigUIntHex.$or(null),
  blame: format.bigUIntHex,
  height: format.bigUIntHex,
  size: format.bigUIntHex,
  timestamp: format.bigUIntHex,
  gasLimit: format.bigUIntHex,
  gasUsed: format.bigUIntHex.$or(null).$or(undefined),
  difficulty: format.bigUIntHex,
  transactions: [(format.rawTransaction).$or(format.transactionHash)],
}, {
  name: 'format.rawBlock',
}).$or(null);

format.rawSupplyInfo = format({
  totalCirculating: format.bigUIntHex,
  totalIssued: format.bigUIntHex,
  totalStaking: format.bigUIntHex,
  totalCollateral: format.bigUIntHex,
  totalEspaceTokens: format.bigUIntHex.$or(null),
}, {
  name: 'format.rawSupplyInfo',
});

format.rawSponsorInfo = format({
  sponsorBalanceForCollateral: format.bigUIntHex,
  sponsorBalanceForGas: format.bigUIntHex,
  sponsorGasBound: format.bigUIntHex,
}, {
  name: 'format.rawSponsorInfo',
});

format.rawRewardInfo = format([
  {
    baseReward: format.bigUIntHex,
    totalReward: format.bigUIntHex,
    txFee: format.bigUIntHex,
  },
]);

format.rawVoteList = format([
  {
    amount: format.bigUIntHex,
  },
]);

format.rawDepositList = format([
  {
    amount: format.bigUIntHex,
    accumulatedInterestRate: format.bigUIntHex,
  },
]);

format.rawAccount = format({
  accumulatedInterestReturn: format.bigUIntHex,
  balance: format.bigUIntHex,
  collateralForStorage: format.bigUIntHex,
  nonce: format.bigUIntHex,
  stakingBalance: format.bigUIntHex,
}, {
  name: 'format.rawAccount',
});

format.rawPosEconomics = format({
  distributablePosInterest: format.bigUIntHex,
  lastDistributeBlock: format.bigUIntHex,
  totalPosStakingTokens: format.bigUIntHex,
}, {
  name: 'format.rawPosEconomics',
});

module.exports = format;
