"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createId = createId;
exports.createInternalWalker = createInternalWalker;
exports.compile = compile;

var _utils = require("../utils");

var _style = _interopRequireDefault(require("./style"));

var _classList = _interopRequireDefault(require("./classList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var dataMap = (0, _utils.createMap)();

function getTemplateEnd(node) {
  var data; // eslint-disable-next-line no-cond-assign

  while (node && (data = dataMap.get(node)) && data.endNode) {
    node = data.endNode;
  }

  return node;
}

function removeTemplate(target) {
  var data = dataMap.get(target);
  var startNode = data.startNode;

  if (startNode) {
    var endNode = getTemplateEnd(data.endNode);
    var node = startNode;
    var lastNextSibling = endNode.nextSibling;

    while (node) {
      var nextSibling = node.nextSibling;
      node.parentNode.removeChild(node);
      node = nextSibling !== lastNextSibling && nextSibling;
    }
  }
}

function resolveValue(host, target, value) {
  var type = Array.isArray(value) ? 'array' : _typeof(value);
  var data = dataMap.get(target, {});

  if (data.type !== type) {
    removeTemplate(target);
    data = dataMap.set(target, {
      type: type
    });

    if (target.textContent !== '') {
      target.textContent = '';
    }
  }

  switch (type) {
    case 'function':
      value(host, target);
      break;

    case 'array':
      // eslint-disable-next-line no-use-before-define
      resolveArray(host, target, value);
      break;

    default:
      if (value !== data.value) {
        data.value = value;
        target.textContent = type === 'number' || value ? value : '';
      }

  }
}

function movePlaceholder(target, previousSibling) {
  var data = dataMap.get(target);
  var startNode = data.startNode;
  var endNode = getTemplateEnd(data.endNode);
  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
  var prevNode = target;
  var node = startNode;

  while (node) {
    var nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}

function resolveArray(host, target, value) {
  var previousSibling = target;
  var lastIndex = value.length - 1;
  var data = dataMap.get(target);
  var arrayEntries = data.arrayEntries;
  var indexedValue = value.map(function (item, index) {
    return [Object.prototype.hasOwnProperty.call(item, 'id') ? item.id : index, item];
  });

  if (arrayEntries) {
    var ids = new Set();
    indexedValue.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          id = _ref2[0];

      return ids.add(id);
    });
    arrayEntries.forEach(function (entry) {
      var id = entry.id,
          placeholder = entry.placeholder;

      if (!ids.has(id)) {
        removeTemplate(placeholder);
        placeholder.parentNode.removeChild(placeholder);
        entry.available = false;
      }
    });
  }

  data.arrayEntries = indexedValue.reduce(function (entries, _ref3, index) {
    var _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        item = _ref4[1];

    var entry = arrayEntries && arrayEntries.find(function (entryItem) {
      return entryItem.available && entryItem.id === id;
    });
    var placeholder;

    if (entry) {
      entry.available = false;
      placeholder = entry.placeholder;

      if (placeholder.previousSibling !== previousSibling) {
        movePlaceholder(placeholder, previousSibling);
      }
    } else {
      placeholder = document.createTextNode('');
      previousSibling.parentNode.insertBefore(placeholder, previousSibling.nextSibling);
    }

    resolveValue(host, placeholder, item);
    previousSibling = getTemplateEnd(dataMap.get(placeholder).endNode || placeholder);
    if (index === 0) data.startNode = placeholder;
    if (index === lastIndex) data.endNode = previousSibling;
    entries.push({
      available: true,
      id: id,
      placeholder: placeholder
    });
    return entries;
  }, []);

  if (arrayEntries) {
    arrayEntries.forEach(function (entry) {
      var available = entry.available,
          placeholder = entry.placeholder;

      if (available) {
        removeTemplate(placeholder);
        placeholder.parentNode.removeChild(placeholder);
      }
    });
  }
}

function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === 'on') {
    var fnMap = new WeakMap();
    var eventName = propertyName.substr(2);
    return function (host, target, value) {
      if (!fnMap.has(target)) {
        target.addEventListener(eventName, function () {
          var fn = fnMap.get(target);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (fn) fn.apply(void 0, [host].concat(args));
        });
      }

      fnMap.set(target, value);
    };
  }

  switch (attrName) {
    case 'style':
      return _style.default;

    case 'class':
      return _classList.default;

    default:
      return function (host, target, value) {
        if (!isSVG && !(target instanceof SVGElement) && propertyName in target) {
          if (target[propertyName] !== value) {
            target[propertyName] = value;
          }
        } else if (value === false || value === undefined || value === null) {
          target.removeAttribute(attrName);
        } else {
          var attrValue = value === true ? '' : String(value);

          if (target.getAttribute(attrName) !== attrValue) {
            target.setAttribute(attrName, attrValue);
          }
        }
      };
  }
}

var TIMESTAMP = Date.now();

var getPlaceholder = function getPlaceholder() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return "{{h-".concat(TIMESTAMP, "-").concat(id, "}}");
};

var PLACEHOLDER_REGEXP_TEXT = getPlaceholder('(\\d+)');
var PLACEHOLDER_REGEXP_EQUAL = new RegExp("^".concat(PLACEHOLDER_REGEXP_TEXT, "$"));
var PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, 'g');
var ATTR_PREFIX = "--".concat(TIMESTAMP, "--");
var ATTR_REGEXP = new RegExp(ATTR_PREFIX, 'g');
var preparedTemplates = new WeakMap();

function applyShadyCSS(template, tagName) {
  if (!tagName) return template;
  return (0, _utils.shadyCSS)(function (shady) {
    var map = preparedTemplates.get(template);

    if (!map) {
      map = new Map();
      preparedTemplates.set(template, map);
    }

    var clone = map.get(tagName);

    if (!clone) {
      clone = document.createElement('template');
      clone.content.appendChild(template.content.cloneNode(true));
      map.set(tagName, clone);
      var styles = clone.content.querySelectorAll('style');
      Array.from(styles).forEach(function (style) {
        var count = style.childNodes.length + 1;

        for (var i = 0; i < count; i += 1) {
          style.parentNode.insertBefore(document.createTextNode(getPlaceholder()), style);
        }
      });
      shady.prepareTemplate(clone, tagName.toLowerCase());
    }

    return clone;
  }, template);
}

function createId(parts, isSVG) {
  return "".concat(isSVG ? 'svg:' : '').concat(parts.join(getPlaceholder()));
}

function createSignature(parts) {
  var signature = parts.reduce(function (acc, part, index) {
    if (index === 0) {
      return part;
    }

    if (parts.slice(index).join('').match(/\s*<\/\s*(table|tr|thead|tbody|tfoot|colgroup)>/)) {
      return "".concat(acc, "<!--").concat(getPlaceholder(index - 1), "-->").concat(part);
    }

    return acc + getPlaceholder(index - 1) + part;
  }, '');

  if (_utils.IS_IE) {
    return signature.replace(/style\s*=\s*(["][^"]+["]|['][^']+[']|[^\s"'<>/]+)/g, function (match) {
      return "".concat(ATTR_PREFIX).concat(match);
    });
  }

  return signature;
}

function getPropertyName(string) {
  return string.replace(/\s*=\s*['"]*$/g, '').split(' ').pop();
}

function replaceComments(fragment) {
  var iterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, null, false);
  var node; // eslint-disable-next-line no-cond-assign

  while (node = iterator.nextNode()) {
    if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
      node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
      node.parentNode.removeChild(node);
    }
  }
}

function createInternalWalker(context) {
  var node;
  return {
    get currentNode() {
      return node;
    },

    nextNode: function nextNode() {
      if (node === undefined) {
        node = context.childNodes[0];
      } else if (node.childNodes.length) {
        node = node.childNodes[0];
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        node = node.parentNode.nextSibling;
      }

      return !!node;
    }
  };
}

function createExternalWalker(context) {
  return document.createTreeWalker(context, // eslint-disable-next-line no-bitwise
  NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
}

var createWalker = _typeof(window.ShadyDOM) === 'object' && window.ShadyDOM.inUse ? createInternalWalker : createExternalWalker;
var container = document.createElement('div');

function compile(rawParts, isSVG) {
  var template = document.createElement('template');
  var parts = [];
  var signature = createSignature(rawParts);
  if (isSVG) signature = "<svg>".concat(signature, "</svg>");

  if (_utils.IS_IE) {
    template.innerHTML = signature;
  } else {
    container.innerHTML = "<template>".concat(signature, "</template>");
    template.content.appendChild(container.children[0].content);
  }

  if (isSVG) {
    var svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    Array.from(svgRoot.childNodes).forEach(function (node) {
      return template.content.appendChild(node);
    });
  }

  replaceComments(template.content);
  var compileWalker = createWalker(template.content);
  var compileIndex = 0;

  var _loop = function _loop() {
    var node = compileWalker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;

      if (!text.match(PLACEHOLDER_REGEXP_EQUAL)) {
        var results = text.match(PLACEHOLDER_REGEXP_ALL);

        if (results) {
          var currentNode = node;
          results.reduce(function (acc, placeholder) {
            var _acc$pop$split = acc.pop().split(placeholder),
                _acc$pop$split2 = _slicedToArray(_acc$pop$split, 2),
                before = _acc$pop$split2[0],
                next = _acc$pop$split2[1];

            if (before) acc.push(before);
            acc.push(placeholder);
            if (next) acc.push(next);
            return acc;
          }, [text]).forEach(function (part, index) {
            if (index === 0) {
              currentNode.textContent = part;
            } else {
              currentNode = currentNode.parentNode.insertBefore(document.createTextNode(part), currentNode.nextSibling);
            }
          });
        }
      }

      var equal = node.textContent.match(PLACEHOLDER_REGEXP_EQUAL);

      if (equal) {
        if (!_utils.IS_IE) node.textContent = '';
        parts[equal[1]] = [compileIndex, resolveValue];
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.attributes).forEach(function (attr) {
        var value = attr.value.trim();
        var name = _utils.IS_IE ? attr.name.replace(ATTR_PREFIX, '') : attr.name;
        var equal = value.match(PLACEHOLDER_REGEXP_EQUAL);

        if (equal) {
          var propertyName = getPropertyName(rawParts[equal[1]]);
          parts[equal[1]] = [compileIndex, resolveProperty(name, propertyName, isSVG)];
          node.removeAttribute(attr.name);
        } else {
          var _results = value.match(PLACEHOLDER_REGEXP_ALL);

          if (_results) {
            var partialName = "attr__".concat(name);

            _results.forEach(function (placeholder, index) {
              var _placeholder$match = placeholder.match(PLACEHOLDER_REGEXP_EQUAL),
                  _placeholder$match2 = _slicedToArray(_placeholder$match, 2),
                  id = _placeholder$match2[1];

              parts[id] = [compileIndex, function (host, target, attrValue) {
                var data = dataMap.get(target, {});
                data[partialName] = (data[partialName] || value).replace(placeholder, attrValue == null ? '' : attrValue);

                if (_results.length === 1 || index + 1 === _results.length) {
                  target.setAttribute(name, data[partialName]);
                  data[partialName] = undefined;
                }
              }];
            });

            attr.value = '';

            if (_utils.IS_IE && name !== attr.name) {
              node.removeAttribute(attr.name);
              node.setAttribute(name, '');
            }
          }
        }
      });
    }

    compileIndex += 1;
  };

  while (compileWalker.nextNode()) {
    _loop();
  }

  return function (host, target, args) {
    var data = dataMap.get(target, {
      type: 'function'
    });

    if (template !== data.template) {
      if (data.template) removeTemplate(target);
      var fragment = document.importNode(applyShadyCSS(template, host.tagName).content, true);
      var renderWalker = createWalker(fragment);
      var clonedParts = parts.slice(0);
      var renderIndex = 0;
      var currentPart = clonedParts.shift();
      var markers = [];
      Object.assign(data, {
        template: template,
        markers: markers
      });

      while (renderWalker.nextNode()) {
        var node = renderWalker.currentNode;

        if (node.nodeType === Node.TEXT_NODE) {
          if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
            node.textContent = '';
          } else if (_utils.IS_IE) {
            node.textContent = node.textContent.replace(ATTR_REGEXP, '');
          }
        } else if (process.env.NODE_ENV !== 'production' && node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.indexOf('-') > -1 && !customElements.get(node.tagName.toLowerCase())) {
            throw Error("[html] Missing '".concat((0, _utils.stringifyElement)(node), "' element definition in '").concat((0, _utils.stringifyElement)(host), "'"));
          }
        }

        while (currentPart && currentPart[0] === renderIndex) {
          markers.push([node, currentPart[1]]);
          currentPart = clonedParts.shift();
        }

        renderIndex += 1;
      }

      var childList = Array.from(fragment.childNodes);
      data.startNode = childList[0];
      data.endNode = childList[childList.length - 1];

      if (target.nodeType === Node.TEXT_NODE) {
        var previousChild = target;
        childList.forEach(function (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
        });
      } else {
        target.appendChild(fragment);
      }
    }

    data.markers.forEach(function (_ref5, index) {
      var _ref6 = _slicedToArray(_ref5, 2),
          node = _ref6[0],
          fn = _ref6[1];

      fn(host, node, args[index], data);
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL3RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbImRhdGFNYXAiLCJnZXRUZW1wbGF0ZUVuZCIsIm5vZGUiLCJkYXRhIiwiZ2V0IiwiZW5kTm9kZSIsInJlbW92ZVRlbXBsYXRlIiwidGFyZ2V0Iiwic3RhcnROb2RlIiwibGFzdE5leHRTaWJsaW5nIiwibmV4dFNpYmxpbmciLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZXNvbHZlVmFsdWUiLCJob3N0IiwidmFsdWUiLCJ0eXBlIiwiQXJyYXkiLCJpc0FycmF5Iiwic2V0IiwidGV4dENvbnRlbnQiLCJyZXNvbHZlQXJyYXkiLCJtb3ZlUGxhY2Vob2xkZXIiLCJwcmV2aW91c1NpYmxpbmciLCJpbnNlcnRCZWZvcmUiLCJwcmV2Tm9kZSIsIm5leHROb2RlIiwibGFzdEluZGV4IiwibGVuZ3RoIiwiYXJyYXlFbnRyaWVzIiwiaW5kZXhlZFZhbHVlIiwibWFwIiwiaXRlbSIsImluZGV4IiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaWQiLCJpZHMiLCJTZXQiLCJmb3JFYWNoIiwiYWRkIiwiZW50cnkiLCJwbGFjZWhvbGRlciIsImhhcyIsImF2YWlsYWJsZSIsInJlZHVjZSIsImVudHJpZXMiLCJmaW5kIiwiZW50cnlJdGVtIiwiZG9jdW1lbnQiLCJjcmVhdGVUZXh0Tm9kZSIsInB1c2giLCJyZXNvbHZlUHJvcGVydHkiLCJhdHRyTmFtZSIsInByb3BlcnR5TmFtZSIsImlzU1ZHIiwic3Vic3RyIiwiZm5NYXAiLCJXZWFrTWFwIiwiZXZlbnROYW1lIiwiYWRkRXZlbnRMaXN0ZW5lciIsImZuIiwiYXJncyIsInJlc29sdmVTdHlsZUxpc3QiLCJyZXNvbHZlQ2xhc3NMaXN0IiwiU1ZHRWxlbWVudCIsInVuZGVmaW5lZCIsInJlbW92ZUF0dHJpYnV0ZSIsImF0dHJWYWx1ZSIsIlN0cmluZyIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIlRJTUVTVEFNUCIsIkRhdGUiLCJub3ciLCJnZXRQbGFjZWhvbGRlciIsIlBMQUNFSE9MREVSX1JFR0VYUF9URVhUIiwiUExBQ0VIT0xERVJfUkVHRVhQX0VRVUFMIiwiUmVnRXhwIiwiUExBQ0VIT0xERVJfUkVHRVhQX0FMTCIsIkFUVFJfUFJFRklYIiwiQVRUUl9SRUdFWFAiLCJwcmVwYXJlZFRlbXBsYXRlcyIsImFwcGx5U2hhZHlDU1MiLCJ0ZW1wbGF0ZSIsInRhZ05hbWUiLCJzaGFkeSIsIk1hcCIsImNsb25lIiwiY3JlYXRlRWxlbWVudCIsImNvbnRlbnQiLCJhcHBlbmRDaGlsZCIsImNsb25lTm9kZSIsInN0eWxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmcm9tIiwic3R5bGUiLCJjb3VudCIsImNoaWxkTm9kZXMiLCJpIiwicHJlcGFyZVRlbXBsYXRlIiwidG9Mb3dlckNhc2UiLCJjcmVhdGVJZCIsInBhcnRzIiwiam9pbiIsImNyZWF0ZVNpZ25hdHVyZSIsInNpZ25hdHVyZSIsImFjYyIsInBhcnQiLCJzbGljZSIsIm1hdGNoIiwiSVNfSUUiLCJyZXBsYWNlIiwiZ2V0UHJvcGVydHlOYW1lIiwic3RyaW5nIiwic3BsaXQiLCJwb3AiLCJyZXBsYWNlQ29tbWVudHMiLCJmcmFnbWVudCIsIml0ZXJhdG9yIiwiY3JlYXRlTm9kZUl0ZXJhdG9yIiwiTm9kZUZpbHRlciIsIlNIT1dfQ09NTUVOVCIsInRlc3QiLCJjcmVhdGVJbnRlcm5hbFdhbGtlciIsImNvbnRleHQiLCJjdXJyZW50Tm9kZSIsImNyZWF0ZUV4dGVybmFsV2Fsa2VyIiwiY3JlYXRlVHJlZVdhbGtlciIsIlNIT1dfRUxFTUVOVCIsIlNIT1dfVEVYVCIsImNyZWF0ZVdhbGtlciIsIndpbmRvdyIsIlNoYWR5RE9NIiwiaW5Vc2UiLCJjb250YWluZXIiLCJjb21waWxlIiwicmF3UGFydHMiLCJpbm5lckhUTUwiLCJjaGlsZHJlbiIsInN2Z1Jvb3QiLCJmaXJzdENoaWxkIiwiY29tcGlsZVdhbGtlciIsImNvbXBpbGVJbmRleCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsInRleHQiLCJyZXN1bHRzIiwiYmVmb3JlIiwibmV4dCIsImVxdWFsIiwiRUxFTUVOVF9OT0RFIiwiYXR0cmlidXRlcyIsImF0dHIiLCJ0cmltIiwibmFtZSIsInBhcnRpYWxOYW1lIiwiaW1wb3J0Tm9kZSIsInJlbmRlcldhbGtlciIsImNsb25lZFBhcnRzIiwicmVuZGVySW5kZXgiLCJjdXJyZW50UGFydCIsInNoaWZ0IiwibWFya2VycyIsImFzc2lnbiIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImluZGV4T2YiLCJjdXN0b21FbGVtZW50cyIsIkVycm9yIiwiY2hpbGRMaXN0IiwicHJldmlvdXNDaGlsZCIsImNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFJQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxPQUFPLEdBQUcsdUJBQWhCOztBQUVBLFNBQVNDLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0FBQzVCLE1BQUlDLElBQUosQ0FENEIsQ0FFNUI7O0FBQ0EsU0FBT0QsSUFBSSxLQUFLQyxJQUFJLEdBQUdILE9BQU8sQ0FBQ0ksR0FBUixDQUFZRixJQUFaLENBQVosQ0FBSixJQUFzQ0MsSUFBSSxDQUFDRSxPQUFsRCxFQUEyRDtBQUN6REgsSUFBQUEsSUFBSSxHQUFHQyxJQUFJLENBQUNFLE9BQVo7QUFDRDs7QUFFRCxTQUFPSCxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0ksY0FBVCxDQUF3QkMsTUFBeEIsRUFBZ0M7QUFDOUIsTUFBTUosSUFBSSxHQUFHSCxPQUFPLENBQUNJLEdBQVIsQ0FBWUcsTUFBWixDQUFiO0FBQ0EsTUFBTUMsU0FBUyxHQUFHTCxJQUFJLENBQUNLLFNBQXZCOztBQUVBLE1BQUlBLFNBQUosRUFBZTtBQUNiLFFBQU1ILE9BQU8sR0FBR0osY0FBYyxDQUFDRSxJQUFJLENBQUNFLE9BQU4sQ0FBOUI7QUFFQSxRQUFJSCxJQUFJLEdBQUdNLFNBQVg7QUFDQSxRQUFNQyxlQUFlLEdBQUdKLE9BQU8sQ0FB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YSxDQUFDckssV0FBcEQ7QUFDQXFLLFVBQUFBLGFBQWEsR0FBR0MsS0FBaEI7QUFDRCxTQUhEO0FBSUQsT0FORCxNQU1PO0FBQ0x6SyxRQUFBQSxNQUFNLENBQUNzRixXQUFQLENBQW1CMkIsUUFBbkI7QUFDRDtBQUNGOztBQUVEckgsSUFBQUEsSUFBSSxDQUFDbUssT0FBTCxDQUFhN0gsT0FBYixDQUFxQixpQkFBYVIsS0FBYixFQUF1QjtBQUFBO0FBQUEsVUFBckIvQixJQUFxQjtBQUFBLFVBQWY2RCxFQUFlOztBQUMxQ0EsTUFBQUEsRUFBRSxDQUFDakQsSUFBRCxFQUFPWixJQUFQLEVBQWE4RCxJQUFJLENBQUMvQixLQUFELENBQWpCLEVBQTBCOUIsSUFBMUIsQ0FBRjtBQUNELEtBRkQ7QUFHRCxHQTVERDtBQTZERCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNyZWF0ZU1hcCwgc2hhZHlDU1MsIHN0cmluZ2lmeUVsZW1lbnQsIElTX0lFLFxufSBmcm9tICcuLi91dGlscyc7XG5cbmltcG9ydCByZXNvbHZlU3R5bGVMaXN0IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHJlc29sdmVDbGFzc0xpc3QgZnJvbSAnLi9jbGFzc0xpc3QnO1xuXG5jb25zdCBkYXRhTWFwID0gY3JlYXRlTWFwKCk7XG5cbmZ1bmN0aW9uIGdldFRlbXBsYXRlRW5kKG5vZGUpIHtcbiAgbGV0IGRhdGE7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25kLWFzc2lnblxuICB3aGlsZSAobm9kZSAmJiAoZGF0YSA9IGRhdGFNYXAuZ2V0KG5vZGUpKSAmJiBkYXRhLmVuZE5vZGUpIHtcbiAgICBub2RlID0gZGF0YS5lbmROb2RlO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRlbXBsYXRlKHRhcmdldCkge1xuICBjb25zdCBkYXRhID0gZGF0YU1hcC5nZXQodGFyZ2V0KTtcbiAgY29uc3Qgc3RhcnROb2RlID0gZGF0YS5zdGFydE5vZGU7XG5cbiAgaWYgKHN0YXJ0Tm9kZSkge1xuICAgIGNvbnN0IGVuZE5vZGUgPSBnZXRUZW1wbGF0ZUVuZChkYXRhLmVuZE5vZGUpO1xuXG4gICAgbGV0IG5vZGUgPSBzdGFydE5vZGU7XG4gICAgY29uc3QgbGFzdE5leHRTaWJsaW5nID0gZW5kTm9kZS5uZXh0U2libGluZztcblxuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBjb25zdCBuZXh0U2libGluZyA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICBub2RlID0gbmV4dFNpYmxpbmcgIT09IGxhc3ROZXh0U2libGluZyAmJiBuZXh0U2libGluZztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVZhbHVlKGhvc3QsIHRhcmdldCwgdmFsdWUpIHtcbiAgY29uc3QgdHlwZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gJ2FycmF5JyA6IHR5cGVvZiB2YWx1ZTtcbiAgbGV0IGRhdGEgPSBkYXRhTWFwLmdldCh0YXJnZXQsIHt9KTtcblxuICBpZiAoZGF0YS50eXBlICE9PSB0eXBlKSB7XG4gICAgcmVtb3ZlVGVtcGxhdGUodGFyZ2V0KTtcbiAgICBkYXRhID0gZGF0YU1hcC5zZXQodGFyZ2V0LCB7IHR5cGUgfSk7XG5cbiAgICBpZiAodGFyZ2V0LnRleHRDb250ZW50ICE9PSAnJykge1xuICAgICAgdGFyZ2V0LnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgdmFsdWUoaG9zdCwgdGFyZ2V0KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgcmVzb2x2ZUFycmF5KGhvc3QsIHRhcmdldCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmICh2YWx1ZSAhPT0gZGF0YS52YWx1ZSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IHR5cGUgPT09ICdudW1iZXInIHx8IHZhbHVlID8gdmFsdWUgOiAnJztcbiAgICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlUGxhY2Vob2xkZXIodGFyZ2V0LCBwcmV2aW91c1NpYmxpbmcpIHtcbiAgY29uc3QgZGF0YSA9IGRhdGFNYXAuZ2V0KHRhcmdldCk7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGRhdGEuc3RhcnROb2RlO1xuICBjb25zdCBlbmROb2RlID0gZ2V0VGVtcGxhdGVFbmQoZGF0YS5lbmROb2RlKTtcblxuICBwcmV2aW91c1NpYmxpbmcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFyZ2V0LCBwcmV2aW91c1NpYmxpbmcubmV4dFNpYmxpbmcpO1xuXG4gIGxldCBwcmV2Tm9kZSA9IHRhcmdldDtcbiAgbGV0IG5vZGUgPSBzdGFydE5vZGU7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgY29uc3QgbmV4dE5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgIHByZXZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHByZXZOb2RlLm5leHRTaWJsaW5nKTtcbiAgICBwcmV2Tm9kZSA9IG5vZGU7XG4gICAgbm9kZSA9IG5leHROb2RlICE9PSBlbmROb2RlLm5leHRTaWJsaW5nICYmIG5leHROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVBcnJheShob3N0LCB0YXJnZXQsIHZhbHVlKSB7XG4gIGxldCBwcmV2aW91c1NpYmxpbmcgPSB0YXJnZXQ7XG4gIGNvbnN0IGxhc3RJbmRleCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGNvbnN0IGRhdGEgPSBkYXRhTWFwLmdldCh0YXJnZXQpO1xuICBjb25zdCB7IGFycmF5RW50cmllcyB9ID0gZGF0YTtcblxuICBjb25zdCBpbmRleGVkVmFsdWUgPSB2YWx1ZS5tYXAoKGl0ZW0sIGluZGV4KSA9PiBbXG4gICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGl0ZW0sICdpZCcpID8gaXRlbS5pZCA6IGluZGV4LFxuICAgIGl0ZW0sXG4gIF0pO1xuXG4gIGlmIChhcnJheUVudHJpZXMpIHtcbiAgICBjb25zdCBpZHMgPSBuZXcgU2V0KCk7XG4gICAgaW5kZXhlZFZhbHVlLmZvckVhY2goKFtpZF0pID0+IGlkcy5hZGQoaWQpKTtcblxuICAgIGFycmF5RW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgcGxhY2Vob2xkZXIgfSA9IGVudHJ5O1xuICAgICAgaWYgKCFpZHMuaGFzKGlkKSkge1xuICAgICAgICByZW1vdmVUZW1wbGF0ZShwbGFjZWhvbGRlcik7XG4gICAgICAgIHBsYWNlaG9sZGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgICBlbnRyeS5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRhdGEuYXJyYXlFbnRyaWVzID0gaW5kZXhlZFZhbHVlLnJlZHVjZSgoZW50cmllcywgW2lkLCBpdGVtXSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBlbnRyeSA9IGFycmF5RW50cmllcyAmJiBhcnJheUVudHJpZXNcbiAgICAgIC5maW5kKGVudHJ5SXRlbSA9PiBlbnRyeUl0ZW0uYXZhaWxhYmxlICYmIGVudHJ5SXRlbS5pZCA9PT0gaWQpO1xuXG4gICAgbGV0IHBsYWNlaG9sZGVyO1xuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkuYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICBwbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuXG4gICAgICBpZiAocGxhY2Vob2xkZXIucHJldmlvdXNTaWJsaW5nICE9PSBwcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgbW92ZVBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyLCBwcmV2aW91c1NpYmxpbmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgIHByZXZpb3VzU2libGluZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgcHJldmlvdXNTaWJsaW5nLm5leHRTaWJsaW5nKTtcbiAgICB9XG5cbiAgICByZXNvbHZlVmFsdWUoaG9zdCwgcGxhY2Vob2xkZXIsIGl0ZW0pO1xuXG4gICAgcHJldmlvdXNTaWJsaW5nID0gZ2V0VGVtcGxhdGVFbmQoZGF0YU1hcC5nZXQocGxhY2Vob2xkZXIpLmVuZE5vZGUgfHwgcGxhY2Vob2xkZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAwKSBkYXRhLnN0YXJ0Tm9kZSA9IHBsYWNlaG9sZGVyO1xuICAgIGlmIChpbmRleCA9PT0gbGFzdEluZGV4KSBkYXRhLmVuZE5vZGUgPSBwcmV2aW91c1NpYmxpbmc7XG5cbiAgICBlbnRyaWVzLnB1c2goeyBhdmFpbGFibGU6IHRydWUsIGlkLCBwbGFjZWhvbGRlciB9KTtcblxuICAgIHJldHVybiBlbnRyaWVzO1xuICB9LCBbXSk7XG5cbiAgaWYgKGFycmF5RW50cmllcykge1xuICAgIGFycmF5RW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgeyBhdmFpbGFibGUsIHBsYWNlaG9sZGVyIH0gPSBlbnRyeTtcbiAgICAgIGlmIChhdmFpbGFibGUpIHtcbiAgICAgICAgcmVtb3ZlVGVtcGxhdGUocGxhY2Vob2xkZXIpO1xuICAgICAgICBwbGFjZWhvbGRlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlUHJvcGVydHkoYXR0ck5hbWUsIHByb3BlcnR5TmFtZSwgaXNTVkcpIHtcbiAgaWYgKHByb3BlcnR5TmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicpIHtcbiAgICBjb25zdCBmbk1hcCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgY29uc3QgZXZlbnROYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cigyKTtcblxuICAgIHJldHVybiAoaG9zdCwgdGFyZ2V0LCB2YWx1ZSkgPT4ge1xuICAgICAgaWYgKCFmbk1hcC5oYXModGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm4gPSBmbk1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICBpZiAoZm4pIGZuKGhvc3QsIC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZm5NYXAuc2V0KHRhcmdldCwgdmFsdWUpO1xuICAgIH07XG4gIH1cblxuICBzd2l0Y2ggKGF0dHJOYW1lKSB7XG4gICAgY2FzZSAnc3R5bGUnOiByZXR1cm4gcmVzb2x2ZVN0eWxlTGlzdDtcbiAgICBjYXNlICdjbGFzcyc6IHJldHVybiByZXNvbHZlQ2xhc3NMaXN0O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKGhvc3QsIHRhcmdldCwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCFpc1NWRyAmJiAhKHRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpICYmIChwcm9wZXJ0eU5hbWUgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgIGlmICh0YXJnZXRbcHJvcGVydHlOYW1lXSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgYXR0clZhbHVlID0gdmFsdWUgPT09IHRydWUgPyAnJyA6IFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICB9XG59XG5cbmNvbnN0IFRJTUVTVEFNUCA9IERhdGUubm93KCk7XG5cbmNvbnN0IGdldFBsYWNlaG9sZGVyID0gKGlkID0gMCkgPT4gYHt7aC0ke1RJTUVTVEFNUH0tJHtpZH19fWA7XG5cbmNvbnN0IFBMQUNFSE9MREVSX1JFR0VYUF9URVhUID0gZ2V0UGxhY2Vob2xkZXIoJyhcXFxcZCspJyk7XG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwgPSBuZXcgUmVnRXhwKGBeJHtQTEFDRUhPTERFUl9SRUdFWFBfVEVYVH0kYCk7XG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWFBfQUxMID0gbmV3IFJlZ0V4cChQTEFDRUhPTERFUl9SRUdFWFBfVEVYVCwgJ2cnKTtcblxuY29uc3QgQVRUUl9QUkVGSVggPSBgLS0ke1RJTUVTVEFNUH0tLWA7XG5jb25zdCBBVFRSX1JFR0VYUCA9IG5ldyBSZWdFeHAoQVRUUl9QUkVGSVgsICdnJyk7XG5cbmNvbnN0IHByZXBhcmVkVGVtcGxhdGVzID0gbmV3IFdlYWtNYXAoKTtcblxuZnVuY3Rpb24gYXBwbHlTaGFkeUNTUyh0ZW1wbGF0ZSwgdGFnTmFtZSkge1xuICBpZiAoIXRhZ05hbWUpIHJldHVybiB0ZW1wbGF0ZTtcblxuICByZXR1cm4gc2hhZHlDU1MoKHNoYWR5KSA9PiB7XG4gICAgbGV0IG1hcCA9IHByZXBhcmVkVGVtcGxhdGVzLmdldCh0ZW1wbGF0ZSk7XG4gICAgaWYgKCFtYXApIHtcbiAgICAgIG1hcCA9IG5ldyBNYXAoKTtcbiAgICAgIHByZXBhcmVkVGVtcGxhdGVzLnNldCh0ZW1wbGF0ZSwgbWFwKTtcbiAgICB9XG5cbiAgICBsZXQgY2xvbmUgPSBtYXAuZ2V0KHRhZ05hbWUpO1xuXG4gICAgaWYgKCFjbG9uZSkge1xuICAgICAgY2xvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgY2xvbmUuY29udGVudC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG5cbiAgICAgIG1hcC5zZXQodGFnTmFtZSwgY2xvbmUpO1xuXG4gICAgICBjb25zdCBzdHlsZXMgPSBjbG9uZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJyk7XG5cbiAgICAgIEFycmF5LmZyb20oc3R5bGVzKS5mb3JFYWNoKChzdHlsZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3VudCA9IHN0eWxlLmNoaWxkTm9kZXMubGVuZ3RoICsgMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSArPSAxKSB7XG4gICAgICAgICAgc3R5bGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZ2V0UGxhY2Vob2xkZXIoKSksIHN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNoYWR5LnByZXBhcmVUZW1wbGF0ZShjbG9uZSwgdGFnTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lO1xuICB9LCB0ZW1wbGF0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJZChwYXJ0cywgaXNTVkcpIHtcbiAgcmV0dXJuIGAke2lzU1ZHID8gJ3N2ZzonIDogJyd9JHtwYXJ0cy5qb2luKGdldFBsYWNlaG9sZGVyKCkpfWA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpZ25hdHVyZShwYXJ0cykge1xuICBjb25zdCBzaWduYXR1cmUgPSBwYXJ0cy5yZWR1Y2UoKGFjYywgcGFydCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybiBwYXJ0O1xuICAgIH1cbiAgICBpZiAocGFydHMuc2xpY2UoaW5kZXgpLmpvaW4oJycpLm1hdGNoKC9cXHMqPFxcL1xccyoodGFibGV8dHJ8dGhlYWR8dGJvZHl8dGZvb3R8Y29sZ3JvdXApPi8pKSB7XG4gICAgICByZXR1cm4gYCR7YWNjfTwhLS0ke2dldFBsYWNlaG9sZGVyKGluZGV4IC0gMSl9LS0+JHtwYXJ0fWA7XG4gICAgfVxuICAgIHJldHVybiBhY2MgKyBnZXRQbGFjZWhvbGRlcihpbmRleCAtIDEpICsgcGFydDtcbiAgfSwgJycpO1xuXG4gIGlmIChJU19JRSkge1xuICAgIHJldHVybiBzaWduYXR1cmUucmVwbGFjZShcbiAgICAgIC9zdHlsZVxccyo9XFxzKihbXCJdW15cIl0rW1wiXXxbJ11bXiddK1snXXxbXlxcc1wiJzw+L10rKS9nLFxuICAgICAgbWF0Y2ggPT4gYCR7QVRUUl9QUkVGSVh9JHttYXRjaH1gLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gc2lnbmF0dXJlO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFxzKj1cXHMqWydcIl0qJC9nLCAnJykuc3BsaXQoJyAnKS5wb3AoKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUNvbW1lbnRzKGZyYWdtZW50KSB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKGZyYWdtZW50LCBOb2RlRmlsdGVyLlNIT1dfQ09NTUVOVCwgbnVsbCwgZmFsc2UpO1xuICBsZXQgbm9kZTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbmQtYXNzaWduXG4gIHdoaWxlIChub2RlID0gaXRlcmF0b3IubmV4dE5vZGUoKSkge1xuICAgIGlmIChQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwudGVzdChub2RlLnRleHRDb250ZW50KSkge1xuICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlLnRleHRDb250ZW50KSwgbm9kZSk7XG4gICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnRlcm5hbFdhbGtlcihjb250ZXh0KSB7XG4gIGxldCBub2RlO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGN1cnJlbnROb2RlKCkgeyByZXR1cm4gbm9kZTsgfSxcbiAgICBuZXh0Tm9kZSgpIHtcbiAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZSA9IGNvbnRleHQuY2hpbGROb2Rlc1swXTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZE5vZGVzWzBdO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICEhbm9kZTtcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFeHRlcm5hbFdhbGtlcihjb250ZXh0KSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKFxuICAgIGNvbnRleHQsXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgICBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCB8IE5vZGVGaWx0ZXIuU0hPV19URVhULFxuICAgIG51bGwsXG4gICAgZmFsc2UsXG4gICk7XG59XG5cbmNvbnN0IGNyZWF0ZVdhbGtlciA9IHR5cGVvZiB3aW5kb3cuU2hhZHlET00gPT09ICdvYmplY3QnICYmIHdpbmRvdy5TaGFkeURPTS5pblVzZSA/IGNyZWF0ZUludGVybmFsV2Fsa2VyIDogY3JlYXRlRXh0ZXJuYWxXYWxrZXI7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUocmF3UGFydHMsIGlzU1ZHKSB7XG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgY29uc3QgcGFydHMgPSBbXTtcblxuICBsZXQgc2lnbmF0dXJlID0gY3JlYXRlU2lnbmF0dXJlKHJhd1BhcnRzKTtcbiAgaWYgKGlzU1ZHKSBzaWduYXR1cmUgPSBgPHN2Zz4ke3NpZ25hdHVyZX08L3N2Zz5gO1xuXG4gIGlmIChJU19JRSkge1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHNpZ25hdHVyZTtcbiAgfSBlbHNlIHtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYDx0ZW1wbGF0ZT4ke3NpZ25hdHVyZX08L3RlbXBsYXRlPmA7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChjb250YWluZXIuY2hpbGRyZW5bMF0uY29udGVudCk7XG4gIH1cblxuICBpZiAoaXNTVkcpIHtcbiAgICBjb25zdCBzdmdSb290ID0gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xuICAgIHRlbXBsYXRlLmNvbnRlbnQucmVtb3ZlQ2hpbGQoc3ZnUm9vdCk7XG4gICAgQXJyYXkuZnJvbShzdmdSb290LmNoaWxkTm9kZXMpLmZvckVhY2gobm9kZSA9PiB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKG5vZGUpKTtcbiAgfVxuXG4gIHJlcGxhY2VDb21tZW50cyh0ZW1wbGF0ZS5jb250ZW50KTtcblxuICBjb25zdCBjb21waWxlV2Fsa2VyID0gY3JlYXRlV2Fsa2VyKHRlbXBsYXRlLmNvbnRlbnQpO1xuICBsZXQgY29tcGlsZUluZGV4ID0gMDtcblxuICB3aGlsZSAoY29tcGlsZVdhbGtlci5uZXh0Tm9kZSgpKSB7XG4gICAgY29uc3Qgbm9kZSA9IGNvbXBpbGVXYWxrZXIuY3VycmVudE5vZGU7XG5cbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgIGNvbnN0IHRleHQgPSBub2RlLnRleHRDb250ZW50O1xuXG4gICAgICBpZiAoIXRleHQubWF0Y2goUExBQ0VIT0xERVJfUkVHRVhQX0VRVUFMKSkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gdGV4dC5tYXRjaChQTEFDRUhPTERFUl9SRUdFWFBfQUxMKTtcbiAgICAgICAgaWYgKHJlc3VsdHMpIHtcbiAgICAgICAgICBsZXQgY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgIHJlc3VsdHNcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgW2JlZm9yZSwgbmV4dF0gPSBhY2MucG9wKCkuc3BsaXQocGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICBpZiAoYmVmb3JlKSBhY2MucHVzaChiZWZvcmUpO1xuICAgICAgICAgICAgICBhY2MucHVzaChwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSBhY2MucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIFt0ZXh0XSlcbiAgICAgICAgICAgIC5mb3JFYWNoKChwYXJ0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZS50ZXh0Q29udGVudCA9IHBhcnQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgICAuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBhcnQpLCBjdXJyZW50Tm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVxdWFsID0gbm9kZS50ZXh0Q29udGVudC5tYXRjaChQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwpO1xuICAgICAgaWYgKGVxdWFsKSB7XG4gICAgICAgIGlmICghSVNfSUUpIG5vZGUudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgcGFydHNbZXF1YWxbMV1dID0gW2NvbXBpbGVJbmRleCwgcmVzb2x2ZVZhbHVlXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICBBcnJheS5mcm9tKG5vZGUuYXR0cmlidXRlcykuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBuYW1lID0gSVNfSUUgPyBhdHRyLm5hbWUucmVwbGFjZShBVFRSX1BSRUZJWCwgJycpIDogYXR0ci5uYW1lO1xuICAgICAgICBjb25zdCBlcXVhbCA9IHZhbHVlLm1hdGNoKFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTCk7XG4gICAgICAgIGlmIChlcXVhbCkge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGdldFByb3BlcnR5TmFtZShyYXdQYXJ0c1tlcXVhbFsxXV0pO1xuICAgICAgICAgIHBhcnRzW2VxdWFsWzFdXSA9IFtjb21waWxlSW5kZXgsIHJlc29sdmVQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUsIGlzU1ZHKV07XG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCByZXN1bHRzID0gdmFsdWUubWF0Y2goUExBQ0VIT0xERVJfUkVHRVhQX0FMTCk7XG4gICAgICAgICAgaWYgKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpYWxOYW1lID0gYGF0dHJfXyR7bmFtZX1gO1xuXG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goKHBsYWNlaG9sZGVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBbLCBpZF0gPSBwbGFjZWhvbGRlci5tYXRjaChQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwpO1xuICAgICAgICAgICAgICBwYXJ0c1tpZF0gPSBbY29tcGlsZUluZGV4LCAoaG9zdCwgdGFyZ2V0LCBhdHRyVmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZGF0YU1hcC5nZXQodGFyZ2V0LCB7fSk7XG4gICAgICAgICAgICAgICAgZGF0YVtwYXJ0aWFsTmFtZV0gPSAoZGF0YVtwYXJ0aWFsTmFtZV0gfHwgdmFsdWUpLnJlcGxhY2UocGxhY2Vob2xkZXIsIGF0dHJWYWx1ZSA9PSBudWxsID8gJycgOiBhdHRyVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKChyZXN1bHRzLmxlbmd0aCA9PT0gMSkgfHwgKGluZGV4ICsgMSA9PT0gcmVzdWx0cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKG5hbWUsIGRhdGFbcGFydGlhbE5hbWVdKTtcbiAgICAgICAgICAgICAgICAgIGRhdGFbcGFydGlhbE5hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXR0ci52YWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoSVNfSUUgJiYgbmFtZSAhPT0gYXR0ci5uYW1lKSB7XG4gICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbXBpbGVJbmRleCArPSAxO1xuICB9XG5cbiAgcmV0dXJuIChob3N0LCB0YXJnZXQsIGFyZ3MpID0+IHtcbiAgICBjb25zdCBkYXRhID0gZGF0YU1hcC5nZXQodGFyZ2V0LCB7IHR5cGU6ICdmdW5jdGlvbicgfSk7XG5cbiAgICBpZiAodGVtcGxhdGUgIT09IGRhdGEudGVtcGxhdGUpIHtcbiAgICAgIGlmIChkYXRhLnRlbXBsYXRlKSByZW1vdmVUZW1wbGF0ZSh0YXJnZXQpO1xuXG4gICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUoYXBwbHlTaGFkeUNTUyh0ZW1wbGF0ZSwgaG9zdC50YWdOYW1lKS5jb250ZW50LCB0cnVlKTtcblxuICAgICAgY29uc3QgcmVuZGVyV2Fsa2VyID0gY3JlYXRlV2Fsa2VyKGZyYWdtZW50KTtcbiAgICAgIGNvbnN0IGNsb25lZFBhcnRzID0gcGFydHMuc2xpY2UoMCk7XG5cbiAgICAgIGxldCByZW5kZXJJbmRleCA9IDA7XG4gICAgICBsZXQgY3VycmVudFBhcnQgPSBjbG9uZWRQYXJ0cy5zaGlmdCgpO1xuXG4gICAgICBjb25zdCBtYXJrZXJzID0gW107XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwgeyB0ZW1wbGF0ZSwgbWFya2VycyB9KTtcblxuICAgICAgd2hpbGUgKHJlbmRlcldhbGtlci5uZXh0Tm9kZSgpKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSByZW5kZXJXYWxrZXIuY3VycmVudE5vZGU7XG5cbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgaWYgKFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTC50ZXN0KG5vZGUudGV4dENvbnRlbnQpKSB7XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgfSBlbHNlIGlmIChJU19JRSkge1xuICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IG5vZGUudGV4dENvbnRlbnQucmVwbGFjZShBVFRSX1JFR0VYUCwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgaWYgKG5vZGUudGFnTmFtZS5pbmRleE9mKCctJykgPiAtMSAmJiAhY3VzdG9tRWxlbWVudHMuZ2V0KG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFtodG1sXSBNaXNzaW5nICcke3N0cmluZ2lmeUVsZW1lbnQobm9kZSl9JyBlbGVtZW50IGRlZmluaXRpb24gaW4gJyR7c3RyaW5naWZ5RWxlbWVudChob3N0KX0nYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJ0ICYmIGN1cnJlbnRQYXJ0WzBdID09PSByZW5kZXJJbmRleCkge1xuICAgICAgICAgIG1hcmtlcnMucHVzaChbbm9kZSwgY3VycmVudFBhcnRbMV1dKTtcbiAgICAgICAgICBjdXJyZW50UGFydCA9IGNsb25lZFBhcnRzLnNoaWZ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJJbmRleCArPSAxO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZExpc3QgPSBBcnJheS5mcm9tKGZyYWdtZW50LmNoaWxkTm9kZXMpO1xuXG4gICAgICBkYXRhLnN0YXJ0Tm9kZSA9IGNoaWxkTGlzdFswXTtcbiAgICAgIGRhdGEuZW5kTm9kZSA9IGNoaWxkTGlzdFtjaGlsZExpc3QubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICh0YXJnZXQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGxldCBwcmV2aW91c0NoaWxkID0gdGFyZ2V0O1xuICAgICAgICBjaGlsZExpc3QuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hpbGQsIHByZXZpb3VzQ2hpbGQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgIHByZXZpb3VzQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRhdGEubWFya2Vycy5mb3JFYWNoKChbbm9kZSwgZm5dLCBpbmRleCkgPT4ge1xuICAgICAgZm4oaG9zdCwgbm9kZSwgYXJnc1tpbmRleF0sIGRhdGEpO1xuICAgIH0pO1xuICB9O1xufVxuIl19