<a name="BaseProvider"></a>

## BaseProvider
**Kind**: global class  

* [BaseProvider](#BaseProvider)
    * [new BaseProvider([options])](#new_BaseProvider_new)
    * [.requestId()](#BaseProvider+requestId) ⇒ <code>string</code>
    * [.request(data)](#BaseProvider+request) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.call(method, ...params)](#BaseProvider+call) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.send(method, [params])](#BaseProvider+send) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.batch(array)](#BaseProvider+batch) ⇒ <code>Promise.&lt;Array&gt;</code>

<a name="new_BaseProvider_new"></a>

### new BaseProvider([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| options.url | <code>string</code> |  | Full json rpc http url |
| [options.timeout] | <code>number</code> | <code>30*1000</code> | Request time out in ms |
| [options.retry] | <code>number</code> | <code>1</code> | Retry number |
| [options.keepAlive] | <code>boolean</code> | <code>false</code> | Whether open the http keep-alive option |
| [options.logger] | <code>object</code> |  | Logger with `info` and `error` |

<a name="BaseProvider+requestId"></a>

### baseProvider.requestId() ⇒ <code>string</code>
Gen a random json rpc id.
It is used in `call` method, overwrite it to gen your own id.

**Kind**: instance method of [<code>BaseProvider</code>](#BaseProvider)  
<a name="BaseProvider+request"></a>

### baseProvider.request(data) ⇒ <code>Promise.&lt;\*&gt;</code>
Call a json rpc method with params

**Kind**: instance method of [<code>BaseProvider</code>](#BaseProvider)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Json rpc method return value.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.method | <code>string</code> | Json rpc method name. |
| [data.params] | <code>array</code> | Json rpc method params. |

**Example**  
```js
> await provider.request({method: 'cfx_epochNumber'});
> await provider.request({method: 'cfx_getBlockByHash', params: [blockHash]});
```
<a name="BaseProvider+call"></a>

### baseProvider.call(method, ...params) ⇒ <code>Promise.&lt;\*&gt;</code>
Call a json rpc method with params

**Kind**: instance method of [<code>BaseProvider</code>](#BaseProvider)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Json rpc method return value.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Json rpc method name. |
| ...params | <code>Array.&lt;any&gt;</code> | Json rpc method params. |

**Example**  
```js
> await provider.call('cfx_epochNumber');
> await provider.call('cfx_getBlockByHash', blockHash);
```
<a name="BaseProvider+send"></a>

### baseProvider.send(method, [params]) ⇒ <code>Promise.&lt;\*&gt;</code>
Send a json rpc method request

**Kind**: instance method of [<code>BaseProvider</code>](#BaseProvider)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - Json rpc method return value.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Json rpc method name. |
| [params] | <code>array</code> | Json rpc method params. |

**Example**  
```js
> await provider.send('cfx_epochNumber');
> await provider.send('cfx_getBlockByHash', [blockHash]);
```
<a name="BaseProvider+batch"></a>

### baseProvider.batch(array) ⇒ <code>Promise.&lt;Array&gt;</code>
Batch call json rpc methods with params

**Kind**: instance method of [<code>BaseProvider</code>](#BaseProvider)  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array.&lt;object&gt;</code> | Array of object with "method" and "params" |

**Example**  
```js
> await provider.batch([
  { method: 'cfx_epochNumber' },
  { method: 'cfx_getBalance', params: ['cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp'] },
  { method: 'InValidInput' },
])
   [ '0x3b734d', '0x22374d959c622f74728', RPCError: Method not found ]
```
