//KindEditor.options.filterMode = false;

//oss上传 签名
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    secure: true,
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});

//获取时间
function timestamp() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return "" + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}

function add0(m) {
    return m < 10 ? '0' + m : m;
}

//显示视频文件
// function showFile(url) {
//     var video_html = "<a class='upVideoBox_term clearFile'><video src='" + url + "'></video><i class='del_icon'></i></a>";
//     $('.upVideoBox').prepend(video_html);

//     $('.video_loading').css({ 'display': 'none' });

//     //删除文件
//     $('.upVideoBox').find('.del_icon').each(function(index, element) {
//         $(this).on('click', function(event) {
//             video_url = "";
//             video_img = "";
//             $('.upVideoBox').find('.del_icon').eq(index).parent('a').remove();
//         });

//     });
// }

//显示图片文件
function showImgFile(url) {
    var videoImg_html = "<a class='upImageBox_term clearImgFile'><img src='" + url + "'/><i class='del_icon'></i></a>";
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
}

//上传文件
function uploadPic(obj) {
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
        if (fileType == "image") {
            //清空已有文件
            $('.clearImgFile').each(function() {
                $(this).remove();
            });

            showImgFile(video_Img);

            //清空input框，确保同一个文件可上传
            $('#apparatus_image').val("");
        } else if (fileType == "video") {
            //清空已有文件
            $('.clearFile').each(function() {
                $(this).remove();
            });

            //上传文件显示
            firstFrame = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs + "?x-oss-process=video/snapshot,t_10000,m_fast";
            showFile(video_url);

            //清空input框，确保同一个文件可上传
            $('#apparatus_video').val("");
        }
    }).catch(function(err) {
        console.log(err);
        alert("连接超时请重试");
    });

    if (fileType == "image") {
        return video_Img;
    }
    // else if (fileType == "video") {
    //     return video_url;
    // }
}

$(function() {
    $('body').loading({
        loadingWidth:240,
        title:'请耐心等待',
        name:'test',
        discription:'正在疯狂加载中... ',
        direction:'column',
        type:'origin',
        // originBg:'#71EA71',
        originDivWidth:40,
        originDivHeight:40,
        originWidth:6,
        originHeight:6,
        smallLoading:false,
        loadingMaskBg:'rgba(0,0,0,0.2)'
    });

    //console.log($(document).width());

    /*if ($(document).height() > 1000) {
        $(".actionSummary").find("textarea").css({"height":$(document).height()*0.38});
    }else{
        $(".actionSummary").find("textarea").css({"height":$(document).height()*0.08});
    }*/

    if ($(document).width() < 1500) {
        $(".actionSummary").find("textarea").css({ "width": $(document).width() * 0.73 });
    }


 //器械 数据显示
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#type-apparatus').append(option_html);
                });
                $('#type-apparatus').find("option[value=" + sessionStorage['type'] + "]").attr("selected", true);
                break;
        }
    });


    //上传文件按钮点击事件
    // var uploadVideo = $(".uploadVideo_btn");
    // uploadVideo.on("click", function() {
    //     return $("#apparatus_video")[0].click();
    // });

    // $("#apparatus_video").change(function() {
    //     if ($(this)[0].files[0].size > 1024 * 1024 * 15) {
    //         alert("上传视频超出大小，请选择小一点的视频！");
    //         return false;
    //     } else if ($(this)[0].files.length > 1) {
    //         alert("请上传单个视频！");
    //         return false;
    //     } else {
    //         video_URL = uploadPic($(this));
    //     }

    // });

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

    //设置返回值
    console.log(sessionStorage["imageUrl"])
    $('#name-apparatus').val(sessionStorage["name"]);
    // $('#type-apparatus').val(sessionStorage["equipmentId"]);
    $('#type-apparatus').find("option[value=" + sessionStorage['type'] + "]").attr("selected", true);
    $('#price-apparatus').val(sessionStorage["price"]);
     $('#schtmlnr').text(sessionStorage["comment"]);
    // video_URL = sessionStorage["接口视频字段"];
    video_img = sessionStorage["imageUrl"];
    if (video_img != "") {
       
        showImgFile(video_img);
    }
    // if (video_URL!= "") {
    //     showFile(video_URL);
    // }
    $('.submitBtn').on('click', function() {
        var name = $('#name-apparatus').val();
        var type = $('#type-apparatus option:selected').val();
        var price = Number($('#price-apparatus').val());
        var comment = $('#schtmlnr').val();
        // var videoUrl = video_URL;
        var imageUrl = video_img;

        $.ajax({
            type: "POST",
            url: URL + '/equipments/modify',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "name": name,
                "imageUrl": imageUrl,
                "equipmentId":sessionStorage["equipmentId"],
                "price":price,
                "sort" :sessionStorage["sort"],
                "status" :  sessionStorage["status"],
                "purchaseUrl":sessionStorage["purchaseUrl"],
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
                $(".submitBtn").attr({ "disabled": true });
            },
            success: function(data) {
                 var timer = setTimeout(function() {
                                            removeLoading('test');
                                                        }, 400);
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("器械修改成功！");
                    toastr.success("器械修改成功！");
                    var timer = setTimeout(function() {
                        $('.apparatusMall').click();
                    }, 2000);


                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                } else {
                    console.log(data);
                }
            },
            // complete: function () {
            //     $(".submitBtn").removeAttr("disabled");
            // },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
            }
        });


    });

    $(".cancel").on('click', function() {
        $('.apparatusMall').click();
    });
});