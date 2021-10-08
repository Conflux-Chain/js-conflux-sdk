const format = require('../util/format');

class RPCMethodFactory {
  constructor(provider, methods = []) {
    this.provider = provider;
    this.addMethods(methods);
  }

  addMethods(methods) {
    for (const methodMeta of methods) {
      const method = methodMeta.method.split('_')[1];
      this[method] = this.createRPCMethod(methodMeta);
    }
  }

  createRPCMethod({ method, requestFormatters = [], responseFormatter = format.any, beforeHook }) {
    return async function (...args) {
      if (beforeHook) {
        beforeHook(...args);
      }
      const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
      const result = await this.provider.call(method, ...params);
      return responseFormatter(result);
    };
  }
}

module.exports = RPCMethodFactory;
