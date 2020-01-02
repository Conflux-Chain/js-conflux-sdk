/* eslint-disable */

const Conflux = require('../src');
const unit = require('../src/util/unit');

const fromCFXToDrip = unit.converter('cfx', 'drip');

const PRIVATE_KEY_1 = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717b....................';
const PRIVATE_KEY_2 = '0x52a937219bbc01a232236ee16ec098e4acc951ec7a80....................';

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  const account1 = cfx.wallet.add(PRIVATE_KEY_1);
  const account2 = cfx.wallet.add(PRIVATE_KEY_2);
  console.log(account1.address); // 0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b
  console.log(account2.address); // 0x1ead8630345121d19ee3604128e5dc54b36e8ea6

  // --------------------------- sendTransaction ------------------------------

  // case 1: send transaction and get txHash
  const txHash = await cfx.sendTransaction({
    from: account1,
    to: account2,
    value: fromCFXToDrip(0.02),
  });
  console.log(txHash); // 0xaf93e8764813ded1e64b427d5f793a5c9e064f63f5e99492844f4eafae0a0add

  // FIXME: user might need to wait few seconds here

  // case 2: send transaction and await XXX status
  const promise = cfx.sendTransaction({
    // nonce: if nonce miss, auto call `cfx.getTransactionCount` to get nonce, if you have a batch of transaction to be send, you **must** query `nonce` and increase manual.
    from: account1,
    to: account2,
    value: fromCFXToDrip(0.03),
  });

  console.log(await promise); // await and get txHash
  console.log(await promise.get()); // await and get transaction
  console.log(await promise.mined()); // await till mined
  console.log(await promise.executed()); // await till executed
  console.log(await promise.confirmed({ threshold: 0.01 })); // await till risk coefficient < threshold

  // FIXME: user might need to wait few seconds here

  // case 3: sign and send transaction manual
  const nonce = await cfx.getTransactionCount(account1);
  const tx = account1.signTransaction({
    nonce,
    to: account2,
    value: fromCFXToDrip(0.02),
    gasPrice: 100,
    gas: 1000000,
  });

  console.log(tx);
  console.log(tx.from === account1.address); // true
  console.log(tx.hash); // 0xfbc52b40335f6daae14bebced4f23b654d8db8c89f631b711828a8cd9a4994ca
  console.log(tx.serialize()); // 0xf8671c64830f4240941e...

  // ------------------------- sendRawTransaction -----------------------------

  // `const txHash = await cfx.sendRawTransaction(tx.serialize());` as case 1
  // `const promise = cfx.sendRawTransaction(tx.serialize());` as case 2
}

main().catch(e => console.error(e));
