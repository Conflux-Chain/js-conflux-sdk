const Contract = require('./Contract');
const ErrorCoder = require('./method/ErrorCoder');

const errorCoder = new ErrorCoder();

module.exports = Contract;
module.exports.decodeError = e => errorCoder.decodeError(e);
