const lodash = require('lodash');
const callable = require('./callable');

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
  return value => {
    if (!(value === schema)) {
      throw new Error(`${value} not equal ${schema}`);
    }
    return value;
  };
}

function arrayParser(parser) {
  return array => {
    if (!Array.isArray(array)) {
      throw new Error(`expected array, got ${typeof array}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    return array.map((v, i) => {
      try {
        return parser(v);
      } catch (e) {
        throw error.set(e, `[${i}]`, array);
      }
    });
  };
}

function objectParser(keyToParser) {
  return object => {
    if (!lodash.isObject(object)) {
      throw new Error(`expected plain object, got ${typeof object}`);
    }

    const error = new ParserError(); // create Error here for shallow stack
    const picked = lodash.mapValues(keyToParser, (parser, key) => {
      try {
        return parser(object[key]);
      } catch (e) {
        throw error.set(e, `.${key}`, object);
      }
    });

    return lodash.defaults(picked, object);
  };
}

// ----------------------------------------------------------------------------
class Parser {
  constructor(arg) {
    if (Array.isArray(arg)) {
      const parser = arg.length ? new this.constructor(arg[0]) : v => v;
      arg = arrayParser(parser);
    } else if (lodash.isPlainObject(arg)) {
      const keyToParser = lodash.mapValues(arg, v => new this.constructor(v));
      arg = objectParser(keyToParser);
    } else if (!lodash.isFunction(arg)) {
      arg = valueParser(arg);
    }
    return callable(this, arg);
  }

  /**
   * @param defaultValue {*}
   * @return {Parser}
   */
  default(defaultValue) {
    const inner = value => {
      if (value === undefined) {
        value = defaultValue;
      }
      return this(value);
    };
    return new this.constructor(inner);
  }

  parse(schema) {
    const outer = new this.constructor(schema);
    const inner = value => outer(this(value));
    return new this.constructor(inner);
  }

  /**
   * @param func {function}
   * @param [name] {string}
   * @return {Parser}
   */
  validate(func, name = func.name) {
    const inner = value => {
      value = this(value);
      if (!func(value)) {
        throw new Error(`${value} not match ${name}`);
      }
      return value;
    };
    return new this.constructor(inner);
  }

  /**
   * @param schema {*}
   * @return {Parser}
   */
  or(schema) {
    const other = new this.constructor(schema);
    const parserArray = [this, other];

    const inner = value => {
      const errorArray = [];
      for (const parser of parserArray) {
        try {
          return parser(value);
        } catch (e) {
          errorArray.push(e instanceof ParserError ? e.msg : e.message);
        }
      }

      throw new Error(errorArray.map(e => `(${e})`).join(' && '));
    };
    return new this.constructor(inner);
  }
}

module.exports = callable.withoutNew(Parser);
