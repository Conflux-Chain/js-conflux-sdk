const RPCError = require('../provider/RPCError');

const SEND_TX_METHOD = 'cfx_sendTransaction';
const SEND_RAW_TX_METHOD = 'cfx_sendRawTransaction';

class BatchRequester {
  /**
   * BatchRequester constructor.
   *
   * @param {Conflux} conflux - A Conflux instance
   */
  constructor(conflux) {
    this.conflux = conflux;
    this.requests = [];
    this.decoders = [];
    this.accountNextNonces = {};
    this.accountUsedNonces = {};
  }

  /**
   * Add RPC method request to batch builder
   * @param {object} A request meta info object, include 'request' and 'decoder'
   * - request `object`: JSON-RPC request object, include `method` and `params` array
   * - decoder `function`: Response decoder
   * @example
   * Low level example:
   * batchRequester.add({
   *  "request": {
   *    "method": "cfx_getStatus",
   *    "params": []
   *  },
   *  "decoder": decoderFunction
   * });
   *
   * Use RPC method's request method to build request:
   * batchRequester.add(conflux.cfx.getBalance.request('cfxtest:aasm4c231py7j34fghntcfkdt2nm9xv1tu6jd3r1s7'));
   */
  add({ request, decoder = any => any }) {
    this.requests.push(request);
    this.decoders.push(decoder);
  }

  addTransaction(txOption) {
    this.add({
      request: {
        method: SEND_TX_METHOD,
        params: [txOption],
      },
    });
  }

  _markNonceUsed(from, nonce) {
    if (!this.accountUsedNonces[from]) {
      this.accountUsedNonces[from] = {};
    }
    this.accountUsedNonces[from][nonce] = true;
  }

  isNonceUsed(from, nonce) {
    return this.accountUsedNonces[from] && this.accountUsedNonces[from][nonce];
  }

  async _getNextNonce(from) {
    let _nonce = this.accountNextNonces[from];
    if (!_nonce) {
      _nonce = await this.conflux.advanced.getNextUsableNonce(from);
    }
    //
    while (this.accountUsedNonces[from] && this.accountUsedNonces[from][_nonce]) {
      _nonce += BigInt(1);
    }

    this.accountNextNonces[from] = _nonce + BigInt(1); // update next nonce

    return _nonce;
  }

  /**
   * Clear Batch requester's requests and decoders
   */
  clear() {
    this.requests = [];
    this.decoders = [];
    this.accountNextNonces = {};
    this.accountUsedNonces = {};
  }

  /**
   * Batch send the RPC requests, retrive the responses and decode
   * @returns {Array}
   * @example await batchRequester.execute();
   */
  async execute() {
    // prepare transaction nonce and sign it
    const _requests = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.requests.length; i++) {
      const req = this.requests[i];
      if (req.method === SEND_TX_METHOD && req.params[0] && req.params[0].from && this.conflux.wallet.has(req.params[0].from)) {
        // prepare nonce
        const from = req.params[0].from;
        let _nonce = req.params[0].nonce;
        if (!_nonce || this.isNonceUsed(from, _nonce)) {
          _nonce = await this._getNextNonce(from);
          req.params[0].nonce = _nonce;
        }
        this._markNonceUsed(from, _nonce);

        // sign transaction
        const account = await this.conflux.wallet.get(`${from}`);
        const signedTx = await account.signTransaction(req.params[0]);
        // change method to cfx_sendRawTransaction
        req.method = SEND_RAW_TX_METHOD;
        req.params[0] = signedTx.serialize();
      }
      _requests[i] = req;
    }
    //
    const results = await this.conflux.provider.batch(_requests);
    return results.map((data, i) => {
      if (data instanceof RPCError) { // If is error direct return
        return data;
      }
      return this.decoders[i](data);
    });
  }
}

module.exports = BatchRequester;
