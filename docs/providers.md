# Providers

The provider is how blockchain SDK talks to the blockchain. Providers take JSON-RPC requests and return the response. This is normally done by submitting the request to an HTTP or Websocket based server.

## Choosing How to Connect to Your Node

Most nodes have a variety of ways to connect to them. The most common ways to connect to your node are:

- Websockets (works remotely, faster than HTTP)
- HTTP (more nodes support it)

Currently, js-conflux-sdk has support for both `HTTP` and `Websockets`. Normally, websockets is recommended than HTTP, because it's faster and can use [Pub/Sub methods](https://developer.conflux-chain.org/conflux-doc/docs/pubsub). If you want to use the PubSub API, websocket provider is the only choice. Conflux-rust's HTTP default port is `12537`, websocket default port is `12535`. They can be changed through [config file](https://developer.conflux-chain.org/apis/en/node_config_example).

When initialize a Conflux object, the underline provider can be configured through the `url` option. If you want to use HTTP provider, then provide an HTTP URL:

```js
const cfxClient = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,
});
```

If want use websockts provider then provide a WSS URL.

```js
const cfxClient = new Conflux({
  url: 'wss://test.confluxrpc.com',
  networkId: 1,
});
```

## Connect through Fluent Wallet

A Dapp can connect Conflux Blockchain through [Fluent](https://fluentwallet.com/), which is a browser extension that provides:

- A connection to the Conflux network (a Provider)
- Holds your private key and helps you sign things (a Signer)

js-conflux-sdk (v2) can work with Fluent to talk with Conflux blockchain, simply by set `conflux` to the `Conflux` instance's provider.

Note: Fluent wallet won't export `window.confluxJS` anymore, Dapp developers need to install `js-conflux-sdk` by themselves and set `Conflux` instance's provider to Fluent provider.

```js
// Firstly initialize the Conflux object without url
// Here Conflux indicate the SDK, TreeGraph.Conflux is the class used to talk with blockchain
const cfxClient = new TreeGraph.Conflux({
  networkId: 1,
});
// "conflux" indicate the fluent's browser object
cfxClient.provider = conflux;
// update sdk network id when chain changed
conflux.on('chainChanged', cfxClient.updateNetworkId);
```

If you can't determine the `networkId` of the selected network of Fluent, you can get it asynchronously like below.

```js
const cfxClient = new TreeGraph.Conflux();
cfxClient.provider = conflux;
conflux.on('chainChanged', cfxClient.updateNetworkId);
await cfxClient.updateNetworkId();
```
