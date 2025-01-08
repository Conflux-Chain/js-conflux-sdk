/**
 * Give a chance to change the RPC behavior.
 * For example, you may want to use a different responseFormatter for traceBlock.
 * @param rpcDef
 */

// eslint-disable-next-line no-unused-vars
function emptyPatchRPCMethod(rpcDef) {
  // const { method, requestFormatters, responseFormatter } = rpcDef;
}

let rpcPatch = emptyPatchRPCMethod;

// set it before initializing a new Conflux instance.
function setPRCMethodPatch(fn) {
  rpcPatch = fn;
}

module.exports = { rpcPatch, setPRCMethodPatch };
