const lodash = require('lodash');

// ============================================================================
class ParserError extends Error {
  constructor() {
    super();
    this.msg = '';
    this.path = [];
    this.origin = undefined;
  }

  set(error, key, origin) {
    if (error instanceof ParserError) { // include ParserError
      this.msg = error.msg;
      this.path = error.path;
    } else if (error instanceof Error) {
      this.msg = error.message;
    } else {
      this.msg = `${error}`;
    }

    if (key !== undefined) {
      this.path.unshift(key);
    }

    this.origin = origin;
    return this;
  }

  get message() {
    return JSON.stringify({
      msg: this.msg,
      path: this.path.join(''),
      origin: this.origin,
    });
  }
}

// ----------------------------------------------------------------------------
function valueParser(schema) {
  return asParser(value => {
    if (!(value === schema)) {
      throw new Error(`${value} not equal ${schema}`);
    }
    return value;
  });
}

function functionParser(func) {
  return asParser(value => func(value));
}

function arrayParser(schema) {
  const func = schema.length ? parser(schema[0]) : v => v;

  return asParser(array => {
    if (!Array.isArray(array)) {
      throw new Error(`expected array, got ${typeof array}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    return array.map((v, i) => {
      try {
        return func(v);
      } catch (e) {
        throw error.set(e, `[${i}]`, array);
      }
    });
  });
}

function objectParser(schema, pick = false) {
  const keyToFunc = lodash.mapValues(schema, parser);

  return asParser(object => {
    if (!lodash.isObject(object)) {
      throw new Error(`expected plain object, got ${typeof object}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    const picked = lodash.mapValues(keyToFunc, (func, key) => {
      try {
        return func(object[key]);
      } catch (e) {
        throw error.set(e, `.${key}`, object);
      }
    });

    return pick ? picked : lodash.defaults(picked, object);
  });
}

function $before(func) {
  return asParser(value => {
    return this(func(value));
  });
}

function $after(func) {
  return asParser(value => {
    return func(this(value));
  });
}

function $default(defaultValue) {
  return asParser(value => {
    if (value === undefined) {
      value = defaultValue;
    }
    return this(value);
  });
}

function $validate(func, name = func.name) {
  return asParser(value => {
    value = this(value);
    if (!func(value)) {
      throw new Error(`${value} not match ${name}`);
    }
    return value;
  });
}

function $or(schema) {
  const other = parser(schema);

  return asParser(value => {
    const funcArray = [this, other];

    const errorArray = [];
    for (const func of funcArray) {
      try {
        return func(value);
      } catch (e) {
        errorArray.push(e instanceof ParserError ? e.msg : e.message);
      }
    }

    throw new Error(errorArray.map(e => `(${e})`).join(' && '));
  });
}

function asParser(func) {
  func.$before = $before;
  func.$after = $after;
  func.$default = $default;
  func.$validate = $validate;
  func.$or = $or;
  return func;
}

function parser(arg, ...args) {
  if (Array.isArray(arg)) {
    return arrayParser(arg, ...args);
  }

  if (lodash.isPlainObject(arg)) {
    return objectParser(arg, ...args);
  }

  if (lodash.isFunction(arg)) {
    return functionParser(arg, ...args);
  }

  return valueParser(arg, ...args);
}

module.exports = parser;
