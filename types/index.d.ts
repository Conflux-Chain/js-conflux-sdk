export * from './rpc';
export * from './pos';
import { PoSRPC } from './pos';
import { BatchRequester } from './rpcBatchRequester';
import {
  Block,
  Transaction as RpcTransaction,
  Account as RpcAccount,
  TransactionReceipt,
  Status,
  AccountPendingInfo,
  AccountPendingTransactions,
  RewardInfo,
  SponsorInfo,
  StorageRoot,
  CheckBalanceResult,
  EstimateResultAdvance,
  EstimateResult,
  CfxLog,
  SupplyInfo,
  PoSEconomics,
  VoteInfo,
  DepositInfo,
  TransactionTrace,
} from './rpc';

export type JSBI = BigInt;
export type EPOCH_LABEL = 'latest_mined' | 'latest_state' | 'latest_checkpoint' | 'latest_confirmed' | 'earliest';
export type EpochNumber = number | EPOCH_LABEL;
export type Address = string;
export type Hash = string;
export type Quantity = string | number | JSBI;

// ============================================================================
interface ConfluxOption {
  url: string,
  timeout?: number,
  networkId?: number,
  logger?: object,
  defaultGasPrice?: number,
  defaultGasRatio?: number,
  defaultStorageRatio?: number,
}

export class Conflux {
  constructor(options: ConfluxOption);

  provider: Provider;
  wallet: Wallet;

  defaultGasPrice: number;
  defaultGasRatio: number;
  defaultStorageRatio: number;

  pos: PoSRPC;

  static create(options: ConfluxOption): Conflux;

  Contract(options: ContractOption): Contract;

  InternalContract(name: string): Contract;

  CRC20(address: Address): Contract;

  BatchRequest(): BatchRequester;

  close(): void;

  updateNetworkId(): Promise<void>;

  // --------------------------------------------------------------------------
  getClientVersion(): Promise<string>;

  getStatus(): Promise<Status>;

  getGasPrice(): Promise<JSBI>;

  getInterestRate(epochNumber?: EpochNumber): Promise<JSBI>;

  getAccumulateInterestRate(epochNumber?: EpochNumber): Promise<JSBI>;

  // ------------------------------- address ----------------------------------
  getAccount(address: Address, epochNumber?: EpochNumber): Promise<RpcAccount>

  getBalance(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getStakingBalance(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getNextNonce(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getAdmin(address: Address, epochNumber?: EpochNumber): Promise<Address>;

  getAccountPendingInfo(address: Address): Promise<AccountPendingInfo>;

  getAccountPendingTransactions(address: Address): Promise<AccountPendingTransactions>;

  // -------------------------------- epoch -----------------------------------
  getEpochNumber(epochNumber?: EpochNumber): Promise<number>;

  getBlockByEpochNumber(epochNumber: EpochNumber, detail?: boolean): Promise<Block | null>;

  getBlockByBlockNumber(blockNumber: number, detail?: boolean): Promise<Block | null>;

  getBlockByHashWithPivotAssumption(blockHash: Hash, pivotBlockHash: Hash, epochNumber: EpochNumber): Promise<Block | null>;

  getBlocksByEpochNumber(epochNumber: EpochNumber): Promise<Hash[]>;

  getBlockRewardInfo(epochNumber: EpochNumber): Promise<RewardInfo[]>;

  // -------------------------------- block -----------------------------------
  getBestBlockHash(): Promise<Hash>;

  getBlockByHash(blockHash: Hash, detail?: boolean): Promise<Block | null>;

  getConfirmationRiskByHash(blockHash: Hash): Promise<number | null>;

  // ----------------------------- transaction --------------------------------
  getTransactionByHash(transactionHash: Hash): Promise<RpcTransaction | null>;

  getTransactionReceipt(transactionHash: Hash): Promise<TransactionReceipt | null>;

  sendRawTransaction(hex: string): Promise<Hash>

  sendTransaction(transaction: object, password?: string): Promise<Hash>

  // ------------------------------ contract ----------------------------------
  getCode(address: Address, epochNumber?: EpochNumber): Promise<string>;

  getStorageAt(address: Address, position: number, epochNumber?: EpochNumber): Promise<string | null>

  getStorageRoot(address: Address, epochNumber?: EpochNumber): Promise<StorageRoot>;

  getSponsorInfo(address: Address, epochNumber?: EpochNumber): Promise<SponsorInfo>;

  getCollateralForStorage(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  call(transaction: object, epochNumber?: EpochNumber): Promise<string>;

  estimateGasAndCollateral(transaction: object, epochNumber?: EpochNumber): Promise<EstimateResult>;

  estimateGasAndCollateralAdvance(transaction: object, epochNumber?: EpochNumber): Promise<EstimateResultAdvance>;

  checkBalanceAgainstTransaction(from: Address, to: Address, gas: number, gasPrice: number, storageLimit: number, epochNumber: EpochNumber): Promise<CheckBalanceResult>;

  getLogs(options: object): Promise<CfxLog[]>;

  getDepositList(address: Address, epochNumber?: EpochNumber): Promise<DepositInfo[]>;

  getVoteList(address: Address, epochNumber?: EpochNumber): Promise<VoteInfo[]>;

  getSupplyInfo(epochNumber: EpochNumber): Promise<SupplyInfo>;

  getPoSEconomics(): Promise<PoSEconomics>;

  // ----------------------------- debug -------------------------------
  getEpochReceipts(epochNumber: EpochNumber): Promise<TransactionReceipt[][]>;

  getEpochReceiptsByPivotBlockHash(pivotBlockHash: Hash): Promise<TransactionReceipt[][]>

  // ----------------------------- trace -------------------------------
  traceBlock(blockHash: Hash): Promise<object[]>;

  traceTransaction(txHash: Hash): Promise<TransactionTrace[]>;

  traceFilter(options: object): Promise<TransactionTrace[]>;

  // ----------------------------- subscription -------------------------------
  subscribe(name: string, ...args: any[]): Promise<string>

  unsubscribe(id: string): Promise<boolean>

  subscribeEpochs(): Promise<object>

  subscribeNewHeads(): Promise<object>

  subscribeLogs(options?: object): Promise<object>
}

// ============================================================================
interface ProviderOptions {
  url: string;
  timeout?: number;
  logger?: object;
  retry?: number,
  keepAlive?: boolean;
}

export class Provider {
  constructor(options: ProviderOptions);

  requestId(): string;

  call(method: string, ...params: any[]): Promise<object>

  batch(array: object[]): Promise<(object | Error)[]>
}

export function providerFactory(options: ProviderOptions): Provider

// ============================================================================
interface TransactionOption {
  from: Address;
  nonce?: JSBI;
  gasPrice?: JSBI;
  gas?: JSBI;
  to?: Address | null;
  value?: JSBI;
  storageLimit?: JSBI;
  epochHeight?: number;
  chainId?: number;
  data?: Buffer | string;
  r?: Buffer | string;
  s?: Buffer | string;
  v?: number;
}

export class Transaction {
  constructor(options: TransactionOption);

  get hash(): string;

  sign(privateKey: string, networkId: number): Transaction;

  recover(): string;

  encode(includeSignature: boolean): Buffer;

  serialize(): string;
}

// ============================================================================
export class Account {
  signTransaction(transaction: object): Promise<Transaction>

  signMessage(transaction: object): Promise<object>

  toString(): Address
}

export class Wallet extends Map {
  constructor(networkId: number);

  addPrivateKey(privateKey: string): Account;

  addRandom(entropy?: string): Account;

  addKeystore(keystore: object, password: string): Account;
}

export interface ContractOption {
  address?: Address;
  abi?: object[];
  bytecode?: string;
}

export class Contract {
  constructor(cfx: Conflux, options: ContractOption);

  abi: any;
  address: Address;
}

export class Drip {
  constructor(value: number);

  static fromCFX(value: string): Drip;

  static fromGDrip(value: string): Drip;

  toCFX(): string;

  toGDrip(): string;
}

export class Message {
  static sign(privateKey: string, messageHash: string): string;

  static recover(signature: string, messageHash: string): string;

  constructor(message: string);

  get hash(): string;

  get from(): string;

  get r(): string;

  get s(): string;

  get v(): number;

  sign(privateKey: string, networkId: number): Message;
}

export class PrivateKeyAccount {
  static random(entropy: Buffer, networkId: number): PrivateKeyAccount;

  static decrypt(keystore: object, password: string, networkId: number): PrivateKeyAccount;

  constructor(privateKey: string, networkId: number);

  encrypt(password: string): object;

  signTransaction(options: object): Transaction;

  signMessage(options: object): Message;
}

export declare let sign: object;

export declare let address: object;  // address utilities

export declare let format: any;

export declare let providerWrapper: any;