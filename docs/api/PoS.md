## Classes

<dl>
<dt><a href="#TxPool">TxPool</a></dt>
<dd><p>Class contains txpool RPC methods</p>
</dd>
<dt><a href="#PoS">PoS</a></dt>
<dd><p>Class contains pos RPC methods</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#nextNonce">nextNonce</a> ⇒ <code>Promise.&lt;number&gt;</code></dt>
<dd><p>Get user next nonce in txpool</p>
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

<a name="TxPool"></a>

## TxPool
Class contains txpool RPC methods

**Kind**: global class  
<a name="new_TxPool_new"></a>

### new TxPool(conflux)
TxPool constructor.

**Returns**: <code>object</code> - The TxPool instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>object</code> | A Conflux instance |

<a name="PoS"></a>

## PoS
Class contains pos RPC methods

**Kind**: global class  
<a name="new_PoS_new"></a>

### new PoS(conflux)
Create PoS instance

**Returns**: <code>object</code> - The PoS instance  

| Param | Type | Description |
| --- | --- | --- |
| conflux | <code>object</code> | The Conflux object |

<a name="nextNonce"></a>

## nextNonce ⇒ <code>Promise.&lt;number&gt;</code>
Get user next nonce in txpool

**Kind**: global variable  
**Returns**: <code>Promise.&lt;number&gt;</code> - - The next usable nonce  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address of the account |

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
|  | <code>epoch</code> | 
|  | <code>latestVoted</code> | 
|  | [<code>PivotDecision</code>](#PivotDecision) | 

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
<a name="getAccount"></a>

## .getAccount ⇒ [<code>Promise.&lt;PoSAccount&gt;</code>](#PoSAccount)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>Hash</code> | Account address |
| [blockNumber] | <code>number</code> \| <code>hex</code> | Optional block number |

<a name="getBlockByHash"></a>

## .getBlockByHash ⇒ [<code>Promise.&lt;PoSBlock&gt;</code>](#PoSBlock)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>Hash</code> | The hash of PoS block |

<a name="getBlockByNumber"></a>

## .getBlockByNumber ⇒ [<code>Promise.&lt;PoSBlock&gt;</code>](#PoSBlock)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| blockNumber | <code>number</code> \| <code>hex</code> | The number of PoS block |

<a name="getCommittee"></a>

## .getCommittee ⇒ [<code>Promise.&lt;PoSCommittee&gt;</code>](#PoSCommittee)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| [blockNumber] | <code>number</code> \| <code>hex</code> | Optional block number |

<a name="getTransactionByNumber"></a>

## .getTransactionByNumber ⇒ [<code>Promise.&lt;PoSTransaction&gt;</code>](#PoSTransaction)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| txNumber | <code>number</code> \| <code>hex</code> | The number of transaction |

<a name="getRewardsByEpoch"></a>

## .getRewardsByEpoch ⇒ [<code>Promise.&lt;PoSEpochRewards&gt;</code>](#PoSEpochRewards)
**Kind**: instance member  

| Param | Type | Description |
| --- | --- | --- |
| epoch | <code>number</code> \| <code>hex</code> | A PoS epoch number |

