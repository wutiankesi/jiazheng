seajs.config({
    base : 'http://source.jjfuwu.com/',
	// 别名配置
	alias: {
		'json': 'gallery/json/1.0.2/json',
        'jquery' : 'base/js/jquery', 
	}
});
if(!window.$){
    window.$ = jQuery;
}

