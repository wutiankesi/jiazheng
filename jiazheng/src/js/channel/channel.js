define(function(require,exports,module){
    
    var $ = require('jquery');

    var header = require('../common/header');
    var silder =  require('../home/silder');
    
    exports.init = function(){
        silder.init();
        header.init(); 
    }

});
