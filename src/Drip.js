const { Value } = require('ox');
const { isHexString } = require('./util/index');

/**
 * Positive decimal integer string in `Drip`
 */
class Drip extends String {
  /**
   * Get `Drip` string from `CFX`
   *
   * @param {string|number|BigInt} value
   * @return {Drip}
   *
   * @example
   * > Drip.fromCFX(3.14)
   [String (Drip): '3140000000000000000']
   * > Drip.fromCFX('0xab')
   [String (Drip): '171000000000000000000']
   */
  static fromCFX(value) {
    value = normalizeNumber(value);
    return new this(Value.fromEther(value));
  }

  /**
   * Get `Drip` string from `GDrip`
   *
   * @param {string|number|BigInt} value
   * @return {Drip}
   *
   * @example
   * > Drip.fromGDrip(3.14)
   [String (Drip): '3140000000']
   * > Drip.fromGDrip('0xab')
   [String (Drip): '171000000000']
   */
  static fromGDrip(value) {
    value = normalizeNumber(value);
    return new this(Value.fromGwei(value));
  }

  /**
   * @param {number|string|BigInt} value
   * @return {Drip}
   *
   * @example
   * > new Drip(1.00)
   [String (Drip): '1']
   * > new Drip('0xab')
   [String (Drip): '171']
   */
  constructor(value) {
    if (typeof value === 'number' && !Number.isInteger(value)) throw new TypeError('Cannot');
    value = normalizeNumber(value);
    super(Value.from(value).toString());
  }

  /**
   * Get `CFX` number string
   * @return {string}
   *
   * @example
   * > Drip(1e9).toCFX()
   "0.000000001"
   */
  toCFX() {
    return Value.formatEther(Value.from(this));
  }

  /**
   * Get `GDrip` number string
   * @return {string}
   *
   * @example
   * > Drip(1e9).toGDrip()
   "1"
   */
  toGDrip() {
    return Value.formatGwei(Value.from(this));
  }
}

function normalizeNumber(value) {
  if (value === undefined || value === null || value === '') throw new TypeError('Invalid number');
  if (typeof value === 'number') {
    if (Number.isNaN(value)) throw new TypeError('Cannot');
    if (value < 0) throw new TypeError('not match "bigUInt"');
  }
  if (typeof value === 'number' || typeof value === 'bigint') value = value.toString();
  if (isHexString(value)) value = Number(value).toString();
  return value;
}

module.exports = new Proxy(Drip, {
  apply(target, thisArg, argArray) {
    return new Drip(...argArray);
  },
});
