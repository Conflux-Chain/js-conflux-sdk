/*
0xff                  255
0xffff             65,535
0xffffff       16,777,215
0xffffffff  ‭4,294,967,295‬
 */

const lodash = require('lodash');

const HEX_CHARS = '0123456789abcdef';

// ----------------------------------------------------------------------------
function toHex(value) {
  if (Number.isFinite(value)) {
    return `0x${value.toString(16)}`;
  }

  if (/^0x[0-9a-f]*$/.test(value)) {
    return value;
  }

  throw new Error(`can not get hex from ${value}`);
}

function padHex(value = 0, length = undefined, alignLeft = false) {
  let nakedHex = toHex(value).replace('0x', '');

  nakedHex = alignLeft
    ? lodash.padEnd(nakedHex, length, '0')
    : lodash.padStart(nakedHex, length, '0');

  if (length !== undefined && length !== nakedHex.length) {
    throw new Error(`"${nakedHex}" length !=== ${length}`);
  }

  return `0x${nakedHex}`;
}

function concatHex(...hexArray) {
  return `0x${hexArray.map(hex => hex.replace('0x', '')).join('')}`;
}

class HexStruct {
  constructor(prefix, template, length) {
    this.prefix = prefix;
    this.template = template;
    this.length = length;
  }

  encode(options) {
    const list = lodash.map(this.template, (length, key) => padHex(options[key], length));
    return padHex(concatHex(this.prefix, ...list), this.length, true);
  }

  decode(hex) {
    let index = this.prefix.length;

    return lodash.mapValues(this.template, length => {
      const body = hex.substr(index, length);
      index += length;
      return Number(`0x${body}`);
    });
  }
}

// ----------------------------------------------------------------------------
function randomPick(...args) {
  return args[lodash.random(0, args.length - 1)];
}

function randomHex(size) {
  const body = lodash.range(size)
    .map(() => HEX_CHARS.charAt(lodash.random(0, HEX_CHARS.length - 1)))
    .join('');
  return `0x${body}`;
}

module.exports = {
  toHex,
  padHex,
  HexStruct,
  randomPick,
  randomHex,
};
