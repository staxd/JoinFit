//KindEditor.options.filterMode = false;

//oss上传 签名
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});

var image_URL;
var action_id;
var action_url;
var action_video = {};
var change = false;

//获取富文本框的值
// function getEditorData() {
//     editor.sync();
//     html = document.getElementById('richTextBox').value;
//     $("#schtmlnr").val(html);
//     return $("#schtmlnr").val();
// }

//阻止事件冒泡——弹出框
function stopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true; //兼容IE
    }
}

//显示时间
function timeShow(time){
    var timeStr = "";
    if (time > -1) {
        var h = Math.floor(time/3600);
        var min = Math.floor(time/60) % 60;
        var sec = time % 60;
        timeStr = h + ":" + min + ":" + sec;
    }else{
        return false;
    }
    return timeStr;
}

//获取时长
function time_length(time){
    var timeLength = 0;
    var time_list = time.split(":");
    if (time_list.length != 3) {
        return false;
    }else{
        timeLength += Number(time_list[0])*60*60 + Number(time_list[1])*60 + Number(time_list[2]);
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

//显示图片文件
function showImgFile(image_url) {
    var image_html = "<a class='upImageBox_term clearFile'><img src='" + image_url + "' alt=''/><i class='del_icon '></i></a>";
    $('.upImageBox').prepend(image_html);

    $('.sk-circle').css({ 'display': 'none' });

    //删除文件
    $('.upImageBox').find('.del_icon').each(function(index, element) {
        $(this).on('click', function(event) {
            image_url = "";
            $('.del_icon').eq(index).parent('a').remove();
        });
    });
}

//上传文件
function uploadPic(obj) {
    $('.sk-circle').css({ 'display': 'inline-block' });
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = "exercise/image/" + timestamp() + suffix;
    //var image_url = client.getObjectUrl(storeAs);
    var image_url = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;

    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function(result) {
        //清空已有文件
        $('.clearFile').each(function() {
            $(this).remove();
        });

        //上传文件显示
        showImgFile(image_url);

        //清空input框，确保同一个文件可上传
        $('#train_image').val("");

    }).catch(function(err) {
        console.log(err);
        alert("连接超时请重试");
    });

    return image_url;
}

//显示动作列表
function getDataRow(h) {
    var row = $('<tr class="actionChoose_item clearRow"></tr>');
    row.append("<td class='action_img'><img src='" + h.exerciseImage + "' alt='action.png' /></td>");
    row.append("<td class='action_id'>" + h.id + "</td>");
    row.append("<td class='action_name'>" + h.name + "</td>");
    row.append("<td class='action_time'>" + h.lastTimeOnce + "</td>");
    row.append("<td class='action_apparatus'>" + h.equipmentType + "</td>");
    row.append("<td class='empty'></td>");
    return row;
}

//显示教练列表
function getDataRow_coach(h) {
    var row = $('<tr class="coachChoose_item clearRow"></tr>');
    row.append("<td class='coach_img'><img src='" + h.headPhoto + "' alt='headPhoto.png' /></td>");
    row.append("<td class='coach_name'>" + h.nickname + "</td>");
    row.append("<td class='coach_phone'>" + h.mobilePhone + "</td>");
    row.append("<td class='coach_store'>" + h.storeName + "</td>");
    row.append("<td class='coach_associatedStatus'><label class='attachBtn'>关联</label></td>");
    row.append("<td class='empty' id='" + h.partyId +"'></td>");
    return row;
}

//显示视频文件
function showVideoFile() {
    $.each(action_video, function(k, v) {
        var video_html = "<a class='upImageBox_term clearVideoFile'><video src='" + v + "'></video><i class='del_icon '></i><label class='video_name_id'>" + k.substring(1,k.length-1) +"</label></a>";
        $('.chooseVideoBox').prepend(video_html);
    });

    //删除文件
    $('.chooseVideoBox').find('.del_icon').each(function(index, element) {
        $(this).on('click', function(event) {
            $.each(action_video, function(k, v) {
                if (v == $(element).prev('video').attr("src")) {
                    delete action_video[k];
                }
            });
            $(element).parent('a').remove();
        });
    });
}

function InterfaceFunctions(pageNumber, pageSize, title, equipmentType, nickname, mobilePhone, dataAbout) {
    if(dataAbout == "action"){
        var tbody = $('.actionChoose_listContent').children('tbody');
        var suffix = pageNumber + '&pageSize=' + pageSize;
        if (title == null || title == undefined || title == "") {
            title = "";
        }
        if (equipmentType == null || equipmentType == undefined || equipmentType == "") {
            equipmentType = "";
        }
        if (title != "" || equipmentType != "") {
            suffix = 'title=' + title + '&equipmentType=' + equipmentType + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
        } else {
            suffix = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize;
        }
        $.ajax({
            type: "GET",
            url: URL + '/exercise/queryList?' + suffix,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: {},
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            success: function(data) {
                console.log(data);

                if (data.code == "200" || data.code == "OK") {
                    console.log("获取动作列表成功！");

                    // if (data.data == null || Object.keys(data.data).length === 0) {
                    //     return false;
                    // }

                    if (data.total < 1){
                        $('.clearRow').each(function() {
                            $(this).remove();
                        });
                        toastr.warning("暂无数据！");
                        $('.pagingBox-content').pagination({});
                        return false;
                    }

                    if (title != "" || equipmentType != "") {
                        suffix = '/exercise/queryList?&title=' + title + '&equipmentType=' + equipmentType;
                    } else {
                        suffix = '/exercise/queryList?';
                    }

                    //分页
                    $('.pagingBox-content').pagination({
                        dataSource: URL + suffix,
                        totalNumber: data.total,
                        alias: {
                            pageNumber: 'pageNumber',
                            pageSize: 'pageSize'
                        },
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        callback: function(data, pagination) { //分页回调
                            //console.log(data, pagination); //pagination对象 有当前选择页数

                            //确保翻页时没有旧数据
                            $('.clearRow').each(function() {
                                $(this).remove();
                            });

                            if (data.length < 1) {
                                return false;
                            }

                            //加载动作列表
                            for (var i = 0; i < data.length; i++) {
                                var trow = getDataRow(data[i]);
                                tbody.append(trow);
                            }

                            tbody.find("td").each(function(){

                                if($(this).html() == "undefined"){
                                    $(this).html("");
                                }

                                if($(this).find("img").attr("src") == undefined || $(this).find("img").attr("src") == "" || $(this).find("img").attr("src") == "undefined"){
                                    $(this).find("img").attr("src",defaultImg);
                                }

                            });

                            //搜索框——器械数据
                            getPartData(function(type, data) {
                                switch (type) {
                                    case TYPE_EQUIPMENT:
                                        $.each(data, function(k, v) {
                                            var option_html = '<option value=' + k + '>' + v + '</option>';
                                            $('#search_apparatus').append(option_html);
                                        });
                                        break;
                                }
                            });

                            //列表——器械文字
                            getPartData(function(type, interface_data) {
                                switch (type) {
                                    case TYPE_EQUIPMENT:
                                        $.each(interface_data, function(k, v) {
                                            $('.action_apparatus').each(function(index, element) {
                                                //debugger;
                                                k = k.replace(/'/g, "");
                                                if (k == $('.action_apparatus').eq(index).html()) {
                                                    $('.action_apparatus').eq(index).html(v);
                                                }
                                            });

                                        });
                                        break;
                                }
                            });

                            //弹出框——动作列表点击事件
                            $(".actionChoose_item").each(function(index, element) {
                                $(element).on("click", function(event) {
                                    action_id = data[index].id;
                                    action_url = data[index].videoUrl;
                                    $(".maskLayer").css({ "display": "none" });
                                    $("#search_actionName").val("");
                                    $("#search_apparatus").val("");

                                    action_video["'" + action_id + "'"] = action_url;

                                    //清空已有文件
                                    $(".clearVideoFile").each(function() {
                                        $(this).remove();
                                    });

                                    //上传文件显示
                                    showVideoFile();

                                    //清空input框，确保同一个文件可上传
                                    $('.chooseVideo_btn').val("");
                                });
                            });

                        },
                        locator: 'data'
                    });

                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else {
                    console.log(data);
                }
            },
            error: function(error) {
                console.log("error");
            }
        });
    }else if(dataAbout == "coach"){
        var tbody = $('.coachChoose_listContent').children('tbody');
        var suffix = pageNumber + '&pageSize=' + pageSize;
        if (nickname == null || nickname == undefined || nickname == "") {
            nickname = "";
        }
        if (mobilePhone == null || mobilePhone == undefined || mobilePhone == "") {
            mobilePhone = "";
        }
        if (nickname != "" || mobilePhone != "") {
            suffix ='&nickname=' + nickname + '&mobilePhone=' + mobilePhone + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
        } else {
            suffix ='&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
        }
        $.ajax({
            type: "GET",
            url: URL + '/user/queryTrainnerList?status=PARTY_ENABLED' + suffix,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: {},
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            success: function(data) {
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("获取教练列表成功！");

                    // if (data.data == null || Object.keys(data.data).length === 0) {
                    //     return false;
                    // }

                    if (data.total < 1){
                        $('.clearRow').each(function() {
                            $(this).remove();
                        });
                        toastr.warning("暂无数据！");
                        $('.pagingBox-content_coach').pagination({});
                        return false;
                    }

                    if (nickname != "" || mobilePhone != "") {
                        suffix ='/user/queryTrainnerList?status=PARTY_ENABLED&nickname=' + nickname + '&mobilePhone=' + mobilePhone;
                    }else{
                        suffix ='/user/queryTrainnerList?status=PARTY_ENABLED';
                    }

                    $('.pagingBox-content_coach').pagination({
                        dataSource: URL + suffix,
                        totalNumber: data.total,
                        alias: {
                            pageNumber: 'pageNumber',
                            pageSize: 'pageSize'
                        },
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        callback: function (data, pagination) { //分页回调
                            //console.log(data, pagination); //pagination对象 有当前选择页数

                            //确保翻页时没有旧数据
                            $('.clearRow').each(function () {
                                $(this).remove();
                            });

                            if (data.length < 1) {
                                return false;
                            }

                            //加载教练列表
                            for (var i = 0; i < data.length; i++) {
                                //debugger;
                                var trow = getDataRow_coach(data[i]);
                                tbody.append(trow);
                            }

                            tbody.find("td").each(function(){

                                if($(this).html() == "undefined"){
                                    $(this).html("");
                                }

                                if($(this).find("img").attr("src") == undefined || $(this).find("img").attr("src") == "" || $(this).find("img").attr("src") == "undefined"){
                                    $(this).find("img").attr("src",defaultImg);
                                }

                            });

                            $('.attachBtn').each(function (index, element) {
                                if ($(element).parents('tr').find('.empty').attr('id') == $('#coachRelation-train').val()){
                                    $('.attachBtn').eq(index).css({"color":"#000"});
                                    $('.attachBtn').eq(index).html("已关联");
                                    $('.attachBtn').eq(index).addClass('related');
                                }
                                $(element).on('click',function (event) {
                                    var coachId = $(element).parents('tr').find('.empty').attr('id');
                                    console.log(coachId);

                                    $.ajax({
                                        type: "POST",
                                        url: URL + '/user/trainerProgram',
                                        dataType: "json",
                                        contentType: "application/json;charset=UTF-8",
                                        data: JSON.stringify({
                                            "partyId": coachId,
                                            "programId": sessionStorage["id"],
                                        }),

                                        headers: {
                                            'Access-Control-Allow-Origin': '*',
                                            'Content-Type': 'application/json',
                                            'accessToken': obj.accessToken,
                                            'userLoginId': obj.userLoginId
                                        },
                                        withCredentials: true,
                                        success: function(data) {
                                            console.log(data);
                                            if (data.code == "200" || data.code == "OK") {
                                                console.log("关联教练成功！");
                                                //关闭弹框并显示关联的教练
                                                $('.attachBtn').eq(index).css({"color":"#000"});
                                                $(".maskLayer_coach").css({ "display": "none" });
                                                $("#search_coachName").val("");
                                                $("#search_coachPhone").val("");
                                                $("#coachRelation-train").val(coachId);
                                                toastr.success("关联成功！");
                                            } else if (data.code == "401") {
                                                $.cookie("user", "null");
                                                data_cookie = null;
                                                handleTokenInvalid();
                                            } else {
                                                toastr.warning("关联失败！");
                                                console.log(data);
                                            }
                                        },
                                        error: function(error) {
                                            console.log("error");
                                            toastr.warning("关联失败！");
                                        }
                                    });

                                });
                            });

                        },
                        locator: 'data'
                    });
                }else if(data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else {
                    console.log(data);
                }
            },
            error: function(error) {
                console.log("error");
            }
        });
    }

}

$(function() {

    if ($(document).width() < 1500) {
        $(".trainSummary").find("textarea").css({ "width": $(document).width() * 0.73 });
    }

    //添加富文本框
    //editor = KindEditor.create('textarea[name="content"]');

    //器械 部位 难易等级数据
    getPartData(function(type, data) {
        switch (type) {
            // case TYPE_EQUIPMENT:
            //     $.each(data, function(k, v) {
            //         var option_html = '<option value=' + k + '>' + v + '</option>';
            //         $('#apparatus-train').append(option_html);
            //     });
            //     $('#apparatus-train').find("option[value=" + sessionStorage['equipmentTypes'] + "]").attr("selected", true);
            //     break;
            case TYPE_PLANPART:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#position-train').append(option_html);
                });
                $('#position-train').find("option[value=" + sessionStorage['whichParts'] + "]").attr("selected", true);
                break;
            case TYPE_PLANLEVEL:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#level-train').append(option_html);
                });
                $('#level-train').find("option[value=" + sessionStorage['level'] + "]").attr("selected", true);
                break;
        }
    });

    //上传文件按钮点击事件
    var uploadImage = $(".uploadImage_btn");
    uploadImage.on("click", function() {
        return $("#train_image")[0].click();
    });

    $("#train_image").change(function() {
        if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            image_URL = uploadPic($(this));
        }

    });

    $("#time-train").change(function(){
        if(!/^(20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/.test(this.value)){
            $(".tip_msp").css({"display":"inline-block"});
        }else{
            $(".tip_msp").css({"display":"none"});
        }
    });

    var chooseVideo = $(".chooseVideo_btn");
    chooseVideo.on("click", function() {
        var dataAbout = "action";
        $(".maskLayer").css({ "display": "block" });

        $(".maskLayer").on('click', function() {
            $(this).css({ "display": "none" });
            $("#search_actionName").val("");
            $("#search_apparatus").val("");
        });

        $(".actionChoose").on('click', function(e) {
            stopPropagation(e);
        });

        var pageNumber = 1;
        var pageSize = 10;
        InterfaceFunctions(pageNumber, pageSize, "", "", "", "", dataAbout);

        $('#searchBtn').on('click', function() {
            var searchCondition = [];
            searchCondition[0] = $('#search_actionName').val();
            searchCondition[1] = $('#search_apparatus option:selected').val();
            InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1], "", "",dataAbout);
        });
    });

    //选择教练
    var chooseCoach = $("#coachRelation-train");
    chooseCoach.on("click", function () {
        var dataAbout = "coach";
        $(".maskLayer_coach").css({ "display": "block" });

        $(".maskLayer_coach").on('click', function() {
            $(this).css({ "display": "none" });
            $("#search_coachName").val("");
            $("#search_coachPhone").val("");
        });

        $(".coachChoose").on('click', function(e) {
            stopPropagation(e);
        });

        var pageNumber = 1;
        var pageSize = 10;
        InterfaceFunctions(pageNumber, pageSize, "", "", "", "", dataAbout);

        $('#searchBtn_coach').on('click', function() {
            var searchCondition = [];
            searchCondition[0] = $('#search_coachName').val();
            searchCondition[1] = $('#search_coachPhone').val();
            InterfaceFunctions(pageNumber, pageSize, "", "", searchCondition[0], searchCondition[1],dataAbout);
        });
    });

    //设置返回值
    $('#name-train').val(sessionStorage["name"]);
    $('#state-train').find("option[value=" + sessionStorage['status'] + "]").attr("selected", true);
    $('#calorie-train').val(sessionStorage["consumeEnergy"]);
    $('#time-train').val(timeShow(Number(sessionStorage["lastTime"])));
    $('#restTime-train').val(sessionStorage["restTime"]);
    $('#schtmlnr').text(sessionStorage["comment"]);
    image_URL = sessionStorage["imageUrl"];
    if (image_URL != "") {
        showImgFile(image_URL);
    }

    var exerciseList_id = sessionStorage["exerciseList_id"];
    var exerciseList_url = sessionStorage["exerciseList_url"];
    if (exerciseList_id.indexOf(",") != -1 && exerciseList_url.indexOf(",") != -1 ) {
        var exerciseList_ID = exerciseList_id.split(",");
        var exerciseList_URL = exerciseList_url.split(",");
        if (exerciseList_ID.length == exerciseList_URL.length) {
            for (var i = 0; i < exerciseList_ID.length; i++) {
                
                if (i == exerciseList_ID.length - 1) {
                    break;
                }
                action_video["'" + exerciseList_ID[i] + "'"] = exerciseList_URL[i];
            }
        }
        showVideoFile();
    }

    var coachRelated = sessionStorage["trainerId"];
    if (coachRelated == "" || coachRelated == undefined || coachRelated == "undefined") {
        $('#coachRelation-train').val("");
    }else {
        $('#coachRelation-train').val(coachRelated);
    }

    //保存
    $('.submitBtn').on('click', function() {
        var name = $('#name-train').val();
        var imageUrl = image_URL;
        var consumeEnergy = $('#calorie-train').val();
        var lastTimeOnce = time_length($('#time-train').val());

        var level = $('#level-train option:selected').val();
        var whichParts = $('#position-train option:selected').val();
        var restTime = parseInt($('#restTime-train').val());
        //var equipmentTypes = $('#apparatus-train option:selected').val();
        var status = $('#state-train option:selected').val();

        var exerciseList = "";
        $.each(action_video, function(k, v) {
            exerciseList += k + ',';
        });
        exerciseList = exerciseList.substring(0, exerciseList.length - 1);
        var reg = new RegExp("'", "g");
        var comment = $('#schtmlnr').val();
        if(!specialCharCheck(comment)){
            return;
        }

        $.ajax({
            type: "POST",
            url: URL + '/program/modify',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "id": sessionStorage["id"],
                "name": name,
                "imageUrl": imageUrl,
                "consumeEnergy": consumeEnergy,
                "lastTime": lastTimeOnce,
                "comment": comment,
                "level": level,
                "whichParts": whichParts,
                "restTime": restTime,
                //"equipmentTypes": equipmentTypes,
                "status": status,
                "exerciseList": exerciseList.replace(reg, "")
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
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("训练修改成功！");
                    toastr.success("修改成功！");
                    var timer = setTimeout(function() {
                        $('.trainProgram').click();
                    }, 2000);
                    
                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else {
                    console.log(data);
                    toastr.warning("修改失败！请检查输入内容格式!");
                }
            },
            // complete: function () {
            //     $(".submitBtn").removeAttr("disabled");
            // },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
                toastr.warning("修改失败！请联系开发人员处理!");
            }
        });

    });

    $(".cancel").on('click', function() {
        $('.trainProgram').click();
    });

});