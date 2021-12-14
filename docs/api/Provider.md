- provider
    - BaseProvider.js
        - BaseProvider
            - [**constructor**](#provider/BaseProvider.js/BaseProvider/**constructor**)
            - [requestId](#provider/BaseProvider.js/BaseProvider/requestId)
            - [call](#provider/BaseProvider.js/BaseProvider/call)
            - [batch](#provider/BaseProvider.js/BaseProvider/batch)
    - HttpProvider.js
        - [HttpProvider](#provider/HttpProvider.js/HttpProvider)
    - WebSocketProvider.js
        - WebSocketProvider
            - [**constructor**](#provider/WebSocketProvider.js/WebSocketProvider/**constructor**)
    - index.js
        - [providerFactory](#provider/index.js/providerFactory)

----------------------------------------

### BaseProvider <a id="provider/BaseProvider.js/BaseProvider"></a>



#### BaseProvider.prototype.**constructor** <a id="provider/BaseProvider.js/BaseProvider/**constructor**"></a>

* **Parameters**

Name              | Type      | Required | Default   | Description
------------------|-----------|----------|-----------|----------------------------------------
options           | `object`  | false    |           |
options.url       | `string`  | true     |           | Full json rpc http url
options.timeout   | `number`  | false    | 5*60*1000 | Request time out in ms
options.retry     | `number`  | false    | 1         | Retry number
options.keepAlive | `boolean` | false    | false     | Whether open the http keep-alive option
options.logger    | `object`  | false    |           | Logger with `info` and `error`

* **Returns**

`BaseProvider` 

#### BaseProvider.prototype.requestId <a id="provider/BaseProvider.js/BaseProvider/requestId"></a>

Gen a random json rpc id.
It is used in `call` method, overwrite it to gen your own id.

* **Returns**

`string` 

#### BaseProvider.prototype.call <a id="provider/BaseProvider.js/BaseProvider/call"></a>

Call a json rpc method with params

* **Parameters**

Name      | Type     | Required | Default | Description
----------|----------|----------|---------|------------------------
method    | `string` | true     |         | Json rpc method name.
...params | `array`  | false    |         | Json rpc method params.

* **Returns**

`Promise.<*>` Json rpc method return value.

* **Examples**

```
> await provider.call('cfx_epochNumber');
> await provider.call('cfx_getBlockByHash', blockHash);
```

#### BaseProvider.prototype.batch <a id="provider/BaseProvider.js/BaseProvider/batch"></a>

Batch call json rpc methods with params

* **Parameters**

Name  | Type             | Required | Default | Description
------|------------------|----------|---------|-------------------------------------------
array | `Array.<object>` | true     |         | Array of object with "method" and "params"

* **Returns**

`Promise.<Array>` 

* **Examples**

```
> await provider.batch([
  { method: 'cfx_epochNumber' },
  { method: 'cfx_getBalance', params: ['cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp'] },
  { method: 'InValidInput' },
])
   [ '0x3b734d', '0x22374d959c622f74728', RPCError: Method not found ]
```

----------------------------------------

### HttpProvider <a id="provider/HttpProvider.js/HttpProvider"></a>

Http protocol json rpc provider.

----------------------------------------

### WebSocketProvider <a id="provider/WebSocketProvider.js/WebSocketProvider"></a>

Websocket protocol json rpc provider.

#### WebSocketProvider.prototype.**constructor** <a id="provider/WebSocketProvider.js/WebSocketProvider/**constructor**"></a>

* **Parameters**

Name                                        | Type             | Required | Default  | Description
--------------------------------------------|------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------
options                                     | `object`         | false    |          | See [W3CWebSocket](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/W3CWebSocket.md)
options.url                                 | `string`         | true     |          | Full json rpc http url
options.timeout                             | `number`         | false    | 60*1000  | Request time out in ms
options.logger                              | `object`         | false    |          | Logger with `info` and `error`
options.protocols                           | `Array.<string>` | false    |          | See [w3](https://www.w3.org/TR/websockets/)
options.origin                              | `string`         | false    |          |
options.headers                             | `object`         | false    |          |
options.requestOptions                      | `object`         | false    |          |
options.clientConfig                        | `object`         | false    |          | See [websocket/lib/WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/WebSocketClient.md)
options.clientConfig.maxReceivedFrameSize   | `number`         | false    | 0x100000 | 1MiB max frame size.
options.clientConfig.maxReceivedMessageSize | `number`         | false    | 0x800000 | 8MiB max message size, only applicable if assembleFragments is true
options.clientConfig.closeTimeout           | `number`         | false    | 5000     | The number of milliseconds to wait after sending a close frame for an acknowledgement to come back before giving up and just closing the socket.

* **Returns**

`WebSocketProvider` 

----------------------------------------

### providerFactory <a id="provider/index.js/providerFactory"></a>

* **Parameters**

Name        | Type     | Required | Default | Description
------------|----------|----------|---------|------------
options     | `object` | true     |         |
options.url | `string` | true     |         |

* **Returns**

`WebsocketProvider,HttpProvider,BaseProvider` 

* **Examples**

```
> providerFactory()
 BaseProvider {
    url: undefined,
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
```

```
> providerFactory({ url: 'http://localhost:12537' })
 HttpProvider {
    url: 'http://localhost:12537',
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
> providerFactory({
    url: 'http://main.confluxrpc.org',
    timeout: 60 * 60 * 1000,
    logger: console,
  }
 HttpProvider {
    url: 'http://main.confluxrpc.org',
    timeout: 3600000,
    logger: {...}
  }
```