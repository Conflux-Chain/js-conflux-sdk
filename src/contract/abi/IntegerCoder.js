const { UINT_BOUND } = require('../../CONST');
const { assert, alignBuffer } = require('../../util');
const format = require('../../util/format');
const JSBI = require('../../util/jsbi');
const BaseCoder = require('./BaseCoder');

class IntegerCoder extends BaseCoder {
  static from({ type, ...options }) {
    const match = type.match(/^(int|uint)([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, label, bits] = match;
    return new this({
      ...options,
      type: label,
      signed: !label.startsWith('u'),
      bits: bits ? parseInt(bits, 10) : undefined,
    });
  }

  constructor({ name, type, signed = false, bits = 256 }) {
    assert(Number.isInteger(bits) && 0 < bits && bits <= 256 && (bits % 8 === 0), {
      message: 'invalid bits',
      expect: 'integer && 0<bits<=256 && bits%8==0',
      got: bits,
      coder: { name, type, signed },
    });

    super({ name });
    this.type = `${type}${bits}`;
    this.signed = signed;
    this.size = bits / 8;
    this.bound = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(bits - (this.signed ? 1 : 0)));
  }

  /**
   * @param value {number|JSBI|string} - FIXME: it is not a good idea to accept string as number
   * @return {Buffer}
   */
  encode(value) {
    let number = format.bigInt(value);
    let twosComplement = number;

    if (this.signed && JSBI.LT(number, JSBI.BigInt(0))) {
      twosComplement = JSBI.add(number, this.bound);
      number = JSBI.add(number, UINT_BOUND);
    }

    assert(JSBI.LE(JSBI.BigInt(0), twosComplement) && JSBI.LT(twosComplement, this.bound), {
      message: 'bound error',
      expect: `0<= && <${this.bound}`,
      got: twosComplement.toString(),
      coder: this,
      value,
    });

    return alignBuffer(format.hexBuffer(number));
  }

  /**
   * @param stream {HexStream}
   * @return {BigInt}
   */
  decode(stream) {
    let value = JSBI.BigInt(`0x${stream.read(this.size * 2)}`); // 16: read out naked hex string

    if (this.signed && JSBI.GE(value, this.bound)) {
      const mask = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(this.size * 8));
      value = JSBI.subtract(value, mask);
    }

    return JSBI.BigInt(value);
  }
}

module.exports = IntegerCoder;
module.exports.uIntCoder = new IntegerCoder({ type: 'uint' });
