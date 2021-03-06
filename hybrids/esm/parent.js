var map = new WeakMap();
document.addEventListener('@invalidate', function (event) {
  var set = map.get(event.composedPath()[0]);
  if (set) set.forEach(function (fn) {
    return fn();
  });
});

function walk(node, fn) {
  var parentElement = node.parentElement || node.parentNode.host;

  while (parentElement) {
    var hybrids = parentElement.constructor.hybrids;

    if (hybrids && fn(hybrids)) {
      return parentElement;
    }

    parentElement = parentElement.parentElement || parentElement.parentNode && parentElement.parentNode.host;
  }

  return parentElement || null;
}

export default function parent(hybridsOrFn) {
  var fn = typeof hybridsOrFn === 'function' ? hybridsOrFn : function (hybrids) {
    return hybrids === hybridsOrFn;
  };
  return {
    get: function get(host) {
      return walk(host, fn);
    },
    connect: function connect(host, key, invalidate) {
      var target = host[key];

      if (target) {
        var set = map.get(target);

        if (!set) {
          set = new Set();
          map.set(target, set);
        }

        set.add(invalidate);
        return function () {
          set.delete(invalidate);
          invalidate();
        };
      }

      return false;
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJlbnQuanMiXSwibmFtZXMiOlsibWFwIiwiV2Vha01hcCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwic2V0IiwiZ2V0IiwiY29tcG9zZWRQYXRoIiwiZm9yRWFjaCIsImZuIiwid2FsayIsIm5vZGUiLCJwYXJlbnRFbGVtZW50IiwicGFyZW50Tm9kZSIsImhvc3QiLCJoeWJyaWRzIiwiY29uc3RydWN0b3IiLCJwYXJlbnQiLCJoeWJyaWRzT3JGbiIsImNvbm5lY3QiLCJrZXkiLCJpbnZhbGlkYXRlIiwidGFyZ2V0IiwiU2V0IiwiYWRkIiwiZGVsZXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxHQUFHLEdBQUcsSUFBSUMsT0FBSixFQUFaO0FBRUFDLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsVUFBQ0MsS0FBRCxFQUFXO0FBQ2xELE1BQU1DLEdBQUcsR0FBR0wsR0FBRyxDQUFDTSxHQUFKLENBQVFGLEtBQUssQ0FBQ0csWUFBTixHQUFxQixDQUFyQixDQUFSLENBQVo7QUFDQSxNQUFJRixHQUFKLEVBQVNBLEdBQUcsQ0FBQ0csT0FBSixDQUFZLFVBQUFDLEVBQUU7QUFBQSxXQUFJQSxFQUFFLEVBQU47QUFBQSxHQUFkO0FBQ1YsQ0FIRDs7QUFLQSxTQUFTQyxJQUFULENBQWNDLElBQWQsRUFBb0JGLEVBQXBCLEVBQXdCO0FBQ3RCLE1BQUlHLGFBQWEsR0FBR0QsSUFBSSxDQUFDQyxhQUFMLElBQXNCRCxJQUFJLENBQUNFLFVBQUwsQ0FBZ0JDLElBQTFEOztBQUVBLFNBQU9GLGFBQVAsRUFBc0I7QUFDcEIsUUFBTUcsT0FBTyxHQUFHSCxhQUFhLENBQUNJLFdBQWQsQ0FBMEJELE9BQTFDOztBQUVBLFFBQUlBLE9BQU8sSUFBSU4sRUFBRSxDQUFDTSxPQUFELENBQWpCLEVBQTRCO0FBQzFCLGFBQU9ILGFBQVA7QUFDRDs7QUFFREEsSUFBQUEsYUFBYSxHQUFHQSxhQUFhLENBQUNBLGFBQWQsSUFDVkEsYUFBYSxDQUFDQyxVQUFkLElBQTRCRCxhQUFhLENBQUNDLFVBQWQsQ0FBeUJDLElBRDNEO0FBRUQ7O0FBRUQsU0FBT0YsYUFBYSxJQUFJLElBQXhCO0FBQ0Q7O0FBRUQsZUFBZSxTQUFTSyxNQUFULENBQWdCQyxXQUFoQixFQUE2QjtBQUMxQyxNQUFNVCxFQUFFLEdBQUcsT0FBT1MsV0FBUCxLQUF1QixVQUF2QixHQUFvQ0EsV0FBcEMsR0FBa0QsVUFBQUgsT0FBTztBQUFBLFdBQUlBLE9BQU8sS0FBS0csV0FBaEI7QUFBQSxHQUFwRTtBQUNBLFNBQU87QUFDTFosSUFBQUEsR0FBRyxFQUFFLGFBQUFRLElBQUk7QUFBQSxhQUFJSixJQUFJLENBQUNJLElBQUQsRUFBT0wsRUFBUCxDQUFSO0FBQUEsS0FESjtBQUVMVSxJQUFBQSxPQUZLLG1CQUVHTCxJQUZILEVBRVNNLEdBRlQsRUFFY0MsVUFGZCxFQUUwQjtBQUM3QixVQUFNQyxNQUFNLEdBQUdSLElBQUksQ0FBQ00sR0FBRCxDQUFuQjs7QUFFQSxVQUFJRSxNQUFKLEVBQVk7QUFDVixZQUFJakIsR0FBRyxHQUFHTCxHQUFHLENBQUNNLEdBQUosQ0FBUWdCLE1BQVIsQ0FBVjs7QUFDQSxZQUFJLENBQUNqQixHQUFMLEVBQVU7QUFDUkEsVUFBQUEsR0FBRyxHQUFHLElBQUlrQixHQUFKLEVBQU47QUFDQXZCLFVBQUFBLEdBQUcsQ0FBQ0ssR0FBSixDQUFRaUIsTUFBUixFQUFnQmpCLEdBQWhCO0FBQ0Q7O0FBRURBLFFBQUFBLEdBQUcsQ0FBQ21CLEdBQUosQ0FBUUgsVUFBUjtBQUVBLGVBQU8sWUFBTTtBQUNYaEIsVUFBQUEsR0FBRyxDQUFDb0IsTUFBSixDQUFXSixVQUFYO0FBQ0FBLFVBQUFBLFVBQVU7QUFDWCxTQUhEO0FBSUQ7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7QUFyQkksR0FBUDtBQXVCRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1hcCA9IG5ldyBXZWFrTWFwKCk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0BpbnZhbGlkYXRlJywgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IHNldCA9IG1hcC5nZXQoZXZlbnQuY29tcG9zZWRQYXRoKClbMF0pO1xuICBpZiAoc2V0KSBzZXQuZm9yRWFjaChmbiA9PiBmbigpKTtcbn0pO1xuXG5mdW5jdGlvbiB3YWxrKG5vZGUsIGZuKSB7XG4gIGxldCBwYXJlbnRFbGVtZW50ID0gbm9kZS5wYXJlbnRFbGVtZW50IHx8IG5vZGUucGFyZW50Tm9kZS5ob3N0O1xuXG4gIHdoaWxlIChwYXJlbnRFbGVtZW50KSB7XG4gICAgY29uc3QgaHlicmlkcyA9IHBhcmVudEVsZW1lbnQuY29uc3RydWN0b3IuaHlicmlkcztcblxuICAgIGlmIChoeWJyaWRzICYmIGZuKGh5YnJpZHMpKSB7XG4gICAgICByZXR1cm4gcGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgICB8fCAocGFyZW50RWxlbWVudC5wYXJlbnROb2RlICYmIHBhcmVudEVsZW1lbnQucGFyZW50Tm9kZS5ob3N0KTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnRFbGVtZW50IHx8IG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcmVudChoeWJyaWRzT3JGbikge1xuICBjb25zdCBmbiA9IHR5cGVvZiBoeWJyaWRzT3JGbiA9PT0gJ2Z1bmN0aW9uJyA/IGh5YnJpZHNPckZuIDogaHlicmlkcyA9PiBoeWJyaWRzID09PSBoeWJyaWRzT3JGbjtcbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGhvc3QgPT4gd2Fsayhob3N0LCBmbiksXG4gICAgY29ubmVjdChob3N0LCBrZXksIGludmFsaWRhdGUpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGhvc3Rba2V5XTtcblxuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICBsZXQgc2V0ID0gbWFwLmdldCh0YXJnZXQpO1xuICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICBtYXAuc2V0KHRhcmdldCwgc2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldC5hZGQoaW52YWxpZGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICBzZXQuZGVsZXRlKGludmFsaWRhdGUpO1xuICAgICAgICAgIGludmFsaWRhdGUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gIH07XG59XG4iXX0=