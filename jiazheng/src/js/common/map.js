define(function(require,exports,module){
    
    var CD = require("./CD");
    var loaded = false;
    var $ = require("jquery");
    var Marker ;

    function loadMap(callback){
         if (!loaded) {
             window.b_g_fun = function(){
                callback();
             };

             CD.loadJS('http://api.map.baidu.com/api?v=1.3&services=true&callback=b_g_fun');
             loaded = true;
             return;
         }
         callback();
    
    }

    function initMap(dom_id,latlng){
        
        var map = new BMap.Map(dom_id);
        map.centerAndZoom(new BMap.Point(latlng.lng, latlng.lat), 11);
        map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM}));  
        return map;
    }
    
    exports.loadMap = loadMap;
    exports.initMap = initMap;
    exports.addMark = function(info,map){

        if(!Marker){
            Marker = function(point,dom){
                this._dom = dom;
                this._point = point;

            };

            Marker.prototype = new BMap.Overlay();

            Marker.prototype.initialize =  function (map) {
                this._map = map;
                var div = this._dom[0];
                map.getPanes().markerPane.appendChild(div);  
                return div;
            }

            Marker.prototype.draw = function(){
                var map = this._map;  
                var pixel = map.pointToOverlayPixel(this._point); 

                this._dom.css({
                    left : pixel.x,
                    top : pixel.y
                })
            }
            Marker.prototype.getPoint = function(){
                return this._point;
            }
        
        }
        var lat = info.lat ,lng = info.lng , name = info.name ;
        var dom = $('<div class="dragmarkbox"><a class="e_dragmark" title="'+name+'"></a><div style="font-size:12px;line-height:14px;background:#fff;border:1px solid #ddd;">'+name+'</div></div>');
        var point  = new BMap.Point(lng,lat);
        var mark = new Marker(point,dom);
        map.addOverlay(mark);
        return mark;
    }

});
