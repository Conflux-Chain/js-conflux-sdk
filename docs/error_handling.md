# Error Handling

## Use try-catch to get RPC error

You can use js-conflux-sdk with async/await syntax, which means you can use try-catch to catch the error. Normally errors returned from RPC server will include `code` and `message` field, and optionally `data` field will also been returned.

```javascript
try {
    conflux.cfx.getBalance('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
} catch(e) {
    console.log(e.message);
    console.log(e.code);
    console.log(e.data);
}
```

The `data` field is a plain text string, or is a hex encoded string.

```javascript
console.log(e.data);
// You should connect a node with version 1.1.1 or pass a valid hex value
console.log(e.data);
// 0x5265766572746564
// For hex string you can use hex decode to convert it to plain string
// For example in node.js you can decode like this
Buffer.from(e.data.slice(2), 'hex').toString()
```

From SDK V2.0 the hex encoded `error.data`, will be auto decoded by SDK, you can catch and check it through `error.data`.

## Common Errors

### `Method not found`

`Method not found` means you send a RPC request, and the request's method is not supported by the fullnode RPC service. If you are invoke `cfx.sendTransaction()` and seen this error, normally because `cfx.wallet` doesn't have the account `tx.from`, you should add it to wallet through `cfx.addPrivateKey()`.

### `0x prefix is missing`

`0x prefix is missing` means the RPC server expect a hex encoded string, but the request params is not passed correctly.

Notes: If you use `js-conflux-sdk` version `1.5.10 or above`, it will use the new CIP37 format address for RPC request parameters. It only work with conflux node version `1.1.1` or above, if you use newer version SDK with `1.1.0` or below you will seen this error `0x prefix is missing`. To resolve it you need use a newer version RPC work with it.

### ParserError(argument|input error)

The `format` utility provide a lot format methods that can convert data from one type to another type. For example `format.hex`, `format.hexBuffer`, `format.uInt`, `format.bigInt`. These convert methods use the `Parser` underline, if any convert operation failed it will throw a `ParserError`. `format` has been heavy used in SDK, including RPC parameter and response format, contract method parameter format and etc.

So if you see any `ParserError` which means some invalid value is used.

```js
> format.hex('hello')
Uncaught ParserError: path="", toHex(hello), hello not match "hex"
    at Proxy.parser (/Users/xxxx/Projects/conflux/sdks/js-conflux-sdk/src/util/parser.js:37:13) {
  arguments: [Arguments] { '0': 'hello' },
  path: []
}
> format.hex(undefined)
Uncaught ParserError: path="", toHex(), undefined not match "hex"
    at Proxy.parser (/Users/xxxx/Projects/conflux/sdks/js-conflux-sdk/src/util/parser.js:37:13) {
  arguments: [Arguments] { '0': undefined },
  path: []

> format.uInt("hello")
Uncaught ParserError: path="", NaN do not match "uint"
    at Proxy.parser (/Users/xxxx/Projects/conflux/sdks/js-conflux-sdk/src/util/parser.js:37:13) {
  arguments: [Arguments] { '0': 'hello' },
  path: []
}
```

From SDK V2.0 the parser error will provide more info, include `code`, Parser's error code is `5200`

```js
> format.hex(undefined)
Uncaught ParserError: undefined not match "hex"
    at toHex (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/util/format.js:29:11)
    at ParserContext.<anonymous> (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/util/parser.js:161:14)
    at Proxy.parser (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/util/parser.js:40:17)
    at repl:1:8
    at Script.runInThisContext (vm.js:120:18)
    at REPLServer.defaultEval (repl.js:433:29)
    at bound (domain.js:427:14)
    at REPLServer.runBound [as eval] (domain.js:440:12)
    at REPLServer.onLine (repl.js:760:10)
    at REPLServer.emit (events.js:327:22) {
  message: '(Invalid input|args) formatter: "format.hex"; args: (undefined) ; errorMessage: undefined not match "hex"',
  code: 5200,
  arguments: [Arguments] { '0': undefined },
  path: []
}
```

### cfx_call Error

If you are interacting with contract, and trying query contract state through `cfx_call`, then you may encounter error `Transaction reverted`

```js
(node:1416) UnhandledPromiseRejectionWarning: Error: Transaction reverted
    at HttpProvider.call (/Users/xxxx/Projects/conflux-fans/pos-pool/contract/node_modules/js-conflux-sdk/src/provider/BaseProvider.js:71:13)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async CFX.call (/Users/xxxx/Projects/conflux-fans/pos-pool/contract/node_modules/js-conflux-sdk/src/rpc/cfx.js:490:14)
    at async MethodTransaction.call (/Users/xxxx/Projects/conflux-fans/pos-pool/contract/node_modules/js-conflux-sdk/src/contract/method/MethodTransaction.js:53:17)
    at async MethodTransaction.then (/Users/xxxx/Projects/conflux-fans/pos-pool/contract/node_modules/js-conflux-sdk/src/contract/method/MethodTransaction.js:74:22)
(node:1416) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:1416) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

Normally this mean contract method call failed, may have a lot reasons, may be `parameter passed wrong`, maybe `do not have permission`.

For these situations, you need to find out why contract method execute failed. If you are lucky, contract have provide some error message you can seen it in error message

```js
(node:1416) UnhandledPromiseRejectionWarning: Error: Transaction reverted balance not enough
...
```

### abi encode error

When interact with contract's method, if provide wrong number of arguments, you will encounter errors like below:

```js
Error: {"message":"length not match","expect":2,"got":1,"coder":{"type":"(address,uint256)","dynamic":false,"size":2,"coders":[{"type":"address","name":"_to","dynamic":false,"networkId":1},{"type":"uint256","name":"_value","dynamic":false,"signed":false,"size":32,"bound":"115792089237316195423570985008687907853269984665640564039457584007913129639936"}],"names":["_to","_value"]}}
    at assert (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/util/index.js:9:11)
    at TupleCoder.encode (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/contract/abi/TupleCoder.js:116:5)
    at ContractMethod.encodeData (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/contract/method/FunctionCoder.js:50:44)
    at ContractMethod.call (/Users/panaw/Projects/conflux/sdks/js-conflux-sdk/src/contract/method/ContractMethod.js:16:23)
    at invokeContractMethod (/Users/panaw/Projects/conflux/sdks/test-jssdk/main/v2/traceV2.js:44:31)
    at main (/Users/panaw/Projects/conflux/sdks/test-jssdk/main/v2/traceV2.js:10:9)
    at Object.<anonymous> (/Users/panaw/Projects/conflux/sdks/test-jssdk/main/v2/traceV2.js:16:1)
    at Module._compile (internal/modules/cjs/loader.js:1137:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)
    at Module.load (internal/modules/cjs/loader.js:985:32)
```

```"length not match","expect":2,"got":1``` means the abi encoder expect 2 arguments according to the ABI, but only 1 is provided.