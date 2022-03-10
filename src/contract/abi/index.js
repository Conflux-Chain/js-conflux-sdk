/*
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html
 @see https://solidity.readthedocs.io/en/v0.5.13/abi-spec.html#encoding-of-indexed-event-parameters
 */

import { assert } from '../../util/index.js';
import BaseCoder from './BaseCoder.js';
import NullCoder from './NullCoder.js';
import AddressCoder from './AddressCoder.js';
import IntegerCoder from './IntegerCoder.js';
import BoolCoder from './BoolCoder.js';
import BytesCoder from './BytesCoder.js';
import StringCoder from './StringCoder.js';
import TupleCoder from './TupleCoder.js';
import ArrayCoder from './ArrayCoder.js';
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
export function valueCoder(component) {
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

export function formatType({ name, inputs }) {
  return `${name}(${inputs.map(param => valueCoder(param).type).join(',')})`;
}

export function formatFullName({ name, inputs }) {
  return `${name}(${inputs.map(param => `${valueCoder(param).type} ${param.indexed ? 'indexed ' : ''}${param.name}`).join(', ')})`;
}

export default {
  valueCoder,
  formatType,
  formatFullName,
};
