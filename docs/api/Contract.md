---
  id: javascript_sdk
  title: Javascript SDK Contract
  custom_edit_url: https://github.com/Conflux-Chain/js-conflux-sdk/edit/master/docs/api/Contract.md
  keywords:
    - conflux
    - javascript
    - sdk
  ---
  
  - contract
    - Contract.js
        - Contract
            - [**constructor**](#contract/Contract.js/Contract/**constructor**)

----------------------------------------

### Contract <a id="contract/Contract.js/Contract"></a>

Contract with all its methods and events defined in its abi.

#### Contract.prototype.**constructor** <a id="contract/Contract.js/Contract/**constructor**"></a>

> contract "code" definition:
```
6080................6080.................a264.........0033...............................
| <-                     create contract transaction `data`                          -> |
| <- deploy code -> | <- runtime code -> | <- metadata -> | <- constructor arguments -> |
| <-                contract `bytecode`                -> |
                    | <-       code as `getCode`       -> |
```

* **Parameters**

Name             | Type      | Required | Default | Description
-----------------|-----------|----------|---------|-----------------------------------------------------------------------------------------------------
options          | `object`  | true     |         |
options.abi      | `array`   | true     |         | The json interface for the contract to instantiate
options.address  | `string`  | false    |         | The address of the smart contract to call, can be added later using `contract.address = '0x1234...'`
options.bytecode | `string`  | false    |         | The byte code of the contract, can be added later using `contract.constructor.code = '0x1234...'`
conflux          | `Conflux` | true     |         | Conflux instance.

* **Returns**

`object` 

* **Examples**

```
> const contract = conflux.Contract({ abi, bytecode, address });
   {
      abi: ContractABI { contract: [Circular *1] },
      address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
      constructor: [Function: bound call],
      name: [Function: bound call],
      'name()': [Function: bound call],
      '0x06fdde03': [Function: bound call],
      balanceOf: [Function: bound call],
      'balanceOf(address)': [Function: bound call],
      '0x70a08231': [Function: bound call],
      send: [Function: bound call],
      'send(address,uint256,bytes)': [Function: bound call],
      '0x9bd9bbc6': [Function: bound call],
      Transfer: [Function: bound call],
      'Transfer(address,address,uint256)': [Function: bound call],
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': [Function: bound call]
   }
> contract.constructor.bytecode; // input code
   "0x6080..."
```

```
> const contract = conflux.Contract({
   address: 'cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw',
   abi: [
      {
        type: 'function',
        name: 'name',
        inputs: [],
        outputs: [{ type: 'string' }],
      },
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
      {
        name: 'send',
        type: 'function',
        inputs: [
          { type: 'address', name: 'recipient' },
          { type: 'uint256', name: 'amount' },
          { type: 'bytes', name: 'data' },
        ],
        outputs: [{ type: 'bool' }],
      },
    ]
   });
> contract.address
   "cfxtest:achc8nxj7r451c223m18w2dwjnmhkd6rxa2gc31euw"
> await contract.name(); // call a method without parameter, get decoded return value.
   "FansCoin"
> await contract.name().call({ to: '0x8b8689c7f3014a4d86e4d1d0daaf74a47f5e0f27' }); // call a method with options
   "conflux USDT"
> await contract.balanceOf('0x19c742cec42b9e4eff3b84cdedcde2f58a36f44f'); // call a method with parameters, get decoded return value.
   10000000000000000000n
> transaction = await conflux.getTransactionByHash('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeData(transaction.data)
   {
      name: 'send',
      fullName: 'send(address recipient, uint256 amount, bytes data)',
      type: 'send(address,uint256,bytes)',
      signature: '0x9bd9bbc6',
      array: [
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n,
        <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      ],
      object: {
        recipient: '0x80bb30efc5683758128b404fe5da03432eb16634',
        amount: 60000000000000000000n,
        data: <Buffer 1f 3c 6b 96 96 60 4c dc 3c e1 ca 27 7d 4c 69 a9 c2 77 0c 9f>
      }
    }
> receipt = await conflux.getTransactionReceipt('0x2055f3287f1a6ce77d91f5dfdf7517a531b3a560fee1265f27dc1ff92314530b');
> contract.abi.decodeLog(receipt.logs[1]);
   {
      name: 'Transfer',
      fullName: 'Transfer(address indexed from, address indexed to, uint256 value)',
      type: 'Transfer(address,address,uint256)',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      array: [
        '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        '0x80bb30efc5683758128b404fe5da03432eb16634',
        60000000000000000000n
      ],
      object: {
        from: '0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f',
        to: '0x80bb30efc5683758128b404fe5da03432eb16634',
        value: 60000000000000000000n
      }
    }
```
  