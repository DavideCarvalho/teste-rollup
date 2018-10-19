function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { createMap, shadyCSS, stringifyElement, IS_IE } from '../utils';
import resolveStyleList from './style';
import resolveClassList from './classList';
var dataMap = createMap();

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
      return resolveStyleList;

    case 'class':
      return resolveClassList;

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
  return shadyCSS(function (shady) {
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

export function createId(parts, isSVG) {
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

  if (IS_IE) {
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

export function createInternalWalker(context) {
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
export function compile(rawParts, isSVG) {
  var template = document.createElement('template');
  var parts = [];
  var signature = createSignature(rawParts);
  if (isSVG) signature = "<svg>".concat(signature, "</svg>");

  if (IS_IE) {
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
        if (!IS_IE) node.textContent = '';
        parts[equal[1]] = [compileIndex, resolveValue];
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.attributes).forEach(function (attr) {
        var value = attr.value.trim();
        var name = IS_IE ? attr.name.replace(ATTR_PREFIX, '') : attr.name;
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

            if (IS_IE && name !== attr.name) {
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
          } else if (IS_IE) {
            node.textContent = node.textContent.replace(ATTR_REGEXP, '');
          }
        } else if (process.env.NODE_ENV !== 'production' && node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.indexOf('-') > -1 && !customElements.get(node.tagName.toLowerCase())) {
            throw Error("[html] Missing '".concat(stringifyElement(node), "' element definition in '").concat(stringifyElement(host), "'"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL3RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbImNyZWF0ZU1hcCIsInNoYWR5Q1NTIiwic3RyaW5naWZ5RWxlbWVudCIsIklTX0lFIiwicmVzb2x2ZVN0eWxlTGlzdCIsInJlc29sdmVDbGFzc0xpc3QiLCJkYXRhTWFwIiwiZ2V0VGVtcGxhdGVFbmQiLCJub2RlIiwiZGF0YSIsImdldCIsImVuZE5vZGUiLCJyZW1vdmVUZW1wbGF0ZSIsInRhcmdldCIsInN0YXJ0Tm9kZSIsImxhc3ROZXh0U2libGluZyIsIm5leHRTaWJsaW5nIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwicmVzb2x2ZVZhbHVlIiwiaG9zdCIsInZhbHVlIiwidHlwZSIsIkFycmF5IiwiaXNBcnJheSIsInNldCIsInRleHRDb250ZW50IiwicmVzb2x2ZUFycmF5IiwibW92ZVBsYWNlaG9sZGVyIiwicHJldmlvdXNTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwicHJldk5vZGUiLCJuZXh0Tm9kZSIsImxhc3RJbmRleCIsImxlbmd0aCIsImFycmF5RW50cmllcyIsImluZGV4ZWRWYWx1ZSIsIm1hcCIsIml0ZW0iLCJpbmRleCIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImlkIiwiaWRzIiwiU2V0IiwiZm9yRWFjaCIsImFkZCIsImVudHJ5IiwicGxhY2Vob2xkZXIiLCJoYXMiLCJhdmFpbGFibGUiLCJyZWR1Y2UiLCJlbnRyaWVzIiwiZmluZCIsImVudHJ5SXRlbSIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJwdXNoIiwicmVzb2x2ZVByb3BlcnR5IiwiYXR0ck5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJpc1NWRyIsInN1YnN0ciIsImZuTWFwIiwiV2Vha01hcCIsImV2ZW50TmFtZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJmbiIsImFyZ3MiLCJTVkdFbGVtZW50IiwidW5kZWZpbmVkIiwicmVtb3ZlQXR0cmlidXRlIiwiYXR0clZhbHVlIiwiU3RyaW5nIiwiZ2V0QXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiVElNRVNUQU1QIiwiRGF0ZSIsIm5vdyIsImdldFBsYWNlaG9sZGVyIiwiUExBQ0VIT0xERVJfUkVHRVhQX1RFWFQiLCJQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwiLCJSZWdFeHAiLCJQTEFDRUhPTERFUl9SRUdFWFBfQUxMIiwiQVRUUl9QUkVGSVgiLCJBVFRSX1JFR0VYUCIsInByZXBhcmVkVGVtcGxhdGVzIiwiYXBwbHlTaGFkeUNTUyIsInRlbXBsYXRlIiwidGFnTmFtZSIsInNoYWR5IiwiTWFwIiwiY2xvbmUiLCJjcmVhdGVFbGVtZW50IiwiY29udGVudCIsImFwcGVuZENoaWxkIiwiY2xvbmVOb2RlIiwic3R5bGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImZyb20iLCJzdHlsZSIsImNvdW50IiwiY2hpbGROb2RlcyIsImkiLCJwcmVwYXJlVGVtcGxhdGUiLCJ0b0xvd2VyQ2FzZSIsImNyZWF0ZUlkIiwicGFydHMiLCJqb2luIiwiY3JlYXRlU2lnbmF0dXJlIiwic2lnbmF0dXJlIiwiYWNjIiwicGFydCIsInNsaWNlIiwibWF0Y2giLCJyZXBsYWNlIiwiZ2V0UHJvcGVydHlOYW1lIiwic3RyaW5nIiwic3BsaXQiLCJwb3AiLCJyZXBsYWNlQ29tbWVudHMiLCJmcmFnbWVudCIsIml0ZXJhdG9yIiwiY3JlYXRlTm9kZUl0ZXJhdG9yIiwiTm9kZUZpbHRlciIsIlNIT1dfQ09NTUVOVCIsInRlc3QiLCJjcmVhdGVJbnRlcm5hbFdhbGtlciIsImNvbnRleHQiLCJjdXJyZW50Tm9kZSIsImNyZWF0ZUV4dGVybmFsV2Fsa2VyIiwiY3JlYXRlVHJlZVdhbGtlciIsIlNIT1dfRUxFTUVOVCIsIlNIT1dfVEVYVCIsImNyZWF0ZVdhbGtlciIsIndpbmRvdyIsIlNoYWR5RE9NIiwiaW5Vc2UiLCJjb250YWluZXIiLCJjb21waWxlIiwicmF3UGFydHMiLCJpbm5lckhUTUwiLCJjaGlsZHJlbiIsInN2Z1Jvb3QiLCJmaXJzdENoaWxkIiwiY29tcGlsZVdhbGtlciIsImNvbXBpbGVJbmRleCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsInRleHQiLCJyZXN1bHRzIiwiYmVmb3JlIiwibmV4dCIsImVxdWFsIiwiRUxFTUVOVF9OT0RFIiwiYXR0cmlidXRlcyIsImF0dHIiLCJ0cmltIiwibmFtZSIsInBhcnRpYWxOYW1lIiwiaW1wb3J0Tm9kZSIsInJlbmRlcldhbGtlciIsImNsb25lZFBhcnRzIiwicmVuZGVySW5kZXgiLCJjdXJyZW50UGFydCIsInNoaWZ0IiwibWFya2VycyIsImFzc2lnbiIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImluZGV4T2YiLCJjdXN0b21FbGVtZW50cyIsIkVycm9yIiwiY2hpbGRMaXN0IiwicHJldmlvdXNDaGlsZCIsImNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsU0FDRUEsU0FERixFQUNhQyxRQURiLEVBQ3VCQyxnQkFEdkIsRUFDeUNDLEtBRHpDLFFBRU8sVUFGUDtBQUlBLE9BQU9DLGdCQUFQLE1BQTZCLFNBQTdCO0FBQ0EsT0FBT0MsZ0JBQVAsTUFBNkIsYUFBN0I7QUFFQSxJQUFNQyxPQUFPLEdBQUdOLFNBQVMsRUFBekI7O0FBRUEsU0FBU08sY0FBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDNUIsTUFBSUMsSUFBSixDQUQ0QixDQUU1Qjs7QUFDQSxTQUFPRCxJQUFJLEtBQUtDLElBQUksR0FBR0gsT0FBTyxDQUFDSSxHQUFSLENBQVlGLElBQVosQ0FBWixDQUFKLElBQXNDQyxJQUFJLENBQUNFLE9BQWxELEVBQTJEO0FBQ3pESCxJQUFBQSxJQUFJLEdBQUdDLElBQUksQ0FBQ0UsT0FBWjtBQUNEOztBQUVELFNBQU9ILElBQVA7QUFDRDs7QUFFRCxTQUFTSSxjQUFULENBQXdCQyxNQUF4QixFQUFnQztBQUM5QixNQUFNSixJQUFJLEdBQUdILE9BQU8sQ0FBQ0ksR0FBUixDQUFZRyxNQUFaLENBQWI7QUFDQSxNQUFNQyxTQUFTLEdBQUdMLElBQUksQ0FBQ0ss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LEtBQW9CQyxJQUFJLENBQUNDLFNBQTdCLEVBQXdDO0FBQ3RDLFlBQUkyQixhQUFhLEdBQUdySyxNQUFwQjtBQUNBb0ssUUFBQUEsU0FBUyxDQUFDbEksT0FBVixDQUFrQixVQUFDb0ksS0FBRCxFQUFXO0FBQzNCdEssVUFBQUEsTUFBTSxDQUFDSSxVQUFQLENBQWtCYSxZQUFsQixDQUErQnFKLEtBQS9CLEVBQXNDRCxhQUFhLENBQUNsSyxXQUFwRDtBQUNBa0ssVUFBQUEsYUFBYSxHQUFHQyxLQUFoQjtBQUNELFNBSEQ7QUFJRCxPQU5ELE1BTU87QUFDTHRLLFFBQUFBLE1BQU0sQ0FBQ29GLFdBQVAsQ0FBbUIwQixRQUFuQjtBQUNEO0FBQ0Y7O0FBRURsSCxJQUFBQSxJQUFJLENBQUNnSyxPQUFMLENBQWExSCxPQUFiLENBQXFCLGlCQUFhUixLQUFiLEVBQXVCO0FBQUE7QUFBQSxVQUFyQi9CLElBQXFCO0FBQUEsVUFBZjZELEVBQWU7O0FBQzFDQSxNQUFBQSxFQUFFLENBQUNqRCxJQUFELEVBQU9aLElBQVAsRUFBYThELElBQUksQ0FBQy9CLEtBQUQsQ0FBakIsRUFBMEI5QixJQUExQixDQUFGO0FBQ0QsS0FGRDtBQUdELEdBNUREO0FBNkREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgY3JlYXRlTWFwLCBzaGFkeUNTUywgc3RyaW5naWZ5RWxlbWVudCwgSVNfSUUsXG59IGZyb20gJy4uL3V0aWxzJztcblxuaW1wb3J0IHJlc29sdmVTdHlsZUxpc3QgZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgcmVzb2x2ZUNsYXNzTGlzdCBmcm9tICcuL2NsYXNzTGlzdCc7XG5cbmNvbnN0IGRhdGFNYXAgPSBjcmVhdGVNYXAoKTtcblxuZnVuY3Rpb24gZ2V0VGVtcGxhdGVFbmQobm9kZSkge1xuICBsZXQgZGF0YTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbmQtYXNzaWduXG4gIHdoaWxlIChub2RlICYmIChkYXRhID0gZGF0YU1hcC5nZXQobm9kZSkpICYmIGRhdGEuZW5kTm9kZSkge1xuICAgIG5vZGUgPSBkYXRhLmVuZE5vZGU7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGVtcGxhdGUodGFyZ2V0KSB7XG4gIGNvbnN0IGRhdGEgPSBkYXRhTWFwLmdldCh0YXJnZXQpO1xuICBjb25zdCBzdGFydE5vZGUgPSBkYXRhLnN0YXJ0Tm9kZTtcblxuICBpZiAoc3RhcnROb2RlKSB7XG4gICAgY29uc3QgZW5kTm9kZSA9IGdldFRlbXBsYXRlRW5kKGRhdGEuZW5kTm9kZSk7XG5cbiAgICBsZXQgbm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICBjb25zdCBsYXN0TmV4dFNpYmxpbmcgPSBlbmROb2RlLm5leHRTaWJsaW5nO1xuXG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGNvbnN0IG5leHRTaWJsaW5nID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIG5vZGUgPSBuZXh0U2libGluZyAhPT0gbGFzdE5leHRTaWJsaW5nICYmIG5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlVmFsdWUoaG9zdCwgdGFyZ2V0LCB2YWx1ZSkge1xuICBjb25zdCB0eXBlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyAnYXJyYXknIDogdHlwZW9mIHZhbHVlO1xuICBsZXQgZGF0YSA9IGRhdGFNYXAuZ2V0KHRhcmdldCwge30pO1xuXG4gIGlmIChkYXRhLnR5cGUgIT09IHR5cGUpIHtcbiAgICByZW1vdmVUZW1wbGF0ZSh0YXJnZXQpO1xuICAgIGRhdGEgPSBkYXRhTWFwLnNldCh0YXJnZXQsIHsgdHlwZSB9KTtcblxuICAgIGlmICh0YXJnZXQudGV4dENvbnRlbnQgIT09ICcnKSB7XG4gICAgICB0YXJnZXQudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICB2YWx1ZShob3N0LCB0YXJnZXQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICByZXNvbHZlQXJyYXkoaG9zdCwgdGFyZ2V0LCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHZhbHVlICE9PSBkYXRhLnZhbHVlKSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGFyZ2V0LnRleHRDb250ZW50ID0gdHlwZSA9PT0gJ251bWJlcicgfHwgdmFsdWUgPyB2YWx1ZSA6ICcnO1xuICAgICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVQbGFjZWhvbGRlcih0YXJnZXQsIHByZXZpb3VzU2libGluZykge1xuICBjb25zdCBkYXRhID0gZGF0YU1hcC5nZXQodGFyZ2V0KTtcbiAgY29uc3Qgc3RhcnROb2RlID0gZGF0YS5zdGFydE5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBnZXRUZW1wbGF0ZUVuZChkYXRhLmVuZE5vZGUpO1xuXG4gIHByZXZpb3VzU2libGluZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YXJnZXQsIHByZXZpb3VzU2libGluZy5uZXh0U2libGluZyk7XG5cbiAgbGV0IHByZXZOb2RlID0gdGFyZ2V0O1xuICBsZXQgbm9kZSA9IHN0YXJ0Tm9kZTtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjb25zdCBuZXh0Tm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgcHJldk5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgcHJldk5vZGUubmV4dFNpYmxpbmcpO1xuICAgIHByZXZOb2RlID0gbm9kZTtcbiAgICBub2RlID0gbmV4dE5vZGUgIT09IGVuZE5vZGUubmV4dFNpYmxpbmcgJiYgbmV4dE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFycmF5KGhvc3QsIHRhcmdldCwgdmFsdWUpIHtcbiAgbGV0IHByZXZpb3VzU2libGluZyA9IHRhcmdldDtcbiAgY29uc3QgbGFzdEluZGV4ID0gdmFsdWUubGVuZ3RoIC0gMTtcbiAgY29uc3QgZGF0YSA9IGRhdGFNYXAuZ2V0KHRhcmdldCk7XG4gIGNvbnN0IHsgYXJyYXlFbnRyaWVzIH0gPSBkYXRhO1xuXG4gIGNvbnN0IGluZGV4ZWRWYWx1ZSA9IHZhbHVlLm1hcCgoaXRlbSwgaW5kZXgpID0+IFtcbiAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaXRlbSwgJ2lkJykgPyBpdGVtLmlkIDogaW5kZXgsXG4gICAgaXRlbSxcbiAgXSk7XG5cbiAgaWYgKGFycmF5RW50cmllcykge1xuICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgICBpbmRleGVkVmFsdWUuZm9yRWFjaCgoW2lkXSkgPT4gaWRzLmFkZChpZCkpO1xuXG4gICAgYXJyYXlFbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBwbGFjZWhvbGRlciB9ID0gZW50cnk7XG4gICAgICBpZiAoIWlkcy5oYXMoaWQpKSB7XG4gICAgICAgIHJlbW92ZVRlbXBsYXRlKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgcGxhY2Vob2xkZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgICAgIGVudHJ5LmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGF0YS5hcnJheUVudHJpZXMgPSBpbmRleGVkVmFsdWUucmVkdWNlKChlbnRyaWVzLCBbaWQsIGl0ZW1dLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGVudHJ5ID0gYXJyYXlFbnRyaWVzICYmIGFycmF5RW50cmllc1xuICAgICAgLmZpbmQoZW50cnlJdGVtID0+IGVudHJ5SXRlbS5hdmFpbGFibGUgJiYgZW50cnlJdGVtLmlkID09PSBpZCk7XG5cbiAgICBsZXQgcGxhY2Vob2xkZXI7XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgIHBsYWNlaG9sZGVyID0gZW50cnkucGxhY2Vob2xkZXI7XG5cbiAgICAgIGlmIChwbGFjZWhvbGRlci5wcmV2aW91c1NpYmxpbmcgIT09IHByZXZpb3VzU2libGluZykge1xuICAgICAgICBtb3ZlUGxhY2Vob2xkZXIocGxhY2Vob2xkZXIsIHByZXZpb3VzU2libGluZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgcHJldmlvdXNTaWJsaW5nLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBwcmV2aW91c1NpYmxpbmcubmV4dFNpYmxpbmcpO1xuICAgIH1cblxuICAgIHJlc29sdmVWYWx1ZShob3N0LCBwbGFjZWhvbGRlciwgaXRlbSk7XG5cbiAgICBwcmV2aW91c1NpYmxpbmcgPSBnZXRUZW1wbGF0ZUVuZChkYXRhTWFwLmdldChwbGFjZWhvbGRlcikuZW5kTm9kZSB8fCBwbGFjZWhvbGRlcik7XG5cbiAgICBpZiAoaW5kZXggPT09IDApIGRhdGEuc3RhcnROb2RlID0gcGxhY2Vob2xkZXI7XG4gICAgaWYgKGluZGV4ID09PSBsYXN0SW5kZXgpIGRhdGEuZW5kTm9kZSA9IHByZXZpb3VzU2libGluZztcblxuICAgIGVudHJpZXMucHVzaCh7IGF2YWlsYWJsZTogdHJ1ZSwgaWQsIHBsYWNlaG9sZGVyIH0pO1xuXG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sIFtdKTtcblxuICBpZiAoYXJyYXlFbnRyaWVzKSB7XG4gICAgYXJyYXlFbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCB7IGF2YWlsYWJsZSwgcGxhY2Vob2xkZXIgfSA9IGVudHJ5O1xuICAgICAgaWYgKGF2YWlsYWJsZSkge1xuICAgICAgICByZW1vdmVUZW1wbGF0ZShwbGFjZWhvbGRlcik7XG4gICAgICAgIHBsYWNlaG9sZGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVQcm9wZXJ0eShhdHRyTmFtZSwgcHJvcGVydHlOYW1lLCBpc1NWRykge1xuICBpZiAocHJvcGVydHlOYW1lLnN1YnN0cigwLCAyKSA9PT0gJ29uJykge1xuICAgIGNvbnN0IGZuTWFwID0gbmV3IFdlYWtNYXAoKTtcbiAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyKDIpO1xuXG4gICAgcmV0dXJuIChob3N0LCB0YXJnZXQsIHZhbHVlKSA9PiB7XG4gICAgICBpZiAoIWZuTWFwLmhhcyh0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBjb25zdCBmbiA9IGZuTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgIGlmIChmbikgZm4oaG9zdCwgLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmbk1hcC5zZXQodGFyZ2V0LCB2YWx1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIHN3aXRjaCAoYXR0ck5hbWUpIHtcbiAgICBjYXNlICdzdHlsZSc6IHJldHVybiByZXNvbHZlU3R5bGVMaXN0O1xuICAgIGNhc2UgJ2NsYXNzJzogcmV0dXJuIHJlc29sdmVDbGFzc0xpc3Q7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAoaG9zdCwgdGFyZ2V0LCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIWlzU1ZHICYmICEodGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgJiYgKHByb3BlcnR5TmFtZSBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtwcm9wZXJ0eU5hbWVdICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBhdHRyVmFsdWUgPSB2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyTmFtZSkgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gIH1cbn1cblxuY29uc3QgVElNRVNUQU1QID0gRGF0ZS5ub3coKTtcblxuY29uc3QgZ2V0UGxhY2Vob2xkZXIgPSAoaWQgPSAwKSA9PiBge3toLSR7VElNRVNUQU1QfS0ke2lkfX19YDtcblxuY29uc3QgUExBQ0VIT0xERVJfUkVHRVhQX1RFWFQgPSBnZXRQbGFjZWhvbGRlcignKFxcXFxkKyknKTtcbmNvbnN0IFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTCA9IG5ldyBSZWdFeHAoYF4ke1BMQUNFSE9MREVSX1JFR0VYUF9URVhUfSRgKTtcbmNvbnN0IFBMQUNFSE9MREVSX1JFR0VYUF9BTEwgPSBuZXcgUmVnRXhwKFBMQUNFSE9MREVSX1JFR0VYUF9URVhULCAnZycpO1xuXG5jb25zdCBBVFRSX1BSRUZJWCA9IGAtLSR7VElNRVNUQU1QfS0tYDtcbmNvbnN0IEFUVFJfUkVHRVhQID0gbmV3IFJlZ0V4cChBVFRSX1BSRUZJWCwgJ2cnKTtcblxuY29uc3QgcHJlcGFyZWRUZW1wbGF0ZXMgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBhcHBseVNoYWR5Q1NTKHRlbXBsYXRlLCB0YWdOYW1lKSB7XG4gIGlmICghdGFnTmFtZSkgcmV0dXJuIHRlbXBsYXRlO1xuXG4gIHJldHVybiBzaGFkeUNTUygoc2hhZHkpID0+IHtcbiAgICBsZXQgbWFwID0gcHJlcGFyZWRUZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlKTtcbiAgICBpZiAoIW1hcCkge1xuICAgICAgbWFwID0gbmV3IE1hcCgpO1xuICAgICAgcHJlcGFyZWRUZW1wbGF0ZXMuc2V0KHRlbXBsYXRlLCBtYXApO1xuICAgIH1cblxuICAgIGxldCBjbG9uZSA9IG1hcC5nZXQodGFnTmFtZSk7XG5cbiAgICBpZiAoIWNsb25lKSB7XG4gICAgICBjbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICBjbG9uZS5jb250ZW50LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcblxuICAgICAgbWFwLnNldCh0YWdOYW1lLCBjbG9uZSk7XG5cbiAgICAgIGNvbnN0IHN0eWxlcyA9IGNsb25lLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKTtcblxuICAgICAgQXJyYXkuZnJvbShzdHlsZXMpLmZvckVhY2goKHN0eWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gc3R5bGUuY2hpbGROb2Rlcy5sZW5ndGggKyAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpICs9IDEpIHtcbiAgICAgICAgICBzdHlsZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShnZXRQbGFjZWhvbGRlcigpKSwgc3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2hhZHkucHJlcGFyZVRlbXBsYXRlKGNsb25lLCB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmU7XG4gIH0sIHRlbXBsYXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlkKHBhcnRzLCBpc1NWRykge1xuICByZXR1cm4gYCR7aXNTVkcgPyAnc3ZnOicgOiAnJ30ke3BhcnRzLmpvaW4oZ2V0UGxhY2Vob2xkZXIoKSl9YDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2lnbmF0dXJlKHBhcnRzKSB7XG4gIGNvbnN0IHNpZ25hdHVyZSA9IHBhcnRzLnJlZHVjZSgoYWNjLCBwYXJ0LCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgfVxuICAgIGlmIChwYXJ0cy5zbGljZShpbmRleCkuam9pbignJykubWF0Y2goL1xccyo8XFwvXFxzKih0YWJsZXx0cnx0aGVhZHx0Ym9keXx0Zm9vdHxjb2xncm91cCk+LykpIHtcbiAgICAgIHJldHVybiBgJHthY2N9PCEtLSR7Z2V0UGxhY2Vob2xkZXIoaW5kZXggLSAxKX0tLT4ke3BhcnR9YDtcbiAgICB9XG4gICAgcmV0dXJuIGFjYyArIGdldFBsYWNlaG9sZGVyKGluZGV4IC0gMSkgKyBwYXJ0O1xuICB9LCAnJyk7XG5cbiAgaWYgKElTX0lFKSB7XG4gICAgcmV0dXJuIHNpZ25hdHVyZS5yZXBsYWNlKFxuICAgICAgL3N0eWxlXFxzKj1cXHMqKFtcIl1bXlwiXStbXCJdfFsnXVteJ10rWyddfFteXFxzXCInPD4vXSspL2csXG4gICAgICBtYXRjaCA9PiBgJHtBVFRSX1BSRUZJWH0ke21hdGNofWAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBzaWduYXR1cmU7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5TmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXHMqPVxccypbJ1wiXSokL2csICcnKS5zcGxpdCgnICcpLnBvcCgpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlQ29tbWVudHMoZnJhZ21lbnQpIHtcbiAgY29uc3QgaXRlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3IoZnJhZ21lbnQsIE5vZGVGaWx0ZXIuU0hPV19DT01NRU5ULCBudWxsLCBmYWxzZSk7XG4gIGxldCBub2RlO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgd2hpbGUgKG5vZGUgPSBpdGVyYXRvci5uZXh0Tm9kZSgpKSB7XG4gICAgaWYgKFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTC50ZXN0KG5vZGUudGV4dENvbnRlbnQpKSB7XG4gICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUudGV4dENvbnRlbnQpLCBub2RlKTtcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUludGVybmFsV2Fsa2VyKGNvbnRleHQpIHtcbiAgbGV0IG5vZGU7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgY3VycmVudE5vZGUoKSB7IHJldHVybiBub2RlOyB9LFxuICAgIG5leHROb2RlKCkge1xuICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub2RlID0gY29udGV4dC5jaGlsZE5vZGVzWzBdO1xuICAgICAgfSBlbHNlIGlmIChub2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmNoaWxkTm9kZXNbMF07XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gISFub2RlO1xuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV4dGVybmFsV2Fsa2VyKGNvbnRleHQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgY29udGV4dCxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UIHwgTm9kZUZpbHRlci5TSE9XX1RFWFQsXG4gICAgbnVsbCxcbiAgICBmYWxzZSxcbiAgKTtcbn1cblxuY29uc3QgY3JlYXRlV2Fsa2VyID0gdHlwZW9mIHdpbmRvdy5TaGFkeURPTSA9PT0gJ29iamVjdCcgJiYgd2luZG93LlNoYWR5RE9NLmluVXNlID8gY3JlYXRlSW50ZXJuYWxXYWxrZXIgOiBjcmVhdGVFeHRlcm5hbFdhbGtlcjtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShyYXdQYXJ0cywgaXNTVkcpIHtcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICBjb25zdCBwYXJ0cyA9IFtdO1xuXG4gIGxldCBzaWduYXR1cmUgPSBjcmVhdGVTaWduYXR1cmUocmF3UGFydHMpO1xuICBpZiAoaXNTVkcpIHNpZ25hdHVyZSA9IGA8c3ZnPiR7c2lnbmF0dXJlfTwvc3ZnPmA7XG5cbiAgaWYgKElTX0lFKSB7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc2lnbmF0dXJlO1xuICB9IGVsc2Uge1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBgPHRlbXBsYXRlPiR7c2lnbmF0dXJlfTwvdGVtcGxhdGU+YDtcbiAgICB0ZW1wbGF0ZS5jb250ZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lci5jaGlsZHJlblswXS5jb250ZW50KTtcbiAgfVxuXG4gIGlmIChpc1NWRykge1xuICAgIGNvbnN0IHN2Z1Jvb3QgPSB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XG4gICAgdGVtcGxhdGUuY29udGVudC5yZW1vdmVDaGlsZChzdmdSb290KTtcbiAgICBBcnJheS5mcm9tKHN2Z1Jvb3QuY2hpbGROb2RlcykuZm9yRWFjaChub2RlID0+IHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQobm9kZSkpO1xuICB9XG5cbiAgcmVwbGFjZUNvbW1lbnRzKHRlbXBsYXRlLmNvbnRlbnQpO1xuXG4gIGNvbnN0IGNvbXBpbGVXYWxrZXIgPSBjcmVhdGVXYWxrZXIodGVtcGxhdGUuY29udGVudCk7XG4gIGxldCBjb21waWxlSW5kZXggPSAwO1xuXG4gIHdoaWxlIChjb21waWxlV2Fsa2VyLm5leHROb2RlKCkpIHtcbiAgICBjb25zdCBub2RlID0gY29tcGlsZVdhbGtlci5jdXJyZW50Tm9kZTtcblxuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgY29uc3QgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XG5cbiAgICAgIGlmICghdGV4dC5tYXRjaChQTEFDRUhPTERFUl9SRUdFWFBfRVFVQUwpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSB0ZXh0Lm1hdGNoKFBMQUNFSE9MREVSX1JFR0VYUF9BTEwpO1xuICAgICAgICBpZiAocmVzdWx0cykge1xuICAgICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgcmVzdWx0c1xuICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBbYmVmb3JlLCBuZXh0XSA9IGFjYy5wb3AoKS5zcGxpdChwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgIGlmIChiZWZvcmUpIGFjYy5wdXNoKGJlZm9yZSk7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIGFjYy5wdXNoKG5leHQpO1xuICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwgW3RleHRdKVxuICAgICAgICAgICAgLmZvckVhY2goKHBhcnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlLnRleHRDb250ZW50ID0gcGFydDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgIC5pbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFydCksIGN1cnJlbnROb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZXF1YWwgPSBub2RlLnRleHRDb250ZW50Lm1hdGNoKFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTCk7XG4gICAgICBpZiAoZXF1YWwpIHtcbiAgICAgICAgaWYgKCFJU19JRSkgbm9kZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBwYXJ0c1tlcXVhbFsxXV0gPSBbY29tcGlsZUluZGV4LCByZXNvbHZlVmFsdWVdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgIEFycmF5LmZyb20obm9kZS5hdHRyaWJ1dGVzKS5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0ci52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBJU19JRSA/IGF0dHIubmFtZS5yZXBsYWNlKEFUVFJfUFJFRklYLCAnJykgOiBhdHRyLm5hbWU7XG4gICAgICAgIGNvbnN0IGVxdWFsID0gdmFsdWUubWF0Y2goUExBQ0VIT0xERVJfUkVHRVhQX0VRVUFMKTtcbiAgICAgICAgaWYgKGVxdWFsKSB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gZ2V0UHJvcGVydHlOYW1lKHJhd1BhcnRzW2VxdWFsWzFdXSk7XG4gICAgICAgICAgcGFydHNbZXF1YWxbMV1dID0gW2NvbXBpbGVJbmRleCwgcmVzb2x2ZVByb3BlcnR5KG5hbWUsIHByb3BlcnR5TmFtZSwgaXNTVkcpXTtcbiAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSB2YWx1ZS5tYXRjaChQTEFDRUhPTERFUl9SRUdFWFBfQUxMKTtcbiAgICAgICAgICBpZiAocmVzdWx0cykge1xuICAgICAgICAgICAgY29uc3QgcGFydGlhbE5hbWUgPSBgYXR0cl9fJHtuYW1lfWA7XG5cbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocGxhY2Vob2xkZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IFssIGlkXSA9IHBsYWNlaG9sZGVyLm1hdGNoKFBMQUNFSE9MREVSX1JFR0VYUF9FUVVBTCk7XG4gICAgICAgICAgICAgIHBhcnRzW2lkXSA9IFtjb21waWxlSW5kZXgsIChob3N0LCB0YXJnZXQsIGF0dHJWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBkYXRhTWFwLmdldCh0YXJnZXQsIHt9KTtcbiAgICAgICAgICAgICAgICBkYXRhW3BhcnRpYWxOYW1lXSA9IChkYXRhW3BhcnRpYWxOYW1lXSB8fCB2YWx1ZSkucmVwbGFjZShwbGFjZWhvbGRlciwgYXR0clZhbHVlID09IG51bGwgPyAnJyA6IGF0dHJWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdHMubGVuZ3RoID09PSAxKSB8fCAoaW5kZXggKyAxID09PSByZXN1bHRzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgZGF0YVtwYXJ0aWFsTmFtZV0pO1xuICAgICAgICAgICAgICAgICAgZGF0YVtwYXJ0aWFsTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhdHRyLnZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgIGlmIChJU19JRSAmJiBuYW1lICE9PSBhdHRyLm5hbWUpIHtcbiAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tcGlsZUluZGV4ICs9IDE7XG4gIH1cblxuICByZXR1cm4gKGhvc3QsIHRhcmdldCwgYXJncykgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBkYXRhTWFwLmdldCh0YXJnZXQsIHsgdHlwZTogJ2Z1bmN0aW9uJyB9KTtcblxuICAgIGlmICh0ZW1wbGF0ZSAhPT0gZGF0YS50ZW1wbGF0ZSkge1xuICAgICAgaWYgKGRhdGEudGVtcGxhdGUpIHJlbW92ZVRlbXBsYXRlKHRhcmdldCk7XG5cbiAgICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShhcHBseVNoYWR5Q1NTKHRlbXBsYXRlLCBob3N0LnRhZ05hbWUpLmNvbnRlbnQsIHRydWUpO1xuXG4gICAgICBjb25zdCByZW5kZXJXYWxrZXIgPSBjcmVhdGVXYWxrZXIoZnJhZ21lbnQpO1xuICAgICAgY29uc3QgY2xvbmVkUGFydHMgPSBwYXJ0cy5zbGljZSgwKTtcblxuICAgICAgbGV0IHJlbmRlckluZGV4ID0gMDtcbiAgICAgIGxldCBjdXJyZW50UGFydCA9IGNsb25lZFBhcnRzLnNoaWZ0KCk7XG5cbiAgICAgIGNvbnN0IG1hcmtlcnMgPSBbXTtcblxuICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCB7IHRlbXBsYXRlLCBtYXJrZXJzIH0pO1xuXG4gICAgICB3aGlsZSAocmVuZGVyV2Fsa2VyLm5leHROb2RlKCkpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlcldhbGtlci5jdXJyZW50Tm9kZTtcblxuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICBpZiAoUExBQ0VIT0xERVJfUkVHRVhQX0VRVUFMLnRlc3Qobm9kZS50ZXh0Q29udGVudCkpIHtcbiAgICAgICAgICAgIG5vZGUudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICB9IGVsc2UgaWYgKElTX0lFKSB7XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKEFUVFJfUkVHRVhQLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAobm9kZS50YWdOYW1lLmluZGV4T2YoJy0nKSA+IC0xICYmICFjdXN0b21FbGVtZW50cy5nZXQobm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgW2h0bWxdIE1pc3NpbmcgJyR7c3RyaW5naWZ5RWxlbWVudChub2RlKX0nIGVsZW1lbnQgZGVmaW5pdGlvbiBpbiAnJHtzdHJpbmdpZnlFbGVtZW50KGhvc3QpfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoY3VycmVudFBhcnQgJiYgY3VycmVudFBhcnRbMF0gPT09IHJlbmRlckluZGV4KSB7XG4gICAgICAgICAgbWFya2Vycy5wdXNoKFtub2RlLCBjdXJyZW50UGFydFsxXV0pO1xuICAgICAgICAgIGN1cnJlbnRQYXJ0ID0gY2xvbmVkUGFydHMuc2hpZnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlckluZGV4ICs9IDE7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTGlzdCA9IEFycmF5LmZyb20oZnJhZ21lbnQuY2hpbGROb2Rlcyk7XG5cbiAgICAgIGRhdGEuc3RhcnROb2RlID0gY2hpbGRMaXN0WzBdO1xuICAgICAgZGF0YS5lbmROb2RlID0gY2hpbGRMaXN0W2NoaWxkTGlzdC5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKHRhcmdldC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzQ2hpbGQgPSB0YXJnZXQ7XG4gICAgICAgIGNoaWxkTGlzdC5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGlsZCwgcHJldmlvdXNDaGlsZC5uZXh0U2libGluZyk7XG4gICAgICAgICAgcHJldmlvdXNDaGlsZCA9IGNoaWxkO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGF0YS5tYXJrZXJzLmZvckVhY2goKFtub2RlLCBmbl0sIGluZGV4KSA9PiB7XG4gICAgICBmbihob3N0LCBub2RlLCBhcmdzW2luZGV4XSwgZGF0YSk7XG4gICAgfSk7XG4gIH07XG59XG4iXX0=