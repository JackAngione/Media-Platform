"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAbsolutePositions = addAbsolutePositions;
exports.addQueryID = addQueryID;
exports.defer = void 0;
exports.find = find;
exports.getDisplayName = void 0;
exports.getObjectType = getObjectType;
exports.getPropertyByPath = void 0;
exports.objectHasKeys = objectHasKeys;
exports.omit = omit;
exports.shallowEqual = exports.removeEmptyKey = exports.removeEmptyArraysFromObject = void 0;
exports.unescapeFacetValue = unescapeFacetValue;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
// eslint-disable-next-line @typescript-eslint/unbound-method
var hasOwn = Object.prototype.hasOwnProperty;

// From https://github.com/reactjs/react-redux/blob/master/src/utils/shallowEqual.js
var shallowEqual = function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }
  return true;
};
exports.shallowEqual = shallowEqual;
var getDisplayName = function getDisplayName(Component) {
  return Component.displayName || Component.name || 'UnknownComponent';
};
exports.getDisplayName = getDisplayName;
var resolved = Promise.resolve();
var defer = function defer(f) {
  resolved.then(f);
};
exports.defer = defer;
var isPlainObject = function isPlainObject(value) {
  return _typeof(value) === 'object' && value !== null && !Array.isArray(value);
};
var removeEmptyKey = function removeEmptyKey(obj) {
  Object.keys(obj).forEach(function (key) {
    var value = obj[key];
    if (!isPlainObject(value)) {
      return;
    }
    if (!objectHasKeys(value)) {
      delete obj[key];
    } else {
      removeEmptyKey(value);
    }
  });
  return obj;
};
exports.removeEmptyKey = removeEmptyKey;
var removeEmptyArraysFromObject = function removeEmptyArraysFromObject(obj) {
  Object.keys(obj).forEach(function (key) {
    var value = obj[key];
    if (Array.isArray(value) && value.length === 0) {
      delete obj[key];
    }
  });
  return obj;
};
exports.removeEmptyArraysFromObject = removeEmptyArraysFromObject;
function addAbsolutePositions(hits, hitsPerPage, page) {
  return hits.map(function (hit, index) {
    return _objectSpread(_objectSpread({}, hit), {}, {
      __position: hitsPerPage * page + index + 1
    });
  });
}
function addQueryID(hits, queryID) {
  if (!queryID) {
    return hits;
  }
  return hits.map(function (hit) {
    return _objectSpread(_objectSpread({}, hit), {}, {
      __queryID: queryID
    });
  });
}
function find(array, comparator) {
  if (!Array.isArray(array)) {
    return undefined;
  }
  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i])) {
      return array[i];
    }
  }
  return undefined;
}
function objectHasKeys(object) {
  return object && Object.keys(object).length > 0;
}

// https://github.com/babel/babel/blob/3aaafae053fa75febb3aa45d45b6f00646e30ba4/packages/babel-helpers/src/helpers.js#L604-L620
function omit(source, excluded) {
  if (source === null || source === undefined) {
    return {};
  }
  var target = {};
  var sourceKeys = Object.keys(source);
  for (var i = 0; i < sourceKeys.length; i++) {
    var key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    target[key] = source[key];
  }
  return target;
}

/**
 * Retrieve the value at a path of the object:
 *
 * @example
 * getPropertyByPath(
 *   { test: { this: { function: [{ now: { everyone: true } }] } } },
 *   'test.this.function[0].now.everyone'
 * ); // true
 *
 * getPropertyByPath(
 *   { test: { this: { function: [{ now: { everyone: true } }] } } },
 *   ['test', 'this', 'function', 0, 'now', 'everyone']
 * ); // true
 *
 * @param object Source object to query
 * @param path either an array of properties, or a string form of the properties, separated by .
 */
var getPropertyByPath = function getPropertyByPath(object, path) {
  return (Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')).reduce(function (current, key) {
    return current ? current[key] : undefined;
  }, object);
};
exports.getPropertyByPath = getPropertyByPath;
function getObjectType(object) {
  return Object.prototype.toString.call(object).slice(8, -1);
}
function unescapeFacetValue(value) {
  return value.replace(/^\\-/, '-');
}