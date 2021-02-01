block_trace
===
Block response data structure
```json
{
    "transactionTraces": [
        {
            "traces": [
                {
                    "action": {}
                }
            ]
        }
    ]    
}
```

# Action enum: 
1. Call 
2. Create
3. CallResult
4. CreateResult
5. InternalTransferAction

## Call
* pub from: RpcAddress,
* pub to: RpcAddress,
* pub value: U256,
* pub gas: U256,
* pub input: Bytes,
* pub call_type: CallType,

## Create
* pub from: RpcAddress,
* pub value: U256,
* pub gas: U256,
* pub init: Bytes,

## CallResult
* pub outcome: Outcome,
* pub gas_left: U256,
* pub return_data: Bytes,

## CreateResult
* pub outcome: Outcome,
* pub addr: RpcAddress,
* pub gas_left: U256,
* pub return_data: Bytes,

## InternalTransferAction
* pub from: RpcAddress,
* pub to: RpcAddress,
* pub value: U256,

## CallType
* None, 0 
* Call, 1
* CallCode, 2
* DelegateCall, 3
* StaticCall, 4

## OutCome
* Success, 0
* Revert, 1
* Fail, 2