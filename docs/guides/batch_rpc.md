# Batch RPC

The [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification#batch) support batch request natively. Which enable user send several request at the same time.
The Client `MAY` send an Array filled with Request objects, The Server should respond with an Array containing the corresponding Response objects, after all of the batch Request objects have been processed.

For example:

```json
--> [
        {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
        {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]},
        {"jsonrpc": "2.0", "method": "subtract", "params": [42,23], "id": "2"},
        {"foo": "boo"},
        {"jsonrpc": "2.0", "method": "foo.get", "params": {"name": "myself"}, "id": "5"},
        {"jsonrpc": "2.0", "method": "get_data", "id": "9"} 
    ]
<-- [
        {"jsonrpc": "2.0", "result": 7, "id": "1"},
        {"jsonrpc": "2.0", "result": 19, "id": "2"},
        {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
        {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "5"},
        {"jsonrpc": "2.0", "result": ["hello", 5], "id": "9"}
    ]
```

Conflux's RPC method also support batch request, both `HTTP` and `Websocket`.

`js-conflux-sdk` will enable user easily call RPC batched from `v2.0`.

## Quick start

From `js-conflux-sdk` v2.0 batch RPC is supported.

```js
const { Conflux } = require('js-conflux-sdk');
const conflux = new Conflux({
  url: "https://test.confluxrpc.com",
  networkId: 1,
});

const account = conflux.wallet.addPrivateKey(process.env.PRIVATE_KEY);

async function main() {
  // create a batch requester through method BatchRequest()
  const batcher = conflux.BatchRequest();
  // add method request
  batcher.add(conflux.cfx.getEpochNumber.request());
  batcher.add(conflux.cfx.getBalance.request(account.address));
  const results = await batcher.execute();
  /*
    [
      100,    // the epoch number
      203134n,  // balance
    ]
  */
}

main();
```

One thing to note is `execute` method will not clear previous added request, so if you add some request later and then call `execute` method again, 
all request will send one time. `BatchRequest` provide one method `clear` to remove all request previous added.

## Batch Send Transaction

To batch send transaction, now developer could use SDK's helper to build a `rawTransaction` and add it to bacher's request array.

```js
async function main() {
  // create a batch requester through method BatchRequest()
  const batcher = conflux.BatchRequest();
  // add method request
  const rawTx1 = {
    from: addressA,
    to: addressB,
    value: 100 // Drip
  };
  batcher.addTransaction(rawTx1);
  const rawTx2 = {
    from: addressA,
    to: addressC,
    value: 200 // Drip
  };
  batcher.addTransaction(rawTx2);
  const results = await batcher.execute();
  /*
    [
      "0xb8336d2fb53f1f19503d80bf23f8e14370be7e27df6f28e38fa95b8efd8d5c93",
      "0x6f90c40feb8a2a621e51b0a7cf48b25b677b07294e34eebda5318d7cf23ca9e5",
    ]
  */
}

main();
```

Note: when sending transation there is a max amount limit `2000` for one account.

## Batch interact with contract

Contract interaction is also supported.

```js
async function main() {
  const crc20Token = conflux.CRC20('cfxtest:achkx35n7vngfxgrm7akemk3ftzy47t61yk5nn270s');
  // create a batch requester through method BatchRequest()
  const batcher = conflux.BatchRequest();

  // build contract method's request
  batcher.add(crc20Token.name().request());
  // pass contract method's parameter
  batcher.add(crc20Token.balanceOf(addressA).request());
  // specify call option through request's parameter
  batcher.add(crc20Token.balanceOf(addressB).request({
    from: addressB
  }));

  // update contract's state
  const rawTx = await crc20Token.transfer(targetAdress, amount).populateTransaction({
    from: addressA
  });
  batcher.addTransaction(rawTx);

  const results = batcher.execute();
}
```
