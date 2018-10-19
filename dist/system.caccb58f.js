// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"dist/system.js":[function(require,module,exports) {
var global = arguments[3];
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
* SystemJS 2.0.2
*/
(function () {
  var hasSelf = typeof self !== 'undefined';
  var envGlobal = hasSelf ? self : global;
  var baseUrl;

  if (typeof location !== 'undefined') {
    baseUrl = location.href.split('#')[0].split('?')[0];
    var lastSepIndex = baseUrl.lastIndexOf('/');
    if (lastSepIndex !== -1) baseUrl = baseUrl.slice(0, lastSepIndex + 1);
  }

  var backslashRegEx = /\\/g;

  function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
    if (relUrl.indexOf('\\') !== -1) relUrl = relUrl.replace(backslashRegEx, '/'); // protocol-relative

    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    } // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) || relUrl.length === 1 && (relUrl += '/')) || relUrl[0] === '/') {
        var parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1); // Disabled, but these cases will give inconsistent results for deep backtracking
        //if (parentUrl[parentProtocol.length] !== '/')
        //  throw new Error('Cannot resolve');
        // read pathname from parent URL
        // pathname taken to be part after leading "/"

        var pathname;

        if (parentUrl[parentProtocol.length + 1] === '/') {
          // resolving to a :// so we need to read out the auth and host
          if (parentProtocol !== 'file:') {
            pathname = parentUrl.slice(parentProtocol.length + 2);
            pathname = pathname.slice(pathname.indexOf('/') + 1);
          } else {
            pathname = parentUrl.slice(8);
          }
        } else {
          // resolving to :/ so pathname is the /... part
          pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
        }

        if (relUrl[0] === '/') return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl; // join together and split for removal of .. and . segments
        // looping the string instead of anything fancy for perf reasons
        // '../../../../../z' resolved to 'x/y' is just 'z'

        var segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;
        var output = [];
        var segmentIndex = -1;

        for (var i = 0; i < segmented.length; i++) {
          // busy reading a segment - only terminate on '/'
          if (segmentIndex !== -1) {
            if (segmented[i] === '/') {
              output.push(segmented.slice(segmentIndex, i + 1));
              segmentIndex = -1;
            }
          } // new segment - check if it is relative
          else if (segmented[i] === '.') {
              // ../ segment
              if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
                output.pop();
                i += 2;
              } // ./ segment
              else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
                  i += 1;
                } else {
                  // the start of a new segment as below
                  segmentIndex = i;
                }
            } // it is the start of a new segment
            else {
                segmentIndex = i;
              }
        } // finish reading out the last segment


        if (segmentIndex !== -1) output.push(segmented.slice(segmentIndex));
        return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
      }
  }
  /*
   * Package name maps implementation
   *
   * Reduced implementation - only a single scope level is supported
   * 
   * To make lookups fast we pre-resolve the entire package name map
   * and then match based on backtracked hash lookups
   * 
   * path_prefix in scopes not supported
   * nested scopes not supported
   */


  function resolveUrl(relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || relUrl.indexOf(':') !== -1 && relUrl || resolveIfNotPlainOrUrl('./' + relUrl, parentUrl);
  }

  function createPackageMap(json, baseUrl) {
    if (json.path_prefix) {
      baseUrl = resolveUrl(json.path_prefix, baseUrl);
      if (baseUrl[baseUrl.length - 1] !== '/') baseUrl += '/';
    }

    var basePackages = json.packages || {};
    var scopes = {};

    if (json.scopes) {
      for (var scopeName in json.scopes) {
        var scope = json.scopes[scopeName];
        if (scope.path_prefix) throw new Error('Scope path_prefix not currently supported');
        if (scope.scopes) throw new Error('Nested scopes not currently supported');
        var resolvedScopeName = resolveUrl(scopeName, baseUrl);
        if (resolvedScopeName[resolvedScopeName.length - 1] === '/') resolvedScopeName = resolvedScopeName.substr(0, resolvedScopeName.length - 1);
        scopes[resolvedScopeName] = scope.packages || {};
      }
    }

    function getMatch(path, matchObj) {
      var sepIndex = path.length;

      do {
        var segment = path.slice(0, sepIndex);
        if (segment in matchObj) return segment;
      } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1);
    }

    function applyPackages(id, packages, baseUrl) {
      var pkgName = getMatch(id, packages);

      if (pkgName) {
        var pkg = packages[pkgName];

        if (pkgName === id) {
          if (typeof pkg === 'string') return resolveUrl(pkg, baseUrl + pkgName + '/');
          if (!pkg.main) throw new Error('Package ' + pkgName + ' has no main');
          return resolveUrl((pkg.path ? pkg.path + (pkg.path[pkg.path.length - 1] === '/' ? '' : '/') : pkgName + '/') + pkg.main, baseUrl);
        } else {
          return resolveUrl((typeof pkg === 'string' || !pkg.path ? pkgName + '/' : pkg.path + (pkg.path[pkg.path.length - 1] === '/' ? '' : '/')) + id.slice(pkgName.length + 1), baseUrl);
        }
      }
    }

    return function (id, parentUrl) {
      var scopeName = getMatch(parentUrl, scopes);

      if (scopeName) {
        var scopePackages = scopes[scopeName];
        var packageResolution = applyPackages(id, scopePackages, scopeName + '/');
        if (packageResolution) return packageResolution;
      }

      return applyPackages(id, basePackages, baseUrl) || throwBare(id, parentUrl);
    };
  }

  function throwBare(id, parentUrl) {
    throw new Error('Unable to resolve bare specifier "' + id + (parentUrl ? '" from ' + parentUrl : '"'));
  }
  /*
   * SystemJS Core
   * 
   * Provides
   * - System.import
   * - System.register support for
   *     live bindings, function hoisting through circular references,
   *     reexports, dynamic import, import.meta.url, top-level await
   * - System.getRegister to get the registration
   * - Symbol.toStringTag support in Module objects
   * - Hookable System.createContext to customize import.meta
   * - System.onload(id, err?) handler for tracing / hot-reloading
   * 
   * Core comes with no System.prototype.resolve or
   * System.prototype.instantiate implementations
   */


  var hasSymbol = typeof Symbol !== 'undefined';
  var toStringTag = hasSymbol && Symbol.toStringTag;
  var REGISTRY = hasSymbol ? Symbol() : '@';

  function SystemJS() {
    this[REGISTRY] = {};
  }

  var systemJSPrototype = SystemJS.prototype;

  systemJSPrototype.import = function (id, parentUrl) {
    var loader = this;
    return Promise.resolve(loader.resolve(id, parentUrl)).then(function (id) {
      var load = getOrCreateLoad(loader, id);
      return load.C || topLevelLoad(loader, load);
    });
  }; // Hookable createContext function -> allowing eg custom import meta


  systemJSPrototype.createContext = function (parentId) {
    return {
      url: parentId
    };
  }; // onLoad(id, err) provided for tracing / hot-reloading


  systemJSPrototype.onload = function () {};

  var lastRegister;

  systemJSPrototype.register = function (deps, declare) {
    lastRegister = [deps, declare];
  };
  /*
   * getRegister provides the last anonymous System.register call
   */


  systemJSPrototype.getRegister = function () {
    var _lastRegister = lastRegister;
    lastRegister = undefined;
    return _lastRegister;
  };

  function getOrCreateLoad(loader, id, firstParentUrl) {
    var load = loader[REGISTRY][id];
    if (load) return load;
    var importerSetters = [];
    var ns = Object.create(null);
    if (toStringTag) Object.defineProperty(ns, toStringTag, {
      value: 'Module'
    });
    var instantiatePromise = Promise.resolve().then(function () {
      return loader.instantiate(id, firstParentUrl);
    }).then(function (registration) {
      if (!registration) throw new Error('Module ' + id + ' did not instantiate');

      function _export(name, value) {
        // note if we have hoisted exports (including reexports)
        load.h = true;
        var changed = false;

        if (_typeof(name) !== 'object') {
          if (!(name in ns) || ns[name] !== value) {
            ns[name] = value;
            changed = true;
          }
        } else {
          for (var p in name) {
            var _value = name[p];

            if (!(p in ns) || ns[p] !== _value) {
              ns[p] = _value;
              changed = true;
            }
          }
        }

        if (changed) for (var i = 0; i < importerSetters.length; i++) {
          importerSetters[i](ns);
        }
        return value;
      }

      var declared = registration[1](_export, registration[1].length === 2 ? {
        import: function _import(importId) {
          return loader.import(importId, id);
        },
        meta: loader.createContext(id)
      } : undefined);

      load.e = declared.execute || function () {};

      return [registration[0], declared.setters || []];
    });
    instantiatePromise = instantiatePromise.catch(function (err) {
      loader.onload(load.id, err);
      throw err;
    });
    var linkPromise = instantiatePromise.then(function (instantiation) {
      return Promise.all(instantiation[0].map(function (dep, i) {
        var setter = instantiation[1][i];
        return Promise.resolve(loader.resolve(dep, id)).then(function (depId) {
          var depLoad = getOrCreateLoad(loader, depId, id); // depLoad.I may be undefined for already-evaluated

          return Promise.resolve(depLoad.I).then(function () {
            if (setter) {
              depLoad.i.push(setter); // only run early setters when there are hoisted exports of that module
              // the timing works here as pending hoisted export calls will trigger through importerSetters

              if (depLoad.h || !depLoad.I) setter(depLoad.n);
            }

            return depLoad;
          });
        });
      })).then(function (depLoads) {
        load.d = depLoads;
      });
    }); // disable unhandled rejections

    linkPromise.catch(function () {}); // Captial letter = a promise function

    return load = loader[REGISTRY][id] = {
      id: id,
      // importerSetters, the setters functions registered to this dependency
      // we retain this to add more later
      i: importerSetters,
      // module namespace object
      n: ns,
      // instantiate
      I: instantiatePromise,
      // link
      L: linkPromise,
      // whether it has hoisted exports
      h: false,
      // On instantiate completion we have populated:
      // dependency load records
      d: undefined,
      // execution function
      // set to NULL immediately after execution (or on any failure) to indicate execution has happened
      // in such a case, pC should be used, and pLo, pLi will be emptied
      e: undefined,
      // On execution we have populated:
      // the execution error if any
      eE: undefined,
      // in the case of TLA, the execution promise
      E: undefined,
      // On execution, pLi, pLo, e cleared
      // Promise for top-level completion
      C: undefined
    };
  }

  function instantiateAll(loader, load, loaded) {
    if (!loaded[load.id]) {
      loaded[load.id] = true; // load.L may be undefined for already-instantiated

      return Promise.resolve(load.L).then(function () {
        return Promise.all(load.d.map(function (dep) {
          return instantiateAll(loader, dep, loaded);
        }));
      });
    }
  }

  function topLevelLoad(loader, load) {
    return load.C = instantiateAll(loader, load, {}).then(function () {
      return postOrderExec(loader, load, {});
    }).then(function () {
      return load.n;
    });
  } // the closest we can get to call(undefined)


  var nullContext = Object.freeze(Object.create(null)); // returns a promise if and only if a top-level await subgraph
  // throws on sync errors

  function postOrderExec(loader, load, seen) {
    if (seen[load.id]) return;
    seen[load.id] = true;

    if (!load.e) {
      if (load.eE) throw load.eE;
      if (load.E) return load.E;
      return;
    } // deps execute first, unless circular


    var depLoadPromises;
    load.d.forEach(function (depLoad) {
      {
        try {
          var depLoadPromise = postOrderExec(loader, depLoad, seen);
          if (depLoadPromise) (depLoadPromises = depLoadPromises || []).push(depLoadPromise);
        } catch (err) {
          loader.onload(load.id, err);
          throw err;
        }
      }
    });

    if (depLoadPromises) {
      return Promise.all(depLoadPromises).then(doExec).catch(function (err) {
        loader.onload(load.id, err);
        throw err;
      });
    }

    return doExec();

    function doExec() {
      try {
        var execPromise = load.e.call(nullContext);

        if (execPromise) {
          execPromise = execPromise.then(function () {
            load.C = load.n;
            load.E = null; // indicates completion

            loader.onload(load.id, null);
          }, function () {
            loader.onload(load.id, err);
            throw err;
          });
          execPromise.catch(function () {});
          return load.E = load.E || execPromise;
        } // (should be a promise, but a minify optimization to leave out Promise.resolve)


        load.C = load.n;
        loader.onload(load.id, null);
      } catch (err) {
        loader.onload(load.id, err);
        load.eE = err;
        throw err;
      } finally {
        load.L = load.I = undefined;
        load.e = null;
      }
    }
  }

  envGlobal.System = new SystemJS();
  /*
   * Supports loading System.register via script tag injection
   */

  var err$1;
  if (typeof window !== 'undefined') window.addEventListener('error', function (e) {
    err$1 = e.error;
  });
  var systemRegister = systemJSPrototype.register;

  systemJSPrototype.register = function (deps, declare) {
    err$1 = undefined;
    systemRegister.call(this, deps, declare);
  };

  systemJSPrototype.instantiate = function (url, firstParentUrl) {
    var loader = this;
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.charset = 'utf-8';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.addEventListener('error', function () {
        reject(new Error('Error loading ' + url + (firstParentUrl ? ' from ' + firstParentUrl : '')));
      });
      script.addEventListener('load', function () {
        document.head.removeChild(script); // Note URL normalization issues are going to be a careful concern here

        if (err$1) return reject(err$1);else resolve(loader.getRegister());
      });
      script.src = url;
      document.head.appendChild(script);
    });
  };
  /*
   * Supports loading System.register in workers
   */


  if (hasSelf && typeof importScripts === 'function') systemJSPrototype.instantiate = function (url) {
    var loader = this;
    return new Promise(function (resolve, reject) {
      try {
        importScripts(url);
      } catch (e) {
        reject(e);
      }

      resolve(loader.getRegister());
    });
  };
  /*
   * SystemJS global script loading support
   * Extra for the s.js build only
   * (Included by default in system.js build)
   */

  (function (global) {
    var systemJSPrototype = System.constructor.prototype; // safari unpredictably lists some new globals first or second in object order

    var firstGlobalProp, secondGlobalProp, lastGlobalProp;

    function getGlobalProp() {
      var cnt = 0;
      var lastProp;

      for (var p in global) {
        if (!global.hasOwnProperty(p)) continue;
        if (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp) return p;
        cnt++;
        lastProp = p;
      }

      if (lastProp !== lastGlobalProp) return lastProp;
    }

    function noteGlobalProps() {
      // alternatively Object.keys(global).pop()
      // but this may be faster (pending benchmarks)
      firstGlobalProp = secondGlobalProp = undefined;

      for (var p in global) {
        if (!global.hasOwnProperty(p)) continue;
        if (!firstGlobalProp) firstGlobalProp = p;else if (!secondGlobalProp) secondGlobalProp = p;
        lastGlobalProp = p;
      }

      return lastGlobalProp;
    }

    var impt = systemJSPrototype.import;

    systemJSPrototype.import = function (id, parentUrl) {
      noteGlobalProps();
      return impt.call(this, id, parentUrl);
    };

    var emptyInstantiation = [[], function () {
      return {};
    }];
    var getRegister = systemJSPrototype.getRegister;

    systemJSPrototype.getRegister = function () {
      var lastRegister = getRegister.call(this);
      if (lastRegister) return lastRegister; // no registration -> attempt a global detection as difference from snapshot
      // when multiple globals, we take the global value to be the last defined new global object property
      // for performance, this will not support multi-version / global collisions as previous SystemJS versions did
      // note in Edge, deleting and re-adding a global does not change its ordering

      var globalProp = getGlobalProp();
      if (!globalProp) return emptyInstantiation;
      var globalExport;

      try {
        globalExport = global[globalProp];
      } catch (e) {
        return emptyInstantiation;
      }

      return [[], function (_export) {
        return {
          execute: function execute() {
            _export('default', globalExport);
          }
        };
      }];
    };
  })(typeof self !== 'undefined' ? self : global);
  /*
   * Loads WASM based on file extension detection
   * Assumes successive instantiate will handle other files
   */


  var instantiate = systemJSPrototype.instantiate;

  systemJSPrototype.instantiate = function (url, parent) {
    if (url.slice(-5) !== '.wasm') return instantiate.call(this, url, parent);
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText + ' ' + res.url + (parent ? ' loading from ' + parent : ''));
      if (WebAssembly.compileStreaming) return WebAssembly.compileStreaming(res);
      return res.arrayBuffer().then(function (buf) {
        return WebAssembly.compile(buf);
      });
    }).then(function (module) {
      var deps = [];
      var setters = [];
      var importObj = {}; // we can only set imports if supported (eg early Safari doesnt support)

      if (WebAssembly.Module.imports) WebAssembly.Module.imports(module).forEach(function (impt) {
        var key = impt.module;
        setters.push(function (m) {
          importObj[key] = m;
        });
        if (deps.indexOf(key) === -1) deps.push(key);
      });
      return [deps, function (_export) {
        return {
          setters: setters,
          execute: function execute() {
            return WebAssembly.instantiate(module, importObj).then(function (instance) {
              _export(instance.exports);
            });
          }
        };
      }];
    });
  };
  /*
   * Package name map support for SystemJS
   * 
   * <script type="systemjs-packagemap">{}</script>
   * OR
   * <script type="systemjs-packagemap" src=package.json></script>
   * 
   * Only supports loading the first package map
   */


  var packageMapPromise, packageMapResolve;

  if (typeof document !== 'undefined') {
    var scripts = document.getElementsByTagName('script');

    var _loop2 = function _loop2(i) {
      var script = scripts[i];
      if (script.type !== 'systemjs-packagemap') return "continue";

      if (!script.src) {
        packageMapResolve = createPackageMap(JSON.parse(script.innerHTML), baseUrl);
        packageMapPromise = Promise.resolve();
      } else {
        packageMapPromise = fetch(script.src).then(function (res) {
          return res.json();
        }).then(function (json) {
          packageMapResolve = createPackageMap(json, script.src);
          packageMapPromise = undefined;
        }, function () {
          packageMapResolve = throwBare;
          packageMapPromise = undefined;
        });
      }

      return "break";
    };

    _loop: for (var i = 0; i < scripts.length; i++) {
      var _ret = _loop2(i);

      switch (_ret) {
        case "continue":
          continue;

        case "break":
          break _loop;
      }
    }
  }

  if (!packageMapPromise) packageMapResolve = throwBare;

  systemJSPrototype.resolve = function (id, parentUrl) {
    parentUrl = parentUrl || baseUrl;
    var resolvedIfNotPlainOrUrl = resolveIfNotPlainOrUrl(id, parentUrl);
    if (resolvedIfNotPlainOrUrl) return resolvedIfNotPlainOrUrl;
    if (id.indexOf(':') !== -1) return id; // now just left with plain
    // (if not package map, packageMapResolve just throws)

    if (packageMapPromise) return packageMapPromise.then(function () {
      return packageMapResolve(id, parentUrl);
    });
    return packageMapResolve(id, parentUrl);
  };

  systemJSPrototype.get = function (id) {
    var load = this[REGISTRY][id];

    if (load && load.e === null && !load.E) {
      if (load.eE) return null;
      return load.n;
    }
  }; // Delete function provided for hot-reloading use cases


  systemJSPrototype.delete = function (id) {
    var load = this.get(id);
    if (load === undefined) return false; // remove from importerSetters
    // (release for gc)

    if (load && load.d) load.d.forEach(function (depLoad) {
      var importerIndex = depLoad.i.indexOf(load);
      if (importerIndex !== -1) depLoad.i.splice(importerIndex, 1);
    });
    return delete this[REGISTRY][id];
  };
})();
},{}],"../../../AppData/Local/nvs/node/10.11.0/x64/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56335" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../AppData/Local/nvs/node/10.11.0/x64/node_modules/parcel/src/builtins/hmr-runtime.js","dist/system.js"], null)
//# sourceMappingURL=/system.caccb58f.map