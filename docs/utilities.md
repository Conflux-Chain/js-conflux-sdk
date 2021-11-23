# Common utilities

## Types Conversion

The `format` utility can be used for format types:

* uInt
* bigInt
* bigUInt
* hex
* address
* hexAddress
* hexBuffer
* bytes
* boolean
* keccak256

```js
const { format } = require('js-conflux-sdk');
// ======================== to hex string
format.hex(null)
// '0x'
format.hex(1)
// "0x01"
format.hex(256)
// "0x0100"
format.hex(true)
// "0x01"
format.hex(Buffer.from([1,10,255]))
// "0x010aff"
format.hex("0x0a")
// "0x0a"

// ======================== to Conflux address
format.address('0x0123456789012345678901234567890123456789', 1)
// "cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp"

// ======================== to hex40 address
format.hexAddress('cfxtest:aaawgvnhveawgvnhveawgvnhveawgvnhvey1umfzwp')
// 0x0123456789012345678901234567890123456789

// ======================== to buffer
format.hexBuffer(Buffer.from([0, 1]))
// <Buffer 00 01>
format.hexBuffer(null)
// <Buffer >
format.hexBuffer(1024)
// <Buffer 04 00>
```
