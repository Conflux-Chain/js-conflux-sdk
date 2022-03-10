import EventEmitter from 'events';

/**
 * Subscription event emitter
 */
export default class Subscription extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
  }

  toString() {
    return this.id;
  }
}
