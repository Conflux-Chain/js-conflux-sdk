const { transform } = require('@babel/core');

module.exports = {
  process(src) {
    return `require = require('esm')(module);\n${src}`;
  },
};
