const Websocket = require('websocket').w3cwebsocket;
const BaseProvider = require('./BaseProvider');
const { awaitTimeout } = require('../util');

/**
 * Websocket protocol json rpc provider.
 */
class WebSocketProvider extends BaseProvider {
  /**
   * @param [options] {object} - See [W3CWebSocket](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/W3CWebSocket.md)
   * @param options.url {string} - Full json rpc http url
   * @param [options.timeout=60*1000] {number} - Request time out in ms
   * @param [options.logger] {object} - Logger with `info` and `error`
   * @param [options.protocols] {string[]} - See [w3](https://www.w3.org/TR/websockets/)
   * @param [options.origin] {string}
   * @param [options.headers] {object}
   * @param [options.requestOptions] {object}
   * @param [options.clientConfig] {object} - See [websocket/lib/WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/c91a6cb8f0cf896edf0d2d49faa0c9e0a9985172/docs/WebSocketClient.md)
   * @param [options.clientConfig.maxReceivedFrameSize=0x100000] {number} - 1MiB max frame size.
   * @param [options.clientConfig.maxReceivedMessageSize=0x800000] {number} - 8MiB max message size, only applicable if assembleFragments is true
   * @param [options.clientConfig.closeTimeout=5000] {number} - The number of milliseconds to wait after sending a close frame for an acknowledgement to come back before giving up and just closing the socket.
   * @return {WebSocketProvider}
   */
  constructor(options) {
    super(options);
    this.websocketOptions = options;

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

  _connect({ url, protocols, origin, headers, requestOptions, clientConfig }) {
    return new Promise((resolve, reject) => {
      const client = new Websocket(url, protocols, origin, headers, requestOptions, clientConfig);
      client.onopen = () => resolve(client);
      client.onerror = () => reject(new Error(`connect to "${url}" failed`));
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
        this.client = await this._connect(this.websocketOptions);
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
