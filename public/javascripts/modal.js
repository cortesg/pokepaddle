$(document).ready(function(){
	$('.lightbox').click(function(){
		$('.backdrop, .lbox').animate({'opacity':'.70'}, 200)
			$('.lbox').animate({'opacity':'1'}, 300)
			$('.backdrop, .lbox').css('display', 'inline-block')
	})
	$('.close').click(function(){
		close_box()
	})
	$('.lbox').click(function(){
		close_box()
	})
	$('.backdrop').click(function(){
		close_box()
	})
})
	function close_box() {
		$('.backdrop, .lbox').animate({'opacity':'0'}, 300, 
		function(){
		$('.backdrop, .lbox').css('display', 'none')
		})
	}   //seems to work but I feel like my syntax is off...
 












