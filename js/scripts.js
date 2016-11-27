
// Haravan_Promotion
var hrvPromotionInited = false;
window.HaravanPromotionAsyncInit = function() {
	hrvPromotionInited = true;
	if(typeof(getPromotionRecommended) == 'function'){
		getPromotionRecommended();
		//$('.vnm-loading').remove();
	}
	if(typeof(addLabel) == 'function')
		addLabel();
};
function addLabel() {
	var arr_prod_id = [];
	$('.pro-gift').each(function(){
		var id = $(this).attr('product-id');
		arr_prod_id.push(id);
	})
	checkPromotionRecommended(arr_prod_id,function(result){
		$.each(result,function(i,item){
			//console.log(item.has_gift);
			if (item.has_gift == true ){
				$('.pro-gift[product-id="' + item.product_id +'"]').removeClass('hidden');
			}
		})
	})
}
function setPromotionStorage(main_variant_id, main_quantity, promotion_variant_id_raw, is_not_overwrite) {
	var key = 'vnmWWWPromotionStorage';
	var promotionStorage = $.jStorage.get(key);
	if(promotionStorage == undefined || promotionStorage == null)
		promotionStorage = {};
	if(is_not_overwrite) {
		var objExisted = promotionStorage[main_variant_id];
		if(typeof(objExisted) != 'undefined')
			return;
	}
	promotionStorage[main_variant_id] = promotion_variant_id_raw;
	$.jStorage.set(key, promotionStorage);
};
function getPromotionStorage(main_variant_id) {
	var key = 'vnmWWWPromotionStorage';
	var promotionStorage = $.jStorage.get(key);
	if(promotionStorage == undefined || promotionStorage == null)
		promotionStorage = {};
	return promotionStorage[main_variant_id];
};
function AddCartItemPromotion(promotion_variant_id, callback) {
	jQuery.ajax({
		type: 'POST',
		url: '/cart/add.js',
		data: 'quantity=' + 999999 + '&id=' + promotion_variant_id,
		dataType: 'json',
		success: function(cart) {
			if (Object.prototype.toString.call(callback) === '[object Function]') callback(cart);
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	});
};
function checkPromotionRecommended(arr_product_id, callback) {
	if(hrvPromotionInited) {
		HaravanPromotion.CheckRecommendeds(arr_product_id, function(result) {
			// success
			if(typeof(callback) == 'function') callback(result);
		}, function() {
			// error
		}, function() {
			// always
		});
	}
};

function UpdateCartFromCart() {
	var listCart = document.querySelectorAll('[id^="updates_"]');
	var tmp  = "";
	var listVariantIdHasPromotion = [];
	var listPromotionIdExisted = [];
	for(var i = 0; i < listCart.length; i++) {
		var price = $(listCart[i]).attr('item-price');
		var qty = 0;
		var variant_id = $(listCart[i]).attr('id').replace('updates_', '');
		if(price == 0) { 
			qty = 999999;
			listPromotionIdExisted.push(variant_id);
		}
		else if(price > 0) {
			qty = listCart[i].value;
			var promotion_variant_id = getPromotionStorage(variant_id);
			if(promotion_variant_id) {
				listVariantIdHasPromotion.push({ variant_id: variant_id, promotion_variant_id: promotion_variant_id });
			}
		}
		if(i > 0) tmp += "&";
		tmp += "updates[]=" + qty;
	}
	jQuery.post('/cart', tmp).always(function() {
		for(var i = 0; i < listVariantIdHasPromotion.length; i++) {
			if(listVariantIdHasPromotion[i].promotion_variant_id
				 && listPromotionIdExisted.indexOf(listVariantIdHasPromotion[i].promotion_variant_id) < 0) {
				AddCartItemPromotion(listVariantIdHasPromotion[i].promotion_variant_id);
				listPromotionIdExisted.push(listVariantIdHasPromotion[i].promotion_variant_id);
			}
		}
		setTimeout(function() { location.reload(); }, 500);
	});
};

$('body').on('click','.btn-addToCart', function() {
	var itemImg = $(this).parents('.product-block').find('img').eq(0);
	flyToElement($(itemImg), $('.vinamilk-cart'));
	$('.topbar-right .cart').addClass('loading');
	var product_id = $(this).attr('data-productid');
	var variant_id = $(this).attr('data-variantid');
	var quantity = 1; 
	jQuery.ajax({
		type: 'POST',
		async: true,
		url: '/cart/add.js',
		data: 'quantity=' + quantity + '&id=' + variant_id,
		dataType: 'json',
		success: function(line_item) { 
			if(product_id != null && product_id != undefined && hrvPromotionInited) {
				var promotion_variant_id = getPromotionStorage(variant_id);
				if(promotion_variant_id != undefined)
					AddCartItemPromotion(promotion_variant_id, function(cart) {
						getCartView();
						check_km();
					});
				else 
					HaravanPromotion.GetRecommendeds(parseInt(product_id), function(result) {
						// success
						if ( result.recommendeds.length > 0 ) {
							result.recommendeds.sort(function(left, right) {
								left.quantity - right.quantity;
							});
							for(var i = 0; i < result.recommendeds.length; i++) {
								var promotionRecommended = result.recommendeds[i];
								if (promotionRecommended.amount == 0 || promotionRecommended.percent == 100) {
									promotion_variant_id = promotionRecommended.variant_ids[0];
									break;
								}
							}
							if(promotion_variant_id != undefined) {
								setPromotionStorage(variant_id, quantity, promotion_variant_id);
								AddCartItemPromotion(promotion_variant_id, function(cart) {
									getCartView();
									check_km();
								});
							}
							else {
								getCartView();
								check_km();
							}
						}
					}, function() {
						// error
					}, function() {
						// always
						getCartView();
					});
			} 
			else {
				getCartView();
				check_km();
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	});
});
function AddCartProductLastView(el) {
	var itemImg = $(el).parents('.product-block').find('img').eq(0);
	flyToElement($(itemImg), $('.vinamilk-cart'));
	$('.topbar-right .cart').addClass('loading');
	var product_id = $(el).attr('data-productid');
	var variant_id = $(el).attr('data-variantid');
	var quantity = 1; 
	var params = {
		type: 'POST',
		url: '/cart/add.js',
		data: 'quantity=' + quantity + '&id=' + variant_id,
		dataType: 'json',
		success: function(line_item) { 
			if(product_id != null && product_id != undefined && hrvPromotionInited) {
				var promotion_variant_id = getPromotionStorage(variant_id);
				if(promotion_variant_id != undefined)
					AddCartItemPromotion(promotion_variant_id, function(cart) {
						getCartView();
						check_km();
					});
				else 
					HaravanPromotion.GetRecommendeds(parseInt(product_id), function(result) {
						// success
						if ( result.recommendeds.length > 0 ) {
							result.recommendeds.sort(function(left, right) {
								left.quantity - right.quantity;
							});
							for(var i = 0; i < result.recommendeds.length; i++) {
								var promotionRecommended = result.recommendeds[i];
								if (promotionRecommended.amount == 0 || promotionRecommended.percent == 100) {
									promotion_variant_id = promotionRecommended.variant_ids[0];
									break;
								}
							}
							if(promotion_variant_id != undefined) {
								setPromotionStorage(variant_id, quantity, promotion_variant_id);
								AddCartItemPromotion(promotion_variant_id, function(cart) {
									getCartView();
									check_km();
								});
							}
							else {
								getCartView();
								check_km();
							}
						}
					}, function() {
						// error
					}, function() {
						// always
						getCartView();
					});
			} 
			else {
				getCartView();
				check_km();
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
};
function AddCartProductQuickView() {
	var product_id = $('.quickview-product #product-select').attr('data-productid');
	var variant_id = $('.quickview-product #product-select').val();
	var quantity = $('.quantity_quickview').val();
	var km_text = $('#km_text').val();
	var params = {
		type: 'POST',
		url: '/cart/add.js',
		data: 'quantity=' + quantity + '&id=' + variant_id,
		dataType: 'json',
		success: function(line_item) { 
			$('.quickview-product').removeClass('active');
			$('.cart-popup').removeClass('hidden').addClass('active');
			if(product_id != null && product_id != undefined && hrvPromotionInited) {
				var promotion_variant_id = getPromotionStorage(variant_id);
				if(promotion_variant_id != undefined)
					AddCartItemPromotion(promotion_variant_id, function(cart) {
						getCartView();
						check_km();
					});
				else 
					HaravanPromotion.GetRecommendeds(parseInt(product_id), function(result) {
						// success
						if ( result.recommendeds.length > 0 ) {
							result.recommendeds.sort(function(left, right) {
								left.quantity - right.quantity;
							});
							for(var i = 0; i < result.recommendeds.length; i++) {
								var promotionRecommended = result.recommendeds[i];
								if (promotionRecommended.amount == 0 || promotionRecommended.percent == 100) {
									promotion_variant_id = promotionRecommended.variant_ids[0];
									break;
								}
							}
							if(promotion_variant_id != undefined) {
								setPromotionStorage(variant_id, quantity, promotion_variant_id);
								AddCartItemPromotion(promotion_variant_id, function(cart) {
									getCartView();
									check_km();
								});
							}
							else {
								getCartView();
								check_km();
							}
						}
					}, function() {
						// error
					}, function() {
						getCartView();
						// always
					});
			} 
			else {
				getCartView();
				check_km();
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
};

// ---

function fixedEncodeURIComponent (str) {
	return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
};
function selectSuggest(act){
	cur = $('.smart-search-wrapper > .select').index();
	length = $('.smart-search-wrapper > a').length;
	if (act == 38)
	{
		if (cur == -1 || cur == 0)
			cur = length - 1;				
		else
			cur = cur - 1;
	}
	if (act == 40)
	{
		if (cur == -1 || cur == length - 1)
			cur = 0;				
		else
			cur = cur + 1;
	}
	$('.smart-search-wrapper>a').removeClass('select');
	$('.smart-search-wrapper>a:nth-child('+ ( cur + 1)+')').addClass('select');
	$('.ultimate-search input[name=q]').val($('.smart-search-wrapper>.select').attr('data-title'));
	return false;
}
(function($) {
	$.fn.smartSearch = function(_option) {
		var top_1 = $('.search-field').offset().top;
		var wid = $('.search-field').width();
		var o, issending = false,
				timeout = null;
		var option = {
			smartoffset: true, //auto calc offset
			searchoperator: '**', //** contain, *= begin with, =* end with
			searchfield: "title",
			searchwhen: 'keyup', //0: after keydown, 1: after keypress, after space
			searchdelay: 500, //delay time before load data
		};
		if (typeof(_option) !== 'undefined') {
			$.each(_option, function(i, v) {
				if (typeof(_option[i]) !== 'undefined') option[i] = _option[i];
			})
		}
		o = $(this);
		o.attr('autocomplete', 'off');
		this.bind(option.searchwhen, function(event) {
			if (event.keyCode == 38 || event.keyCode == 40) {
				return selectSuggest(event.keyCode);
			} else {
				$(".smart-search-wrapper." + option.wrapper).remove();
				clearTimeout(timeout);
				timeout = setTimeout(l, option.searchdelay, $(this).val());
			}
		});     
		var l = function(t) {
			if (issending) return this;
			issending = true;
			coll=''
			if(option.collection != null)
				coll= $(option.collection).val() + "&&";
			$.ajax({
				url: "/search?q=filter=(" + coll + "(" + option.searchfield + ":product" + option.searchoperator + t + "))&view=ultimate-search",
				dataType: "JSON",
				async: true,
				success: function(data) {
					if( $('.smart-search-wrapper.' + option.wrapper).length == 0 ) {
						$('#header').css('z-index',99);
						//$('#nav-cover').show();
						$('body').append("<div class='smart-search-wrapper "  + option.wrapper + "'></div>");
					}
					p();
					$.each(data, function(i, v) {
						$(".smart-search-wrapper." + option.wrapper).append("<a data-title='"+ v.title + "' href='" + v.url + "'>" + v.title + "</a>");
					});
					var q1 = $('input[name=q]').val();
					if( ! q1 ) {
						var q2 = '/search?type=product&q=**';
					}
					else{
						var q2 = '/search?type=product&q=' + q1;
					}
					issending = false;
				},
				error: function (xhr, ajaxOptions, thrownError) {
					//alert(xhr.status);
					//alert(thrownError);
				}
			});
		}
		$(window).resize(function() {
			p();
		});
		$(window).scroll(function() {
			p();
		});
		$(this).blur(function(){
			$('.smart-search-wrapper.' + option.wrapper).slideUp(700);
			//$('#nav-cover').hide();
			$('#header').css('z-index','9999');
		});
		var p = function() {
			if( ! o.offset() ) {
				return;
			}
			$(".smart-search-wrapper." + option.wrapper).css("width", o.outerWidth() + 3 + "px");
			$(".smart-search-wrapper." + option.wrapper).css("left", o.offset().left - 3 +  "px");
			if (option.smartoffset) {
				h = $(".smart-search-wrapper." + option.wrapper).height();
				if (h + o.offset().top - $(window).scrollTop() + o.outerHeight() > $(window).height()) {
					$(".smart-search-wrapper." + option.wrapper).css('top', '');
					$(".smart-search-wrapper." + option.wrapper).css('bottom', ($(window).scrollTop() + $(window).height() - o.offset().top) + "px");
				} else {
					$(".smart-search-wrapper." + option.wrapper).css('bottom', '');
					$(".smart-search-wrapper." + option.wrapper).css('top', (o.offset().top - $(window).scrollTop() + o.outerHeight()) + 4 +  "px");
					//$('.search-wrapper').css('top',top_1 - 3 + 'px');
					//$('.search-wrapper').css('width',wid + 2 +'px');
				}
			} else {
				$(".smart-search-wrapper." + option.wrapper).css('top', (o.offset().top - $(window).scrollTop() + o.outerHeight()) + "px");
			}
		}
		return this;
	};
}(jQuery));
function check_condition(price){
	if (price > price_setting ){
		var note = $('#note').val();
		if(note != ''){
			$('#vnm_checkout').removeClass('disabled').attr('href','/checkout?note='+fixedEncodeURIComponent(note));
		} else{
			$('#vnm_checkout').removeClass('disabled').attr('href','/checkout');
		}
		$('.to-checkout').removeClass('disabled').attr('href','/checkout');
		$('.alert_checkout').hide();
	}
	else{
		$('#vnm_checkout').addClass('disabled').attr('href','javascript:;');
		$('.to-checkout').addClass('disabled').attr('href','javascript:;');
		$('.alert_checkout').show();
	}
};
function RemoveItem(variant_id) {
	$('.main-wrap').prepend('<div class="vnm-loading">Loading&#8230;</div>');
	var tmp = variant_id + ":0";
	var link = '/cart/' + tmp;
	jQuery.post(link);
	//check_km();
	setTimeout(function(){location.reload();},500);
}
function addAttrShop(codeName,codeTitle){
	$.ajax({
		type: "POST",
		url: '/cart/update.js',
		data: {"attributes[cua_hang]": codeName,"attributes[ten_cua_hang]": codeTitle},
		dataType: 'json',
		success: function() {
			//window.location.href = "/cart";
		}	
	});
}
function addAttr(val1, val2, callback) {
	var km_text = $('#km_text').val();
	var codeName = getCookie("codeName");
	if (codeName != "") {
		var code_arr = codeName.split('@@@');
	} else{
		var code_arr = ["null","null"];
	}
	if (val1 >= val2 ){
		$.ajax({
			type: "POST",
			url: '/cart/update.js',
			data: {"attributes[khuyen_mai_tang_hang]": km_text,"attributes[cua_hang]": code_arr[0],"attributes[diachi_cua_hang]": code_arr[1]},
			dataType: 'json',
			success: function() {
				if(typeof(callback) == 'function') callback();
			}	
		});
	} 
	else {
		$.ajax({
			type: "POST",
			url: '/cart/update.js',
			data: {"attributes[khuyen_mai_tang_hang]": null,"attributes[cua_hang]": code_arr[0],"attributes[diachi_cua_hang]": code_arr[1]},
			dataType: 'json',
			success: function() {
				if(typeof(callback) == 'function') callback();
			}		
		});
	}
};
function check_km(){
	//var total_price = 0;
	var km_price = parseInt($('#km_price').val());
	var total_price_final = parseInt($('.to-checkout').data('price-final')) / 100;
	addAttr(total_price_final,km_price);
};
function link_to_checkout(){
	$('.main-wrap').prepend('<div class="vnm-loading">Loading&#8230;</div>');
	var km_price = parseInt($('#km_price').val()),total_price_final = parseInt($('.to-checkout').data('price-final')) / 100;
	addAttr(total_price_final,km_price);
	setTimeout(function(){window.location = '/checkout';}, 700)
};
function checkKMBeforeCheckout(callback){
	var priceFinal = 0, km_price = parseInt($('#km_price').val());
	$.ajax({
		url : "/cart?view=check_km",
		async: false,
		success: function(data) {
			priceFinal = parseInt(data) / 100;
			addAttr(priceFinal, km_price, callback);
		}
	});
};
function org_load(org,callback){
	switch(org) {
		case 'HCM':
			var name_org = "TP. Hồ Chí Minh";
			callback(name_org);
			break;
		case 'HN':
			var name_org = "Hà Nội";
			callback(name_org);
			break;
		case 'MN':
			var name_org = "Các tỉnh Miền Nam";
			callback(name_org);
			break;
		case 'MB':
			var name_org = "Các tỉnh Miền Bắc";
			callback(name_org);
			break;
		case 'MT':
		case 'MR':
			var name_org = "Các tỉnh Miền Trung";
			callback(name_org);
			break;
		case 'DH':
			var name_org = "Các tỉnh Miền Duyên Hải";
			callback(name_org);
			break;
		case 'MD':
			var name_org = "Các tỉnh Miền Đông";
			callback(name_org);
			break;
		case 'MY':
		case 'ML':
			var name_org = "Các tỉnh Miền Tây";
			callback(name_org);
			break;
			//default:
			//callback();
	}
}
function sortdistrict(obj){
	if (obj === undefined ){
	} else {
		var sorted = [],data1 = [],data2 = [],data3 = [];
		$.each(obj,function(i,data){
			if (data.district.indexOf('Huyện') !== -1){
				data2.push(data)
			} else if (data.district.indexOf('Thị xã') !== -1){
				data3.push(data)
			} else{
				data1.push(data)
			}
		})
		for (var i in data1){
			sorted.push(data1[i]);
		}
		for (var i in data2){
			sorted.push(data2[i]);
		}
		for (var i in data3){
			sorted.push(data3[i]);
		}
		return sorted;
	}
}
var shop_list = function(data,item,callback){
	$('.result_store').append('<div class="loader"></div>');
	setTimeout(function(){
		callback(data);
	}, 500);
}

function ShopReplace(distric,callback){
	this.distric = distric;
	switch (this.distric){
		//HCM
		case 'HC486':
			this.distric = 'HC472';
			break;
		case 'HC487':
			this.distric = 'HC472';
			break;
		case 'HC477':
			this.distric = 'HC478';
			break;
		case 'HC484':
			this.distric = 'HC483,HC478';
			break;
		//HN
		case 'HI707':
			this.distric = 'HI698,HI699';
			break;
		case 'HI705':
			this.distric = 'HI698,HI701';
			break;
		case 'HI702':
			this.distric = 'HI687,HI811';
			break;
		case 'HI706':
			this.distric = 'HI701,HI687';
			break;
		case 'HI700':
			this.distric = 'HI687';
			break;
		case 'HI703':
			this.distric = 'HI687,HI13';
			break;
		case 'HI711':
			this.distric = 'HI687,HI13';
			break;
		case 'HI708':
			this.distric = 'HI687,HI13';
			break;
		case 'HI710':
			this.distric = 'HI13';
			break;
		case 'HI704':
			this.distric = 'HI687,HI13';
			break;
		case 'HI34':
			this.distric = 'HI701';
			break;
		case 'HI9':
			this.distric = 'HI701';
			break;
		case 'HI10':
			this.distric = 'HI701,HI810,HI3,HI689,HI11';
			break;
	}
	callback();
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function SelectedShop(){
	if($('input[name="selectShop"]:checked').val() == undefined){
		alert('Vui lòng chọn cửa hàng để giao hàng!');
	} else {
		var codeName = $('input[name="selectShop"]:checked').val(),codeAddress = $('input[name="selectShop"]:checked').data('address'),codeDistrict = $('input[name="selectShop"]:checked').data('district'),codetitle = $('input[name="selectShop"]:checked').data('name');
		var codehtml = '<input type="hidden" name="properties[cua_hang]" data-title="'+codeAddress+'" value="'+ codeName +'" /><a href="javascript:;" data-code="'+codeName+'" class="show__detail_popup" ><span>' + codetitle + ' - ' + codeAddress + '</span></a><a href="javascript:;" id="btn_select_shop_other">&nbsp;(Chọn cửa hàng khác)</a>';
		var cookie_arr = [codeName + '@@@' + codeAddress + '@@@' + codeDistrict + '@@@' + codetitle];
		setCookie("codeName", cookie_arr, 365);					
		$('.product_select_shop').html(codehtml).prev().removeClass('hide');
	}
}
function checkCookie() {
	var codeName = getCookie("codeName");
	if (codeName != "") {
		var code_arr = codeName.split('@@@');
		var codehtml = '<input type="hidden" name="properties[cua_hang]" data-title="'+code_arr[1]+'" value="'+ code_arr[0] +'" /><a href="javascript:;" data-code="'+code_arr[0]+'" class="show__detail_popup" ><span>' + code_arr[3] + ' - ' + code_arr[1] + '</span></a><a href="javascript:;" id="btn_select_shop_other">&nbsp;(Chọn cửa hàng khác)</a>';
		$('.product_select_shop').html(codehtml).prev().removeClass('hide');
	}
}
$('body').on('click','.show__detail_popup', function() {
	jQuery.getJSON("https://onapp.haravan.com/ves/frontend/api/stores?code=" + $(this).data('code'), function(store, textStatus) {
		$('#detail_name').text(store.stores[0].web_title);
		$('#detail_address').text(store.stores[0].web_address);
		$('#detail_phone').text(store.stores[0].phone);
		org_load(store.stores[0].org,function(e){$('#detail_area').text(e)})
		var clone = $('.shop-popup').clone().addClass('active');
		$('#show_details_shop').html(clone);
	})
})
var delivery = {
	list_districts_province: '//hstatic.net/072/1000074072/10/2016/4-13/list_districts_province_data.json',
	init: function(){
		delivery.loadDistrict();
		if(this.getCookies('codeName').split('@@@')[0] != ''){	
			$('.delivery_select_address').hide();
			this.loadDetailStore(delivery.getCookies('codeName').split('@@@')[0]);
		} else{
			$('.delivery_show_selected').hide();
		}
		$('.change_deliveryVNM').off('click').on('click', this.onClickShowDelivery);
		$('.btn_Select_deliveryVNM').off('click').on('click', this.onClickSelectDelivery);
		$('.select_district').off('change').on('change', this.onChangeLoadStores);
	},
	onClickShowDelivery: function(e){
		e.preventDefault();
		$('.delivery-select__preload').removeClass('hide');
		var code = $(e.target).parents('.delivery_select_content').find('.select_district option:selected').val();
		delivery.loadStoreVNMs(code);
		$('.delivery_select_address').show();
		$('.delivery_show_selected').hide();
	},
	onClickSelectDelivery: function(e){
		e.preventDefault();
		var _this = $(e.target).parents('.delivery_select_content').find('.select_storeVNM option:selected');
		var codeName = _this.val(),
				codeAddress = _this.data('address'),
				codeDistrict = _this.data('district'),
				codetitle = _this.data('name');
		if(codeName != "null"){
			var cookie_arr = [codeName + '@@@' + codeAddress + '@@@' + codeDistrict + '@@@' + codetitle];
			setCookie("codeName", cookie_arr, 365);			
			delivery.loadDetailStore(codeName);
			setTimeout(function(){
				$('.delivery_select_address').hide();
				$('.delivery_show_selected').show();
			},200);
		} else{
			$('.select_district').addClass('errors');
		}
	},
	onChangeLoadStores: function(e){
		$('.delivery-select__preload').removeClass('hide');
		$('.select_district').removeClass('errors');
		$('.select_storeVNM').removeClass('errors');
		var code = $(e.target).find('option:selected').val();
		delivery.loadStoreVNMs(code)
	},
	checkSelected: function(){
		if (this.getCookies('codeName') != "") {
			return true;
		} else{
			return false
		}
	},
	getCookies: function(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	changeCity: function(e){
		$('.select_district').empty();
		var index = $(e.target).find("option:selected").index();
		jQuery.getJSON(this.list_districts_province, function(city, textStatus) {		
			$.each(city.data[index].districts,function(i,distric){
				var dis = '<option value="' + distric.code + '">' + distric.name + '</option>';
				$('.select_district').append(dis);
			})
		});
	},
	loadDistrict: function(){
		var check_cookie = this.getCookies('codeName').split('@@@');
		$.getJSON(this.list_districts_province).success(function(city) {
			$.each(city.data[1].districts,function(i,district){
				if(district.code != '' ){
					if (check_cookie[0] != "") {
						if(check_cookie[2] == district.code){
							var dis = '<option selected value="' + district.code + '">' + district.name + '</option>';
						}
						else {
							var dis = '<option value="' + district.code + '">' + district.name + '</option>';
						}
						$('.select_district').append(dis);
					} else{
						var dis = '<option value="' + district.code + '">' + district.name + '</option>';
						$('.select_district').append(dis);
					}
				}
			})
		}).then(function() {
		});
	},
	loadDetailStore: function(code){
			jQuery.getJSON("https://onapp.haravan.com/ves/frontend/api/stores?code=" + code, function(store, textStatus) {
				$('.delivery_show_selected .detail_name').text(store.stores[0].web_title);
				$('.delivery_show_selected .detail_address').text(store.stores[0].web_address);
				$('.delivery_show_selected .detail_phone').text(store.stores[0].phone);
		})
	},
	loadStoreVNMs: function(code){
		$('.select_storeVNM').empty();
		var provin = $('.select_city').val();
		//var distric = $('.select_district option:selected').val();
		var distric = code;
		ShopReplace(distric,function(){
			var url = "//onapp.haravan.com/ves/frontend/api/stores?page=1&province="+ provin + "&district=" + this.distric;
			jQuery.getJSON(url, function(store, textStatus) {
				if(store.total > 0){
					var groups = store.stores;
					var area = {},sort_arr = {}, sort_HCM = {}, sort_HN = {};
					for(var i = 0; i < groups.length; i++) {
						var group = groups[i];    
						if(typeof area[group.org] === "undefined") {
							area[group.org] = [];
						}
						area[group.org].push(group);       
					}
					sort_HCM = {'HCM':area['HCM']};
					sort_HN = {'HN':area['HN']};
					sort_arr = {'HCM':sortdistrict(sort_HCM.HCM),'HN':sortdistrict(sort_HN.HN),'MB':area['MB'],'DH':area['DH'],'MT':area['MT'],'MR':area['MR'],'MD':area['MD'],'MY':area['MY'],'ML':area['ML']};
					$.each(sort_arr , function(i, val) {
						var item = '';
						org_load(i,function(e){
							if (val !== undefined){
								shop_list(val,item,function(data){
									$.each(data,function(i,st){
										var web_title = st.web_title;
										var district = st.district ? (', ' + st.district) : '';
										var province = st.province ? (', ' + st.province) : '';
										if (i==0){
											item = '<option selected data-district="'+st.district_code+'" data-name="' + web_title + '" data-address="' + st.address + district + province + '" value="'+ st.code +'">'+ st.address + district + province +'</option>';
										} else{
											item = '<option data-district="'+st.district_code+'" data-name="' + web_title + '" data-address="' + st.address + district + province + '" value="'+ st.code +'">'+ st.address + district + province +'</option>';
										}
										$('.select_storeVNM').append(item);
									})
									if (delivery.getCookies('codeName').split('@@@')[0] != '') {
										$('.select_storeVNM option[value="'+ delivery.getCookies('codeName').split('@@@')[0] +'"]').prop('selected',true);
									}
									delivery.dropdownMenu();
								});
							}
						});
					});

				}
				else{
					$('.select_storeVNM').html('<option>Không tìm thấy cửa hàng nào</option>');
				}
				setTimeout(function(){$('.delivery-select__preload').addClass('hide')},300);
			});
		});
	},
	dropdownMenu: function(){
		$('.scrollableList').remove();
		$('.select_storeVNM').each(function (index, element) {
			
			$(this).parent()
			.after()
			.append("<div class='scrollableList'><div class='selectedOption'></div><ul></ul></div>");

			$(element).each(function (idx, elm) {
				$('option', elm).each(function (id, el) {
					$('.scrollableList ul:last').append('<li>' + el.text + '</li>');
				});
				$('.scrollableList ul').hide();
				$('.makeMeUl').children('div.selectedOption').text("Chọn cửa hàng");
			});
			$('.scrollableList:last').children('div.selectedOption').text($('.select_storeVNM option:selected').data('address'));
		});
		$('.selectedOption').on('click', function () {
			$(this).next('ul').slideToggle(100);
			$('.selectedOption').not(this).next('ul').hide();
		});
		$('.scrollableList ul li').on('click', function () {
			var selectedLI = $(this).text();
			var index = $(this).index();
			$(".select_storeVNM").find("option:eq(" + index + ")").prop("selected",true);
			$(this).parent().prev('.selectedOption').text(selectedLI);
			$(this).parent('ul').hide();
		});
		$('.scrollableList').show();
		$('.select_storeVNM').hide();
	}
};
jQuery.fn.ForceNumericOnly = function(){
	return this.each(function(){
		$(this).keydown(function(e){
			var key = e.charCode || e.keyCode || 0;
			return (key == 8 || key == 9 ||key == 13 ||key == 46 ||key == 110 ||key == 190 ||(key >= 35 && key <= 40) ||(key >= 48 && key <= 57) ||(key >= 96 && key <= 105));
		});
	});
};
function log(args) {
	var str = "";
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] === "object") {
			str += JSON.stringify(arguments[i]);
		} else {
			str += arguments[i];
		}
	}
	return str;
}
function addCommas(str) {
	var parts = (str + "").split("."),
			main = parts[0],
			len = main.length,
			output = "",
			i = len - 1;

	while(i >= 0) {
		output = main.charAt(i) + output;
		if ((len - i) % 3 === 0 && i > 0) {
			output = "," + output;
		}
		--i;
	}
	// put decimal part back
	if (parts.length > 1) {
		output += "," + parts[1];
	}
	return output;
}
(function($){
	$.fn.setCursorToTextEnd = function() {
		var $initialVal = this.val();
		this.val($initialVal);
		this.focus();
	};
})(jQuery);
/*
$(function () {
	$("input#birthdate").on("invalid", function () {
		this.setCustomValidity("Ngày sinh chưa đúng định dạng!");
	});
	$("input#phone_ac").on("invalid", function () {
		this.setCustomValidity("Số điện thoại phải từ 8 ký tự trở lên");
	});
	$("input#cmnd_hc").on("invalid", function () {
		this.setCustomValidity("CMND/Hộ chiếu phải từ 9 ký tự trở lên");
	});
	$("input#msnv_vnm").on("invalid", function () {
		this.setCustomValidity("Mã nhân viên phải đủ 5 ký tự ");
	});
});
*/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
		// Cache references
		var $el = $(this),
				el = this;
		// Only focus if input isn't already
		if (!$el.is(":focus")) {
			$el.focus();
		}
		// If this function exists... (IE 9+)
		if (el.setSelectionRange) {

			// Double the length because Opera is inconsistent about whether a carriage return is one character or two.
			var len = $el.val().length * 2;

			// Timeout seems to be required for Blink
			setTimeout(function() {
				el.setSelectionRange(len, len);
			}, 1);
		} else {
			// As a fallback, replace the contents with itself
			// Doesn't work in Chrome, but Chrome supports setSelectionRange
			$el.val($el.val());
		}
		// Scroll to the bottom, in case we're in a tall textarea
		// (Necessary for Firefox and Chrome)
		this.scrollTop = 999999;
	});
};
(function($){
	$.fn.outside = function(ename, cb){
		return this.each(function(){
			var $this = $(this),
					self = this;

			$(document).bind(ename, function tempo(e){
				if(e.target !== self && !$.contains(self, e.target)){
					cb.apply(self, [e]);
					if(!self.parentNode) $(document.body).unbind(ename, tempo);
				}
			});
		});
	};
}(jQuery));
function flyToElement(flyer, flyingTo) {
	var $func = $(this);
	var divider = 3;
	var flyerClone = $(flyer).clone();
	$(flyerClone).css({position: 'absolute', top: $(flyer).offset().top + "px", left: $(flyer).offset().left + "px", opacity: 1, 'z-index': 10000});
	$('body').append($(flyerClone));
	var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width()/divider)/2 + 20;
	var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height()/divider)/2 + 20;
	$(flyerClone).animate({
		opacity: 0.4,
		left: gotoX,
		top: gotoY,
		width: 30,
		height: 30
	}, 700,function () {
		$(flyingTo).fadeOut('fast', function () {
			$(flyingTo).fadeIn('fast', function () {
				$(flyerClone).fadeOut('fast', function () {
					$(flyerClone).remove();
				});
			});
		});
	});
}
//update cart mini header

function getCartView(){
	$('.milk-cart .content').empty();
	setTimeout(function(){
		$.ajax({
			url : "/cart?view=mini",
			success: function(data){
				var parsed = $.parseHTML(data);
				$('.milk-cart .content').html(data);
				$('#count_item').html($(parsed).filter('.wrap__list-cart').data('count-item'));
				var l = $('#cart-target');
				if ( l.length > 0){
					$('#cart-target #cart-count').html($(parsed).filter('.wrap__list-cart').data('count-item'));
				}
				$('.cart-price').html(Haravan.formatMoney($(parsed).filter('.wrap__list-cart').data('total-price'))+" đ");
				$('.topbar-right .cart').removeClass('loading');
				$('[data-toggle="tooltip"]').tooltip();
			}
		})
	},250)
}
/*
function getCartView(){
	var price_setting = parseInt($('#cart_price_check').data('price-setting'));
	var text_tooltip = $('#km_text').data('text');
	jQuery.getJSON('/cart.js', function(cart, textStatus) {
		$('#count_item').html(cart.item_count).attr('data-total-price',cart.total_price);
		var l = $('#cart-target');
		if ( l.length > 0){
			$('#cart-target #cart-count').html(cart.item_count);
		}
		$('.cart-price').html(Haravan.formatMoney(cart.total_price,"")+" đ");
		$('.topbar-right .cart').removeClass('loading');
		if($('.milk-cart').length > 0){
			if(cart.item_count > 0){
				$('.milk-cart .content .wrap__list-cart').remove();
				var cart_html = '';
				cart_html += '<div class="wrap__list-cart">';
				cart_html += '</div>';
				cart_html += '<div class="cart-check-mini text-center">';
				cart_html += '<div class="col-md-6">';
				cart_html += '<div class="row">';
				cart_html += '<a class="to-cart button button-medium" href="/cart">';
				cart_html += '<span>Xem giỏ hàng</span></a></div></div>';
				cart_html += '<div class="col-md-6">';
				cart_html += '<div class="row">';
				var total = Number(cart.total_price)/100;
				if (total > price_setting){
					cart_html += '<a class="to-checkout button button-medium" onclick="link_to_checkout();" data-price-final="' + cart.total_price + '" href="javasript:;">';
				} else{
					cart_html += '<a data-toggle="tooltip" data-placement="bottom" data-original-title="'+text_tooltip+'" class="to-checkout button button-medium disabled" href="javascript:;">';
				}
				cart_html += '<span>Thanh toán</span>';
				cart_html += '</a></div></div>';
				cart_html += '</div>';
				$('.milk-cart .content').html(cart_html);
				$.each(cart.items,function(i,item){
					clone_item(item);
				});
				$('[data-toggle="tooltip"]').tooltip();
			} 
			else{
				$('.milk-cart .content .wrap__list-cart').addClass('remove_scroll').html("<p class='text-center'>Giỏ hàng của bạn đang trống!</p>");
				$('.cart-check-mini').remove();
			}
		}
	});
}

function clone_item(item){
	var html = '';
	var variant = '';
	var img = item.image;
	if (img == null){
		img = '//hstatic.net/0/0/global/noDefaultImage6_thumb.gif';
	} else {
		img = Haravan.resizeImage(item.image,'medium');
	}
	if (item.price == 0 ){
		var item_url = 'javascript:;';
	} else {
		var item_url = item.url;
	}
	html += '<div class="list-item clearfix">';
	html += '<div class="col-sm-4">';
	html += '<div class="image-item">';
	html += '<a href="' + item_url + '">';
	if (item.price == 0){
		html += '<img class="img-responsive" src="//sw001.hstatic.net/9/0b68d1e0a25cfa/no-image-gift.png" />';
	}
	else {
		html += '<img class="img-responsive" src="' + img + '" />';
	}
	html += '</a>';
	html += '</div>';
	html += '</div>';
	html += '<div class="col-sm-8" style="padding: 0px;">';
	html += '<div class="detail-item">';
	html += '<a href="' + item_url + '">';
	html += '<strong>'+ item.title + '</trong>';
	html += '</a>';
	html += '<span class="item-qty"><strong>Số lượng: ' + item.quantity + '</strong></span><br>';
	html += '<span class="price-item">' + Haravan.formatMoney(item.price,'') + ' đ</span>';
	html += '</div>';
	html += '</div>';
	if (item.price != 0 ){
		html += '<span class="remove_link">';
		html += '<a class="remove-cart" data-id="' + item.variant_id + '" href="javascript:RemoveItem(' + item.variant_id +');"><i class="fa fa-times-circle"></i>Xóa</a>';
		html += '</span>';
	}
	html += '</div>';
	$('.content .wrap__list-cart').append(html);
}
*/
$(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});
	// scroll body to 0px on click
	$('#back-top a').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
});
auto_width_megamenu();
var vertical_menu_height = $('#box-vertical-megamenus .box-vertical-megamenus').innerHeight();
/**============================== Auto width megamenu ===============================**/
function auto_width_megamenu() {
	var full_width = parseInt($('.container').innerWidth());
	//full_width = $( document ).width();
	var menu_width = parseInt($('.vertical-menu-content').width());
	var width_right = parseInt($('.header-banner').width());
	$('.vertical-menu-content').find('.vertical-dropdown-menu').each(function() {
		$(this).width((full_width - menu_width - width_right) - 50);
		//console.log(full_width - menu_width - width_right);
	});
}
/**============================== Remove menu on top ===============================**/
function remove_menu_ontop() {
	var width = parseInt($(window).width());
	if (width < 768) {
		$('#nav-top-menu').removeClass('nav-ontop');
		if ($('body').hasClass('home')) {
			if (width > 1024) $('#nav-top-menu').find('.vertical-menu-content').show();
			else {
				//$('#nav-top-menu').find('.vertical-menu-content').hide();
			}
		}
	}
	else{
		//$('#nav-top-menu').find('.vertical-menu-content').show();
	}
}
/* Top menu*/
function scrollCompensate() {
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";
	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild(inner);
	document.body.appendChild(outer);
	var w1 = parseInt(inner.offsetWidth);
	outer.style.overflow = 'scroll';
	var w2 = parseInt(inner.offsetWidth);
	if (w1 == w2) w2 = outer.clientWidth;
	document.body.removeChild(outer);
	return (w1 - w2);
}
function resizeTopmenu() {
	if ($(window).width() + scrollCompensate() >= 768) {
		var main_menu_w = $('#main-menu .navbar').innerWidth();
		$("#main-menu ul.mega_dropdown").each(function() {
			var menu_width = $(this).innerWidth();
			var offset_left = $(this).position().left;

			if (menu_width > main_menu_w) {
				$(this).css('width', main_menu_w + 'px');
				$(this).css('left', '0');
			} else {
				if ((menu_width + offset_left) > main_menu_w) {
					var t = main_menu_w - menu_width;
					var left = parseInt((t / 2));
					$(this).css('left', left);
				}
			}
		});
	}
	if ($(window).width() + scrollCompensate() < 1025) {
		$("#main-menu li.dropdown:not(.active) >a").attr('data-toggle', 'dropdown');
	} else {
		$("#main-menu li.dropdown >a").removeAttr('data-toggle');
	}
}
(function($) {
	function hidePopup(selector) {
		$(selector).removeClass('active');
	} window.hidePopup=hidePopup;

	$(document).on('click','.overlay,.continue-shopping, .close-window', function() {   
		hidePopup('.vinamilk-popup'); 
		$(this).parents('.vinamilk-popup').remove();
		$('.product-popup.cart-popup').remove();
		setTimeout(function(){
			$('.loading').removeClass('loaded-content');
		},500);
		return false;
	});
	/*
	$('.dropdown-toggle').click(function() {
		$('.dropdown-content').removeClass('active');
		$(this).next().toggleClass('active');    
		return false;              
	});
	*/
})(jQuery);
var slider = $('#slide-background');
var slider_right = $('.products-block-header');
$(document).ready(function(){
	$('.icon-bar-xs').click(function(){
		$('#overlay').show();
		$('body').toggleClass('menu-open');
	})
	$('body').on('touchstart click','#overlay', function(e){
		e.preventDefault();
		$(this).hide();
		if($('body').hasClass('menu-open')){
			$('body').removeClass('menu-open');
		}
	})
	$("#phone_ac,#cmnd_hc,#id_number,#staff_id").ForceNumericOnly();
	var buiding = $('#buiding').length;
	var khuyenmai = $('#khuyenmai').length;
	if(buiding>0) {
		if( ! localStorage.getItem( "building" ) ) {
			$("#buiding").modal();
		}
		$(document).click(function(e){
			if($(e.target).is("#building") || $(e.target).closest("#building").length){
			}
			else localStorage.setItem( "building", true );
		});
	}
	if(khuyenmai>0) {
		if( ! localStorage.getItem( "khuyenmai" ) ) {
			$("#khuyenmai").modal();
		}
		$(document).click(function(e){
			if($(e.target).is("#khuyenmai") || $(e.target).closest("#khuyenmai").length){
				localStorage.setItem( "khuyenmai", true );
			}
			else localStorage.setItem( "khuyenmai", true );
		});
	}
	$('body').on('click','#btn_select_shop,#btn_select_shop_other',function(e){
		$.ajax({
			url : '/pages/he-thong-cua-hang?view=shop-popup',  
			success: function(data){
				$('body').append(data);
				$('body').on('change','input[name=selectShop]', function() {
					SelectedShop();
				});
			}
		})
	})
	var count_slider = 4;
	var check_prod = $('#prod_wrapper').length;
	if (check_prod > 0){
		count_slider = parseInt($('#count_slider').val());
	}
	$(".product-slide").lightSlider({
		item: count_slider,
		autoWidth: false,
		slideMove: 1, // slidemove will be 1 if loop is true
		slideMargin: 0,

		addClass: '',
		mode: "slide",
		useCSS: true,
		cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
		easing: 'linear', //'for jquery animation',////

		speed: 400, //ms'
		auto: false,
		loop: false,
		slideEndAnimation: true,
		pause: 2000,

		keyPress: false,
		controls: true,
		prevHtml: '<i class="fa fa-angle-left"></i>',
		nextHtml: '<i class="fa fa-angle-right"></i>',

		rtl:false,
		adaptiveHeight:false,

		vertical:false,
		verticalHeight:500,
		vThumbWidth:100,

		thumbItem:10,
		pager: false,
		gallery: false,
		galleryMargin: 5,
		thumbMargin: 5,
		currentPagerPosition: 'middle',

		enableTouch:true,
		enableDrag:true,
		freeMove:true,
		swipeThreshold: 40,

		responsive : [
			{
				breakpoint:800,
				settings: {
					item:3,
					slideMove:1,
					slideMargin:6,
				}
			},
			{
				breakpoint:480,
				settings: {
					item:2,
					slideMove:1,
					controls: true,
					enableTouch:false,
					enableDrag:false,
				}
			}
		],
		onBeforeStart: function (el) {
			//el.find('.pro-loop').each(function(){
			//var src_img = $(this).find('img').attr('data-img');
			//$(this).find('img').attr('src', src_img).show();
			//})
		},
		onSliderLoad: function (el) {

		},
		onBeforeSlide: function (el) {},
		onAfterSlide: function (el) {
			el.find('.pro-loop').each(function(){
				var src_img = $(this).find('img').attr('data-img');
				$(this).find('img').attr('src', src_img).show();
			})
		},
		onBeforeNextSlide: function (el) {},
		onBeforePrevSlide: function (el) {}
	});
	$('.vnm-bannerSlider').lightSlider({
		item: 1,
		autoWidth: false,
		slideMove: 1, // slidemove will be 1 if loop is true
		slideMargin: 0,

		addClass: '',
		mode: "slide",
		useCSS: true,
		cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
		easing: 'linear', //'for jquery animation',////

		speed: 400, //ms'
		auto: true,
		loop: true,
		slideEndAnimation: true,
		pause: 10000,

		keyPress: false,
		controls: true,
		prevHtml: '<i class="fa fa-angle-left"></i>',
		nextHtml: '<i class="fa fa-angle-right"></i>',

		rtl: false,
		adaptiveHeight: false,

		vertical: false,
		verticalHeight: 500,
		pager: true,
		gallery: false,
		galleryMargin: 5,
		thumbMargin: 5,
		currentPagerPosition: 'middle',

		enableTouch: true,
		enableDrag: true,
		freeMove: true,
		swipeThreshold: 40,
		responsive: [{
			breakpoint: 480,
			settings: {
				pager: false
			}
		}],
		onBeforeStart: function(){
			$('.vnm-bannerSlider > div').removeClass('hide')
		},
		onBeforeSlide: function(el) {
			var $slider = $(el.context),current = (el.getCurrentSlideCount() + $slider.find('.clone').length / 2) - 1;
			$('.vnm-bannerSlider .lslide:not(.clone)').each(function(){
				if ($(this).index() == current){
					var color = $(this).data('background');
					$('#home-slider').css({
						'background': color
					});
				}
			})
		},
		onAfterSlide: function(el) {}
	});
	if($('.collections-wrap')){
		$('.view-product-item li').removeClass('active');
		if(sessionStorage.getView == 'list'){
			$('.view-product-item li.view-list').addClass('active');
			$('.list-collection-item').addClass('list');
			$('.list-collection-item').removeClass('grid');
		}else{
			$('.view-product-item li.view-grid').addClass('active');
			$('.list-collection-item').removeClass('list');
			$('.list-collection-item').addClass('grid');
		}
	}
	/*
var userAgent = navigator.userAgent.toLowerCase(); 
if (userAgent .indexOf('safari')!=-1){ 
	if(userAgent .indexOf('chrome')  > -1){

	}else if((userAgent .indexOf('opera')  > -1)||(userAgent .indexOf('opr')  > -1)){
	}else{
	}
}
*/
	$('.ultimate-search').submit(function(e) {
		e.preventDefault();
		var q = $(this).find('input[name=q]').val();
		if (q.indexOf('filter=') != -1 ){
			window.location = '/search?type=product&q=' + q;
		} else{
			var url = '/search?q=filter=(price:product>0) AND ((title:product**' + q + ') | (tag:product**' + q + '))&sortby=(price:product=desc)';
			if( ! q ) {
				window.location = '/search?type=product&q=**';
				return;
			}
			else{
				window.location = url;
				return;
			}
		}
	});
	$('.see_more_list').click(function(){
		e.preventDefault();
		var q = $('input[name=q]').val();
		if( ! q ) {
			window.location = '/search?type=product&q=**';
			return;
		}
		else{
			window.location = '/search?type=product&q=' + q;
			return;
		}
	})
	jQuery('.ultimate-search input[name=q]').smartSearch({searchdelay:700, wrapper: 'search-wrapper', collection:'.collection_id'});
	$('body').on('click','.view-product-item li a', function(){
		$('.view-product-item li').removeClass('active');
		$(this).parent().addClass('active');
		if($(this).parent().hasClass('view-grid')){
			$('.list-collection-item').removeClass('list');
			$('.list-collection-item').addClass('grid');
			sessionStorage.setItem('getView','grid');
		}else{
			$('.list-collection-item').addClass('list');
			$('.list-collection-item').removeClass('grid');
			sessionStorage.setItem('getView','list');
		}
	})
	/*$("img.imgLazy").lazyload({load : attachEvent,effect : "fadeIn"});
$('.lazy').lazy({
	effect: "fadeIn",
	effectTime: 300,
	threshold: 0
});*/

	$('.btn-select-type').click(function(){
		var price = $('.vnm-select-type').data('price');
		var price_1 = Number(price.replace(/[^0-9\.-]+/g,""));
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		var val = parseInt($(this).data('quan'));
		$('.product-price').find('i').html(log(addCommas(price_1*val)) + ' đ');
	});
	function clickCheckoutRedirect() {
		var note = $('#note').val();
		if(note != '') {
			window.location.href = '/checkout?note=' + fixedEncodeURIComponent(note);
		} else{
			window.location.href = '/checkout';
		}
	};
	$('#vnm_checkout').click(function(e) {
		e.preventDefault();
		if(getCookie("codeName") == ''){
			$('.select_district').addClass('errors');
			$('.select_storeVNM').addClass('errors');
			alert('Vui lòng chọn cửa hàng để giao hàng!');
		}
		else{
			$('.main-wrap').prepend('<div class="vnm-loading">Loading&#8230;</div>');
			checkKMBeforeCheckout(clickCheckoutRedirect);
		}
	});
	$('.selectAmount').click(function(event){
		//event.preventDefault();
		$(this).toggleClass('open');
	})
	$('.register-wrap .userbox').on('change', ':checkbox', function () {
		if ($(this).is(':checked')) {
			$('.register-wrap .userbox [type=submit]').prop('disabled',false);
		} else {
			$('.register-wrap .userbox [type=submit]').prop('disabled',true);
		}
	});
	$("#back-top").hide();
	$('.list-root li a').click(function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_child_id = $(this).parent().data('menu-root');
			$('.list-root').hide();
			$('#' + menu_child_id).show();
		}	
	})
	$('.list-child li:first-child a').click(function(){
		$(this).parents('.list-child').hide();
		$('.list-root').show();
	})
	$('body').on('click', '.product-quantity .qtyplus', function() {
		$('.product-quantity input.qty').val(parseInt($('.product-quantity input.qty').val()) + 1);
	});
	$('body').on('click', '.product-quantity .qtyminus', function() {
		if(parseInt($('.product-quantity input.qty').val()) > 1)
			$('.product-quantity input.qty').val(parseInt($('.product-quantity input.qty').val()) - 1);
	});
	var height_menu = $('#navbar').height();
	var menu_mega = $('#box-vertical-megamenus div#list-category-header').height();
	var homeslider = $('.homeslider').height();
	if (menu_mega < homeslider){
		var padd_b = homeslider - menu_mega;
		$('.is-home#list-category-header').css({ 'padding-bottom' : padd_b });
	}
	if (height_menu > 50){
		$('.is-home#list-category-header').css({ 'padding-bottom' : height_menu / 2 });
	}
	if($(window).width() < 1024 && $(window).width() > 992){
		$('.vinamilk-login').click(function(e){
			e.stopPropagation();
			$('.quickview-login').css({'opacity':'1','transform':'scale(1, 1)'});
		})
		$('body').click(function(e) {
			var target = $(e.target);
			if(!target.is('.vinamilk-login') && !target.is('.quickview-login')) {
				$('.quickview-login').css({'opacity':'0','transform':'scale(1, 0)'});
			}
		});
	}
	$('.vnm-incrementer .qtyplus').on('click',function(e){
		e.preventDefault();
		var input = $(this).parent('.incrementer').find('input');
		var currentVal = parseInt(input.val());
		if (!isNaN(currentVal)) {
			input.val(currentVal + 1);
		} else {
			input.val(1);
		}
	});
	$(".vnm-incrementer .qtyminus").on('click',function(e) {
		e.preventDefault();
		var input = $(this).parent('.incrementer').find('input');
		var currentVal = parseInt(input.val());
		if (!isNaN(currentVal) && currentVal > 1) {
			input.val(currentVal - 1);
		} else {
			input.val(1);
		}
	});
	setTimeout(function(){$('[data-toggle="tooltip"]').tooltip()},200);
	$('.vertical-menu-list').children('li').each(function(){
		var check = $(this).find('.vertical-dropdown-menu').length;
		if ( check != 0 ){
			$(this).mouseover(function(){
				//$('#nav-cover').show();
				$('.vnm-navigation__overlay').show();
				var $img = $(this).find('.vertical-dropdown-menu');
				var src = $img.attr('data-src');
				if (typeof src !== typeof undefined && src !== false) {
					$img.css('background-image', 'url("'+src+'")');
				}
			})
			$(this).mouseout(function(){
				//$('#nav-cover').hide();
				$('.vnm-navigation__overlay').hide();
			})
		}
	})
	if($('#delivery_select_wrapper').length > 0){
		delivery.init();
	}
})
$(window).on({
	load:function(){
		auto_width_megamenu();
	},
	resize:function(){
		auto_width_megamenu();
		remove_menu_ontop();
	}
});