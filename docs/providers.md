# Providers

The provider is how blockchain SDK talks to the blockchain. Providers take JSON-RPC requests and return the response. This is normally done by submitting the request to an HTTP or Websocket based server.

## Choosing How to Connect to Your Node

Most nodes have a variety of ways to connect to them. The most common ways to connect to your node are:

* IPC (uses local filesystem: fastest and most secure)
* Websockets (works remotely, faster than HTTP)
* HTTP (more nodes support it)

Currently js-conflux-sdk has support for both `HTTP` and `Websockets`. Normally websockets is recommended than HTTP, because it's faster and can use [Pub/Sub methods](https://developer.conflux-chain.org/conflux-doc/docs/pubsub). If you want use the PubSub API, websocket provider is the only choice. Conflux-rust's HTTP default port is `12537`, websocket default port is `12535`. They can be change through [config file](https://developer.conflux-chain.org/apis/en/node_config_example).

When initialize a Conflux object, the underline provider can be configured through the `url` option. If you want use HTTP provider then provide a HTTP URL:

```js
const cfx = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,
})
```

If want use websockts provider then provide a WSS URL.

```js
const cfx = new Conflux({
  url: 'wss://test.confluxrpc.com',
  networkId: 1,
})
```

## Connect through Conflux Portal

An Dapp can connect through Conflux Blockchain through [Portal](https://portal.conflux-chain.org/). Which is a browser extension that provides:

* A connection to the Conflux network (a Provider)
* Holds your private key and can sign things (a Signer)

js-conflux-sdk can work with Portal to talk with Conflux blockchain, simply by set `conflux` to `Conflux` instance's provider.

```js
// Firstly initialize the Conflux object without url
// Here Conflux indicate the SDK, Conflux.Conflux is the class used to talk with blockchain
let cfx = new Conflux.Conflux({
  networkId: 1,
});
// "conflux" indicate the portal's browser object
cfx.provider = conflux;
```
