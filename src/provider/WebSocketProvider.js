const Websocket = require('websocket').w3cwebsocket;
const BaseProvider = require('./BaseProvider');
const { awaitTimeout } = require('../util');

/**
 * Websocket protocol json rpc provider.
 */
class WebSocketProvider extends BaseProvider {
  constructor(options) {
    super(options);

    this.client = null;

    this.on('message', json => {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        data.forEach(each => this._onData(each));
      } else {
        this._onData(data);
      }
    });
  }

  _connect(url) {
    return new Promise((resolve, reject) => {
      const client = new Websocket(url);
      client.onopen = () => resolve(client);
      client.onerror = () => reject(new Error(`connect to ${url}, failed`));
      client.onmessage = ({ data }) => this.emit('message', data);
      client.onclose = ({ code, reason }) => this.emit('close', code, reason);
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

  async _send(data) {
    if (this.client === null) { // init
      this.client = false;
      try {
        this.client = await this._connect(this.url);
      } catch (e) {
        this.client = null;
        throw e;
      }
    }

    while (this.client === false) { // connecting
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    return this.client.send(data);
  }

  async request(data) {
    await this._send(JSON.stringify(data));

    return await awaitTimeout(this._awaitId(data.id), this.timeout) || {};
  }

  async requestBatch(dataArray) {
    await this._send(JSON.stringify(dataArray));

    return Promise.all(dataArray.map(async data => {
      return awaitTimeout(this._awaitId(data.id), this.timeout); // timeout for each request
    }));
  }

  async close() {
    super.close();

    if (this.client === null) { // init
      return;
    }

    while (this.client === false) { // connecting
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    this.client.close();
    await new Promise(resolve => this.once('close', resolve));
    this.client = null;
  }
}

module.exports = WebSocketProvider;
