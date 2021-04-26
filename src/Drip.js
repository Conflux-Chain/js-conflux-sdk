const format = require('./util/format');

/**
 * Positive decimal integer string in `Drip`
 */
class Drip extends String {
  /**
   * Get `Drip` string from `CFX`
   *
   * @param value {string|number}
   * @return {Drip}
   *
   * @example
   * > Drip.fromCFX(3.14)
   [String (Drip): '3140000000000000000']
   * > Drip.fromCFX('0xab')
   [String (Drip): '171000000000000000000']
   */
  static fromCFX(value) {
    return new this(format.big(value).times(1e18).toFixed());
  }

  /**
   * Get `Drip` string from `GDrip`
   *
   * @param value {string|number}
   * @return {Drip}
   *
   * @example
   * > Drip.fromGDrip(3.14)
   [String (Drip): '3140000000']
   * > Drip.fromGDrip('0xab')
   [String (Drip): '171000000000']
   */
  static fromGDrip(value) {
    return new this(format.big(value).times(1e9).toFixed());
  }

  /**
   * @param value {number|string}
   * @return {Drip}
   *
   * @example
   * > new Drip(1.00)
   [String (Drip): '1']
   * > new Drip('0xab')
   [String (Drip): '171']
   */
  constructor(value) {
    super(format.bigUInt(value).toString(10));
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
    return format.big(this).div(1e18).toFixed();
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
    return format.big(this).div(1e9).toFixed();
  }
}

module.exports = new Proxy(Drip, {
  apply(target, thisArg, argArray) {
    return new Drip(...argArray);
  },
});
