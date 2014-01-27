define(function(require,exports,module){
    
    var $ = require("jquery");
    var ifs = require("../common/CD");
	function create(pagger) {
		var max = pagger.max,
		now = pagger.now;
		var f_offset = 2; //偏移量
		var l_r_limit = 5;
		var pages = [];
		var gap = "...";
		var rs = [],
            ls = [],
            lv,
            rv,
            maxed = false,
            mined = false;
            lv = rv = now;
		if ( 1 == max) {
			return [1];
		}
		if (l_r_limit >= max) {
			var pages = [];
			for (var i = 1; i <= max; i++) {
				pages.push(i);
			}
			return pages;
		}
		for (var i = 0; i < f_offset; i++) {
			if (++rv >= max) {
				if (!maxed) {
					rs.push(max);
					maxed = true;
				}
			} else {
				rs.push(rv);
			}
			if (--lv <= 1) {
				if (!mined) {
					ls.splice(0, 0, 1);
					mined = true;
				}
			} else {
				ls.splice(0, 0, lv);
			}

		}

		var pages = ls.concat([now]).concat(rs);
		if (!maxed) {
			if (pages[pages.length - 1] < max - 1) {
				pages.push(gap);
			}
			pages.push(max);
		} else {
			if (l_r_limit > max) {
				pages = [];
				for (var i = 1; i <= max; i++) {
					pages.push(i);
				}
			} else {
				pages = [];
				for (var i = max; i > max - l_r_limit; i--) {
					pages.splice(0, 0, i);
				}
				if (1 < max - l_r_limit) {
					pages.splice(0, 0, gap);
				}
				pages.splice(0, 0, 1);
				return pages;
			}

		}

		if (!mined) {
			if (pages[0] > 2) {
				pages = [1, gap].concat(pages);
			} else {
				pages.splice(0, 0, 1);
			}
		} else {
			if (l_r_limit >= max) {
				pages = [];
				for (var i = 1; i <= max; i++) {
					pages.push(i);
				}
			} else {
				pages = [];
				for (var i = 1; i <= l_r_limit; i++) {
					pages.push(i);
				}
				if (l_r_limit < max - 1) {
					pages.push(gap);
				}
				pages.push(max);
			}

		}

		return pages;
	};
    function defPage(){
        /** 分页**/
		var pager = $("#pager");
		if(pager[0]){
			var pagger = {now : parseInt(pager.data("now")),
						  max :	parseInt(pager.data("max"))
						};
			 var now = pagger.now ,max = pagger.max;
			 var url = window.location.href;
			 if(url.indexOf("#") > -1){
			 	url = url.substring(0,url.indexOf("#"));
			 }
			 url =  url.replace(/\&?page\=(\d+)/g,"");
			 if(url.indexOf("?") == -1){
			 	url+= "?";
			 }
			 var pages  = create(pagger);	

			var html=["<div class='b_comment_page_box fr'><div class='e_comment_page'>"];
			for(var i=0;i<pages.length;i++){
				if(typeof pages[i] === "number"){
					if(pages[i] == (now+1)){
						html.push("<a href='javascript:' class='page selected'>",pages[i],"</a>");
					}else{
						html.push("<a class='page' href='"+url+"&page="+(pages[i]-1)+"'>",pages[i],"</a>");
					}	
				}else if(typeof pages[i] ==="string"){
					html.push("<span class='ellipsis'>...</span>");
				}
			}
			html.push("</div></div>");
            var jpager =  $(html.join(""));
			if(max == 1){
				pager.html(jpager);
				return;
			}
			if(pagger.now < pagger.max-1){
                jpager.find("div.e_comment_page").append("<a href='"+url+"&page="+((now+1) >max ? max :now + 1)+"' class='page next' >下一页</a>");
			}
			if(pagger.now > 0){
                jpager.find("div.e_comment_page").prepend("<a class='page prev' href='"+url+"&page="+((now-1) < 0 ? 0 :now -1)+"' >上一页</a>");
			}	
			pager.html(jpager);
		}

    };
    module.exports = {
        create : create,
        defPage : defPage
    };

});
