const abi = [
  'constructor(uint256 num)',
  'function count() public view returns (uint256)',
  'function self() public',
  'function inc(uint256 num) public returns (uint256)',
  'function override(bytes buffer) public returns (bytes)',
  'function override(string memory str) public returns (string memory)',
  'function override(uint num, string memory str) public returns (bytes)',
  'event SelfEvent(address indexed sender, uint256 current)',
  'event ArrayEvent(string[3] indexed _array)',
  'event StringEvent(string indexed _string)',
  // TODO: 'StructEvent'
  'event OverrideEvent(bytes indexed buffer)',
  'event OverrideEvent(string indexed str)',
  'event OverrideEvent(uint256 indexed num, string memory str)',
];

module.exports = {
  abi,
};
