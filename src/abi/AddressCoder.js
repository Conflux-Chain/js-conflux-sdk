const { format } = require('../util');
const BaseCoder = require('./BaseCoder');
const { padBuffer } = require('./util');

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
    return padBuffer(format.address(address));
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
