const format = require('../util/format');
const { rpcPatch } = require('./rpcPatch');

class RPCMethodFactory {
  constructor(conflux, methods = []) {
    this.conflux = conflux;
    this.addMethods(methods);
  }

  addMethods(methods) {
    for (const methodMeta of methods) {
      rpcPatch(methodMeta);
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
      try {
        if (beforeHook) {
          beforeHook(...args);
        }
        const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
        const result = await this.conflux.request({ method, params });
        return responseFormatter(result);
      } catch(error) {
        error.rpcMethod = method;
        error.rpcParams = args;
        throw error;
      }
    }

    rpcMethod.request = function (...args) {
      try {
        const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
        return {
          request: {
            method,
            params,
          },
          decoder: responseFormatter,
        };
      } catch (error) {
        error.rpcMethod = method;
        error.rpcParams = args;
        throw error;
      }
    };

    return rpcMethod;
  }
}

module.exports = RPCMethodFactory;
