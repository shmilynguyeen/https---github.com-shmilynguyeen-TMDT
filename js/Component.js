$(document).ready(function(){
	init();
	$(window).resize(function(){
		console.log($(window).width());
	});
	$(window).scroll(function(){
		fixHeaderPosition();
	});
});
var init  = function(){
	fixHeaderPosition();
};

var fixHeaderPosition = function(){
	var windowScrollTop = $(window).scrollTop();	
	if(windowScrollTop >= 200){		
		$("#toolbar_container").addClass("Toolbar_fixed");
		$("#toolbar_container").addClass("shadow_level_1");
	}else{
		$("#toolbar_container").removeClass("Toolbar_fixed");
		$("#toolbar_container").removeClass("shadow_level_1");
	}
}

