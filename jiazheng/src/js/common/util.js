define(function(require, exports, module) {
    var QNR = window.QNR;
    var Browser = QNR.Browser;
	var util = {

		getPages: function(pagger, _offset, _t_f_limit) {
			var max = pagger.max,
			now = pagger.now;

			var t_f_limit = _t_f_limit || 4,
			// 头部或尾部显示的个数
			f_offset = _offset,
			pages = [],
			gap = "...";

			if (t_f_limit >= max) {
				gap = "";
			}

			var s = Math.min(now + f_offset, max),
			l = Math.max(now - f_offset, 1);
			for (var i = l; i <= s; i++) {
				pages.push(i);
			}

			if (pages[0] > 2) {
				pages = [1, gap].concat(pages);
			} else if (pages[0] == 2) {
				pages = [1].concat(pages);
			}
			var e_index = pages.length - 1,
			e_value = pages[e_index];
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
						},
						100);
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
					}
					inp_dom.bind({
						"input.inp": callback,
						"propertychange.inp": callback
					});
				}
			}
		} (),
		fixImg: function(image, win_rect) {
			var width = image.width,
			height = image.height;
			var img_r = width / height;
			var win_r = win_rect.width / win_rect.height;
			var new_h, new_w;
			if (img_r > win_r) {
				new_h = Math.min(win_rect.height,height);
				new_w = new_h * img_r;
				image.style.marginLeft = - (new_w - win_rect.width) / 2 + "px";
				image.style.marginTop = - (new_h - win_rect.height) / 2 + "px";
			} else {
				new_w = Math.min(win_rect.width , width);
				//new_h = new_w * height / win_rect.height;
				new_h = new_w / img_r;
				image.style.marginLeft = - (new_w - win_rect.width) / 2 + "px";
				image.style.marginTop = - (new_h - win_rect.height) / 2 + "px";
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
			}
		},
		showMsg: function(msg, timer) {
			if (!msg_dlg) {
				msg_dlg = new QNR.Dialog({
					content: html
				});
			}
			msg_dlg.getContent().html(msg);
			msg_dlg.show();
			var t = setTimeout(function() {
				msg_dlg.hide();
			},
			timer || 3000);
			return t;
		}

	};
    module.exports = util;
});

