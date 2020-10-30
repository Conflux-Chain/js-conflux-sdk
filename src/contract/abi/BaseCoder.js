const HexStream = require('../../util/HexStream');

class BaseCoder {
  static from(component) {} // eslint-disable-line no-unused-vars

  constructor({ type, name }) {
    this.type = type;
    this.name = name;
    this.dynamic = false;
  }

  /**
   * @param [value] {*}
   * @return {Buffer}
   */
  encode(value) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.encode not implemented`);
  }

  /**
   * @param stream {HexStream}
   * @return {*}
   */
  decode(stream) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name}.decode not implemented`);
  }

  encodeTopic(value) {
    return this.encode(value);
  }

  decodeTopic(hex) {
    const stream = new HexStream(hex);
    return this.decode(stream);
  }
}

module.exports = BaseCoder;
