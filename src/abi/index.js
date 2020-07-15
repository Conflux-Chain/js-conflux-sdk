/*
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html#encoding-of-indexed-event-parameters
 */

const { assert } = require('../util');

const BaseCoder = require('./BaseCoder');
const NullCoder = require('./NullCoder');
const AddressCoder = require('./AddressCoder');
const IntegerCoder = require('./IntegerCoder');
const BoolCoder = require('./BoolCoder');
const BytesCoder = require('./BytesCoder');
const StringCoder = require('./StringCoder');
const TupleCoder = require('./TupleCoder');
const ArrayCoder = require('./ArrayCoder');

/**
 * Get coder by abi component.
 *
 * @param component {object}
 * @param component.type {string}
 * @param [component.name] {string}
 * @param [component.components] {array} - For TupleCoder
 * @return {BaseCoder}
 */
function abiCoder(component) {
  // must parse ArrayCoder first, others sorted by probability
  const coder = ArrayCoder.from(component, abiCoder) // recursion
    || TupleCoder.from(component, abiCoder) // recursion
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

module.exports = abiCoder;
