<a name="WebSocketProvider"></a>

## WebSocketProvider
Websocket protocol json rpc provider.

**Kind**: global class  
<a name="new_WebSocketProvider_new"></a>

### new WebSocketProvider([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | See [W3CWebSocket](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/W3CWebSocket.md) |
| options.url | <code>string</code> |  | Full json rpc http url |
| [options.timeout] | <code>number</code> | <code>30*1000</code> | Request time out in ms |
| [options.logger] | <code>object</code> |  | Logger with `info` and `error` |
| [options.protocols] | <code>Array.&lt;string&gt;</code> |  | See [w3](https://www.w3.org/TR/websockets/) |
| [options.origin] | <code>string</code> |  |  |
| [options.headers] | <code>object</code> |  |  |
| [options.requestOptions] | <code>object</code> |  |  |
| [options.clientConfig] | <code>object</code> |  | See [websocket/lib/WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/WebSocketClient.md) |
| [options.clientConfig.maxReceivedFrameSize] | <code>number</code> | <code>0x100000</code> | 1MiB max frame size. |
| [options.clientConfig.maxReceivedMessageSize] | <code>number</code> | <code>0x800000</code> | 8MiB max message size, only applicable if assembleFragments is true |
| [options.clientConfig.closeTimeout] | <code>number</code> | <code>5000</code> | The number of milliseconds to wait after sending a close frame for an acknowledgement to come back before giving up and just closing the socket. |

