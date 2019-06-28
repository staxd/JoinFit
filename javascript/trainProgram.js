var apparatus_name;
var state = new Array();
state['0'] = '未审核';
state['1'] = '启用';
state['2'] = '审核未通过';
state['3'] = '禁用';
state['4'] = '已删除';

var pageData;

//确保load页面的js正确加载
function load(url) {
    //alert($(url).attr("href"));
    $.ajaxSetup({ cache: false });
    $("#content").load($(url).attr("href") + " #content ", function(result) {
        //alert(result);
        //将被加载页的JavaScript加载到本页执行
        $result = $(result);
        $result.find("script").appendTo('#content');
    });
}

//显示训练列表
function getDataRow(h) {
    var row = $("<tr class='clearRow'></tr>");
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='trainProgramItem'></label>" + "</td>");
    row.append("<td class='name-trainProgram'>" + h.name + "</td>");
    row.append("<td class='video-trainProgram upFile'><img src='" + h.imageUrl + "' alt='action.png' /></td>");
    row.append("<td class='num-trainProgram'>" + h.consumeEnergy + "</td>");
    row.append("<td class='lengthTime-trainProgram'>" + h.lastTime + "</td>");
    row.append("<td class='content-trainProgram'>" + h.comment + "</td>");
    row.append("<td class='difficulty-trainProgram'>" + h.level + "</td>");
    row.append("<td class='position-trainProgram'>" + h.whichParts + "</td>");
    row.append("<td class='apparatus-trainProgram'>" + h.equipmentTypes + "</td>");
    row.append("<td class='state-trainProgram'>" + state[parseInt(h.status)] + "</td>");
    row.append("<td class='invalid-trainProgram'>" + h.createdTime + "</td>");
    row.append("<td class='operation-trainProgram'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_btn'>删除</div>" + "<div class='disable_btn'>禁用</div></div>" + "</td>");
    return row;
}


function InterfaceFunctions(pageNumber, pageSize, name, level, part, equipmentType) {
    var tbody = $('.contentList').children('tbody');
    var suffix = pageNumber + '&pageSize=' + pageSize;
    if (name == null || name == undefined || name == "") {
        name = "";
    }
    if (level == null || level == undefined || level == "") {
        level = "";
    }
    if (part == null || part == undefined || part == "") {
        part = "";
    }
    if (equipmentType == null || equipmentType == undefined || equipmentType == "") {
        equipmentType = "";
    }
    if (name != "" || level != "" || part != "" || equipmentType != "") {
        suffix = 'name=' + name + '&level=' + level + '&part=' + part + '&equipmentType=' + equipmentType + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    }
    $.ajax({
        type: "GET",
        url: URL + '/program/queryList?' + suffix,
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
                console.log("获取训练列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {
                //     // $('.clearRow').each(function() {
                //     //     $(this).remove();
                //     // });
                //     return false;
                // }

                if (data.total < 1){
                    $('.clearRow').each(function() {
                        $(this).remove();
                    });
                    toastr.warning("暂无数据！");
                    $('.bottom-pageNum-box').pagination({});
                    return false;
                }

                if (name != "" || level != "" || part != "" || equipmentType != "") {
                    suffix = '/program/queryList?&name=' + name + '&level=' + level + '&part=' + part + '&equipmentType=' + equipmentType;
                } else {
                    suffix = '/program/queryList?';
                }

                //分页
                $('.bottom-pageNum-box').pagination({
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
                        pageData = data;

                        //确保翻页时没有旧数据
                        $('.clearRow').each(function() {
                            $(this).remove();
                        });

                        if (data.length < 1) {
                            return false;
                        }

                        //加载训练列表
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

                        // //列表——器械文字(后台给传回了文字故注释)
                        // getPartData(function(type, interface_data) {
                        //     switch (type) {
                        //         case TYPE_EQUIPMENT:
                        //             $.each(interface_data, function(k, v) {
                        //                 $('.apparatus-trainProgram').each(function(index, element) {
                        //                     //debugger;
                        //                     k = k.replace(/'/g, "");
                        //                     if ($('.apparatus-trainProgram').eq(index).html().indexOf(',') != -1) {
                        //                         var apparatus_list = $('.apparatus-trainProgram').eq(index).html().split(",");
                        //                         var apparatus_listStr = "";
                        //                         for (var i = 0; i < apparatus_list.length; i++) {
                        //                             if (k == apparatus_list[i]) {
                        //                                 apparatus_list[i] = v;
                        //                                 apparatus_listStr += apparatus_list[i] + ','
                        //                             }
                        //                         }
                        //                         $('.apparatus-trainProgram').eq(index).html(apparatus_listStr.slice(0, apparatus_listStr.length - 1));
                        //                     }
                        //                     if (k == $('.apparatus-trainProgram').eq(index).html()) {
                        //                         $('.apparatus-trainProgram').eq(index).html(v);
                        //                     }
                        //                 });
                        //
                        //             });
                        //             break;
                        //     }
                        // });

                        //列表——部位文字
                        getPartData(function(type, interface_data) {
                            switch (type) {
                                case TYPE_PLANPART:
                                    $.each(interface_data, function(k, v) {
                                        $('.position-trainProgram').each(function(index, element) {
                                            //debugger;
                                            k = k.replace(/'/g, "");
                                            if (k == $('.position-trainProgram').eq(index).html()) {
                                                $('.position-trainProgram').eq(index).html(v);
                                            }
                                        });

                                    });
                                    break;
                            }
                        });

                        //列表——难易程度文字
                        getPartData(function(type, interface_data) {
                            switch (type) {
                                case TYPE_PLANLEVEL:
                                    $.each(interface_data, function(k, v) {
                                        $('.difficulty-trainProgram').each(function(index, element) {
                                            //debugger;
                                            k = k.replace(/'/g, "");
                                            if (k == $('.difficulty-trainProgram').eq(index).html()) {
                                                $('.difficulty-trainProgram').eq(index).html(v);
                                            }
                                        });

                                    });
                                    break;
                            }
                        });

                        // 删除训练
                        $('.delete_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/program/delete',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].id
                                    }),
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Content-Type': 'application/json',
                                        'accessToken': obj.accessToken,
                                        'userLoginId': obj.userLoginId
                                    },
                                    withCredentials: true,
                                    success: function(data) {
                                        if (data.code == "200") {
                                            console.log("删除训练成功！");
                                            toastr.success("删除成功！");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("删除失败!");
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.warning("删除失败!");
                                    }
                                });
                                $('.delete_btn').eq(index).parents('tr').find('.state-trainProgram').html("已删除");
                            });
                        });


                        //禁用训练
                        $('.disable_btn').each(function(index, element) {
                            $(this).on('click', function() {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/program/disable',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].id,
                                    }),
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Content-Type': 'application/json',
                                        'accessToken': obj.accessToken,
                                        'userLoginId': obj.userLoginId
                                    },
                                    withCredentials: true,
                                    success: function(data) {
                                        if (data.code == "200") {
                                            console.log("修改训练成功！");
                                            toastr.success("修改成功!");
                                            $(element).parents('tr').find('.state-trainProgram').html("禁用");
                                            $(element).parents('tr').find('.state-trainProgram').css({"color":"#E51C23"});
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("修改失败!");
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.warning("修改失败!");
                                    }
                                });
                                // $('.delete_btn').eq(index).parents('tr').find('.state-trainProgram').html("禁用");
                            })
                        });


                        //修改训练
                        $('.modify_btn').each(function(index, element) {
                            $(this).on('click', function(event) {

                                $.each(data[index], function(k, v) {
                                    if (k == "exerciseJson") {
                                        var exerciseList_id = "";
                                        var exerciseList_url = "";
                                        if (v.length > 0) {
                                            for (var i = 0; i < v.length; i++) {
                                                exerciseList_id += v[i].id + ",";
                                                exerciseList_url += v[i].imageUrl + ",";
                                            }
                                        }
                                        sessionStorage.setItem("exerciseList_id", exerciseList_id);
                                        sessionStorage.setItem("exerciseList_url", exerciseList_url);
                                    } else {
                                        sessionStorage.setItem(k, v);
                                    }

                                });
                                $(".mainContent").load('modifyTrain.html');
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
}

$(function() {
    $("#addTrain").on('click', function() {
        $(".mainContent").load('addTrain.html');
    });

    var pageNumber = 1;
    var pageSize = 10;

    // 搜索框——器械 部位 难易程度数据
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_apparatus').append(option_html);
                });
                break;
            case TYPE_PLANPART:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_position').append(option_html);
                });
                break;
            case TYPE_PLANLEVEL:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_difficulty').append(option_html);
                });
                break;
        }
    });

    InterfaceFunctions(pageNumber, pageSize, "", "", "", "");

    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "", "", "");
    });

    //搜索
    $("#searchBtn").on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_trainName').val();
        searchCondition[1] = $('#search_difficulty option:selected').val();
        searchCondition[2] = $('#search_position option:selected').val();
        searchCondition[3] = $('#search_apparatus option:selected').val();
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1], searchCondition[2], searchCondition[3], searchCondition[4]);
    });
});