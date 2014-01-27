define(function(require,exports,module){
    var $ = require('jquery');
    var ss = require('../common/jquery.flexslider');
    var CD = require('../common/CD');
    var util = require('../common/util');
    exports.init = function(dom_selector){
        var dom = $("#slider");
        var size = {width : 598 ,height: 320};
        dom.find("img").each(function(i,img){
            util.imgLoad(img,function(){
                util.fixImg(img,size);
            });
        });
        dom.flexslider({
            slideshowSpeed : 3000,
            animation: "slide",
            animationLoop: true
        });
    }
});
