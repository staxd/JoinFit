var state = {'PARTY_ENABLED':'正常','PARTY_DISABLED':'禁用'};

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

//显示用户列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='accountItem'></label>" + "</td>");
    row.append("<td class='userName-account'>" + h.nickname + "</td>");
    row.append("<td class='state-account'>" + state[h.status] + "</td>");
    row.append("<td class='establish-account'>" + h.createdDate + "</td>");
    if(h.status == "PARTY_ENABLED"){
        row.append("<td class='operation-account'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='disable_btn'>禁用</div></div>" + "</td>");
    }else if(h.status == 'PARTY_DISABLED'){
        row.append("<td class='operation-account'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='disable_btn'>解禁</div></div>" + "</td>");
    }
    row.append("<td></td>");
    return row;
}

function InterfaceFunctions(pageNumber, pageSize, nickname, status) {
    var tbody = $('.contentList').children('tbody');
    var suffix = pageNumber + '&pageSize=' + pageSize;
    if (nickname == null || nickname == undefined || nickname == "") {
        nickname = "";
    }
    if (status == null || status == undefined || status == "") {
        status = "";
    }
    if (nickname != "" || status != "") {
        suffix ='nickname=' + nickname + '&status=' + status + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    }
    $.ajax({
        type: "GET",
        url: URL + '/user/queryBackEndUserList?' + suffix,
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
                console.log("获取后台用户列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {
                //     return false;
                // }

                if (nickname != "" || status != "") {
                    suffix ='/user/queryBackEndUserList?nickname=' + nickname + '&status=' + status;
                }else{
                    suffix ='/user/queryBackEndUserList?';
                }

                if (data.total < 1){
                    $('.clearRow').each(function() {
                        $(this).remove();
                    });
                    toastr.warning("暂无数据！");
                    $('.bottom-pageNum-box').pagination({});
                    return false;
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

                        //加载用户列表
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

                        //禁用账号
                        $('.disable_btn').each(function(index, element) {
                            if($(element).eq(index).parents('tr').find('.state-account').html() == "禁用"){
                                $(element).eq(index).parents('tr').find('.state-account').css({"color":"#E51C23"});
                            }

                            $(this).on('click', function() {
                                // debugger;
                                var status = "PARTY_DISABLED";
                                for(var key in state){
                                    if(state[key] == $('.disable_btn').eq(index).html() && $('.disable_btn').eq(index).html() == "禁用"){
                                        status = "PARTY_DISABLED";
                                    }else if(state[key] == "正常" && $('.disable_btn').eq(index).html() == "解禁"){
                                        status = "PARTY_ENABLED";
                                    }
                                }

                                $.ajax({
                                    type: "POST",
                                    url: URL + '/user/trainerStatus',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "partyId": data[index].partyId,
                                        "status": status
                                    }),
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Content-Type': 'application/json',
                                        'accessToken': obj.accessToken,
                                        'userLoginId': obj.userLoginId
                                    },
                                    withCredentials: true,
                                    success: function(data) {
                                        debugger;
                                        if (data.code == "200") {
                                            console.log("修改账户成功！");
                                            toastr.success("修改成功！");
                                            if(status == "PARTY_DISABLED"){
                                                $('.disable_btn').eq(index).html("解禁");
                                                $('.disable_btn').eq(index).parents('tr').find('.state-account').html("禁用");
                                                $('.disable_btn').eq(index).parents('tr').find('.state-account').css({"color":"#E51C23"});
                                            }else if(status == "PARTY_ENABLED"){
                                                $('.disable_btn').eq(index).html("禁用");
                                                $('.disable_btn').eq(index).parents('tr').find('.state-account').html("正常");
                                                $('.disable_btn').eq(index).parents('tr').find('.state-account').css({"color":"#4A4A4A"});
                                            }
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                            handleTokenInvalid();
                                        } else {
                                            console.log(data);
                                            toastr.warning("修改失败！");
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.warning("修改失败！");
                                    }
                                });
                            })
                        });

                        //修改密码
                        $('.modify_btn').each(function(index, element) {
                            $(this).on('click', function(event) {

                                $.each(data[index], function(k, v) {
                                    sessionStorage.setItem(k, v);
                                });
                                $(".mainContent").load('modifyAccount.html');
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
    $("#addAccount").on('click', function() {
        $(".mainContent").load('addAccount.html');
    });

    var pageNumber = 1;
    var pageSize = 10;

    InterfaceFunctions(pageNumber, pageSize, "", "");

    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "");
    });

    //搜索
    $('#searchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_accountName').val();
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], "");
    });
});