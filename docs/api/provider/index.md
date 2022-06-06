<a name="providerFactory"></a>

## providerFactory(options) ⇒ <code>WebsocketProvider</code> \| <code>HttpProvider</code> \| <code>BaseProvider</code> \| <code>WechatProvider</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.url | <code>string</code> |  |
| [options.useWechatProvider] | <code>boolean</code> | Whether use wechat provider. |

**Example**  
```js
> providerFactory()
 BaseProvider {
    url: undefined,
    timeout: 300000,
    logger: { info: [Function: info], error: [Function: error] }
  }
```
**Example**  
```js
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
