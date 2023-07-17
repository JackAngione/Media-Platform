function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import PropTypes from 'prop-types';
import createConnector from "../core/createConnector.js";

/**
 * connectCurrentRefinements connector provides the logic to build a widget that will
 * give the user the ability to remove all or some of the filters that were
 * set.
 * @name connectCurrentRefinements
 * @kind connector
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @propType {function} [clearsQuery=false] - Pass true to also clear the search query
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {array.<{label: string, attribute: string, currentRefinement: string || object, items: array, value: function}>} items - all the filters, the `value` is to pass to the `refine` function for removing all currentrefinements, `label` is for the display. When existing several refinements for the same atribute name, then you get a nested `items` object that contains a `label` and a `value` function to use to remove a single filter. `attribute` and `currentRefinement` are metadata containing row values.
 * @providedPropType {string} query - the search query
 */
export default createConnector({
  displayName: 'AlgoliaCurrentRefinements',
  $$type: 'ais.currentRefinements',
  propTypes: {
    transformItems: PropTypes.func
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults, metadata) {
    var items = metadata.reduce(function (res, meta) {
      if (typeof meta.items !== 'undefined') {
        if (!props.clearsQuery && meta.id === 'query') {
          return res;
        } else {
          if (props.clearsQuery && meta.id === 'query' && meta.items[0].currentRefinement === '') {
            return res;
          }
          return res.concat(meta.items.map(function (item) {
            return _objectSpread(_objectSpread({}, item), {}, {
              id: meta.id,
              index: meta.index
            });
          }));
        }
      }
      return res;
    }, []);
    var transformedItems = props.transformItems ? props.transformItems(items) : items;
    return {
      items: transformedItems,
      canRefine: transformedItems.length > 0
    };
  },
  refine: function refine(props, searchState, items) {
    // `value` corresponds to our internal clear function computed in each connector metadata.
    var refinementsToClear = items instanceof Array ? items.map(function (item) {
      return item.value;
    }) : [items];
    return refinementsToClear.reduce(function (res, clear) {
      return clear(res);
    }, searchState);
  }
});