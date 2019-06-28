var pageData;
var state = new Array();
state['0'] = '未处理';
state['1'] = '已处理';

//显示用户列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='opinionItem'></label>" + "</td>");
    row.append("<td class='content-opinion'>" + h.content + "</td>");
    row.append("<td class='type-opinion'>" + h.type + "</td>");
    row.append("<td class='user-opinion'>" + h.userName + "</td>");
    row.append("<td class='state-opinion'>" + state[parseInt(h.status)] + "</td>");
    row.append("<td class='establish-opinion'>" + h.createdTime + "</td>");
    row.append("<td class='operation-opinion'>" + "<div class='operationBox'>" + "<div class='handle_btn'>处理</div><div class='delete_btn'>删除</div></div>" + "</td>");
    row.append("<td></td>");
    return row;
}

function InterfaceFunctions(pageNumber, pageSize, content) {
    var tbody = $('.contentList').children('tbody');
    var suffix = pageNumber + '&pageSize=' + pageSize;
    if (content == null || content == undefined || content == "") {
        content = "";
    }
    if (content != "") {
        suffix ='content=' + content + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    }
    $.ajax({
        type: "GET",
        url: URL + '/feedback/queryList?' + suffix,
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
                console.log("获取用户反馈列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {
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

                if (content != "") {
                    suffix ='/feedback/queryList?content=' + content;
                }else{
                    suffix ='/feedback/queryList?';
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

                        //加载用户反馈列表
                        for (var i = 0; i < data.length; i++) {
                            var trow = getDataRow(data[i]);
                            tbody.append(trow);
                        }

                        tbody.find("td").each(function(){

                            if($(this).html() == "undefined"){
                                $(this).html("");
                            }
                        });

                        //处理用户反馈
                        $('.handle_btn').each(function(index, element) {
                            if ($(element).parents('tr').find('.state-opinion').eq(index).html() == "已处理") {
                                $(element).parents('tr').find('.state-opinion').eq(index).css({"color":"#67C23A"});
                            }
                            $(this).on('click', function() {

                                $.ajax({
                                    type: "POST",
                                    url: URL + '/feedback/deal',
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
                                            console.log("处理成功！");
                                            $(".handle_btn").parents('tr').find('.state-opinion').eq(index).html("已处理");
                                            $(".handle_btn").parents('tr').find('.state-opinion').eq(index).css({"color":"#67C23A"});
                                            toastr.success("处理成功!");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("处理失败！");
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.warning("处理失败！");
                                    }
                                });
                            })
                        });

                        //删除用户反馈
                        $('.delete_btn').each(function(index, element) {
                            $(this).on('click', function() {

                                $.ajax({
                                    type: "POST",
                                    url: URL + '/feedback/delete',
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
                                            console.log("删除用户反馈成功！");
                                            toastr.success("删除成功!");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("删除失败！");
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.warning("删除失败！");
                                    }
                                });
                            })
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
    var pageNumber = 1;
    var pageSize = 10;

    InterfaceFunctions(pageNumber, pageSize, "");

    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "");
    });

    //搜索
    $('#searchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_opinionContent').val();
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0]);
    });

});

