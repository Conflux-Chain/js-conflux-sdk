const EventEmitter = require('events');

/**
 * Subscription event emitter
 */
class Subscription extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
  }

  toString() {
    return this.id;
  }
}

module.exports = Subscription;
