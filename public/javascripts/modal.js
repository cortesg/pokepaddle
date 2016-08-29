function create_modal() {
	ball.body.velocity.set(0, 0)
	$('.backdrop, .modal').animate({'opacity':'.70'}, 200)
	$('.modal').animate({'opacity':'1'}, 300)
	$('.backdrop, .modal').css('display', 'inline-block')
	$('.close').click(function(){
		close_box()
	})
	$('.modal').click(function(){
		close_box()
	})
	$('.backdrop').click(function(){
		close_box()
	})
	$(document).keypress(function(e) {
	    if (e.which == 13) {
	        close_box()
	    }
	});
}

function close_box() {
	$('.backdrop, .modal').animate({'opacity':'0'}, 300, 
	function(){
		$('.backdrop, .modal').css('display', 'none')
	})
	location.reload()
}
 












