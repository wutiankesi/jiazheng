define(function(require,exports,module){
    var $ = require('jquery');
    var header = require('../common/header');
    var tab = require('./tab');
    var placeholder = require('../common/placeholder');
    //var silder =  require('./silder');
    exports.init = function(){
        //silder.init();
        header.init();
        tab.initTab();
        
        var search_inp = $("input.search-inp");
        var action = $("#search").click(function(){
            var t;
            if (action && (t = $.trim(search_inp.val()))) {
                window.open(action+"?q="+ encodeURIComponent(t));
            }
        }).attr("action");
        search_inp.placeholder();
    }
});
