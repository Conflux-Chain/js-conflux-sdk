const { ACTION_TYPES, CALL_STATUS } = require('../CONST');
const Contract = require('../contract');
const { ERROR_ABI: abi } = require('../contract/standard');
const { decodeHexEncodedStr } = require('./index');

// Reorg an traces array in tree structure
function tracesInTree(txTrace) {
  const result = [];
  const stack = [];
  const levelCalls = {};
  let maxLevel = 0;
  if (!txTrace || txTrace.length === 0) return [];
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
      if (stack.length === 0) {
        result.push(txTrace[tp.index]);
      }
    } else {
      // set parent relation and invoke level
      if (stack.length > 0) {
        const ta = txTrace[stack[stack.length - 1].index];
        t.parent = ta.index;
        t.level = ta.level + 1;
        if (t.level > maxLevel) {
          maxLevel = t.level;
        }
      }

      if (!levelCalls[t.level]) levelCalls[t.level] = [];

      levelCalls[t.level].push(t.index);
      // if is a  call or create push to stack top
      if (t.type === ACTION_TYPES.CALL || t.type === ACTION_TYPES.CREATE) {
        stack.push(t);
      } else if (t.type === ACTION_TYPES.INTERNAL_TRANSFER_ACTION && stack.length === 0) {
        result.push(t);
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
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < result.length; i++) {
    _cleanTrace(result[i]);
  }
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
  if (action.outcome === CALL_STATUS.REVERTED && action.returnData !== '0x') {
    const decoded = errorContract.abi.decodeData(action.returnData);
    errorMessage = decoded ? decoded.object.message : '';
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
