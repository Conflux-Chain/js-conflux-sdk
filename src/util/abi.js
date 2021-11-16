/* eslint-disable guard-for-in */
const { valueCoder } = require('../contract/abi');
const HexStream = require('./HexStream');
const format = require('./format');

function encodeParameter(type, value) {
  const encoded = valueCoder(_toComponents(type)).encode(_toArray(value));
  return format.hex(encoded);
}

function encodeParameters(types, values) {
  const coder = valueCoder({
    type: 'tuple',
    components: types.map(type => ({ type })),
  });
  const encoded = coder.encode(values);
  return format.hex(encoded);
}

function decodeParameters(types, hexStr, networkId) {
  const coder = valueCoder({
    type: 'tuple',
    components: types.map(type => _toComponents(type, networkId)),
  });
  const hex = new HexStream(hexStr);
  return coder.decode(hex);
}

// for tuple type will decode to array
function decodeParameter(type, hexStr, networkId) {
  const coder = valueCoder(_toComponents(type, networkId));
  const hex = new HexStream(hexStr);
  return coder.decode(hex);
}

function _toArray(value) {
  if (typeof value !== 'object' || Array.isArray(value)) return value;
  const array = [];
  for (const key in value) {
    array.push(_toArray(value[key]));
  }
  return array;
}

function _toComponents(type, networkId) {
  if (type === 'address' && networkId) {
    return { type, networkId };
  }
  if (typeof type === 'object') {
    const components = [];
    for (const key in type) {
      components.push(_toComponents(type[key], networkId));
    }
    return {
      type: 'tuple',
      components,
    };
  }
  return { type };
}

module.exports = {
  encodeParameter,
  encodeParameters,
  decodeParameters,
  decodeParameter,
};
