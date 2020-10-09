const { alignBuffer } = require('../../util');
const format = require('../../util/format');
const BaseCoder = require('./BaseCoder');

class AddressCoder extends BaseCoder {
  static from({ type, name }) {
    if (type !== 'address') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param address {string}
   * @return {Buffer}
   */
  encode(address) {
    return alignBuffer(format.buffer(format.address(address)));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    return format.address(`0x${stream.read(40)}`);
  }
}

module.exports = AddressCoder;
