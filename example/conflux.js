/* eslint-disable */

const Conflux = require('../src');
const { Drip } = require('../src/utils/type');

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  console.log(await cfx.getGasPrice()); // 0
  console.log(await cfx.getEpochNumber()); // 823992

  const balance = await cfx.getBalance('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
  console.log(balance); // BigNumber
  console.log(balance.toString()); // 999999889185008600
  console.log(Drip.toCFX(balance).toString()); // 0.9999998891850086

  console.log(await cfx.getTransactionCount('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'));

  console.log(await cfx.getBlocksByEpochNumber(823498));
  console.log(await cfx.getBlockByEpochNumber(823498));
  console.log(await cfx.getBlockByEpochNumber(823498, true));
  console.log(await cfx.getBlockByHash('0x1372b2a02c6f198037587863a8bd1044e0fbb8444cace771fd0f2120461da35f'));
  console.log(await cfx.getBlockByHash('0x1372b2a02c6f198037587863a8bd1044e0fbb8444cace771fd0f2120461da35f', true));
  console.log(await cfx.getTransactionByHash('0x8079e8fe30fd88e351c6f51a7b2dc81df847ca1395a248af240bca31d74221d9'));
  console.log(await cfx.getTransactionReceipt('0x8079e8fe30fd88e351c6f51a7b2dc81df847ca1395a248af240bca31d74221d9'));

  const iter = cfx.getLogs({
    address: '0x32116df84f12e1fc936720a57bbdcba2a1e1ff05',
    fromEpoch: 545896,
    toEpoch: 660500,
  });
  for await (const log of iter) {
    console.log(log);
  }
}

main().catch(e => console.error(e));
