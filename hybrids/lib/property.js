"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = property;

var _utils = require("./utils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var defaultTransform = function defaultTransform(v) {
  return v;
};

var objectTransform = function objectTransform(value) {
  if (_typeof(value) !== 'object') {
    throw TypeError("[property] Argument is not an object: ".concat(typeof v === "undefined" ? "undefined" : _typeof(v)));
  }

  return value && Object.freeze(value);
};

function property(value, connect) {
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
        var attrName = (0, _utils.camelToDash)(key);

        if (host.hasAttribute(attrName)) {
          var attrValue = host.getAttribute(attrName);
          host[key] = attrValue !== '' ? attrValue : true;
        }
      }

      return connect && connect(host, key, invalidate);
    } : connect
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0VHJhbnNmb3JtIiwidiIsIm9iamVjdFRyYW5zZm9ybSIsInZhbHVlIiwiVHlwZUVycm9yIiwiT2JqZWN0IiwiZnJlZXplIiwicHJvcGVydHkiLCJjb25uZWN0IiwidHlwZSIsInRyYW5zZm9ybSIsIlN0cmluZyIsIk51bWJlciIsIkJvb2xlYW4iLCJnZXQiLCJob3N0IiwidmFsIiwic2V0Iiwib2xkVmFsdWUiLCJrZXkiLCJpbnZhbGlkYXRlIiwiYXR0ck5hbWUiLCJoYXNBdHRyaWJ1dGUiLCJhdHRyVmFsdWUiLCJnZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVBLElBQU1BLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUo7QUFBQSxDQUExQjs7QUFFQSxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBVztBQUNqQyxNQUFJLFFBQU9BLEtBQVAsTUFBaUIsUUFBckIsRUFBK0I7QUFDN0IsVUFBTUMsU0FBUyx3REFBaURILENBQWpELHlDQUFpREEsQ0FBakQsR0FBZjtBQUNEOztBQUNELFNBQU9FLEtBQUssSUFBSUUsTUFBTSxDQUFDQyxNQUFQLENBQWNILEtBQWQsQ0FBaEI7QUFDRCxDQUxEOztBQU9lLFNBQVNJLFFBQVQsQ0FBa0JKLEtBQWxCLEVBQXlCSyxPQUF6QixFQUFrQztBQUMvQyxNQUFNQyxJQUFJLFdBQVVOLEtBQVYsQ0FBVjs7QUFDQSxNQUFJTyxTQUFTLEdBQUdWLGdCQUFoQjs7QUFFQSxVQUFRUyxJQUFSO0FBQ0UsU0FBSyxRQUFMO0FBQ0VDLE1BQUFBLFNBQVMsR0FBR0MsTUFBWjtBQUNBOztBQUNGLFNBQUssUUFBTDtBQUNFRCxNQUFBQSxTQUFTLEdBQUdFLE1BQVo7QUFDQTs7QUFDRixTQUFLLFNBQUw7QUFDRUYsTUFBQUEsU0FBUyxHQUFHRyxPQUFaO0FBQ0E7O0FBQ0YsU0FBSyxVQUFMO0FBQ0VILE1BQUFBLFNBQVMsR0FBR1AsS0FBWjtBQUNBQSxNQUFBQSxLQUFLLEdBQUdPLFNBQVMsRUFBakI7QUFDQTs7QUFDRixTQUFLLFFBQUw7QUFDRSxVQUFJUCxLQUFKLEVBQVdFLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjSCxLQUFkO0FBQ1hPLE1BQUFBLFNBQVMsR0FBR1IsZUFBWjtBQUNBOztBQUNGO0FBQVM7QUFsQlg7O0FBcUJBLFNBQU87QUFDTFksSUFBQUEsR0FBRyxFQUFFLGFBQUNDLElBQUQ7QUFBQSxVQUFPQyxHQUFQLHVFQUFhYixLQUFiO0FBQUEsYUFBdUJhLEdBQXZCO0FBQUEsS0FEQTtBQUVMQyxJQUFBQSxHQUFHLEVBQUUsYUFBQ0YsSUFBRDtBQUFBLFVBQU9DLEdBQVAsdUVBQWFiLEtBQWI7QUFBQSxVQUFvQmUsUUFBcEI7QUFBQSxhQUFpQ1IsU0FBUyxDQUFDTSxHQUFELEVBQU1FLFFBQU4sQ0FBMUM7QUFBQSxLQUZBO0FBR0xWLElBQUFBLE9BQU8sRUFBRUMsSUFBSSxLQUFLLFFBQVQsSUFBcUJBLElBQUksS0FBSyxXQUE5QixHQUNMLFVBQUNNLElBQUQsRUFBT0ksR0FBUCxFQUFZQyxVQUFaLEVBQTJCO0FBQzNCLFVBQUlMLElBQUksQ0FBQ0ksR0FBRCxDQUFKLEtBQWNoQixLQUFsQixFQUF5QjtBQUN2QixZQUFNa0IsUUFBUSxHQUFHLHdCQUFZRixHQUFaLENBQWpCOztBQUVBLFlBQUlKLElBQUksQ0FBQ08sWUFBTCxDQUFrQkQsUUFBbEIsQ0FBSixFQUFpQztBQUMvQixjQUFNRSxTQUFTLEdBQUdSLElBQUksQ0FBQ1MsWUFBTCxDQUFrQkgsUUFBbEIsQ0FBbEI7QUFDQU4sVUFBQUEsSUFBSSxDQUFDSSxHQUFELENBQUosR0FBWUksU0FBUyxLQUFLLEVBQWQsR0FBbUJBLFNBQW5CLEdBQStCLElBQTNDO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPZixPQUFPLElBQUlBLE9BQU8sQ0FBQ08sSUFBRCxFQUFPSSxHQUFQLEVBQVlDLFVBQVosQ0FBekI7QUFDRCxLQVpNLEdBYUxaO0FBaEJDLEdBQVA7QUFrQkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYW1lbFRvRGFzaCB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBkZWZhdWx0VHJhbnNmb3JtID0gdiA9PiB2O1xuXG5jb25zdCBvYmplY3RUcmFuc2Zvcm0gPSAodmFsdWUpID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoYFtwcm9wZXJ0eV0gQXJndW1lbnQgaXMgbm90IGFuIG9iamVjdDogJHt0eXBlb2Ygdn1gKTtcbiAgfVxuICByZXR1cm4gdmFsdWUgJiYgT2JqZWN0LmZyZWV6ZSh2YWx1ZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9wZXJ0eSh2YWx1ZSwgY29ubmVjdCkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZXQgdHJhbnNmb3JtID0gZGVmYXVsdFRyYW5zZm9ybTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgdHJhbnNmb3JtID0gU3RyaW5nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHRyYW5zZm9ybSA9IE51bWJlcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgdHJhbnNmb3JtID0gQm9vbGVhbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHRyYW5zZm9ybSA9IHZhbHVlO1xuICAgICAgdmFsdWUgPSB0cmFuc2Zvcm0oKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAodmFsdWUpIE9iamVjdC5mcmVlemUodmFsdWUpO1xuICAgICAgdHJhbnNmb3JtID0gb2JqZWN0VHJhbnNmb3JtO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDogYnJlYWs7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldDogKGhvc3QsIHZhbCA9IHZhbHVlKSA9PiB2YWwsXG4gICAgc2V0OiAoaG9zdCwgdmFsID0gdmFsdWUsIG9sZFZhbHVlKSA9PiB0cmFuc2Zvcm0odmFsLCBvbGRWYWx1ZSksXG4gICAgY29ubmVjdDogdHlwZSAhPT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gKGhvc3QsIGtleSwgaW52YWxpZGF0ZSkgPT4ge1xuICAgICAgICBpZiAoaG9zdFtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGF0dHJOYW1lID0gY2FtZWxUb0Rhc2goa2V5KTtcblxuICAgICAgICAgIGlmIChob3N0Lmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGhvc3QuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIGhvc3Rba2V5XSA9IGF0dHJWYWx1ZSAhPT0gJycgPyBhdHRyVmFsdWUgOiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25uZWN0ICYmIGNvbm5lY3QoaG9zdCwga2V5LCBpbnZhbGlkYXRlKTtcbiAgICAgIH1cbiAgICAgIDogY29ubmVjdCxcbiAgfTtcbn1cbiJdfQ==