const { format, sign } = require('../util');
const abiCoder = require('../abi');

function signature(type) {
  return format.hex(sign.sha3(Buffer.from(type)));
}

function formatSignature({ name, inputs }) {
  return `${name}(${inputs.map(param => abiCoder(param).type).join(',')})`;
}

function formatFullName({ name, inputs }) {
  return `${name}(${inputs.map(param => `${abiCoder(param).type} ${param.indexed ? 'indexed ' : ''}${param.name}`).join(', ')})`;
}

module.exports = {
  signature,
  formatSignature,
  formatFullName,
};
