# Commands

The js-conflux-sdk also provide three command line tool to help ease Conflux developer's life:

1. `sponsor` - Can be used to query and set contract sponsor
2. `rpc` - Can be used to invoke rpc methods
3. `cfxjs` - Can be used generate a compatiable account

## sponsor

```sh
$ npx sponsor -h
Usage: sponsor [options] [command]

Options:
  -V, --version                                      output the version number
  -t, --testnet                                      Use Conflux testnet network
  -h, --help                                         display help for command

Commands:
  info <contractAddr>                                Get contract sponsor info
  setGasSponsor <contractAddr> <upperBound> <value>  Set gas sponsor
  setCollateralSponsor <contractAddr> <value>        Set collateral sponsor
  addToWhiteList <contractAddr> <targetAddr>         Add address to whitelist
  removeFromWhiteList <contractAddr> <targetAddr>    Remove address from whitelist
  help [command]                                     display help for command
```

### Examples

```sh
$ npx sponsor info cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2
Gas Sponsor:  cfx:acgzz08m8z2ywkeda0jzu52fgaz9u95y1y50rnwmt3
Gas Sponsor Balance:  19.999971068173696366 CFX
Gas Sponsor upperBound:  10 GDrip
Collateral Sponsor:  cfx:acbkxbtruayaf2he1899e1533x4wg2a07eyjjrzu31
Collateral Sponsor Balance:  926.1875 CFX
IsAllWhitelisted:  true
Contact Admin:  cfx:aatecdbb8fgnmadea7ng2xpkz2rt2wdgway9ghk03y
```

## rpc

```sh
$ npx rpc -h
Usage: sponsor [options] [command]

Options:
  -V, --version                        output the version number
  -t, --testnet                        Use Conflux testnet network
  -h, --help                           display help for command

Commands:
  cfx <method> [args...]               call methods in cfx namespace
  call <namespace> <method> [args...]  call methods in cfx namespace
  help [command]                       display help for command
```

### Examples

```sh
$ npx rpc cfx epochNumber
cfx_epochNumber:  46833206

$ npx rpc cfx getBalance cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2
cfx_getBalance:  0n
```
