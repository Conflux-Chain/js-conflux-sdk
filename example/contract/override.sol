// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

contract Override {
    struct Pair {
        uint num;
        string str;
    }

    event Event(bool indexed boolean);
    event Event(address indexed addr);
    event Event(int indexed num);
    event Event(uint indexed num);
    event Event(bytes indexed buffer);
    event Event(string indexed str);
    event Event(uint indexed num, string str, string indexed strIndex);
    event Event(Pair indexed pairIndex, Pair pair);

    constructor() public {} // constructor can not be override

    function func(bool boolean) public
    returns (bool)
    {
        emit Event(boolean);
        return boolean;
    }

    function func(int num) public
    returns (int)
    {
        emit Event(num);
        return num;
    }

    function func(uint num) public
    returns (uint)
    {
        emit Event(num);
        return num;
    }

    function func(address addr) public
    returns (address)
    {
        emit Event(addr);
        return addr;
    }

    function func(bytes memory buffer) public
    returns (bytes memory)
    {
        emit Event(buffer);
        return buffer;
    }

    function func(string memory str) public
    returns (string memory)
    {
        emit Event(str);
        return str;
    }

    function func(uint num, string memory str) public
    returns (bytes memory)
    {
        emit Event(num, str, str);
        return abi.encodePacked(num, str);
    }

    function func(Pair memory pair) public
    returns (Pair memory)
    {
        emit Event(pair, pair);
        return pair;
    }
}
