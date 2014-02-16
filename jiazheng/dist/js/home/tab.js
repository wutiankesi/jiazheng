define("js/home/tab", [ "jquery" ], function(require, exports, module) {
    var $ = require("jquery");
    var initTab = function() {
        var tab_dom = $("div.s-tab");
        var tabs = tab_dom.find(".tab");
        var tab_contents = tab_dom.find(".tab-content");
        tabs.click(function(e) {
            e.preventDefault();
            var dom = $(this);
            var index = dom.index();
            tabs.removeClass("selected");
            dom.addClass("selected");
            tab_contents.hide().eq(index).show();
        });
        tabs.eq(0).click();
    };
    exports.initTab = initTab;
});
