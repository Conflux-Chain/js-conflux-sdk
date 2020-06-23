// import Big from 'big.mjs';
// export type Hash = string;

type Big = number;
type Provider = any;
type stringOrNumber = string | number;
type stringOrBuffer = string | Buffer;

export type CFXTAG = 'earliest' | 'latest_mined' | 'latest_state' | 'latest_checkpoint';
export type Address = string;
export type Quantity = string | number | Big;  // 0x0 | normal number | big number
export type EpochNumber = string | number | CFXTAG;

export interface ConfluxOption {
    url: string,
    defaultEpoch: stringOrNumber,  // default 'latest_state'
    defaultGasPrice: stringOrNumber,
    defaultGas: stringOrNumber,
    defaultStorageLimit: stringOrNumber,
    defaultChainId: number,
}

export class Conflux {
    constructor(options: ConfluxOption);
    provider: Provider;
    defaultEpoch: stringOrNumber;
    defaultGasPrice: stringOrNumber;
    defaultGas: stringOrNumber;
    defaultStorageLimit: stringOrNumber;
    defaultChainId: number;

    setProvider(provider: Provider): Provider;
    Account(string: string): any;
    Contract(options: any): any;
    close():any;

    getStatus(): Promise<any>;
    getGasPrice(): string;
    getEpochNumber(epochNumber: EpochNumber): EpochNumber;
    getLogs(options: any): any;
    getBalance(address: string, epochNumber: EpochNumber): string;
    getNextNonce(): Promise<number>;
    getConfirmationRiskByHash():Promise<number|null>;
    getBlockByEpochNumber(): Promise<object|null>;
    getBlocksByEpochNumber(): Promise<string[]>;
    getBestBlockHash(): string;
    getBlockByHash(): Promise<object|null>;
    getBlockByHashWithPivotAssumption(): any;
    getTransactionByHash(): Promise<object|null>;
    getTransactionReceipt(): Promise<object|null>;
    sendTransaction(): any;
    sendRawTransaction(): any;
    getCode(): Promise<string>;
    call(): Promise<string>;
    estimateGasAndCollateral(options: any): Promise<object>;
}

export class Account {
    constructor(privateKey: string);
    privateKey: any;
    publicKey: any;
    address: any;

    static random: (entropy: any) => Account;
    static decrypt: (password: string, info: any) => Account;

    encrypt(password: string): any;
    signTransaction(options: any): any;
    signMessage(message: string): any;
    toString(): string;
}

export class Message {
    constructor(message: string);

    static sign: (privateKey: any, messageHash: any) => string;
    static recover: (signature: any, messageHash: any) => any;

    sign(privateKey: any): Message;
    // TODO get: from, r, s, v, hash
}

export interface TransactionOption {
    nonce: stringOrNumber;
    gasPrice: stringOrNumber;
    gas: stringOrNumber;
    to: string;
    value: stringOrNumber;
    storageLimit: stringOrNumber;
    epochHeight: stringOrNumber;
    chainId: stringOrNumber;
    data: stringOrBuffer;
    r: stringOrBuffer;
    s: stringOrBuffer;
    v: number;
}

export class Transaction {
    constructor(options: any);

    sign(privateKey: string): Transaction;
    recover(): string;
    encode(includeSignature: boolean): Buffer;
    serialize(): string;
    // TODO get: hash, from
}

export class BaseProvider {
    constructor(url: string, options: any);
    url: string;
    timeout: number;
    logger: any;

    requestId(): string;
    call(): any;
    close(): any;
}

export class HttpProvider {
    constructor(url: string, options: any);
    call(method: string, ...params: any[]): any; // params can be multiple
}

export interface ContractOption {
    abi: [];
    address: string;
    bytecode: string;
}

export class Contract {
    constructor(cfx: Conflux, options: ContractOption);
    abi: any;
    address: string;
}
