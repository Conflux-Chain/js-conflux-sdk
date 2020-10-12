const { promisify } = require('util');
const websocket = require('websocket');
const BaseProvider = require('./BaseProvider');
const { awaitTimeout } = require('../util');

class Client extends websocket.client {
  constructor({ url, ...options }) {
    super(options);
    this.url = url;

    this.once('connect', connection => {
      connection.send = promisify(connection.send);
      connection.on('message', ({ utf8Data, binaryData }) => this.emit('message', utf8Data || binaryData));
      this.connection = connection;
    });

    this.once('connectFailed', e => {
      throw e;
    });
  }

  async connected() {
    if (!this.connection) {
      this.connect(this.url);
      this.connection = { connected: false };
    }

    if (!this.connection.connected) {
      await new Promise(resolve => this.once('connect', resolve));
    }
  }

  async send(...args) {
    await this.connected();
    return this.connection.send(...args);
  }

  close() {
    if (this.connection && this.connection.connected) {
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
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        data.forEach(each => this._onData(each));
      } else {
        this._onData(data);
      }
    });
  }

  _onData(data = {}) {
    const { id, params: { subscription, result } = {} } = data;
    if (id) {
      this.emit(id, data);
    } else if (subscription) {
      this.emit(subscription, result);
    }
  }

  async request(data) {
    await this.client.send(JSON.stringify(data));

    const promise = new Promise(resolve => this.once(data.id, resolve));
    return await awaitTimeout(promise, this.timeout) || {};
  }

  async requestBatch(dataArray) {
    await this.client.send(JSON.stringify(dataArray));

    return Promise.all(dataArray.map(async data => {
      const promise = new Promise(resolve => this.once(data.id, resolve));
      return awaitTimeout(promise, this.timeout);
    }));
  }

  close() {
    super.close();
    this.client.close();
  }
}

module.exports = WebSocketProvider;
