function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { camelToDash } from './utils';

var defaultTransform = function defaultTransform(v) {
  return v;
};

var objectTransform = function objectTransform(value) {
  if (_typeof(value) !== 'object') {
    throw TypeError("[property] Argument is not an object: ".concat(typeof v === "undefined" ? "undefined" : _typeof(v)));
  }

  return value && Object.freeze(value);
};

export default function property(value, connect) {
  var type = _typeof(value);

  var transform = defaultTransform;

  switch (type) {
    case 'string':
      transform = String;
      break;

    case 'number':
      transform = Number;
      break;

    case 'boolean':
      transform = Boolean;
      break;

    case 'function':
      transform = value;
      value = transform();
      break;

    case 'object':
      if (value) Object.freeze(value);
      transform = objectTransform;
      break;

    default:
      break;
  }

  return {
    get: function get(host) {
      var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value;
      return val;
    },
    set: function set(host) {
      var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value;
      var oldValue = arguments.length > 2 ? arguments[2] : undefined;
      return transform(val, oldValue);
    },
    connect: type !== 'object' && type !== 'undefined' ? function (host, key, invalidate) {
      if (host[key] === value) {
        var attrName = camelToDash(key);

        if (host.hasAttribute(attrName)) {
          var attrValue = host.getAttribute(attrName);
          host[key] = attrValue !== '' ? attrValue : true;
        }
      }

      return connect && connect(host, key, invalidate);
    } : connect
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6WyJjYW1lbFRvRGFzaCIsImRlZmF1bHRUcmFuc2Zvcm0iLCJ2Iiwib2JqZWN0VHJhbnNmb3JtIiwidmFsdWUiLCJUeXBlRXJyb3IiLCJPYmplY3QiLCJmcmVlemUiLCJwcm9wZXJ0eSIsImNvbm5lY3QiLCJ0eXBlIiwidHJhbnNmb3JtIiwiU3RyaW5nIiwiTnVtYmVyIiwiQm9vbGVhbiIsImdldCIsImhvc3QiLCJ2YWwiLCJzZXQiLCJvbGRWYWx1ZSIsImtleSIsImludmFsaWRhdGUiLCJhdHRyTmFtZSIsImhhc0F0dHJpYnV0ZSIsImF0dHJWYWx1ZSIsImdldEF0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxXQUFULFFBQTRCLFNBQTVCOztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUo7QUFBQSxDQUExQjs7QUFFQSxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBVztBQUNqQyxNQUFJLFFBQU9BLEtBQVAsTUFBaUIsUUFBckIsRUFBK0I7QUFDN0IsVUFBTUMsU0FBUyx3REFBaURILENBQWpELHlDQUFpREEsQ0FBakQsR0FBZjtBQUNEOztBQUNELFNBQU9FLEtBQUssSUFBSUUsTUFBTSxDQUFDQyxNQUFQLENBQWNILEtBQWQsQ0FBaEI7QUFDRCxDQUxEOztBQU9BLGVBQWUsU0FBU0ksUUFBVCxDQUFrQkosS0FBbEIsRUFBeUJLLE9BQXpCLEVBQWtDO0FBQy9DLE1BQU1DLElBQUksV0FBVU4sS0FBVixDQUFWOztBQUNBLE1BQUlPLFNBQVMsR0FBR1YsZ0JBQWhCOztBQUVBLFVBQVFTLElBQVI7QUFDRSxTQUFLLFFBQUw7QUFDRUMsTUFBQUEsU0FBUyxHQUFHQyxNQUFaO0FBQ0E7O0FBQ0YsU0FBSyxRQUFMO0FBQ0VELE1BQUFBLFNBQVMsR0FBR0UsTUFBWjtBQUNBOztBQUNGLFNBQUssU0FBTDtBQUNFRixNQUFBQSxTQUFTLEdBQUdHLE9BQVo7QUFDQTs7QUFDRixTQUFLLFVBQUw7QUFDRUgsTUFBQUEsU0FBUyxHQUFHUCxLQUFaO0FBQ0FBLE1BQUFBLEtBQUssR0FBR08sU0FBUyxFQUFqQjtBQUNBOztBQUNGLFNBQUssUUFBTDtBQUNFLFVBQUlQLEtBQUosRUFBV0UsTUFBTSxDQUFDQyxNQUFQLENBQWNILEtBQWQ7QUFDWE8sTUFBQUEsU0FBUyxHQUFHUixlQUFaO0FBQ0E7O0FBQ0Y7QUFBUztBQWxCWDs7QUFxQkEsU0FBTztBQUNMWSxJQUFBQSxHQUFHLEVBQUUsYUFBQ0MsSUFBRDtBQUFBLFVBQU9DLEdBQVAsdUVBQWFiLEtBQWI7QUFBQSxhQUF1QmEsR0FBdkI7QUFBQSxLQURBO0FBRUxDLElBQUFBLEdBQUcsRUFBRSxhQUFDRixJQUFEO0FBQUEsVUFBT0MsR0FBUCx1RUFBYWIsS0FBYjtBQUFBLFVBQW9CZSxRQUFwQjtBQUFBLGFBQWlDUixTQUFTLENBQUNNLEdBQUQsRUFBTUUsUUFBTixDQUExQztBQUFBLEtBRkE7QUFHTFYsSUFBQUEsT0FBTyxFQUFFQyxJQUFJLEtBQUssUUFBVCxJQUFxQkEsSUFBSSxLQUFLLFdBQTlCLEdBQ0wsVUFBQ00sSUFBRCxFQUFPSSxHQUFQLEVBQVlDLFVBQVosRUFBMkI7QUFDM0IsVUFBSUwsSUFBSSxDQUFDSSxHQUFELENBQUosS0FBY2hCLEtBQWxCLEVBQXlCO0FBQ3ZCLFlBQU1rQixRQUFRLEdBQUd0QixXQUFXLENBQUNvQixHQUFELENBQTVCOztBQUVBLFlBQUlKLElBQUksQ0FBQ08sWUFBTCxDQUFrQkQsUUFBbEIsQ0FBSixFQUFpQztBQUMvQixjQUFNRSxTQUFTLEdBQUdSLElBQUksQ0FBQ1MsWUFBTCxDQUFrQkgsUUFBbEIsQ0FBbEI7QUFDQU4sVUFBQUEsSUFBSSxDQUFDSSxHQUFELENBQUosR0FBWUksU0FBUyxLQUFLLEVBQWQsR0FBbUJBLFNBQW5CLEdBQStCLElBQTNDO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPZixPQUFPLElBQUlBLE9BQU8sQ0FBQ08sSUFBRCxFQUFPSSxHQUFQLEVBQVlDLFVBQVosQ0FBekI7QUFDRCxLQVpNLEdBYUxaO0FBaEJDLEdBQVA7QUFrQkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYW1lbFRvRGFzaCB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBkZWZhdWx0VHJhbnNmb3JtID0gdiA9PiB2O1xuXG5jb25zdCBvYmplY3RUcmFuc2Zvcm0gPSAodmFsdWUpID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoYFtwcm9wZXJ0eV0gQXJndW1lbnQgaXMgbm90IGFuIG9iamVjdDogJHt0eXBlb2Ygdn1gKTtcbiAgfVxuICByZXR1cm4gdmFsdWUgJiYgT2JqZWN0LmZyZWV6ZSh2YWx1ZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9wZXJ0eSh2YWx1ZSwgY29ubmVjdCkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZXQgdHJhbnNmb3JtID0gZGVmYXVsdFRyYW5zZm9ybTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgdHJhbnNmb3JtID0gU3RyaW5nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHRyYW5zZm9ybSA9IE51bWJlcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgdHJhbnNmb3JtID0gQm9vbGVhbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHRyYW5zZm9ybSA9IHZhbHVlO1xuICAgICAgdmFsdWUgPSB0cmFuc2Zvcm0oKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAodmFsdWUpIE9iamVjdC5mcmVlemUodmFsdWUpO1xuICAgICAgdHJhbnNmb3JtID0gb2JqZWN0VHJhbnNmb3JtO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDogYnJlYWs7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldDogKGhvc3QsIHZhbCA9IHZhbHVlKSA9PiB2YWwsXG4gICAgc2V0OiAoaG9zdCwgdmFsID0gdmFsdWUsIG9sZFZhbHVlKSA9PiB0cmFuc2Zvcm0odmFsLCBvbGRWYWx1ZSksXG4gICAgY29ubmVjdDogdHlwZSAhPT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gKGhvc3QsIGtleSwgaW52YWxpZGF0ZSkgPT4ge1xuICAgICAgICBpZiAoaG9zdFtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGF0dHJOYW1lID0gY2FtZWxUb0Rhc2goa2V5KTtcblxuICAgICAgICAgIGlmIChob3N0Lmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGhvc3QuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIGhvc3Rba2V5XSA9IGF0dHJWYWx1ZSAhPT0gJycgPyBhdHRyVmFsdWUgOiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25uZWN0ICYmIGNvbm5lY3QoaG9zdCwga2V5LCBpbnZhbGlkYXRlKTtcbiAgICAgIH1cbiAgICAgIDogY29ubmVjdCxcbiAgfTtcbn1cbiJdfQ==