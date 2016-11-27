$(document).scroll(function(){
	parallaxScrolling();
});

var speedTest = 4;
function parallaxScrolling(){
	var parallax = $(".Parallax");
	var windowScrollTop = $(window).scrollTop();
	parallax.unbind();
	parallax.each(function(){
		var level = $(this).attr('parallax-level');
		var dy = 1;
		
	});
}
