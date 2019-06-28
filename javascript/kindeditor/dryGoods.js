var pageData;
var state = new Array();
state['0'] = '暂存';
state['1'] = '发布';

function load(url){
     //alert($(url).attr("href"));
     $.ajaxSetup({cache: false });
     $("#content").load($(url).attr("href")+ " #content ", function(result){
         //alert(result);
         //将被加载页的JavaScript加载到本页执行
         $result = $(result); 
         $result.find("script").appendTo('#content');
     });  
}

//显示干货列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='dryGoodsItem'></label>" + "</td>");
    row.append("<td class='no-dryGoods'>" + h.dataId + "</td>");
    row.append("<td class='img-dryGoods upFile'><img src='" + h.imageUrl + "' alt='article.png' /></td>");
    row.append("<td class='title-dryGoods'>" + h.title + "</td>");
    //row.append("<td class='content-dryGoods'>" + h.cotent + "</td>");
    row.append("<td class='state-dryGoods'>" + state[parseInt(h.status)] + "</td>");
    row.append("<td class='takeEffect-dryGoods'>" + h.startTime + "</td>");
    row.append("<td class='invalid-dryGoods'>" + h.endTime + "</td>");
    row.append("<td class='operation-dryGoods'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_btn'>删除</div>" + "</td>");
    row.append("<td></td>");
    return row;
}

function InterfaceFunctions(pageNumber, pageSize, title, type) {
	var tbody = $('.contentList').children('tbody');
	var suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&type=7' + '&selectionType=2';
	if (title == null || title == undefined || title == "") {
        title = "";
    }
    if (title != "") {
        suffix ='title=' + title + '&type=7' + '&selectionType=2' + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize;
    } else {
        suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&type=7' + '&selectionType=2';
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
                console.log("获取干货列表成功！");

                // if (data.data == null || Object.keys(data.data).length === 0) {
                    
                //     return false;
                // }

                if (title != "") {
                    suffix ='/publicDocument/queryList?title=' + title + '&type=7' + '&selectionType=2';
                }else{
                    suffix ='/publicDocument/queryList?type=7' + '&selectionType=2';
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

                        //修改文章
                        $('.modify_btn').each(function(index, element) {
                            $(this).on('click', function(event) {

                                $.each(data[index], function(k, v) {
                                    sessionStorage.setItem(k, v);
                                });
                                
                                $(".mainContent").load('modifyDryGoods.html');
                            });
                        });

                    },
                    locator: 'data'
                });

            }else if (data.code == "401") {
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

$(function () {
	$("#addArticle-dryGoods").on('click',function(){
		$(".mainContent").load('addArticle-dryGoods.html');
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
        //searchCondition[1] = $('#search_articleType option:selected').val();
        searchCondition[0] = $('#search_articleName').val();
        //InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], "");
    });
});