import Contract from './Contract.js';
import ErrorCoder from './method/ErrorCoder.js';

const errorCoder = new ErrorCoder();
export const decodeError = e => errorCoder.decodeError(e);

export default Contract;
