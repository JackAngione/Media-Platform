"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _createConnector = _interopRequireDefault(require("../core/createConnector"));
var _indexUtils = require("../core/indexUtils");
var _utils = require("../core/utils");
var _excluded = ["page"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function getId() {
  return 'page';
}
function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var page = 1;
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, page);
  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }
  return currentRefinement;
}
function getStateWithoutPage(state) {
  var _ref = state || {},
    page = _ref.page,
    rest = _objectWithoutProperties(_ref, _excluded);
  return rest;
}
function getInMemoryCache() {
  var cachedHits = undefined;
  var cachedState = undefined;
  return {
    read: function read(_ref2) {
      var state = _ref2.state;
      return (0, _reactFastCompare.default)(cachedState, getStateWithoutPage(state)) ? cachedHits : null;
    },
    write: function write(_ref3) {
      var state = _ref3.state,
        hits = _ref3.hits;
      cachedState = getStateWithoutPage(state);
      cachedHits = hits;
    }
  };
}
function extractHitsFromCachedHits(cachedHits) {
  return Object.keys(cachedHits).map(Number).sort(function (a, b) {
    return a - b;
  }).reduce(function (acc, page) {
    return acc.concat(cachedHits[page]);
  }, []);
}

/**
 * InfiniteHits connector provides the logic to create connected
 * components that will render an continuous list of results retrieved from
 * Algolia. This connector provides a function to load more results.
 * @name connectInfiniteHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {boolean} hasMore - indicates if there are more pages to load
 * @providedPropType {function} refine - call to load more results
 */
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaInfiniteHits',
  $$type: 'ais.infiniteHits',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var _this = this;
    var results = (0, _indexUtils.getResults)(searchResults, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    if (!results) {
      return {
        hits: [],
        hasPrevious: false,
        hasMore: false,
        refine: function refine() {},
        refinePrevious: function refinePrevious() {},
        refineNext: function refineNext() {}
      };
    }
    var page = results.page,
      hits = results.hits,
      hitsPerPage = results.hitsPerPage,
      nbPages = results.nbPages,
      state = results._state;
    this._cache = props.cache ? props.cache : this._cache || getInMemoryCache();
    var cachedHits = this._cache.read({
      state: state
    }) || {};
    var hitsWithPositions = (0, _utils.addAbsolutePositions)(hits, hitsPerPage, page);
    var hitsWithPositionsAndQueryID = (0, _utils.addQueryID)(hitsWithPositions, results.queryID);
    cachedHits[page] = hitsWithPositionsAndQueryID;
    this._cache.write({
      state: state,
      hits: cachedHits
    });

    /*
      Math.min() and Math.max() returns Infinity or -Infinity when no argument is given.
      But there is always something in this point because of `cachedHits[page]`.
    */
    var firstReceivedPage = Math.min.apply(Math, _toConsumableArray(Object.keys(cachedHits).map(Number)));
    var lastReceivedPage = Math.max.apply(Math, _toConsumableArray(Object.keys(cachedHits).map(Number)));
    var hasPrevious = firstReceivedPage > 0;
    var lastPageIndex = nbPages - 1;
    var hasMore = lastReceivedPage < lastPageIndex;
    var refinePrevious = function refinePrevious(event) {
      return _this.refine(event, firstReceivedPage - 1);
    };
    var refineNext = function refineNext(event) {
      return _this.refine(event, lastReceivedPage + 1);
    };
    return {
      hits: extractHitsFromCachedHits(cachedHits),
      hasPrevious: hasPrevious,
      hasMore: hasMore,
      refinePrevious: refinePrevious,
      refineNext: refineNext
    };
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQueryParameters({
      page: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }) - 1
    });
  },
  refine: function refine(props, searchState, event, index) {
    var id = getId();
    var nextValue = _defineProperty({}, id, index + 1);
    var resetPage = false;
    return (0, _indexUtils.refineValue)(searchState, nextValue, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }, resetPage);
  }
});
exports.default = _default;