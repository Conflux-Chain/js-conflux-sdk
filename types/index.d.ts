// import BN = require('bn.js');
// import BigNumber from 'bignumber.js';
// import Big from 'big.mjs';
// export type Hash = string;

type Big = number;
type Provider = any;
type str0num = string | number;  // string or number
type str0buf = string | Buffer;

export type CFXTAG = 'earliest' | 'latest_mined' | 'latest_state' | 'latest_checkpoint';
export type Address = string;
export type Quantity = string | number | Big;  // 0x0 | normal number | big number
export type EpochNumber = string | number | CFXTAG;

export interface ConfluxOption {
    url: string,
    defaultEpoch: string|number,  // default 'latest_state'
    defaultGasPrice: string|number,
    defaultGas: string|number,
    defaultStorageLimit: string|number,
    defaultChainId: number,
}

export class Conflux {
    constructor(options: ConfluxOption);
    provider: Provider;
    defaultEpoch: str0num;
    defaultGasPrice: str0num;
    defaultGas: str0num;
    defaultStorageLimit: str0num;
    defaultChainId: number;

    setProvider(provider: Provider): Provider;
    Account(privateKey: string): any;
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
    nonce: str0num;
    gasPrice: str0num;
    gas: str0num;
    to: string;
    value: str0num;
    storageLimit: str0num;
    epochHeight: str0num;
    chainId: str0num;
    data: str0buf;
    r: str0buf;
    s: str0buf;
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
