$(function(){
	console.log($(document).height());
	/*if ($(document).height() > 1000) {
		$(".messageContent").find("textarea").css({"height":$(document).height()*0.6});
	}else{
		$(".messageContent").find("textarea").css({"height":$(document).height()*0.28});
	}*/

	if ($(document).width() < 1500) {
		$(".messageContent").find("textarea").css({"width":$(document).width()*0.73});
	}

	editor = KindEditor.create('textarea[name="content"]');
});