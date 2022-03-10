import format from '../../util/format.js';
import { KECCAK_EMPTY } from '../../CONST.js';

const formatAccount = format({
  accumulatedInterestReturn: format.bigUInt,
  balance: format.bigUInt,
  collateralForStorage: format.bigUInt,
  nonce: format.bigUInt,
  stakingBalance: format.bigUInt,
}, {
  name: 'format.account',
});

export default class Account {
  static format(data) {
    return formatAccount(data);
  }

  constructor(accountMeta) {
    Object.assign(this, Account.format(accountMeta));
    return this;
  }

  isExternalAccount() {
    return this.codeHash === KECCAK_EMPTY;
  }
}
