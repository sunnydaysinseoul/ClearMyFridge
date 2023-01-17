// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/fridge.js":[function(require,module,exports) {
//***** Selectors
var fridgeForm = document.getElementById("fridge-form");
var fridgeInput = document.querySelector("#fridge-form input");
var fridgeList = document.querySelector("#fridge-form ul");
var freezerForm = document.getElementById("freezer-form");
var freezerInput = document.querySelector("#freezer-form input");
var freezerList = document.querySelector("#freezer-form ul");
var nonPerishableForm = document.getElementById("nonPerishable-form");
var nonPerishableInput = document.querySelector("#nonPerishable-form input");
var nonPerishableList = document.querySelector("#nonPerishable-form ul");
var inputForms = document.querySelectorAll(".input-form");
var titles = document.querySelectorAll(".title");

//***** Variables
var foodListObj = [];
var FOODLIST_KEY = "foodListObj";
var dragStartLi = "";
var draggedData = "";
var dropType = "a";
var dragEndDiv = "";
//***** Functions
var saveList = function saveList(newFood) {
  // 1.LocalStorage에 저장하기
  foodListObj.push(newFood); //array에 push
  foodListObj = foodListObj.sort(function (prev, cur) {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj)); //localstorage에는 array를 저장하지 못하므로 string형태로 변형후 저장.

  // 2.화면에 그리기
  drawList(newFood);
};
var deleteList = function deleteList(e) {
  var li = e.target.parentElement;
  foodListObj = foodListObj.filter(function (item) {
    return item.id !== parseInt(li.id);
  });
  foodListObj = foodListObj.sort(function (prev, cur) {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  //li.id를 parseInt하는 이유 : DOM의 id는 문자열이기 때문에 Date함수로 저장한 우리 Obj의 id값(=숫자)와 형식이 달라서
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(foodListObj));
  li.remove(); //화면에서 바로 지우는 용도
};

//// Drag Events
var onDragStart = function onDragStart(e) {
  var dragId = e.target.id;
  dragStartLi = e.target; //Drop되면 해당 Li지워주려고 저장.
  draggedData = foodListObj.find(function (item) {
    return item.id == dragId;
  });
  //배열에서 drag할 데이터 찾아두기.
  //onDrop 함수에서 사용함.
};

var onDragOver = function onDragOver(e) {
  e.preventDefault();
  var thisDiv = e.target.closest("div");
  thisDiv.classList.add("drag-over");

  // e.target.classList.add("drag-over");
};

var onDragLeave = function onDragLeave(e) {
  e.preventDefault();
  var hasClass = document.querySelectorAll(".drag-over");
  hasClass.forEach(function (item) {
    item.classList.remove("drag-over");
  });
};
var onDrop = function onDrop(e) {
  e.preventDefault();
  var hasClass = document.querySelectorAll(".drag-over");
  hasClass.forEach(function (item) {
    item.classList.remove("drag-over");
  });

  // const dropTarget = e.target.tagName; //drop시 떨어지는 target의 태그종류(DIV ,LI...)
  // if (dropTarget == "DIV") {
  //   dropType = e.target.id; //drop되는 div의 이름(=type)
  // } else {
  //   dropType = e.target.closest("div").id; //drop되는 개체의 가장 가까운 parent div요소의 id(=type)
  // }
  dropType = e.currentTarget.id; //e.target대신, 이벤트리스너를 가진 요소를 가리키도록 currentTarget으로 변경
  var newFoodListObj = foodListObj.map(function (item) {
    if (item.id == draggedData.id) {
      item.type = dropType; //drop된 데이터와 같은 데이터만 Obj에서 찾아서 변경.
      item.id = Date.now(); //id를 현재 수정된 날짜로 변경. (sort위해)
      console.log(dragStartLi.compareDocumentPosition(e.target));
      dragStartLi.remove();
      drawList(draggedData); // 제대로된 곳에  drop되었을 때 - 드래그시작한 li를 새로운 곳에 draw해주고, 원래 리스트에선 remove.
      return item;
    }
    return item;
  });
  newFoodListObj = newFoodListObj.sort(function (prev, cur) {
    // 숫자 오름차순 정렬
    return prev.id - cur.id;
  });
  localStorage.setItem(FOODLIST_KEY, JSON.stringify(newFoodListObj));
  var thisDiv = e.target.closest("div");
  thisDiv.classList.remove("drag-over");
};
var drawList = function drawList(newFood) {
  //화면에 리스트 그려주는 용도
  var li = document.createElement("li");
  var span = document.createElement("span");
  var delBtn = document.createElement("i");
  // li.setAttribute('data-index', index);
  li.append(span);
  li.append(delBtn);
  li.id = newFood.id; //주의 : DOM에서는 id가 문자열로 들어감
  li.draggable = "true";
  li.classList.add("flex-row", "drag-list");
  li.addEventListener("dragstart", onDragStart);
  span.innerText = newFood.name;
  // delBtn.classList.add("fa-solid", "fa-delete-left", "delBtn");
  delBtn.classList.add("delBtn");
  delBtn.addEventListener("click", deleteList);
  if (newFood.type == "fridge-form") {
    fridgeList.append(li);
  } else if (newFood.type == "freezer-form") {
    freezerList.append(li);
  } else if (newFood.type == "nonPerishable-form") {
    nonPerishableList.append(li);
  }
};
var onFoodSubmit = function onFoodSubmit(e, type) {
  e.preventDefault();
  var foodValue;
  if (type == "fridge-form") {
    foodValue = fridgeInput.value;
    fridgeInput.value = "";
  } else if (type == "freezer-form") {
    foodValue = freezerInput.value;
    freezerInput.value = "";
  } else if (type == "nonPerishable-form") {
    foodValue = nonPerishableInput.value;
    nonPerishableInput.value = "";
  }

  //LocalStorage에 저장될 데이터 형태!
  var newFood = {
    name: foodValue,
    id: Date.now(),
    type: type
  };
  saveList(newFood);
};

//***** Initial Condition check

//실행시 localStorage 값 여부 체크.
var savedfoodListObj = localStorage.getItem(FOODLIST_KEY);
if (savedfoodListObj !== null) {
  var parsedFoodListObj = JSON.parse(savedfoodListObj);
  parsedFoodListObj.forEach(function (item) {
    return drawList(item);
  }); //저장된 값 화면에 그려주기
  foodListObj = parsedFoodListObj; //시작시 빈Obj로 지정하니 값이 있는경우 덮어씌워줌.
}

//***** Event Listener
fridgeForm.addEventListener("submit", function (e) {
  onFoodSubmit(e, "fridge-form");
});
freezerForm.addEventListener("submit", function (e) {
  onFoodSubmit(e, "freezer-form");
});
nonPerishableForm.addEventListener("submit", function (e) {
  onFoodSubmit(e, "nonPerishable-form");
});
inputForms.forEach(function (inputForm) {
  inputForm.addEventListener("drop", onDrop);
});
inputForms.forEach(function (inputForm) {
  inputForm.addEventListener("dragover", onDragOver);
});
inputForms.forEach(function (inputForm) {
  inputForm.addEventListener("dragleave", onDragLeave);
});

/*참고:
window.addEventListener("storage",(e)=>console.log(e)); //-storage이벤트는, 같은 도메인의 다른 윈도우/탭/창에서 storage내용변경이 일어났을 때만 감지한다 ㅠㅠ
*/
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44485" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/fridge.js"], null)
//# sourceMappingURL=/fridge.85166372.js.map