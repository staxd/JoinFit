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
//详情数据
var detailList = JSON.parse(sessionStorage.getItem('actionDetail'))
//添加步骤
$('#addAction').off().on('click', function () {
    var tpl_fn = Handlebars.compile($('#info_template_bz').html());
    $('#actionBzList').append(tpl_fn());
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
    $('#eidtGsList').append(tpl_fn());
})
//删除感受
$('body').on('click', '.delGs', function () {
    var that = $(this)
    that.parent('.message-item').remove()
})
//添加益处
$('#addYc').off().on('click', function () {
    var tpl_fn = Handlebars.compile($('#info_template_yc').html());
    $('#eidtYcList').append(tpl_fn());
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
//图片上传id 0感受 1动作
var uploadImageIndex = 0
//封装显示几个步骤,感受等
function showDetail(text, name, list) {
    if (text == '') {
        return ''
    }
    text = text.slice(1, text.length)
    var result = text.split("·");
    var tpl_fn = Handlebars.compile($('#info_template_' + name).html());
    $('#' + list).children('.message-item').eq(0).find('input').val(result[0])
    var obj = {}
    for (var i = 1; i < result.length; i++) {
        obj = {}
        obj.name = result[i]
        $('#' + list).append(tpl_fn(obj))
    }
}
//封装步骤 感受 益处 常见错误输入判断
function addList(list) {
    var publicList = $('#' + list).children('.message-item')
    var key = '·' + publicList.first().find('input').val() + '\n'
    if (publicList.first().find('input').val() == '') {
        return ''
    }
    var keyLast = publicList.last().find('input').val()==''?"":'·' + publicList.last().find('input').val()
    if (publicList.length == 1) {
        key = '·' + publicList.first().find('input').val()
    } else if (publicList.length == 2) {
        key += keyLast
    } else {
        for (let i = 1; i < publicList.length - 1; i++) {
            if (publicList.eq(i).find('input').val() != "") {
                key += publicList.eq(i).find('input').val()==''?'':'·' + publicList.eq(i).find('input').val() + '\n'
            }
        }
        key = key + keyLast
    }
    return key
}
//显示时间
function timeShow(time) {
    var timeStr = "";
    if (time > -1) {
        var h = Math.floor(time / 3600);
        var min = Math.floor(time / 60) % 60;
        var sec = time % 60;
        timeStr = h + ":" + min + ":" + sec;
    } else {
        return false;
    }
    return timeStr;
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
    return "" + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}

function add0(m) {
    return m < 10 ? '0' + m : m;
}

//显示视屏文件
function showFile(url) {
    var video_html = "<a class='upVideoBox_term clearFile'><video src='" + url + "'></video><i class='del_icon'></i></a>";
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
}

//显示图片文件 0 是感受图，1是动作图
function showImgFile(url, index) {
    var videoImg_html = ''
    if (index) {
        videoImg_html = "<a class='upImageBox_term clearImgFile action_box_img'><img src='" + url + "'/><i class='del_icon'></i></a>";
        $('.upImageBox').eq(index).prepend(videoImg_html);
    } else {
        if (url.indexOf(',') == -1) {
            $('.upImageBox').eq(index).prepend("<a class='upImageBox_term clearImgFile feel_box_img'><img src='" + url + "'/><i class='del_icon'></i></a>");
        } else {
            var yourString = url;
            var result = yourString.split(",");
            for (var i = 0; i < result.length; i++) {
                videoImg_html = "<a class='upImageBox_term clearImgFile feel_box_img'><img src='" + result[i] + "'/><i class='del_icon'></i></a>";
                $('.upImageBox').eq(index).prepend(videoImg_html);

            }
        }

    }
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
            $('body').on('click', '.del_icon', function () {
                var that = $(this)
                if (uploadImageIndex) {
                    video_url = "";
                    video_img = "";
                }
                that.parents('.clearImgFile').remove()
            })

            //清空input框，确保同一个文件可上传
            $('#action_video').val("");
        }
    }).catch(function (err) {
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

    if ($(document).width() < 1500) {
        $(".actionSummary").find("textarea").css({ "width": $(document).width() * 0.73 });
    }



    //添加富文本框
    //editor = KindEditor.create('textarea[name="content"]');

    //器械 部位 难易等级数据
    getPartData(function (type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
            $.each(data, function (k, v) {
                var option_html = '<option value=' + k + '>' + v + '</option>';
                $('#apparatus-action').append(option_html);
            });
            $('#apparatus-action').find("option[value=" + detailList['equipmentType'] + "]").attr("selected", true);
            break;
            case TYPE_ACTIONPART:
                // $.each(data, function (k, v) {
                //     var option_html = '<option value=' + k + '>' + v + '</option>';
                //     $('#position-action').append(option_html);
                // });
                // $('#position-action').find("option[value=" + detailList['partId'] + "]").attr("selected", true);
                var options = {
                };
                $.each(data, function (k, v) {
                    options[k] = v
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
                $('#level-action').find("option[value=" + detailList['level'] + "]").attr("selected", true);
                break;
            }
        });

    //上传文件按钮点击事件
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
        return $("#action_image")[0].click();
    });
    $("#action_image").change(function () {

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

    $("#time-action").change(function () {
        if (!/^(20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/.test(this.value)) {
            $(".tip_msp").css({ "display": "inline-block" });
        } else {
            $(".tip_msp").css({ "display": "none" });
        }
    });

    //设置返回值
    var data_value = ''
    var data_key = ''
    $.each(detailList.parts,function(k,v){
        data_value +=','+v.partName
        data_key += ','+v.partId
    })
    data_value = data_value.slice(1)
    data_key = data_key.slice(1)
    $('#test_div').val(data_value)
    $('#test_div').attr('data-id',data_key)

    //显示步骤，益处，错误，感受
    showDetail(detailList.comment, 'bz', 'actionBzList')
    showDetail(detailList.benefit, 'yc', 'eidtYcList')
    showDetail(detailList.commonMistakes, 'cw', 'cuowuList')
    showDetail(detailList.exerciseFeel, 'gs', 'eidtGsList')
    //显示要领
    $('#breathEssential').val(detailList.breathEssential)
    $('#name-action').val(detailList["name"]);
    // $('#integral-action').val(detailList["accumulatePoints"]);
    $('#time-action').val(timeShow(Number(detailList["lastTimeOnce"])));
    video_URL = detailList["videoUrl"];
    video_img = detailList["exerciseImage"];
    if (detailList.exerciseFeelUrl != '') {
        showImgFile(detailList.exerciseFeelUrl, 0)
    }
    if (video_URL && video_img != "") {
        showFile(video_URL);
        showImgFile(video_img, 1);
    }
    $('#state-action').find("option[value=" + detailList['status'] + "]").attr("selected", true);
    //取消
    $(".cancel").on('click', function () {
        $('.actionLib').click();
    });

    (function () {
        $.fn.extend({
            checks_select: function (options) {
                jq_checks_select = null;
                $(this).off().on('click',function (e) {
                    jq_check = $(this);
                    //jq_check.attr("class", ""); 
                    if (jq_checks_select == null) {
                        jq_checks_select = $("<div class='checks_div_select'></div>").insertAfter(jq_check);
                        $.each(options, function (i, n) {
                            i = i.replace(/\'/g, "")
                            var html= ''
                            var key = 0
                            $.each(detailList.parts,function(index,value){
                                i==value.partId?key++:""
                            })
                            html = $("<div style='height:20px;display:flex;margin: 3px 0;'> <input "+(key?"checked='true'":"")+" class='modify_click' type='checkbox' data-id=" + i + "  value=" + n + ">" + n + "</div>").appendTo(jq_checks_select);
                            check_div = html
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
        var exerciseImage = ''
        if ($("#action_box_img").children().length) {
            exerciseImage = $("#action_box_img").find('img').eq(0).prop('src')
        } else {
            exerciseImage = firstFrame || ''
        }
        var list_options = {
            type: 'post',
            url: 'backEnd/exercise/modify',
            data: {
                id: detailList["id"],
                accumulatePoints: 0,
                exerciseImage,
                lastTimeOnce: time_length($('#time-action').val()) || 0,
                level: $('#level-action option:selected').val(),
                name: $('#name-action').val(),
                partId: $('#test_div').attr('data-id') == "" ? $('#test_div').attr('data-null') : $('#test_div').attr('data-id'),
                equipmentType: $('#apparatus-action option:selected').val(),
                videoUrl: video_URL || '',
                breathEssential: $('#breathEssential').val() == '' ? "" : $('#breathEssential').val(),
                comment: addList('actionBzList'),
                exerciseFeel: addList('eidtGsList'),
                benefit: addList('eidtYcList'),
                commonMistakes: addList('cuowuList'),
                exerciseFeelUrl,
                status: $('#state-action').val()
            }
        }
        var list_back = {}
        list_back.success = function (e) {
            toastr.success("修改成功！");
            var timer = setTimeout(function () {
                $('.actionLib').click();
            }, 2000);
        }
        list_back.before = function () {
            $(".submitBtn").attr({ "disabled": true });

        }
        // console.log(list_options) //ajax调试
        sendAjax(list_options, list_back)
    });
});