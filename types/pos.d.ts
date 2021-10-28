import { Hash } from './index';

export interface PosStatus {
  epoch:  number;
  latestCommitted: number;
  latestVoted?: number;
  pivotDecision: number;
}

export interface Signature {
  account: string;
  votes: number;
}

export interface PosBlock {
  hash: Hash;
  height: number;
  epoch: number;
  round: number;
  nextTxNumber: number;
  miner?: Hash;
  parentHash?: Hash;
  timestamp: number;
  pivotDecision?: number;
  signatures: Signature[];
}

export interface PosTransaction {
  hash: Hash;
  from: string;
  blockHash?: Hash;
  blockNumber?: number;
  timestamp?: number;
  number: number;
  payload?: object;
  status?: string;
  type: string;
}

export interface VotePowerState {
  endBlockNumber: number;
  power: number;
}

export interface AccountNodeLockStatus {
  inQueue: VotePowerState[];
  locked: number;
  outQueue: VotePowerState[];
  unlocked: number;
  availableVotes: number;
  forceRetired?: number;
  forfeited: number;
}

export interface PosReward {
  posAddress: string;
  powAddress: string;
  reward: number;
}

export interface EpochRewards {
  powEpochHash: Hash;
  accountRewards: PosReward[];
}

export interface PosAccount {
  address: string;
  blockNumber: number;
  status: AccountNodeLockStatus;
}

export interface CommitteeNode {
  address: string;
  votingPower: number;
}

export interface CurrentCommittee {
  epochNumber: number;
  nodes: CommitteeNode[];
  quorumVotingPower: number;
  totalVotingPower: number;
}

export interface CurrentElection {
  isFinalized: boolean;
  startBlockNumber: number;
  topElectingNodes: CommitteeNode[];
}

export interface PosCommittee {
  currentCommittee: CurrentCommittee;
  elections: CurrentElection[];
}

export class PoSRPC {
  getStatus(): Promise<PosStatus>;

  getCommittee(blockNumber?: number): Promise<PosCommittee>;

  getAccount(address: string, blockNumber?: number): Promise<PosAccount | null>;

  getRewardsByEpoch(epoch: number): Promise<EpochRewards>;

  getBlockByNumber(blockNumber: number): Promise<PosBlock | null>;

  getBlockByHash(hash: string): Promise<PosBlock | null>;

  getTransactionByNumber(txNumber: number): Promise<PosTransaction | null>;
}