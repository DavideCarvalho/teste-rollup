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

export default function resolveClassList(host, target, value, data) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2NsYXNzTGlzdC5qcyJdLCJuYW1lcyI6WyJub3JtYWxpemVWYWx1ZSIsInZhbHVlIiwic2V0IiwiU2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsImNsYXNzTmFtZSIsImFkZCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJyZXNvbHZlQ2xhc3NMaXN0IiwiaG9zdCIsInRhcmdldCIsImRhdGEiLCJwcmV2aW91c0xpc3QiLCJjbGFzc1NldCIsImxpc3QiLCJjbGFzc0xpc3QiLCJkZWxldGUiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsY0FBVCxDQUF3QkMsS0FBeEIsRUFBZ0Q7QUFBQSxNQUFqQkMsR0FBaUIsdUVBQVgsSUFBSUMsR0FBSixFQUFXOztBQUM5QyxNQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0osS0FBZCxDQUFKLEVBQTBCO0FBQ3hCQSxJQUFBQSxLQUFLLENBQUNLLE9BQU4sQ0FBYyxVQUFBQyxTQUFTO0FBQUEsYUFBSUwsR0FBRyxDQUFDTSxHQUFKLENBQVFELFNBQVIsQ0FBSjtBQUFBLEtBQXZCO0FBQ0QsR0FGRCxNQUVPLElBQUlOLEtBQUssS0FBSyxJQUFWLElBQWtCLFFBQU9BLEtBQVAsTUFBaUIsUUFBdkMsRUFBaUQ7QUFDdERRLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZVCxLQUFaLEVBQW1CSyxPQUFuQixDQUEyQixVQUFBSyxHQUFHO0FBQUEsYUFBSVYsS0FBSyxDQUFDVSxHQUFELENBQUwsSUFBY1QsR0FBRyxDQUFDTSxHQUFKLENBQVFHLEdBQVIsQ0FBbEI7QUFBQSxLQUE5QjtBQUNELEdBRk0sTUFFQTtBQUNMVCxJQUFBQSxHQUFHLENBQUNNLEdBQUosQ0FBUVAsS0FBUjtBQUNEOztBQUVELFNBQU9DLEdBQVA7QUFDRDs7QUFFRCxlQUFlLFNBQVNVLGdCQUFULENBQTBCQyxJQUExQixFQUFnQ0MsTUFBaEMsRUFBd0NiLEtBQXhDLEVBQStDYyxJQUEvQyxFQUFxRDtBQUNsRSxNQUFNQyxZQUFZLEdBQUdELElBQUksQ0FBQ0UsUUFBTCxJQUFpQixJQUFJZCxHQUFKLEVBQXRDO0FBQ0EsTUFBTWUsSUFBSSxHQUFHbEIsY0FBYyxDQUFDQyxLQUFELENBQTNCO0FBRUFjLEVBQUFBLElBQUksQ0FBQ0UsUUFBTCxHQUFnQkMsSUFBaEI7QUFFQUEsRUFBQUEsSUFBSSxDQUFDWixPQUFMLENBQWEsVUFBQ0MsU0FBRCxFQUFlO0FBQzFCTyxJQUFBQSxNQUFNLENBQUNLLFNBQVAsQ0FBaUJYLEdBQWpCLENBQXFCRCxTQUFyQjtBQUNBUyxJQUFBQSxZQUFZLENBQUNJLE1BQWIsQ0FBb0JiLFNBQXBCO0FBQ0QsR0FIRDtBQUtBUyxFQUFBQSxZQUFZLENBQUNWLE9BQWIsQ0FBcUIsVUFBQ0MsU0FBRCxFQUFlO0FBQ2xDTyxJQUFBQSxNQUFNLENBQUNLLFNBQVAsQ0FBaUJFLE1BQWpCLENBQXdCZCxTQUF4QjtBQUNELEdBRkQ7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlLCBzZXQgPSBuZXcgU2V0KCkpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChjbGFzc05hbWUgPT4gc2V0LmFkZChjbGFzc05hbWUpKTtcbiAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goa2V5ID0+IHZhbHVlW2tleV0gJiYgc2V0LmFkZChrZXkpKTtcbiAgfSBlbHNlIHtcbiAgICBzZXQuYWRkKHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBzZXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmVDbGFzc0xpc3QoaG9zdCwgdGFyZ2V0LCB2YWx1ZSwgZGF0YSkge1xuICBjb25zdCBwcmV2aW91c0xpc3QgPSBkYXRhLmNsYXNzU2V0IHx8IG5ldyBTZXQoKTtcbiAgY29uc3QgbGlzdCA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcblxuICBkYXRhLmNsYXNzU2V0ID0gbGlzdDtcblxuICBsaXN0LmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgcHJldmlvdXNMaXN0LmRlbGV0ZShjbGFzc05hbWUpO1xuICB9KTtcblxuICBwcmV2aW91c0xpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfSk7XG59XG4iXX0=