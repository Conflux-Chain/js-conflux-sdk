const format = require('../../util/format');
const { validAddressPrefix } = require('../../util');

format.getLogs = format({
  limit: format.bigUIntHex,
  offset: format.bigUIntHex,
  fromEpoch: format.epochNumber,
  toEpoch: format.epochNumber,
  blockHashes: format([format.blockHash]).$or(null),
  address: format.address.$or([format.address]).$or(null),
  topics: format([format.hex64.$or([format.hex64]).$or(null)]),
}, {
  pick: true,
  name: 'format.getLogs',
});

// configure getLogs formatter with networkId and toHexAddress
format.getLogsAdvance = function (networkId, toHexAddress = false, useVerboseAddress = false) {
  const fromatAddress = toHexAddress ? format.hexAddress : format.netAddress(networkId, useVerboseAddress);
  return format({
    limit: format.bigUIntHex,
    offset: format.bigUIntHex,
    fromEpoch: format.epochNumber,
    toEpoch: format.epochNumber,
    blockHashes: format([format.blockHash]).$or(null),
    address: format([fromatAddress]).$or(null),
    topics: format([format.hex64.$or([format.hex64]).$or(null)]),
  }, {
    pick: true,
    name: 'format.getLogsAdvance',
  });
};

format.transactionToAddress = format(format.hexAddress.$or(null).$default(null))
  .$after(format.hexBuffer)
  .$validate(hBuf => hBuf.length === 0 || validAddressPrefix(hBuf), 'transactionToAddress');

format.signTx = format({
  nonce: format.bigUInt.$after(format.hexBuffer),
  gasPrice: format.bigUInt.$after(format.hexBuffer),
  gas: format.bigUInt.$after(format.hexBuffer),
  to: format.transactionToAddress,
  value: format.bigUInt.$default(0).$after(format.hexBuffer),
  storageLimit: format.bigUInt.$after(format.hexBuffer),
  epochHeight: format.bigUInt.$after(format.hexBuffer),
  chainId: format.uInt.$default(0).$after(format.hexBuffer),
  data: format.hex.$default('0x').$after(format.hexBuffer),
  r: (format.bigUInt.$after(format.hexBuffer)).$or(undefined),
  s: (format.bigUInt.$after(format.hexBuffer)).$or(undefined),
  v: (format.uInt.$after(format.hexBuffer)).$or(undefined),
}, {
  strict: true,
  pick: true,
  name: 'format.signTx',
});

format.callTx = format({
  from: format.address,
  nonce: format.bigUIntHex,
  gasPrice: format.bigUIntHex,
  gas: format.bigUIntHex,
  to: format.address.$or(null),
  value: format.bigUIntHex,
  storageLimit: format.bigUIntHex,
  epochHeight: format.bigUIntHex,
  chainId: format.bigUIntHex,
  data: format.hex,
}, {
  pick: true,
  name: 'format.callTx',
});

// configure callTx formatter with networkId and toHexAddress
format.callTxAdvance = function (networkId, toHexAddress = false, useVerboseAddress = false) {
  const fromatAddress = toHexAddress ? format.hexAddress : format.netAddress(networkId, useVerboseAddress);
  return format({
    from: fromatAddress,
    nonce: format.bigUIntHex,
    gasPrice: format.bigUIntHex,
    gas: format.bigUIntHex,
    to: fromatAddress.$or(null),
    value: format.bigUIntHex,
    storageLimit: format.bigUIntHex,
    epochHeight: format.bigUIntHex,
    chainId: format.bigUIntHex,
    data: format.hex,
  }, {
    pick: true,
    name: 'format.callTxAdvance',
  });
};

// ----------------------------- parse rpc returned ---------------------------
format.status = format({
  networkId: format.uInt,
  chainId: format.uInt,
  epochNumber: format.uInt,
  blockNumber: format.uInt,
  pendingTxNumber: format.uInt,
  latestCheckpoint: format.uInt.$or(null),
  latestConfirmed: format.uInt.$or(null),
  latestFinalized: format.uInt.$or(null),
  latestState: format.uInt.$or(null),
  ethereumSpaceChainId: format.uInt.$or(null),
}, {
  name: 'format.status',
});

format.estimate = format({
  gasUsed: format.bigUInt,
  gasLimit: format.bigUInt,
  storageCollateralized: format.bigUInt,
}, {
  name: 'format.estimate',
});

format.transaction = format({
  nonce: format.bigUInt,
  gasPrice: format.bigUInt,
  gas: format.bigUInt,
  value: format.bigUInt,
  storageLimit: format.bigUInt,
  epochHeight: format.bigUInt,
  chainId: format.uInt,
  v: format.uInt,
  status: format.uInt.$or(null),
  transactionIndex: format.uInt.$or(null),
}, {
  name: 'format.transaction',
});

format.block = format({
  epochNumber: format.uInt.$or(null),
  blockNumber: format.uInt.$or(null),
  blame: format.uInt,
  height: format.uInt,
  size: format.uInt,
  timestamp: format.uInt,
  gasLimit: format.bigUInt,
  gasUsed: format.bigUInt.$or(null).$or(undefined), // XXX: undefined before main net upgrade
  difficulty: format.bigUInt,
  transactions: [(format.transaction).$or(format.transactionHash)],
}, {
  name: 'format.block',
});

format.receipt = format({
  index: format.uInt,
  epochNumber: format.uInt,
  outcomeStatus: format.uInt.$or(null),
  gasUsed: format.bigUInt,
  gasFee: format.bigUInt,
  storageCollateralized: format.bigUInt,
  storageReleased: [{
    collaterals: format.bigUInt,
  }],
}, {
  name: 'format.receipt',
});

format.epochReceipts = format([[format.receipt]]).$or(null);

format.log = format({
  epochNumber: format.uInt,
  logIndex: format.uInt,
  transactionIndex: format.uInt,
  transactionLogIndex: format.uInt,
}, {
  name: 'format.log',
});

format.logs = format([format.log]);

format.supplyInfo = format({
  totalCirculating: format.bigUInt,
  totalIssued: format.bigUInt,
  totalStaking: format.bigUInt,
  totalCollateral: format.bigUInt,
  totalEspaceTokens: format.bigUInt.$or(null),
}, {
  name: 'format.supplyInfo',
});

format.sponsorInfo = format({
  sponsorBalanceForCollateral: format.bigUInt,
  sponsorBalanceForGas: format.bigUInt,
  sponsorGasBound: format.bigUInt,
}, {
  name: 'format.sponsorInfo',
});

format.rewardInfo = format([
  {
    baseReward: format.bigUInt,
    totalReward: format.bigUInt,
    txFee: format.bigUInt,
  },
]);

format.voteList = format([
  {
    amount: format.bigUInt,
  },
]);

format.depositList = format([
  {
    amount: format.bigUInt,
    accumulatedInterestRate: format.bigUInt,
  },
]);

// ---------------------------- parse subscribe event -------------------------
format.head = format({
  difficulty: format.bigUInt,
  epochNumber: format.uInt.$or(null),
  gasLimit: format.bigUInt,
  height: format.uInt,
  timestamp: format.uInt,
}, {
  name: 'format.head',
});

format.revert = format({
  revertTo: format.uInt,
}, {
  name: 'format.revert',
});

format.epoch = format({
  epochNumber: format.uInt,
}, {
  name: 'format.epoch',
});

// --------------------------- accountPendingInfo & transactions --------------
format.accountPendingInfo = format({
  localNonce: format.bigUInt,
  pendingCount: format.bigUInt,
  pendingNonce: format.bigUInt,
}, {
  name: 'format.accountPendingInfo',
});

format.accountPendingTransactions = format({
  pendingCount: format.bigUInt,
  pendingTransactions: [format.transaction],
}, {
  name: 'format.accountPendingTransactions',
});

format.posEconomics = format({
  distributablePosInterest: format.bigUInt,
  lastDistributeBlock: format.bigUInt,
  totalPosStakingTokens: format.bigUInt,
}, {
  name: 'format.posEconomics',
});

module.exports = format;
