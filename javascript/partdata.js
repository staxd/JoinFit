var planArea = {};
var actionArea = {};
var actionLevel = {};
var planLevel = {};
var exerciseApparatus = {};
var bannerType = {};
var type = new Array();
type['0'] = 'food_tag';
type['1'] = 'equipment_type';
var foodTag = {};
//获取缓存登录
var itemsData = JSON.parse(localStorage.getItem('itemsData'))
var data_cookie = localStorage.getItem('itemsData')
var obj = {};
obj = itemsData
var defaultImg = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/banner/image/20181125174504.jpg";
var TYPE_EQUIPMENT = 1;
var TYPE_ACTIONPART = 2;
var TYPE_ACTIONLEVEL = 3;
var TYPE_PLANPART = 4;
var TYPE_PLANLEVEL = 5;
var TYPE_BANNER = 6;
var TYPE_DIET = 7;

function specialCharCheck(str) {
    const regStr = /\\/g;
    const result = str != null
        && str !== undefined
        && !regStr.test(str);
    if(!result){
        alert("内容包含特殊字符,请重新输入!");
    }
    return result;
}
function handleTokenInvalid() {
    if (data_cookie == null) {
        toastr.warning("登录信息过期，请重新登录！");
        var timer = setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);
    }
}

function getPartData(callback) {
    if (data_cookie == null) {
        handleTokenInvalid();
    }

    $.ajax({
        type: "GET",
        url: url + '/backEnd/exercise/equipment/queryList?pageNumber=1&&pageSize=999',
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
            // console.log(data)
            if (data.code == "200") {
                for (var i = 0; i < data.data.length; i++) {
                    exerciseApparatus["'" + data.data[i].id + "'"] = data.data[i].name;
                }

                callback(TYPE_EQUIPMENT, exerciseApparatus);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }
        },
        error: function (error) {
            console.log("error");
        }
    });

    //获取饮食一级分类
    // $.ajax({
    //     type: "GET",
    //     url: url + '/food/queryTagList?type=' + type[0] + '&parentId=0',
    //     dataType: "json",
    //     contentType: "application/json;charset=UTF-8",
    //     data: {},
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type': 'application/json',
    //         'accessToken': obj.accessToken,
    //         'userLoginId': obj.userLoginId
    //     },
    //     withCredentials: true,
    //     success: function (data) {
    //         if (data.code == "200") {
    //             for (var i = 0; i < data.tagList.length; i++) {
    //                 foodTag["'" + data.tagList[i].id + "'"] = data.tagList[i].label;
    //             }
    //
    //             callback(TYPE_DIET, foodTag);
    //         } else if (data.code == "401") {
    //             $.cookie("user", "null");
    //             data_cookie = null;
    //             handleTokenInvalid();
    //         } else {
    //             console.log(data);
    //         }
    //     },
    //     error: function (error) {
    //         console.log("error");
    //     }
    // });

    $.ajax({
        type: "GET",
        url: URL + '/food/queryTagList',
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
            if (data.code == "200") {
                for (var i = 0; i < data.tagList.length; i++) {
                    foodTag["'" + data.tagList[i].id + "'"] = data.tagList[i].label;
                }

                callback(TYPE_DIET, foodTag);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }
        },
        error: function (error) {
            console.log("error");
        }
    });


    $.ajax({
        type: "GET",
        url: url + '/programs/parts?language=1',
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
            if (data.code == "200") {
                for (var i = 0; i < data.programParts.length; i++) {
                    planArea["'" + data.programParts[i].id + "'"] = data.programParts[i].name;
                }
                callback(TYPE_PLANPART, planArea);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }
        },
        error: function (error) {
            console.log("error");
        }
    });

    $.ajax({
        type: "GET",
        url: url + '/exercises/parts?language=1',
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
            if (data.code == "200") {
                for (var i = 0; i < data.exerciseParts.length; i++) {
                    actionArea["'" + data.exerciseParts[i].id + "'"] = data.exerciseParts[i].name;
                }
                callback(TYPE_ACTIONPART, actionArea);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }

        },
        error: function (error) {
            console.log("error");
        }
    });

    $.ajax({
        type: "GET",
        url: url + '/exercises/level?language=1',
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
            if (data.code == "200") {
                for (var i = 0; i < data.exerciseLevels.length; i++) {
                    actionLevel["'" + data.exerciseLevels[i].id + "'"] = data.exerciseLevels[i].name;
                }
                callback(TYPE_ACTIONLEVEL, actionLevel);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }

        },
        error: function (error) {
            console.log("error");
        }
    });

    $.ajax({
        type: "GET",
        url: url + '/programs/queryStrength?language=1',
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
            if (data.code == "200") {
                for (var i = 0; i < data.programStrengthes.length; i++) {
                    planLevel["'" + data.programStrengthes[i].id + "'"] = data.programStrengthes[i].name;
                }
                callback(TYPE_PLANLEVEL, planLevel);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }

        },
        error: function (error) {
            console.log("error");
        }
    });

    $.ajax({
        type: "GET",
        url: URL + '/publicDocument/querySelectType',
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
            if (data.code == "200") {
                for (var i = 0; i < data.data.length; i++) {
                    bannerType["'" + data.data[i].id + "'"] = data.data[i].name;
                }
                callback(TYPE_BANNER, bannerType);
            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
                handleTokenInvalid();
            } else {
                console.log(data);
            }

        },
        error: function (error) {
            console.log("error");
        }
    });

    return true;
}

$(function () {
    if (data_cookie == null) {
        handleTokenInvalid();
    }
});