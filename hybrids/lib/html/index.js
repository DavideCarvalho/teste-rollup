"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.svg = svg;

var _define = _interopRequireDefault(require("../define"));

var _template = require("./template");

var _resolve = _interopRequireDefault(require("./resolve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defineElements(elements) {
  (0, _define.default)(elements);
  return this;
}

function key(id) {
  this.id = id;
  return this;
}

var updates = new Map();

function create(parts, args, isSVG) {
  var update = function update(host) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : host;
    var id = (0, _template.createId)(parts, isSVG);
    var render = updates.get(id);

    if (!render) {
      render = (0, _template.compile)(parts, isSVG);
      updates.set(id, render);
    }

    render(host, target, args);
  };

  return Object.assign(update, {
    define: defineElements,
    key: key
  });
}

function html(parts) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return create(parts, args);
}

function svg(parts) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return create(parts, args, true);
}

Object.assign(html, {
  resolve: _resolve.default
});
Object.assign(svg, {
  resolve: _resolve.default
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmluZUVsZW1lbnRzIiwiZWxlbWVudHMiLCJrZXkiLCJpZCIsInVwZGF0ZXMiLCJNYXAiLCJjcmVhdGUiLCJwYXJ0cyIsImFyZ3MiLCJpc1NWRyIsInVwZGF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJyZW5kZXIiLCJnZXQiLCJzZXQiLCJPYmplY3QiLCJhc3NpZ24iLCJkZWZpbmUiLCJodG1sIiwic3ZnIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7OztBQUVBLFNBQVNBLGNBQVQsQ0FBd0JDLFFBQXhCLEVBQWtDO0FBQ2hDLHVCQUFPQSxRQUFQO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0MsR0FBVCxDQUFhQyxFQUFiLEVBQWlCO0FBQ2YsT0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsSUFBTUMsT0FBTyxHQUFHLElBQUlDLEdBQUosRUFBaEI7O0FBRUEsU0FBU0MsTUFBVCxDQUFnQkMsS0FBaEIsRUFBdUJDLElBQXZCLEVBQTZCQyxLQUE3QixFQUFvQztBQUNsQyxNQUFNQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFDQyxJQUFELEVBQXlCO0FBQUEsUUFBbEJDLE1BQWtCLHVFQUFURCxJQUFTO0FBQ3RDLFFBQU1SLEVBQUUsR0FBRyx3QkFBU0ksS0FBVCxFQUFnQkUsS0FBaEIsQ0FBWDtBQUNBLFFBQUlJLE1BQU0sR0FBR1QsT0FBTyxDQUFDVSxHQUFSLENBQVlYLEVBQVosQ0FBYjs7QUFFQSxRQUFJLENBQUNVLE1BQUwsRUFBYTtBQUNYQSxNQUFBQSxNQUFNLEdBQUcsdUJBQVFOLEtBQVIsRUFBZUUsS0FBZixDQUFUO0FBQ0FMLE1BQUFBLE9BQU8sQ0FBQ1csR0FBUixDQUFZWixFQUFaLEVBQWdCVSxNQUFoQjtBQUNEOztBQUVEQSxJQUFBQSxNQUFNLENBQUNGLElBQUQsRUFBT0MsTUFBUCxFQUFlSixJQUFmLENBQU47QUFDRCxHQVZEOztBQVlBLFNBQU9RLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjUCxNQUFkLEVBQXNCO0FBQUVRLElBQUFBLE1BQU0sRUFBRWxCLGNBQVY7QUFBMEJFLElBQUFBLEdBQUcsRUFBSEE7QUFBMUIsR0FBdEIsQ0FBUDtBQUNEOztBQUVNLFNBQVNpQixJQUFULENBQWNaLEtBQWQsRUFBOEI7QUFBQSxvQ0FBTkMsSUFBTTtBQUFOQSxJQUFBQSxJQUFNO0FBQUE7O0FBQ25DLFNBQU9GLE1BQU0sQ0FBQ0MsS0FBRCxFQUFRQyxJQUFSLENBQWI7QUFDRDs7QUFFTSxTQUFTWSxHQUFULENBQWFiLEtBQWIsRUFBNkI7QUFBQSxxQ0FBTkMsSUFBTTtBQUFOQSxJQUFBQSxJQUFNO0FBQUE7O0FBQ2xDLFNBQU9GLE1BQU0sQ0FBQ0MsS0FBRCxFQUFRQyxJQUFSLEVBQWMsSUFBZCxDQUFiO0FBQ0Q7O0FBRURRLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjRSxJQUFkLEVBQW9CO0FBQUVFLEVBQUFBLE9BQU8sRUFBUEE7QUFBRixDQUFwQjtBQUNBTCxNQUFNLENBQUNDLE1BQVAsQ0FBY0csR0FBZCxFQUFtQjtBQUFFQyxFQUFBQSxPQUFPLEVBQVBBO0FBQUYsQ0FBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVmaW5lIGZyb20gJy4uL2RlZmluZSc7XG5cbmltcG9ydCB7IGNvbXBpbGUsIGNyZWF0ZUlkIH0gZnJvbSAnLi90ZW1wbGF0ZSc7XG5pbXBvcnQgcmVzb2x2ZSBmcm9tICcuL3Jlc29sdmUnO1xuXG5mdW5jdGlvbiBkZWZpbmVFbGVtZW50cyhlbGVtZW50cykge1xuICBkZWZpbmUoZWxlbWVudHMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24ga2V5KGlkKSB7XG4gIHRoaXMuaWQgPSBpZDtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmNvbnN0IHVwZGF0ZXMgPSBuZXcgTWFwKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZShwYXJ0cywgYXJncywgaXNTVkcpIHtcbiAgY29uc3QgdXBkYXRlID0gKGhvc3QsIHRhcmdldCA9IGhvc3QpID0+IHtcbiAgICBjb25zdCBpZCA9IGNyZWF0ZUlkKHBhcnRzLCBpc1NWRyk7XG4gICAgbGV0IHJlbmRlciA9IHVwZGF0ZXMuZ2V0KGlkKTtcblxuICAgIGlmICghcmVuZGVyKSB7XG4gICAgICByZW5kZXIgPSBjb21waWxlKHBhcnRzLCBpc1NWRyk7XG4gICAgICB1cGRhdGVzLnNldChpZCwgcmVuZGVyKTtcbiAgICB9XG5cbiAgICByZW5kZXIoaG9zdCwgdGFyZ2V0LCBhcmdzKTtcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih1cGRhdGUsIHsgZGVmaW5lOiBkZWZpbmVFbGVtZW50cywga2V5IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHRtbChwYXJ0cywgLi4uYXJncykge1xuICByZXR1cm4gY3JlYXRlKHBhcnRzLCBhcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN2ZyhwYXJ0cywgLi4uYXJncykge1xuICByZXR1cm4gY3JlYXRlKHBhcnRzLCBhcmdzLCB0cnVlKTtcbn1cblxuT2JqZWN0LmFzc2lnbihodG1sLCB7IHJlc29sdmUgfSk7XG5PYmplY3QuYXNzaWduKHN2ZywgeyByZXNvbHZlIH0pO1xuIl19