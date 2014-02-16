define(function(require,exports,module){
    var $ = require('jquery');
    var placeholder = require("../common/placeholder");
    var upload = require("../common/upload"); 
    var util = require("../common/util"); 
    var jvalidator = require("../jvalidator/jvalidator");
    var base_var = {};
    
    var init = function(){
        var area_doms = $("#area-box div");
        $("input[placeholder]").placeholder();
        area_doms.mouseenter(function(e){
            var dom = $(this);
            if(!dom.hasClass("area-selected")){
                dom.addClass("area-hover");
            }
        }).mouseleave(function(e){
            var dom = $(this);
            if(!dom.hasClass("area-selected")){
                dom.removeClass("area-hover");
            }
        }).click(function(e){
            var dom = $(this);
            if(!dom.hasClass("area-selected")){
                dom.addClass("area-selected");
            } else {
                dom.removeClass("area-selected");
            }
        });

        var opts = {
            browse_button : "upload_btn",
            url : "/uploadf",
            multipart_params: {},
            file_data_name : "file",
            init : {
                FilesAdded : function(){
                    uploader.start();
                    uploader.refresh();
                },
                Error : function(){
                    console.log(arguments); 
                }
            }
        }
        var uploader = upload.initUpload(opts);
        var form = $("#form1");
        var submit_btn = $("#submit_btn");
        var jv = form.jvalidator();
        jv.setMessage( 'select' , 'numeric' , '请选择一项分类' );

        submit_btn.click(function(e){
            e.preventDefault();
            jv.validateAll(function( result , elements ){
                if (result) {
                    form.submit();
                } else {
                    var msg = ['验证未通过.']
                    for(var i=0; i<elements.length; i++){
                        msg.push( elements[i].getMessage() )
                    }
                    util.showMsg( msg.join('\n') );
                }
            });
        });
        jv.when(["blur"]);

        jv.success(function(){
            $(this.element).css('border','').next(".msg").hide();

        });

        jv.fail(function( $event , errors ){
            $(this.element).css('border','1px solid #f00').next(".msg").text(errors.getMessage()).show();
        });

    } 
    
    exports.init = init;
});
