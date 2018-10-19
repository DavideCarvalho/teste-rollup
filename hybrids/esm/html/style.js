function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { camelToDash } from '../utils';
export default function resolveStyle(host, target, value, data) {
  if (value === null || _typeof(value) !== 'object') {
    throw TypeError('Style value must be an object instance');
  }

  var previousMap = data.styleMap || new Map();
  data.styleMap = Object.keys(value).reduce(function (map, key) {
    var dashKey = camelToDash(key);
    var styleValue = value[key];

    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }

    map.set(dashKey, styleValue);
    previousMap.delete(dashKey);
    return map;
  }, new Map());
  previousMap.forEach(function (styleValue, key) {
    target.style[key] = '';
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL3N0eWxlLmpzIl0sIm5hbWVzIjpbImNhbWVsVG9EYXNoIiwicmVzb2x2ZVN0eWxlIiwiaG9zdCIsInRhcmdldCIsInZhbHVlIiwiZGF0YSIsIlR5cGVFcnJvciIsInByZXZpb3VzTWFwIiwic3R5bGVNYXAiLCJNYXAiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwibWFwIiwia2V5IiwiZGFzaEtleSIsInN0eWxlVmFsdWUiLCJzdHlsZSIsInJlbW92ZVByb3BlcnR5Iiwic2V0UHJvcGVydHkiLCJzZXQiLCJkZWxldGUiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLFdBQVQsUUFBNEIsVUFBNUI7QUFFQSxlQUFlLFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCQyxNQUE1QixFQUFvQ0MsS0FBcEMsRUFBMkNDLElBQTNDLEVBQWlEO0FBQzlELE1BQUlELEtBQUssS0FBSyxJQUFWLElBQWtCLFFBQU9BLEtBQVAsTUFBaUIsUUFBdkMsRUFBaUQ7QUFDL0MsVUFBTUUsU0FBUyxDQUFDLHdDQUFELENBQWY7QUFDRDs7QUFFRCxNQUFNQyxXQUFXLEdBQUdGLElBQUksQ0FBQ0csUUFBTCxJQUFpQixJQUFJQyxHQUFKLEVBQXJDO0FBRUFKLEVBQUFBLElBQUksQ0FBQ0csUUFBTCxHQUFnQkUsTUFBTSxDQUFDQyxJQUFQLENBQVlQLEtBQVosRUFBbUJRLE1BQW5CLENBQTBCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3RELFFBQU1DLE9BQU8sR0FBR2YsV0FBVyxDQUFDYyxHQUFELENBQTNCO0FBQ0EsUUFBTUUsVUFBVSxHQUFHWixLQUFLLENBQUNVLEdBQUQsQ0FBeEI7O0FBRUEsUUFBSSxDQUFDRSxVQUFELElBQWVBLFVBQVUsS0FBSyxDQUFsQyxFQUFxQztBQUNuQ2IsTUFBQUEsTUFBTSxDQUFDYyxLQUFQLENBQWFDLGNBQWIsQ0FBNEJILE9BQTVCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xaLE1BQUFBLE1BQU0sQ0FBQ2MsS0FBUCxDQUFhRSxXQUFiLENBQXlCSixPQUF6QixFQUFrQ0MsVUFBbEM7QUFDRDs7QUFFREgsSUFBQUEsR0FBRyxDQUFDTyxHQUFKLENBQVFMLE9BQVIsRUFBaUJDLFVBQWpCO0FBQ0FULElBQUFBLFdBQVcsQ0FBQ2MsTUFBWixDQUFtQk4sT0FBbkI7QUFFQSxXQUFPRixHQUFQO0FBQ0QsR0FkZSxFQWNiLElBQUlKLEdBQUosRUFkYSxDQUFoQjtBQWdCQUYsRUFBQUEsV0FBVyxDQUFDZSxPQUFaLENBQW9CLFVBQUNOLFVBQUQsRUFBYUYsR0FBYixFQUFxQjtBQUFFWCxJQUFBQSxNQUFNLENBQUNjLEtBQVAsQ0FBYUgsR0FBYixJQUFvQixFQUFwQjtBQUF5QixHQUFwRTtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2FtZWxUb0Rhc2ggfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmVTdHlsZShob3N0LCB0YXJnZXQsIHZhbHVlLCBkYXRhKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHlsZSB2YWx1ZSBtdXN0IGJlIGFuIG9iamVjdCBpbnN0YW5jZScpO1xuICB9XG5cbiAgY29uc3QgcHJldmlvdXNNYXAgPSBkYXRhLnN0eWxlTWFwIHx8IG5ldyBNYXAoKTtcblxuICBkYXRhLnN0eWxlTWFwID0gT2JqZWN0LmtleXModmFsdWUpLnJlZHVjZSgobWFwLCBrZXkpID0+IHtcbiAgICBjb25zdCBkYXNoS2V5ID0gY2FtZWxUb0Rhc2goa2V5KTtcbiAgICBjb25zdCBzdHlsZVZhbHVlID0gdmFsdWVba2V5XTtcblxuICAgIGlmICghc3R5bGVWYWx1ZSAmJiBzdHlsZVZhbHVlICE9PSAwKSB7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoZGFzaEtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zdHlsZS5zZXRQcm9wZXJ0eShkYXNoS2V5LCBzdHlsZVZhbHVlKTtcbiAgICB9XG5cbiAgICBtYXAuc2V0KGRhc2hLZXksIHN0eWxlVmFsdWUpO1xuICAgIHByZXZpb3VzTWFwLmRlbGV0ZShkYXNoS2V5KTtcblxuICAgIHJldHVybiBtYXA7XG4gIH0sIG5ldyBNYXAoKSk7XG5cbiAgcHJldmlvdXNNYXAuZm9yRWFjaCgoc3R5bGVWYWx1ZSwga2V5KSA9PiB7IHRhcmdldC5zdHlsZVtrZXldID0gJyc7IH0pO1xufVxuIl19