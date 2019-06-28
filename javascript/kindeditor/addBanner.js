//oss上传 签名
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    secure: true,
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});
KindEditor.options.filterMode = false;
var editor;
var article_img;

//获取富文本框的值
function getEditorData() {
    editor.sync();
    html = document.getElementById('richTextBox').value;
    $("#schtmlnr").val(html);
    return $("#schtmlnr").val();
}

//获取时间
function timestamp() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    //console.log(y);
    return "" + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}

function add0(m) {
    return m < 10 ? '0' + m : m;
}

//上传文件
function uploadPic(obj) {
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    $('.img_loading').css({ 'display': 'inline-block' });
    var storeAs = "banner/image/" + timestamp() + suffix;
    var article_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function(result) {
        //清空已有文件
        $('.clearImgFile').each(function() {
            $(this).remove();
        });
        var articleImg_html = "<a class='upImageBox_term clearImgFile'><img src='" + article_Img + "'/><i class='del_icon'></i></a>";
        $('.upImgBox').prepend(articleImg_html);
        $('.img_loading').css({ 'display': 'none' });

        //删除文件
        $('.upImgBox').find('.del_icon').each(function(index, element) {
            $(this).on('click', function(event) {
                article_img = "";
                $('.upImgBox').find('.del_icon').eq(index).parent('a').remove();
            });

        });

        //清空input框，确保同一个文件可上传
        $('#banner_img').val("");
    }).catch(function(err) {
        console.log(err);
        alert("连接超时请重试");
    });
    return article_Img;
}

$(function(){
	var uploadImg = $(".uploadImg_btn");
	uploadImg.on("click",function() {
		return $("#banner_img")[0].click();
	});
	$("#banner_img").change(function(){
		if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            article_img = uploadPic($(this));
        }
	});

	/*if ($(document).height() > 1000) {
		$(".articleContent").find("textarea").css({"height":$(document).height()*0.3});
	}else{
		$(".articleContent").find("textarea").css({"height":$(document).height()*0.08});
	}*/


	if ($(document).width() < 1500) {
		$(".articleContent").find("textarea").css({"width":$(document).width()*0.73});
	}

    $('#startTime_article').datepicker({
        //defaultDate: null,
        dateFormat: 'yy-mm-dd',
        monthNames:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNamesMin:['日', "一", "二", "三", "四", "五", "六"],
        prevText: "上一月",
        nextText: "下一月",
        minDate: '+0',
        language: 'zh-CN',
        autoclose: true
    });
    $('#startTime_article').datepicker('setDate',new Date());
    // $('body').on('focus', '#startTime_article', function(){
	// 	//$(this).datepicker();
	// 	$(this).datetimepicker({
    //         defaultDate: $('#startTime_article').val(),
    //         dateFormat: "yy-mm-dd",
    //         showSecond: false,
    //         timeFormat: 'HH:mm',
    //         stepHour: 1,
    //         stepMinute: 1
    //     });
	// });

    $('#endTime_article').datepicker({
        dateFormat: 'yy-mm-dd',
        monthNames:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNamesMin:['日', "一", "二", "三", "四", "五", "六"],
        prevText: "上一月",
        nextText: "下一月",
        language: 'zh-CN',
        autoclose: true
    });
    $('#endTime_article').datepicker('setDate',new Date("2099-01-01"));
	// $('body').on('focus', '#endTime_article', function(){
	// 	//$(this).datepicker();
	// 	$(this).datetimepicker({
    //         defaultDate: $('#endTime_article').val(),
    //         dateFormat: "yy-mm-dd",
    //         showSecond: false,
    //         timeFormat: 'HH:mm',
    //         stepHour: 1,
    //         stepMinute: 1
    //     });
	// });

	editor = KindEditor.create('textarea[name="content"]', {
    //配置kindeditor编辑器的工具栏菜单项
        items: [
            'source', '|', 'undo', 'redo', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
            'flash', 'emoticons', 'link', 'unlink', '|', 'about'
        ],
        resizeType: 2,
        uploadJson: "http://47.99.81.5:8092/sandbag/control/upload_data",
        fileManageJson: "http://47.99.81.5:8092/sandbag/control/file_Manager",
        allowFileManage: true,
        urlType:'domain',
        allowFileManager : true
    });

    // banner类型数据
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_BANNER:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#banner_articleType').append(option_html);
                });
            break;
        }
    });

    //保存
    $('.submitBtn').on('click', function() {
        var title = $('#title_acticle').val();
        var selectionTag = $('#banner_articleType option:selected').val();
        var status = $('#type_article option:selected').val();
        var startTime = $('#startTime_article').val() + " 00:00:00";
        var endTime = $('#endTime_article').val() + " 00:00:00";
        var tag = $('#label_acticle').val();
        var showOrder = $('#showOrder_acticle').val();
        var content = getEditorData();

        $.ajax({
            type: "POST",
            url: URL + '/publicDocument/add',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "title": title,
                "selectionTag": selectionTag,
                "selectionType": "1",
                "status": status,
                "startTime": startTime,
                "endTime": endTime,
                "imageUrl": article_img,
                "tag": tag,
                "type": "7",
                "showOrder":showOrder,
                "content": content
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'accessToken': obj.accessToken,
                'userLoginId': obj.userLoginId
            },
            withCredentials: true,
            beforeSend: function() {
                $(".submitBtn").attr({ "disabled": true });
            },
            success: function(data) {
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("banner新增成功！");
                    toastr.success("banner文章新增成功！");
                    var timer = setTimeout(function() {
                        $('.bannerManage').click();
                    }, 2000);
                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                } else {
                    console.log(data);
                }
            },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
            }
        });
    });

    $(".cancel").on('click', function() {
        $('.bannerManage').click();
    });
});