//some extra libraries
/*
 json2.js
 2014-02-04

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
  }
  
  (function () {
    'use strict';
  
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
  
    if (typeof Date.prototype.toJSON !== 'function') {
  
        Date.prototype.toJSON = function () {
  
            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };
  
        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
    }
  
    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;
  
  
    function quote(string) {
  
  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.
  
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
  
  
    function str(key, holder) {
  
  // Produce a string from holder[key].
  
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
  
  // If the value has a toJSON method, call it to obtain a replacement value.
  
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
  
  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.
  
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
  
  // What happens next depends on the value's type.
  
        switch (typeof value) {
            case 'string':
                return quote(value);
  
            case 'number':
  
  // JSON numbers must be finite. Encode non-finite numbers as null.
  
                return isFinite(value) ? String(value) : 'null';
  
            case 'boolean':
            case 'null':
  
  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.
  
                return String(value);
  
  // If the type is 'object', we might be dealing with an object or an array or
  // null.
  
            case 'object':
  
  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.
  
                if (!value) {
                    return 'null';
                }
  
  // Make an array to hold the partial results of stringifying this object value.
  
                gap += indent;
                partial = [];
  
  // Is the value an array?
  
                if (Object.prototype.toString.apply(value) === '[object Array]') {
  
  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.
  
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
  
  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.
  
                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
  
  // If the replacer is an array, use it to select the members to be stringified.
  
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
  
  // Otherwise, iterate through all of the keys in the object.
  
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
  
  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.
  
                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
  
  // If the JSON object does not yet have a stringify method, give it one.
  
    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {
  
  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.
  
            var i;
            gap = '';
            indent = '';
  
  // If the space parameter is a number, make an indent string containing that
  // many spaces.
  
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
  
  // If the space parameter is a string, it will be used as the indent string.
  
            } else if (typeof space === 'string') {
                indent = space;
            }
  
  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.
  
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
  
  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  
            return str('', {'': value});
        };
    }
  
  
  // If the JSON object does not yet have a parse method, give it one.
  
    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {
  
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.
  
            var j;
  
            function walk(holder, key) {
  
  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.
  
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
  
  
  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
  
  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  
            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  
  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.
  
                j = eval('(' + text + ')');
  
  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.
  
                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }
  
  // If the text is not JSON parseable, then a SyntaxError is thrown.
  
            throw new SyntaxError('JSON.parse');
        };
    }
  }());
  function escape (key, val) {
    if (typeof(val)!="string") return val;
    return val      
        .replace(/[\\\\]/g, '\\')
        .replace(/[\/]/g, '\/')
  //~       .replace(/[\b]/g, '\\b')
  //~       .replace(/[\f]/g, '\\f')
  //~       .replace(/[\n]/g, '\\n')
  //~       .replace(/[\r]/g, '\\r')
  //~       .replace(/[\t]/g, '\\t')
        .replace(/[\\"]/g, '\"')
        .replace(/\'/g, "\'"); 
  }
  
  
  function requestHandler() {}
  requestHandler.prototype = {
    parse: function (req) {
      // $.writeln(req)
      var res=req;
      if (typeof req == "string") {
        try{
          res=JSON.parse(unescape (decodeURIComponent (req)));
        }catch(err){
          alert(err)
          try{
            res=eval(req)
          }catch(err){
            alert(err)
          }
        }
      }else {
          return req
      }
      return res
    },
    toString: function (res) {
      return JSON.stringify(res);
    },
    args: {
      get: function (obj, key) {
        var obj_key = obj[key];
        if (obj_key) return obj_key;
        else {
          return {};
        } //add warning
      },
      push: function () {},
    },
    error: {
      find: function () {},
      push: function () {},
    },
  };
  var RH = new requestHandler();
  function logger(name_user) {
    var folder_log =
      Folder.myDocuments.fsName.replace(/\\/g, "/") + "/" + name_user;
    if (!Folder(folder_log).exists) {
      Folder(folder_log).create();
    }
  
    this.log_path = File(folder_log + "/log.log");
    if (this.log_path.exists) this.log_path.remove();
    this.log("log Extendscript inited");
  }
  logger.prototype.logger = function (msg, event) {
    var obj = RH.parse(msg);
    var data = obj.arguments.data;
    this.log(data);
  };
  logger.prototype.log = function (msg, event) {
    try {
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
  
      var f = this.log_path;
      f.encoding = "UTF-8";
      f.open("a");
      f.writeln(
        "ExtendScript: " +
          dateTime +
          ":  " +
          (event ? event : " INFO ") +
          " ====> " +
          msg
      );
      f.close();
    } catch (e) {}
  };
  var LOGGER = new logger("milu");
  //     Underscore.js 1.9.1
  //     http://underscorejs.org
  //     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.
  
  var A=function() {
  
    // Baseline setup
    // --------------
  
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
              typeof global == 'object' && global.global === global && global ||
              this ||
              {};
  
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
  
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
  
    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
  
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;
  
    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function(){};
  
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };
  
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
      if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }
  
    // Current version.
    _.VERSION = '1.9.1';
  
    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function(func, context, argCount) {
      if (context === void 0) return func;
      switch (argCount == null ? 3 : argCount) {
        case 1: return function(value) {
          return func.call(context, value);
        };
        // The 2-argument case is omitted because we’re not using it.
        case 3: return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
      }
      return function() {
        return func.apply(context, arguments);
      };
    };
  
    var builtinIteratee;
  
    // An internal function to generate callbacks that can be applied to each
    // element in a collection, returning the desired result — either `identity`,
    // an arbitrary callback, a property matcher, or a property accessor.
    var cb = function(value, context, argCount) {
      if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
      if (value == null) return _.identity;
      if (_.isFunction(value)) return optimizeCb(value, context, argCount);
      if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
      return _.property(value);
    };
  
    // External wrapper for our callback generator. Users may customize
    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only argCount argument.
    _.iteratee = builtinIteratee = function(value, context) {
      return cb(value, context, Infinity);
    };
  
    // Some functions take a variable number of arguments, or a few expected
    // arguments at the beginning and then a variable number of values to operate
    // on. This helper accumulates all remaining arguments past the function’s
    // argument length (or an explicit `startIndex`), into an array that becomes
    // the last argument. Similar to ES6’s "rest parameter".
    var restArguments = function(func, startIndex) {
      startIndex = startIndex == null ? func.length - 1 : +startIndex;
      return function() {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
          rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, arguments[0], rest);
          case 2: return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
          args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
      };
    };
  
    // An internal function for creating a new object that inherits from another.
    var baseCreate = function(prototype) {
      if (!_.isObject(prototype)) return {};
      if (nativeCreate) return nativeCreate(prototype);
      Ctor.prototype = prototype;
      var result = new Ctor;
      Ctor.prototype = null;
      return result;
    };
  
    var shallowProperty = function(key) {
      return function(obj) {
        return obj == null ? void 0 : obj[key];
      };
    };
  
    var has = function(obj, path) {
      return obj != null && hasOwnProperty.call(obj, path);
    }
  
    var deepGet = function(obj, path) {
      var length = path.length;
      for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
      }
      return length ? obj : void 0;
    };
  
    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = shallowProperty('length');
    var isArrayLike = function(collection) {
      var length = getLength(collection);
      return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
  
    // Collection Functions
    // --------------------
  
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function(obj, iteratee, context) {
      iteratee = optimizeCb(iteratee, context);
      var i, length;
      if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
          iteratee(obj[keys[i]], keys[i], obj);
        }
      }
      return obj;
    };
  
    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function(obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          results = Array(length);
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };
  
    // Create a reducing function iterating left or right.
    var createReduce = function(dir) {
      // Wrap code that reassigns argument variables in a separate function than
      // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
      var reducer = function(obj, iteratee, memo, initial) {
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        if (!initial) {
          memo = obj[keys ? keys[index] : index];
          index += dir;
        }
        for (; index >= 0 && index < length; index += dir) {
          var currentKey = keys ? keys[index] : index;
          memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
      };
  
      return function(obj, iteratee, memo, context) {
        var initial = arguments.length >= 3;
        return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
      };
    };
  
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);
  
    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);
  
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, predicate, context) {
      var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
      var key = keyFinder(obj, predicate, context);
      if (key !== void 0 && key !== -1) return obj[key];
    };
  
    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function(obj, predicate, context) {
      var results = [];
      predicate = cb(predicate, context);
      _.each(obj, function(value, index, list) {
        if (predicate(value, index, list)) results.push(value);
      });
      return results;
    };
  
    // Return all the elements for which a truth test fails.
    _.reject = function(obj, predicate, context) {
      return _.filter(obj, _.negate(cb(predicate)), context);
    };
  
    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj)) return false;
      }
      return true;
    };
  
    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
      }
      return false;
    };
  
    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      if (typeof fromIndex != 'number' || guard) fromIndex = 0;
      return _.indexOf(obj, item, fromIndex) >= 0;
    };
  
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = restArguments(function(obj, path, args) {
      var contextPath, func;
      if (_.isFunction(path)) {
        func = path;
      } else if (_.isArray(path)) {
        contextPath = path.slice(0, -1);
        path = path[path.length - 1];
      }
      return _.map(obj, function(context) {
        var method = func;
        if (!method) {
          if (contextPath && contextPath.length) {
            context = deepGet(context, contextPath);
          }
          if (context == null) return void 0;
          method = context[path];
        }
        return method == null ? method : method.apply(context, args);
      });
    });
  
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
      return _.map(obj, _.property(key));
    };
  
    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs) {
      return _.filter(obj, _.matcher(attrs));
    };
  
    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
      return _.find(obj, _.matcher(attrs));
    };
  
    // Return the maximum element (or element-based computation).
    _.max = function(obj, iteratee, context) {
      var result = -Infinity, lastComputed = -Infinity,
          value, computed;
      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value != null && value > result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function(v, index, list) {
          computed = iteratee(v, index, list);
          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }
      return result;
    };
  
    // Return the minimum element (or element-based computation).
    _.min = function(obj, iteratee, context) {
      var result = Infinity, lastComputed = Infinity,
          value, computed;
      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value != null && value < result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function(v, index, list) {
          computed = iteratee(v, index, list);
          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }
      return result;
    };
  
    // Shuffle a collection.
    _.shuffle = function(obj) {
      return _.sample(obj, Infinity);
    };
  
    // Sample **n** random values from a collection using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function(obj, n, guard) {
      if (n == null || guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
      }
      var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
      var length = getLength(sample);
      n = Math.max(Math.min(n, length), 0);
      var last = length - 1;
      for (var index = 0; index < n; index++) {
        var rand = _.random(index, last);
        var temp = sample[index];
        sample[index] = sample[rand];
        sample[rand] = temp;
      }
      return sample.slice(0, n);
    };
  
    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function(obj, iteratee, context) {
      var index = 0;
      iteratee = cb(iteratee, context);
      return _.pluck(_.map(obj, function(value, key, list) {
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
      }), 'value');
    };
  
    // An internal function used for aggregate "group by" operations.
    var group = function(behavior, partition) {
      return function(obj, iteratee, context) {
        var result = partition ? [[], []] : {};
        iteratee = cb(iteratee, context);
        _.each(obj, function(value, index) {
          var key = iteratee(value, index, obj);
          behavior(result, value, key);
        });
        return result;
      };
    };
  
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function(result, value, key) {
      if (has(result, key)) result[key].push(value); else result[key] = [value];
    });
  
    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function(result, value, key) {
      result[key] = value;
    });
  
    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function(result, value, key) {
      if (has(result, key)) result[key]++; else result[key] = 1;
    });
  
    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    // Safely create a real, live array from anything iterable.
    _.toArray = function(obj) {
      if (!obj) return [];
      if (_.isArray(obj)) return slice.call(obj);
      if (_.isString(obj)) {
        // Keep surrogate pair characters together
        return obj.match(reStrSymbol);
      }
      if (isArrayLike(obj)) return _.map(obj, _.identity);
      return _.values(obj);
    };
  
    // Return the number of elements in an object.
    _.size = function(obj) {
      if (obj == null) return 0;
      return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };
  
    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = group(function(result, value, pass) {
      result[pass ? 0 : 1].push(value);
    }, true);
  
    // Array Functions
    // ---------------
  
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null || array.length < 1) return n == null ? void 0 : [];
      if (n == null || guard) return array[0];
      return _.initial(array, array.length - n);
    };
  
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };
  
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function(array, n, guard) {
      if (array == null || array.length < 1) return n == null ? void 0 : [];
      if (n == null || guard) return array[array.length - 1];
      return _.rest(array, Math.max(0, array.length - n));
    };
  
    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function(array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n);
    };
  
    // Trim out all falsy values from an array.
    _.compact = function(array) {
      return _.filter(array, Boolean);
    };
  
    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, strict, output) {
      output = output || [];
      var idx = output.length;
      for (var i = 0, length = getLength(input); i < length; i++) {
        var value = input[i];
        if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
          // Flatten current level of array or arguments object.
          if (shallow) {
            var j = 0, len = value.length;
            while (j < len) output[idx++] = value[j++];
          } else {
            flatten(value, shallow, strict, output);
            idx = output.length;
          }
        } else if (!strict) {
          output[idx++] = value;
        }
      }
      return output;
    };
  
    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function(array, shallow) {
      return flatten(array, shallow, false);
    };
  
    // Return a version of the array that does not contain the specified value(s).
    _.without = restArguments(function(array, otherArrays) {
      return _.difference(array, otherArrays);
    });
  
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // The faster algorithm will not work with an iteratee if the iteratee
    // is not a one-to-one function, so providing an iteratee will disable
    // the faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
      if (!_.isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
      }
      if (iteratee != null) iteratee = cb(iteratee, context);
      var result = [];
      var seen = [];
      for (var i = 0, length = getLength(array); i < length; i++) {
        var value = array[i],
            computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted && !iteratee) {
          if (!i || seen !== computed) result.push(value);
          seen = computed;
        } else if (iteratee) {
          if (!_.contains(seen, computed)) {
            seen.push(computed);
            result.push(value);
          }
        } else if (!_.contains(result, value)) {
          result.push(value);
        }
      }
      return result;
    };
  
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = restArguments(function(arrays) {
      return _.uniq(flatten(arrays, true, true));
    });
  
    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
      var result = [];
      var argsLength = arguments.length;
      for (var i = 0, length = getLength(array); i < length; i++) {
        var item = array[i];
        if (_.contains(result, item)) continue;
        var j;
        for (j = 1; j < argsLength; j++) {
          if (!_.contains(arguments[j], item)) break;
        }
        if (j === argsLength) result.push(item);
      }
      return result;
    };
  
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = restArguments(function(array, rest) {
      rest = flatten(rest, true, true);
      return _.filter(array, function(value){
        return !_.contains(rest, value);
      });
    });
  
    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices.
    _.unzip = function(array) {
      var length = array && _.max(array, getLength).length || 0;
      var result = Array(length);
  
      for (var index = 0; index < length; index++) {
        result[index] = _.pluck(array, index);
      }
      return result;
    };
  
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = restArguments(_.unzip);
  
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values. Passing by pairs is the reverse of _.pairs.
    _.object = function(list, values) {
      var result = {};
      for (var i = 0, length = getLength(list); i < length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };
  
    // Generator function to create the findIndex and findLastIndex functions.
    var createPredicateIndexFinder = function(dir) {
      return function(array, predicate, context) {
        predicate = cb(predicate, context);
        var length = getLength(array);
        var index = dir > 0 ? 0 : length - 1;
        for (; index >= 0 && index < length; index += dir) {
          if (predicate(array[index], index, array)) return index;
        }
        return -1;
      };
    };
  
    // Returns the first index on an array-like that passes a predicate test.
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);
  
    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iteratee, context) {
      iteratee = cb(iteratee, context, 1);
      var value = iteratee(obj);
      var low = 0, high = getLength(array);
      while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
      }
      return low;
    };
  
    // Generator function to create the indexOf and lastIndexOf functions.
    var createIndexFinder = function(dir, predicateFind, sortedIndex) {
      return function(array, item, idx) {
        var i = 0, length = getLength(array);
        if (typeof idx == 'number') {
          if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
          } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
          }
        } else if (sortedIndex && idx && length) {
          idx = sortedIndex(array, item);
          return array[idx] === item ? idx : -1;
        }
        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), _.isNaN);
          return idx >= 0 ? idx + i : -1;
        }
        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx;
        }
        return -1;
      };
    };
  
    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
      if (stop == null) {
        stop = start || 0;
        start = 0;
      }
      if (!step) {
        step = stop < start ? -1 : 1;
      }
  
      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);
  
      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }
  
      return range;
    };
  
    // Chunk a single array into multiple arrays, each containing `count` or fewer
    // items.
    _.chunk = function(array, count) {
      if (count == null || count < 1) return [];
      var result = [];
      var i = 0, length = array.length;
      while (i < length) {
        result.push(slice.call(array, i, i += count));
      }
      return result;
    };
  
    // Function (ahem) Functions
    // ------------------
  
    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments.
    var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
      if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
      var self = baseCreate(sourceFunc.prototype);
      var result = sourceFunc.apply(self, args);
      if (_.isObject(result)) return result;
      return self;
    };
  
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = restArguments(function(func, context, args) {
      if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
      var bound = restArguments(function(callArgs) {
        return executeBound(func, bound, context, this, args.concat(callArgs));
      });
      return bound;
    });
  
    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder by default, allowing any combination of arguments to be
    // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
    _.partial = restArguments(function(func, boundArgs) {
      var placeholder = _.partial.placeholder;
      var bound = function() {
        var position = 0, length = boundArgs.length;
        var args = Array(length);
        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
        }
        while (position < arguments.length) args.push(arguments[position++]);
        return executeBound(func, bound, this, this, args);
      };
      return bound;
    });
  
    _.partial.placeholder = _;
  
    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = restArguments(function(obj, keys) {
      keys = flatten(keys, false, false);
      var index = keys.length;
      if (index < 1) throw new Error('bindAll must be passed function names');
      while (index--) {
        var key = keys[index];
        obj[key] = _.bind(obj[key], obj);
      }
    });
  
    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
      var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
      };
      memoize.cache = {};
      return memoize;
    };
  
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = restArguments(function(func, wait, args) {
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    });
  
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);
  
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function(func, wait, options) {
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};
  
      var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };
  
      var throttled = function() {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
  
      throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
      };
  
      return throttled;
    };
  
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout, result;
  
      var later = function(context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
      };
  
      var debounced = restArguments(function(args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
          var callNow = !timeout;
          timeout = setTimeout(later, wait);
          if (callNow) result = func.apply(this, args);
        } else {
          timeout = _.delay(later, wait, this, args);
        }
  
        return result;
      });
  
      debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
      };
  
      return debounced;
    };
  
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
      return _.partial(wrapper, func);
    };
  
    // Returns a negated version of the passed-in predicate.
    _.negate = function(predicate) {
      return function() {
        return !predicate.apply(this, arguments);
      };
    };
  
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
      var args = arguments;
      var start = args.length - 1;
      return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
      };
    };
  
    // Returns a function that will only be executed on and after the Nth call.
    _.after = function(times, func) {
      return function() {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };
  
    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function(times, func) {
      var memo;
      return function() {
        if (--times > 0) {
          memo = func.apply(this, arguments);
        }
        if (times <= 1) func = null;
        return memo;
      };
    };
  
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);
  
    _.restArguments = restArguments;
  
    // Object Functions
    // ----------------
  
    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  
    var collectNonEnumProps = function(obj, keys) {
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
  
      // Constructor is a special case.
      var prop = 'constructor';
      if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
  
      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    };
  
    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    _.keys = function(obj) {
      if (!_.isObject(obj)) return [];
      if (nativeKeys) return nativeKeys(obj);
      var keys = [];
      for (var key in obj) if (has(obj, key)) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };
  
    // Retrieve all the property names of an object.
    _.allKeys = function(obj) {
      if (!_.isObject(obj)) return [];
      var keys = [];
      for (var key in obj) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };
  
    // Retrieve the values of an object's properties.
    _.values = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var values = Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
      }
      return values;
    };
  
    // Returns the results of applying the iteratee to each element of the object.
    // In contrast to _.map it returns an object.
    _.mapObject = function(obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys = _.keys(obj),
          length = keys.length,
          results = {};
      for (var index = 0; index < length; index++) {
        var currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };
  
    // Convert an object into a list of `[key, value]` pairs.
    // The opposite of _.object.
    _.pairs = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var pairs = Array(length);
      for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
      }
      return pairs;
    };
  
    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
      var result = {};
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
      }
      return result;
    };
  
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`.
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };
  
    // An internal function for creating assigner functions.
    var createAssigner = function(keysFunc, defaults) {
      return function(obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
          var source = arguments[index],
              keys = keysFunc(source),
              l = keys.length;
          for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (!defaults || obj[key] === void 0) obj[key] = source[key];
          }
        }
        return obj;
      };
    };
  
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);
  
    // Assigns a given object with all the own properties in the passed-in object(s).
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);
  
    // Returns the first key on an object that passes a predicate test.
    _.findKey = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = _.keys(obj), key;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (predicate(obj[key], key, obj)) return key;
      }
    };
  
    // Internal pick helper function to determine if `obj` has key `key`.
    var keyInObj = function(value, key, obj) {
      return key in obj;
    };
  
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = restArguments(function(obj, keys) {
      var result = {}, iteratee = keys[0];
      if (obj == null) return result;
      if (_.isFunction(iteratee)) {
        if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
        keys = _.allKeys(obj);
      } else {
        iteratee = keyInObj;
        keys = flatten(keys, false, false);
        obj = Object(obj);
      }
      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
      return result;
    });
  
    // Return a copy of the object without the blacklisted properties.
    _.omit = restArguments(function(obj, keys) {
      var iteratee = keys[0], context;
      if (_.isFunction(iteratee)) {
        iteratee = _.negate(iteratee);
        if (keys.length > 1) context = keys[1];
      } else {
        keys = _.map(flatten(keys, false, false), String);
        iteratee = function(value, key) {
          return !_.contains(keys, key);
        };
      }
      return _.pick(obj, iteratee, context);
    });
  
    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);
  
    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function(prototype, props) {
      var result = baseCreate(prototype);
      if (props) _.extendOwn(result, props);
      return result;
    };
  
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
  
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };
  
    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function(object, attrs) {
      var keys = _.keys(attrs), length = keys.length;
      if (object == null) return !length;
      var obj = Object(object);
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  
  
    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    eq = function(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) return a !== 0 || 1 / a === 1 / b;
      // `null` or `undefined` only equal to itself (strict comparison).
      if (a == null || b == null) return false;
      // `NaN`s are equivalent, but non-reflexive.
      if (a !== a) return b !== b;
      // Exhaust primitive checks
      var type = typeof a;
      if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
      return deepEq(a, b, aStack, bStack);
    };
  
    // Internal recursive comparison function for `isEqual`.
    deepEq = function(a, b, aStack, bStack) {
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped;
      if (b instanceof _) b = b._wrapped;
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className !== toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return '' + a === '' + b;
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive.
          // Object(NaN) is equivalent to NaN.
          if (+a !== +a) return +b !== +b;
          // An `egal` comparison is performed for other numeric values.
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a === +b;
        case '[object Symbol]':
          return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      }
  
      var areArrays = className === '[object Array]';
      if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;
  
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                                 _.isFunction(bCtor) && bCtor instanceof bCtor)
                            && ('constructor' in a && 'constructor' in b)) {
          return false;
        }
      }
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  
      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.
      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
      }
  
      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);
  
      // Recursively compare objects and arrays.
      if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
          if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
      } else {
        // Deep compare objects.
        var keys = _.keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (_.keys(b).length !== length) return false;
        while (length--) {
          // Deep compare each member
          key = keys[length];
          if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return true;
    };
  
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
      return eq(a, b);
    };
  
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
      if (obj == null) return true;
      if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
      return _.keys(obj).length === 0;
    };
  
    // Is a given value a DOM element?
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
    };
  
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    };
  
    // Is a given variable an object?
    _.isObject = function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };
  
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
      };
    });
  
    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return has(obj, 'callee');
      };
    }
  
    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  //~   var nodelist = root.document && root.document.childNodes;
  //~   if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  //~     _.isFunction = function(obj) {
  //~       return typeof obj == 'function' || false;
  //~     };
  //~   }
  
    // Is a given object a finite number?
    _.isFinite = function(obj) {
      return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };
  
    // Is the given value `NaN`?
    _.isNaN = function(obj) {
      return _.isNumber(obj) && isNaN(obj);
    };
  
    // Is a given value a boolean?
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
  
    // Is a given value equal to null?
    _.isNull = function(obj) {
      return obj === null;
    };
  
    // Is a given variable undefined?
    _.isUndefined = function(obj) {
      return obj === void 0;
    };
  
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, path) {
      if (!_.isArray(path)) {
        return has(obj, path);
      }
      var length = path.length;
      for (var i = 0; i < length; i++) {
        var key = path[i];
        if (obj == null || !hasOwnProperty.call(obj, key)) {
          return false;
        }
        obj = obj[key];
      }
      return !!length;
    };
  
    // Utility Functions
    // -----------------
  
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };
  
    // Keep the identity function around for default iteratees.
    _.identity = function(value) {
      return value;
    };
  
    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function(value) {
      return function() {
        return value;
      };
    };
  
    _.noop = function(){};
  
    // Creates a function that, when passed an object, will traverse that object’s
    // properties down the given `path`, specified as an array of keys or indexes.
    _.property = function(path) {
      if (!_.isArray(path)) {
        return shallowProperty(path);
      }
      return function(obj) {
        return deepGet(obj, path);
      };
    };
  
    // Generates a function for a given object that returns a given property.
    _.propertyOf = function(obj) {
      if (obj == null) {
        return function(){};
      }
      return function(path) {
        return !_.isArray(path) ? obj[path] : deepGet(obj, path);
      };
    };
  
    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function(attrs) {
      attrs = _.extendOwn({}, attrs);
      return function(obj) {
        return _.isMatch(obj, attrs);
      };
    };
  
    // Run a function **n** times.
    _.times = function(n, iteratee, context) {
      var accum = Array(Math.max(0, n));
      iteratee = optimizeCb(iteratee, context, 1);
      for (var i = 0; i < n; i++) accum[i] = iteratee(i);
      return accum;
    };
  
    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };
  
    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function() {
      return new Date().getTime();
    };
  
    // List of HTML entities for escaping.
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);
  
    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function(map) {
      var escaper = function(match) {
        return map[match];
      };
      // Regexes for identifying a key that needs to be escaped.
      var source = '(?:' + _.keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);
  
    // Traverses the children of `obj` along `path`. If a child is a function, it
    // is invoked with its parent as context. Returns the value of the final
    // child, or `fallback` if any child is undefined.
    _.result = function(obj, path, fallback) {
      if (!_.isArray(path)) path = [path];
      var length = path.length;
      if (!length) {
        return _.isFunction(fallback) ? fallback.call(obj) : fallback;
      }
      for (var i = 0; i < length; i++) {
        var prop = obj == null ? void 0 : obj[path[i]];
        if (prop === void 0) {
          prop = fallback;
          i = length; // Ensure we don't continue iterating.
        }
        obj = _.isFunction(prop) ? prop.call(obj) : prop;
      }
      return obj;
    };
  
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };
  
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };
  
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;
  
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
  
    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  
    var escapeChar = function(match) {
      return '\\' + escapes[match];
    };
  
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function(text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings;
      settings = _.defaults({}, settings, _.templateSettings);
  
      // Combine delimiters into one regular expression via alternation.
      var matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');
  
      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;
  
        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
  
        // Adobe VMs need the match returned to produce the correct offset.
        return match;
      });
      source += "';\n";
  
      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
  
      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';
  
      var render;
      try {
        render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
  
      var template = function(data) {
        return render.call(this, data, _);
      };
  
      // Provide the compiled source as a convenience for precompilation.
      var argument = settings.variable || 'obj';
      template.source = 'function(' + argument + '){\n' + source + '}';
  
      return template;
    };
  
    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function(obj) {
      var instance = _(obj);
      instance._chain = true;
      return instance;
    };
  
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
  
    // Helper function to continue chaining intermediate results.
    var chainResult = function(instance, obj) {
      return instance._chain ? _(obj).chain() : obj;
    };
  
    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
      _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return chainResult(this, func.apply(_, args));
        };
      });
      return _;
    };
  
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
  
    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        return chainResult(this, obj);
      };
    });
  
    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return chainResult(this, method.apply(this._wrapped, arguments));
      };
    });
  
    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
      return this._wrapped;
    };
  
    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
    _.prototype.toString = function() {
      return String(this._wrapped);
    };
                return _;
  
    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define == 'function' && define.amd) {
      define('underscore', [], function() {
  
      });
    }
  }
  var _=A()
  
  
  
//for logging from UI
function logging_F(obj_string) {
  var obj = RH.parse(obj_string);
  var data = obj.arguments.children;
  if (_.isObject(data)) {
    LOGGER.log(JSON.stringify(data));
  } else {
    LOGGER.log(String(data));
  }
}

function selectfile() {
  return File.openDialog("Select File").fsName.replace(/\\/g, "/");
}
function selectfiles() {
  var folderOfFiles=Folder.selectDialog("Select Folder")
  if(!folderOfFiles)return ""
  else return folderOfFiles.getFiles("*.psd"| "*.jpg"| "*.jpeg"| "*.png"| "*.svg").join('####')
}
function selectfolder() {
  return Folder.selectDialog("Select Folder").fsName.replace(/\\/g, "/");
}



if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = start || 0, j = this.length; i < j; i++) {
      if (this[i] === obj || obj.indexOf(this[i]) != -1) {
        return i;
      }
    }
    return -1;
  };
}
//loop on all artboard in document
//onlyOne to only target one artboard
//artboardIndexTarget is index of target artboard
// newData, data from translation API response
function loopArboards(onlyOne,artboardIndexTarget,newData) {
   if(app.name=='Adobe InDesign'){
       var activePage=null;
       var total=[];
if (app.documents.length > 0 && app.activeWindow) {
    var activePage = app.activeWindow.activePage;
    if (activePage) {
//~         alert("The active page is: " + activePage.name);
    } else {
        alert("There is no active page.");
    }
} else {
    alert("Please open a document and have a window active.");
}
    app.activeDocument.select(NothingEnum.NOTHING);

if (app.documents.length > 0 && app.activeWindow) {
    var activePage = app.activeWindow.activePage;
    var listFrames=[]
    if (activePage) {
        var textFramesOnPage = activePage.textFrames;
        if (textFramesOnPage.length > 0) {
//~             alert("Found " + textFramesOnPage.length + " text frames on page " + activePage.name + ".");
            // You can now loop through the text frames
            for (var i = 0; i < textFramesOnPage.length; i++) {
                var currentFrame = textFramesOnPage[i];
                // Do something with the text frame, for example, select it
                 
                 listFrames.push(currentFrame)
            }
        } else {
            alert("There are no text frames on page " + activePage.name + ".");
        }
    } else {
        alert("There is no active page.");
    }
} else {
    alert("Please open a document and have a window active.");
}

    var listArtboardTexts=loopOnAllTexts(listFrames,function(hash,item){
         if(newData){
                    for(var g=0;g<newData.length;g++){
                        //check if hash match data to current layer
                        if(newData[g][0][0]===hash){
                            $.writeln("pass-->"+newData[g][1])
                            item.contents=newData[g][1]
                            }
                        }
                     }
                })   
            total=total.concat (listArtboardTexts)
return total
   }
  
            

  var numArtboards = app.activeDocument.artboards.length;
  var total=[]
  LOGGER.log("numArtboards->"+numArtboards)
  for (var a = 0; a < numArtboards; a++) {
    if(onlyOne&&artboardIndexTarget!=a)continue;
    LOGGER.log("a->"+a)
    if(!newData){
      //deselect and select artboard layers
            app.executeMenuCommand("deselectall");

    var me = app.activeDocument.artboards.setActiveArtboardIndex(a);
    app.activeDocument.selectObjectsOnActiveArtboard();
    app.redraw()
    LOGGER.log("a->"+app.activeDocument.selection)
    $.sleep(3000)
    }
    //loop on all texts
    var listArtboardTexts=loopOnAllTexts(app.activeDocument.selection,function(hash,item){
         if(newData){
                    for(var g=0;g<newData.length;g++){
                        //check if hash match data to current layer
                        if(newData[g][0][0]===hash){
                            $.writeln("pass-->"+newData[g][1])
                            item.contents=newData[g][1]
                            }
                        }
                     }
                })    
             
    total=total.concat (listArtboardTexts)
    //  file_A = File(folder_obj.temp + "/" + obj.fileN + "_" + artboard_A_N + ".png")
    //  app.redraw()
    // if(!file_A.exists)eportPNGresolution(app.activeDocument,fileSpec,artboard_A)
    //fix issue with design dosn't export
    //to png without throwing any error 72
    
  }
  
return total
}
//hash function
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
//hash layer to get a unique ID
function hachTextFrame(textLayer){
    var left=String(Math.floor(Number(textLayer.geometricBounds[0]).toFixed(2)));
    var top=String(Math.floor(Number(textLayer.geometricBounds[1]).toFixed(2)));
    // var uuid=textLayer.uuid
    var uuid=""
    var hash=(uuid+left+top).hashCode()
    return hash
    }
if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}
function isOnlyNumbers(text) {
  return /^\d+$/.test(text);
}
//loop on all texts from
// listItems that is an array of layers
//cb callback to call for each layer match 
function loopOnAllTexts(listItems,cb){
  //progress bar
  var win = new Window("window{text:'Total Progress',bounds:[100,100,400,150],bar:Progressbar{bounds:[20,20,280,31] , value:0,maxvalue:"+listItems.length+"}};");
  win.show();
    var listFound=[]
for(var b=0;b<listItems.length;b++){
  try{
  LOGGER.log("start index->"+b)
  var isTextFrame=false
     var isGroup=false

   if(app.name=='Adobe InDesign'){
isGroup=listItems[b] instanceof Group

isTextFrame=listItems[b] instanceof TextFrame
   }else{
isTextFrame=listItems[b].typename === 'TextFrame'
isGroup=listItems[b].typename ==="GroupItem"

   }
//~ alert(listItems[b])
  if(isTextFrame){//layer is textframe

    win.bar.value = b;
    win.update()
    //hash text layer

    var hash=hachTextFrame(listItems[b]);

    if(!listItems[b].contents||isOnlyNumbers(listItems[b].contents)){
                LOGGER.log("Pass"+isNaN(listItems[b].contents))

      continue;
    }
    listFound.push([hash,listItems[b].contents])
    if(cb)cb(hash,listItems[b]);
    LOGGER.log("pass5")
  }else if(isGroup){//search inside group
    var listInGroup=loopOnAllTexts(listItems[b].textFrames,cb)
    listFound=listFound.concat(listInGroup)
  }
  LOGGER.log("end index->"+b)
}catch(err){
    alert(err)
  // if(win){
  //   win.close();
  // }
  LOGGER.log("end index->")
  LOGGER.log("end index->"+err)
}
}
LOGGER.log("end F1")
win.close();
LOGGER.log("end F2")
$.writeln(listFound.toSource())
    return listFound
    }
function escape(key, val) {
        if (typeof (val) != "string") return val;
        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
            .replace(/[\"]/g, '\\"')
            // .replace(/\\'/g, "\\'")
            .replace(/'/g, "####");
    }
function HReq(params){
    var params_string =encodeURIComponent((JSON.stringify(params))) 

    return params_string
    }

$._ext_ILST = {
  getAllTexts: function (obj_string) {//get alll text in documents based on user button selection or arboard or document
    LOGGER.log("---------------------START-------------------------------");
    // if (compareDate()) return;
var obj = RH.parse(obj_string);
var data = obj.arguments.data;
LOGGER.log(JSON.stringify(data));
var id=data.id;
    LOGGER.log("get"+id)
    var res11=""
    switch(id){
      case "Selección":

        res11=HReq(loopOnAllTexts(app.activeDocument.selection));
          
      break;
      case "Artboard":
      var targetInd=-1
        
       if(app.name=='Adobe InDesign'){
           }else{
        targetInd=app.activeDocument.artboards.getActiveArtboardIndex();
               
               }
        var listFound=loopArboards(true,targetInd)
      
        res11=HReq(listFound);
      ;break;
      case "Documento":
      //   var listFound=loopArboards(false)
      // return HReq(listFound);
        res11=HReq(loopOnAllTexts(app.activeDocument.textFrames));
      ;break;
    }
LOGGER.log("end->get"+res11);
return res11
  },
  setAllTexts: function (obj_string) {// set all text from response of tha API
    LOGGER.log("---------------------START-------------------------------");
    // if (compareDate()) return;
var obj = RH.parse(obj_string);
var data = obj.arguments.data;
LOGGER.log(JSON.stringify(data_final));
var id=data.id;
var data_final=data.data;
    LOGGER.log(id);
    switch(id){
      case "Selección":
            HReq(loopOnAllTexts(app.activeDocument.selection,function(hash,item){
              LOGGER.log("hash->"+hash);
                    for(var g=0;g<data_final.length;g++){

                        if(data_final[g][0][0]===hash){
                            item.contents=data_final[g][1]
                            }
                        }
                }));
      
      break;
      case "Artboard":
       var targetInd=-1
        
       if(app.name=='Adobe InDesign'){
           }else{
        targetInd=app.activeDocument.artboards.getActiveArtboardIndex();
               
               }
      LOGGER.log("targetInd->"+targetInd);
      var listFound=loopArboards(true,targetInd,data_final);
      LOGGER.log("listFound->"+listFound);
      
          
          HReq(listFound);
      ;break;
      case "Documento":
      //        var listFound=loopArboards(false,undefined,data_final)
      // return HReq(listFound);
      LOGGER.log("app.activeDocument.pageItems->"+app.activeDocument.textFrames.length);
      HReq(loopOnAllTexts(app.activeDocument.textFrames,function(hash,item){
        LOGGER.log("hash->"+hash)
        for(var g=0;g<data_final.length;g++){
            $.writeln(hash)
            if(data_final[g][0][0]===hash){
                $.writeln("pass")
                item.contents=data_final[g][1]
                }
            }
    }));
      ;break;
    }
    //app.redraw()
LOGGER.log("end->set");
  },

  // Returns the number of artboards (Illustrator) or pages (InDesign)
  getPageCount: function (obj_string) {
    LOGGER.log("getPageCount start");
    var count = 0;
    if (app.name === 'Adobe InDesign') {
      if (app.documents.length > 0) {
        count = app.activeDocument.pages.length;
      }
    } else {
      if (app.documents.length > 0) {
        count = app.activeDocument.artboards.length;
      }
    }
    LOGGER.log("getPageCount->" + count);
    return HReq({ count: count });
  },

  // Returns texts from a specific artboard/page by index
  getPageTexts: function (obj_string) {
    LOGGER.log("getPageTexts start");
    var obj = RH.parse(obj_string);
    var pageIndex = obj.arguments.data.pageIndex;
    var listFound = [];

    if (app.name === 'Adobe InDesign') {
      if (app.documents.length > 0) {
        var pages = app.activeDocument.pages;
        if (pageIndex >= 0 && pageIndex < pages.length) {
          var page = pages[pageIndex];
          var frames = [];
          for (var i = 0; i < page.textFrames.length; i++) {
            frames.push(page.textFrames[i]);
          }
          listFound = loopOnAllTexts(frames, null);
        }
      }
    } else {
      // Illustrator: activate artboard, select objects, then read
      if (app.documents.length > 0) {
        app.executeMenuCommand("deselectall");
        app.activeDocument.artboards.setActiveArtboardIndex(pageIndex);
        app.activeDocument.selectObjectsOnActiveArtboard();
        app.redraw();
        $.sleep(1500);
        listFound = loopOnAllTexts(app.activeDocument.selection, null);
      }
    }

    LOGGER.log("getPageTexts count->" + listFound.length);
    return HReq(listFound);
  },

  // Applies translations to a specific artboard/page by index
  setPageTexts: function (obj_string) {
    LOGGER.log("setPageTexts start");
    var obj = RH.parse(obj_string);
    var pageIndex = obj.arguments.data.pageIndex;
    var data_final = obj.arguments.data.data;

    function applyToFrames(frames) {
      loopOnAllTexts(frames, function (hash, item) {
        for (var g = 0; g < data_final.length; g++) {
          if (data_final[g][0][0] === hash) {
            item.contents = data_final[g][1];
          }
        }
      });
    }

    if (app.name === 'Adobe InDesign') {
      if (app.documents.length > 0) {
        var pages = app.activeDocument.pages;
        if (pageIndex >= 0 && pageIndex < pages.length) {
          var page = pages[pageIndex];
          var frames = [];
          for (var i = 0; i < page.textFrames.length; i++) {
            frames.push(page.textFrames[i]);
          }
          applyToFrames(frames);
        }
      }
    } else {
      if (app.documents.length > 0) {
        app.executeMenuCommand("deselectall");
        app.activeDocument.artboards.setActiveArtboardIndex(pageIndex);
        app.activeDocument.selectObjectsOnActiveArtboard();
        app.redraw();
        $.sleep(1500);
        applyToFrames(app.activeDocument.selection);
      }
    }

    LOGGER.log("setPageTexts done");
    return HReq({ ok: true });
  },
};
//~ alert(1)
LOGGER.log("LOAD all");

//~ $._ext_ILST.setAllTexts('%257B%2522arguments%2522%253A%257B%2522data%2522%253A%257B%2522id%2522%253A%2522Artboard%2522%252C%2522data%2522%253A%255B%255B%255B-688708811%252C%2522test%2520the%2520house%2522%255D%252C%2522%25u0627%25u062E%25u062A%25u0628%25u0627%25u0631%2520%25u0627%25u0644%25u0645%25u0646%25u0632%25u0644%2522%255D%252C%255B%255B20986180%252C%2522hello%2522%255D%252C%2522%25u0645%25u0631%25u062D%25u0628%25u0627%2522%255D%255D%257D%257D%252C%2522error%2522%253A%255B%255D%252C%2522return%2522%253A%255B%255D%257D')
