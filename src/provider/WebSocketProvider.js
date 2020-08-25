const { promisify } = require('util');
const websocket = require('websocket');
const BaseProvider = require('./BaseProvider');

class Client extends websocket.client {
  constructor({ url, ...options }) {
    super(options);

    this.connection = { connected: false };

    this.once('connect', connection => {
      connection.send = promisify(connection.send);
      connection.on('message', ({ utf8Data, binaryData }) => this.emit('message', utf8Data || binaryData));
      this.connection = connection;
    });

    this.once('connectFailed', e => {
      throw e;
    });

    this.connect(url);
  }

  async connected() {
    if (!this.connection.connected) {
      await new Promise(resolve => this.once('connect', resolve));
    }
  }

  async send(...args) {
    await this.connected();
    return this.connection.send(...args);
  }

  close() {
    if (this.connection.connected) {
      this.connection.close();
    }
  }
}

/**
 * Websocket protocol json rpc provider.
 */
class WebSocketProvider extends BaseProvider {
  constructor(options) {
    super(options);

    this.client = new Client(options);
    this.client.on('message', json => {
      const result = JSON.parse(json);
      if (Array.isArray(result)) {
        result.forEach(each => this.client.emit(each.id, each));
      } else {
        this.client.emit(result.id, result);
      }
    });
  }

  async _await(promise) {
    const timer = setTimeout(() => {
      throw new Error(`Timeout of ${this.timeout}ms exceeded`);
    }, this.timeout);

    try {
      return await promise;
    } finally {
      clearTimeout(timer);
    }
  }

  async request(data) {
    await this.client.send(JSON.stringify(data));
    const body = await this._await(new Promise(resolve => this.client.once(data.id, resolve)));
    return body || {};
  }

  async requestBatch(dataArray) {
    await this.client.send(JSON.stringify(dataArray));
    return this._await(Promise.all(dataArray.map(each => new Promise(resolve => this.client.once(each.id, resolve)))));
  }

  close() {
    this.client.close();
  }
}

module.exports = WebSocketProvider;
