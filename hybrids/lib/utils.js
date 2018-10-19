"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelToDash = camelToDash;
exports.pascalToDash = pascalToDash;
exports.dispatch = dispatch;
exports.createMap = createMap;
exports.shadyCSS = shadyCSS;
exports.stringifyElement = stringifyElement;
exports.IS_IE = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function pascalToDash(str) {
  str = str[0].toLowerCase() + str.slice(1);
  return camelToDash(str);
}

function dispatch(host, eventType) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return host.dispatchEvent(new CustomEvent(eventType, _objectSpread({
    bubbles: false
  }, options)));
}

function createMap() {
  var map = new WeakMap();
  return {
    get: function get(key, defaultValue) {
      if (map.has(key)) {
        return map.get(key);
      }

      if (defaultValue !== undefined) {
        map.set(key, defaultValue);
      }

      return defaultValue;
    },
    set: function set(key, value) {
      map.set(key, value);
      return value;
    }
  };
}

function shadyCSS(fn, fallback) {
  var shady = window.ShadyCSS;

  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }

  return fallback;
}

function stringifyElement(element) {
  var tagName = String(element.tagName).toLowerCase();
  return "<".concat(tagName, ">");
}

var IS_IE = 'ActiveXObject' in global;
exports.IS_IE = IS_IE;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJjYW1lbFRvRGFzaCIsInN0ciIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsInBhc2NhbFRvRGFzaCIsInNsaWNlIiwiZGlzcGF0Y2giLCJob3N0IiwiZXZlbnRUeXBlIiwib3B0aW9ucyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImJ1YmJsZXMiLCJjcmVhdGVNYXAiLCJtYXAiLCJXZWFrTWFwIiwiZ2V0Iiwia2V5IiwiZGVmYXVsdFZhbHVlIiwiaGFzIiwidW5kZWZpbmVkIiwic2V0IiwidmFsdWUiLCJzaGFkeUNTUyIsImZuIiwiZmFsbGJhY2siLCJzaGFkeSIsIndpbmRvdyIsIlNoYWR5Q1NTIiwibmF0aXZlU2hhZG93Iiwic3RyaW5naWZ5RWxlbWVudCIsImVsZW1lbnQiLCJ0YWdOYW1lIiwiU3RyaW5nIiwiSVNfSUUiLCJnbG9iYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBU0EsV0FBVCxDQUFxQkMsR0FBckIsRUFBMEI7QUFDL0IsU0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVksaUJBQVosRUFBK0IsT0FBL0IsRUFBd0NDLFdBQXhDLEVBQVA7QUFDRDs7QUFFTSxTQUFTQyxZQUFULENBQXNCSCxHQUF0QixFQUEyQjtBQUNoQ0EsRUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUMsQ0FBRCxDQUFILENBQU9FLFdBQVAsS0FBdUJGLEdBQUcsQ0FBQ0ksS0FBSixDQUFVLENBQVYsQ0FBN0I7QUFDQSxTQUFPTCxXQUFXLENBQUNDLEdBQUQsQ0FBbEI7QUFDRDs7QUFFTSxTQUFTSyxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsU0FBeEIsRUFBaUQ7QUFBQSxNQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFDdEQsU0FBT0YsSUFBSSxDQUFDRyxhQUFMLENBQW1CLElBQUlDLFdBQUosQ0FBZ0JILFNBQWhCO0FBQTZCSSxJQUFBQSxPQUFPLEVBQUU7QUFBdEMsS0FBZ0RILE9BQWhELEVBQW5CLENBQVA7QUFDRDs7QUFFTSxTQUFTSSxTQUFULEdBQXFCO0FBQzFCLE1BQU1DLEdBQUcsR0FBRyxJQUFJQyxPQUFKLEVBQVo7QUFFQSxTQUFPO0FBQ0xDLElBQUFBLEdBREssZUFDREMsR0FEQyxFQUNJQyxZQURKLEVBQ2tCO0FBQ3JCLFVBQUlKLEdBQUcsQ0FBQ0ssR0FBSixDQUFRRixHQUFSLENBQUosRUFBa0I7QUFDaEIsZUFBT0gsR0FBRyxDQUFDRSxHQUFKLENBQVFDLEdBQVIsQ0FBUDtBQUNEOztBQUVELFVBQUlDLFlBQVksS0FBS0UsU0FBckIsRUFBZ0M7QUFDOUJOLFFBQUFBLEdBQUcsQ0FBQ08sR0FBSixDQUFRSixHQUFSLEVBQWFDLFlBQWI7QUFDRDs7QUFFRCxhQUFPQSxZQUFQO0FBQ0QsS0FYSTtBQVlMRyxJQUFBQSxHQVpLLGVBWURKLEdBWkMsRUFZSUssS0FaSixFQVlXO0FBQ2RSLE1BQUFBLEdBQUcsQ0FBQ08sR0FBSixDQUFRSixHQUFSLEVBQWFLLEtBQWI7QUFDQSxhQUFPQSxLQUFQO0FBQ0Q7QUFmSSxHQUFQO0FBaUJEOztBQUVNLFNBQVNDLFFBQVQsQ0FBa0JDLEVBQWxCLEVBQXNCQyxRQUF0QixFQUFnQztBQUNyQyxNQUFNQyxLQUFLLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBckI7O0FBQ0EsTUFBSUYsS0FBSyxJQUFJLENBQUNBLEtBQUssQ0FBQ0csWUFBcEIsRUFBa0M7QUFDaEMsV0FBT0wsRUFBRSxDQUFDRSxLQUFELENBQVQ7QUFDRDs7QUFFRCxTQUFPRCxRQUFQO0FBQ0Q7O0FBRU0sU0FBU0ssZ0JBQVQsQ0FBMEJDLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQU1DLE9BQU8sR0FBR0MsTUFBTSxDQUFDRixPQUFPLENBQUNDLE9BQVQsQ0FBTixDQUF3QjdCLFdBQXhCLEVBQWhCO0FBQ0Esb0JBQVc2QixPQUFYO0FBQ0Q7O0FBRU0sSUFBTUUsS0FBSyxHQUFHLG1CQUFtQkMsTUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY2FtZWxUb0Rhc2goc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhc2NhbFRvRGFzaChzdHIpIHtcbiAgc3RyID0gc3RyWzBdLnRvTG93ZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gIHJldHVybiBjYW1lbFRvRGFzaChzdHIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2goaG9zdCwgZXZlbnRUeXBlLCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIGhvc3QuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnRUeXBlLCB7IGJ1YmJsZXM6IGZhbHNlLCAuLi5vcHRpb25zIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hcCgpIHtcbiAgY29uc3QgbWFwID0gbmV3IFdlYWtNYXAoKTtcblxuICByZXR1cm4ge1xuICAgIGdldChrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKG1hcC5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfSxcbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hhZHlDU1MoZm4sIGZhbGxiYWNrKSB7XG4gIGNvbnN0IHNoYWR5ID0gd2luZG93LlNoYWR5Q1NTO1xuICBpZiAoc2hhZHkgJiYgIXNoYWR5Lm5hdGl2ZVNoYWRvdykge1xuICAgIHJldHVybiBmbihzaGFkeSk7XG4gIH1cblxuICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlFbGVtZW50KGVsZW1lbnQpIHtcbiAgY29uc3QgdGFnTmFtZSA9IFN0cmluZyhlbGVtZW50LnRhZ05hbWUpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBgPCR7dGFnTmFtZX0+YDtcbn1cblxuZXhwb3J0IGNvbnN0IElTX0lFID0gJ0FjdGl2ZVhPYmplY3QnIGluIGdsb2JhbDtcbiJdfQ==