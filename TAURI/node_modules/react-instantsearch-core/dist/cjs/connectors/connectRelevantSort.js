"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _createConnector = _interopRequireDefault(require("../core/createConnector"));
var _indexUtils = require("../core/indexUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function getId() {
  return 'relevancyStrictness';
}
function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id);
  return currentRefinement;
}
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaRelevantSort',
  $$type: 'ais.relevantSort',
  getProvidedProps: function getProvidedProps(props, _searchState, searchResults) {
    var results = (0, _indexUtils.getResults)(searchResults, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    if (!results) {
      return {
        isVirtualReplica: false,
        isRelevantSorted: false
      };
    }
    return {
      isVirtualReplica: results.appliedRelevancyStrictness !== undefined,
      isRelevantSorted: results.appliedRelevancyStrictness !== undefined && results.appliedRelevancyStrictness > 0
    };
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQueryParameter('relevancyStrictness', getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }));
  },
  refine: function refine(props, searchState, nextRefinement) {
    var nextValue = _defineProperty({}, getId(), nextRefinement);
    var resetPage = true;
    return (0, _indexUtils.refineValue)(searchState, nextValue, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }, resetPage);
  }
});
exports.default = _default;