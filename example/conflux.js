/* eslint-disable */

const Conflux = require('../src');
const unit = require('../src/util/unit');

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  console.log(await cfx.getGasPrice()); // 819n
  console.log(await cfx.getEpochNumber()); // 234686

  const balance = await cfx.getBalance('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
  console.log(balance); // 937499420597305000n
  console.log(unit.fromDripToGDrip(balance)); // 937499420n
  console.log(unit.fromDripToCFX(balance)); // 0n
  console.log(balance.toString()); // "937499420597305000"

  console.log(await cfx.getTransactionCount('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b'));
  console.log(await cfx.getBlocksByEpochNumber(233211));
  console.log(await cfx.getBlockByEpochNumber(233211));
  console.log(await cfx.getBlockByEpochNumber(233211, true));
  console.log(await cfx.getBlockByHash('0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80'));
  console.log(await cfx.getBlockByHash('0xc6fd0c924b1bb2a828d622b46bad4c3806bc1b778f545adb457c5de0aedd0e80', true));
  console.log(await cfx.getTransactionByHash('0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530'));
  console.log(await cfx.getTransactionReceipt('0x62c94c660f6ae9191bd3ff5e6c078015f84a3ad3f22e14c97f3b1117549b8530'));

  const iter = cfx.getLogs({
    address: '0xfee5137bc15b602b4218b06613645538a3f5512e',
    fromEpoch: 228412,
    toEpoch: 228459,
  });
  for await (const log of iter) {
    console.log(log);
  }

  /*
    Direct RPC call.
     you also can call method by rpc directly, but you should format arguments and parse return value your self.

     JSON-RPC API @see https://conflux-chain.github.io/conflux-doc/json-rpc/
   */
  // console.log(await cfx.provider.call('cfx_gasPrice')); // 0x333
  // console.log(await cfx.provider.call('cfx_epochNumber')); // 0x394be
  // console.log(await cfx.provider.call('cfx_getBalance', '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b')); // 0xd02aac185d63ea8
}

main().catch(e => console.error(e));
