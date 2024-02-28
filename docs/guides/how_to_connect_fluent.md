# How to Connect Fluent Wallet

## Fluent Wallet

[Fluent Wallet](https://fluentwallet.com/) is a Conflux Core Space wallet that allows you to manage your assets and interact with the Conflux network. It is a secure, non-custodial wallet that allows you to store, send, and receive CFX and other Conflux-based assets.

You can install it from Chrome Web Store, it's use experience is similar to MetaMask.

Fluent Wallet injects a global `conflux` object into the browser (as detailed in the [provider API documentation](https://docs.fluentwallet.com/conflux/reference/provider-api/)). This object enables interaction between DApps and Fluent Wallet, allowing actions such as retrieving account information and initiating transactions.

The js-conflux-sdk also supports Fluent Wallet by simply configuring the SDK instance's provider to the `conflux` object. This setup enables the use of js-conflux-sdk within a DApp to initiate transactions through Fluent Wallet.

```js
import { Conflux, Drip } from 'js-conflux-sdk';

const cfxClient = new Conflux();
// Actually,it is the window.conflux injected by Fluent Wallet. You can also access via window.conflux
cfxClient.provider = conflux;
conflux.on('chainChanged', cfxClient.updateNetworkId);

// Request accounts from fluent wallet, it will pop up a window to let user select account to connect with DApp when the DApp is first connected.
let accounts = await cfxClient.provider.request({ method: 'cfx_requestAccounts', params: [] });

// the you can use cfxClient to perform any operations that js-conflux-sdk supports.
let status = await cfxClient.getStatus();
console.log('chainId: ', status.chainId);

// the send transaction experience is same as js-conflux-sdk
let txHash = await cfxClient.cfx.sendTransaction({
  from: accounts[0],
  to: 'cfx:xxx',
  value: Drip.fromCFX(1),
});
// this will pop up a window to let user confirm the transaction.
```

To learn more about how to use js-conflux-sdk with Fluent Wallet, please refer to the [Fluent Wallet 'how to' guide](https://docs.fluentwallet.com/conflux/how-to/use-sdk/)