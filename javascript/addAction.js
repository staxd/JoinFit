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
//图片上传id 0感受 1动作
var uploadImageIndex = 0
//封装步骤 感受 益处 常见错误输入判断
//封装步骤 感受 益处 常见错误输入判断
function addList(list) {
    var publicList = $('#' + list).children('.message-item')
    var key = '·' + publicList.first().find('input').val() + '\n'
    if (publicList.first().find('input').val() == '') {
        return ''
    }
    var keyLast = publicList.last().find('input').val() == '' ? "" : '·' + publicList.last().find('input').val()
    if (publicList.length == 1) {
        key = '·' + publicList.first().find('input').val()
    } else if (publicList.length == 2) {
        key += keyLast
    } else {
        for (let i = 1; i < publicList.length - 1; i++) {
            if (publicList.eq(i).find('input').val() != "") {
                key += publicList.eq(i).find('input').val() == '' ? '' : '·' + publicList.eq(i).find('input').val() + '\n'
            }
        }
        key = key + keyLast
    }
    return key
}
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
    var video_Img = ""
    var gsImg = []
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
        $('.img_loading').eq(uploadImageIndex).css({ 'display': 'inline-block' })
        var storeAs = "progrm/image/" + timestamp() + suffix;

        uploadImageIndex ? video_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs : gsImg.unshift("https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs)

        fileType = "image";
    }

    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function (result) {
        var videoImg_html = ''

        if (fileType == "image") {
            //清空已有文件
            if (uploadImageIndex) {
                $('.upImageBox').eq(uploadImageIndex).children().remove()
                videoImg_html = "<a class='upImageBox_term clearImgFile action_box_img'><img src='" + video_Img + "'/><i class='del_icon'></i></a>";
            } else {
                videoImg_html = "<a class='upImageBox_term clearImgFile feel_box_img'><img src='" + gsImg[0] + "'/><i class='del_icon'></i></a>";
            }

            $('.upImageBox').eq(uploadImageIndex).prepend(videoImg_html);
            $('.img_loading').css({ 'display': 'none' });

            //删除文件
            $('body').on('click', '.del_icon', function () {
                var that = $(this)
                if (uploadImageIndex) {
                    video_url = "";
                    video_img = "";
                }
                that.parents('.clearImgFile').remove()
            })

            //清空input框，确保同一个文件可上传
            $('#action_image').val("");
        } else if (fileType == "video") {
            //清空已有文件
            $('.clearFile').each(function () {
                $(this).remove();
            });

            //上传文件显示
            firstFrame = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs + "?x-oss-process=video/snapshot,t_10000,m_fast";
            var video_html = "<a class='upVideoBox_term clearFile'><video src='" + video_url + "'></video><i class='del_icon'></i></a>";
            $('.upVideoBox').prepend(video_html);

            $('.video_loading').css({ 'display': 'none' });

            //删除文件
            $('.upVideoBox').find('.del_icon').each(function (index, element) {
                $(this).on('click', function (event) {
                    video_url = "";
                    video_img = "";
                    $('.upVideoBox').find('.del_icon').eq(index).parent('a').remove();
                });

            });

            //清空input框，确保同一个文件可上传
            $('#action_video').val("");
        }
    }).catch(function (err) {
        console.log(err);
        alert("连接超时请重试");
    });

    if (fileType == "image") {
        if (uploadImageIndex) {
            return video_Img;
        } else {
            return gsImg;
        }
    } else if (fileType == "video") {
        return video_url;
    }

}

$(function () {
    //添加步骤
    $('#addAction').off().on('click', function () {
        var tpl_fn = Handlebars.compile($('#info_template_bz').html());
        $('#addActionList').append(tpl_fn());
    })
    //删除步骤
    $('body').on('click', '.delBz', function () {
        var that = $(this)
        console.log('aa')
        that.parent('.message-item').remove()
    })
    //添加感受
    $('#addGs').off().on('click', function () {
        var tpl_fn = Handlebars.compile($('#info_template_gs').html());
        $('#addGsList').append(tpl_fn());
    })
    //删除感受
    $('body').on('click', '.delGs', function () {
        var that = $(this)
        that.parent('.message-item').remove()
    })
    //添加益处
    $('#addYc').off().on('click', function () {
        var tpl_fn = Handlebars.compile($('#info_template_yc').html());
        $('#addYcList').append(tpl_fn());
    })
    //删除益处
    $('body').on('click', '.delYc', function () {
        var that = $(this)
        that.parent('.message-item').remove()
    })
    //添加错误
    $('#addCw').off().on('click', function () {
        var tpl_fn = Handlebars.compile($('#info_template_cw').html());
        console.log(tpl_fn())
        $('#cuowuList').append(tpl_fn());
    })
    //删除错误
    $('body').on('click', '.delCw', function () {
        var that = $(this)
        that.parent('.message-item').remove()
    })
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

    //获取器械 部位 难易等级数据
    getPartData(function (type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
            $.each(data, function (k, v) {
                var option_html = '<option value=' + k + '>' + v + '</option>';
                $('#apparatus-action').append(option_html);
            });
            break;
            case TYPE_ACTIONPART:
            var options = {
            };
            $.each(data, function (k, v) {
                console.log(k,v)
                options[k]=v
                var option_html = '<option value=' + k + '>' + v + '</option>';
                $('#position-action').append(option_html);
            });


            $("#test_div").checks_select(options);
            break;
            case TYPE_ACTIONLEVEL:
            $.each(data, function (k, v) {
                var option_html = '<option value=' + k + '>' + v + '</option>';
                $('#level-action').append(option_html);
            });
            break;
        }
    });


    (function () {
        $.fn.extend({
            checks_select: function (options) {
                jq_checks_select = null;
                $(this).click(function (e) {
                    jq_check = $(this);
                    //jq_check.attr("class", ""); 
                    if (jq_checks_select == null) {
                        jq_checks_select = $("<div class='checks_div_select'></div>").insertAfter(jq_check);
                        $.each(options, function (i, n) {
                                check_div = $("<div style='height:20px;display:flex;margin: 3px 0;'> <input class='modify_click'  type='checkbox' data-id=" + i + "  value=" + n + ">" + n + "</div>").appendTo(jq_checks_select) 

                            check_box = check_div.children();
                            check_box.click(function (e) {
                                temp = "";
                                id = ""
                                $("input:checked").each(function (i) {
                                    if (i == 0) {
                                        temp = $(this).prop("value");
                                        id = $(this).attr("data-id");
                                    } else {
                                        temp += "、" + $(this).prop("value");
                                        id += "," + $(this).attr("data-id");
                                    }
                                });
                                jq_check.prop("value", temp);
                                jq_check.attr("data-id", id);
                                e.stopPropagation();
                            });
                        });
                    } else {
                        jq_checks_select.toggle();

                    }
                    e.stopPropagation();
                });
                $(document).click(function () {
                   try{
                    jq_checks_select.hide();

                }catch(e){

                }
            });
                //$(this).blur(function(){ 
                //jq_checks_select.css("visibility","hidden"); 
                //alert(); 
                //}); 
            }
        })

    })(jQuery);

    //上传按钮点击事件
    var uploadVideo = $(".uploadVideo_btn");
    uploadVideo.on("click", function () {
        return $("#action_video")[0].click();
    });
    $("#action_video").change(function () {
        if ($(this)[0].files.length > 1) {
            alert("请上传单个视频！");
            return false;
        } else {
            video_URL = uploadPic($(this));
        }
    });
    var uploadImage = $(".uploadImage_btn");
    uploadImage.on("click", function () {
        uploadImageIndex = Number($(this).attr('data-id'))

        // console.log(Number($(this).attr('data-id')))
        return $("#action_image")[0].click();
    });

    $("#action_image").change(function () {
        console.log(uploadImageIndex)
        if ($(this)[0].files[0].size > 1024 * 1024 * 500) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            video_img = uploadPic($(this));
            if ($('#feel_box_img').children('a').length>1){
                $('#feel_box_img').children('a').last().remove()
            }
        }
    });

    $("#time-action").change(function () {
        if (!/^(20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/.test(this.value)) {
            $(".tip_msp").css({ "display": "inline-block" });
        } else {
            $(".tip_msp").css({ "display": "none" });
        }
    });
    //取消
    $(".cancel").on('click', function () {
        $('.actionLib').click();
    });
    //保存
    $('.submitBtn').on('click', function () {
        //动作感受图片（多个以逗号分隔）
        var exerciseFeelUrl = ''
        var feel = $('#feel_box_img').children('.feel_box_img')        
        if (feel.length) {
            for (let i = 0; i < feel.length; i++) {
                exerciseFeelUrl += feel.eq(i).children('img').prop('src') + ','
            }
            exerciseFeelUrl = exerciseFeelUrl.slice(0, exerciseFeelUrl.length - 1)
        }
        //动作图片
        if (video_img == "" || video_img == null || video_img == undefined) {
            video_img = firstFrame;
        }
        var exerciseImage = ''
        if ($("#action_box_img").children().length){
            exerciseImage = $("#action_box_img").find('img').eq(0).prop('src')
        }else{
            exerciseImage = firstFrame || ''
        }
        var list_options = {
            type: 'post',
            url: 'backEnd/exercise/add',
            data: {
                accumulatePoints: 0,
                exerciseImage,
                lastTimeOnce: time_length($('#time-action').val()) || 0,
                level: $('#level-action option:selected').val(),
                name: $('#name-action').val(),
                // partId: $('#position-action option:selected').val(),
                partId: $('#test_div').attr('data-id') == "" ? $('#test_div').attr('data-null') : $('#test_div').attr('data-id'),
                equipmentType: $('#apparatus-action option:selected').val(),
                videoUrl: video_URL || '',
                breathEssential: $('#breathEssential').val() == '' ? "" : '·' + $('#breathEssential').val(),
                comment: addList('addActionList'),
                exerciseFeel: addList('addGsList'),
                benefit: addList('addYcList'),
                commonMistakes: addList('cuowuList'),
                exerciseFeelUrl
            }
        }
        var list_back = {}
        list_back.success = function (e) {
            // console.log(e)
            // console.log("动作新增成功！");
            toastr.success("新增成功！");
            var timer = setTimeout(function () {
                $('.actionLib').click();
            }, 2000);
        }
        list_back.before = function () {
            $(".submitBtn").attr({ "disabled": true });
            $(".submitBtn").css({ "background": "#DCDCDC" });
        }
        // console.log(list_options) //ajax调试
        sendAjax(list_options,list_back)
    });
});