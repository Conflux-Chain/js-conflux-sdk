/*
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html#encoding-of-indexed-event-parameters
 */

const { assert } = require('../../util');
const BaseCoder = require('./BaseCoder');
const NullCoder = require('./NullCoder');
const AddressCoder = require('./AddressCoder');
const IntegerCoder = require('./IntegerCoder');
const BoolCoder = require('./BoolCoder');
const BytesCoder = require('./BytesCoder');
const StringCoder = require('./StringCoder');
const TupleCoder = require('./TupleCoder');
const ArrayCoder = require('./ArrayCoder');
// TODO FixedCoder

/**
 * Get coder by abi component.
 *
 * @param component {object}
 * @param component.type {string}
 * @param [component.name] {string}
 * @param [component.components] {array} - For TupleCoder
 * @return {BaseCoder}
 */
function valueCoder(component) {
  // must parse ArrayCoder first, others sorted by probability
  const coder = ArrayCoder.from(component, valueCoder) // recursion
    || TupleCoder.from(component, valueCoder) // recursion
    || AddressCoder.from(component)
    || IntegerCoder.from(component)
    || StringCoder.from(component)
    || BytesCoder.from(component)
    || BoolCoder.from(component)
    || NullCoder.from(component);

  assert(coder instanceof BaseCoder, {
    message: 'can not found matched coder',
    component,
  });

  return coder;
}

function formatType({ name, inputs }) {
  return `${name}(${inputs.map(param => valueCoder(param).type).join(',')})`;
}

function formatFullName({ name, inputs }) {
  return `${name}(${inputs.map(param => `${valueCoder(param).type} ${param.indexed ? 'indexed ' : ''}${param.name}`).join(', ')})`;
}

module.exports = {
  valueCoder,
  formatType,
  formatFullName,
};
