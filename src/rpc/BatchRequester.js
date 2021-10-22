const RPCError = require('../provider/RPCError');

class BatchRequester {
  /**
   * BatchRequester constructor.
   *
   * @param {Provider} provider - A provider instance
   */
  constructor(provider) {
    this.provider = provider;
    this.requests = [];
    this.decoders = [];
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
  add({ request, decoder = () => {} }) {
    this.requests.push(request);
    this.decoders.push(decoder);
  }

  /**
   * Batch send the RPC requests, retrive the responses and decode
   * @returns {Array}
   * @example await batchRequester.execute();
   */
  async execute() {
    const results = await this.provider.batch(this.requests);
    return results.map((data, i) => {
      if (data instanceof RPCError) { // If is error direct return
        return data;
      }
      return this.decoders[i](data);
    });
  }
}

module.exports = BatchRequester;
