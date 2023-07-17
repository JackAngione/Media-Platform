function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import createConnector from "../core/createConnector.js";
import { cleanUpValue, refineValue, getCurrentRefinementValue, getResults } from "../core/indexUtils.js";
function getId() {
  return 'page';
}
function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var page = 1;
  var currentRefinement = getCurrentRefinementValue(props, searchState, context, id, page);
  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }
  return currentRefinement;
}
function _refine(props, searchState, nextPage, context) {
  var id = getId();
  var nextValue = _defineProperty({}, id, nextPage);
  var resetPage = false;
  return refineValue(searchState, nextValue, context, resetPage);
}

/**
 * connectPagination connector provides the logic to build a widget that will
 * let the user displays hits corresponding to a certain page.
 * @name connectPagination
 * @kind connector
 * @propType {boolean} [showFirst=true] - Display the first page link.
 * @propType {boolean} [showLast=false] - Display the last page link.
 * @propType {boolean} [showPrevious=true] - Display the previous page link.
 * @propType {boolean} [showNext=true] - Display the next page link.
 * @propType {number} [padding=3] - How many page links to display around the current page.
 * @propType {number} [totalPages=Infinity] - Maximum number of pages to display.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {number} nbPages - the total of existing pages
 * @providedPropType {number} currentRefinement - the page refinement currently applied
 */
export default createConnector({
  displayName: 'AlgoliaPagination',
  $$type: 'ais.pagination',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = getResults(searchResults, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    if (!results) {
      return null;
    }
    var nbPages = results.nbPages;
    return {
      nbPages: nbPages,
      currentRefinement: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }),
      canRefine: nbPages > 1
    };
  },
  refine: function refine(props, searchState, nextPage) {
    return _refine(props, searchState, nextPage, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  cleanUp: function cleanUp(props, searchState) {
    return cleanUpValue(searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }, getId());
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setPage(getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }) - 1);
  },
  getMetadata: function getMetadata() {
    return {
      id: getId()
    };
  }
});