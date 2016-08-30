function click_modal(){
	$('.close').click(function(){
		close_box()
	})
	$('.modal, .lose_modal').click(function(){
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

function create_modal() {
	ball.body.velocity.set(0, 0)
	$('.backdrop, .modal').animate({'opacity':'.70'}, 200)
	$('.modal').animate({'opacity':'1'}, 300)
	$('.backdrop, .modal').css('display', 'inline-block')
	click_modal()
}

function create_lose_modal() {
	ball.body.velocity.set(0, 0)
	$('.backdrop, .lose_modal').animate({'opacity':'.70'}, 200)
	$('.lose_modal').animate({'opacity':'1'}, 300)
	$('.backdrop, .lose_modal').css('display', 'inline-block')
	click_modal()
}

function close_box() {
	$('.backdrop, .modal, .lose_modal').animate({'opacity':'0'}, 300, 
	function(){
		$('.backdrop, .modal, .lose_modal').css('display', 'none')
	})
	location.reload()
}
 












