"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _createConnector = _interopRequireDefault(require("../core/createConnector"));
var _indexUtils = require("../core/indexUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function getId() {
  return 'query';
}
function getCurrentRefinement(props, searchState, context) {
  var id = getId(props);
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, '');
  if (currentRefinement) {
    return currentRefinement;
  }
  return '';
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
 * connectSearchBox connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectSearchBox
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {boolean} isSearchStalled - a flag that indicates if InstantSearch has detected that searches are stalled
 */
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaSearchBox',
  $$type: 'ais.searchBox',
  propTypes: {
    defaultRefinement: _propTypes.default.string
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    return {
      currentRefinement: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }),
      isSearchStalled: searchResults.isSearchStalled
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
  },
  getMetadata: function getMetadata(props, searchState) {
    var id = getId(props);
    var currentRefinement = getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    return {
      id: id,
      index: (0, _indexUtils.getIndexId)({
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }),
      items: currentRefinement === null ? [] : [{
        label: "".concat(id, ": ").concat(currentRefinement),
        value: function value(nextState) {
          return _refine(props, nextState, '', {
            ais: props.contextValue,
            multiIndexContext: props.indexContextValue
          });
        },
        currentRefinement: currentRefinement
      }]
    };
  }
});
exports.default = _default;