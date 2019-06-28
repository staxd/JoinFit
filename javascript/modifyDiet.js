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
var ingredientsList = [];
var foodCount = 0;
var stepCount = 0;
var end_judge = 0;

//步骤图片绑定事件
function addStepEvent() {
    $(".stepImgBtn").off();
    $(".stepImg").off();
    $(".stepImgBtn").each(function (index) {
        $(this).on('click',function () {
            return $(".stepImg")[index].click();
        });
    });

    $(".stepImg").each(function (index) {
        $(this).change(function () {
            if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
                alert("上传图片超出大小，请选择小一点的图片！");
                return false;
            } else if ($(this)[0].files.length > 1) {
                alert("请上传单张图片！");
                return false;
            } else {
                //article_img = uploadPic($(this));
                uploadStepPic($(this),index);
            }
        });
    });
}

//获取食材
function getDataFood() {
    ingredientsList = [];
    $(".parameter_name").each(function (index) {
        ingredientsList.push($(this).val());
    });
    $.ajax({
        type: "GET",
        url: URL + '/food/queryMaterials',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'accessToken': obj.accessToken,
            'userLoginId': obj.userLoginId
        },
        withCredentials: true,
        success: function (data) {
            if (data.code == "200" || data.code == "OK") {

                $('.clearOption_food').each(function(){
                    $(this).remove();
                });
                if (data.data.length < 1) {
                    return false;
                }else{
                    for(var i = 0; i < data.data.length ; i++){
                        var option_html = '<option class="clearOption_food" value=' + data.data[i].materialId + '>' + data.data[i].name + '</option>';
                        $('.parameter_name').each(function(){
                            $(this).append(option_html);
                        });
                    }
                    for (var i = 0; i < ingredientsList.length; i++) {
                        $('.parameter_name').eq(i).find("option[value = '" + ingredientsList[i] + "']").attr("selected","selected");
                    }
                    if (end_judge < JSON.parse(sessionStorage["materialList"]).length){
                        //$($(".parameter_name")[end_judge]).val(JSON.parse(sessionStorage["materialList"])[end_judge].materialId);
                        $($(".parameter_name")[end_judge]).find("option[value = " + JSON.parse(sessionStorage["materialList"])[end_judge].materialId + "]").attr("selected","selected");
                        ingredientsList[end_judge] = JSON.parse(sessionStorage["materialList"])[end_judge].materialId;
                    }
                    end_judge += 1;
                }
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//获取二级分类
function getDataLinkage(parentId) {
    $.ajax({
        type: "GET",
        url: url + '/food/queryTagList?type=food_tag&parentId=' + parseInt(parentId),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'accessToken': obj.accessToken,
            'userLoginId': obj.userLoginId
        },
        withCredentials: true,
        success: function (data) {
            if (data.code == "200" || data.code == "OK") {
                $('.clearOption').each(function () {
                    $(this).remove();
                });

                if (data.tagList.length < 1) {
                    return false;
                }else{
                    for(var i = 0; i < data.tagList.length ; i++){
                        var option_html = '<option class="clearOption" value=' + data.tagList[i].id + '>' + data.tagList[i].label + '</option>';
                        $('#secondCategory_diet').append(option_html);
                    }
                }

            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//获取富文本框的值
function getEditorData() {
    editor.sync();
    html = document.getElementById('richTextBox').value;
    $("#schtmlnr").val(html);
    return $("#schtmlnr").val();
}

//阻止事件冒泡——弹出框
function stopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true; //兼容IE
    }
}

//显示步骤图片文件
function showStepImgFile(url,subscript) {
    // debugger;
    var articleImg_html = "<a class='upImageBox_term clearStepImgFile'><img src='" + url + "'/><i class='del_icon'></i></a>";
    $($('.upImgBox_step')[subscript]).prepend(articleImg_html);
    $($('.step_item_img')[subscript]).css({"display":"none"});

    //删除文件
    $($('.upImgBox_step')[subscript]).find('.del_icon').each(function(index, element) {
        $(this).on('click', function(event) {
            $(this).parents('.upImgBox_step').prev().css({"display":"inline-block"});
            //$($('.step_item_img')[index]).css({"display":"inline-block"});
            $(this).parent('a').remove();
            //清空input框，确保同一个文件可上传
            $('#stepImg_' + subscript).val("");
        });

    });
}

//显示图片文件
function showImgFile(url) {

    var articleImg_html = "<a class='upImageBox_term clearImgFile'><img src='" + url + "'/><i class='del_icon'></i></a>";
    $('.upImgBox').prepend(articleImg_html);
    $('.img_loading').css({ 'display': 'none' });

    //删除文件
    $('.upImgBox').find('.del_icon').each(function(index, element) {
        $(this).on('click', function(event) {
            article_img = "";
            $('.upImgBox').find('.del_icon').eq(index).parent('a').remove();
        });

    });
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

//上传步骤图片
function uploadStepPic(obj,subscript) {
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = "diet/image/" + timestamp() + suffix;
    var article_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function(result) {
        //清空已有文件
        $($('.step_item')[subscript]).find('.clearStepImgFile').each(function() {
            $(this).remove();
        });

        showStepImgFile(article_Img,subscript);

    }).catch(function(err) {
        console.log(err);
        alert("连接超时请重试");
    });
    return article_Img;
}

//上传文件
function uploadPic(obj) {
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    $('.img_loading').css({ 'display': 'inline-block' });
    var storeAs = "diet/image/" + timestamp() + suffix;
    var article_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function(result) {
        //清空已有文件
        $('.clearImgFile').each(function() {
            $(this).remove();
        });
        showImgFile(article_Img);

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

    if ($(document).width() < 1500) {
        $(".articleContent").find("textarea").css({"width":$(document).width()*0.73});
    }

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

    getDataFood();

    $("#addIngredientsBtn").on('click',function(){
        foodCount += 1;
        var foodBlockHtml = '<div class="ingredients"><div class="ingredients_item"><span>名称</span>&nbsp<select id="ingredients_' + foodCount + '"  class="parameter_name"><option value=""></option></select></div><div class="ingredients_item">&nbsp<span>用量(g)</span>&nbsp<input type="text" name="" id="consumption_' + foodCount + '" class="parameter" onkeyup="this.value=this.value.replace(/[^0-9.]/g,\'\')" maxlength="20" /></div>&nbsp<span class="foodBlock_del">删除</span></div>';
        $(".ingredientsBox").append(foodBlockHtml);
        getDataFood();

        $(".ingredientsBox").find(".foodBlock_del").each(function (index, element) {
            $(this).on('click', function (event) {
                // $('.ingredientsBox').find('.foodBlock_del').eq(index).parent('.ingredients').remove();
                $(this).parent('.ingredients').remove();
                //foodCount -= 1;
                ingredientsList[index+1] = "";
            });
        });
    });

    $("#addFoodBtn").on('click',function () {
        $(".maskLayer").css({"display":"block"});
        $(".maskLayer").on('click', function() {
            $(this).css({ "display": "none" });
        });

        $(".addFoodPage").on('click', function(e) {
            stopPropagation(e);
        });

        $(".submitBtn_add").on('click',function () {
            if ($("#foodName_add").val().length < 1){
                alert("食材名称不允许为空,请输入食材名称!");
                return;
            }
            $.ajax({
                type: "POST",
                url: URL + '/food/materialAdd',
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "name": $("#foodName_add").val()
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'accessToken': obj.accessToken,
                    'userLoginId': obj.userLoginId
                },
                withCredentials: true,
                beforeSend: function() {
                    $(".submitBtn_add").attr({ "disabled": true });
                    $(".submitBtn_add").css({"background":"#DCDCDC"});
                },
                success: function (data) {
                    console.log(data);
                    if (data.code == "200" || data.code == "OK") {
                        console.log("食材新增成功！");
                        toastr.success("新增成功！");
                        var timer = setTimeout(function() {
                            $('.maskLayer').click();
                        }, 2000);

                        getDataFood();
                    } else if (data.code == "401") {
                        $.cookie("user", "null");
                        data_cookie = null;
                        handleTokenInvalid();
                    } else {
                        console.log(data);
                        toastr.warning("新增失败！请检查输入内容格式!");
                        $(".submitBtn_add").removeAttr("disabled");
                        $(".submitBtn_add").css({"background":"#67C23A"});
                    }
                },
                error: function(error) {
                    console.log("error");
                    $(".submitBtn_add").removeAttr("disabled");
                    $(".submitBtn_add").css({"background":"#67C23A"});
                    toastr.warning("新增失败！请联系开发人员处理!");
                }
            });
        });

        $(".cancel_add").on('click',function () {
            $(".maskLayer").click();
        });
    });

    addStepEvent();

    $("#addStepBtn").on('click',function () {
        stepCount += 1;
        var stepBlockHtml = '<div class="step_item"><span class="stepCount">Step</span>&nbsp<textarea class="stepContent"></textarea><div class="step_item_img"><span class="stepImgBtn addBtn">+添加图片</span><input type="file" name="files" class="stepImg" id="stepImg_' + stepCount + '"  style="display: none;" accept="image/*" /></div>&nbsp<div class="upImgBox_step show_fileBox"></div><span class="stepBlock_del">删除</span></div>';
        $(".step").append(stepBlockHtml);
        addStepEvent();

        $(".step").find(".stepBlock_del").each(function (index, element) {
            $(this).on('click',function (event) {
                $(this).parent('.step_item').remove();
                //stepCount -= 1;
                $(".step").each(function () {
                    var n = 0;
                    for (var j = 0; j < $(this).find(".stepCount").length; j++){
                        n = j+1;
                        $($(this).find(".stepCount")[j]).text("Step" + n);
                    }
                });
            });
        });

        $(".step").each(function () {
            var m = 0;
            for (var i = 0; i < $(this).find(".stepCount").length; i++){
                m = i+1;
                $($(this).find(".stepCount")[i]).text("Step" + m);
            }
        });
    });

    //设置返回值
    $("#title_diet").val(sessionStorage["name"]);
    // var beFind = false;
    // getPartData(function (type, data) {
    //     switch (type) {
    //         case TYPE_DIET:
    //             $.each(data, function (k, v) {
    //                 var option_html = '<option value=' + k + '>' + v + '</option>';
    //                 $('#topCategory_diet').append(option_html);
    //             });
    //             $("#topCategory_diet").change(function () {
    //                 if ($("#topCategory_diet option:selected").val() != "") {
    //                     $(".linkage").css({"display": "block"});
    //                     getDataLinkage($("#topCategory_diet option:selected").val());
    //                 } else {
    //                     $(".linkage").css({"display": "none"});
    //                 }
    //             });
    //             $('#topCategory_diet').find('option').each(function (index) {
    //                 $(this).attr("selected",true);
    //                 $(this).change();
    //                 $("#secondCategory_diet").find('option').each(function () {
    //                     if($(this).text() == sessionStorage["tags"]) {
    //                         $(this).attr("selected",true);
    //                         beFind = true;
    //                         return false;
    //                     }
    //                 });
    //                 if (beFind) {
    //                     return false;
    //                 }
    //             });
    //             break;
    //     }
    // });
    getPartData(function (type, data) {
        switch (type) {
            case TYPE_DIET:
                $.each(data, function (k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#topCategory_diet').append(option_html);
                });
                var tag_list = [];
                // debugger;
                var tags_list_name = sessionStorage["tags"].split(",");
                for (var i=0; i<$('#topCategory_diet > option').length; i++) {
                    for (var j=0; j<tags_list_name.length; j++) {
                        if (tags_list_name[j] == $('#topCategory_diet > option')[i].text) {
                            tag_list.push($('#topCategory_diet > option')[i].value);
                        }
                    }
                }
                $('#topCategory_diet').select2({
                    placeholder: "请选择",
                    tags:true,
                    multiple : true,
                    language: "zh-CN",
                    minimumResultsForSearch: -1
                });
                $("#topCategory_diet").val(tag_list).trigger('change');
                break;
        }
    });

    $("#type_diet").find("option[value=" + sessionStorage['status'] + "]").attr("selected", true);
    $("#label_diet").val(sessionStorage['mark']);
    KindEditor.html('#richTextBox', sessionStorage["comment"]);
    $("#calorie").val(sessionStorage["cal"]);
    $("#carbohydrate").val(sessionStorage["carbs"]);
    $("#protein").val(sessionStorage["protein"]);
    $("#fat").val(sessionStorage["fat"]);
    article_img = sessionStorage["imageUrl"];
    if (article_img != ""){
        showImgFile(article_img);
    }
    //显示食材,步骤
    var materialData = JSON.parse(sessionStorage["materialList"]);
    if (materialData.length > 1) {
        for (var i = 1; i < materialData.length+1; i++) {
            if (i != materialData.length) {
                //setTimeout(function(){$("#addIngredientsBtn").click();},100);
                $("#addIngredientsBtn").click();
            }
            // if (end_judge){
            //     $($(".parameter_name")[i-1]).val(materialData[i-1].materialId);
            //     end_judge = false;
            // }
            $("#consumption_" + [i-1]).val(materialData[i-1].amount);
        }
    } else if (materialData.length == 1) {
        $("#consumption_0").val(materialData[0].amount);
    }

    var stepData = JSON.parse(sessionStorage["stepList"]);
    if(stepData.length > 1){
        for (var j = 1;j < stepData.length+1; j++){
            if (j != stepData.length) {
                $("#addStepBtn").click();
            }
            $($(".stepContent")[j-1]).val(stepData[j-1].content);
            if (stepData[j-1].imageUrl != "" && stepData[j-1].imageUrl != undefined && stepData[j-1].imageUrl != "undefined") {
                showStepImgFile(stepData[j-1].imageUrl,i-1);
            }
        }
    }else if(stepData.length == 1) {
        $($(".stepContent")[0]).val(stepData[0].content);
        if (stepData[0].imageUrl != "" && stepData[0].imageUrl != undefined && stepData[0].imageUrl != "undefined") {
            showStepImgFile(stepData[0].imageUrl,0);
        }
    }

    //保存
    $('.submitBtn').on('click', function() {
        var name = $('#title_diet').val();
        // var tags = $('#secondCategory_diet option:selected').text();
        // if(tags == "" || tags == undefined || tags == "undefined"){
        //     alert("二级分类不允许为空!请选择一级分类后再选择二级分类!");
        //     return;
        // }
        var tags ='';
        var tags_list = $('#topCategory_diet').select2('data');
        if (tags_list.length > 0){
            for (var i=0; i< tags_list.length; i++) {
                tags += tags_list[i].text + ',';
            }
        }
        tags = tags.substr(0,tags.length-1);
        var mark = $('#label_diet').val();
        var status = $('#type_diet option:selected').val();
        var comment = getEditorData();
        if(!specialCharCheck(comment)){
            return;
        }
        var cal = parseInt($('#calorie').val());
        var carbs = parseInt($('#carbohydrate').val());
        var protein = parseInt($('#protein').val());
        var fat = parseInt($('#fat').val());
        var materialListDatas = [];
        $(".ingredients").each(function (index) {
            var materialListData = {};
            materialListData["materialId"] = $(this).find('#ingredients_' + index + ' option:selected').val();
            materialListData["amount"] = parseInt($(this).find('#consumption_' + index).val());
            materialListData["unit"] = "克";
            materialListDatas.push(materialListData);
        });

        //var materialList = JSON.stringify(materialListDatas);

        var stepListDatas = [];
        $(".step_item").each(function (index) {
            var stepListData = {};
            stepListData["content"] = $(this).find(".stepContent").val();
            stepListData["sort"] = parseInt($(this).find(".stepCount").text().replace(/[^0-9]/ig,""));
            stepListData["imageUrl"] = $(this).find("img").attr("src");
            stepListDatas.push(stepListData);
        });
        //var stepList = JSON.stringify(stepListDatas);
        $.ajax({
            type: "POST",
            url: URL + '/food/recipeModify',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "name": name,
                "recipeId": sessionStorage["recipeId"],
                "imageUrl": article_img,
                "tag": tags,
                "mark": mark,
                "status": status,
                "comment": comment,
                "cal": cal,
                "carbs": carbs,
                "protein": protein,
                "fat": fat,
                "materialList": materialListDatas,
                "stepList": stepListDatas
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
                $(".submitBtn").css({"background":"#DCDCDC"});
            },
            success: function(data) {
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("饮食修改成功！");
                    toastr.success("修改成功！");
                    var timer = setTimeout(function() {
                        $('.diet').click();
                    }, 2000);
                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else {
                    console.log(data);
                    toastr.warning("修改失败！请检查输入内容格式!");
                    $(".submitBtn").removeAttr("disabled");
                    $(".submitBtn").css({"background":"#67C23A"});
                }
            },
            error: function(error) {
                console.log(error);
                $(".submitBtn").removeAttr("disabled");
                $(".submitBtn").css({"background":"#67C23A"});
                toastr.warning("修改失败！请联系开发人员处理!");
            }
        });
    });

    $(".cancel").on('click', function() {
        $('.diet').click();
    });
});