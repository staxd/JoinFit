//KindEditor.options.filterMode = false;

//oss上传 签名
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    secure: true,
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});

var video_img;
var video_URL;
var firstFrame;


//获取富文本框的值
// function getEditorData() {
//     editor.sync();
//     html = document.getElementById('richTextBox').value;
//     $("#schtmlnr").val(html);
//     return $("#schtmlnr").val();
// }

//获取时长
function time_length(time) {
    var timeLength = 0;
    var time_list = time.split(":");
    if (time_list.length != 3) {
        return false;
    } else {
        timeLength += Number(time_list[0]) * 60 * 60 + Number(time_list[1]) * 60 + Number(time_list[2]);
    }
    return timeLength;
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
    //debugger;
    
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    var fileType = "";


    if ((file.type).indexOf("image/") == -1) {
        $('.video_loading').css({ 'display': 'inline-block' });
        var storeAs = "progrm/video/" + timestamp() + suffix;
        //var video_url = client.getObjectUrl(storeAs);
        var video_url = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
        fileType = "video";
    } else {
        $('.img_loading').css({ 'display': 'inline-block' });
        var storeAs = "progrm/image/" + timestamp() + suffix;
        var video_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
        fileType = "image";
    }

    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function(result) {
        if (fileType == "image"){
           //清空已有文件
            $('.clearImgFile').each(function() {
                $(this).remove(); 
                video_url = "";
                video_img = "";    
            });
            var videoImg_html = "<a class='upImageBox_term clearImgFile'><img src='" + video_Img + "'/><i class='del_icon'></i></a>";
            $('.upImageBox').prepend(videoImg_html);
            $('.img_loading').css({ 'display': 'none' });
             
            //删除文件
            $('.upImageBox').find('.del_icon').each(function(index, element) {
                $(this).on('click', function(event) {
                    video_url = "";
                    video_img = "";
                    $('.upImageBox').find('.del_icon').eq(index).parent('a').remove();
                });

            });

            //清空input框，确保同一个文件可上传
            $('#apparatus_image').val("");
        }else if(fileType == "video"){
            //清空已有文件
            $('.clearFile').each(function() {
                $(this).remove();
            });

            //上传文件显示
            firstFrame = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs + "?x-oss-process=video/snapshot,t_10000,m_fast";
            var video_html = "<a class='upVideoBox_term clearFile'><video src='" + video_url + "'></video><i class='del_icon'></i></a>";
            $('.upVideoBox').prepend(video_html);

            $('.video_loading').css({ 'display': 'none' });

            //删除文件
            $('.upVideoBox').find('.del_icon').each(function(index, element) {
                $(this).on('click', function(event) {
                    video_url = "";
                    video_img = "";
                    $('.upVideoBox').find('.del_icon').eq(index).parent('a').remove();
                });

            });

            //清空input框，确保同一个文件可上传
            $('#apparatus_video').val("");
        }
    }).catch(function(err) {
        console.log(err);
        alert("连接超时请重试");
    });

    if (fileType == "image") {
        return video_Img;
    }else if(fileType == "video"){
        return video_url;
    }

}

$(function() {

    //console.log($(document).width());

    if ($(document).height() > 1000) {
        $(".actionSummary").find("textarea").css({ "height": $(document).height() * 0.18 });
    } else {
        $(".actionSummary").find("textarea").css({ "height": $(document).height() * 0.10 });
    }

    if ($(document).width() < 1500) {
        $(".actionSummary").find("textarea").css({ "width": $(document).width() * 0.73 });
    }

    //添加富文本框
    //editor = KindEditor.create('textarea[name="content"]');

    //获取器械类型数据
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#type-apparatus').append(option_html);
                });
                break;
        }
    });

    //上传按钮点击事件
    var uploadVideo = $(".uploadVideo_btn");
    uploadVideo.on("click", function() {
        return $("#apparatus_video")[0].click();
    });

    $("#apparatus_video").change(function() {
        if ($(this)[0].files[0].size > 1024 * 1024 * 15) {
            alert("上传视频超出大小，请选择小一点的视频！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单个视频！");
            return false;
        } else {
            video_URL = uploadPic($(this));
        }
    });

    var uploadImage = $(".uploadImage_btn");
    uploadImage.on("click", function() {
        return $("#apparatus_image")[0].click();
    });

    $("#apparatus_image").change(function() {

        if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            video_img = uploadPic($(this));
        }
    });

    $("#time-apparatus").change(function() {
        if (!/^(20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/.test(this.value)) {
            $(".tip_msp").css({ "display": "inline-block" });
        } else {
            $(".tip_msp").css({ "display": "none" });
        }
    });

    //保存
    $('.submitBtn').on('click', function() {
        var name = $('#name-apparatus').val();

        var type = $('#type-apparatus option:selected').val();
        var price = Number($('#price-apparatus').val());
        var videoUrl = video_URL;
                var imageUrl = video_img;
        //var comment = getEditorData();
        var comment = $('#schtmlnr').val();
        if (name == "" || name == null || name == undefined) {
            name = "";
        }
        if (type == "" || type == null || type == undefined) {
            type = "";
        }
        if (price == "" || price == null || price == undefined) {
            price = "";
        }
        if (imageUrl == "" || imageUrl == null || imageUrl == undefined) {
            imageUrl = "null";
        }
        if (comment == "" || comment == null || comment == undefined) {
            comment = " ";
        }
        if(name == ""){
            toastr.warning('正在返回页面...','无添加记录！');
            var timer = setTimeout(function() {
                        $('.apparatusMall').click();
                    }, 3000);
        }else if(type == "" ){
            toastr.warning('正在返回页面...','请选择器械类型！');
            var timer = setTimeout(function() {
                        $('.apparatusMall').click();
                    }, 3000);
        }else if(price == ""){
            toastr.warning('正在返回页面...','请输入价格！');
            var timer = setTimeout(function() {
                        $('.apparatusMall').click();
                    }, 3000);
        }else{
             $.ajax({
            type: "POST",
            url: URL + '/equipments/add',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "name": name,
                "imageUrl": imageUrl,
                "price": price,
                "sort": "1",
                "status": "1",
                "purchaseUrl": "",
                "comment": comment,
                "type": type
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'accessToken': obj.accessToken,
                'userLoginId': obj.userLoginId
            },
            withCredentials: true,
            beforeSend: function(){
                $(".submitBtn").attr({"disabled": true});
                $(".submitBtn").css({"background":"#DCDCDC"});
            },
            success: function(data) {

                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("器械新增成功！");
                    toastr.success("器械新增成功！");
                    var timer = setTimeout(function() {
                        $('.apparatusMall').click();
                    }, 2000);


                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                } else {
                    console.log(data);
                    toastr.warning("新增失败！请检查输入内容格式!");
                    $(".submitBtn").removeAttr("disabled");
                    $(".submitBtn").css({"background":"#67C23A"});
                }
            },
            // complete: function () {
            //     $(".submitBtn").removeAttr("disabled");
            // },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
                $(".submitBtn").css({"background":"#67C23A"});
            }
        });
        }
       


    });

    $(".cancel").on('click', function() {
        $('.apparatusMall').click();
    });

});