function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
export function pascalToDash(str) {
  str = str[0].toLowerCase() + str.slice(1);
  return camelToDash(str);
}
export function dispatch(host, eventType) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return host.dispatchEvent(new CustomEvent(eventType, _objectSpread({
    bubbles: false
  }, options)));
}
export function createMap() {
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
export function shadyCSS(fn, fallback) {
  var shady = window.ShadyCSS;

  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }

  return fallback;
}
export function stringifyElement(element) {
  var tagName = String(element.tagName).toLowerCase();
  return "<".concat(tagName, ">");
}
export var IS_IE = 'ActiveXObject' in global;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJjYW1lbFRvRGFzaCIsInN0ciIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsInBhc2NhbFRvRGFzaCIsInNsaWNlIiwiZGlzcGF0Y2giLCJob3N0IiwiZXZlbnRUeXBlIiwib3B0aW9ucyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImJ1YmJsZXMiLCJjcmVhdGVNYXAiLCJtYXAiLCJXZWFrTWFwIiwiZ2V0Iiwia2V5IiwiZGVmYXVsdFZhbHVlIiwiaGFzIiwidW5kZWZpbmVkIiwic2V0IiwidmFsdWUiLCJzaGFkeUNTUyIsImZuIiwiZmFsbGJhY2siLCJzaGFkeSIsIndpbmRvdyIsIlNoYWR5Q1NTIiwibmF0aXZlU2hhZG93Iiwic3RyaW5naWZ5RWxlbWVudCIsImVsZW1lbnQiLCJ0YWdOYW1lIiwiU3RyaW5nIiwiSVNfSUUiLCJnbG9iYWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLFNBQVNBLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQTBCO0FBQy9CLFNBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGlCQUFaLEVBQStCLE9BQS9CLEVBQXdDQyxXQUF4QyxFQUFQO0FBQ0Q7QUFFRCxPQUFPLFNBQVNDLFlBQVQsQ0FBc0JILEdBQXRCLEVBQTJCO0FBQ2hDQSxFQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQyxDQUFELENBQUgsQ0FBT0UsV0FBUCxLQUF1QkYsR0FBRyxDQUFDSSxLQUFKLENBQVUsQ0FBVixDQUE3QjtBQUNBLFNBQU9MLFdBQVcsQ0FBQ0MsR0FBRCxDQUFsQjtBQUNEO0FBRUQsT0FBTyxTQUFTSyxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsU0FBeEIsRUFBaUQ7QUFBQSxNQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFDdEQsU0FBT0YsSUFBSSxDQUFDRyxhQUFMLENBQW1CLElBQUlDLFdBQUosQ0FBZ0JILFNBQWhCO0FBQTZCSSxJQUFBQSxPQUFPLEVBQUU7QUFBdEMsS0FBZ0RILE9BQWhELEVBQW5CLENBQVA7QUFDRDtBQUVELE9BQU8sU0FBU0ksU0FBVCxHQUFxQjtBQUMxQixNQUFNQyxHQUFHLEdBQUcsSUFBSUMsT0FBSixFQUFaO0FBRUEsU0FBTztBQUNMQyxJQUFBQSxHQURLLGVBQ0RDLEdBREMsRUFDSUMsWUFESixFQUNrQjtBQUNyQixVQUFJSixHQUFHLENBQUNLLEdBQUosQ0FBUUYsR0FBUixDQUFKLEVBQWtCO0FBQ2hCLGVBQU9ILEdBQUcsQ0FBQ0UsR0FBSixDQUFRQyxHQUFSLENBQVA7QUFDRDs7QUFFRCxVQUFJQyxZQUFZLEtBQUtFLFNBQXJCLEVBQWdDO0FBQzlCTixRQUFBQSxHQUFHLENBQUNPLEdBQUosQ0FBUUosR0FBUixFQUFhQyxZQUFiO0FBQ0Q7O0FBRUQsYUFBT0EsWUFBUDtBQUNELEtBWEk7QUFZTEcsSUFBQUEsR0FaSyxlQVlESixHQVpDLEVBWUlLLEtBWkosRUFZVztBQUNkUixNQUFBQSxHQUFHLENBQUNPLEdBQUosQ0FBUUosR0FBUixFQUFhSyxLQUFiO0FBQ0EsYUFBT0EsS0FBUDtBQUNEO0FBZkksR0FBUDtBQWlCRDtBQUVELE9BQU8sU0FBU0MsUUFBVCxDQUFrQkMsRUFBbEIsRUFBc0JDLFFBQXRCLEVBQWdDO0FBQ3JDLE1BQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxRQUFyQjs7QUFDQSxNQUFJRixLQUFLLElBQUksQ0FBQ0EsS0FBSyxDQUFDRyxZQUFwQixFQUFrQztBQUNoQyxXQUFPTCxFQUFFLENBQUNFLEtBQUQsQ0FBVDtBQUNEOztBQUVELFNBQU9ELFFBQVA7QUFDRDtBQUVELE9BQU8sU0FBU0ssZ0JBQVQsQ0FBMEJDLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQU1DLE9BQU8sR0FBR0MsTUFBTSxDQUFDRixPQUFPLENBQUNDLE9BQVQsQ0FBTixDQUF3QjdCLFdBQXhCLEVBQWhCO0FBQ0Esb0JBQVc2QixPQUFYO0FBQ0Q7QUFFRCxPQUFPLElBQU1FLEtBQUssR0FBRyxtQkFBbUJDLE1BQWpDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNhbWVsVG9EYXNoKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXNjYWxUb0Rhc2goc3RyKSB7XG4gIHN0ciA9IHN0clswXS50b0xvd2VyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICByZXR1cm4gY2FtZWxUb0Rhc2goc3RyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKGhvc3QsIGV2ZW50VHlwZSwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBob3N0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50VHlwZSwgeyBidWJibGVzOiBmYWxzZSwgLi4ub3B0aW9ucyB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXAoKSB7XG4gIGNvbnN0IG1hcCA9IG5ldyBXZWFrTWFwKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcC5nZXQoa2V5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hcC5zZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH0sXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgIG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoYWR5Q1NTKGZuLCBmYWxsYmFjaykge1xuICBjb25zdCBzaGFkeSA9IHdpbmRvdy5TaGFkeUNTUztcbiAgaWYgKHNoYWR5ICYmICFzaGFkeS5uYXRpdmVTaGFkb3cpIHtcbiAgICByZXR1cm4gZm4oc2hhZHkpO1xuICB9XG5cbiAgcmV0dXJuIGZhbGxiYWNrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5RWxlbWVudChlbGVtZW50KSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBTdHJpbmcoZWxlbWVudC50YWdOYW1lKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gYDwke3RhZ05hbWV9PmA7XG59XG5cbmV4cG9ydCBjb25zdCBJU19JRSA9ICdBY3RpdmVYT2JqZWN0JyBpbiBnbG9iYWw7XG4iXX0=