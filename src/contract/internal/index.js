const AdminControl = {
  abi: [
    'function getAdmin(address contractAddr) public view returns (address)',
    'function setAdmin(address contractAddr, address newAdmin)',
    'function destroy(address contractAddr)',
  ],
  address: '0x0888000000000000000000000000000000000000',
};

const SponsorWhitelistControl = {
  abi: [
    'function getSponsorForGas(address contractAddr) public view returns (address)',
    'function getSponsoredBalanceForGas(address contractAddr) public view returns (uint256)',
    'function getSponsoredGasFeeUpperBound(address contractAddr) public view returns (uint256)',
    'function getSponsorForCollateral(address contractAddr) public view returns (address)',
    'function getSponsoredBalanceForCollateral(address contractAddr) public view returns (uint256)',
    'function isWhitelisted(address contractAddr, address user) public view returns (bool)',
    'function isAllWhitelisted(address contractAddr) public view returns (bool)',
    'function addPrivilegeByAdmin(address contractAddr, address[] memory addresses)',
    'function removePrivilegeByAdmin(address contractAddr, address[] memory addresses)',
    'function setSponsorForGas(address contractAddr, uint upperBound)',
    'function setSponsorForCollateral(address contractAddr)',
    // 'function addPrivilege(address[] memory)',
    // 'function removePrivilege(address[] memory)',
  ],
  address: '0x0888000000000000000000000000000000000001',
};

const Staking = {
  abi: [
    'function getStakingBalance(address user) public view returns (uint256)',
    'function getLockedStakingBalance(address user, uint256 blockNumber) public view returns (uint256)',
    'function getVotePower(address user, uint256 blockNumber) public view returns (uint256)',
    'function deposit(uint256 amount)',
    'function withdraw(uint256 amount)',
    'function voteLock(uint256 amount, uint256 unlockBlockNumber)',
  ],
  address: '0x0888000000000000000000000000000000000002',
};

/* const ConfluxContext = {
  abi: [
    'function epochNumber() public view returns (uint256)',
    'function posHeight() public view returns (uint256)',
    'function finalizedEpochNumber() public view returns (uint256)',
  ],
  address: '0x0888000000000000000000000000000000000004',
}; */

const PoSRegister = {
  abi: [
    'function register(bytes32 identifier, uint64 votePower, bytes calldata blsPubKey, bytes calldata vrfPubKey, bytes[2] calldata blsPubKeyProof)',
    'function increaseStake(uint64 votePower)',
    'function retire(uint64 votePower)',
    'function getVotes(bytes32 identifier) external view returns (uint256, uint256)',
    'function identifierToAddress(bytes32 identifier) external view returns (address)',
    'function addressToIdentifier(address addr) external view returns (bytes32)',
    'event Register(bytes32 indexed identifier, bytes blsPubKey, bytes vrfPubKey)',
    'event IncreaseStake(bytes32 indexed identifier, uint64 votePower)',
    'event Retire(bytes32 indexed identifier, uint64 votePower)',
  ],
  address: '0x0888000000000000000000000000000000000005',
};

const CrossSpaceCall = {
  abi: [
    'event Call(bytes20 indexed sender, bytes20 indexed receiver, uint256 value, uint256 nonce, bytes data)',
    'event Create(bytes20 indexed sender, bytes20 indexed contract_address, uint256 value, uint256 nonce, bytes init)',
    'event Withdraw(bytes20 indexed sender, address indexed receiver, uint256 value, uint256 nonce)',
    'event Outcome(bool success)',
    'function createEVM(bytes calldata init) external payable returns (bytes20)',
    'function transferEVM(bytes20 to) external payable returns (bytes memory output)',
    'function callEVM(bytes20 to, bytes calldata data) external payable returns (bytes memory output)',
    'function staticCallEVM(bytes20 to, bytes calldata data) external view returns (bytes memory output)',
    'function withdrawFromMapped(uint256 value)',
    'function mappedBalance(address addr) external view returns (uint256)',
    'function mappedNonce(address addr) external view returns (uint256)',
  ],
  address: '0x0888000000000000000000000000000000000006',
};

const ParamsControl = {
  abi: [
    'function castVote(uint64 vote_round, tuple(uint16 topic_index, uint256[3] votes)[] vote_data)',
    'function readVote(address addr) view returns (tuple(uint16 topic_index, uint256[3] votes)[])',
    'function currentRound() external view returns (uint64)',
    'function totalVotes(uint64 vote_round) external view returns (tuple(uint16 topic_index, uint256[3] votes)[])',
    'function posStakeForVotes(uint64) external view returns (uint256)',
    'event CastVote(uint64 indexed vote_round, address indexed addr, uint16 indexed topic_index, uint256[3] votes)',
    'event RevokeVote(uint64 indexed vote_round, address indexed addr, uint16 indexed topic_index, uint256[3] votes)',
  ],
  address: '0x0888000000000000000000000000000000000007',
};

module.exports = {
  AdminControl,
  SponsorWhitelistControl,
  Staking,
  // ConfluxContext,
  PoSRegister,
  CrossSpaceCall,
  ParamsControl,
};
