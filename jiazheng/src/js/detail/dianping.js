define(function(require,exports,module){
    var $ = require("jquery");
    var util = require('../common/util');

    function initDp(){
        var total_con = $("#total_con");
        var msg = total_con.find(".msg");
        var score;
        var a_s = total_con.find("li a").bind({
            "mouseenter": function(e) {
                a_s.removeClass("active-star");
                $(this).addClass("active-star");
                msg.text(this.title).show();
            },
            "mouseleave": function(e) {
                $(this).removeClass("active-star");
                msg.text(this.title).hide();
                if (typeof score !== "undefined") {
                    var obj = a_s.eq(score - 1);
                    obj.addClass("active-star");
                    msg.text(obj.attr("title")).show();
                }
            },
            "click": function(e) {
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

        util.bindInput(com_input,function(val){
            var msg = this.parent().find(".msg");
            if (val.length > 360) {
                msg.html("最多只能输入360字").show();
            } else {
                msg.hide();
            }
        });
    
        btn.click(function(e){
            
            if (score == null) {
                util.showMsg("打个分吧~");
                return;
            } 
            if (!$.trim(com_input.val())) {
                util.showMsg("评价不能为空~");
                return;
            } else if ($.trim(com_input.val()) > 360 ) {
                util.showMsg("最多只能输入360字");
                return;
            }
            
            console.log("score===",score ,com_input.val());
        });

        function reset(){
            score = null;
            com_input.val("");
            $("#ktp").click();
        }

    }

    
    exports.initDp = initDp;

    

});
