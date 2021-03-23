type JSBI = BigInt;
type EPOCH_LABEL = 'latest_mined' | 'latest_state' | 'latest_checkpoint' | 'latest_confirmed' | 'earliest';
type EpochNumber = number | EPOCH_LABEL;
type Address = string;
type Hash = string;
type Quantity = string | number | JSBI;

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

  static create(options: ConfluxOption): Conflux;

  Contract(options: ContractOption): object;

  InternalContract(name: string): object;

  close(): void;

  updateNetworkId(): Promise<void>;

  // --------------------------------------------------------------------------
  getClientVersion(): Promise<string>;

  getStatus(): Promise<object>;

  getGasPrice(): Promise<JSBI>;

  getInterestRate(epochNumber?: EpochNumber): Promise<JSBI>;

  getAccumulateInterestRate(epochNumber?: EpochNumber): Promise<JSBI>;

  // ------------------------------- address ----------------------------------
  getAccount(address: Address, epochNumber?: EpochNumber): Promise<object>

  getBalance(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getStakingBalance(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getNextNonce(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  getAdmin(address: Address, epochNumber?: EpochNumber): Promise<string>;

  // -------------------------------- epoch -----------------------------------
  getEpochNumber(epochNumber?: EpochNumber): Promise<number>;

  getBlockByEpochNumber(epochNumber: EpochNumber, detail?: boolean): Promise<object | null>;

  getBlocksByEpochNumber(epochNumber: EpochNumber): Promise<string[]>;

  getBlockRewardInfo(epochNumber: EpochNumber): Promise<object[]>;

  // -------------------------------- block -----------------------------------
  getBestBlockHash(): Promise<string>;

  getBlockByHash(blockHash: Hash, detail?: boolean): Promise<object>;

  getConfirmationRiskByHash(blockHash: Hash): Promise<number | null>;

  // ----------------------------- transaction --------------------------------
  getTransactionByHash(transactionHash: Hash): Promise<object | null>;

  getTransactionReceipt(transactionHash: Hash): Promise<object | null>;

  sendRawTransaction(hex: string): Promise<Hash>

  sendTransaction(transaction: object, password?: string): Promise<Hash>

  // ------------------------------ contract ----------------------------------
  getCode(address: Address, epochNumber?: EpochNumber): Promise<string>;

  getStorageAt(address: Address, position: number, epochNumber?: EpochNumber): Promise<string | null>

  getStorageRoot(address: Address, epochNumber?: EpochNumber): Promise<object>;

  getSponsorInfo(address: Address, epochNumber?: EpochNumber): Promise<object>;

  getCollateralForStorage(address: Address, epochNumber?: EpochNumber): Promise<JSBI>;

  call(transaction: object, epochNumber?: EpochNumber): Promise<string>;

  estimateGasAndCollateral(transaction: object, epochNumber?: EpochNumber): Promise<object>;

  getLogs(options: object): Promise<object[]>;

  traceBlock(blockHash: string): Promise<object[]>;

  getDepositList(address: string, epochNumber?: EpochNumber): Promise<object[]>;

  getVoteList(address: string, epochNumber?: EpochNumber): Promise<object[]>;

  getSupplyInfo(epochNumber: EpochNumber): Promise<object>;

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

  sign(privateKey: string): Transaction;

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