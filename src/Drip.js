const Big = require('big.js');
const JSBI = require('jsbi');

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
    value = /^0x[0-9a-f]+$/i.test(value) ? JSBI.BigInt(value) : value;
    return new this(Big(value).times(1e18).toFixed());
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
    value = /^0x[0-9a-f]+$/i.test(value) ? JSBI.BigInt(value) : value;
    return new this(Big(value).times(1e9).toFixed());
  }

  /**
   * Get `Drip` string from `Drip`
   *
   * @param value {string|number}
   * @return {Drip}
   *
   * @example
   * > Drip.fromDrip(1.00)
   [String (Drip): '1']
   * > Drip.fromDrip('0xab')
   [String (Drip): '171']
   */
  static fromDrip(value) {
    value = /^0x[0-9a-f]+$/i.test(value) ? JSBI.BigInt(value) : value;
    return new this(Big(value).toFixed());
  }

  constructor(string) {
    if (!/^\d+$/.test(string)) {
      throw new Error(`"${string}" not match bigUInt`);
    }
    super(string);
  }

  /**
   * Get `CFX` number string
   * @return {string}
   *
   * @example
   * > Drip.fromDrip(1e9).toCFX()
   "0.000000001"
   */
  toCFX() {
    return Big(this).div(1e18).toFixed();
  }

  /**
   * Get `GDrip` number string
   * @return {string}
   *
   * @example
   * > Drip.fromDrip(1e9).toGDrip()
   "1"
   */
  toGDrip() {
    return Big(this).div(1e9).toFixed();
  }

  /**
   * Get `Drip` number string
   * @return {string}
   *
   * @example
   * > Drip.fromDrip(1e9).toGDrip()
   "1000000000"
   */
  toDrip() {
    return this.toString();
  }
}

module.exports = Drip;
