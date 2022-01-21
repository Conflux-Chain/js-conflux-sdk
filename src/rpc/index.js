const format = require('../util/format');

class RPCMethodFactory {
  constructor(conflux, methods = []) {
    this.conflux = conflux;
    this.addMethods(methods);
  }

  addMethods(methods) {
    for (const methodMeta of methods) {
      const method = methodMeta.method.split('_')[1];
      this[method] = this.createRPCMethod(methodMeta);
      // create method alias
      if (methodMeta.alias) {
        this[methodMeta.alias] = this[method];
      }
    }
  }

  createRPCMethod({ method, requestFormatters = [], responseFormatter = format.any, beforeHook }) {
    async function rpcMethod(...args) {
      if (beforeHook) {
        beforeHook(...args);
      }
      const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
      const result = await this.conflux.request({ method, params });
      return responseFormatter(result);
    }

    rpcMethod.request = function (...args) {
      const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
      return {
        request: {
          method,
          params,
        },
        decoder: responseFormatter,
      };
    };

    return rpcMethod;
  }
}

module.exports = RPCMethodFactory;
