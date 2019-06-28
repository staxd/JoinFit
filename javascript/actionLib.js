var apparatus_name;
var state = new Array();
// state['0'] = '未审核';
state['1'] = '启用';
// state['2'] = '审核未通过';
state['2'] = '禁用';
// state['4'] = '已删除';

var pageData;

//确保load页面的js正确加载
function load(url) {
    //alert($(url).attr("href"));
    $.ajaxSetup({ cache: false });
    $("#content").load($(url).attr("href") + " #content ", function (result) {
        //alert(result);
        //将被加载页的JavaScript加载到本页执行
        $result = $(result);
        $result.find("script").appendTo('#content');
    });
}

//显示动作列表
function getDataRow(h) {
    var row = $('<tr class="clearRow" data-id="' + h.id + '"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='actionLibItem'></label>" + "</td>");
    row.append("<td class='name-actionLib'>" + h.name + "</td>");
    row.append("<td class='video-actionLib upFile'><img src='" + h.exerciseImage + "' alt='action.png' /></td>");
    row.append("<td class='lengthTime-actionLib'>" + h.lastTimeOnce + "</td>");
    row.append("<td class='content-actionLib'>" + h.comment + "</td>");
    row.append("<td class='apparatus-actionLib'>" + h.equipmentType + "</td>");
    if(h.status=='2'){
        row.append("<td class='state-actionLib' style='color:#E51C23;'>" + state[parseInt(h.status)] + "</td>");
    }else{
        row.append("<td class='state-actionLib'>" + state[parseInt(h.status)] + "</td>");
    }
    row.append("<td class='establish-actionLib'>" + h.createdTime + "</td>");
    row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_action'>删除</div>" + "<div class='disable_btn'>禁用</div></div>" + "</td>");
    return row;
}
//删除
$('.contentList').on('click', '.delete_action', function () {
    var that = $(this)
    console.log(that.parents('tr').attr('data-id'))
    // that.parents('tr').remove()
    $.ajax({
        type: "POST",
        url: URL + '/exercise/delete',
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            "ids": that.parents('tr').attr('data-id')
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
                console.log("删除动作成功！");
                toastr.success("删除成功！");
                $('#searchBtn').trigger('click')
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
})
function InterfaceFunctions(pageNumber, pageSize, title, equipmentType) {
    var tbody = $('.contentList').children('tbody');
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
        success: function (data) {
            console.log(data);

            if (data.code == "200" || data.code == "OK") {
                console.log("获取动作列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {
                //     return false;
                // }

                if (data.total < 1) {
                    $('.clearRow').each(function () {
                        $(this).remove();
                    });
                    toastr.warning("暂无数据！");
                    $('.bottom-pageNum-box').pagination({});
                    return false;
                }

                if (title != "" || equipmentType != "") {
                    suffix = '/exercise/queryList?title=' + title + '&equipmentType=' + equipmentType;
                } else {
                    suffix = '/exercise/queryList?';
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

                        //加载动作列表
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

                        //列表——器械文字
                        getPartData(function (type, interface_data) {
                            switch (type) {
                                case TYPE_EQUIPMENT:
                                    $.each(interface_data, function (k, v) {
                                        $('.apparatus-actionLib').each(function (index, element) {
                                            k = k.replace(/'/g, "");
                                            if (k == $('.apparatus-actionLib').eq(index).html()) {
                                                $('.apparatus-actionLib').eq(index).html(v);
                                            }
                                        });

                                    });
                                    break;
                            }
                        });
                        //禁用动作
                        $('.disable_btn').each(function (index, element) {
                            $(this).on('click', function () {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/exercise/disable',
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
                                    success: function (data) {
                                        if (data.code == "200") {
                                            console.log("修改动作成功！");
                                            toastr.success("修改成功！");
                                            $(element).parents('tr').find('.state-actionLib').html("禁用");
                                            $(element).parents('tr').find('.state-actionLib').css({ "color": "#E51C23" });
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("修改失败！");
                                        }
                                    },
                                    error: function (error) {
                                        console.log("error");
                                        toastr.warning("修改失败！");
                                    }
                                });

                            })
                        });


                        //修改动作
                        $('.modify_btn').each(function (index, element) {
                            $(this).on('click', function (event) {
                                sessionStorage.setItem('actionDetail', JSON.stringify(data[index]))
                                $(".mainContent").load('modifyAction.html');
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
    $("#addAction").on('click', function () {
        $(".mainContent").load('addAction.html');
    });
    var pageNumber = 1;
    var pageSize = 10;

    // 搜索框——器械数据
    getPartData(function (type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function (k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_apparatus').append(option_html);
                });
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
        searchCondition[0] = $('#search_actionName').val();
        searchCondition[1] = $('#search_apparatus option:selected').val();
        //console.log(searchCondition[0]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
    });

});