define("js/common/util-debug",[],function(a,b,c){var d=window.QNR,e=d.Browser,f={getPages:function(a,b,c){var d=a.max,e=a.now,f=c||4,g=b,h=[],i="...";f>=d&&(i="");for(var j=Math.min(e+g,d),k=Math.max(e-g,1),l=k;j>=l;l++)h.push(l);h[0]>2?h=[1,i].concat(h):2==h[0]&&(h=[1].concat(h));var m=h.length-1,n=h[m];return d-1>n?(h.push(i),h.push(d)):n==d-1&&h.push(d),h},bindInput:function(){return e.isIE9?function(a,b){var c,d=null;a.bind("focus.inp",function(){c=a.val(),d=setInterval(function(){var d=a.val();d!==c&&(c=d,b.call(a,d))},100),a.attr("inp_timer",d)}).bind("blur.inp",function(){c=null,d&&(clearInterval(d),d=null);var e=a.val();b.call(a,e)})}:function(a,b){var c=function(){var c=a.val();b.call(a,c)};a.bind({"input.inp":c,"propertychange.inp":c})}}(),fixImg:function(a,b){var c,d,e=a.width,f=a.height,g=e/f,h=b.width/b.height;g>h?(c=Math.min(b.height,f),d=c*g,a.style.marginLeft=-(d-b.width)/2+"px",a.style.marginTop=-(c-b.height)/2+"px"):(d=Math.min(b.width,e),c=d/g,a.style.marginLeft=-(d-b.width)/2+"px",a.style.marginTop=-(c-b.height)/2+"px"),a.style.width=d+"px",a.style.height=c+"px",a.style.maxWidth="none"},imgLoad:function(a,b){return a.complete?(b.call(a),void 0):(a.onload=onerror=function(){b.call(a)},void 0)},showMsg:function(a,b){msg_dlg||(msg_dlg=new d.Dialog({content:html})),msg_dlg.getContent().html(a),msg_dlg.show();var c=setTimeout(function(){msg_dlg.hide()},b||3e3);return c}};c.exports=f});