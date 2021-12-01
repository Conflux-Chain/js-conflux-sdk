## Classes

<dl>
<dt><a href="#PoS">PoS</a></dt>
<dd><p>Class contains pos RPC methods
For the detail meaning of fields, please refer to the PoS RPC document:</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#PivotDecision">PivotDecision</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSStatus">PoSStatus</a> : <code>Object</code></dt>
<dd><p>PoS status</p>
</dd>
<dt><a href="#VotePowerState">VotePowerState</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#forceRetired">forceRetired</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSAccount">PoSAccount</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSTransaction">PoSTransaction</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Signature">Signature</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSBlock">PoSBlock</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CommitteeNode">CommitteeNode</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Election">Election</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CurrentCommittee">CurrentCommittee</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSCommittee">PoSCommittee</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSReward">PoSReward</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PoSEpochRewards">PoSEpochRewards</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="PoS"></a>

## PoS
Class contains pos RPC methods
For the detail meaning of fields, please refer to the PoS RPC document:

**Kind**: global class  
<a name="new_PoS_new"></a>

### new PoS(conflux)
Create PoS instance

**Returns**: <code>object</code> - The PoS instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>object</code> | The Conflux object |

<a name="PivotDecision"></a>

## PivotDecision : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| height | <code>number</code> | 
| blockHash | <code>hex</code> | 

<a name="PoSStatus"></a>

## PoSStatus : <code>Object</code>
PoS status

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| latestCommitted | <code>number</code> | 
| epoch | <code>number</code> | 
| latestVoted | <code>number</code> | 
| latestTxNumber | <code>number</code> | 
| pivotDecision | [<code>PivotDecision</code>](#PivotDecision) | 

<a name="VotePowerState"></a>

## VotePowerState : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| endBlockNumber | <code>number</code> | 
| power | <code>number</code> | 

<a name="forceRetired"></a>

## forceRetired : <code>Object</code>
**Kind**: global typedef  
<a name="PoSAccount"></a>

## PoSAccount : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| blockNumber | <code>number</code> | 
| status | <code>PoSAccountStatus</code> | 

<a name="PoSTransaction"></a>

## PoSTransaction : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| hash | <code>string</code> | 
| blockHash | <code>string</code> | 
| from | <code>string</code> | 
| status | <code>string</code> | 
| type | <code>string</code> | 
| number | <code>number</code> | 
| timestamp | <code>number</code> \| <code>null</code> | 
| blockNumber | <code>number</code> \| <code>null</code> | 
| payload | <code>\*</code> | 

<a name="Signature"></a>

## Signature : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| votes | <code>number</code> | 
| account | <code>hash</code> | 

<a name="PoSBlock"></a>

## PoSBlock : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| epoch | <code>number</code> | 
| height | <code>number</code> | 
| pivotDecision | [<code>PivotDecision</code>](#PivotDecision) | 
| round | <code>number</code> | 
| timestamp | <code>number</code> | 
| nextTxNumber | <code>number</code> | 
| signatures | [<code>Signature</code>](#Signature) | 

<a name="CommitteeNode"></a>

## CommitteeNode : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| votingPower | <code>number</code> | 
| address | <code>hash</code> | 

<a name="Election"></a>

## Election : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| isFinalized | <code>bool</code> | 
| startBlockNumber | <code>number</code> | 
| topElectingNodes | [<code>Array.&lt;CommitteeNode&gt;</code>](#CommitteeNode) | 

<a name="CurrentCommittee"></a>

## CurrentCommittee : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| epochNumber | <code>number</code> | 
| quorumVotingPower | <code>number</code> | 
| totalVotingPower | <code>number</code> | 
| nodes | [<code>Array.&lt;CommitteeNode&gt;</code>](#CommitteeNode) | 

<a name="PoSCommittee"></a>

## PoSCommittee : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| currentCommittee | [<code>CurrentCommittee</code>](#CurrentCommittee) | 
| elections | [<code>Array.&lt;Election&gt;</code>](#Election) | 

<a name="PoSReward"></a>

## PoSReward : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| reward | <code>number</code> | 
| posAddress | <code>hash</code> | 
| powAddress | <code>string</code> | 

<a name="PoSEpochRewards"></a>

## PoSEpochRewards : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| powEpochHash | <code>hash</code> | 
| accountRewards | [<code>Array.&lt;PoSReward&gt;</code>](#PoSReward) | 

<a name="getStatus"></a>

## .getStatus ⇒ [<code>Promise.&lt;PoSStatus&gt;</code>](#PoSStatus)
**Kind**: instance member  
**Returns**: [<code>Promise.&lt;PoSStatus&gt;</code>](#PoSStatus) - PoS status object  
**Example**  
```js
await conflux.pos.getStatus();
// {
//   epoch: 138,
//   latestCommitted: 8235,
//   latestTxNumber: '0xa5e2',
//   latestVoted: 8238,
//   pivotDecision: {
//     blockHash: '0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510',
//     height: 394020
//   }
// }
```
<a name="getAccount"></a>

## .getAccount ⇒ [<code>Promise.&lt;PoSAccount&gt;</code>](#PoSAccount)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>Hash</code> | Account address |
| [blockNumber] | <code>number</code> \| <code>hex</code> | Optional block number |

**Example**  
```js
await conflux.pos.getAccount('0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3');
{
  address: '0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3',
  blockNumber: 8240,
  status: {
    availableVotes: 1525,
    forceRetired: null,
    forfeited: 0,
    inQueue: [],
    locked: 1525,
    outQueue: [],
    unlocked: 1
  }
}
```
<a name="getBlockByHash"></a>

## .getBlockByHash ⇒ [<code>Promise.&lt;PoSBlock&gt;</code>](#PoSBlock)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Hash</code> | The hash of PoS block |

**Example**  
```js
await conflux.pos.getBlockByHash('0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510');
```
<a name="getBlockByNumber"></a>

## .getBlockByNumber ⇒ [<code>Promise.&lt;PoSBlock&gt;</code>](#PoSBlock)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| blockNumber | <code>number</code> \| <code>hex</code> | The number of PoS block |

**Example**  
```js
await conflux.pos.getBlockByNumber(8235);
{
  epoch: 138,
  hash: '0x1daf5443b7556cc39c3d4fe5e208fa77c3f5c053ea4bd637f5e43dfa7f0a95cb',
  height: 8235,
  miner: '0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3',
  nextTxNumber: 42467,
  parentHash: '0x308699b307c81906ab97cbf213532c196f2d718f4641266aa444209349d9e31c',
  pivotDecision: {
    blockHash: '0x97625d04ece6fe322ae38010ac877447927b4d5963af7eaea7db9befb615e510',
    height: 394020
  },
  round: 15,
  signatures: [
    {
      account: '0x00f7c03318f8c4a7c6ae432e124b4a0474e973139a87f9ea6ae3efba66af7d8a',
      votes: 3
    }
  ],
  timestamp: 1638340165169041
}
```
<a name="getCommittee"></a>

## .getCommittee ⇒ [<code>Promise.&lt;PoSCommittee&gt;</code>](#PoSCommittee)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| [blockNumber] | <code>number</code> \| <code>hex</code> | Optional block number |

**Example**  
```js
await conflux.pos.getCommittee();
{
  currentCommittee: {
    epochNumber: 138,
    nodes: [
     {
      address: "0xf92d8504fad118ddb5cf475180f5bcffaa967a9f9fa9c3c899ff9ad0de99694a",
      votingPower: 3
     }
    ],
    quorumVotingPower: 199,
    totalVotingPower: 297
  },
  elections: [
    {
      isFinalized: false,
      startBlockNumber: 8280,
      topElectingNodes: [
        {
          address: "0x0f0ccf5ee5276b102316acb3943a2750085f85ac7b94bdbf9d8901f03a7d7cc3",
          votingPower: 3
        }
      ]
    },
    {
      isFinalized: false,
      startBlockNumber: 8340,
      topElectingNodes: []
    }
  ]
}
```
<a name="getTransactionByNumber"></a>

## .getTransactionByNumber ⇒ [<code>Promise.&lt;PoSTransaction&gt;</code>](#PoSTransaction)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| txNumber | <code>number</code> \| <code>hex</code> | The number of transaction |

**Example**  
```js
await conflux.pos.getTransactionByNumber(8235);
{
  blockHash: '0xe684e88981b7ffe14741a2274e7b65b89ae2e133ebdd783d71ddeeacb4e957d6',
  blockNumber: 8243,
  from: '0x0000000000000000000000000000000000000000000000000000000000000000',
  hash: '0xaa92222b6a20342285ed56de2b77a05a6c1a9a3e4750e4952af8f908f7316b5d',
  number: 42480,
  payload: null,
  status: 'Executed',
  timestamp: 1638340649662468,
  type: 'BlockMetadata'
}
```
<a name="getRewardsByEpoch"></a>

## .getRewardsByEpoch ⇒ [<code>Promise.&lt;PoSEpochRewards&gt;</code>](#PoSEpochRewards)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| epoch | <code>number</code> \| <code>hex</code> | A PoS epoch number |

**Example**  
```js
await conflux.pos.getRewardsByEpoch(138);
{
  accountRewards: [
    {
      posAddress: '0x83ca56dd7b9d1222fff48565ed0261f42a17099061d905f9e743f89574dbd8e0',
      powAddress: 'NET8888:TYPE.USER:AAKFSH1RUYS4P040J5M7DJRJBGMX9ZV7HAJTFN2DKP',
      reward: 605265415757735647n
    },
    ... 122 more items
  ],
  powEpochHash: '0xd634c0a71c6197a6fad9f80439b31b4c7191b3ee42335b1548dad1160f7f628c'
}
```
