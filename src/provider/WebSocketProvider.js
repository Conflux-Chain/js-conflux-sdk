const { promisify } = require('util');
const websocket = require('websocket');
const BaseProvider = require('./BaseProvider');
const { awaitTimeout } = require('../util');

class Client extends websocket.client {
  constructor({ url: requestUrl, ...options }) {
    super(options);
    this.requestUrl = requestUrl;
    this.connection = null;
  }

  connect(...args) {
    return new Promise((resolve, reject) => {
      super.connect(...args);

      this.once('connect', connection => {
        connection.send = promisify(connection.send);
        connection.on('message', ({ utf8Data, binaryData }) => this.emit('message', utf8Data || binaryData));
        connection.once('close', (..._args) => this.emit('close', ..._args));
        resolve(connection);
      });

      this.once('connectFailed', reject);
    });
  }

  async send(...args) {
    if (!this.connection) {
      this.connection = await this.connect(this.requestUrl);
    }
    return this.connection.send(...args);
  }

  close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
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
    this.client.on('close', (...args) => this.emit('close', ...args));
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

  _awaitId(id) {
    return new Promise((resolve, reject) => {
      const onClose = (code, message) => {
        this.removeAllListeners(id);
        reject(new Error(message));
      };

      const onData = data => {
        this.removeListener('close', onClose);
        resolve(data);
      };

      this.once('close', onClose);
      this.once(id, onData);
    });
  }

  async request(data) {
    await this.client.send(JSON.stringify(data));

    return await awaitTimeout(this._awaitId(data.id), this.timeout) || {};
  }

  async requestBatch(dataArray) {
    await this.client.send(JSON.stringify(dataArray));

    return Promise.all(dataArray.map(async data => {
      return awaitTimeout(this._awaitId(data.id), this.timeout); // timeout for each request
    }));
  }

  close() {
    super.close();
    this.client.close();
  }
}

module.exports = WebSocketProvider;
