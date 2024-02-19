# Introduction

`js-conflux-sdk` is a Javascript library for interacting with Conflux.

It’s commonly found in decentralized apps (dapps) to help with sending transactions, interacting with smart contracts, reading block data, and a variety of other use cases.

## Getting Started

* Unfamiliar with Conflux? → [confluxnetwork](http://confluxnetwork.org)
* Unfamiliar with Solidity? → [Solidity documentation](https://soliditylang.org/)
* Ready to code? → [QuickStart](quick_start.md)
* Interested in a quick tour? → [Overview](overview.md)
* Like to give back? → [Contribute](https://github.com/conflux-chain/js-conflux-sdk)
* Want to get testnet CFX? → [Conflux testnet faucet](http://faucet.confluxnetwork.org/)
* Conflux sponsorship mechanism? → [Sponsorship](https://doc.confluxnetwork.org/docs/core/core-space-basics/sponsor-mechanism)

## Table of Contents

* [QuickStart](quick_start.md)
* [Overview](overview.md)
* [Changelog](../change_log.md)
* [js-sdk examples](https://github.com/conflux-fans/js-sdk-example)

## Guides

* [Providers](providers.md) How to connect to Conflux network in different ways.
* [CIP37 Address](conflux_checksum_address.md) How to convert between different address formats.
* [Account](account.md) How to create and manage accounts.
* [Sending Transaction](how_to_send_tx.md) How to send transactions and wait tx confirmed.
* [Interact with Contract](interact_with_contract.md) How to interact with smart contracts.
* [Sign methods](sign_methods.md) How to sign messages and transactions.
* [Error Handling](error_handling.md) How to handle errors.
* [Batch RPC](batch_rpc.md) How to batch RPC requests.

## API

* [Conflux](./api/Conflux.md) The `Conflux` class provide methods to interact with RPC methods and send transaction.
* [Wallet](./api/wallet/Wallet.md) The `Wallet` class provide methods to manage accounts and sign transactions.
* [PrivateKeyAccount](./api/wallet/PrivateKeyAccount.md) The `PrivateKeyAccount` class can be used to sign transactions or messages. It can be created from a private key or be random generated.
* [Transaction](./api/Transaction.md) The `Transaction` class provide methods to construct and encode transactions.
* [Drip](./api/Drip.md) Drip - CFX converter
* [format](./api/util/format.md) Type formaters
* [sign](./api/util/sign.md) Crypto utilities
* [address utilities](./api/util/address.md) Address utilities

## Other Docs

1. [Official developer documentation](https://doc.confluxnetwork.org/)
2. [RPC API](https://doc.confluxnetwork.org/docs/core/build/json-rpc/)
3. [Subscription](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pubsub)
4. [FluentWallet Official Site](https://fluentwallet.com/)
5. [Fluent documentation](https://fluent-wallet.zendesk.com/hc/en-001)
