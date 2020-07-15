const { assert, format } = require('../util');
const HexStream = require('../util/HexStream');
const namedTuple = require('../util/namedTuple');
const abiCoder = require('../abi');
const { signature, formatSignature, formatFullName } = require('./signature');

class EventCoder {
  /**
   * Event coder
   *
   * @param options {object}
   * @param options.anonymous {boolean}
   * @param options.name {string}
   * @param options.inputs {array}
   *
   * @example
   * > abi = {
    name: 'EventName',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
   }
   * > coder = new EventCoder(abi)
   EventCoder {
      anonymous: false,
      name: 'EventName',
      inputs: [
        { indexed: true, name: 'account', type: 'address' },
        { indexed: false, name: 'number', type: 'uint' }
      ],
      type: 'EventName(address,uint256)',
      NamedTuple: [Function: NamedTuple(account,number)]
    }
   */
  constructor({ anonymous, name, inputs = [] } = {}) {
    this.anonymous = anonymous;
    this.name = name; // example: "Event"
    this.fullName = formatFullName({ name, inputs }); // example: "Event(address)"
    this.type = formatSignature({ name, inputs }); // example: "Event(address indexed account)"
    this.signature = signature(this.type); // example: "0x50d7c806d0f7913f321946784dee176a42aa55b5dd83371fc57dcedf659085e0"

    this.inputs = inputs;
    this.dataCoder = abiCoder({ type: 'tuple', components: inputs.filter(component => !component.indexed) });

    this.NamedTuple = namedTuple(...inputs.map((input, index) => input.name || `${index}`));
  }

  /**
   * Encode topics by params
   *
   * @param array {*[]}
   * @return {string[]}
   * @example
   * > coder = new EventCoder(abi)
   * > coder.encodeTopics(['0x0123456789012345678901234567890123456789', null])
   ['0x0000000000000000000000000123456789012345678901234567890123456789']
   */
  encodeTopics(array) {
    assert(array.length === this.inputs.length, {
      message: 'length not match',
      expect: this.inputs.length,
      got: array.length,
      coder: this,
    });

    const topics = [];
    this.inputs.forEach((component, index) => {
      if (component.indexed) {
        const value = array[index];

        topics.push(value === null ? null : format.hex(abiCoder(component).encodeIndex(value)));
      }
    });

    return topics;
  }

  /**
   * Decode log
   *
   * @param topics {array} - Array of hex sting
   * @param data {string} - Hex string
   * @return {array} NamedTuple
   *
   * @example
   * > coder = new EventCoder(abi)
   * > result = coder.decodeLog({
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      topics: [
        '0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7',
        '0x0000000000000000000000000123456789012345678901234567890123456789',
      ],
    })
   NamedTuple(account,number) [ '0x0123456789012345678901234567890123456789', 10n ]
   * > console.log([...result])
   [ 0x0123456789012345678901234567890123456789, 10n ]
   * > console.log(result.account) // `account` a field name in abi
   "0x0123456789012345678901234567890123456789"
   * > console.log(result.number) // `number` a field name in abi
   10n
   */
  decodeLog({ topics, data }) {
    assert(this.anonymous || topics[0] === this.signature, {
      message: 'decodeLog unexpected topic',
      expect: this.signature,
      got: topics[0],
      coder: this,
    });

    const stream = new HexStream(data);
    const notIndexedNamedTuple = this.dataCoder.decode(stream);

    assert(stream.eof(), {
      message: 'hex length to large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this,
    });

    let offset = this.anonymous ? 0 : 1;
    const array = this.inputs.map(component => {
      if (component.indexed) {
        return abiCoder(component).decodeIndex(topics[offset++]); // eslint-disable-line no-plusplus
      } else {
        return notIndexedNamedTuple[component.name];
      }
    });

    return new this.NamedTuple(...array);
  }
}

module.exports = EventCoder;
