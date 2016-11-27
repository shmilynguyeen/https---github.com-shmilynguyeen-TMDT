// Check xem trÃ¬nh duyá»‡t lÃ  IE6 hay IE7
var isIE		= (navigator.userAgent.toLowerCase().indexOf("msie") == -1 ? false : true);
var isIE6	= (navigator.userAgent.toLowerCase().indexOf("msie 6") == -1 ? false : true);
var isIE7	= (navigator.userAgent.toLowerCase().indexOf("msie 7") == -1 ? false : true);

// jQuery quickEach
(function($){$.fn.quickEach=function(f){var j=$([0]),i=-1,l=this.length,c;while(++i<l&&(c=j[0]=this[i])&&f.call(j,i,c)!==false);return this;};})(jQuery);
// jQuery get object by id
(function($){$.id=function(id){return jQuery(document.getElementById(id));}})(jQuery);
// Format number
function formatNumber(nStr){nStr+='';var x=nStr.split(',');var x1=x[0];var x2='';var x2=x.length>1?','+x[1]:'';var rgx=/(\d+)(\d{3})/;while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+'.' + '$2');}return x1+x2;}
// check Element Resize
!function(e){function i(e){var i=e.__resizeTriggers__,t=i.firstElementChild,r=i.lastElementChild,n=t.firstElementChild;r.scrollLeft=r.scrollWidth,r.scrollTop=r.scrollHeight,n.style.width=t.offsetWidth+1+"px",n.style.height=t.offsetHeight+1+"px",t.scrollLeft=t.scrollWidth,t.scrollTop=t.scrollHeight}function t(e){return e.offsetWidth!=e.__resizeLast__.width||e.offsetHeight!=e.__resizeLast__.height}function r(e){var r=this;i(this),this.__resizeRAF__&&c(this.__resizeRAF__),this.__resizeRAF__=_(function(){t(r)&&(r.__resizeLast__.width=r.offsetWidth,r.__resizeLast__.height=r.offsetHeight,r.__resizeListeners__.forEach(function(i){i.call(r,e)}))})}function n(){if(!o){var e=(p?p:"")+".resize-triggers { "+(L?L:"")+'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',i=document.head||document.getElementsByTagName("head")[0],t=document.createElement("style");t.type="text/css",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),i.appendChild(t),o=!0}}var s=document.attachEvent,o=!1,a=e.fn.resize;if(e.fn.resize=function(e){return this.each(function(){this==window?a.call(jQuery(this),e):addResizeListener(this,e)})},e.fn.removeResize=function(e){return this.each(function(){removeResizeListener(this,e)})},!s){var _=function(){var e=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)};return function(i){return e(i)}}(),c=function(){var e=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;return function(i){return e(i)}}(),d=!1,l="animation",h="",m="animationstart",f="Webkit Moz O ms".split(" "),g="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),u="",z=document.createElement("fakeelement");if(void 0!==z.style.animationName&&(d=!0),d===!1)for(var v=0;v<f.length;v++)if(void 0!==z.style[f[v]+"AnimationName"]){u=f[v],l=u+"Animation",h="-"+u.toLowerCase()+"-",m=g[v],d=!0;break}var w="resizeanim",p="@"+h+"keyframes "+w+" { from { opacity: 0; } to { opacity: 0; } } ",L=h+"animation: 1ms "+w+"; "}window.addResizeListener=function(e,t){s?e.attachEvent("onresize",t):(e.__resizeTriggers__||("static"==getComputedStyle(e).position&&(e.style.position="relative"),n(),e.__resizeLast__={},e.__resizeListeners__=[],(e.__resizeTriggers__=document.createElement("div")).className="resize-triggers",e.__resizeTriggers__.innerHTML='<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>',e.appendChild(e.__resizeTriggers__),i(e),e.addEventListener("scroll",r,!0),m&&e.__resizeTriggers__.addEventListener(m,function(t){t.animationName==w&&i(e)})),e.__resizeListeners__.push(t))},window.removeResizeListener=function(e,i){s?e.detachEvent("onresize",i):(e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(i),1),e.__resizeListeners__.length||(e.removeEventListener("scroll",r),e.__resizeTriggers__=!e.removeChild(e.__resizeTriggers__)))}}(jQuery);
// Open Select Box
(function($) {
	"use strict";
	$.fn.openSelect = function() {
		return this.each(function(idx, domEl) {
			if (document.createEvent) {
				var event = document.createEvent("MouseEvents");
				event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				domEl.dispatchEvent(event);
			} else if (element.fireEvent) {
				domEl.fireEvent("onmousedown");
			}
		});
	}
}(jQuery));

function affixOnScrollAction(domEle, domEleOffsetTop, domEleOffsetBottom){
	if(domEle.length <= 0) return;
	var domEleOffsetTop 		= domEleOffsetTop || 0;
	var domEleOffsetBottom	= domEleOffsetBottom || 0;
	domEle.show().affix({ offset: { top: domEleOffsetTop, bottom: domEleOffsetBottom } });
	$(window).scroll(function(){
		if(vatgiaConfig.scroll_action == 'up') domEle.show()
		if(vatgiaConfig.scroll_offset > domEleOffsetTop){
			if(vatgiaConfig.scroll_action == 'up') domEle.affix({ offset: { top: domEleOffsetTop, bottom: domEleOffsetBottom } });
			else domEle.hide().removeData('bs.affix');
		}
	});
}

function addToCart(record_id, estore_id, estore_name, redirect, refererfrom, domain){
	var windowHref = window.location.href || '';
	var arrDomain	= ["vatgia.com", "vnpgroup.net", "localhost"];
	var domain		= "http://www.vatgia.com";
	for(i=0; i<arrDomain.length; i++){
		if(windowHref.indexOf(arrDomain[i]) != -1){
			domain	= "";
			break;
		}
	}
	var iSc			= (typeof(sizeColorId) != "undefined" ? sizeColorId : 0);
	var quantity	= 1;
	var domEle		= $("#addtocart_quantity");
	if(domEle.length) quantity = parseInt(domEle.val());
	if(quantity <= 0 || isNaN(quantity)){ alert("Sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n 0."); domEle.focus(); return false; }
	window.open(domain + '/home/addtocart.php?iPro=' + record_id + '&iSc=' + iSc + '&estore_id=' + estore_id + '&estore_name=' + estore_name + '&quantity=' + quantity + '&count_click=1&return=' + redirect + '&refererfrom=' + refererfrom, "_parent");
}

function clickOutside(fn){
	$.merge(vatgiaConfig.outside_click, Array(fn));
	$("html").off("click").one("click", function(){
		for(i=0; i<vatgiaConfig.outside_click.length; i++) vatgiaConfig.outside_click[i]();
		vatgiaConfig.outside_click	= [];
	});
}

function changeLanguage(domEle){
	var lang	= (domEle.hasClass("language_en") ? 0 : -1);
	domEle.attr("class", "language_" + (lang == 0 ? "vn" : "en"));
	AVIMObj.setMethod(lang);
	document.getElementById("header_search_keyword").focus();
}

function changeProductPicture(domEle){
	$(domEle[0].parentNode.parentNode).find(".picture").attr("src", domEle.attr("data-src"));
	$(domEle[0].parentNode).find("span").removeClass("active");
	domEle.addClass("active");
}

function changeSearchOption(type, id, domEle){
	removeAutoComplete();
	document.getElementById("search_shop").disabled			= true;
	document.getElementById("search_category").disabled	= true;
	if(type == "category"){
		document.getElementById("search_category").disabled= false;
		document.getElementById("search_category").value	= id;
	}
	else{
		var frm	= document.getElementById("header_search");
		switch(id){
			case 0: frm.setAttribute("action", "/home/quicksearch.php"); setAutoComplete(); break;
			case 1: frm.setAttribute("action", "/raovat/quicksearch.php"); break;
			case 2: frm.setAttribute("action", "/hoidap/quicksearch.php"); break;
			case 3: frm.setAttribute("action", "/home/shop.php"); document.getElementById("search_shop").disabled = false; break;
		}
	}
	simpleTipRemove();
	document.getElementById("header_search_text").innerHTML	= cutString(domEle.text(), 21) + '<b class="arrow_down"></b>';
	document.getElementById("header_search_keyword").focus();
}

function changeTab(domEle, object, option){
	if(domEle.hasClass("active")) return;
	var opts	= {
		url	: null,
		key	: "",
		tag	: "a"
	};
	$.extend(opts, option);
	if(opts.url != "") object.html(loadAjaxContent(opts.url, opts.key));
	else{
		$(object.parentNode).find(".tab_content").css("display", "none");
		object.css("display", "block");
	}
	$(domEle[0].parentNode).find(opts.tag).removeClass("active");
	domEle.addClass("active");
}

function checkAjaxResponse(response){
	if(response.substr(0, 7) == "[error]"){
		var message	= response.replace("[error]", "").replace(/<br \/>/gi, '\n').replace(/\&bull;/gi, '-');
		if(message != "") alert(message);
		return false;
	}
	return true;
}

function checkForm(form_name, arrControl){

	var frm	= $("form[name='" + form_name + "']");

	for(i=0; i<arrControl.length; i++){
		if(arrControl[i] === undefined) continue;
		var arrTemp	= arrControl[i].split("{#}");
		var type		= arrTemp[0];
		var defVal	= arrTemp[1];
		var control	= arrTemp[2];
		var title	= arrTemp[3];
		var domEle	= frm.find("[name='" + control + "']");
		var value	= domEle.val();
		var errMsg	= "";
		switch(type){
			case "0": if($.trim(value) == "" || $.trim(value) == defVal){ errMsg = "Báº¡n chÆ°a nháº­p " + title + "."; } break;
			case "1": if(parseFloat(value) <= parseFloat(defVal)){ errMsg = title + " pháº£i lá»›n hÆ¡n " + formatNumber(defVal) + "."; } break;
			case "2": if(value == defVal){ errMsg = "Báº¡n chÆ°a chá»n " + title + "."; } break;
			case "3": if(!isEmail(value)){ errMsg = title + " khÃ´ng há»£p lá»‡."; } break;
			case "4": if($.trim(value).length < defVal){ errMsg = title + " pháº£i cÃ³ Ã­t nháº¥t " + formatNumber(defVal) + " kÃ½ tá»±."; } break;
			case "5": if(!isUrl(value)){ errMsg = title + " khÃ´ng há»£p lá»‡."; } break;
			case "6": if(parseFloat(value) < parseFloat(defVal)){ errMsg = title + " pháº£i lá»›n hÆ¡n hoáº·c báº±ng " + formatNumber(defVal) + "."; } break;
			case "7": if(parseFloat(value) > parseFloat(defVal)){ errMsg = title + " pháº£i nhá» hÆ¡n hoáº·c báº±ng " + formatNumber(defVal) + "."; } break;
		}

		if(errMsg != ""){
			alert(errMsg);
			if(self == top){
				// Check xem cÃ³ move scroll hay khÃ´ng
				var move	= 0;
				if(domEle.length > 0){
					if($(window).scrollTop() < domEle.offset().top){
						if((domEle.offset().top - ($(window).scrollTop() + $(window).height())) > 0) move = 1;
					}
					else move = 1;
				}
				// Move or focus
				if(move == 0) domEle.focus();
				else moveScrollTop({ margin: 48, object: domEle, callback: function(){ domEle.focus(); } });
			}
			else{
				try{ domEle.focus(); }
				catch(e){ }
			}
			return false;
		}
	}

	// Náº¿u cÃ³ thÃªm javascript thÃ¬ execute
	if(typeof(arguments[2]) != "undefined"){
		var opts	= { stop: false, callback: null };
		switch(typeof(arguments[2])){
			case "string"	: eval(arguments[2]); break;
			case "function": arguments[2](); break;
			case "object"	: $.extend(opts, arguments[2]); break;
		}
		if(typeof(opts.callback) == "function") opts.callback();
		if(opts.stop == true) return false;
	}

	if(typeof(formErrorOnSubmit) != "undefined" && formErrorOnSubmit[form_name] == 1) return false;
	// Náº¿u lÃ  form post_data thÃ¬ khi khÃ´ng cÃ³ lá»—i pháº£i disabled máº¥y nÃºt submit Ä‘i Ä‘á»ƒ user khÃ´ng click nhiá»u, trÃ¡nh duplicate
	if(form_name == "post_data") frm.find("input[type='submit']").prop("disabled", true).val("Vui lÃ²ng Ä‘á»£i...").blur();

	// Submit form
	return true;

}

function youtubeIDextract(text){
	var replace = "$1";
	if(!text.match(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g)) return false;
	if(text.match(/^[^v]+v.([^&^=^\/]{11}).*/)) return text.replace(/^[^v]+v.([^&^=^\/]{11}).*/,replace);
	else if(text.match(/^[^v]+\?v=([^&^=^\/]{11}).*/)) return text.replace(/^[^v]+\?v=([^&^=^\/]{11}).*/,replace);
	else return false;
}

function youtubeOpenVideo(url){
	var code	= youtubeIDextract(url);
	if(code.length > 20) return;
	if(code !== false) windowPrompt({ background: "rgba(0,0,0,0.7)", width: 800, height: 450, href: "http://www.youtube.com/embed/" + code + "?autoplay=1", iframe: true });
}

function convertVideoLink(domEle){

	var opts	= {
		limit	: 20,
		width	: 640,
		height: 390
	};
	if(typeof(arguments[1]) != "undefined") $.extend(opts, arguments[1]);

	domEle.quickEach(function(){
		this.find("a").filter(function(){
			return this.href.match(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g);
		}).quickEach(function(index){
			var code	= youtubeIDextract(this.attr("href"));
			if(code.length > 20) return;
			if(code !== false){
				var iframe	= $('<iframe width="' + opts.width + '" height="' + opts.height + '" src="http://www.youtube.com/embed/' + htmlspecialbo(code) + '" frameborder="0" allowfullscreen="true" style="margin: 6px 0px;"></iframe>');
				iframe.insertAfter(this);
				this.remove();
			}
			if(index >= (opts.limit - 1)) return false;
		});
	});

}

function cutString(string, length){
	var opts	= { etChar: "...", maxChar: 20};
	if(string.length <= length) return string;
	var strCut	= string.substr(0, length);
	if(string.substr(length, 1) == " ") return strCut + opts.etChar;
	var strPoint	= strCut.lastIndexOf(" ");
	if(strPoint < length - opts.maxChar) return strCut + opts.etChar;
	else return strCut.substr(0, strPoint) + opts.etChar;
}

function estoreProductOption(iData, exclusive, authen_code){
	var editInfo	= '';
	if(exclusive == 1) editInfo	= '<a href="/home/edit.php?record_id=' + iData + '" target="_blank" rel="nofollow">Sá»­a thÃ´ng tin</a><br />';
	var strReturn	=  '<div class="simple_tip_content_text">' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ width: 800, height: \'90%\', maxHeight: 700, href: \'/ajax_v2/load_edit_product.php?v=3&iData=' + iData + '\', iframe: true });">Sá»­a giÃ¡</a><br />' + editInfo +
								'<a href="/profile/?module=product_auto_up&record_id=' + iData + '" target="_blank" rel="nofollow">Tá»± Ä‘á»™ng Up</a><br />' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ content: \'Báº¡n cÃ³ muá»‘n Up sáº£n pháº©m nÃ y lÃªn Ä‘áº§u danh má»¥c khÃ´ng? (Up sáº£n pháº©m lÃªn Ä‘áº§u sáº½ máº¥t phÃ­)\', confirm: function(c){if(c) window.location.href=\'/home/up_product.php?record_id=' + iData + '&redirect=\' + vatgiaConfig.con_redirect} });">Up lÃªn Ä‘áº§u</a><br />' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ width: 800, height: \'90%\', maxHeight: 700, href: \'/ajax_v2/load_add_product_to_titan.php?iData=' + iData + '\', iframe: true });">Äáº¥u giÃ¡ Click</a><br />' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ width: 800, height: \'90%\', maxHeight: 700, href: \'/ajax_v3/load_add_product_to_event.php?iData=' + iData + '\', iframe: true });">Tham gia sá»± kiá»‡n</a><br />' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ width: 800, height: \'90%\', maxHeight: 700, href: \'/ajax_v3/load_add_product_promotion.php?iData=' + iData + '\', iframe: true });">Khuyáº¿n máº¡i</a><br />' +
								'<a href="javascript:;" rel="nofollow" onclick="windowPrompt({ content: \'Báº¡n cÃ³ muá»‘n xÃ³a sáº£n pháº©m nÃ y khá»i gian hÃ ng khÃ´ng?\', confirm: function(c){if(c) window.location.href=\'/home/delete_product.php?record_id=' + iData + '&authen_code=' + authen_code + '&redirect=\' + vatgiaConfig.con_redirect} });">XÃ³a khá»i gian hÃ ng</a><br />' +
							'</div>';
	return strReturn;
}

function followAction(iAut ,iData, type, domEle, iEst, countLike = 0){
	iEst = iEst || 0;

	$.get("/ajax_v4/follow_action.php?authen_code=" + iAut + "&iData=" + iData + "&iEst=" + iEst + "&type=" + type, function(data){
		if(!checkAjaxResponse(data)) return;
		var domIconEle		= domEle.find('i');
		var domSpanEle 	= domEle.find('span');
		var checkLiked 	= domIconEle.attr('class');
		var textFollow		= countLike > 1 ? (countLike - 1) + ' lÆ°á»£t thÃ­ch' : 'ThÃ­ch';
		var textFollowed	= countLike + ' lÆ°á»£t thÃ­ch';
		if(type == 1){
			textFollow		= 'Theo dÃµi gian hÃ ng';
			textFollowed	= 'ÄÃ£ theo dÃµi';
		}
		if(data == '') domIconEle.toggleClass('icon_like icon_liked');
		if(domIconEle.hasClass("icon_liked")){
			domEle.addClass('followed');
			domSpanEle.text(textFollowed);
		}
		else{
			domEle.removeClass('followed');
			domSpanEle.text(textFollow);
		}
	});
}

// Form login
function generateFormLogin(){

	var formLoginOpts	= {
		redirect	: "",
		success	: null
	};

	switch(typeof(arguments[0])){
		case "string"	: formLoginOpts.redirect	= arguments[0]; break;
		case "function":
			formLoginOpts.redirect		= vatgiaConfig.con_redirect;
			formLoginOpts.success		= arguments[0];
		break;
		case "object"	: $.extend(formLoginOpts, arguments[0]); break;
	}

	if(typeof(vatgiaConfig.use_sso_login) != "undefined" && vatgiaConfig.use_sso_login){
		var link	= "/home/login.php?popup=1";
		if(formLoginOpts.redirect != "") link	+= "&redirect=" + formLoginOpts.redirect;
		return '<iframe frameborder="0" width="740px" height="410px" src="' + link + '"></iframe>';
	}

	switch(typeof(arguments[0])){
		case "string"	: formLoginOpts.redirect	= arguments[0]; break;
		case "function": formLoginOpts.success		= arguments[0]; break;
		case "object"	: $.extend(formLoginOpts, arguments[0]); break;
	}

	quickLoginAjax	= function(){
		var frmEle	= $.id("quick_login");
		$.post(frmEle.attr("action"), frmEle.serialize(), function(data){
			if(!checkAjaxResponse(data)) return;
			if(typeof(formLoginOpts.success) == "function") formLoginOpts.success();
			else if(formLoginOpts.redirect != "") window.location.href	= "/home/redirect.php?url=" + formLoginOpts.redirect;
			else window.location.reload();
		});
	};

	var html	= '<form class="form" id="quick_login" name="quick_login" action="' + vatgiaConfig.con_root_path + 'act_login.php" method="post" enctype="multipart/form-data" onsubmit="return checkForm(this.name, vatgiaConfig.login_config.array_check_form, { stop: true, callback: quickLoginAjax });">' +
	'<table class="form_table" cellpadding="0" cellspacing="0">' +
		'<tr><td class="form_name"></td><td class="form_text"><span class="form_text_note">Nhá»¯ng Ã´ cÃ³ dáº¥u sao (<span class="form_asterisk">*</span>) lÃ  báº¯t buá»™c pháº£i nháº­p.</span></td></tr>' +
		'<tr><td class="form_name"></td><td class="form_text"><div class="form_errorMsg_content"><span class="form_errorMsg">TÃªn Ä‘Äƒng nháº­p lÃ  <b>Username</b> hoáº·c <b>Email</b><br />báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ trÃªn Vatgia.com.</span></div></td></tr>' +
		'<tr><td class="form_name"><span class="form_asterisk">* </span>TÃªn Ä‘Äƒng nháº­p :</td><td class="form_text"><input class="form_control" type="text" name="loginname" maxlength="250" style="width: 250px;" /></td></tr>' +
		'<tr><td class="form_name"><span class="form_asterisk">* </span>Máº­t kháº©u :</td><td class="form_text"><input class="form_control" type="password" name="password" maxlength="250" style="width: 250px;" /></td></tr>' +
		'<tr><td></td><td class="form_text"><input type="checkbox" id="login_remember_password" name="remember_password" value="1" /><label for="login_remember_password">Nhá»› máº­t kháº©u</label></td></tr>' +
		'<tr><td></td><td><input type="submit" class="form_button" value="ÄÄƒng nháº­p há»‡ thá»‘ng" /></td></tr>' +
	'</table>' +
	'<input type="hidden" name="ajax" value="1" />' +
	'<input type="hidden" name="user_login" value="login" />' +
	'</form>' +
	'<div style="margin-top: 6px; line-height: 150%; text-align: center;">Náº¿u báº¡n chÆ°a cÃ³ tÃ i khoáº£n, hÃ£y <a class="text_link_underline" href="' + vatgiaConfig.con_root_path + 'register.php">ÄÄƒng kÃ½</a> ngay bÃ¢y giá».<br />' +
	'Trong trÆ°á»ng há»£p báº¡n quÃªn máº­t kháº©u, hÃ£y <a class="text_link_underline" href="' + vatgiaConfig.con_root_path + 'lost_password.php">Click vÃ o Ä‘Ã¢y</a>.</div>';

	return html;

}

function generateSetIconPremium(type){
	var type = type || '';
	html	 = '<table class="simple_tip" rel="#tooltip_premium"><tr>' +
					'<td><i class="icon_sprite ' + (type != '' ? 'icon_sprite_calendar_green_large' : 'icon_sprite_calendar_green') + '"></i></td>' +
					'<td><i class="icon_sprite ' + (type != '' ? 'icon_sprite_carship_green_large' : 'icon_sprite_carship_green') + '"></i></td>' +
					'<td><i class="icon_sprite ' + (type != '' ? 'icon_sprite_refund_green_large' : 'icon_sprite_refund_green') + '"></i></td>' +
					'<td><i class="icon_sprite ' + (type != '' ? 'icon_sprite_circle_green_large' : 'icon_sprite_circle_green') + '"></i></td>' +
				'</tr></table>';
	$('.premium_set_icon').append(html);

	html	 = '<div id="tooltip_premium" class="hidden">' +
					'<ul class="tooltip_premium_content">' +
						'<li><span><i class="icon_sprite icon_sprite_calendar_green"></i></span> Báº£o hÃ nh chÃ­nh hÃ£ng táº¡i FPT</li>' +
						'<li><span><i class="icon_sprite icon_sprite_carship_green"></i></span> Miá»…n phÃ­ váº­n chuyá»ƒn toÃ n quá»‘c</li>' +
						'<li><span><i class="icon_sprite icon_sprite_refund_green"></i></span> Miá»…n phÃ­ Ä‘á»•i tráº£ theo nhu cáº§u</li>' +
						'<li><span><i class="icon_sprite icon_sprite_circle_green"></i></span> Äáº£m báº£o 100% sáº£n pháº©m chÃ­nh hÃ£ng tá»« FPT</li>' +
					'</ul>' +
				'</div>';
	$('body').append(html);
}

function historyChangeTab(module, domEle){
	document.getElementById("history_product").className	= "hidden";
	document.getElementById("history_raovat").className	= "hidden";
	document.getElementById("history_hoidap").className	= "hidden";
	document.getElementById("history_" + module).className= "";
	domEle.parent().find("a").removeClass("active");
	domEle.addClass("active");
}

function historyDelete(type, data, domEle){
	$.get("/ajax_v2/delete_history.php?type=" + type + "&data=" + data, function(data){
		if(!checkAjaxResponse(data)) return;
		domEle.fadeOut(200, function(){ $(this).remove(); });
		delete vatgiaConfig.cache_data["history"];
	});
}

function historyDeleteAll(module){
	var arrText = []; arrText["product"] = "sáº£n pháº©m"; arrText["raovat"] = "rao váº·t"; arrText["hoidap"] = "há»i Ä‘Ã¡p";
	if(confirm("Báº¡n cÃ³ muá»‘n xÃ³a toÃ n bá»™ " + arrText[module] + " Ä‘Ã£ xem khÃ´ng?")){
		$.get("/ajax_v2/delete_history.php?type=all&module=" + module, function(data){
			if(!checkAjaxResponse(data)) return;
			document.getElementById("history_" + module).innerHTML	= '<div class="empty">Báº¡n chÆ°a xem ' + arrText[module] + ' nÃ o</div>';
			delete vatgiaConfig.cache_data["history"];
		});
	}
}

function htmlspecialbo(string){
	var arrStr	= ['<', '"', '>'];
	var arrRep	= ['&lt;', '&quot;', '&gt;'];
	for(i=0; i<arrStr.length; i++) eval('string = string.replace(/' + arrStr[i] + '/g, "' + arrRep[i] + '");');
	return string;
}

function initFormLogin(){
	var data	= (typeof(arguments[0]) != "undefined" ? arguments[0] : vatgiaConfig.con_redirect);
	windowPrompt("", {
		content		: generateFormLogin(data),
		onComplete	: function(){ $.id("quick_login").find("input[name='loginname']").focus(); }
	});
}

var menuConfig	= {};
function initMenu(module){

	menuConfig	= {
		rootDomEle		: $.id("menu_root"),
		rootListDomEle	: $.id("menu_root").find("li"),
		childDomEle		: $.id("menu_child"),
		child1DomEle	: $.id("menu_child_1"),
		child2DomEle	: $.id("menu_child_2"),
		rootSelected	: 0,
		cacheList		: [],
		leaveTimeout	: null
	};

	menuConfig.rootDomEle.hover(
		function(){ clearTimeout(menuConfig.leaveTimeout); menuConfig.child1DomEle.find("li").removeClass("hover"); },
		function(){ menuConfig.leaveTimeout	= setTimeout(function(){ menuMouseLeave(); }, 200); }
	);
	menuConfig.childDomEle.hover(
		function(){ clearTimeout(menuConfig.leaveTimeout); },
		function(){ menuConfig.leaveTimeout	= setTimeout(function(){ menuMouseLeave(); }, 200); }
	);

	menuAim(module);

}

function intVal(value){
	value	= parseInt(value.replace(/\./g, ""));
	if(value.toString() == "NaN") value = 0;
	return value;
}

function isInteger(value) {
	return (value == parseInt(value));
}

function menuMouseLeave(){
	menuConfig.rootListDomEle.removeClass("hover");
	menuConfig.child1DomEle.css("display", "none");
	menuConfig.child2DomEle.css("display", "none");
}

function loadMenu(module, id){
	var root_id		= menuConfig.rootSelected;
	var showMenu	= function(){
		switch(module){
			case "raovat": var arrData = arrMenuRaovat; var path = "/raovat/"; break;
			case "hoidap": var arrData = arrMenuHoidap; var path = "/hoidap/"; break;
			default: 		var arrData = arrMenuProduct; var path = "/home/"; break;
		}
		if(typeof(menuConfig.cacheList[root_id]) == "undefined"){
			menuConfig.cacheList[root_id]	= '';
			$.each(arrData[root_id], function(index, value){
				var arrTemp	= value.split("=>");
				menuConfig.cacheList[root_id]	+= '<ul id="menu_' + arrTemp[0] + '">';
				$.each(arrTemp[1].split(";"), function(i, v){
					var t	= v.split("|");
					menuConfig.cacheList[root_id]	+= '<li><a href="' + path + 'type.php?iCat=' + t[0] + '">' + t[1] + '</a></li>';
				});
				menuConfig.cacheList[root_id]	+= '</ul>';
			});
			menuConfig.cacheList[root_id]	= menuConfig.cacheList[root_id];
		}

		menuConfig.child2DomEle.html(menuConfig.cacheList[root_id]).css("display", "block").find("ul").css("display", "none");
		$.id("menu_" + id).css("display", "block");
	};
	switch(module){
		case "raovat": var getCache = typeof(arrMenuRaovat); break;
		case "hoidap": var getCache = typeof(arrMenuHoidap); break;
		default: 		var getCache = typeof(arrMenuProduct); break;
	}
	if(getCache == "undefined") $.getScript("/cache/left_menu/menu_drop_" + module + "_v4.js", showMenu);
	else showMenu();
}

function loadDetailProduct($this){
	var iPro	= $this.attr("idata") || 0;
	var iEst	= $this.attr("iest") || 0;
	$this.addClass('current_load');
	if(iPro > 0 && iEst > 0){
		windowPrompt({
			href: '/ajax_v4/load_detail_product.php?iPro=' + iPro + "&iEst=" + iEst,
			iframe: true, padding: 0, width: 1030, height: 600,
			onComplete: function(element){
				var domEle	= $this.parent().find('.wrapper').filter(function(){ return $(this).attr('idata') > 0 && $(this).attr('iest') > 0})
				if(domEle.length > 1){
					var control =  '<div id="windowPrompt_next" class="windowPrompt_control windowPrompt_next"><i class="icon_sprite icon_sprite_carousel_next"></i></div>' +
										'<div id="windowPrompt_prev" class="windowPrompt_control windowPrompt_prev"><i class="icon_sprite icon_sprite_carousel_prev"></i></div>';
					element.wPrompt.append(control);
					$("#windowPrompt_next, #windowPrompt_prev").on('click', function(){
						var bonus 	= ($(this).attr('id') == 'windowPrompt_next' ? 1 : -1)
						var current	= domEle.filter('.current_load').removeClass('current_load');
						domEle.eq((domEle.index(current) + bonus) % domEle.length).addClass("current_load").promise().done(function(){
							loadDetailProduct($(this))
						})
					})
					$(document).one('keydown', function(e){
						switch((e.keyCode ? e.keyCode : e.which)){
							case 37:	// Left Arrow
							case 38:	// Up Arrow
								if($.id('windowPrompt_prev').length > 0 ) $.id('windowPrompt_prev').trigger('click');
								break;
							case 39:	// Right Arrow
							case 40:	// Down Arrow
								if($.id('windowPrompt_next').length > 0 ) $.id('windowPrompt_next').trigger('click');
								break;
						}
						e.preventDefault();
					});
				}
			},
			onClosed: function(){
				$this.removeClass("current_load");
				dataLayer.push({ "event": "trackPTSPKPI", "ptspKPIAction": "Trang danh má»¥c", "ptspKPILabel": "Táº¯t xem nhanh" });
			}
		});
	}
}

function menuAim(module){
	menuConfig.rootDomEle.menuAim({
		activate	: function(domEle){
			menuConfig.rootListDomEle.removeClass("hover selected");
			$(domEle).addClass("hover selected");
			menuConfig.rootSelected	= $(domEle).attr("iData");
			menuConfig.child2DomEle.css("display", "none");
			if($(domEle).hasClass("empty")) menuConfig.child1DomEle.css("display", "none");
			else{
				menuConfig.child1DomEle.css("display", "block").find("ul").css("display", "none");
				$.id("menu_" + menuConfig.rootSelected).css("display", "block");
			}
		},
		enter		: function(domEle){ if($(domEle).hasClass("selected")) $(domEle).addClass("hover"); },
		exitMenu	: function(){ return true; }
	});

	menuConfig.child1DomEle.find("ul").menuAim({
		activate	: function(domEle){
			menuConfig.child1DomEle.find("li").removeClass("hover");
			$(domEle).addClass("hover");
			if($(domEle).hasClass("empty")) menuConfig.child2DomEle.css("display", "none");
			else loadMenu(module, $(domEle).attr("iData"));
		},
		exitMenu	: function(){ return true; }
	});
}

function isEmail($email){ if($email == "") return false; var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; return emailReg.test($email); }

function isUrl(s){var reg=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;return reg.test(s);}

function loadAjaxContent(url){
	var key	= (typeof(arguments[1]) != "undefined" ? arguments[1] : "");
	if(key != ""){
		if(typeof(vatgiaConfig.cache_data[key]) == "undefined") vatgiaConfig.cache_data[key]	= $.ajax({ url: url, cache: false, async: false }).responseText;
		return vatgiaConfig.cache_data[key];
	}
	else return $.ajax({ url: url, cache: false, async: false }).responseText;
}

function loadNews(iData){
	windowPrompt({ width: 900, height: "90%", maxHeight: 700, href: "/ajax_v3/load_news.php?iData=" + iData, cache: false, iframe: true });
}

function moveScrollTop(){
	var opts	= {
		top		: 0,
		margin	: 0,
		object	: null,
		duration	: 400,
		callback	: false
	};
	if(typeof(arguments[0]) != "undefined"){
		if(arguments[0] instanceof $) opts.object	= arguments[0];
		else if(typeof(arguments[0]) == "function") opts.callback = arguments[0];
		else if(typeof(arguments[0]) == "object") $.extend(opts, arguments[0]);
		if(opts.object != null) opts.top	= opts.object.offset().top;
	}
	$("body, html").animate({ scrollTop: (opts.top - opts.margin < 0 ? 0 : opts.top - opts.margin) }, opts.duration).promise().then(opts.callback);
}

function resizeWindow(){
	document.getElementById("container_body").className	= (vatgiaConfig.window_width < 1200 ? "container_body_resize" : "");
}

function setUtmCampaign(source, campaign, medium){
	source		= source || '';
	campaign		= campaign || '';
	medium		= medium || '';
	var href		= window.location.href;
	var hash		= window.location.hash;
	var utm_c	= ['utm_source','utm_medium','utm_campaign'];
	for(i in utm_c){
		if(href.search(utm_c[i]) > -1 || hash.search(utm_c[i]) > -1) return false;
	}
	window.location.hash	= hash + 'utm_source=' + source + '&utm_campaign=' + campaign + '&utm_medium=' + medium;
}

// Auto complete
function setAutoComplete(){
	$.id("header_search_keyword").autocomplete("/ajax/autocomplete.php", {
		width			: ($.id("home_product_promotion").length ? 488 : 481),
		delay			: 150,
		minChars		: 0,
		scroll		: false,
		max			: 25,
		selectFirst	: false,
		formatResult: formatResult,
		formatItem	: formatItem
	});
}
function removeAutoComplete(){ $.id("header_search_keyword").unautocomplete(); }
function formatItem(row){ return row[0]; }
function formatResult(row){ return row[1]; }

function showFilter(domEle){
	var opts	= {
		filter: domEle.prev(),
		sel	: "li",
		index	: 7
	};
	if(typeof(arguments[1]) != "undefined") $.extend(opts, arguments[1]);
	opts.filter.find(opts.sel).removeClass("hidden");
	if(domEle.hasClass("up")){
		domEle.removeClass("up").attr("title", "Xem thÃªm");
		opts.filter.find(opts.sel + (opts.index !== false ? ":gt(" + opts.index + ")" : "")).addClass("hidden");
	}
	else domEle.addClass("up").attr("title", "Thu gá»n");
}

function stickyOnScrollAction(domEle, domEleOffsetTop){
	if(domEle.length <= 0) return;
	domEleOffsetTop = domEleOffsetTop || 0;
	$(window).scroll(function(){
		if(vatgiaConfig.scroll_offset > domEleOffsetTop){
			if(vatgiaConfig.scroll_action == 'down') domEle.trigger("sticky_kit:detach");
			else domEle.stick_in_parent();
		}
	});
}

/*** Initiate Load ***/
function footerLoad(){

	vatgiaConfig.window_width	= $(window).width();
	vatgiaConfig.window_height	= $(window).height();

	if(vatgiaConfig.window_width < 1200) resizeWindow();
	$.extend(vatgiaConfig.resize_event, { resizeWindow: resizeWindow });

}

function userFeedBack(){
	html	= '<style>#user_feedback{padding:5px;width:535px}#user_feedback_text .uft_title,#user_feedback_vote .ufv_title{margin:5px 0;padding-left:5px}#user_feedback_text .uft_title b,#user_feedback_vote .ufv_title b{color:#E62C2C}#user_feedback_vote table{border-spacing:2px;border-collapse:separate;height:105px;text-align:center;width:100%}#user_feedback_vote table td{width:20%; cursor: pointer;}#user_feedback_vote table td input{margin-bottom:5px}#user_feedback_success{margin:2px}#user_feedback_success .ufs_table{background:#F1F1F1;display:table;height:125px;width:100%}#user_feedback_success .ufs_table_td{display:table-cell;text-align:center;vertical-align:middle}#user_feedback_success .ufs_table_td b{color:#365DB5;font-size:20px}#user_feedback_text textarea{height:55px;width:96%}#user_feedback_text button{background:#365DB5;border:none;border-radius:3px;color:#FFF;cursor:pointer;font-weight:700;height:30px;line-height:30px;margin-top:3px;width:100%}</style>';
	html += '<div id="user_feedback">';
		html += '<div id="user_feedback_vote">';
			html += '<div class="ufv_title">Vui lÃ²ng Ä‘Ã¡nh giÃ¡ má»©c Ä‘á»™ hÃ i lÃ²ng cá»§a báº¡n trong quÃ¡ trÃ¬nh sá»­ dá»¥ng trang <b>Káº¿t quáº£ tÃ¬m kiáº¿m</b></div>';
			html += '<table><tr>';
				html += '<td style="background: #D7E4EB;"><input type="radio" name="user_feedback" value="Ráº¥t hÃ i lÃ²ng" /><br />Ráº¥t hÃ i lÃ²ng<br />&nbsp;</td>';
				html += '<td style="background: #DAE3E5;"><input type="radio" name="user_feedback" value="HÃ i lÃ²ng" /><br />HÃ i lÃ²ng<br />&nbsp;</td>';
				html += '<td style="background: #E0E5E3;"><input type="radio" name="user_feedback" value="BÃ¬nh thÆ°á»ng" /><br />BÃ¬nh thÆ°á»ng<br />&nbsp;</td>';
				html += '<td style="background: #E5E6DF;"><input type="radio" name="user_feedback" value="KhÃ´ng hÃ i lÃ²ng" /><br />KhÃ´ng<br />hÃ i lÃ²ng</td>';
				html += '<td style="background: #E8E5D9;"><input onclick="" type="radio" name="user_feedback" value="Ráº¥t khÃ´ng hÃ i lÃ²ng" /><br />Ráº¥t khÃ´ng<br />hÃ i lÃ²ng</td>';
			html += '</tr></table>';
		html += '</div>';

		html += '<div id="user_feedback_text" class="hidden">';
			html += '<div class="uft_title">Vui lÃ²ng chia sáº» mong Ä‘á»£i vÃ  váº¥n Ä‘á» báº¡n gáº·p trong quÃ¡ trÃ¬nh sá»­ dá»¥ng trang <b>Káº¿t quáº£ tÃ¬m kiáº¿m</b></div>';
			html += '<textarea class="form_control"></textarea><button style="display:inline-block; width: 49.5%; margin-right: 5px">Gá»­i pháº£n há»“i</button><button style="display:inline-block; width: 49.5%; background:#ab4040;">Bá» qua</button>';
		html += '</div>';

		html += '<div id="user_feedback_success" class="hidden"><div class="ufs_table"><div class="ufs_table_td">';
			html += '<div style="color: #365DB5; font-size: 20px;"><b>Gá»¬I PHáº¢N Há»’I THÃ€NH CÃ”NG</b></div>';
			html += '<div>Xin chÃ¢n thÃ nh cáº£m Æ¡n sá»± Ä‘Ã³ng gÃ³p cá»§a quÃ½ khÃ¡ch hÃ ng</div>';
		html += '</div></div></div>';
	html += '</div>';

	return html;
}

function userFeedBackAction(){
	$.id('user_feedback_vote').find('td').click(function(){
		$(this).find('input').prop('checked', 'checked');
		$.id('user_feedback_vote').fadeOut(function(){
			$.id('user_feedback_text').fadeIn();
		});
	})
	$.id('user_feedback_text').find('button').click(function(){
		var vote 		= $.id('user_feedback_vote').find('input[type=radio]:checked').val();
		var vote_text 	= $.id('user_feedback_text').find('textarea').val();
		$.ajax({ url: '/ajax_v4/user_feedback.php?vote='+ vote + '&vote_text=' + vote_text });

		ga('send', 'event', 'Má»©c Ä‘á»™ hÃ i lÃ²ng cá»§a ngÆ°á»i dÃ¹ng trong quÃ¡ trÃ¬nh sá»­ dá»¥ng trang káº¿t quáº£ tÃ¬m kiáº¿m', 'Feedback', $(this).val());

		$.id('user_feedback_text').fadeOut(function(){
			$.id('user_feedback_success' ).fadeIn(function(){
				setTimeout(function(){ $.id('user_feedback').fadeOut(1000, function(){
					$.id("mini_bar_menu").find(".survey").removeClass("active");
				}); }, 1000)
			});
		});
	})
	$('.user_feedback, .survey').click(function(e){ e.stopImmediatePropagation(); })
	clickOutside(function(){ $.id('user_feedback').hide(); $.id("mini_bar_menu").find(".survey").removeClass("active"); });
}

var previousScroll 	= 0;
$(window).scroll(function(){
	var currentScroll = $(this).scrollTop();
	if(currentScroll > previousScroll) vatgiaConfig.scroll_action = 'down';
	else vatgiaConfig.scroll_action = 'up';
	vatgiaConfig.scroll_offset = previousScroll = currentScroll;
});

function initLoad(){

	$(window).resize(function(){
		if(vatgiaConfig.window_width != $(window).width() || vatgiaConfig.window_height != $(window).height()){
			vatgiaConfig.window_width	= $(window).width();
			vatgiaConfig.window_height	= $(window).height();
			$.each(vatgiaConfig.resize_event, function(key, fn){ fn(); });
		}
	});

	simpleTip();

	if(typeof(hisData) != "undefined") $.get("/ajax_v4/save_history.php?hisData=" + hisData);

	if($('.product_thumb_view').length){
		$('.product_thumb_view').find('.wrapper').hover(function(event){
			$(this).addClass('hover');
		}, function(event){
			if(!$(event.relatedTarget).closest('#simple_tip').length) $(this).removeClass('hover');
		})
	}

}
/*-- End Initiate Load Main --*/

/**
* obj : id cá»§a div Ä‘Æ°á»£c thÃªm ná»™i dung
* status : xÃ¡c Ä‘á»‹nh cÃ³ load ajax vá» k. 0: cÃ³, 1: khÃ´ng load ná»¯a
* url : url
*/
function loadContentToAjax(obj){
	$(document).scroll(function(e){
		var obj_show 		= $(obj);
		var obj_show_top 	= 0;
	   var status 			= obj_show.attr('status');
	   var url				= obj_show.attr('url');
		if(!obj_show_top) {
	       obj_show_top 	= obj_show.offset().top;
	   }

	   scrollPos = $(window).scrollTop();
	   var scrollShow = obj_show_top - 100;
	   if(scrollShow <= scrollPos){
	   	if(status == 0 && url != ''){
	   		$.ajax({
					url: url,
					type: "POST",
					success: function(data){
						$(obj_show).html(data);
					},
					beforeSend: function(){
						$(obj_show).append('<img class="img_center" src="http://static.vatgia.com/20151110/cache/css/v4/loading.gif" />');
	         	},
					dataType: "html"
				});
	   	}
	   	obj_show.attr('status', '1');
	   }

	});
}

function checkAll(ob, type){
	ob2	= ob.find("input[name='c\[\]']");
	if(type == 0){
		ob2.prop("checked", false);
		ob.removeClass("checked");
	}
	else if(type == 1){
		ob2.prop("checked", true);
		ob.addClass("checked");
	}
	else{
		ob2.each(function(){
			$(this).click();
		});
	}
}
