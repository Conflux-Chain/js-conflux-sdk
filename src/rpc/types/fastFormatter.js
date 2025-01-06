function maybeBigInt(v, prop) {
  if (v[prop] === undefined) {
    return;
  }
  v[prop] = BigInt(v[prop]);
}

function fastFormatAction(v) {
  maybeBigInt(v.action, 'value');
  maybeBigInt(v.action, 'gas');
  maybeBigInt(v.action, 'gasLeft');
  maybeBigInt(v, 'epochNumber');
  maybeBigInt(v, 'transactionPosition');
  return v;
}

function fastFormatTxTraces(v) {
  v.traces.forEach(fastFormatAction);
  v.transactionPosition = BigInt(v.transactionPosition);
  return v;
}

function fastFormatBlockTraces(v) {
  v.transactionTraces.forEach(fastFormatTxTraces);
  v.epochNumber = parseInt10(v.epochNumber);

  return v;
}
function parseInt10(v) {
  return parseInt(v, 10);
}
// receipt
function fastFormatReceipt(v) {
  v.type = v.type ? parseInt10(v.type) : null;
  v.index = v.index ? parseInt10(v.index) : null;
  v.epochNumber = BigInt(v.epochNumber);
  v.outcomeStatus = v.outcomeStatus ? parseInt10(v.outcomeStatus) : null;
  v.gasUsed = BigInt(v.gasUsed);
  v.effectiveGasPrice = v.effectiveGasPrice ? BigInt(v.effectiveGasPrice) : null;
  v.burntGasFee = v.burntGasFee ? BigInt(v.burntGasFee) : null;
  v.gasFee = BigInt(v.gasFee);
  v.storageCollateralized = BigInt(v.storageCollateralized);
  if (v.storageReleased) {
    v.storageReleased.forEach(r => {
      r.collaterals = BigInt(r.collaterals);
    });
  }
}

function fastFormatEpochReceipts(v2d) {
  v2d.forEach(v => {
    v.forEach(fastFormatReceipt);
  });

  return v2d;
}

function fastFormatTx(v) {
  v.type = v.type ? parseInt10(v.type) : null;
  v.nonce = BigInt(v.nonce);
  v.gasPrice = v.gasPrice ? BigInt(v.gasPrice) : null;
  v.maxPriorityFeePerGas = v.maxPriorityFeePerGas ? BigInt(v.maxPriorityFeePerGas) : null;
  v.maxFeePerGas = v.maxFeePerGas ? BigInt(v.maxFeePerGas) : null;
  v.gas = BigInt(v.gas);
  v.value = BigInt(v.value);
  v.storageLimit = BigInt(v.storageLimit);
  v.epochHeight = BigInt(v.epochHeight);
  v.chainId = parseInt10(v.chainId);
  v.v = parseInt10(v.v);
  v.yParity = v.yParity ? parseInt10(v.yParity) : null;
  v.status = v.status ? parseInt10(v.status) : null;
  v.transactionIndex = v.transactionIndex ? parseInt10(v.transactionIndex) : null;
}

function fastFormatBlock(v) {
  v.baseFeePerGas = v.baseFeePerGas ? BigInt(v.baseFeePerGas) : null;
  v.epochNumber = v.epochNumber ? parseInt10(v.epochNumber) : null;
  v.blockNumber = v.blockNumber ? parseInt10(v.blockNumber) : null;
  v.blame = parseInt10(v.blame);
  v.height = parseInt10(v.height);
  v.size = parseInt10(v.size);
  v.timestamp = parseInt10(v.timestamp);
  maybeBigInt(v, 'gasLimit');
  maybeBigInt(v, 'gasUsed');
  maybeBigInt(v, 'difficulty');
  v.transactions.forEach(fastFormatTx);

  return v;
}

module.exports = { fastFormatBlockTraces, fastFormatEpochReceipts, fastFormatBlock };
