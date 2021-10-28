import {EpochNumber, Address, Quantity, Hash} from "./index";

export interface BlockHeader {
    adaptive: boolean;
    blame: number;
    deferredLogsBloomHash: string;
    deferredReceiptsRoot: string;
    deferredStateRoot: string;
    difficulty: number;
    epochNumber: EpochNumber | null;
    blockNumber: number | null;
    gasLimit: number;
    hash: Hash | null;
    height: number | null;
    miner: Address;
    nonce: string | null;
    parentHash: Hash;
    powQuality: string | null;
    refereeHashes: Hash[];
    size: number;
    timestamp: number;
    transactionsRoot: string;
    gasUsed: string;
    posReference: string;
}

export interface Block extends BlockHeader {
    transactions: string[] | Transaction[];
}

// transaction config
export interface TransactionConfig {
    from: Address;
    to: Address;
    value: Quantity;
    nonce?: number;
    gasPrice?: number;
    gas?: number;
    storageLimit?: number;
    epochHeight?: number;
    data?: string;
    chainId?: number;
}

export interface Transaction {
    blockHash: Hash | null;
    contractCreated: string | null;
    data: string;
    from: Address;
    gas: number;
    gasPrice: number;
    hash: Hash;
    nonce: number;
    r: string;
    s: string;
    status: number | null;
    to: Address | null;
    transactionIndex: number | null;
    v: number;
    value: Quantity;
}

export interface StorageRoot {
    delta: string;
    intermediate: string;
    snapshot: string;
}

export interface SponsorInfo {
    sponsorBalanceForCollateral: number;
    sponsorBalanceForGas: number;
    sponsorGasBound: number;
    sponsorForCollateral: Address;
    sponsorForGas: Address;
}

export interface CfxCallConfig {
    from: Address;
    to: Address;
    gasPrice: number;
    gas: number;
    value: Quantity;
    data: string;
    nonce: number;
}

export interface CfxLogConfig{
    fromEpoch: EpochNumber;
    toEpoch: EpochNumber;
    blockHashes: Hash[];
    address: string[];
    topics: string[];
    limit: number;
}

export interface CfxLog {
    address: Address;
    topics: string[];
    data: string;
    blockHash: Hash;
    epochNumber: EpochNumber;
    transactionHash: Hash;
    transactionIndex: number;
    logIndex: number;
    transactionLogIndex: number;
}

export interface TransactionReceipt {
    transactionHash: Hash;
    index: number;
    blockHash: Hash;
    epochNumber: EpochNumber;
    from: Address;
    to: Address | null;
    gasUsed: string;
    contractCreated: Address | null;
    stateRoot: string;
    outcomeStatus: number;
    logsBloom: string;
    logs: CfxLog[];
    storageCollateralized: string;
    storageReleased: Object[];
    txExecErrorMsg: string;
    gasCoveredBySponsor: boolean;
    storageCoveredBySponsor: boolean;
}

export interface Account {
    balance: Quantity;
    nonce: number;
    codeHash: Hash;
    stakingBalance: Quantity;
    collateralForStorage: number;
    accumulatedInterestReturn: number;
    admin: Address;
    address: Address;
}

export interface Status {
    bestHash: Hash;
    blockNumber: number;
    chainId: number;
    networkId: number;
    epochNumber: EpochNumber;
    latestCheckpoint: EpochNumber;
    latestConfirmed: EpochNumber;
    latestState: EpochNumber;
    pendingTxNumber: number;
}

export interface AccountPendingInfo {
  localNonce: number;
  pendingNonce: number;
  pendingCount: number;
  nextPendingTx: number;
}

export interface AccountPendingTransactions {
  firstTxStatus: object;
  pendingCount: number;
  pendingTransactions: Transaction[];
}

export interface RewardInfo {
  blockHash: Hash;
  author: Address;
  totalReward: number;
  baseReward: number;
  txFee: number;
}

export interface StorageRoot {
  delta: string;
  intermediate: string;
  snapshot: string
}

export interface EstimateResult {
  gasLimit: number;
  gasUsed: number;
  storageCollateralized: number;
}

export interface EstimateResultAdvance {
  gasLimit: number;
  gasUsed: number;
  storageCollateralized: number;
  isBalanceEnough: boolean;
  willPayCollateral: boolean;
  willPayTxFee: boolean;
  isBalanceEnoughForValueAndFee: boolean;
}

export interface CheckBalanceResult {
  isBalanceEnough: boolean;
  willPayCollateral: boolean;
  willPayTxFee: boolean;
}

export interface SupplyInfo {
  totalIssued: number;
  totalCollateral: number;
  totalStaking: number;
  totalCirculating: number;
}

export interface PoSEconomics {
  distributablePosInterest: number;
  lastDistributeBlock: number;
  totalPosStakingTokens: number;
}

export interface DepositInfo {
  accumulatedInterestRate: number;
  amount: number;
  depositTime: number;
}

export interface VoteInfo {
  amount: number;
  unlockBlockNumber: number;
}

export interface TransactionTrace {
  action: object;
  blockHash: Hash;
  epochHash: Hash;
  epochNumber: number;
  transactionHash: Hash;
  transactionPosition: number;
  type: string;
}