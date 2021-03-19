const Transaction = require('../Transaction');
const { MIN_GAS_PRICE } = require('../CONST');
const sign = require('./sign');
const format = require('./format');

function parseSignature(sig) {
  return {
    r: sig.slice(0, 66),
    s: `0x${sig.slice(66, 66 + 64)}`,
    v: Number(`0x${sig.slice(66 + 64, 66 + 66)}`) - 27,
  };
}

async function signWithMetaMask(txInfo) {
  const tx = new Transaction(txInfo);
  const unsignedHash = format.hex(sign.keccak256(tx.encode(false)));
  /* eslint-disable */
  const signature = await ethereum.request({
    method: 'eth_sign',
    params: [ethereum.selectedAddress, unsignedHash],
  });
  const sigInfo = parseSignature(signature);
  tx.r = sigInfo.r;
  tx.s = sigInfo.s;
  tx.v = sigInfo.v;
  return tx.serialize();
}

async function useEthereumPrepareTx(txInfo, callRPC) {
  if (!txInfo.chainId) {
    txInfo.chainId = await callRPC({ method: 'eth_chainId' });
  }
  if (!txInfo.gasPrice) {
    txInfo.gasPrice = MIN_GAS_PRICE;
  }
  if (!txInfo.nonce) {
    txInfo.nonce = await callRPC({ method: 'eth_getTransactionCount', params: [txInfo.from] });
  }
  if (!txInfo.epochHeight) {
    txInfo.epochHeight = await callRPC({ method: 'eth_blockNumber', params: [] });
  }
}

function wrapEthereum(provider) {
  if (typeof ethereum === 'undefined') {
    throw new Error('MetaMask is not installed!');
  }
  const originRequest = provider.request;

  async function request(payload) {
    const { method, params } = payload;
    if (method !== 'eth_sendTransaction') {
      return originRequest(payload);
    }
    const txInfo = params[0];
    if (!txInfo.gas || !txInfo.storageLimit) {
      throw new Error("'gas' and 'storageLimit' field is needed");
    }
    await useEthereumPrepareTx(txInfo, originRequest);
    const rawTx = await signWithMetaMask(txInfo);
    return originRequest({
      method: 'eth_sendRawTransaction',
      params: [rawTx],
    });
  }

  provider.request = request.bind(provider);
}

async function useConfluxPrepareTx(txInfo, callRPC) {
  if (!txInfo.chainId) {
    const { chainId } = await callRPC('cfx_getStatus');
    txInfo.chainId = chainId;
  }
  if (!txInfo.gas || !txInfo.storageLimit) {
    let chainId = Number(txInfo.chainId);
    if(isNaN(chainId)) {
      throw new Error('Invalid chainId');
    }
    txInfo = format.callTxAdvance()(txInfo);
    const { gasLimit, storageCollateralized } = await callRPC('cfx_estimateGasAndCollateral', txInfo);
    if (!txInfo.gas) {
      txInfo.gas = gasLimit;
    }
    if (!txInfo.storageLimit) {
      txInfo.storageLimit = storageCollateralized;
    }
  }
  if (!txInfo.gasPrice) {
    txInfo.gasPrice = MIN_GAS_PRICE;
  }
  if (!txInfo.nonce) {
    txInfo.nonce = await callRPC('cfx_getNextNonce', txInfo.from);
  }
  if (!txInfo.epochHeight) {
    txInfo.epochHeight = await callRPC('cfx_epochNumber');
  }
  return txInfo;
}

function wrapConflux(provider) {
  if (typeof ethereum === 'undefined') {
    throw new Error('MetaMask is not installed!');
  }
  const originRequest = provider.call.bind(provider);

  async function request(method, ...params) {
    if (method !== 'cfx_sendTransaction') {
      return originRequest(method, ...params);
    }
    let txInfo = params[0];
    txInfo = await useConfluxPrepareTx(txInfo, originRequest);
    const rawTx = await signWithMetaMask(txInfo);
    return originRequest('cfx_sendRawTransaction', rawTx);
  }

  provider.call = request.bind(provider);
}

module.exports = {
  wrapEthereum,
  wrapConflux,
};
