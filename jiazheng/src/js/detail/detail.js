define(function(require,exports,module){
    var $ = require('jquery');
    var header = require('../common/header');
    var ss = require('../common/jquery.flexslider');
    var CD = require('../common/CD');
    var util = require('../common/util');
    var dianping = require('./dianping');
    
    var map_module = require('../common/map');
    
    function initSlider(){
        var dom = $("#slider");
        var size = {width : 200 ,height: 124};
        dom.find("img").each(function(i,img){
            util.imgLoad(img,function(){
                util.fixImg(img,size);
            });
        });
        dom.flexslider({
            animation: "slide",
            animationLoop: false,
            itemWidth: 200,
            itemMargin: 6
        });
    }

    exports.init = function(){
        header.init();   
        initSlider();
        dianping.initDp();
        if(lat && lng ){
            var map_dom_id = "map";
            map_module.loadMap(function(){
                var map = map_module.initMap(map_dom_id,{lat:lat,lng:lng});
                map_module.addMark({
                    lat : lat,
                    lng : lng,
                    name : name
                },map);
            });
        } else {
            $("#map").hide();
        }
    }
});
