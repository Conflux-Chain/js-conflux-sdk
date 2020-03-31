pragma solidity ^0.6.0;

contract Counter {
    uint private count=0;
    event Event(address indexed sender, uint count);

    constructor(uint num) public {
        count = num;
    }

    function inc(uint num) public returns (uint) {
        emit Event(msg.sender, count);
        count += num;
        return count;
    }

    function get() public view returns (uint) {
        return count;
    }
}
