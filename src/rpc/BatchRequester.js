const RPCError = require('../provider/RPCError');

class BatchRequester {
  constructor(provider) {
    this.provider = provider;
    this.requests = [];
    this.decoders = [];
  }

  /**
   * request is a object with `method` and `params` for example:
   * {"method": "cfx_getStatus", "params": []}
   */
  add({ request, decoder = () => {} }) {
    this.requests.push(request);
    this.decoders.push(decoder);
  }

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
