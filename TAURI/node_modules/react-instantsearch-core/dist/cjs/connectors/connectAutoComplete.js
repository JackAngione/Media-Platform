"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _createConnector = _interopRequireDefault(require("../core/createConnector"));
var _indexUtils = require("../core/indexUtils");
var _utils = require("../core/utils");
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
var getId = function getId() {
  return 'query';
};
function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, '');
  if (currentRefinement) {
    return currentRefinement;
  }
  return '';
}
function getHits(searchResults) {
  if (searchResults.results) {
    if (searchResults.results.hits && Array.isArray(searchResults.results.hits)) {
      return (0, _utils.addAbsolutePositions)((0, _utils.addQueryID)(searchResults.results.hits, searchResults.results.queryID), searchResults.results.hitsPerPage, searchResults.results.page);
    } else {
      return Object.keys(searchResults.results).reduce(function (hits, index) {
        return [].concat(_toConsumableArray(hits), [{
          index: index,
          hits: (0, _utils.addAbsolutePositions)((0, _utils.addQueryID)(searchResults.results[index].hits, searchResults.results[index].queryID), searchResults.results[index].hitsPerPage, searchResults.results[index].page)
        }]);
      }, []);
    }
  } else {
    return [];
  }
}
function _refine(props, searchState, nextRefinement, context) {
  var id = getId();
  var nextValue = _defineProperty({}, id, nextRefinement);
  var resetPage = true;
  return (0, _indexUtils.refineValue)(searchState, nextValue, context, resetPage);
}
function _cleanUp(props, searchState, context) {
  return (0, _indexUtils.cleanUpValue)(searchState, context, getId());
}

/**
 * connectAutoComplete connector provides the logic to create connected
 * components that will render the results retrieved from
 * Algolia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * prop to a [Configure](guide/Search_parameters.html) widget.
 * @name connectAutoComplete
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {function} refine - a function to change the query
 * @providedPropType {string} currentRefinement - the query to search for
 */
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaAutoComplete',
  $$type: 'ais.autoComplete',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    return {
      hits: getHits(searchResults),
      currentRefinement: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      })
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    return _refine(props, searchState, nextRefinement, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  cleanUp: function cleanUp(props, searchState) {
    return _cleanUp(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }));
  }
});
exports.default = _default;