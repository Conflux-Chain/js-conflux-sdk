const { assert } = require('../utils');
const { Hex } = require('../utils/type');

const WORD_BYTES = 32;
const BYTE_CHARS = 2; // 1 bytes === 2 hex char
const ZERO_BUFFER = Hex.toBuffer('0x0000000000000000000000000000000000000000000000000000000000000000');

class HexStream {
  static from(hex) {
    if (hex.startsWith('0x')) {
      hex = hex.replace('0x', '');
    }
    return new this(hex);
  }

  constructor(string) {
    this.string = string;
    this.index = 0;
  }

  cut(start, size) {
    return this.string.substring(BYTE_CHARS * start, BYTE_CHARS * (start + size));
  }

  read(length, alignLeft = false) {
    assert(Number.isInteger(length) && 0 <= length, {
      message: 'invalid length',
      expect: 'integer && >= 0',
      got: length,
      stream: this,
    });

    let skip = 0;
    const count = WORD_BYTES - (length % WORD_BYTES);
    if (0 < count && count < WORD_BYTES) {
      skip = count;
    }

    const string = alignLeft
      ? this.cut(this.index, length)
      : this.cut(this.index + skip, length);

    assert(string.length === BYTE_CHARS * length, {
      message: 'length not match',
      expect: BYTE_CHARS * length,
      got: string.length,
      stream: this,
    });

    this.index += length + skip;
    return string;
  }
}

function padBuffer(buffer, alignLeft = false) {
  if (!Buffer.isBuffer(buffer)) {
    buffer = Hex.toBuffer(buffer); // accept hex
  }

  const count = WORD_BYTES - (buffer.length % WORD_BYTES);
  if (0 < count && count < WORD_BYTES) {
    buffer = alignLeft
      ? Buffer.concat([buffer, ZERO_BUFFER.slice(0, count)])
      : Buffer.concat([ZERO_BUFFER.slice(0, count), buffer]);
  }

  return buffer;
}

module.exports = HexStream;
module.exports.WORD_BYTES = WORD_BYTES;
module.exports.padBuffer = padBuffer;
