define("js/common/upload", [ "./CD" ], function(require, exports, module) {
    var CD = require("./CD");
    var INIT_OPTS = {
        runtimes: "html5,flash,silverlight,html4",
        browse_button: "pickfiles",
        // you can pass in id...
        url: "/uploadf",
        filters: {
            max_file_size: "10mb",
            mime_types: [ {
                title: "Image files",
                extensions: "jpg,gif,png"
            } ]
        },
        // Flash settings
        flash_swf_url: "http://source.jjfuwu.com/static/Moxie.cdn.swf",
        // Silverlight settings
        silverlight_xap_url: "http://source.jjfuwu.com/static/Moxie.cdn.xap"
    };
    exports.initUpload = function(opts) {
        var n_opts = CD.mix({}, opts, INIT_OPTS);
        var uploader = new plupload.Uploader(n_opts);
        uploader.init();
        return uploader;
    };
});

(function(window) {
    var win = window, QNR;
    if (typeof win.QNR === "undefined") {
        QNR = win.QNR = {};
    } else {
        QNR = win.QNR;
    }
    if (QNR._TRAVEL_INIT_) {
        return;
    }
    QNR._TRAVEL_INIT_ = true;
    var document = win.document, ObjectPro = Object.prototype, ArrayPro = Array.prototype, toString = ObjectPro.toString, hasOwnProperty = ObjectPro.hasOwnProperty, trimLeft = /^\s+/, trimRight = /\s+$/;
    /***************
	 * ECM script 5 数组操作
	 * ************/
    var ArrayH = {
        /**
		 * 在数组中的每个项上运行一个函数，并将全部结果作为数组返回。
		 * @method map
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {Array} 返回满足过滤条件的元素组成的新数组
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=map(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        map: function(arr, callback, pThis) {
            var len = arr.length;
            var rlt = new Array(len);
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    rlt[i] = callback.call(pThis, arr[i], i, arr);
                }
            }
            return rlt;
        },
        /**
		 * 对Array的每一个元素运行一个函数。
		 * @method forEach
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {void}
		 * @example
		 var arr=["a","b","c"];
		 var dblArr=[];
		 forEach(arr,function(a,b){dblArr.push(b+":"+a+a);});
		 alert(dblArr);
		 */
        forEach: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr) {
                    callback.call(pThis, arr[i], i, arr);
                }
            }
        },
        /**
		 * 在数组中的每个项上运行一个函数，并将函数返回真值的项作为数组返回。
		 * @method filter
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {Array} 返回满足过滤条件的元素组成的新数组
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        filter: function(arr, callback, pThis) {
            var rlt = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && callback.call(pThis, arr[i], i, arr)) {
                    rlt.push(arr[i]);
                }
            }
            return rlt;
        },
        /**
		 * 判断数组中是否有元素满足条件。
		 * @method some
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {boolean} 如果存在元素满足条件，则返回true.
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        some: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && callback.call(pThis, arr[i], i, arr)) {
                    return true;
                }
            }
            return false;
        },
        /**
		 * 判断数组中所有元素都满足条件。
		 * @method every
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {boolean} 所有元素满足条件，则返回true.
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        every: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && !callback.call(pThis, arr[i], i, arr)) {
                    return false;
                }
            }
            return true;
        },
        /**
		 * 返回一个元素在数组中的位置（从前往后找）。如果数组里没有该元素，则返回-1
		 * @method indexOf
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @param {int} fromIdx (Optional) 从哪个位置开始找起，如果为负，则表示从length+startIdx开始找
		 * @return {int} 则返回该元素在数组中的位置.
		 * @example
		 var arr=["a","b","c"];
		 alert(indexOf(arr,"c"));
		 */
        indexOf: function(arr, obj, fromIdx) {
            var len = arr.length;
            fromIdx |= 0;
            //取整
            if (fromIdx < 0) {
                fromIdx += len;
            }
            if (fromIdx < 0) {
                fromIdx = 0;
            }
            for (;fromIdx < len; fromIdx++) {
                if (fromIdx in arr && arr[fromIdx] === obj) {
                    return fromIdx;
                }
            }
            return -1;
        },
        /**
		 * 返回一个元素在数组中的位置（从后往前找）。如果数组里没有该元素，则返回-1
		 * @method lastIndexOf
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @param {int} fromIdx (Optional) 从哪个位置开始找起，如果为负，则表示从length+startIdx开始找
		 * @return {int} 则返回该元素在数组中的位置.
		 * @example
		 var arr=["a","b","a"];
		 alert(lastIndexOf(arr,"a"));
		 */
        lastIndexOf: function(arr, obj, fromIdx) {
            var len = arr.length;
            fromIdx |= 0;
            //取整
            if (!fromIdx || fromIdx >= len) {
                fromIdx = len - 1;
            }
            if (fromIdx < 0) {
                fromIdx += len;
            }
            for (;fromIdx > -1; fromIdx--) {
                if (fromIdx in arr && arr[fromIdx] === obj) {
                    return fromIdx;
                }
            }
            return -1;
        },
        /**
		 * 判断数组是否包含某元素
		 * @method contains
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @return {boolean} 如果元素存在于数组，则返回true，否则返回false
		 * @example
		 var arr=["a","b","c"];
		 alert(contains(arr,"c"));
		 */
        contains: function(arr, obj) {
            return ArrayH.indexOf(arr, obj) >= 0;
        },
        /**
		 * 清空一个数组
		 * @method clear
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @return {void}
		 */
        clear: function(arr) {
            arr.length = 0;
        },
        /**
		 * 将数组里的某(些)元素移除。
		 * @method remove
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj0 待移除元素
		 * @param {Object} obj1 … 待移除元素
		 * @return {number} 返回第一次被移除的位置。如果没有任何元素被移除，则返回-1.
		 * @example
		 var arr=["a","b","c"];
		 remove(arr,"a","c");
		 alert(arr);
		 */
        remove: function(arr, obj) {
            var idx = -1;
            for (var i = 1; i < arguments.length; i++) {
                var oI = arguments[i];
                for (var j = 0; j < arr.length; j++) {
                    if (oI === arr[j]) {
                        if (idx < 0) {
                            idx = j;
                        }
                        arr.splice(j--, 1);
                    }
                }
            }
            return idx;
        },
        /**
		 * 数组元素除重，得到新数据
		 * @method unique
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @return {void} 数组元素除重，得到新数据
		 * @example
		 var arr=["a","b","a"];
		 alert(unique(arr));
		 */
        unique: function(arr) {
            var rlt = [], oI = null, indexOf = Array.indexOf || ArrayH.indexOf;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (indexOf(rlt, oI = arr[i]) < 0) {
                    rlt.push(oI);
                }
            }
            return rlt;
        },
        /**
		 * 为数组元素进行递推操作。
		 * @method reduce
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数。
		 * @param {any} initial (Optional) 初始值，如果没有这初始，则从第一个有效元素开始。没有初始值，并且没有有效元素，会抛异常
		 * @return {any} 返回递推结果.
		 * @example
		 var arr=[1,2,3];
		 alert(reduce(arr,function(a,b){return Math.max(a,b);}));
		 */
        reduce: function(arr, callback, initial) {
            var len = arr.length;
            var i = 0;
            if (arguments.length < 3) {
                //找到第一个有效元素当作初始值
                var hasV = 0;
                for (;i < len; i++) {
                    if (i in arr) {
                        initial = arr[i++];
                        hasV = 1;
                        break;
                    }
                }
                if (!hasV) {
                    throw new Error("No component to reduce");
                }
            }
            for (;i < len; i++) {
                if (i in arr) {
                    initial = callback(initial, arr[i], i, arr);
                }
            }
            return initial;
        },
        /**
		 * 为数组元素进行逆向递推操作。
		 * @method reduceRight
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数。
		 * @param {any} initial (Optional) 初始值，如果没有这初始，则从第一个有效元素开始。没有初始值，并且没有有效元素，会抛异常
		 * @return {any} 返回递推结果.
		 * @example
		 var arr=[1,2,3];
		 alert(reduceRight(arr,function(a,b){return Math.max(a,b);}));
		 */
        reduceRight: function(arr, callback, initial) {
            var len = arr.length;
            var i = len - 1;
            if (arguments.length < 3) {
                //逆向找到第一个有效元素当作初始值
                var hasV = 0;
                for (;i > -1; i--) {
                    if (i in arr) {
                        initial = arr[i--];
                        hasV = 1;
                        break;
                    }
                }
                if (!hasV) {
                    throw new Error("No component to reduceRight");
                }
            }
            for (;i > -1; i--) {
                if (i in arr) {
                    initial = callback(initial, arr[i], i, arr);
                }
            }
            return initial;
        },
        /**
		 * 将一个数组扁平化
		 * @method expand
		 * @static
		 * @param arr {Array} 要扁平化的数组
		 * @return {Array} 扁平化后的数组
		 */
        expand: function(arr) {
            return [].concat.apply([], arr);
        },
        /**
		 * 将一个泛Array转化成一个Array对象。
		 * @method toArray
		 * @static
		 * @param {Array} arr 待处理的Array的泛型对象.
		 * @return {Array}
		 */
        toArray: function(arr) {
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                ret[i] = arr[i];
            }
            return ret;
        },
        /**
		 * 对数组进行包装。
		 * @method wrap
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Class} constructor 构造器
		 * @returns {Object}: 返回new constructor(arr)
		 */
        wrap: function(arr, constructor) {
            return new constructor(arr);
        }
    };
    // mix to QNR not to Array
    for (var key in ArrayH) {
        (function(key) {
            if (!ArrayPro.hasOwnProperty(key)) {
                QNR[key] = ArrayH[key];
                //mix ArrayPro
                ArrayPro[key] = function() {
                    var arr = this;
                    return ArrayH[key].apply(null, [ arr ].concat([].slice.call(arguments, 0)));
                };
            } else {
                QNR[key] = function() {
                    var args = ArrayPro.slice.call(arguments, 0);
                    var arr = args.splice(0, 1)[0];
                    return ArrayPro[key].apply(arr, args);
                };
            }
        })(key);
    }
    for (var i in ArrayH) {
        (function(i) {
            if (!ArrayPro.hasOwnProperty(i)) {
                ArrayPro[i] = raiders.helper.methodize(ArrayH[i]);
            }
        })(i);
    }
    //兼容内部调用
    var forEach = QNR.forEach, some = QNR.some, indexOf = QNR.indexOf;
    var trim = function(text) {
        var str = text.toString();
        if (str.trim) {
            return str.trim();
        } else {
            return str.replace(trimLeft, "").replace(trimRight, "");
        }
    };
    var typeMap = {};
    forEach("Boolean Number String Function Array Date RegExp Object".split(" "), function(name, i) {
        typeMap["[object " + name + "]"] = name.toLowerCase();
    }, typeMap);
    var type = function(obj) {
        return obj == null ? String(obj) : typeMap[toString.call(obj)] || "object";
    };
    var isFunction = function(obj) {
        return type(obj) === "function";
    };
    var isArray = Array.isArray || function(obj) {
        return type(obj) === "array";
    };
    var isWindow = function(obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    };
    var proxy = function(func, context) {
        var extArgs = ArrayPro.slice.call(arguments, 2);
        return function() {
            var args = ArrayPro.slice.call(arguments, 0);
            args = extArgs.concat(args);
            if (isFunction(func)) {
                return func.apply(context, args);
            } else {
                return function() {
                    console.error("proxy func is  not function");
                };
            }
        };
    };
    //自定义Event
    var QEvent = function() {
        this._eventList = {};
    };
    QEvent.prototype = {
        constructor: QEvent,
        _getOne: function(name) {
            return this._eventList[name] || (this._eventList[name] = []);
        },
        bind: function(name, func, context) {
            if (type(name) === "object") {
                for (var hn in name) {
                    this.bind(hn, name[hn], context);
                }
            } else {
                if (context) {
                    func = proxy(func, context);
                }
                var funcs = this._getOne(name);
                if (funcs.fired) {
                    func(funcs.args);
                    return this;
                }
                this._getOne(name).push(func);
                return this;
            }
        },
        unbind: function(name, func) {
            var list = this._getOne(name);
            if (func) {
                var poi = indexOf(list, func);
                if (poi > -1) {
                    list.slice(poi, 1);
                }
            } else {
                list.length = 0;
            }
        },
        trigger: function(name) {
            var funcs = this._getOne(name) || [];
            var args = ArrayPro.slice.call(arguments, 1);
            var that = this;
            var ret;
            forEach(this._getOne(name), function(func) {
                ret = func.apply(that, args);
                if (ret === false) return true;
            });
            return ret;
        },
        once: function(name, func, context) {
            var me = this;
            var handle = function() {
                func.apply(context || me, arguments);
                me.unbind(name, handle);
            };
            me.bind(name, handle);
            return handle;
        },
        delay: function(name, wait) {
            var args = ArrayPro.slice.call(arguments, 2);
            var me = this;
            return setTimeout(function() {
                me.trigger.apply(me, name.concat(args));
            }, wait || 10);
        },
        /**
	 	* triggerReady触发的事件的特点是，即使是事件已经触发，后续on注册的callback仍然会执行
	 	* 同时请注意，这类事件应该只触发一次，多次会导致逻辑混乱
	 	*/
        triggerReady: function(name) {
            var callbacks = this._getOne(name);
            var args = ArrayPro.slice.call(arguments, 1);
            forEach(callbacks, function(callback, i) {
                if (typeof callback != "function") {
                    return null;
                }
                return callback.apply(null, args);
            });
            callbacks.fired = true;
            callbacks.args = args;
        }
    };
    QEvent.prototype.fire = QEvent.prototype.trigger;
    QEvent.prototype.on = QEvent.prototype.bind;
    var extend = function(child, parent, proObj) {
        var T = function() {};
        T.prototype = parent.prototype;
        var pro = child.prototype;
        child.prototype = new T();
        child.prototype.constructor = child;
        child.$super = parent;
        mix(child.prototype, pro, proObj, true);
        return child;
    };
    var mix = function(elements) {
        var len = arguments.length;
        var isCopy = false;
        var copys = ArrayPro.slice.call(arguments, 1, len);
        if (type(arguments[len - 1]) === "boolean") {
            isCopy = arguments[len - 1];
            copys = ArrayPro.slice.call(arguments, 1, len - 1);
        }
        forEach(copys, function(source) {
            for (var key in source) {
                if (type(elements[key]) === "undefined" || isCopy) {
                    elements[key] = source[key];
                }
            }
        });
        return elements;
    };
    mix(QNR, {
        _config: {
            debug: true
        },
        type: type,
        trim: trim,
        extend: extend,
        mix: mix,
        proxy: proxy,
        Event: QEvent,
        isFunction: isFunction,
        isArray: isArray,
        isWindow: isWindow,
        isEmpty: function(obj) {
            if (isArray(obj) || type(obj) === "string") {
                return obj.length === 0;
            }
            for (var key in obj) if (hasOwnProperty.call(obj, key)) {
                return false;
            }
            return true;
        },
        HTMLEncode: function(str) {
            return (str || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;");
        },
        countStr: function(str) {
            var num = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                if (str.charCodeAt(i) > 128) {
                    num++;
                } else {
                    num += .5;
                }
            }
            return num;
        },
        subStr: function(str, maxlen, re) {
            if (!str) return "";
            var n = 0, ismuch = false, result = [];
            for (var i = 0, len = str.length; i < len; i++) {
                str.charCodeAt(i) > 127 ? n += 1 : n += .5;
                if (n > maxlen) {
                    ismuch = true;
                    break;
                }
                result.push(str.charAt(i));
            }
            return result.join("") + (ismuch ? typeof re !== "undefined" ? re : "..." : "");
        },
        getHashParams: function() {
            var hash = window.location.hash || "#", hash_param_obj = {};
            var hash_param_str = hash.replace(/.*?#.*?!/, "");
            forEach(hash_param_str.split("&"), function(str) {
                var t = str.split("=");
                hash_param_obj[t[0]] = t[1];
            });
            return hash_param_obj;
        },
        /**
			 * 格式化日期
			 * @method format
			 * @static
			 * @param {Date} d 日期对象
			 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为"yyyy-MM-dd"
			 * @return {string}  返回format后的字符串
			 * @example
			 var d=new Date();
			 alert(format(d," yyyy年M月d日\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
			 */
        formatDate: function(d, pattern) {
            pattern = pattern || "yyyy-MM-dd";
            var y = d.getFullYear().toString(), o = {
                M: d.getMonth() + 1,
                //month
                d: d.getDate(),
                //day
                h: d.getHours(),
                //hour
                m: d.getMinutes(),
                //minute
                s: d.getSeconds()
            };
            pattern = pattern.replace(/(y+)/gi, function(a, b) {
                return y.substr(4 - Math.min(4, b.length));
            });
            for (var i in o) {
                pattern = pattern.replace(new RegExp("(" + i + "+)", "g"), function(a, b) {
                    return o[i] < 10 && b.length > 1 ? "0" + o[i] : o[i];
                });
            }
            return pattern;
        },
        plusDay: function(d, day) {
            var ONE_DAY = 24 * 60 * 60 * 1e3;
            return new Date(d.getTime() + day * ONE_DAY);
        }
    });
    /**
     * @开放this 可以call apply 之
     *
     * @return
     */
    QNR.namespace = function(ns, func) {
        if (!ns || !ns.length) {
            return null;
        }
        var names = ns.split(".");
        var i = names[0] == "QNR" ? 1 : 0;
        var len = names.length;
        var node = this;
        for (;i < len; i++) {
            if (type(node[names[i]]) === "undefined") {
                node[names[i]] = {};
            }
            node = node[names[i]];
        }
        if (isFunction(func)) {
            func.call(node, this);
        }
        return node;
    };
    //动态加载资源
    (function(Q) {
        var _loaded = {};
        // 已经加载的静态文件
        var _loading = {};
        // 正在加载中的静态文件
        var _callbacks = [];
        // 静态文件加载的回调列表
        var _links = [];
        // 加载中的css列表
        var _timer;
        // 轮询css加载状态的定时器
        var canonicalURI = function(src) {
            if (/^\/\/\/?/.test(src)) {
                src = location.protocol + src;
            }
            return src;
        };
        //只检测一次
        var _initResourceMap = function() {
            var allTags = document.getElementsByTagName("link"), len = allTags.length, tag;
            while (len) {
                tag = allTags[--len];
                if ((tag.rel == "stylesheet" || tag.type == "text/css") && tag.href) {
                    _loaded[canonicalURI(tag.href)] = true;
                }
            }
            allTags = document.getElementsByTagName("script");
            len = allTags.length;
            while (len) {
                tag = allTags[--len];
                if ((!tag.type || tag.type == "text/javascript") && tag.src) {
                    _loaded[canonicalURI(tag.src)] = true;
                }
            }
            _initResourceMap = function() {};
        };
        var _complete = function(uri) {
            var list = _callbacks, item, i;
            delete _loading[uri];
            _loaded[uri] = true;
            for (i = 0; i < list.length; i++) {
                item = list[i];
                delete item.resources[uri];
                if (Q.isEmpty(item.resources)) {
                    item.callback && item.callback();
                    list.splice(i--, 1);
                }
            }
        };
        var _poll = function() {
            var sheets = document.styleSheets, i = sheets.length, links = _links;
            while (i--) {
                var link = sheets[i], owner = link.ownerNode || link.owningElement, j = links.length;
                if (owner) {
                    while (j--) {
                        if (owner == links[j]) {
                            _complete(links[j]["data-href"]);
                            links.splice(j, 1);
                        }
                    }
                }
            }
            if (!links.length) {
                clearInterval(_timer);
                _timer = null;
            }
        };
        var _injectJS = function(uri) {
            var script = document.createElement("script");
            var callback = function() {
                script.onload = script.onerror = script.onreadystatechange = null;
                _complete(uri);
            };
            mix(script, {
                type: "text/javascript",
                src: uri
            }, true);
            script.onload = script.onerror = callback;
            script.onreadystatechange = function() {
                var state = this.readyState;
                if (state == "complete" || state == "loaded") {
                    callback();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        var _injectCSS = function(uri) {
            var link = document.createElement("link");
            mix(link, {
                type: "text/css",
                rel: "stylesheet",
                href: uri,
                "data-href": uri
            }, true);
            document.getElementsByTagName("head")[0].appendChild(link);
            if (link.attachEvent) {
                var callback = function() {
                    _complete(uri);
                };
                link.onload = callback;
            } else {
                _links.push(link);
                if (!_timer) {
                    _timer = setInterval(_poll, 20);
                }
            }
        };
        var _load = function(list, callback) {
            var resources = {}, uri, path, type, ret;
            _initResourceMap();
            list = isArray(list) ? list : [ list ];
            for (var i = 0, j = list.length; i < j; i++) {
                uri = canonicalURI(list[i]);
                resources[uri] = true;
                if (_loaded[uri]) {
                    setTimeout(proxy(_complete, null, uri), 0);
                } else if (!_loading[uri]) {
                    _loading[uri] = true;
                    //if (uri.indexOf('.css') > -1) {
                    if (uri.match(/[\?\.]css$/)) {
                        _injectCSS(uri);
                    } else {
                        _injectJS(uri);
                    }
                }
            }
            if (callback) {
                _callbacks.push({
                    resources: resources,
                    callback: callback
                });
            }
        };
        /**
		 * 加载JS文件
		 * @param {mixed} src JS文件绝对地址
		 * @param {function} callback js加载完成后回调函数
		 */
        Q.loadJS = function(src, callback) {
            _load(src, callback);
        };
        /**
		 * 加载CSS文件
		 * @param {mixed} uri css文件绝对地址
		 * @param {function} callback todo: 文件加载完成后回调函数
		 */
        Q.loadCSS = function(uri, callback) {
            _load(uri, callback);
        };
        Q.loadListJs = Q.loadSource = function(list, callback) {
            _load(list, callback);
        };
        //仅仅旅行下面用的LadyLoad ,_MODULES 是src 路径配置文件
        // key  : {status : "loaded",callback:[]}
        var LOADING = "LOADING", LOADED = "LOADED";
        var loadedModules = {};
        Q.loadModule = function(m_name, callback, _MODULES) {
            var _M = _MODULES || window.QZZ_TRAVEL_MODULES;
            if (!_M) {
                console.error("没有SRC的配置项");
                return;
            }
            if (getStatus(m_name) === LOADED) {
                var callbacks = loadedModules[m_name]["callbacks"];
                var func;
                while (func = callbacks.shift()) {
                    type(func) === "function" && func();
                }
                type(callback) === "function" && callback();
                return;
            }
            var module = _M[m_name], src, deps = {};
            if (type(module) === "string") {
                src = [ module ];
            } else if (type(module) === "array") {
                src = module;
            } else if (type(module) === "object") {
                src = module.src;
                var _deps = module.depends;
                if (type(_deps) === "array") {
                    forEach(_deps, function(m) {
                        deps[m] = m;
                    });
                } else if (type(_deps) === "string") {
                    deps[_deps] = _deps;
                }
            } else {
                console.error("需要加载的M格式错误 。。", m_name, module);
                return;
            }
            var _load = function() {
                if (!loadedModules[m_name]) {
                    loadedModules[m_name] = {
                        status: LOADING,
                        callbacks: []
                    };
                    if (type(callback) === "function") {
                        loadedModules[m_name]["callbacks"].push(callback);
                    }
                } else if (getStatus(m_name) === LOADING) {
                    callback && loadedModules[m_name]["callbacks"].push(callback);
                    if (type(callback) === "function") {
                        loadedModules[m_name]["callbacks"].push(callback);
                    }
                    return;
                }
                Q.loadSource(src, function() {
                    loadedModules[m_name]["status"] = LOADED;
                    var callbacks = loadedModules[m_name]["callbacks"];
                    var func;
                    while (func = callbacks.shift()) {
                        type(func) === "function" && func();
                    }
                });
            };
            if (!isEmpty(deps)) {
                for (var d_m_name in deps) {
                    (function(d_m_name) {
                        Q.loadModule(d_m_name, function() {
                            delete deps[d_m_name];
                            if (isEmpty(deps)) {
                                _load();
                            }
                        }, _M);
                    })(d_m_name);
                }
            } else {
                _load();
            }
        };
        function getStatus(key) {
            if (loadedModules[key]) {
                return loadedModules[key]["status"] || null;
            }
            return null;
        }
        function isEmpty(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }
    })(QNR);
    //浏览器判断
    var ua = window.navigator.userAgent.toLowerCase(), check = function(r) {
        return r.test(ua);
    };
    var isOpera = check(/opera/), isChrome = check(/\bchrome\b/), isWebKit = check(/webkit/), isSafari = !isChrome && isWebKit, isIE = check(/msie/) && document.all && !isOpera, isIE7 = check(/msie 7/), isIE8 = check(/msie 8/), isIE9 = check(/msie 9/), isIE10 = check(/msie 10/), isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10, isGecko = check(/gecko/) && !isWebKit, isMac = check(/mac/);
    QNR.Browser = {
        isOpera: isOpera,
        isChrome: isChrome,
        isWebKit: isWebKit,
        isSafari: isSafari,
        isIE: isIE,
        isIE7: isIE7,
        isIE8: isIE8,
        isIE9: isIE9,
        isIE6: isIE6,
        isGecko: isGecko,
        isMac: isMac
    };
    QNR.clickLog = function(id, key) {
        var img = new Image();
        img.width = 1;
        img.height = 1;
        img.src = "http://bc.qunar.com/clk?s=" + id + "&a=" + key + "&t=" + Math.random();
    };
    /****
	 * 	重写日志
	 * **/
    QNR.DEBUG = false;
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function() {},
            info: function() {}
        };
    }
    win.QN = win.QNR;
    if (typeof define === "function") {
        define("js/common/CD", [], function(require, exports, module) {
            module.exports = QNR;
        });
    }
    /* ***
	 * 设置domain 为qunar.com
	 * 方便Storage 通信  广告设置
	 * ***/
    //document.domain = "qunar.com";
    /* ***
	  * 全局事件
	  * ***/
    QNR.PubSub = new QNR.Event();
})(window);
