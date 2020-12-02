## Conflux Internal ontracts API
Conflux Network have three internal contracts `AdminControl`, `SponsorWhitelistControl`, `Staking`.
These contracts are very useful when you are developing contracts on Conflux network. Here is a API document for them, if you want know more info about them check [here](https://developer..conflux-chain.org/docs/conflux-rust/internal_contract/internal_contract). js-conflux-sdk have fully supported for InternalContracts.

```js
    // Get internal contract instance through conflux.InternalContract by passing Internal Contract name
    const stakeContract = conflux.InternalContract('Staking');
    // invoke contract instance's method
    const balance = await stakeContract.getStakingBalance('0x8dc687aef9ee127335434e1a0b6a16a5941d3b67');

```

To find what contract methods can invoke, check below API.

### Internal contract address

* AdminControl: `0x0888000000000000000000000000000000000000`
* SponsorWhitelistControl: `0x0888000000000000000000000000000000000001`
* Staking: `0x0888000000000000000000000000000000000002`


### AdminControl

```js
pragma solidity >=0.4.15;

contract AdminControl {
    /*** Query Functions ***/
    /**
     * @dev get admin of specific contract
     * @param contractAddr The address of specific contract
     */
    function getAdmin(address contractAddr) public view returns (address) {}
    
    /**
     * @dev Contract admin set the administrator of contract `contractAddr` to `newAdmin`.
     * @param contractAddr The address of the contract
     * @param newAdmin The new admin address
     */
    function setAdmin(address contractAddr, address newAdmin) public {}

   /**
     * @dev Contract admin destroy contract `contractAddr`.
     * @param contractAddr The contract to be destroied
     */
    function destroy(address contractAddr) public {}
}
```


### SponsorWhitelistControl

```js
pragma solidity >=0.4.15;

contract SponsorWhitelistControl {
    /*** Query Functions ***/
    /**
     * @dev get gas sponsor address of specific contract
     * @param contractAddr The address of the sponsored contract
     */
    function getSponsorForGas(address contractAddr) public view returns (address) {}

    /**
     * @dev get current Sponsored Balance for gas
     * @param contractAddr The address of the sponsored contract
     */
    function getSponsoredBalanceForGas(address contractAddr) public view returns (uint) {}

    /**
     * @dev get current Sponsored Gas fee upper bound
     * @param contractAddr The address of the sponsored contract
     */
    function getSponsoredGasFeeUpperBound(address contractAddr) public view returns (uint) {}

    /**
     * @dev get collateral sponsor address
     * @param contractAddr The address of the sponsored contract
     */
    function getSponsorForCollateral(address contractAddr) public view returns (address) {}

    /**
     * @dev get current Sponsored Balance for collateral
     * @param contractAddr The address of the sponsored contract
     */
    function getSponsoredBalanceForCollateral(address contractAddr) public view returns (uint) {}

    /**
     * @dev check if a user is in a contract's whitelist
     * @param contractAddr The address of the sponsored contract
     * @param user The address of contract user
     */
    function isWhitelisted(address contractAddr, address user) public view returns (bool) {}

    /**
     * @dev check if all users are in a contract's whitelist
     * @param contractAddr The address of the sponsored contract
     */
    function isAllWhitelisted(address contractAddr) public view returns (bool) {}

    /*** for contract admin only **/
    /**
     * @dev contract admin add user to whitelist
     * @param contractAddr The address of the sponsored contract
     * @param addresses The user address array
     */
    function addPrivilegeByAdmin(address contractAddr, address[] memory addresses) public {}

    /**
     * @dev contract admin remove user from whitelist
     * @param contractAddr The address of the sponsored contract
     * @param addresses The user address array
     */
    function removePrivilegeByAdmin(address contractAddr, address[] memory addresses) public {}

    // ------------------------------------------------------------------------
    // Someone will sponsor the gas cost for contract `contractAddr` with an
    // `upper_bound` for a single transaction.
    // ------------------------------------------------------------------------
    function setSponsorForGas(address contractAddr, uint upperBound) public payable {}

    // ------------------------------------------------------------------------
    // Someone will sponsor the storage collateral for contract `contractAddr`.
    // ------------------------------------------------------------------------
    function setSponsorForCollateral(address contractAddr) public payable {}

    // ------------------------------------------------------------------------
    // Add commission privilege for address `user` to some contract.
    // ------------------------------------------------------------------------
    function addPrivilege(address[] memory) public {}

    // ------------------------------------------------------------------------
    // Remove commission privilege for address `user` from some contract.
    // ------------------------------------------------------------------------
    function removePrivilege(address[] memory) public {}
}
```

### Staking

```js
pragma solidity >=0.4.15;

contract Staking {
    /*** Query Functions ***/
    /**
     * @dev get user's staking balance
     * @param user The address of specific user
     */
    function getStakingBalance(address user) public view returns (uint) {}

    /**
     * @dev get user's locked staking balance at given blockNumber
     * @param user The address of specific user
     * @param blockNumber The blockNumber as index.
     */
    // ------------------------------------------------------------------------
    // Note: if the blockNumber is less than the current block number, function
    // will return current locked staking balance.
    // ------------------------------------------------------------------------
    function getLockedStakingBalance(address user, uint blockNumber) public view returns (uint) {}


    /**
     * @dev get user's vote power staking balance at given blockNumber
     * @param user The address of specific user
     * @param blockNumber The blockNumber as index.
     */
    // ------------------------------------------------------------------------
    // Note: if the blockNumber is less than the current block number, function
    // will return current vote power.
    // ------------------------------------------------------------------------
    function getVotePower(address user, uint blockNumber) public view returns (uint) {}

    function deposit(uint amount) external {}

    function withdraw(uint amount) external {}

    /**
     * @dev lock CFX to getting vote power
     * @param amount The lock amount, minimal amount is 1 CFX
     * @param unlockBlockNumber 
     */
    function voteLock(uint amount, uint unlockBlockNumber) external {}
}
```

* [ABI](https://github.com/Conflux-Chain/conflux-rust/tree/master/internal_contract/metadata)
* [SourceCode](https://github.com/Conflux-Chain/conflux-rust/tree/master/internal_contract/contracts)
