/* copy from koaflow@0.6.2/lib/parser */
const lodash = require('lodash');
const { PARSER_ERROR } = require('../ERROR_CODES');

class ParserError extends Error {
  constructor(message, options = {}) {
    super();
    this.message = message;
    this.code = PARSER_ERROR;
    Object.assign(this, options);
  }
}

class ParserContext {
  constructor(origin) {
    this.arguments = origin;
    this.path = [];
  }

  child(key) {
    const context = new ParserContext(this.arguments);
    context.path = [...this.path, key];
    return context;
  }

  error(message, options = {}) {
    message = `(Invalid input|args) ${message}`;
    if (this.path.length > 0) {
      message = `${message}; path="${this.path.join('.')}"`;
    }
    return new ParserError(message, { ...this, ...options });
  }
}

// ----------------------------------------------------------------------------
function Parser(func) {
  function parser(...args) {
    // eslint-disable-next-line prefer-rest-params
    const context = (this instanceof ParserContext) ? this : new ParserContext(arguments);
    return func.call(context, ...args);
    /* try {
      return func.call(context, ...args);
    } catch (e) {
      throw new ParserError(e.message, e); // create Error here for shallow stack
    } */
  }

  parser.constructor = Parser;
  parser.$before = $before;
  parser.$parse = $parse;
  parser.$default = $default;
  parser.$after = $after;
  parser.$validate = $validate;
  parser.$or = $or;
  return parser;
}

function $before(func) {
  const parser = this;
  return Parser(function (...args) {
    let value;
    try {
      value = func(...args);
    } catch (e) {
      throw this.error(e.message);
    }
    return parser.call(this, value);
  });
}

function $default(data) {
  return $before.call(this, value => (value === undefined ? data : value));
}

function $parse(func, condition = lodash.isString) {
  return $before.call(this, value => (condition(value) ? func(value) : value));
}

function $after(func) {
  const parser = this;
  return Parser(function (...args) {
    const value = parser.call(this, ...args);
    try {
      return func(value);
    } catch (e) {
      throw this.error(e.message);
    }
  });
}

function $validate(func, name) {
  return $after.call(this, value => {
    if (!func(value)) {
      throw new Error(`${value} do not match "${name || func.name || '$validate'}"`);
    }
    return value;
  });
}

function $or(schema) {
  const parserArray = [this, Parser.from(schema)];

  return Parser(function (value) {
    const errorArray = [];
    for (const parser of parserArray) {
      try {
        return parser.call(this, value);
      } catch (e) {
        errorArray.push(e);
      }
    }

    const or = errorArray.map(e => (e.or ? e.or : e));
    const message = lodash.flattenDeep(or).map(e => `(${e.message})`).join(' or ');
    throw new ParserError(`not match any ${message}`, { or });
  });
}

// ----------------------------------------------------------------------------
Parser.fromArray = function (schema, options) {
  const parser = Parser.from(schema.length ? schema[0] : v => v, options);

  return Parser(function (array) {
    if (!Array.isArray(array)) {
      throw this.error(`expected array, got ${typeof array}`);
    }

    return array.map((v, i) => parser.call(this.child(i), v));
  });
};

Parser.fromObject = function (schema, options) {
  const { strict, pick } = options;

  const keyToParser = lodash.mapValues(schema, s => Parser.from(s, options));

  return Parser(function (object) {
    if (!lodash.isObject(object)) {
      const errMsg = `"${options.name ? options.name : ''}" expected plain object, got "${typeof object}"`;
      throw this.error(errMsg);
    }

    const result = lodash.mapValues(keyToParser, (parser, k) => {
      const v = lodash.get(object, k);
      if (v === undefined && !strict) {
        return undefined;
      }
      return parser.call(this.child(k), v);
    });

    return pick ? lodash.pickBy(result, v => v !== undefined) : { ...object, ...result };
  });
};

Parser.fromFunction = function (func, options) {
  if (func.constructor === Parser) {
    return func;
  }
  return Parser(function (...args) {
    try {
      return func(...args);
    } catch (e) {
      const errMsg = `formatter: "${options.name || func.name}"; args: (${stringifyArgs(args)}) ; errorMessage: ${e.message}`;
      throw this.error(errMsg, { stack: e.stack });
    }
  });
};

Parser.fromValue = function (schema) {
  return Parser(function (value) {
    if (value !== schema) {
      throw this.error(`expected to be ${schema}, got ${value}`);
    }
    return value;
  });
};

Parser.from = function (schema, options = {}) {
  if (Array.isArray(schema)) {
    return Parser.fromArray(schema, options);
  }
  if (lodash.isPlainObject(schema)) {
    return Parser.fromObject(schema, options);
  }
  if (lodash.isFunction(schema)) {
    return Parser.fromFunction(schema, options);
  }
  return Parser.fromValue(schema);
};

function stringifyArgs(args) {
  function stringifyNullOrUndefined(v) {
    // eslint-disable-next-line no-nested-ternary
    return v === null ? 'null' : v === undefined ? 'undefined' : v;
  }
  return args.map(stringifyNullOrUndefined).join(',');
}

module.exports = Parser.from;
