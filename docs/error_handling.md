
### Use try-catch to get RPC error
You can use js-conflux-sdk with async/await syntax, which means you can use try-catch to catch the error.
Normally errors returned from RPC server will include `code` and `message` field, and optionally `data` field will 
also been returned.

```js
try {
    cfx.getBalance('cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91');
} catch(e) {
    console.log(e.message);
    console.log(e.code);
    console.log(e.data);
}
```
The `data` field maybe a plain text string, also can be a hex encoded string.

```js
console.log(e.data);
// You should connect a node with version 1.1.1 or pass a valid hex value
console.log(e.data);
// 0x5265766572746564
// For hex string you can use hex decode to convert it to plain string
// For example in node.js you can decode like this
Buffer.from(e.data.slice(2), 'hex').toString()
```

### Common Errors

##### `Method not found`
`Method not found` means you send a RPC request, and the request's method is not supported by the server.
If you are invoke `cfx.sendTransaction()` and seen this error, normally because `cfx.wallet` doesn't have 
the account `tx.from`, you should add it to wallet through `cfx.addPrivateKey()`.


##### `0x prefix is missing`
`0x prefix is missing` means the RPC server expect a hex encoded string, but the request params is not passed correctly.

Notes: If you use `js-conflux-sdk` version `1.5.10 or above`, it will use the new CIP37 format address for RPC request parameters.
It only work with conflux node version `1.1.1` or above, if you use newer version SDK with `1.1.0` or below you will seen this error 
`0x prefix is missing`. To resolve it you need use a newer version RPC work with it.