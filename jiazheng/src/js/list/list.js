define(function(require,exports,module){

    var $ = require('jquery');
    var pager = require("../common/page");
    var header = require('../common/header');
    var map_module = require('../common/map');

    exports.init =  function(){
        header.init();
        pager.defPage();

        if (latlngs && latlngs.length > 1) {
            var map_dom_id = "map";
            map_module.loadMap(function(){
                var latlng = latlngs[0],
                    lat = latlng.lat ,
                    lng = latlng.lng;
                var map = map_module.initMap(map_dom_id,{lat:lat,lng:lng});
                var points = latlngs.slice(0,latlngs.length - 1).map(
                    function(latlng){
                         var lat = latlng.lat ,
                             lng = latlng.lng,
                             name = latlng.name;

                         var mk = map_module.addMark({
                            lat : lat,
                            lng : lng,
                            name : name
                         },map);

                         return mk.getPoint();
                    }
                );

                if (points.length) {
                    map.setViewport(points,{margins:[20,20,20,20]});
                }
            });
 
        } else {
            $("#map").hide();
        }
    }
});
