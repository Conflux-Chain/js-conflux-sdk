# change log

## v0.9.1

* abi implicitly converting string to number

solidity method: `function add(uint,uint) public returns (uint);`

```
// old
await contract.add(1, '2'); // error! can not accept string 

// new version
await contract.add(1, '2'); // good, converting string to number
```
