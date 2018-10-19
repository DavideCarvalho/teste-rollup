"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = define;

var _property = _interopRequireDefault(require("./property"));

var _render = _interopRequireDefault(require("./render"));

var cache = _interopRequireWildcard(require("./cache"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function dispatchInvalidate(host) {
  (0, _utils.dispatch)(host, '@invalidate', {
    bubbles: true,
    composed: true
  });
}

var defaultGet = function defaultGet(host, value) {
  return value;
};

function compile(Hybrid, hybrids) {
  Hybrid.hybrids = hybrids;
  Hybrid.connects = [];
  Object.keys(hybrids).forEach(function (key) {
    var config = hybrids[key];

    var type = _typeof(config);

    if (type === 'function') {
      config = key === 'render' ? (0, _render.default)(config) : {
        get: config
      };
    } else if (config === null || type !== 'object' || type === 'object' && !config.get && !config.set) {
      config = (0, _property.default)(config);
    }

    config.get = config.get || defaultGet;
    Object.defineProperty(Hybrid.prototype, key, {
      get: function get() {
        return cache.get(this, key, config.get);
      },
      set: config.set && function set(newValue) {
        var _this = this;

        cache.set(this, key, config.set, newValue, function () {
          return dispatchInvalidate(_this);
        });
      },
      enumerable: true,
      configurable: process.env.NODE_ENV !== 'production'
    });

    if (config.connect) {
      Hybrid.connects.push(function (host) {
        return config.connect(host, key, function () {
          var clearCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          if (clearCache) cache.invalidate(host, key);
          dispatchInvalidate(host);
        });
      });
    }
  });
}

var update;

if (process.env.NODE_ENV !== 'production') {
  var walkInShadow = function walkInShadow(node, fn) {
    fn(node);
    Array.from(node.children).forEach(function (el) {
      return walkInShadow(el, fn);
    });

    if (node.shadowRoot) {
      Array.from(node.shadowRoot.children).forEach(function (el) {
        return walkInShadow(el, fn);
      });
    }
  };

  var updateQueue = new Map();

  update = function update(Hybrid, lastHybrids) {
    if (!updateQueue.size) {
      Promise.resolve().then(function () {
        walkInShadow(document.body, function (node) {
          if (updateQueue.has(node.constructor)) {
            var hybrids = updateQueue.get(node.constructor);
            node.disconnectedCallback();
            Object.keys(node.constructor.hybrids).forEach(function (key) {
              cache.invalidate(node, key, node[key] === hybrids[key]);
            });
            node.connectedCallback();
            dispatchInvalidate(node);
          }
        });
        updateQueue.clear();
      });
    }

    updateQueue.set(Hybrid, lastHybrids);
  };
}

var connects = new WeakMap();

function defineElement(tagName, hybridsOrConstructor) {
  var type = _typeof(hybridsOrConstructor);

  if (type !== 'object' && type !== 'function') {
    throw TypeError('[define] Invalid second argument. It must be an object or a function');
  }

  var CustomElement = window.customElements.get(tagName);

  if (type === 'function') {
    if (CustomElement !== hybridsOrConstructor) {
      return window.customElements.define(tagName, hybridsOrConstructor);
    }

    return CustomElement;
  }

  if (CustomElement) {
    if (CustomElement.hybrids === hybridsOrConstructor) {
      return CustomElement;
    }

    if (process.env.NODE_ENV !== 'production' && CustomElement.hybrids) {
      Object.keys(CustomElement.hybrids).forEach(function (key) {
        delete CustomElement.prototype[key];
      });
      var lastHybrids = CustomElement.hybrids;
      compile(CustomElement, hybridsOrConstructor);
      update(CustomElement, lastHybrids);
      return CustomElement;
    }

    throw Error("[define] Element '".concat(tagName, "' already defined"));
  }

  var Hybrid =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(Hybrid, _HTMLElement);

    function Hybrid() {
      _classCallCheck(this, Hybrid);

      return _possibleConstructorReturn(this, _getPrototypeOf(Hybrid).apply(this, arguments));
    }

    _createClass(Hybrid, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        var list = this.constructor.connects.reduce(function (acc, fn) {
          var result = fn(_this2);
          if (result) acc.add(result);
          return acc;
        }, new Set());
        connects.set(this, list);
        dispatchInvalidate(this);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var list = connects.get(this);
        list.forEach(function (fn) {
          return fn();
        });
      }
    }], [{
      key: "name",
      get: function get() {
        return tagName;
      }
    }]);

    return Hybrid;
  }(_wrapNativeSuper(HTMLElement));

  compile(Hybrid, hybridsOrConstructor);
  customElements.define(tagName, Hybrid);
  return Hybrid;
}

function defineMap(elements) {
  return Object.keys(elements).reduce(function (acc, key) {
    var tagName = (0, _utils.pascalToDash)(key);
    acc[key] = defineElement(tagName, elements[key]);
    return acc;
  }, {});
}

function define() {
  if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
    return defineMap(arguments.length <= 0 ? undefined : arguments[0]);
  }

  return defineElement.apply(void 0, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZpbmUuanMiXSwibmFtZXMiOlsiZGlzcGF0Y2hJbnZhbGlkYXRlIiwiaG9zdCIsImJ1YmJsZXMiLCJjb21wb3NlZCIsImRlZmF1bHRHZXQiLCJ2YWx1ZSIsImNvbXBpbGUiLCJIeWJyaWQiLCJoeWJyaWRzIiwiY29ubmVjdHMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImNvbmZpZyIsInR5cGUiLCJnZXQiLCJzZXQiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3RvdHlwZSIsImNhY2hlIiwibmV3VmFsdWUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiY29ubmVjdCIsInB1c2giLCJjbGVhckNhY2hlIiwiaW52YWxpZGF0ZSIsInVwZGF0ZSIsIndhbGtJblNoYWRvdyIsIm5vZGUiLCJmbiIsIkFycmF5IiwiZnJvbSIsImNoaWxkcmVuIiwiZWwiLCJzaGFkb3dSb290IiwidXBkYXRlUXVldWUiLCJNYXAiLCJsYXN0SHlicmlkcyIsInNpemUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJkb2N1bWVudCIsImJvZHkiLCJoYXMiLCJjb25zdHJ1Y3RvciIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJjbGVhciIsIldlYWtNYXAiLCJkZWZpbmVFbGVtZW50IiwidGFnTmFtZSIsImh5YnJpZHNPckNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiQ3VzdG9tRWxlbWVudCIsIndpbmRvdyIsImN1c3RvbUVsZW1lbnRzIiwiZGVmaW5lIiwiRXJyb3IiLCJsaXN0IiwicmVkdWNlIiwiYWNjIiwicmVzdWx0IiwiYWRkIiwiU2V0IiwiSFRNTEVsZW1lbnQiLCJkZWZpbmVNYXAiLCJlbGVtZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNB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ZnJvbSAnLi9yZW5kZXInO1xuXG5pbXBvcnQgKiBhcyBjYWNoZSBmcm9tICcuL2NhY2hlJztcbmltcG9ydCB7IGRpc3BhdGNoLCBwYXNjYWxUb0Rhc2ggfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gZGlzcGF0Y2hJbnZhbGlkYXRlKGhvc3QpIHtcbiAgZGlzcGF0Y2goaG9zdCwgJ0BpbnZhbGlkYXRlJywgeyBidWJibGVzOiB0cnVlLCBjb21wb3NlZDogdHJ1ZSB9KTtcbn1cblxuY29uc3QgZGVmYXVsdEdldCA9IChob3N0LCB2YWx1ZSkgPT4gdmFsdWU7XG5cbmZ1bmN0aW9uIGNvbXBpbGUoSHlicmlkLCBoeWJyaWRzKSB7XG4gIEh5YnJpZC5oeWJyaWRzID0gaHlicmlkcztcbiAgSHlicmlkLmNvbm5lY3RzID0gW107XG5cbiAgT2JqZWN0LmtleXMoaHlicmlkcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgbGV0IGNvbmZpZyA9IGh5YnJpZHNba2V5XTtcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIGNvbmZpZztcblxuICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25maWcgPSBrZXkgPT09ICdyZW5kZXInID8gcmVuZGVyKGNvbmZpZykgOiB7IGdldDogY29uZmlnIH07XG4gICAgfSBlbHNlIGlmIChjb25maWcgPT09IG51bGwgfHwgdHlwZSAhPT0gJ29iamVjdCcgfHwgKHR5cGUgPT09ICdvYmplY3QnICYmICFjb25maWcuZ2V0ICYmICFjb25maWcuc2V0KSkge1xuICAgICAgY29uZmlnID0gcHJvcGVydHkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBjb25maWcuZ2V0ID0gY29uZmlnLmdldCB8fCBkZWZhdWx0R2V0O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEh5YnJpZC5wcm90b3R5cGUsIGtleSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiBjYWNoZS5nZXQodGhpcywga2V5LCBjb25maWcuZ2V0KTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGNvbmZpZy5zZXQgJiYgZnVuY3Rpb24gc2V0KG5ld1ZhbHVlKSB7XG4gICAgICAgIGNhY2hlLnNldCh0aGlzLCBrZXksIGNvbmZpZy5zZXQsIG5ld1ZhbHVlLCAoKSA9PiBkaXNwYXRjaEludmFsaWRhdGUodGhpcykpO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsXG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmNvbm5lY3QpIHtcbiAgICAgIEh5YnJpZC5jb25uZWN0cy5wdXNoKGhvc3QgPT4gY29uZmlnLmNvbm5lY3QoaG9zdCwga2V5LCAoY2xlYXJDYWNoZSA9IHRydWUpID0+IHtcbiAgICAgICAgaWYgKGNsZWFyQ2FjaGUpIGNhY2hlLmludmFsaWRhdGUoaG9zdCwga2V5KTtcbiAgICAgICAgZGlzcGF0Y2hJbnZhbGlkYXRlKGhvc3QpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgfSk7XG59XG5cbmxldCB1cGRhdGU7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBjb25zdCB3YWxrSW5TaGFkb3cgPSAobm9kZSwgZm4pID0+IHtcbiAgICBmbihub2RlKTtcblxuICAgIEFycmF5LmZyb20obm9kZS5jaGlsZHJlbilcbiAgICAgIC5mb3JFYWNoKGVsID0+IHdhbGtJblNoYWRvdyhlbCwgZm4pKTtcblxuICAgIGlmIChub2RlLnNoYWRvd1Jvb3QpIHtcbiAgICAgIEFycmF5LmZyb20obm9kZS5zaGFkb3dSb290LmNoaWxkcmVuKVxuICAgICAgICAuZm9yRWFjaChlbCA9PiB3YWxrSW5TaGFkb3coZWwsIGZuKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVF1ZXVlID0gbmV3IE1hcCgpO1xuICB1cGRhdGUgPSAoSHlicmlkLCBsYXN0SHlicmlkcykgPT4ge1xuICAgIGlmICghdXBkYXRlUXVldWUuc2l6ZSkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHdhbGtJblNoYWRvdyhkb2N1bWVudC5ib2R5LCAobm9kZSkgPT4ge1xuICAgICAgICAgIGlmICh1cGRhdGVRdWV1ZS5oYXMobm9kZS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIGNvbnN0IGh5YnJpZHMgPSB1cGRhdGVRdWV1ZS5nZXQobm9kZS5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBub2RlLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG5vZGUuY29uc3RydWN0b3IuaHlicmlkcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgIGNhY2hlLmludmFsaWRhdGUobm9kZSwga2V5LCBub2RlW2tleV0gPT09IGh5YnJpZHNba2V5XSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbm9kZS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgZGlzcGF0Y2hJbnZhbGlkYXRlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZVF1ZXVlLmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlUXVldWUuc2V0KEh5YnJpZCwgbGFzdEh5YnJpZHMpO1xuICB9O1xufVxuXG5jb25zdCBjb25uZWN0cyA9IG5ldyBXZWFrTWFwKCk7XG5cbmZ1bmN0aW9uIGRlZmluZUVsZW1lbnQodGFnTmFtZSwgaHlicmlkc09yQ29uc3RydWN0b3IpIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBoeWJyaWRzT3JDb25zdHJ1Y3RvcjtcbiAgaWYgKHR5cGUgIT09ICdvYmplY3QnICYmIHR5cGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1tkZWZpbmVdIEludmFsaWQgc2Vjb25kIGFyZ3VtZW50LiBJdCBtdXN0IGJlIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBjb25zdCBDdXN0b21FbGVtZW50ID0gd2luZG93LmN1c3RvbUVsZW1lbnRzLmdldCh0YWdOYW1lKTtcblxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChDdXN0b21FbGVtZW50ICE9PSBoeWJyaWRzT3JDb25zdHJ1Y3Rvcikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUodGFnTmFtZSwgaHlicmlkc09yQ29uc3RydWN0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gQ3VzdG9tRWxlbWVudDtcbiAgfVxuXG4gIGlmIChDdXN0b21FbGVtZW50KSB7XG4gICAgaWYgKEN1c3RvbUVsZW1lbnQuaHlicmlkcyA9PT0gaHlicmlkc09yQ29uc3RydWN0b3IpIHtcbiAgICAgIHJldHVybiBDdXN0b21FbGVtZW50O1xuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBDdXN0b21FbGVtZW50Lmh5YnJpZHMpIHtcbiAgICAgIE9iamVjdC5rZXlzKEN1c3RvbUVsZW1lbnQuaHlicmlkcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGRlbGV0ZSBDdXN0b21FbGVtZW50LnByb3RvdHlwZVtrZXldO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxhc3RIeWJyaWRzID0gQ3VzdG9tRWxlbWVudC5oeWJyaWRzO1xuXG4gICAgICBjb21waWxlKEN1c3RvbUVsZW1lbnQsIGh5YnJpZHNPckNvbnN0cnVjdG9yKTtcbiAgICAgIHVwZGF0ZShDdXN0b21FbGVtZW50LCBsYXN0SHlicmlkcyk7XG5cbiAgICAgIHJldHVybiBDdXN0b21FbGVtZW50O1xuICAgIH1cblxuICAgIHRocm93IEVycm9yKGBbZGVmaW5lXSBFbGVtZW50ICcke3RhZ05hbWV9JyBhbHJlYWR5IGRlZmluZWRgKTtcbiAgfVxuXG4gIGNsYXNzIEh5YnJpZCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7IHJldHVybiB0YWdOYW1lOyB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnN0cnVjdG9yLmNvbm5lY3RzLnJlZHVjZSgoYWNjLCBmbikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBmbih0aGlzKTtcbiAgICAgICAgaWYgKHJlc3VsdCkgYWNjLmFkZChyZXN1bHQpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwgbmV3IFNldCgpKTtcblxuICAgICAgY29ubmVjdHMuc2V0KHRoaXMsIGxpc3QpO1xuICAgICAgZGlzcGF0Y2hJbnZhbGlkYXRlKHRoaXMpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgY29uc3QgbGlzdCA9IGNvbm5lY3RzLmdldCh0aGlzKTtcbiAgICAgIGxpc3QuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlKEh5YnJpZCwgaHlicmlkc09yQ29uc3RydWN0b3IpO1xuICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnTmFtZSwgSHlicmlkKTtcblxuICByZXR1cm4gSHlicmlkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVNYXAoZWxlbWVudHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGVsZW1lbnRzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgY29uc3QgdGFnTmFtZSA9IHBhc2NhbFRvRGFzaChrZXkpO1xuICAgIGFjY1trZXldID0gZGVmaW5lRWxlbWVudCh0YWdOYW1lLCBlbGVtZW50c1trZXldKTtcblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVmaW5lKC4uLmFyZ3MpIHtcbiAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBkZWZpbmVNYXAoYXJnc1swXSk7XG4gIH1cblxuICByZXR1cm4gZGVmaW5lRWxlbWVudCguLi5hcmdzKTtcbn1cbiJdfQ==