define("js/detail/dianping", [ "jquery", "../common/util", "../common/dialog", "../common/CD" ], function(require, exports, module) {
    var $ = require("jquery");
    var util = require("../common/util");
    function initDp() {
        var total_con = $("#total_con");
        var msg = total_con.find(".msg");
        var score;
        var a_s = total_con.find("li a").bind({
            mouseenter: function(e) {
                a_s.removeClass("active-star");
                $(this).addClass("active-star");
                msg.text(this.title).show();
            },
            mouseleave: function(e) {
                $(this).removeClass("active-star");
                msg.text(this.title).hide();
                if (typeof score !== "undefined") {
                    var obj = a_s.eq(score - 1);
                    obj.addClass("active-star");
                    msg.text(obj.attr("title")).show();
                }
            },
            click: function(e) {
                e.preventDefault();
                var obj = $(this);
                score = obj.data("value");
                obj.addClass("active-star");
            }
        });
        var comment_form = $("#comment_form");
        var com_input = $("#com");
        var btn = comment_form.find("button.btn");
        $("#ktp").click(function(e) {
            e.preventDefault();
            this.src = "/kaptcha?_t=" + new Date().getTime();
        }).mouseenter(function(e) {
            this.style.cursor = "pointer";
            $(this).parent().siblings(".msg").text("点击刷新验证码").show();
        }).mouseleave(function(e) {
            $(this).parent().siblings(".msg").hide();
        });
        util.bindInput(com_input, function(val) {
            var msg = this.parent().find(".msg");
            if (val.length > 360) {
                msg.html("最多只能输入360字").show();
            } else {
                msg.hide();
            }
        });
        btn.click(function(e) {
            if (score == null) {
                util.showMsg("打个分吧~");
                return;
            }
            if (!$.trim(com_input.val())) {
                util.showMsg("评价不能为空~");
                return;
            } else if ($.trim(com_input.val()) > 360) {
                util.showMsg("最多只能输入360字");
                return;
            }
            console.log("score===", score, com_input.val());
        });
        function reset() {
            score = null;
            com_input.val("");
            $("#ktp").click();
        }
    }
    exports.initDp = initDp;
});

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
