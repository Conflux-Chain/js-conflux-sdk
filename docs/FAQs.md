# FAQs

## Is js-conflux-sdk support mnemonic or HDwallet ?

Mnemonic can be support by a third package `@conflux-dev/hdwallet`, check [SDK account doc](./account.md) HD wallet part for detail intro.

## Common Errors

Check [Error Handling](./error_handling.md) for common errors and how to handle them.

## Why is the transaction not mined or sending transaction timeout?

If you are sending a transaction and it is not mined or it is timeout, you can check the following:

* The sending account have enough balance.
* If the transaction should be sponsored, the sponsor account have enough balance.
* The transaction nonce is correct(not bigger than sender account's nonce).
* If the network is busy, you can try to increase the gas price.

For more detail, check [why tx is pending?](https://doc.confluxnetwork.org/docs/core/core-space-basics/transactions/why-transaction-is-pending) and [Transaction lifecycle for more info](https://doc.confluxnetwork.org/docs/core/core-space-basics/transactions/lifecycle)
