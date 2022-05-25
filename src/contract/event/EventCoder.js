const { assert } = require('../../util');
const format = require('../../util/format');
const HexStream = require('../../util/HexStream');
const namedTuple = require('../../util/namedTuple');
const { formatType, formatFullName, valueCoder } = require('../abi');

class EventCoder {
  /**
   * Event coder
   *
   * @param {object} options
   * @param {boolean} options.anonymous
   * @param {string} options.name
   * @param {array} options.inputs
   * @return {EventCoder}
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
  constructor({ anonymous, name, inputs = [] }) {
    this.anonymous = anonymous;
    this.name = name; // example: "Event"
    this.fullName = formatFullName({ name, inputs }); // example: "Event(address indexed account)"
    this.type = formatType({ name, inputs }); // example: "Event(address)"
    this.signature = format.keccak256(this.type); // example: "0x50d7c806d0f7913f321946784dee176a42aa55b5dd83371fc57dcedf659085e0"

    this.inputs = inputs;
    this.inputCoders = inputs.map(valueCoder);
    this.dataCoder = valueCoder({ type: 'tuple', components: inputs.filter(component => !component.indexed) });

    /** @type {object} */
    this.NamedTuple = namedTuple(...inputs.map((input, index) => input.name || `${index}`));
  }

  /**
   * Encode topics by params
   *
   * @param {any[]} args
   * @return {string[]}
   * @example
   * > coder = new EventCoder(abi)
   * > coder.encodeTopics(['0x0123456789012345678901234567890123456789', null])
   ['0x0000000000000000000000000123456789012345678901234567890123456789']
   */
  encodeTopics(args) {
    assert(args.length === this.inputs.length, {
      message: 'length not match',
      expect: this.inputs.length,
      got: args.length,
      coder: this.fullName,
    });

    const topics = [];
    this.inputs.forEach((component, index) => {
      if (component.indexed) {
        const coder = this.inputCoders[index];
        const value = args[index];
        topics.push(value === null ? null : format.hex(coder.encodeTopic(value)));
      }
    });

    return topics;
  }

  /**
   * Decode log
   *
   * @param {array} topics - Array of hex sting
   * @param {string} data - Hex string
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
      coder: this.fullName,
    });

    const stream = new HexStream(data || '0x');
    const notIndexedNamedTuple = this.dataCoder.decode(stream);
    assert(stream.eof(), {
      message: 'hex length too large',
      expect: `${stream.string.length}`,
      got: stream.index,
      coder: this.fullName,
    });

    let offset = this.anonymous ? 0 : 1;
    const array = this.inputs.map((component, index) => {
      if (component.indexed) {
        const coder = this.inputCoders[index];
        const topic = topics[offset++]; // eslint-disable-line no-plusplus
        return coder.decodeTopic(topic);
      } else {
        return notIndexedNamedTuple[component.name || index];
      }
    });

    return new this.NamedTuple(...array);
  }
}

module.exports = EventCoder;
