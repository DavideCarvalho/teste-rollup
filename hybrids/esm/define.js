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

import property from './property';
import render from './render';
import * as cache from './cache';
import { dispatch, pascalToDash } from './utils';

function dispatchInvalidate(host) {
  dispatch(host, '@invalidate', {
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
      config = key === 'render' ? render(config) : {
        get: config
      };
    } else if (config === null || type !== 'object' || type === 'object' && !config.get && !config.set) {
      config = property(config);
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
    var tagName = pascalToDash(key);
    acc[key] = defineElement(tagName, elements[key]);
    return acc;
  }, {});
}

export default function define() {
  if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
    return defineMap(arguments.length <= 0 ? undefined : arguments[0]);
  }

  return defineElement.apply(void 0, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZpbmUuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJyZW5kZXIiLCJjYWNoZSIsImRpc3BhdGNoIiwicGFzY2FsVG9EYXNoIiwiZGlzcGF0Y2hJbnZhbGlkYXRlIiwiaG9zdCIsImJ1YmJsZXMiLCJjb21wb3NlZCIsImRlZmF1bHRHZXQiLCJ2YWx1ZSIsImNvbXBpbGUiLCJIeWJyaWQiLCJoeWJyaWRzIiwiY29ubmVjdHMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImNvbmZpZyIsInR5cGUiLCJnZXQiLCJzZXQiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3RvdHlwZSIsIm5ld1ZhbHVlIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImNvbm5lY3QiLCJwdXNoIiwiY2xlYXJDYWNoZSIsImludmFsaWRhdGUiLCJ1cGRhdGUiLCJ3YWxrSW5TaGFkb3ciLCJub2RlIiwiZm4iLCJBcnJheSIsImZyb20iLCJjaGlsZHJlbiIsImVsIiwic2hhZG93Um9vdCIsInVwZGF0ZVF1ZXVlIiwiTWFwIiwibGFzdEh5YnJpZHMiLCJzaXplIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZG9jdW1lbnQiLCJib2R5IiwiaGFzIiwiY29uc3RydWN0b3IiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImNvbm5lY3RlZENhbGxiYWNrIiwiY2xlYXIiLCJXZWFrTWFwIiwiZGVmaW5lRWxlbWVudCIsInRhZ05hbWUiLCJoeWJyaWRzT3JDb25zdHJ1Y3RvciIsIlR5cGVFcnJvciIsIkN1c3RvbUVsZW1lbnQiLCJ3aW5kb3ciLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsIkVycm9yIiwibGlzdCIsInJlZHVjZSIsImFjYyIsInJlc3VsdCIsImFkZCIsIlNldCIsIkhUTUxFbGVtZW50IiwiZGVmaW5lTWFwIiwiZWxlbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFFRCxlQUFlLFNBQVNKLE1BQVQsR0FBeUI7QUFDdEMsTUFBSSw4REFBbUIsUUFBdkIsRUFBaUM7QUFDL0IsV0FBT1MsU0FBUyxrREFBaEI7QUFDRDs7QUFFRCxTQUFPaEIsYUFBYSxNQUFiLG1CQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvcGVydHkgZnJvbSAnLi9wcm9wZXJ0eSc7XG5pbXBvcnQgcmVuZGVyIGZyb20gJy4vcmVuZGVyJztcblxuaW1wb3J0ICogYXMgY2FjaGUgZnJvbSAnLi9jYWNoZSc7XG5pbXBvcnQgeyBkaXNwYXRjaCwgcGFzY2FsVG9EYXNoIH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIGRpc3BhdGNoSW52YWxpZGF0ZShob3N0KSB7XG4gIGRpc3BhdGNoKGhvc3QsICdAaW52YWxpZGF0ZScsIHsgYnViYmxlczogdHJ1ZSwgY29tcG9zZWQ6IHRydWUgfSk7XG59XG5cbmNvbnN0IGRlZmF1bHRHZXQgPSAoaG9zdCwgdmFsdWUpID0+IHZhbHVlO1xuXG5mdW5jdGlvbiBjb21waWxlKEh5YnJpZCwgaHlicmlkcykge1xuICBIeWJyaWQuaHlicmlkcyA9IGh5YnJpZHM7XG4gIEh5YnJpZC5jb25uZWN0cyA9IFtdO1xuXG4gIE9iamVjdC5rZXlzKGh5YnJpZHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGxldCBjb25maWcgPSBoeWJyaWRzW2tleV07XG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBjb25maWc7XG5cbiAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uZmlnID0ga2V5ID09PSAncmVuZGVyJyA/IHJlbmRlcihjb25maWcpIDogeyBnZXQ6IGNvbmZpZyB9O1xuICAgIH0gZWxzZSBpZiAoY29uZmlnID09PSBudWxsIHx8IHR5cGUgIT09ICdvYmplY3QnIHx8ICh0eXBlID09PSAnb2JqZWN0JyAmJiAhY29uZmlnLmdldCAmJiAhY29uZmlnLnNldCkpIHtcbiAgICAgIGNvbmZpZyA9IHByb3BlcnR5KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgY29uZmlnLmdldCA9IGNvbmZpZy5nZXQgfHwgZGVmYXVsdEdldDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIeWJyaWQucHJvdG90eXBlLCBrZXksIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gY2FjaGUuZ2V0KHRoaXMsIGtleSwgY29uZmlnLmdldCk7XG4gICAgICB9LFxuICAgICAgc2V0OiBjb25maWcuc2V0ICYmIGZ1bmN0aW9uIHNldChuZXdWYWx1ZSkge1xuICAgICAgICBjYWNoZS5zZXQodGhpcywga2V5LCBjb25maWcuc2V0LCBuZXdWYWx1ZSwgKCkgPT4gZGlzcGF0Y2hJbnZhbGlkYXRlKHRoaXMpKTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nLFxuICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5jb25uZWN0KSB7XG4gICAgICBIeWJyaWQuY29ubmVjdHMucHVzaChob3N0ID0+IGNvbmZpZy5jb25uZWN0KGhvc3QsIGtleSwgKGNsZWFyQ2FjaGUgPSB0cnVlKSA9PiB7XG4gICAgICAgIGlmIChjbGVhckNhY2hlKSBjYWNoZS5pbnZhbGlkYXRlKGhvc3QsIGtleSk7XG4gICAgICAgIGRpc3BhdGNoSW52YWxpZGF0ZShob3N0KTtcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgdXBkYXRlO1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgY29uc3Qgd2Fsa0luU2hhZG93ID0gKG5vZGUsIGZuKSA9PiB7XG4gICAgZm4obm9kZSk7XG5cbiAgICBBcnJheS5mcm9tKG5vZGUuY2hpbGRyZW4pXG4gICAgICAuZm9yRWFjaChlbCA9PiB3YWxrSW5TaGFkb3coZWwsIGZuKSk7XG5cbiAgICBpZiAobm9kZS5zaGFkb3dSb290KSB7XG4gICAgICBBcnJheS5mcm9tKG5vZGUuc2hhZG93Um9vdC5jaGlsZHJlbilcbiAgICAgICAgLmZvckVhY2goZWwgPT4gd2Fsa0luU2hhZG93KGVsLCBmbikpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB1cGRhdGVRdWV1ZSA9IG5ldyBNYXAoKTtcbiAgdXBkYXRlID0gKEh5YnJpZCwgbGFzdEh5YnJpZHMpID0+IHtcbiAgICBpZiAoIXVwZGF0ZVF1ZXVlLnNpemUpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB3YWxrSW5TaGFkb3coZG9jdW1lbnQuYm9keSwgKG5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodXBkYXRlUXVldWUuaGFzKG5vZGUuY29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICBjb25zdCBoeWJyaWRzID0gdXBkYXRlUXVldWUuZ2V0KG5vZGUuY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgbm9kZS5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhub2RlLmNvbnN0cnVjdG9yLmh5YnJpZHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICBjYWNoZS5pbnZhbGlkYXRlKG5vZGUsIGtleSwgbm9kZVtrZXldID09PSBoeWJyaWRzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG5vZGUuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIGRpc3BhdGNoSW52YWxpZGF0ZShub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB1cGRhdGVRdWV1ZS5jbGVhcigpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZVF1ZXVlLnNldChIeWJyaWQsIGxhc3RIeWJyaWRzKTtcbiAgfTtcbn1cblxuY29uc3QgY29ubmVjdHMgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBkZWZpbmVFbGVtZW50KHRhZ05hbWUsIGh5YnJpZHNPckNvbnN0cnVjdG9yKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgaHlicmlkc09yQ29uc3RydWN0b3I7XG4gIGlmICh0eXBlICE9PSAnb2JqZWN0JyAmJiB0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdbZGVmaW5lXSBJbnZhbGlkIHNlY29uZCBhcmd1bWVudC4gSXQgbXVzdCBiZSBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgY29uc3QgQ3VzdG9tRWxlbWVudCA9IHdpbmRvdy5jdXN0b21FbGVtZW50cy5nZXQodGFnTmFtZSk7XG5cbiAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoQ3VzdG9tRWxlbWVudCAhPT0gaHlicmlkc09yQ29uc3RydWN0b3IpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ05hbWUsIGh5YnJpZHNPckNvbnN0cnVjdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIEN1c3RvbUVsZW1lbnQ7XG4gIH1cblxuICBpZiAoQ3VzdG9tRWxlbWVudCkge1xuICAgIGlmIChDdXN0b21FbGVtZW50Lmh5YnJpZHMgPT09IGh5YnJpZHNPckNvbnN0cnVjdG9yKSB7XG4gICAgICByZXR1cm4gQ3VzdG9tRWxlbWVudDtcbiAgICB9XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgQ3VzdG9tRWxlbWVudC5oeWJyaWRzKSB7XG4gICAgICBPYmplY3Qua2V5cyhDdXN0b21FbGVtZW50Lmh5YnJpZHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBkZWxldGUgQ3VzdG9tRWxlbWVudC5wcm90b3R5cGVba2V5XTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYXN0SHlicmlkcyA9IEN1c3RvbUVsZW1lbnQuaHlicmlkcztcblxuICAgICAgY29tcGlsZShDdXN0b21FbGVtZW50LCBoeWJyaWRzT3JDb25zdHJ1Y3Rvcik7XG4gICAgICB1cGRhdGUoQ3VzdG9tRWxlbWVudCwgbGFzdEh5YnJpZHMpO1xuXG4gICAgICByZXR1cm4gQ3VzdG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aHJvdyBFcnJvcihgW2RlZmluZV0gRWxlbWVudCAnJHt0YWdOYW1lfScgYWxyZWFkeSBkZWZpbmVkYCk7XG4gIH1cblxuICBjbGFzcyBIeWJyaWQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgc3RhdGljIGdldCBuYW1lKCkgeyByZXR1cm4gdGFnTmFtZTsgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBjb25zdCBsaXN0ID0gdGhpcy5jb25zdHJ1Y3Rvci5jb25uZWN0cy5yZWR1Y2UoKGFjYywgZm4pID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4odGhpcyk7XG4gICAgICAgIGlmIChyZXN1bHQpIGFjYy5hZGQocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIG5ldyBTZXQoKSk7XG5cbiAgICAgIGNvbm5lY3RzLnNldCh0aGlzLCBsaXN0KTtcbiAgICAgIGRpc3BhdGNoSW52YWxpZGF0ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBjb25uZWN0cy5nZXQodGhpcyk7XG4gICAgICBsaXN0LmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShIeWJyaWQsIGh5YnJpZHNPckNvbnN0cnVjdG9yKTtcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ05hbWUsIEh5YnJpZCk7XG5cbiAgcmV0dXJuIEh5YnJpZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lTWFwKGVsZW1lbnRzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhlbGVtZW50cykucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgIGNvbnN0IHRhZ05hbWUgPSBwYXNjYWxUb0Rhc2goa2V5KTtcbiAgICBhY2Nba2V5XSA9IGRlZmluZUVsZW1lbnQodGFnTmFtZSwgZWxlbWVudHNba2V5XSk7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlZmluZSguLi5hcmdzKSB7XG4gIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZGVmaW5lTWFwKGFyZ3NbMF0pO1xuICB9XG5cbiAgcmV0dXJuIGRlZmluZUVsZW1lbnQoLi4uYXJncyk7XG59XG4iXX0=