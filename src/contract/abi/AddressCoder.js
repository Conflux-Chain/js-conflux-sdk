import { alignBuffer } from '../../util/index.js';
import format from '../../util/format.js';
import BaseCoder from './BaseCoder.js';

export default class AddressCoder extends BaseCoder {
  static from({ type, ...options }) {
    if (type !== 'address') {
      return undefined;
    }
    return new this({ ...options, type });
  }

  constructor({ type, ...options }) {
    super({ ...options, type });
    this.networkId = options.networkId;
  }

  /**
   * @param address {string}
   * @return {Buffer}
   */
  encode(address) {
    return alignBuffer(format.hexBuffer(format.hexAddress(address)));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    const hexAddress = stream.read(40);
    const isConfluxAddress = hexAddress.startsWith('1') || hexAddress.startsWith('0') || hexAddress.startsWith('8');
    return (isConfluxAddress && this.networkId) ? format.address(`0x${hexAddress}`, this.networkId) : format.hexAddress(`0x${hexAddress}`);
  }
}
