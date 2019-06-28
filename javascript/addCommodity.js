var userAgent = navigator.userAgent;
KindEditor.options.filterMode = false;
var editor;

function imgsPreview(files,fileObj){
	var fileList = files;
	var div =$(".upImgBox");
	if (fileList.length > 1) {
		console.log("文件数量过多");
		return false;
	}else if (fileList[0].size > 1024*1024*5) {
		console.log("文件过大");
		return false;
	}

	for (var i = 0; i < fileList.length; i++) {
		var picHtml = "<a class='upImgBox_term'><img id='bannerImg" + fileList[i].name + "' /><i class='del_icon '></i></a>";
		console.log(picHtml);
		div.prepend(picHtml);

		

		var imgObjPreview = document.getElementById("bannerImg" + fileList[i].name);
		console.log(imgObjPreview);
		if (fileList && fileList[i]) {
			if (userAgent.indexOf("MSIE") == -1) {
				imgObjPreview.src = window.URL.createObjectURL(fileList[i]);
				console.log(imgObjPreview.src);
			}else{
				if (fileObj.value.indexOf(",") != -1) {
					var srcArr =fileObj.value.split(",");
					imgObjPreview.src = srcArr[i];
				}else{
					imgObjPreview.src = fileObj.value;
				}
			}
		}

		$(imgObjPreview).parents(".upImgBox_term").bind("mouseenter",function(){
			$(this).find(".del_icon").css({"opacity":"1"});
			$(".del_icon").on("click",function(){
				var _this = $(this);

				_this.prev('img').attr('id','');
				
				_this.parents(".upImgBox_term").remove();
			});
		});

		$(imgObjPreview).parents(".upImgBox_term").bind("mouseleave",function(){
			$(".del_icon").off("click");
			$(this).find(".del_icon").css({"opacity":"0"});
		});
	}

}


$(function(){
	var uploadImg = $(".uploadImg_btn");
	uploadImg.on("click",function() {
		return $("#banner_img")[0].click();
	});
	$("#banner_img").change(function(){
		var docObj = $(this)[0];
		var imgFile = docObj.files;
		imgsPreview(imgFile,docObj);
	});

	console.log($(document).width());

	/*if ($(document).height() > 1000) {
		$(".commodityContent").find("textarea").css({"height":$(document).height()*0.38});
	}else{
		$(".commodityContent").find("textarea").css({"height":$(document).height()*0.08});
	}*/

	if ($(document).width() < 1500) {
		$(".commodityContent").find("textarea").css({"width":$(document).width()*0.73});
	}


	editor = KindEditor.create('textarea[name="content"]');
	//editor.html('HTML code');

	/*KindEditor.ready(function(K){
		window.editor = K.create('#richTextBox',{
			resizeType : 1,
			allowFileManager : true
		});
	});*/
});