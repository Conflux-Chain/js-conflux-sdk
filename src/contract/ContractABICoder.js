const lodash = require('lodash');
const ContractConstructor = require('./ContractConstructor');
const ContractMethod = require('./ContractMethod');
const ContractEvent = require('./ContractEvent');

class ContractABICoder {
  constructor(contract) {
    this._constructorFunction = null;
    this._codeToInstance = {};

    lodash.forEach(contract, instance => {
      switch (instance.constructor) {
        case ContractConstructor:
          this._constructorFunction = instance;
          break;

        case ContractMethod:
        case ContractEvent:
          Object.keys(instance.signatureToCoder).forEach(signature => {
            this._codeToInstance[signature] = instance;
          });
          break;

        default:
          break;
      }
    });
  }

  findByteCodeIndex(dataStr) {
    const isArrayCoder = type => {
      return type.match(/^(.*)\[([0-9]*)]$/);
    };
    const coders = this._constructorFunction.coder.inputCoder.coders;
    let indexFromLast = 0;
    const stepNum = 64;
    const staticList = [];
    const dynamicList = [];
    coders.forEach(coder => {
      if (coder.dynamic) {
        dynamicList.push(coder);
      } else {
        staticList.push(coder);
      }
    });

    const codersNew = [
      ...staticList,
      ...dynamicList,
    ].reverse();

    function peek(lastIndex, len) {
      return dataStr.slice(
        dataStr.length - lastIndex - len,
        dataStr.length - lastIndex,
      ).replace(/^0+/, '');
    }

    codersNew.forEach(coder => {
      const findStrNextIndex = lastIndex => {
        let nextIndex = lastIndex;
        for (let i = nextIndex; i <= dataStr.length; i += stepNum) {
          const curStr = dataStr.slice(
            dataStr.length - stepNum - i,
            dataStr.length - nextIndex,
          ).replace(/0+$/, '');

          const curStrLen = Buffer.from(curStr, 'hex').length;
          const strLen = dataStr.slice( // 16进制
            dataStr.length - 2 * stepNum - i,
            dataStr.length - stepNum - i,
          ).replace(/^0+/, '');

          if (strLen === Number(curStrLen).toString(16)) {
            nextIndex = 2 * stepNum + i;
            return nextIndex;
          }
        }
        throw new Error('not found index');
      };

      if (isArrayCoder(coder.type)) {
        if (coder.coder.dynamic) {
          if (!coder.size) {
            let arrLen = 0;
            let finded = false;
            for (let i = indexFromLast; i <= dataStr.length;) {
              const curStepIndex = findStrNextIndex(i);
              i = curStepIndex;
              arrLen += 1;

              if (arrLen.toString(16) === peek(curStepIndex + stepNum * arrLen, stepNum)) {
                indexFromLast = curStepIndex + stepNum * arrLen + stepNum;
                finded = true;
                break;
              }
            }

            if (!finded) {
              throw new Error('not found index');
            }
          } else {
            for (let i = 0; i < coder.size; i += 1) {
              indexFromLast = findStrNextIndex(indexFromLast);
            }
            indexFromLast += stepNum * coder.size;
          }
        } else if (!coder.size) {
          let arrLen = 0;
          let finded = false;
          for (let i = indexFromLast; i <= dataStr.length; i += stepNum) {
            const curStepIndex = i;
            if (arrLen.toString(16) === peek(i, stepNum)) {
              indexFromLast = curStepIndex + stepNum;
              finded = true;
              break;
            }
            arrLen += 1;
          }
          if (!finded) {
            throw new Error('not found index');
          }
        } else {
          for (let i = 0; i < coder.size; i += 1) {
            indexFromLast += stepNum;
          }
        }
      } else if (coder.dynamic) {
        indexFromLast = findStrNextIndex(indexFromLast);
      } else {
        indexFromLast += stepNum;
      }
    });

    coders.forEach(coder => {
      if (coder.dynamic) {
        indexFromLast += stepNum;
      }
    });
    return indexFromLast;
  }


  decodeData(data) {
    const _method = this._codeToInstance[data.slice(0, 10)]; // contract function code match '0x[0~9a-z]{8}'
    if (_method) {
      return _method.decodeData(data);
    }

    if (this._constructorFunction && !this._constructorFunction.bytecode) {
      const byteCodeIndexFromLast = this.findByteCodeIndex(data);
      const newByteCode = data.slice(0, data.length - byteCodeIndexFromLast);
      this._constructorFunction.bytecode = newByteCode;
    }

    const _constructor = this._constructorFunction;
    if (_constructor && _constructor.bytecode && data.startsWith(_constructor.bytecode)) {
      return _constructor.decodeData(data);
    }

    return undefined;
  }

  decodeLog(log) {
    const _event = this._codeToInstance[log.topics[0]];
    if (_event) {
      return _event.decodeLog(log);
    }

    return undefined;
  }
}

module.exports = ContractABICoder;
