const format = require('../../util/format');
const CONST = require('../../CONST');

const formatAccount = format({
  accumulatedInterestReturn: format.bigUInt,
  balance: format.bigUInt,
  collateralForStorage: format.bigUInt,
  nonce: format.bigUInt,
  stakingBalance: format.bigUInt,
}, {
  name: 'format.account',
});

class Account {
  static format(data) {
    return formatAccount(data);
  }

  constructor(accountMeta) {
    Object.assign(this, Account.format(accountMeta));
    return this;
  }

  isExternalAccount() {
    return this.codeHash === CONST.KECCAK_EMPTY;
  }
}

module.exports = Account;
