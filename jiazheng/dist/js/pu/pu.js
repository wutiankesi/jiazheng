define("js/pu/pu", [ "jquery", "../common/placeholder", "../common/upload", "../common/CD", "../common/util", "../common/dialog", "../jvalidator/jvalidator", "../jvalidator/Validator", "../jvalidator/AsyncRequest", "../jvalidator/RuleParser" ], function(require, exports, module) {
    var $ = require("jquery");
    var placeholder = require("../common/placeholder");
    var upload = require("../common/upload");
    var util = require("../common/util");
    var jvalidator = require("../jvalidator/jvalidator");
    var base_var = {};
    var init = function() {
        var area_doms = $("#area-box div");
        $("input[placeholder]").placeholder();
        area_doms.mouseenter(function(e) {
            var dom = $(this);
            if (!dom.hasClass("area-selected")) {
                dom.addClass("area-hover");
            }
        }).mouseleave(function(e) {
            var dom = $(this);
            if (!dom.hasClass("area-selected")) {
                dom.removeClass("area-hover");
            }
        }).click(function(e) {
            var dom = $(this);
            if (!dom.hasClass("area-selected")) {
                dom.addClass("area-selected");
            } else {
                dom.removeClass("area-selected");
            }
        });
        var opts = {
            browse_button: "upload_btn",
            url: "/uploadf",
            multipart_params: {},
            file_data_name: "file",
            init: {
                FilesAdded: function() {
                    uploader.start();
                    uploader.refresh();
                },
                Error: function() {
                    console.log(arguments);
                }
            }
        };
        var uploader = upload.initUpload(opts);
        var form = $("#form1");
        var submit_btn = $("#submit_btn");
        var jv = form.jvalidator();
        jv.setMessage("select", "numeric", "请选择一项分类");
        submit_btn.click(function(e) {
            e.preventDefault();
            jv.validateAll(function(result, elements) {
                if (result) {
                    form.submit();
                } else {
                    var msg = [ "验证未通过." ];
                    for (var i = 0; i < elements.length; i++) {
                        msg.push(elements[i].getMessage());
                    }
                    util.showMsg(msg.join("\n"));
                }
            });
        });
        jv.when([ "blur" ]);
        jv.success(function() {
            $(this.element).css("border", "").next(".msg").hide();
        });
        jv.fail(function($event, errors) {
            $(this.element).css("border", "1px solid #f00").next(".msg").text(errors.getMessage()).show();
        });
    };
    exports.init = init;
});

/*! http://mths.be/placeholder v2.0.7 by @mathias */
(function(window, document, $) {
    // Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == "[object OperaMini]";
    var isInputSupported = "placeholder" in document.createElement("input") && !isOperaMini;
    var isTextareaSupported = "placeholder" in document.createElement("textarea") && !isOperaMini;
    var prototype = $.fn;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    if (isInputSupported && isTextareaSupported) {
        placeholder = prototype.placeholder = function() {
            return this;
        };
        placeholder.input = placeholder.textarea = true;
    } else {
        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this.filter((isInputSupported ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
                "focus.placeholder": clearPlaceholder,
                "blur.placeholder": setPlaceholder
            }).data("placeholder-enabled", true).trigger("blur.placeholder");
            return $this;
        };
        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;
        hooks = {
            get: function(element) {
                var $element = $(element);
                var $passwordInput = $element.data("placeholder-password");
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }
                return $element.data("placeholder-enabled") && $element.hasClass("placeholder") ? "" : element.value;
            },
            set: function(element, value) {
                var $element = $(element);
                var $passwordInput = $element.data("placeholder-password");
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }
                if (!$element.data("placeholder-enabled")) {
                    return element.value = value;
                }
                if (value == "") {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass("placeholder")) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };
        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }
        $(function() {
            // Look for forms
            $(document).delegate("form", "submit.placeholder", function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $(".placeholder", this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });
        // Clear placeholder values upon page reload
        $(window).bind("beforeunload.placeholder", function() {
            $(".placeholder").each(function() {
                this.value = "";
            });
        });
    }
    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }
    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr("placeholder") && $input.hasClass("placeholder")) {
            if ($input.data("placeholder-password")) {
                $input = $input.hide().next().show().attr("id", $input.removeAttr("id").data("placeholder-id"));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = "";
                $input.removeClass("placeholder");
                input == safeActiveElement() && input.select();
            }
        }
    }
    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == "") {
            if (input.type == "password") {
                if (!$input.data("placeholder-textinput")) {
                    try {
                        $replacement = $input.clone().attr({
                            type: "text"
                        });
                    } catch (e) {
                        $replacement = $("<input>").attr($.extend(args(this), {
                            type: "text"
                        }));
                    }
                    $replacement.removeAttr("name").data({
                        "placeholder-password": $input,
                        "placeholder-id": id
                    }).bind("focus.placeholder", clearPlaceholder);
                    $input.data({
                        "placeholder-textinput": $replacement,
                        "placeholder-id": id
                    }).before($replacement);
                }
                $input = $input.removeAttr("id").hide().prev().attr("id", id).show();
            }
            $input.addClass("placeholder");
            $input[0].value = $input.attr("placeholder");
        } else {
            $input.removeClass("placeholder");
        }
    }
    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (err) {}
    }
    if (typeof define !== "undefined") {
        define("js/common/placeholder", [], function(require, exports, module) {
            module.exports = placeholder;
        });
    }
})(this, document, jQuery);

define("js/common/upload", [ "js/common/CD" ], function(require, exports, module) {
    var CD = require("js/common/CD");
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

define("js/common/util", [ "js/common/dialog", "js/common/CD" ], function(require, exports, module) {
    var QNR = window.QNR;
    var Browser = QNR.Browser;
    var Dialog = require("js/common/dialog");
    var msg_dlg;
    var html = '<div class="b_dialog" style="width: 560px;"><div class="e_dialog_hd">提示</div><div class="e_dialog_ct js_content"></div><div class="e_dialog_ft"></div><a href="#" class="btn_close js_close" title="关闭">x</a></div>';
    var util = {
        getPages: function(pagger, _offset, _t_f_limit) {
            var max = pagger.max, now = pagger.now;
            var t_f_limit = _t_f_limit || 4, // 头部或尾部显示的个数
            f_offset = _offset, pages = [], gap = "...";
            if (t_f_limit >= max) {
                gap = "";
            }
            var s = Math.min(now + f_offset, max), l = Math.max(now - f_offset, 1);
            for (var i = l; i <= s; i++) {
                pages.push(i);
            }
            if (pages[0] > 2) {
                pages = [ 1, gap ].concat(pages);
            } else if (pages[0] == 2) {
                pages = [ 1 ].concat(pages);
            }
            var e_index = pages.length - 1, e_value = pages[e_index];
            if (e_value < max - 1) {
                pages.push(gap);
                pages.push(max);
            } else if (e_value == max - 1) {
                pages.push(max);
            }
            return pages;
        },
        bindInput: function() {
            //IE 下val("") 然后用Ctrl-V 触发不了 事件 待查
            if (Browser.isIE9) {
                return function(inp_dom, fn) {
                    var _timer = null;
                    var val;
                    inp_dom.bind("focus.inp", function() {
                        val = inp_dom.val();
                        _timer = setInterval(function() {
                            var now_val = inp_dom.val();
                            if (now_val !== val) {
                                val = now_val;
                                fn.call(inp_dom, now_val);
                            }
                        }, 100);
                        inp_dom.attr("inp_timer", _timer);
                    }).bind("blur.inp", function() {
                        val = null;
                        if (_timer) {
                            clearInterval(_timer);
                            _timer = null;
                        }
                        var now_val = inp_dom.val();
                        fn.call(inp_dom, now_val);
                    });
                };
            } else {
                return function(inp_dom, fn) {
                    var callback = function() {
                        var now_val = inp_dom.val();
                        fn.call(inp_dom, now_val);
                    };
                    inp_dom.bind({
                        "input.inp": callback,
                        "propertychange.inp": callback
                    });
                };
            }
        }(),
        fixImg: function(image, win_rect) {
            var width = image.width, height = image.height;
            var img_r = width / height;
            var win_r = win_rect.width / win_rect.height;
            var new_h, new_w;
            if (img_r > win_r) {
                new_h = Math.min(win_rect.height, height);
                new_w = new_h * img_r;
                image.style.marginLeft = -(new_w - win_rect.width) / 2 + "px";
                image.style.marginTop = -(new_h - win_rect.height) / 2 + "px";
            } else {
                new_w = Math.min(win_rect.width, width);
                //new_h = new_w * height / win_rect.height;
                new_h = new_w / img_r;
                image.style.marginLeft = -(new_w - win_rect.width) / 2 + "px";
                image.style.marginTop = -(new_h - win_rect.height) / 2 + "px";
            }
            image.style.width = new_w + "px";
            image.style.height = new_h + "px";
            image.style.maxWidth = "none";
        },
        imgLoad: function(img, callback) {
            if (img.complete) {
                callback.call(img);
                return;
            }
            img.onload = onerror = function() {
                callback.call(img);
            };
        },
        showMsg: function(msg, timer) {
            if (!msg_dlg) {
                msg_dlg = new Dialog({
                    content: html
                });
            }
            msg_dlg.getContent().html(msg);
            msg_dlg.show();
            var t = setTimeout(function() {
                msg_dlg.hide();
            }, timer || 3e3);
            return t;
        }
    };
    module.exports = util;
});

define("js/common/dialog", [ "js/common/CD" ], function(require, exports, module) {
    var QNR = require("js/common/CD");
    if (QNR.Dialog) {
        return;
    }
    var _isIE = QNR.Browser.isIE, _isIE6 = QNR.Browser.isIE6, $doc = $(window.document), $body = $("body"), $win = $(window);
    var IE6_LEFT_OFFSET = 16;
    //IE6下滑动条的宽度
    var _isMac = QNR.Browser.isMac;
    var hasScroll = false;
    //防止引用JS文件在head 里取不到body
    $(function() {
        $body = $("body");
    });
    //背景 前景 
    var dlg_mask_html = '<div class="dlg_mask"></div>', dlg_box_html = '<div class="g_dlg_box"></div>';
    var dlgid = "dlg", mids = ids = 0, _d_zindex = 1e5;
    var def_config = {
        content: "",
        maskVisible: true,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        newMask: false,
        contentStyle: "",
        borderStyle: "",
        // border样式 
        titleStyle: "",
        //标题样式
        closeCls: "",
        //关闭按钮 class 如果有会替换掉 原来的 dlg_close 
        closeBtn: {
            handler: function(dlg) {
                dlg.close();
            }
        },
        hideCloseBtn: false
    };
    // mix config setting.
    var mix_cfg = function(n, d) {
        var cfg = {}, i;
        for (i in d) {
            if (d.hasOwnProperty(i)) {
                cfg[i] = typeof n[i] !== "undefined" ? n[i] : d[i];
            }
        }
        return cfg;
    };
    var getWinRect = function() {
        var win = $win;
        return {
            scrollTop: $doc.scrollTop(),
            scrollLeft: $doc.scrollLeft(),
            width: win.width(),
            height: win.height()
        };
    };
    var _mask_id = "dlg_mask_";
    var Mask = function() {
        this.id = _mask_id + ++mids;
        this._dom = $('<div id="' + this.id + '" class="dlg_mask" style="z-index:' + ++_d_zindex + '"></div>');
        this._init();
    };
    Mask.prototype = {
        _init: function() {
            $body.append(this._dom);
            this._dom.hide();
            this._initEvents();
            this.adaptWin();
            if (this._needIframe() || true) {
                this._createIframe();
            }
        },
        _initEvents: function() {
            var me = this;
        },
        _createIframe: function() {
            this._iframe = $('<iframe class="dlg_miframe" frameborder="0" src="about:blank"></iframe>');
            this._dom.append(this._iframe);
        },
        addClass: function(clsName) {
            this._dom.addClass(clsName);
        },
        /**
			 * 检测自动生成iframe条件
			 *
			 * @method
			 * @protected
			 * @param void
			 * @return {bool}
			 */
        _needIframe: function() {
            var useIframe = !!window.ActiveXObject && (_isIE6 && $("select").length || $("object").length);
            return useIframe;
        },
        adaptWin: function() {
            if (_isIE6) {
                this._dom.css({
                    top: $doc.scrollTop(),
                    left: $doc.scrollLeft(),
                    height: $win.height(),
                    width: $win.width()
                });
            }
        },
        hide: function() {
            this._dom.hide();
            var html_dom = $("html").css("overflow", "");
            if (_isMac == false) {
                if (hasScroll) {
                    html_dom.css("padding-right", "0px");
                }
            }
        },
        show: function() {
            var me = this;
            var wa = $win.width();
            var html_dom = $("html").css("overflow", "hidden");
            var wb = $win.width();
            me._dom.show();
            if (_isMac == false) {
                if (wa != wb) {
                    hasScroll = true;
                    html_dom.css("padding-right", IE6_LEFT_OFFSET + "px");
                }
            }
        },
        getDom: function() {
            return this._dom;
        },
        remove: function() {
            this._dom.remove();
        }
    };
    var most_mask;
    //公共的Mask
    var Dialog = function(cfg) {
        var c = cfg || {};
        this.config = mix_cfg(c, def_config);
        this._init();
    };
    Dialog.prototype = {
        constructor: Dialog,
        _init: function() {
            if (!this.config) {
                return;
            }
            this.id = dlgid + ++ids;
            var cfg = this.config;
            if (cfg.newMask) {
                this._mask = new Mask();
            } else {
                if (!most_mask) {
                    most_mask = new Mask();
                    this._mask = most_mask;
                } else {
                    this._mask = most_mask;
                }
            }
            this._creatDialog();
            this._initEvents();
            this.inited = true;
        },
        _initEvents: function() {
            var me = this, id = this.id;
            this._closeBtn.bind({
                click: function(e) {
                    e.preventDefault();
                    me.config.closeBtn.handler.call(me, me);
                }
            });
            $win.bind("resize." + id, resize);
            me._unbindEvents = function() {
                $win.unbind("resize." + id);
            };
            function resize() {
                if (_isIE6) {
                    me._dlg_container.css({
                        top: $doc.scrollTop(),
                        left: $doc.scrollLeft(),
                        width: $win.width(),
                        height: $win.height()
                    });
                } else {
                    me._dlg_container.css({
                        width: $win.width(),
                        height: $win.height()
                    });
                }
                me.toCenter();
                me._mask.adaptWin();
            }
        },
        _creatDialog: function() {
            var cfg = this.config;
            var dlg_container = this._dlg_container = $(dlg_box_html).attr("id", this.id).css("z-index", _d_zindex += 10);
            if (cfg.content instanceof $) {
                this._dialog = cfg.content;
            } else {
                this._dialog = $(cfg.content);
            }
            var dlg = this._dialog;
            dlg.addClass("g_dlg_wrap_css3");
            dlg_container.html(dlg);
            this._content = $(".js_content", dlg);
            this._closeBtn = $(".js_close", dlg);
            $body.append(dlg_container);
            if (cfg.hideCloseBtn) {
                this._closeBtn.hide();
            }
            var pos = "fixed";
            if (_isIE6) {
                dlg_container.css({
                    top: $doc.scrollTop(),
                    left: $doc.scrollLeft(),
                    width: $win.width(),
                    height: $win.height()
                });
                pos = "absoulte";
            } else {
                dlg_container.css({
                    width: $win.width(),
                    height: $win.height()
                });
            }
            dlg.css("position", "absolute");
            this.setPos(pos);
        },
        setPos: function(pos) {
            this._dlg_container.css("position", pos);
        },
        //得到content 返回jQuery 对象
        getContainer: function() {
            return this._dlg_container;
        },
        getContent: function() {
            return this._content;
        },
        setContent: function(dom) {
            this._content.empty();
            this._content.html(dom);
        },
        getCloseBtn: function() {
            return this._closeBtn;
        },
        _setStyle: function(dom, css) {
            if (typeof css == "string") {
                if (_isIE) {
                    dom[0].style.cssText = css;
                } else {
                    dom.attr("style", css);
                }
            } else {
                dom.css(css);
            }
        },
        toCenter: function() {
            var winRect = getWinRect(), w = this._dialog.width(), h = this._dialog.height(), t = 0, l = 0;
            var top = Math.max(winRect.height / 2 - h / 2 >> 0 + t, 0);
            var left = winRect.width / 2 - w / 2 >> 0 + l;
            if (_isIE6) {
                left -= IE6_LEFT_OFFSET / 2;
            }
            var rect = {
                left: left,
                top: top
            };
            this._dialog.css(rect);
            return this;
        },
        show: function(callback, context) {
            var me = this;
            if (me.config.maskVisible) {
                me._mask.show();
            }
            //IE8 以下计算窗口宽度
            me._dlg_container.css({
                width: $win.width(),
                height: $win.height()
            });
            me._dlg_container.show();
            me.toCenter();
            if (callback) {
                callback.call(context || me, me);
            }
            me.showed = true;
            return this;
        },
        close: function(callback, context) {
            var me = this;
            this._mask.hide();
            this._dlg_container.hide();
            if (callback) {
                callback.call(context || me, me);
            }
            this.showed = false;
            return this;
        },
        destory: function() {
            this.close();
            this._unbindEvents();
            this.config.newMask && this._mask.remove();
            this._dlg_container.remove();
            this._dialog.remove();
            for (var i in this) {
                delete this[i];
            }
        },
        getMask: function() {
            return this._mask;
        }
    };
    Dialog.prototype.In = Dialog.prototype.show;
    Dialog.prototype.out = Dialog.prototype.close;
    Dialog.prototype.hide = Dialog.prototype.close;
    Dialog.prototype.remove = Dialog.prototype.destory;
    QNR.Dialog = Dialog;
    /***
		 *公用提示弹框
		 ***/
    QNR.popMsg = function(msg) {
        var dia = new Dialog({
            maskVisible: false,
            newMask: true,
            content: [ '<div class="pop_msg" style="position:relative;" ><table><tr><td>', msg, '</td></tr></table><i class="js_close" style="position:absolute;width:16px;height:20px;right:5px;top:5px;"></i></div>' ].join(""),
            closeBtn: {
                handler: function(dlg) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    dlg.remove();
                }
            }
        });
        dia.show();
        var timer = setTimeout(function() {
            dia.remove();
        }, 1500);
    };
    module.exports = Dialog;
});

define("js/jvalidator/jvalidator", [ "js/jvalidator/Validator", "js/jvalidator/AsyncRequest", "js/jvalidator/RuleParser" ], function(require, exports, module) {
    var v = require("js/jvalidator/Validator");
    var validFunc = {
        /***
     * 值:
     * 1 无错误 
     * -1 长度错误
     * -2 验证错误 
     */
        ID: function(num) {
            num = num.toUpperCase();
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
            if (!/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(num)) {
                return -1;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            //下面分别分析出生日期和校验位 
            var len, re;
            len = num.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = num.match(re);
                //检查生日日期是否正确 
                var dtmBirth = new Date("19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay = dtmBirth.getYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);
                if (!bGoodDay) {
                    return -2;
                } else {
                    return 1;
                }
            }
            if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})(\d|X)$/);
                var arrSplit = num.match(re);
                //检查生日日期是否正确 
                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay = dtmBirth.getFullYear() == Number(arrSplit[2]) && dtmBirth.getMonth() + 1 == Number(arrSplit[3]) && dtmBirth.getDate() == Number(arrSplit[4]);
                if (!bGoodDay) {
                    return -2;
                } else {
                    //检验18位身份证的校验码是否正确。 
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                    var valnum;
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                    var nTemp = 0, i;
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[nTemp % 11];
                    if (valnum != num.substr(17, 1)) {
                        return -2;
                    }
                    return 1;
                }
            }
            return -2;
        }
    };
    v.addPattern("required", {
        message: "必须填写",
        validate: function(value, done) {
            done(value !== "");
        }
    });
    v.addPattern("non-required", {
        message: "允许为空",
        validate: function(value, done) {
            done(value === "");
        }
    });
    v.addPattern("numeric", {
        message: "必须是数字",
        validate: function(value, done) {
            done(/^\d+$/.test(value));
        }
    });
    v.addPattern("int", {
        message: "必须是整数",
        validate: function(value, done) {
            done(/^\-?\d+$/.test(value));
        }
    });
    v.addPattern("decimal", {
        message: "必须是小数",
        validate: function(value, done) {
            done(/^\-?\d*\.?\d+$/.test(value));
        }
    });
    v.addPattern("alpha", {
        message: "必须是字母",
        validate: function(value, done) {
            done(/^[a-z]+$/i.test(value));
        }
    });
    v.addPattern("alpha_numeric", {
        message: "必须为字母或数字",
        validate: function(value, done) {
            done(/^[a-z0-9]+$/i.test(value));
        }
    });
    v.addPattern("alpha_dash", {
        message: "必须为字母或数字及下划线等特殊字符",
        validate: function(value, done) {
            done(/^[a-z0-9_\-]+$/i.test(value));
        }
    });
    v.addPattern("chs", {
        message: "必须是中文字符",
        validate: function(value, done) {
            done(/^[\\u4E00-\\u9FFF]+$/i.test(value));
        }
    });
    v.addPattern("chs_numeric", {
        message: "必须是中文字符或数字",
        validate: function(value, done) {
            done(/^[\\u4E00-\\u9FFF0-9]+$/i.test(value));
        }
    });
    v.addPattern("chs_numeric", {
        message: "必须是中文字符或数字及下划线等特殊字符",
        validate: function(value, done) {
            done(/^[\\u4E00-\\u9FFF0-9_\-]+$/i.test(value));
        }
    });
    v.addPattern("match", {
        argument: true,
        message: "必须与 %argu 相同",
        validate: function(value, done) {
            var v = this.getValueSymbol();
            var vv = v && v.tagName ? this.getElementValue(v) : v;
            done(vv === value);
        }
    });
    v.addPattern("contain", {
        argument: true,
        message: '必须包含"%argu"的内容',
        validate: function(value, done) {
            var v = this.getValueSymbol();
            var vv = v && v.tagName ? this.getElementValue(v) : v;
            done(!!~value.indexOf(vv));
        }
    });
    v.addPattern("@", {
        argument: true,
        message: "@@必须为 %argu",
        validate: function(value, done) {
            var v = this.getValueSymbol();
            var at = this.getNameSymbol();
            if (v === null || at === null) {
                done(false);
            } else {
                var vv = v && v.tagName ? this.getElementValue(v) : v;
                var vat = at && at.tagName ? this.getElementValue(at) : at;
                done(vv === vat);
            }
        }
    });
    v.addPattern("idcard", {
        message: "身份证格式错误",
        validate: function(value, done) {
            done(validFunc.ID(value) === 1);
        }
    });
    v.addPattern("passport", {
        message: "护照格式错误或过长",
        validate: function(value, done) {
            done(/^[a-zA-Z0-9]{0,20}$/i.test(value));
        }
    });
    v.addPattern("email", {
        message: "邮件地址错误",
        validate: function(value, done) {
            done(/^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/.test(value));
        }
    });
    v.addPattern("min_length", {
        argument: true,
        message: "最少输入%argu个字",
        validate: function(value, done) {
            var n = parseInt(this.value, 10);
            done(value.length >= n);
        }
    });
    v.addPattern("max_length", {
        argument: true,
        message: "最多输入%argu个字",
        validate: function(value, done) {
            var n = parseInt(this.value, 10);
            done(value.length <= n);
        }
    });
    v.addPattern("length", {
        argument: true,
        message: "长度必须为%argu个字符",
        validate: function(value, done) {
            var n = parseInt(this.value, 10);
            done(value.length === n);
        }
    });
    v.addPattern("greater_than", {
        argument: true,
        message: "必须大于%argu",
        validate: function(value, done) {
            var v = parseInt(value, 10);
            var n = this.parseNameSymbol(this.value);
            n = parseFloat(n && n.tagName ? this.getElementValue(n) : this.value);
            done(v > n);
        }
    });
    v.addPattern("less_than", {
        argument: true,
        message: "必须小于%argu",
        validate: function(value, done) {
            var v = parseInt(value, 10);
            var n = this.parseNameSymbol(this.value);
            n = parseFloat(n && n.tagName ? this.getElementValue(n) : this.value);
            done(v < n);
        }
    });
    v.addPattern("equal", {
        argument: true,
        message: "必须等于%argu",
        validate: function(value, done) {
            var v = parseInt(value, 10);
            var n = this.parseNameSymbol(this.value);
            n = parseFloat(n && n.tagName ? this.getElementValue(n) : this.value);
            done(v == n);
        }
    });
    v.addPattern("ip", {
        message: "必须符合ip格式",
        validate: function(value, done) {
            done(/^((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.){3}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/i.test(value));
        }
    });
    v.addPattern("date", {
        message: "必须符合日期格式 YYYY-MM-DD",
        validate: function(value, done) {
            done(/^\d\d\d\d\-\d\d\-\d\d$/.test(value));
        }
    });
});

define("js/jvalidator/Validator", [ "js/jvalidator/AsyncRequest", "js/jvalidator/RuleParser" ], function(require, exports, module) {
    var Async = require("js/jvalidator/AsyncRequest");
    var parser = require("js/jvalidator/RuleParser");
    var PATTERNS = {};
    var CONSTANT = {
        PATTERN: "jvalidator-pattern",
        PLACEHOLDER: "jvalidator-placeholder",
        CNAME: "jvalidator-cname",
        MESSAGE_ATTR: "__jvalidator_messages__",
        FIELD_EVENTS: "__jvalidator_events__",
        DEBUG: "jvalidator-debug"
    };
    // ## 字段检查器
    // 绑定到某个字段后，对其进行检查等操作
    function FieldChecker(element) {
        this.element = element;
        this.$element = $(element);
        this.$form = this.$element.closest("form");
        this.async = new Async();
    }
    FieldChecker.prototype = {
        _getPatternMessage: function(results) {
            var rstr = [];
            for (var i = 0; i < results.length; i++) {
                var p = results[i];
                if (p.name) {
                    rstr.push(p.getMessage());
                } else {
                    switch (p) {
                      case "&&":
                        rstr.push(" 并且 ");
                        break;

                      case "||":
                        rstr.push(" 或者 ");
                        break;

                      case "!":
                        rstr.push("不");
                        break;
                    }
                }
            }
            return rstr.join("");
        },
        // 检查生成结果并返回错误信息
        // return errors
        _checkPatternResult: function(str, results) {
            var self = this;
            var rstr = [];
            for (var i = 0; i < results.length; i++) {
                var p = results[i];
                if (p.name) {
                    rstr.push(p.result);
                } else {
                    rstr.push(p);
                }
            }
            if (this.$form.data(CONSTANT.DEBUG)) {
                console.info(this, this.element, str, rstr.join(""));
            }
            var all = eval(rstr.join(""));
            if (all) {
                return [];
            } else {
                var arr = $.grep(results, function(e, idx) {
                    return e.name && e.result === false;
                });
                arr.getMessage = function() {
                    return self._getPatternMessage(results);
                };
                return arr;
            }
        },
        // 验证自身的 pattern 是否合法以及是否满足所有项，以供开发自测使用
        checkPattern: function() {
            var $e = this.$element;
            var rule_str = $e.data(CONSTANT.PATTERN);
            try {
                var patterns = parser.parse(rule_str);
            } catch (e) {
                console.error(this.element, "验证器语法有错误，请检查", rule_str);
                console.error("错误可能是：", e);
            }
        },
        // * done *
        //  可以不传，即为触发检查 
        //  `checkResult` boolean 检查结果 
        //  `evt` 为触发的事件，可以没有
        //  `errors` array 错误信息
        check: function($event, checkCallback) {
            var self = this;
            var async = this.async;
            var e = this.element;
            var $e = this.$element;
            var value = this.value();
            var rule_str = $e.data(CONSTANT.PATTERN);
            var patterns = parser.parse(rule_str);
            async.clear();
            async.onfinished = function() {
                var errors = self._checkPatternResult(rule_str, patterns);
                if (checkCallback) {
                    checkCallback(errors.length == 0, errors);
                }
                self.after_check(errors.length == 0, errors, $event);
            };
            $.each(patterns, function() {
                // 跳过所有计算变量
                if (!this.name) return;
                // p 其中包括
                // argument - 可能有
                // message - 原始的message设置 
                // validate - 验证规则 
                // rule_str解析出来的内容 name(同patternName) , elemName(@才会有) , value(pattern的属性值)
                // element - 对应的 element
                // result - 验证后，会对该项设置 true 或 false
                var p = $.extend(this, {
                    element: self.element,
                    $element: self.$element,
                    $form: self.$form,
                    getMessage: function() {
                        return self._getMessage.call(this, value);
                    },
                    // 用来解析 parsedstr(它是带有@的内容) 的值，解析成功就返回那个 element ，否则返回 null
                    parseNameSymbol: function(parsedstr) {
                        if (parsedstr.charAt(0) !== "@") return null;
                        return this.$form.find(_parse_selector_syntax(parsedstr))[0];
                    },
                    // 当 pattern 是 @xx[xx] 时， 则可以通过该方法取得 @ 对应的元素
                    getNameSymbol: function() {
                        return this.parseNameSymbol("@" + this.elemName);
                    },
                    // 当 pattern 是 xx[xx] 时， 则可以通过该方法取得括号中的值
                    // 如果值为 @xxx , 则返回该元素
                    // 否则返回值
                    getValueSymbol: function() {
                        var el = this.parseNameSymbol(this.value);
                        return el ? el : this.value;
                    },
                    getElementValue: function(el) {
                        el = $(el)[0];
                        if (!el) return "";
                        var jv = _getFieldValidator(el);
                        return jv ? jv.value() : self.value.call({
                            element: el,
                            $element: $(el),
                            $form: self.$form
                        });
                    },
                    // 得到元素的 cname 或 name
                    getElementName: function(el) {
                        var $el = $(el);
                        if ($el.data(CONSTANT.CNAME)) {
                            return $el.data(CONSTANT.CNAME);
                        } else {
                            return $el.attr("name");
                        }
                        return "";
                    }
                }, PATTERNS[this.name]);
                (function(p) {
                    async.addRequest(function(async_continue) {
                        // isvalid - 是否验证成功
                        p.validate(value, function(is_valid) {
                            p.result = is_valid;
                            async_continue();
                        });
                    });
                })(p);
            });
            async.go();
        },
        // 根据 patternName 得到错误信息
        // 优先级为：字段的message设置 > pg的message设置 > pattern的标准设置 
        // * value * 为值，如果不传则重新获取
        // * 由 p 进行调用
        _getMessage: function(value) {
            var self = this;
            var patternName = this.name;
            var e = this.element;
            var $e = this.$element;
            var $f = this.$form;
            var v = value || _getFieldValidator(e).value();
            var msg_tmpl = (e[CONSTANT.MESSAGE_ATTR] ? e[CONSTANT.MESSAGE_ATTR][patternName] : null) || ($f[0][CONSTANT.MESSAGE_ATTR] ? $f[0][CONSTANT.MESSAGE_ATTR][patternName] : null) || PATTERNS[patternName].message;
            msg_tmpl = msg_tmpl.replace(/%val\b/g, v);
            msg_tmpl = msg_tmpl.replace(/%name\b/g, e.name);
            msg_tmpl = msg_tmpl.replace(/%cname\b/g, $e.data(CONSTANT.CNAME));
            msg_tmpl = msg_tmpl.replace(/=%argu\b/g, function() {
                var v = self.parseNameSymbol(self.value);
                return v && v.tagName ? self.getElementValue(v) : self.value;
            });
            msg_tmpl = msg_tmpl.replace(/%argu\b/g, function() {
                var v = self.parseNameSymbol(self.value);
                return v && v.tagName ? self.getElementName(v) : self.value;
            });
            msg_tmpl = msg_tmpl.replace(/@@/g, function($0, $1) {
                var el = $f.find(_parse_selector_syntax("@" + self.elemName))[0];
                if (!el) {
                    return "";
                } else {
                    var $el = $(el);
                    if ($el.data(CONSTANT.CNAME)) {
                        return $el.data(CONSTANT.CNAME);
                    } else {
                        return $el.attr("name");
                    }
                }
            });
            msg_tmpl = msg_tmpl.replace(/=@([^\s]*)\b/g, function($0, $1) {
                return self.getElementValue($f.find("[name=" + $1 + "]"));
            });
            msg_tmpl = msg_tmpl.replace(/@([^\s]*)\b/g, function($0, $1) {
                return self.getElementName($f.find("[name=" + $1 + "]")) || "";
            });
            return msg_tmpl;
        },
        // 根据不同的字段类型，取得 element 的值
        value: function() {
            var e = this.element, $e = this.$element, $form = this.$form, placeholdertext;
            switch (e.tagName.toLowerCase()) {
              case "input":
                switch (e.type) {
                  case "radio":
                    return $form.find("input[name=" + e.name + "]:radio:checked").val();

                  case "checkbox":
                    return $form.find("input[name=" + e.name + "]:checkbox:checked").map(function() {
                        return this.value;
                    }).toArray().join(",");

                  case "text":
                    placeholdertext = $e.data(CONSTANT.PLACEHOLDER);
                    return placeholdertext === e.value ? "" : e.value;

                  case "hidden":
                  case "password":
                    return e.value;
                }
                break;

              case "select":
                return e.value;

              case "textarea":
                placeholdertext = $e.data(CONSTANT.PLACEHOLDER);
                return placeholdertext === e.value ? "" : e.value;
            }
        },
        // 触发自验证行为
        after_check: function(is_valid, errors, $event) {
            var type = is_valid ? "success" : "fail";
            var evt = this.$element.data(CONSTANT.FIELD_EVENTS + type);
            if (!evt) evt = this.$form.data(CONSTANT.FIELD_EVENTS + type);
            if (!evt || typeof evt != "function") return;
            evt.call(this, $event, errors);
        }
    };
    // ## 表单验证器
    function FormValidator(form) {
        if (!form) throw "[ERROR] form 参数必须存在.";
        if (form.tagName !== "FORM") throw "[ERROR] 参数 form 必须是个表单元素.";
        this.form = form;
        this.$form = $(form);
        this.async = new Async();
    }
    // 判断元素可见并存在
    function _exists(el) {
        return $(el).closest("body").size() > 0 && $(el).is(":visible");
    }
    // 得到指定元素的jvalidator
    function _getFieldValidator(el) {
        if (!$(el).data(CONSTANT.PATTERN)) return;
        return el._field_validator ? el._field_validator : el._field_validator = new FieldChecker(el);
    }
    // 解析 when 中的支持 @name 的 selector 语法 
    function _parse_selector_syntax(selector) {
        return (selector || "").replace(/@([a-z][a-z0-9]*)\b/gi, "[name=$1]");
    }
    FormValidator.prototype = {
        // 得到所有需要验证的字段（非隐藏且不为disabled）
        _getAllFieldValidator: function() {
            var self = this;
            return this.$form.find("[data-" + CONSTANT.PATTERN + "]").filter(function() {
                return _exists(this) && !this.disabled;
            }).map(function() {
                return _getFieldValidator(this);
            }).toArray();
        },
        // 验证本表单中所有元素的 pattern 是否正确
        checkAllPatterns: function() {
            var _jvs = this._getAllFieldValidator();
            $.each(_jvs, function() {
                this.checkPattern();
            });
        },
        // 验证表单内所有字段
        validateAll: function(validateAllCallback) {
            var $form = this.$form;
            var async = this.async;
            var _jvs = this._getAllFieldValidator();
            var errors = [];
            async.clear();
            async.onfinished = function() {
                validateAllCallback && validateAllCallback(errors.length == 0, errors);
            };
            // 当没有任何可以验证的字段时直接返回
            if (!_jvs.length) {
                return validateAllCallback(true, []);
            }
            for (var i = 0; i < _jvs.length; i++) {
                var jv = _jvs[i];
                (function(jv) {
                    async.addRequest(function(async_continue) {
                        jv.check(null, function(checkResult, error) {
                            if (!checkResult) {
                                errors.push(error);
                            }
                            async_continue();
                        });
                    });
                })(jv);
            }
            async.go();
        },
        // 当你需要字段自触发验证时，比如：input blur时需要验证，请使用该方法.
        // selector 是需要自触发验证的字段 - 如果不写则默认全部。<br />
        // evts 有两种写法:
        // ##### 第一种：
        // > [ 'blur' , 'focus' , 'keypress' ] 
        // 
        // 代表 selector 的 [ 'blur' , 'focus' , 'keypress' ] 事件会触发 selector 的验证
        // 
        // ##### 第二种：
        // > \{ <br />
        // >     '@sel' : [ 'blur' , 'keypress' ]
        // > \} <br />
        // 
        // 代表 由@sel 的 [ 'blur' , 'keypress' ] 事件会触发 selector 的验证
        when: function(selector, evts) {
            if (typeof selector != "string") {
                evts = selector;
                selector = "";
            }
            var events = {};
            var sel = selector || "[data-" + CONSTANT.PATTERN + "]";
            if ($.isArray(evts)) {
                events[sel] = evts;
            } else if ($.isPlainObject(evts)) {
                $.extend(events, evts);
            }
            // 处理 checkbox 和 radio
            var chks = this.$form.find(sel).find("input:checkbox");
            if (chks.length) {
                chks.each(function() {
                    sel += "," + _parse_selector_syntax("@" + this.name);
                });
            }
            var rdos = this.$form.find(sel).find("input:radio");
            if (rdos.length) {
                rdos.each(function() {
                    sel += "," + _parse_selector_syntax("@" + this.name);
                });
            }
            for (var targetSelector in events) {
                var _sel = _parse_selector_syntax(targetSelector);
                var _evts = events[targetSelector] || [];
                if (!_evts.length) continue;
                _evts = _evts.join(" ");
                this.$form.undelegate(_sel, _evts);
                this.$form.delegate(_sel, _evts, function($event) {
                    var jv = _getFieldValidator(this);
                    jv && jv.check($event);
                });
            }
        },
        setMessage: function(selector, patternName, msg) {
            if (arguments.length == 2) {
                msg = patternName;
                patternName = selector;
                selector = null;
            }
            var c, f = this.$form[0];
            if (!selector) {
                c = f[CONSTANT.MESSAGE_ATTR] = f[CONSTANT.MESSAGE_ATTR] || {};
                c[patternName] = msg;
            } else {
                this.$form.find(_parse_selector_syntax(selector)).each(function() {
                    var e = this;
                    c = e[CONSTANT.MESSAGE_ATTR] = e[CONSTANT.MESSAGE_ATTR] || {};
                    c[patternName] = msg;
                });
            }
        },
        success: function(selector, fn) {
            this._bind_field_event("success", selector, fn);
        },
        fail: function(selector, fn) {
            this._bind_field_event("fail", selector, fn);
        },
        _bind_field_event: function(type, selector, fn) {
            if (!type) return;
            if (typeof selector == "function") {
                fn = selector;
                selector = null;
            }
            if (selector) {
                var sel = _parse_selector_syntax(selector);
                this.$form.find(sel).each(function() {
                    $(this).data(CONSTANT.FIELD_EVENTS + type, fn);
                });
            } else {
                this.$form.data(CONSTANT.FIELD_EVENTS + type, fn);
            }
        }
    };
    $.fn.jvalidator = function() {
        var form = $(this).first();
        if (form.data("FormValidator")) return form.data("FormValidator");
        var fv = new FormValidator(form[0]);
        form.data("FormValidator", fv);
        return fv;
    };
    // 设置增加自定义 pattern 的入口
    function addPattern(name, options) {
        if (!name) throw "[ERROR] add pattern - no name";
        if (!options) throw "[ERROR] add pattern - no options";
        if (!options.message) throw "[ERROR] add pattern - no message";
        if (!options.validate) throw "[ERROR] add pattern - no validate";
        PATTERNS[name] = $.extend({
            name: name
        }, options);
        parser.add(name, options);
    }
    exports.addPattern = addPattern;
    $.extend({
        jvalidator: {
            addPattern: addPattern
        }
    });
});

define("js/jvalidator/AsyncRequest", [], function(require, exports, module) {
    var AsyncRequest = function() {
        this.reqs = [];
        this.status = 0;
    };
    AsyncRequest.prototype.addRequest = function(func) {
        if (this.status != 0) return;
        this.reqs.push(func);
    };
    AsyncRequest.prototype.go = function() {
        if (this.status != 0) return;
        this.status = 1;
        var self = this;
        var reqs = this.reqs;
        var len = this.reqs.length;
        for (var i = 0; i < reqs.length; i++) {
            var req = reqs[i];
            if (this.status == 0) return;
            req(function() {
                //async_continue
                len--;
                if (len == 0) {
                    self.finish();
                }
            });
        }
    };
    AsyncRequest.prototype.finish = function() {
        this.status = 0;
        if (this.onfinished) {
            this.onfinished();
        }
    };
    AsyncRequest.prototype.clear = function() {
        if (this.status != 0) return;
        this.reqs = [];
    };
    module.exports = AsyncRequest;
});

define("js/jvalidator/RuleParser", [], function(require, exports, module) {
    var PARSER = {};
    function _tokenized(str) {
        var s = [];
        for (var i = 0; i < str.length; i++) {
            var chr = str.charAt(i);
            switch (chr) {
              case "(":
              case ")":
              case "!":
              case "&":
              case "|":
                s.push(chr);
                s.push("");
                break;

              default:
                s.length ? s[s.length - 1] += chr : s.push(chr);
                break;
            }
        }
        return s;
    }
    var regName = /^(@?[\w\-]+)(\[.+\])?$/;
    function _parse(tokens) {
        var ast = [];
        var o = null;
        var token;
        while ((token = tokens.shift()) !== void 0) {
            if (!token) {
                continue;
            }
            switch (token) {
              case "(":
              case ")":
              case "!":
              case "&":
              case "|":
                ast.push(token);
                break;

              default:
                var a = token.match(regName);
                if (!a) continue;
                if (a[1].charAt(0) == "@") {
                    o = {
                        name: "@",
                        elemName: a[1].replace("@", "")
                    };
                } else {
                    o = {
                        name: a[1]
                    };
                }
                if (!PARSER[o.name]) {
                    throw "not found parser's name : " + o.name;
                }
                if (a[2]) o.value = a[2].replace("[", "").replace("]", "");
                ast.push(o);
                o = null;
                break;
            }
        }
        return ast;
    }
    // 增加解析器
    // *name* 解析器名称
    // *options.argument* 带有参数，默认没有
    exports.add = function(name, options) {
        PARSER[name] = options || {};
        PARSER[name].name = name;
    };
    exports.parse = function(str) {
        var tokens = _tokenized(str);
        var ast = _parse(tokens);
        return ast;
    };
});
