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
      let result;
      let paramsVerified = false;
      try {
        if (beforeHook) {
          beforeHook(...args);
        }
        const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
        paramsVerified = true;
        result = await this.conflux.request({ method, params });
        return responseFormatter(result);
      } catch (error) {
        error.rpcMethod = method;
        error.paramsVerified = paramsVerified;
        error.rpcParams = args;
        // if rpc result is not null, means params normalization and rpc call is successful
        error.rpcResult = result;
        throw error;
      }
    }

    rpcMethod.request = function (...args) {
      let paramsVerified = false;
      try {
        const params = Array.from(args).map((arg, i) => (requestFormatters[i] ? requestFormatters[i](arg) : arg));
        paramsVerified = true;
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
        error.paramsVerified = paramsVerified;
        throw error;
      }
    };

    return rpcMethod;
  }
}

module.exports = RPCMethodFactory;
