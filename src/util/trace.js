const { ACTION_TYPES, CALL_STATUS, POCKET_ENUM } = require('../CONST');
const Contract = require('../contract/Contract');
const { ERROR_ABI: abi } = require('../contract/standard');
const { decodeHexEncodedStr } = require('./index');

// Reorg an traces array in tree structure
function tracesInTree(txTrace) {
  const result = [];
  const stack = [];
  const levelCalls = {};
  let maxLevel = 0;
  if (!txTrace || txTrace.length === 0) return [];
  // If the first trace's type is 'internal_transfer_action'(gas_payment) then remove it from array
  if (txTrace[0].type === ACTION_TYPES.INTERNAL_TRANSFER_ACTION) {
    const tLen = txTrace.length;
    result.push(txTrace[0]); // gas_payment
    if (txTrace[tLen - 2].type === ACTION_TYPES.INTERNAL_TRANSFER_ACTION && txTrace[tLen - 2].action.toPocket === POCKET_ENUM.STORAGE_COLLATERAL) {
      result.push(txTrace[tLen - 2]); // storage_collateral
      txTrace = txTrace.slice(0, tLen - 1);
    }
    result.push(txTrace[txTrace.length - 1]); // gas_refund
    txTrace = txTrace.slice(1, txTrace.length - 1);
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < txTrace.length; i++) {
    const t = txTrace[i];
    // set basic info
    t.index = i;
    t.level = 0;
    t.calls = [];

    if (t.type === ACTION_TYPES.CALL_RESULT || t.type === ACTION_TYPES.CREATE_RESULT) {
      // if the result is fail or reverted then decode the returnData
      t.action.decodedMessage = _decodeErrorMessage(t.action);
      // set result
      const tp = stack.pop();
      txTrace[tp.index].result = t.action;
    } else {
      // set parent relation and invoke level
      if (stack.length > 0) {
        const ta = txTrace[stack[stack.length - 1].index];
        t.parent = ta.index;
        t.level = ta.level + 1;
        if (t.level > maxLevel) maxLevel = t.level;
      }
      //
      if (!levelCalls[t.level]) {
        levelCalls[t.level] = [];
      }
      levelCalls[t.level].push(t.index);
      // if is a  call or create push to stack top
      if (t.type === ACTION_TYPES.CALL || t.type === ACTION_TYPES.CREATE) {
        stack.push(t);
      }
    }
  }

  // eslint-disable-next-line no-plusplus
  for (let i = maxLevel; i > 0; i--) {
    for (const index of levelCalls[i]) {
      const item = txTrace[index];
      txTrace[item.parent].calls.push(item);
      _cleanTrace(item);
    }
  }
  result.splice(1, 0, txTrace[0]);
  return result;
}

function _cleanTrace(trace) {
  delete trace.index;
  delete trace.level;
  delete trace.parent;
}

const errorContract = new Contract({ abi });

function _decodeErrorMessage(action) {
  let errorMessage;
  if (action.outcome === CALL_STATUS.REVERTED) {
    const decoded = errorContract.abi.decodeData(action.returnData);
    errorMessage = decoded.object.message;
  }
  if (action.outcome === CALL_STATUS.FAIL) {
    errorMessage = decodeHexEncodedStr(action.returnData);
    errorMessage = decodeHexEncodedStr(errorMessage); // decode second time
  }
  return errorMessage;
}

module.exports = {
  tracesInTree,
};
