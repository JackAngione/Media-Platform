"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _connectQueryRules = _interopRequireDefault(require("../connectors/connectQueryRules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = (0, _connectQueryRules.default)(function QueryRuleContext() {
  return null;
}, {
  $$widgetType: 'ais.queryRuleContext'
});
exports.default = _default;