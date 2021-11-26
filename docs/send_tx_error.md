# Send transaction error

```json
{
  "jsonrpc":"2.0",
  "error":{},  // the error object
  "id":1
}
```

## too stale nonce

```json
{
  "code": -32076,
  "message": "Invalid parameters: tx",
  "data": "\"Transaction 0x84b64ffdfb5246153420e73f142fbbc939e2879f17ca11c5a38e77770c4990ff is discarded due to a too stale nonce\""
}
```

## Transaction Pool is full

```json
{
  "code": -32076,
  "message": "Failed imported to deferred pool: Transaction Pool is full",
}
```

## EpochHeightOutOfBound

```json
{
  "code": -32076,
  "message": "Invalid parameters: tx",
  "data": "\"EpochHeightOutOfBound { block_height: 29618627, set: 29295991, transaction_epoch_bound: 100000 }\""
}
```

## Exceeds half of pivot block gas limit

```json
{
  "code": -32602,
  "message": "Invalid parameters: tx",
  "data":"\"transaction gas 28000000 exceeds the maximum value 15000000, the half of pivot block gas limit\""
}
```

## tx already exist
