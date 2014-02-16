define(function(require,exports,module){
    
    var CD = require('./CD');

    var INIT_OPTS = {
        runtimes : 'html5,flash,silverlight,html4',
         
        browse_button : 'pickfiles', // you can pass in id...
         
        url : "/uploadf",
         
        filters : {
            max_file_size : '10mb',
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png"}
            ]
        },
        // Flash settings
        flash_swf_url : 'http://source.jjfuwu.com/static/Moxie.cdn.swf',
     
        // Silverlight settings
        silverlight_xap_url : 'http://source.jjfuwu.com/static/Moxie.cdn.xap'
    }; 
   
    exports.initUpload = function(opts){
        var n_opts = CD.mix({},opts,INIT_OPTS);
        var uploader = new plupload.Uploader(n_opts);
        uploader.init();
        return uploader;
    }

});
