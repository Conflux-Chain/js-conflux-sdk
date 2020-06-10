pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract testConstructor4 {
   constructor(
      string[] memory param1, 
      string[] memory param2, 
      uint256 param3, 
      address[2] memory param4,
      bool param5
   ) public {
      
   }
    function balanceOf(address tokenOwner) public view returns (uint) {
        return 1;
    }
}