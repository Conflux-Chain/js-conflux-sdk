import {EpochNumber, Address, Quantity} from "./index";

export interface BlockHeader {
    adaptive: boolean;
    blame: number;
    deferredLogsBloomHash: string;
    deferredReceiptsRoot: string;
    deferredStateRoot: string;
    difficulty: number;
    epochNumber: EpochNumber | null;
    gasLimit: number;
    hash: string | null;
    height: number | null;
    miner: Address;
    nonce: string | null;
    parentHash: string;
    powQuality: string | null;
    refereeHashes: string[];
    size: number;
    timestamp: number;
    transactionsRoot: string;
    gasUsed: string;
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
    blockHash: string | null;
    contractCreated: string | null;
    data: string;
    from: Address;
    gas: number;
    gasPrice: number;
    hash: string;
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
    sponsorForCollateral: string;
    sponsorForGas: string;
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
    blockHashes: string[];
    address: string[];
    topics: string[];
    limit: number;
}

export interface CfxLog {
    address: Address;
    topics: string[];
    data: string;
    blockHash: string;
    epochNumber: EpochNumber;
    transactionHash: string;
    transactionIndex: number;
    logIndex: number;
    transactionLogIndex: number;
}

export interface TransactionReceipt {
    transactionHash: string;
    index: number;
    blockHash: string;
    epochNumber: EpochNumber;
    from: Address;
    to: Address | null;
    gasUsed: string;
    contractCreated: string | null;
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
    codeHash: number;
    stakingBalance: Quantity;
    collateralForStorage: number;
    accumulatedInterestReturn: number;
    admin: Address;
    address: Address;
}
