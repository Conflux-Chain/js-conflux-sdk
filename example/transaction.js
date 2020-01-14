/* eslint-disable */

const Conflux = require('../src');
const unit = require('../src/util/unit');

const PRIVATE_KEY = '0xa816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393';
const ADDRESS = '0x1ead8630345121d19ee3604128e5dc54b36e8ea6';

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  const account = cfx.wallet.add(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // --------------------------- sendTransaction ------------------------------

  // case 1: send transaction and get txHash
  const txHash = await cfx.sendTransaction({
    from: account,
    to: ADDRESS,
    value: unit.fromGDripToDrip(123),
  });
  console.log(txHash); // 0x4cda8297fc16e2d02018f0ffd484a3f9d38b1f500fe78d1a8451633e354f0c97

  // FIXME: user might need to wait few seconds here

  // case 2: send transaction and await XXX status
  const promise = cfx.sendTransaction({
    // nonce: if nonce miss, auto call `cfx.getTransactionCount` to get nonce, if you have a batch of transaction to be send, you **must** query `nonce` and increase manual.
    from: account,
    to: ADDRESS,
    value: unit.fromGDripToDrip(456),
  });

  console.log(await promise); // await and get txHash
  console.log(await promise.get()); // await and get transaction
  console.log(await promise.mined()); // await till mined
  console.log(await promise.executed()); // await till executed
  console.log(await promise.confirmed({ threshold: 0.01 })); // await till risk coefficient < threshold

  // FIXME: user might need to wait few seconds here

  // case 3: sign and send transaction manual
  const nonce = await cfx.getTransactionCount(account);
  const tx = account.signTransaction({
    nonce,
    to: ADDRESS,
    value: unit.fromGDripToDrip(789),
    gasPrice: 100,
    gas: 1000000,
  });

  console.log(tx);
  console.log(tx.from === account.address); // true
  console.log(tx.hash); // 0x59541e47db709715fc407eb69a249f5dbabb55d6c06f328809fb24523f4a2cf4
  console.log(tx.serialize()); // 0xf8650564830f4240941ead86303451...
  // then
  // `const txHash = await cfx.sendRawTransaction(tx.serialize());` as case 1
  // `const promise = cfx.sendRawTransaction(tx.serialize());` as case 2
}

main().catch(e => console.error(e));
