define(function(require,exports,module){
    var $ = require('jquery');
    var placeholder = require("../common/placeholder");
    var upload = require("../common/upload"); 
    var util = require("../common/util"); 
    var jvalidator = require("../jvalidator/jvalidator");
    var base_var = {};
   
    var init = function(){
        var shop_id = window.ShopId;
        var opts = {
            browse_button : "upload_btn",
            url : "/uploadImage",
            multipart_params: {shopid:shop_id},
            file_data_name : "file",
            init : {
                FilesAdded : function(){
                    uploader.start();
                    uploader.refresh();
                },
                
                Error : function(){
                    console.log(arguments); 
                },
                FileUploaded : function(){
                    console.log("success==",arguments);
                }
            }
        }
        var uploader = upload.initUpload(opts);

    } 
    
    exports.init = init;
});
