"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveClassList;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function normalizeValue(value) {
  var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

  if (Array.isArray(value)) {
    value.forEach(function (className) {
      return set.add(className);
    });
  } else if (value !== null && _typeof(value) === 'object') {
    Object.keys(value).forEach(function (key) {
      return value[key] && set.add(key);
    });
  } else {
    set.add(value);
  }

  return set;
}

function resolveClassList(host, target, value, data) {
  var previousList = data.classSet || new Set();
  var list = normalizeValue(value);
  data.classSet = list;
  list.forEach(function (className) {
    target.classList.add(className);
    previousList.delete(className);
  });
  previousList.forEach(function (className) {
    target.classList.remove(className);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2NsYXNzTGlzdC5qcyJdLCJuYW1lcyI6WyJub3JtYWxpemVWYWx1ZSIsInZhbHVlIiwic2V0IiwiU2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsImNsYXNzTmFtZSIsImFkZCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJyZXNvbHZlQ2xhc3NMaXN0IiwiaG9zdCIsInRhcmdldCIsImRhdGEiLCJwcmV2aW91c0xpc3QiLCJjbGFzc1NldCIsImxpc3QiLCJjbGFzc0xpc3QiLCJkZWxldGUiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFNBQVNBLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQWdEO0FBQUEsTUFBakJDLEdBQWlCLHVFQUFYLElBQUlDLEdBQUosRUFBVzs7QUFDOUMsTUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNKLEtBQWQsQ0FBSixFQUEwQjtBQUN4QkEsSUFBQUEsS0FBSyxDQUFDSyxPQUFOLENBQWMsVUFBQUMsU0FBUztBQUFBLGFBQUlMLEdBQUcsQ0FBQ00sR0FBSixDQUFRRCxTQUFSLENBQUo7QUFBQSxLQUF2QjtBQUNELEdBRkQsTUFFTyxJQUFJTixLQUFLLEtBQUssSUFBVixJQUFrQixRQUFPQSxLQUFQLE1BQWlCLFFBQXZDLEVBQWlEO0FBQ3REUSxJQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWVQsS0FBWixFQUFtQkssT0FBbkIsQ0FBMkIsVUFBQUssR0FBRztBQUFBLGFBQUlWLEtBQUssQ0FBQ1UsR0FBRCxDQUFMLElBQWNULEdBQUcsQ0FBQ00sR0FBSixDQUFRRyxHQUFSLENBQWxCO0FBQUEsS0FBOUI7QUFDRCxHQUZNLE1BRUE7QUFDTFQsSUFBQUEsR0FBRyxDQUFDTSxHQUFKLENBQVFQLEtBQVI7QUFDRDs7QUFFRCxTQUFPQyxHQUFQO0FBQ0Q7O0FBRWMsU0FBU1UsZ0JBQVQsQ0FBMEJDLElBQTFCLEVBQWdDQyxNQUFoQyxFQUF3Q2IsS0FBeEMsRUFBK0NjLElBQS9DLEVBQXFEO0FBQ2xFLE1BQU1DLFlBQVksR0FBR0QsSUFBSSxDQUFDRSxRQUFMLElBQWlCLElBQUlkLEdBQUosRUFBdEM7QUFDQSxNQUFNZSxJQUFJLEdBQUdsQixjQUFjLENBQUNDLEtBQUQsQ0FBM0I7QUFFQWMsRUFBQUEsSUFBSSxDQUFDRSxRQUFMLEdBQWdCQyxJQUFoQjtBQUVBQSxFQUFBQSxJQUFJLENBQUNaLE9BQUwsQ0FBYSxVQUFDQyxTQUFELEVBQWU7QUFDMUJPLElBQUFBLE1BQU0sQ0FBQ0ssU0FBUCxDQUFpQlgsR0FBakIsQ0FBcUJELFNBQXJCO0FBQ0FTLElBQUFBLFlBQVksQ0FBQ0ksTUFBYixDQUFvQmIsU0FBcEI7QUFDRCxHQUhEO0FBS0FTLEVBQUFBLFlBQVksQ0FBQ1YsT0FBYixDQUFxQixVQUFDQyxTQUFELEVBQWU7QUFDbENPLElBQUFBLE1BQU0sQ0FBQ0ssU0FBUCxDQUFpQkUsTUFBakIsQ0FBd0JkLFNBQXhCO0FBQ0QsR0FGRDtBQUdEIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUsIHNldCA9IG5ldyBTZXQoKSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGNsYXNzTmFtZSA9PiBzZXQuYWRkKGNsYXNzTmFtZSkpO1xuICB9IGVsc2UgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChrZXkgPT4gdmFsdWVba2V5XSAmJiBzZXQuYWRkKGtleSkpO1xuICB9IGVsc2Uge1xuICAgIHNldC5hZGQodmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHNldDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZUNsYXNzTGlzdChob3N0LCB0YXJnZXQsIHZhbHVlLCBkYXRhKSB7XG4gIGNvbnN0IHByZXZpb3VzTGlzdCA9IGRhdGEuY2xhc3NTZXQgfHwgbmV3IFNldCgpO1xuICBjb25zdCBsaXN0ID0gbm9ybWFsaXplVmFsdWUodmFsdWUpO1xuXG4gIGRhdGEuY2xhc3NTZXQgPSBsaXN0O1xuXG4gIGxpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBwcmV2aW91c0xpc3QuZGVsZXRlKGNsYXNzTmFtZSk7XG4gIH0pO1xuXG4gIHByZXZpb3VzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9KTtcbn1cbiJdfQ==