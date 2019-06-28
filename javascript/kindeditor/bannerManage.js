var pageData;
var state = new Array();
state['0'] = '暂存';
state['1'] = '发布';

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

//显示banner列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='bannerItem'></label>" + "</td>");
    row.append("<td class='no-banner'>" + h.dataId + "</td>");
    row.append("<td class='img-banner upFile'><img src='" + h.imageUrl + "' alt='article.png' /></td>");
    row.append("<td class='title-banner'>" + h.title + "</td>");
    row.append("<td class='position-banner'>" + h.selectionCatalog +"</td>");
    //row.append("<td class='content-banner'>" + h.cotent + "</td>");
    row.append("<td class='state-banner'>" + state[parseInt(h.status)] + "</td>");
    row.append("<td class='takeEffect-banner'>" + h.startTime + "</td>");
    row.append("<td class='invalid-banner'>" + h.endTime + "</td>");
    row.append("<td class='operation-banner'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_btn'>删除</div>" + "<div class='disable_btn'>禁用</div></div>" + "</td>");
    row.append("<td></td>");
    return row;
}

function InterfaceFunctions(pageNumber, pageSize, title, position) {
    var tbody = $('.contentList').children('tbody');
    var suffix = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&type=7' + '&selectionType=1';
    debugger;
    if (title == null || title == undefined || title == "") {
        title = "";
    }
    if (position == null || position == undefined || position == "") {
        position = "";
    }
    if (title != "" || position != "") {
        console.log(encodeURI(encodeURI(title)));
        suffix = 'title=' + encodeURI(encodeURI(title)) + '&position=' + position + '&type=7' + '&selectionType=1' + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&type=7' + '&selectionType=1';
    }

    $.ajax({
        type: "GET",
        url: URL + '/publicDocument/queryList?' + suffix,
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
                console.log("获取banner列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {

                //     return false;
                // }

                if (title != "" || position != "") {
                    suffix = '/publicDocument/queryList?title=' + encodeURI(encodeURI(title)) + '&position=' + position + '&type=7' + '&selectionType=1';
                } else {
                    suffix = '/publicDocument/queryList?type=7' + '&selectionType=1';
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

                        //加载文章列表
                        for (var i = 0; i < data.length; i++) {
                            var trow = getDataRow(data[i]);
                            tbody.append(trow);
                        }

                        //列表——投放位置文字
                        getPartData(function(type, interface_data) {
                            switch (type) {
                                case TYPE_BANNER:
                                    $.each(interface_data, function(k, v) {
                                        $('.position-banner').each(function(index, element) {
                                            k = k.replace(/'/g,"");
                                            if (k == $('.position-banner').eq(index).html()) {
                                                $('.position-banner').eq(index).html(v);
                                            }
                                        });

                                    });
                                    break;
                            }
                        });

                        // 删除文章
                        $('.delete_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/publicDocument/delete',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].dataId
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
                                            console.log("删除文章成功！");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                    }
                                });
                                $('.delete_btn').eq(index).parents('tr').find('.state-dryGoods').html("已删除");
                            });
                        });

                        //禁用文章
                        $('.disable_btn').each(function(index, element) {
                            $(this).on('click', function() {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/publicDocument/modify',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].dataId,
                                        "status": "0"
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
                                            console.log("修改banner成功！");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                    }
                                });
                                $('.delete_btn').eq(index).parents('tr').find('.state-dryGoods').html("禁用");
                            })
                        });

                        //修改文章
                        $('.modify_btn').each(function(index, element) {
                            $(this).on('click', function(event) {

                                $.each(data[index], function(k, v) {
                                    sessionStorage.setItem(k, v);
                                });

                                $(".mainContent").load('modifyBanner.html');
                            });
                        });

                    },
                    locator: 'data'
                });

            } else if (data.code == "401") {
                $.cookie("user", "null");
                data_cookie = null;
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
    $("#addBanner").on('click', function() {
        $(".mainContent").load('addBanner.html');
    });

    // 搜索框——banner类型数据
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_BANNER:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#seach_articleType').append(option_html);
                });
            break;
        }
    });

    var pageNumber = 1;
    var pageSize = 10;

    InterfaceFunctions(pageNumber, pageSize, "", "");

    //搜索
    $('#searchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[1] = $('#search_articleType option:selected').val();
        searchCondition[0] = $('#search_articleName').val();
        debugger;
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
    });
});