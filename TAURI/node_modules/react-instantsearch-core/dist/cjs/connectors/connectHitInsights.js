"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _createConnector = _interopRequireDefault(require("../core/createConnector"));
var _indexUtils = require("../core/indexUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function inferPayload(_ref) {
  var method = _ref.method,
    results = _ref.results,
    currentHit = _ref.currentHit;
  var index = results.index;
  var queryID = currentHit.__queryID;
  var objectIDs = [currentHit.objectID];
  if (!queryID) {
    throw new Error("Could not infer `queryID`. Ensure `clickAnalytics: true` was added with the Configure widget.\nSee: https://alg.li/VpPpLt");
  }
  switch (method) {
    case 'clickedObjectIDsAfterSearch':
      {
        var positions = [currentHit.__position];
        return {
          index: index,
          queryID: queryID,
          objectIDs: objectIDs,
          positions: positions
        };
      }
    case 'convertedObjectIDsAfterSearch':
      return {
        index: index,
        queryID: queryID,
        objectIDs: objectIDs
      };
    default:
      throw new Error("Unsupported method \"".concat(method, "\" passed to the insights function. The supported methods are: \"clickedObjectIDsAfterSearch\", \"convertedObjectIDsAfterSearch\"."));
  }
}
var wrapInsightsClient = function wrapInsightsClient(aa, results, currentHit) {
  return function (method, payload) {
    if (typeof aa !== 'function') {
      throw new TypeError("Expected insightsClient to be a Function");
    }
    var inferredPayload = inferPayload({
      method: method,
      results: results,
      currentHit: currentHit
    });
    aa(method, _objectSpread(_objectSpread({}, inferredPayload), payload));
  };
};
var _default = function _default(insightsClient) {
  return (0, _createConnector.default)({
    displayName: 'AlgoliaInsights',
    $$type: 'ais.insights',
    getProvidedProps: function getProvidedProps(props, _, searchResults) {
      var results = (0, _indexUtils.getResults)(searchResults, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      });
      var insights = wrapInsightsClient(insightsClient, results, props.hit);
      return {
        insights: insights
      };
    }
  });
};
exports.default = _default;