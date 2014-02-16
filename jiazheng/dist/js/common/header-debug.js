define("js/common/header-debug", [ "jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery-debug");
    var init = function() {
        var ch_city = $("#s-city");
        var ch_city_list = ch_city.find("ul");
        ch_city.mouseenter(function(e) {
            ch_city_list.show();
        }).mouseleave(function(e) {
            ch_city_list.hide();
        });
    };
    exports.init = init;
});
