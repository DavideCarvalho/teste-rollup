"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolve;

var _utils = require("../utils");

var map = (0, _utils.createMap)();

function resolve(promise, placeholder) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return function (host, target) {
    var timeout;

    if (placeholder) {
      timeout = setTimeout(function () {
        timeout = undefined;
        requestAnimationFrame(function () {
          placeholder(host, target);
        });
      }, delay);
    }

    map.set(target, promise);
    promise.then(function (template) {
      if (timeout) clearTimeout(timeout);

      if (map.get(target) === promise) {
        template(host, target);
        map.set(target, null);
      }
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL3Jlc29sdmUuanMiXSwibmFtZXMiOlsibWFwIiwicmVzb2x2ZSIsInByb21pc2UiLCJwbGFjZWhvbGRlciIsImRlbGF5IiwiaG9zdCIsInRhcmdldCIsInRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidW5kZWZpbmVkIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2V0IiwidGhlbiIsInRlbXBsYXRlIiwiY2xlYXJUaW1lb3V0IiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUEsSUFBTUEsR0FBRyxHQUFHLHVCQUFaOztBQUVlLFNBQVNDLE9BQVQsQ0FBaUJDLE9BQWpCLEVBQTBCQyxXQUExQixFQUFvRDtBQUFBLE1BQWJDLEtBQWEsdUVBQUwsR0FBSztBQUNqRSxTQUFPLFVBQUNDLElBQUQsRUFBT0MsTUFBUCxFQUFrQjtBQUN2QixRQUFJQyxPQUFKOztBQUVBLFFBQUlKLFdBQUosRUFBaUI7QUFDZkksTUFBQUEsT0FBTyxHQUFHQyxVQUFVLENBQUMsWUFBTTtBQUN6QkQsUUFBQUEsT0FBTyxHQUFHRSxTQUFWO0FBRUFDLFFBQUFBLHFCQUFxQixDQUFDLFlBQU07QUFDMUJQLFVBQUFBLFdBQVcsQ0FBQ0UsSUFBRCxFQUFPQyxNQUFQLENBQVg7QUFDRCxTQUZvQixDQUFyQjtBQUdELE9BTm1CLEVBTWpCRixLQU5pQixDQUFwQjtBQU9EOztBQUVESixJQUFBQSxHQUFHLENBQUNXLEdBQUosQ0FBUUwsTUFBUixFQUFnQkosT0FBaEI7QUFDQUEsSUFBQUEsT0FBTyxDQUFDVSxJQUFSLENBQWEsVUFBQ0MsUUFBRCxFQUFjO0FBQ3pCLFVBQUlOLE9BQUosRUFBYU8sWUFBWSxDQUFDUCxPQUFELENBQVo7O0FBRWIsVUFBSVAsR0FBRyxDQUFDZSxHQUFKLENBQVFULE1BQVIsTUFBb0JKLE9BQXhCLEVBQWlDO0FBQy9CVyxRQUFBQSxRQUFRLENBQUNSLElBQUQsRUFBT0MsTUFBUCxDQUFSO0FBQ0FOLFFBQUFBLEdBQUcsQ0FBQ1csR0FBSixDQUFRTCxNQUFSLEVBQWdCLElBQWhCO0FBQ0Q7QUFDRixLQVBEO0FBUUQsR0F0QkQ7QUF1QkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVNYXAgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IG1hcCA9IGNyZWF0ZU1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNvbHZlKHByb21pc2UsIHBsYWNlaG9sZGVyLCBkZWxheSA9IDIwMCkge1xuICByZXR1cm4gKGhvc3QsIHRhcmdldCkgPT4ge1xuICAgIGxldCB0aW1lb3V0O1xuXG4gICAgaWYgKHBsYWNlaG9sZGVyKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBwbGFjZWhvbGRlcihob3N0LCB0YXJnZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9XG5cbiAgICBtYXAuc2V0KHRhcmdldCwgcHJvbWlzZSk7XG4gICAgcHJvbWlzZS50aGVuKCh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgaWYgKG1hcC5nZXQodGFyZ2V0KSA9PT0gcHJvbWlzZSkge1xuICAgICAgICB0ZW1wbGF0ZShob3N0LCB0YXJnZXQpO1xuICAgICAgICBtYXAuc2V0KHRhcmdldCwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG4iXX0=