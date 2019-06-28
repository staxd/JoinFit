var pageData;
var state = new Array();
state['0'] = '已删除';
state['1'] = '正常';

function load(url) {
    //alert($(url).attr("href"));
    $.ajaxSetup({cache: false});
    $("#content").load($(url).attr("href") + " #content ", function (result) {
        //alert(result);
        //将被加载页的JavaScript加载到本页执行
        $result = $(result);
        $result.find("script").appendTo('#content');
    });
}

function getDataLinkage(parentId) {
    $.ajax({
        type: "GET",
        url: url + '/food/queryTagList?type=food_tag&parentId=' + parseInt(parentId),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
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
                        $('#search_secondCategory').append(option_html);
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

//显示饮食列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='dietItem'></label>" + "</td>");
    row.append("<td class='no-diet'>" + h.recipeId + "</td>");
    row.append("<td class='img-diet upFile'><img src='" + h.imageUrl + "' alt='img.png' /></td>");
    row.append("<td class='type-diet'>" + h.tags + "</td>");
    row.append("<td class='title-diet'>" + h.name + "</td>");
    row.append("<td class='content-diet'>" + h.comment + "</td>");
    row.append("<td class='state-diet'>" + state[parseInt(h.status)] + "</td>");
    row.append("<td class='takeEffect-diet'>" + h.createdTime + "</td>");
    // row.append("<td class='invalid-diet'>" + h.createdTime + "</td>");
    row.append("<td class='operation-diet'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_btn'>删除</div></div>" + "</td>");
    return row;
}

function InterfaceFunctions(pageNumber, pageSize, name, tags) {
    var tbody = $('.contentList').children('tbody');
    var suffix = pageNumber + '&pageSize=' + pageSize;
    if (name == null || name == undefined || name == "") {
        name = "";
    }
    if (tags == null || tags == undefined || tags == "") {
        tags = "";
    }
    if (name != "" || tags != "") {
        suffix = 'name=' + name + '&tags=' + tags + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    }
    $.ajax({
        type: "GET",
        url: URL + '/food/queryList?' + suffix,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        success: function (data) {
            console.log(data);

            if (data.code == "200" || data.code == "OK") {
                console.log("获取饮食列表成功！");

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

                if (name != "" || tags != "") {
                    suffix = '/food/queryList?name=' + name + '&tags=' + tags;
                } else {
                    suffix = '/food/queryList?';
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
                    callback: function (data, pagination) { //分页回调
                        //console.log(data, pagination); //pagination对象 有当前选择页数
                        pageData = data;

                        //确保翻页时没有旧数据
                        $('.clearRow').each(function () {
                            $(this).remove();
                        });

                        if (data.length < 1) {
                            return false;
                        }

                        //加载饮食列表
                        for (var i = 0; i < data.length; i++) {
                            var trow = getDataRow(data[i]);
                            tbody.append(trow);
                        }

                        tbody.find("td").each(function () {

                            if ($(this).html() == "undefined") {
                                $(this).html("");
                            }

                            if ($(this).find("img").attr("src") == undefined || $(this).find("img").attr("src") == "" || $(this).find("img").attr("src") == "undefined") {
                                $(this).find("img").attr("src", defaultImg);
                            }

                        });

                        // 删除饮食文章
                        $('.delete_btn').each(function (index, element) {
                            $(this).on('click', function (event) {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/food/recipeDelete',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].recipeId
                                    }),
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Content-Type': 'application/json',
                                        'accessToken': obj.accessToken,
                                        'userLoginId': obj.userLoginId
                                    },
                                    withCredentials: true,
                                    success: function (data) {
                                        if (data.code == "200") {
                                            console.log("删除饮食文章成功！");
                                            toastr.success("删除成功！");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("删除失败！");
                                        }
                                    },
                                    error: function (error) {
                                        console.log("error");
                                        toastr.warning("删除失败！");
                                    }
                                });
                                $('.delete_btn').eq(index).parents('tr').find('.state-diet').html("已删除");
                            });
                        });

                        //修改
                        $('.modify_btn').each(function (index, element) {
                            $(this).on('click', function (event) {

                                $.each(data[index], function (k, v) {
                                    if (k == "materialList") {
                                        sessionStorage.setItem(k,JSON.stringify(v))
                                    }else if (k == "stepList") {
                                        sessionStorage.setItem(k,JSON.stringify(v))
                                    } else {
                                        sessionStorage.setItem(k, v);
                                    }
                                });

                                $(".mainContent").load('modifyDiet.html');
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
        error: function (error) {
            console.log("error");
        }
    });
}

$(function () {
    $("#addArticle-diet").on('click', function () {
        $(".mainContent").load('addArticle-diet.html');
    });

    var pageNumber = 1;
    var pageSize = 10;

    // 搜索框——一级数据
    getPartData(function (type, data) {
        switch (type) {
            case TYPE_DIET:
                $.each(data, function (k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_topCategory').append(option_html);
                });
                // 后台要求去除一二级联动直接返回结果
                // $("#search_topCategory").change(function () {
                //     if ($("#search_topCategory option:selected").val() != "") {
                //         $(".linkage").css({"display": "block"});
                //         getDataLinkage($("#search_topCategory option:selected").val());
                //     } else {
                //         $(".linkage").css({"display": "none"});
                //     }
                // });
                break;
        }
    });

    InterfaceFunctions(pageNumber, pageSize, "", "");

    //页面显示数量
    $('#showNum').change(function () {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "");
    });

    //搜索
    $('#searchBtn').on('click', function () {
        var searchCondition = [];
        searchCondition[0] = $('#search_dietName').val();
        searchCondition[1] = $('#search_topCategory option:selected').text();
        //console.log(searchCondition[0]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
    });

});