const { assert } = require('./index');
const { WORD_CHARS } = require('../CONST');

class HexStream {
  constructor(hex) {
    this.string = hex;
    this.index = hex.startsWith('0x') ? 2 : 0;
  }

  eof() {
    return this.index >= this.string.length;
  }

  read(length, alignLeft = false) {
    assert(Number.isInteger(length) && 0 <= length, {
      message: 'invalid length',
      expect: 'integer && >= 0',
      got: length,
      stream: this,
    });

    const size = Math.ceil(length / WORD_CHARS) * WORD_CHARS;
    const string = alignLeft
      ? this.string.substr(this.index, length)
      : this.string.substr(this.index + (size - length), length);

    assert(string.length === length, {
      message: 'length not match',
      expect: length,
      got: string.length,
      stream: this,
    });

    this.index += size;
    return string;
  }
}

module.exports = HexStream;
