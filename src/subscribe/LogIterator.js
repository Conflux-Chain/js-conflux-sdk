const lodash = require('lodash');
const { loop } = require('../util');
const LazyPromise = require('./LazyPromise');

class LogIterator extends LazyPromise {
  constructor(cfx, func, [filter]) {
    super(func, [filter]);

    this.cfx = cfx;
    this.filter = filter;

    this._epoch = lodash.get(filter, 'fromEpoch', 0);
    this._count = 0;
    this._queue = [];
  }

  async _isConfirmed(epochNumber, threshold) {
    if (epochNumber === undefined) {
      return false;
    }

    const blockHashArray = await this.cfx.getBlocksByEpochNumber(epochNumber);
    const risk = await this.cfx.getConfirmationRiskByHash(lodash.last(blockHashArray));
    return risk < threshold;
  }

  async _popUnconfirmed(logs, threshold) {
    while (logs.length) {
      const { epochNumber } = lodash.last(logs);
      if (await this._isConfirmed(epochNumber, threshold)) {
        break;
      }

      // pop log.epochNumber === epochNumber which not confirmed
      while (logs.length && lodash.last(logs).epochNumber === epochNumber) {
        logs.pop();
      }
    }

    return logs;
  }

  async _readConfirmed({ threshold = 0.01, delta = 1000, timeout = 30 * 60 * 1000 } = {}) {
    if (this._epoch > this.filter.toEpoch || this._count >= this.filter.limit) {
      return [];
    }

    return loop({ delta, timeout }, async () => {
      const logs = await this.cfx.getLogs({
        ...this.filter,
        fromEpoch: this._epoch,
        limit: this.filter.limit === undefined ? undefined : this.filter.limit - this._count,
      });

      if (await this._isConfirmed(this.filter.toEpoch, threshold)) {
        this._epoch = Infinity;
        return logs;
      }

      await this._popUnconfirmed(logs, threshold); // logs will be change
      if (logs.length) {
        this._epoch = lodash.last(logs).epochNumber + 1;
        this._count += logs.length;
        return logs;
      }

      return undefined; // continue
    });
  }

  async next(options) {
    if (!this._queue.length) {
      const logs = await this._readConfirmed(options);
      this._queue.push(...logs);
    }

    return this._queue.shift();
  }

  [Symbol.asyncIterator]() {
    return {
      next: async () => {
        const value = await this.next();
        return { value, done: value === undefined };
      },
    };
  }
}

module.exports = LogIterator;
