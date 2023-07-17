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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function getId() {
  return 'hitsPerPage';
}
function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, null);
  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }
  return currentRefinement;
}

/**
 * connectHitsPerPage connector provides the logic to create connected
 * components that will allow a user to choose to display more or less results from Algolia.
 * @name connectHitsPerPage
 * @kind connector
 * @propType {number} defaultRefinement - The number of items selected by default
 * @propType {{value: number, label: string}[]} items - List of hits per page options.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{isRefined: boolean, label?: string, value: number}>} items - the list of items the HitsPerPage can display. If no label provided, the value will be displayed.
 */
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaHitsPerPage',
  $$type: 'ais.hitsPerPage',
  propTypes: {
    defaultRefinement: _propTypes.default.number.isRequired,
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.number.isRequired
    })).isRequired,
    transformItems: _propTypes.default.func
  },
  getProvidedProps: function getProvidedProps(props, searchState) {
    var currentRefinement = getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    var items = props.items.map(function (item) {
      return item.value === currentRefinement ? _objectSpread(_objectSpread({}, item), {}, {
        isRefined: true
      }) : _objectSpread(_objectSpread({}, item), {}, {
        isRefined: false
      });
    });
    return {
      items: props.transformItems ? props.transformItems(items) : items,
      currentRefinement: currentRefinement
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    var id = getId();
    var nextValue = _defineProperty({}, id, nextRefinement);
    var resetPage = true;
    return (0, _indexUtils.refineValue)(searchState, nextValue, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }, resetPage);
  },
  cleanUp: function cleanUp(props, searchState) {
    return (0, _indexUtils.cleanUpValue)(searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }, getId());
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setHitsPerPage(getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }));
  },
  getMetadata: function getMetadata() {
    return {
      id: getId()
    };
  }
});
exports.default = _default;