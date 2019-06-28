//oss上传 签名
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    secure: true,
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});

var avatar;
var storeImg;
var tagsCount = 0;
var tagsContent = "";
var markerCustomer=null;
var map, geolocation;
var dw;

//方案一
// var marker;
//
// //高德地图创建
// function onApiLoaded() {
//     map = new AMap.Map('GDmap', {
//         resizeEnable: true,
//         zoom: 10
//     });
//
//     //定位
//     var options = {
//         'showButton': true,//是否显示定位按钮
//         'buttonPosition': 'LB',//定位按钮的位置
//         /* LT LB RT RB */
//         'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
//         'showMarker': true,//是否显示定位点
//         'markerOptions':{//自定义定位点样式，同Marker的Options
//             'offset': new AMap.Pixel(-18, -36),
//             'content':'<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
//         },
//         'showCircle': true,//是否显示定位精度圈
//         'circleOptions': {//定位精度圈的样式
//             'strokeColor': '#0093FF',
//             'noSelect': true,
//             'strokeOpacity': 0.5,
//             'strokeWeight': 1,
//             'fillColor': '#02B0FF',
//             'fillOpacity': 0.25
//         }
//     };
//
//     map.plugin(["AMap.Geolocation"], function() {
//         var geolocation = new AMap.Geolocation(options);
//         map.addControl(geolocation);
//         geolocation.getCurrentPosition();
//         document.getElementById("storeAddress-coach").value = map.getCenter();
//         clearMarker();
//         addMarker(map.getCenter());
//     });
//
//     //高德地图控件
//     map.plugin(["AMap.ToolBar"], function() {
//         map.addControl(new AMap.ToolBar());
//     });
//
//     //鼠标点击获取坐标
//     map.on('click', function(e) {
//         debugger;
//         clearMarker();
//         document.getElementById("storeAddress-coach").value = map.getCenter();
//         addMarker(e.lnglat.lng, e.lnglat.lat);
//     });
// }
//
// // 实例化点标记
// function addMarker(lng, lat) {
//     marker = new AMap.Marker({
//         icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
//         position: new AMap.LngLat(lng,lat),
//         offset: new AMap.Pixel(-13, -30)
//     });
//     marker.setMap(map);
//     map.add(marker)
// }
//
// // 清除 marker
// function clearMarker() {
//     if (marker) {
//         marker.setMap(null);
//         marker = null;
//     }
// }
//


// //地图销毁,公用
// function destroyMap() {
//     map && map.destroy();
//     // console.log("地图已销毁");
// }


//方案二
// function onApiLoaded() {
//     map = new AMap.Map('GDmap', {
//         resizeEnable: true,
//         zoom: 10
//     });
//
//     map.plugin('AMap.Geolocation', function() {
//         geolocation = new AMap.Geolocation({
//             enableHighAccuracy: true,//是否使用高精度定位，默认:true
//             timeout: 10000,          //超过10秒后停止定位，默认：无穷大
//             buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//             // zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
//             buttonPosition:'RB'
//         });
//         map.addControl(geolocation);
//         geolocation.getCurrentPosition();
//         AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
//         AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
//         // document.getElementById("storeAddress-coach").value = map.getCenter();
//     });
//
//     map.plugin(["AMap.ToolBar"], function() {
//         map.addControl(new AMap.ToolBar({
//             locate: false
//         }));
//     });
//
//     //为地图注册click事件获取鼠标点击出的经纬度坐标
//     var clickEventListener = map.on('click', function(e) {
//         document.getElementById("storeAddress-coach").value = e.lnglat.getLng() + ',' + e.lnglat.getLat();
//         // 实例化点标记
//         if(markerCustomer==null){
//             markerCustomer = new AMap.Marker({
//                 icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
//                 position: [e.lnglat.getLng() , e.lnglat.getLat()]
//             });
//         }
//         markerCustomer.setPosition(new AMap.LngLat(e.lnglat.getLng() , e.lnglat.getLat()));
//         markerCustomer.setMap(map);
//
//
//     });
//     var auto = new AMap.Autocomplete({
//         input: "tipinput"
//     });
//     AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
// }
//
// //解析定位结果
// function onComplete(data) {
//     var str=['定位成功'];
//     str.push('经度：' + data.position.getLng());
//     str.push('纬度：' + data.position.getLat());
//
//     dw = new AMap.Marker({
//         // icon: "http://webapi.amap.com/theme/v1.3/markers/n/loc.png",
//         position: [ data.position.getLng() ,  data.position.getLat()]
//     });
//
//     dw.setMap(map);
//     document.getElementById("storeAddress-coach").value = data.position.getLng() + ',' + data.position.getLat()
//
//
// }
// //解析定位错误信息
// function onError(data) {
//     document.getElementById("storeAddress-coach").value = '定位失败'
//
// }
//
// function select(e) {
//     if (e.poi && e.poi.location) {
//         map.setZoom(15);
//         map.setCenter(e.poi.location);
//     }
// }

//标签处理
function addTag(obj) {

    var tag = obj.val();
    if (tag != '') {
        var i = 0;
        $(".tag").each(function() {
            if ($(this).text() == tag + "×") {
                $(this).addClass("tag-warning");
                setTimeout("removeWarning()", 400);
                i++;
            }
        });
        obj.val('');
        if (i > 0) { //说明有重复
            return false;
        }
        $("#form-field-tags").before("<span class='tag'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
        tagsCount++;
        $(".close").off('click');
        $(".close").on("click", function() {
            $(this).parent(".tag").remove();
            tagsCount--;
            $(".tags_enter").blur();
        });
    }
}

function removeWarning() {
    $(".tag-warning").removeClass("tag-warning");
}

// //阻止事件冒泡——弹出框
// function stopPropagation(e) {
//     var ev = e || window.event;
//     if (ev.stopPropagation) {
//         ev.stopPropagation();
//     } else if (window.event) {
//         window.event.cancelBubble = true; //兼容IE
//     }
// }

//显示图片文件
function showImgFile(url, type) {
    var show_html;
    if (type == 0){
        show_html = "<a class='upImageBox_avatar clearImgFile'><img src='" + url + "'/><i class='del_icon'></i></a>";
        $('.upImageBox').prepend(show_html);
        $('.img_loading').css({ 'display': 'none' });

        //删除文件
        $('.upImageBox').find('.del_icon').each(function(index, element) {
            $(this).on('click', function(event) {
                avatar = "";
                $(element).parent('a').remove();
            });

        });
    } else {
        show_html = "<a class='upImageBox_store clearImgFile_next'><img src='" + url + "'/><i class='del_icon'></i></a>";
        $('.upImageBox-store').prepend(show_html);
        $('.img_loading_next').css({ 'display': 'none' });

        //删除文件
        $('.upImageBox-store').find('.del_icon').each(function(index, element) {
            $(this).on('click', function(event) {
                storeImg = "";
                $(element).parent('a').remove();
            });

        });
    }

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
function uploadPic(obj, type) {
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = "";
    if (type == 0){
        $('.img_loading').css({ 'display': 'inline-block' });
        storeAs = "image/" + timestamp() + suffix;
        var avatar_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;
        //oss上传 回调
        client.multipartUpload(storeAs, file).then(function(result) {
            //清空已有文件
            $('.clearImgFile').each(function() {
                $(this).remove();
            });
            showImgFile(avatar_Img, 0);

            //清空input框，确保同一个文件可上传
            $('#avatar-coach').val("");
        }).catch(function(err) {
            console.log(err);
            alert("连接超时请重试");
        });
        return avatar_Img;
    } else {
        $('.img_loading_next').css({ 'display': 'inline-block' });
        storeAs = "image/" + timestamp() + suffix;
        var store_Img = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;

        //oss上传 回调
        client.multipartUpload(storeAs, file).then(function(result) {
            //清空已有文件
            $('.clearImgFile_next').each(function() {
                $(this).remove();
            });
            showImgFile(store_Img, 1);

            //清空input框，确保同一个文件可上传
            $('#store-coach').val("");
        }).catch(function(err) {
            console.log(err);
            alert("连接超时请重试");
        });
        return store_Img;
    }
}

$(function () {
    var uploadAvatar = $(".uploadImage_btn");
    uploadAvatar.on("click", function () {
        return $("#avatar-coach")[0].click();
    });
    $("#avatar-coach").change(function(){
        if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            avatar = uploadPic($(this), 0);
        }
    });
    var uploadStore = $(".uploadImage_btn-store");
    uploadStore.on("click", function () {
        return $("#store-coach")[0].click();
    });
    $("#store-coach").change(function(){
        if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
            alert("上传图片超出大小，请选择小一点的图片！");
            return false;
        } else if ($(this)[0].files.length > 1) {
            alert("请上传单张图片！");
            return false;
        } else {
            storeImg = uploadPic($(this), 1);
        }
    });

    //标签
    $(".tags_enter").blur(function() { //焦点失去触发
        if(tagsCount > 2){
            $(this).attr("disabled",true);
            $(this).val("");
            return;
        }else{
            $(this).attr("disabled",false);
        }
        var txtvalue=$(this).val().trim();
        if(txtvalue!=''){
            addTag($(this));
            $(this).parents(".tags").css({"border-color": "#d5d5d5"})
        }
    }).keydown(function(event) {
        if(tagsCount > 2){
            $(this).attr("disabled",true);
            $(this).val("");
            return;
        }else{
            $(this).attr("disabled",false);
        }
        var key_code = event.keyCode;
        var txtvalue=$(this).val().trim();
        if (key_code == 13&& txtvalue != '') { //enter
            addTag($(this));
        }
        if (key_code == 32 && txtvalue!='') { //space
            addTag($(this));
        }
    });
    $(".tags").click(function() {
        $(this).css({"border-color": "#77A1E6"});
    }).blur(function() {
        $(this).css({"border-color": "#d5d5d5"});
    });

    //设置返回值
    $("#name-coach").val(sessionStorage['nickname']);
    $("#phone-coach").val(sessionStorage['mobilePhone']);
    // $("#label-coach").val(sessionStorage['mark']);
    tagsContent = "";
    tagsContent = sessionStorage['mark'];
    if(tagsContent.length > 0) {
        var temTags = tagsContent.split(",");
        if (temTags.length > 0) {
            for (var i = 0; i < temTags.length; i++) {
                $(".tags_enter").val(temTags[i]);
                $(".tags_enter").blur();
            }
        }
    }
    $("#coachSummaryContent").val(sessionStorage['comments']);
    $("#storeName-coach").val(sessionStorage['storeName']);
    $("#storeAddress-coach").val(sessionStorage['storeAddress']);
    $("#storePhone-coach").val(sessionStorage['storeContact']);
    $("#storeSummary").val(sessionStorage['storeComment']);
    avatar = sessionStorage["headPhoto"];
    if (avatar != ""){
        showImgFile(avatar, 0);
    }
    storeImg = sessionStorage["imageUrl"];
    if (storeImg != ""){
        showImgFile(storeImg, 1);
    }

    // //高德地图异步创建
    // var url = 'https://webapi.amap.com/maps?v=1.4.14&key=24368d9997d6c47e387631c08dbcd4c4&plugin=AMap.Autocomplete&callback=onApiLoaded';
    // var jsapi = document.createElement('script');
    // jsapi.charset = 'utf-8';
    // jsapi.src = url;
    // document.head.appendChild(jsapi);
    //
    // $("#map_btn").on("click", function () {
    //     $(".maskLayer").css({"display":"block"});
    //     $(".closeMapBtn").css({ "display": "inline-block" });
    //
    //     $(".maskLayer").on('click', function() {
    //         $(this).css({ "display": "none" });
    //     });
    //
    //     $(".closeMapBtn").on("click", function () {
    //         $(this).css({ "display": "none" });
    //     });
    //
    //     $("#GDmap").on('click', function(e) {
    //         stopPropagation(e);
    //     });
    // });

    //保存
    $('.submitBtn').on('click', function() {
        var headPhoto = avatar;
        var comments = $('#coachSummaryContent').val();
        var storeName = $('#storeName-coach').val();
        var imageUrl = storeImg;
        var storeAddress = $('#storeAddress-coach').val();
        var storeContact = $('#storePhone-coach').val();
        var storeComment = $('#storeSummary').val();
        var mobilePhone = $('#phone-coach').val();

        tagsContent = "";
        if ($('#tags').find("span").length > 0) {
            $('#tags').find("span").each(function(){
                var temStr = $(this).text();
                tagsContent += temStr.substring(0,temStr.length-1) + ',';
            });
        }
        var mark = tagsContent.substring(0,tagsContent.length-1);

        $.ajax({
            type: "POST",
            url: URL + '/user/trainnerModify',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "headPhoto": headPhoto,
                "imageUrl": imageUrl,
                "storeName": storeName,
                "storeAddress": storeAddress,
                "storeContact": storeContact,
                "storeComment": storeComment,
                "mobilePhone": mobilePhone,
                "partyId": sessionStorage['partyId'],
                "comments": comments,
                "mark": mark
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
                $(".submitBtn").css({"background":"#DCDCDC"});
            },
            success: function(data) {
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("教练修改成功！");
                    toastr.success("修改成功！");
                    var timer = setTimeout(function() {
                        $('.coachInfo').click();
                        // destroyMap();
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
            // complete: function () {
            //     $(".submitBtn").removeAttr("disabled");
            // },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
                $(".submitBtn").css({"background":"#67C23A"});
                toastr.warning("修改失败！请联系开发人员处理!");
            }
        });
    });

    //取消
    $(".cancel").on('click', function() {
        $('.coachInfo').click();
        // destroyMap();
    });
});