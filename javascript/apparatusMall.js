var pageData;//页面数据

//显示器械列表
function getDataRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='actionLibItem'></label>" + "</td>");
    row.append("<td class='no-apparatus'>" + h.equipmentId + "</td>");//获取器械id
    row.append("<td class='img-apparatus upFile'><img src='" + h.imageUrl + "' alt='article.png' /></td>");//获取器械图片
    row.append("<td class='type-apparatus'>" + h.type + "</td>"); //获取器械类型
    row.append("<td class='name-apparatus'>" + h.name + "</td>");//获取器械名称
    row.append("<td class='price-apparatus'>" + h.price + "</td>");//获取器械商品价格(元)
    row.append("<td class='num-apparatus'>" + "" + "</td>");//商品数量
    row.append("<td class='surplus-apparatus'>" + "" + "</td>");//剩余数量
    row.append("<td class='time-apparatus'>" + h.createdTime + "</td>");//创建时间
    row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='modify_btn'>修改</div>" + "<div class='delete_btn'>删除</div>" + "</td>");
    return row;
}

//获取页数， 每页记录数，和名称
function InterfaceFunctions(pageNumber, pageSize, type,name) {
    var tbody = $('.contentList').children('tbody');//获取显示内容
    var suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize;//页数、每页记录数
    if (name == null || name == undefined || name == "") {
        name = "";//判断名称
    }
    if (type == null || type == undefined || type == "") {
        type = "";
    }
    if (name != "" && type == "") {
        suffix ='name=' + name;
    }else if(name != "" && type != ""){
         suffix ='type=' + type;
    }else if(name == "" && type != ""){
         suffix ='type=' + type;
    }else {
        suffix ="";
    }

    console.log(suffix);
    $.ajax({
        type: "GET",
        url: URL + '/equipments/queryList?' + suffix + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        withCredentials: true,//是否打开跨域安全策略
        success: function(data) {
            
                                            removeLoading('test');
            
            console.log(data);

            if (data.code == "200" || data.code == "OK") {
                console.log("获取器械列表成功！");

                if (data.data.length == 0) {
                    console.log("aaa");
                    $("#contentList").css("display","none");
                    toastr.warning('无记录！');
                    
                }else{
                     $("#contentList").css("display","");
                     //分页
                $('.bottom-pageNum-box').pagination({
                    dataSource: URL + '/equipments/queryList?' + suffix,
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
                        //console.log(pageData);

                        //确保翻页时没有旧数据
                        $('.clearRow').each(function() {
                            $(this).remove();
                        });

                        //加载列表
                        for (var i = 0; i < data.length; i++) {
                            var trow = getDataRow(data[i]);
                            tbody.append(trow);
                        }

                        //列表——器械文字
                        getPartData(function(type, interface_data) {
                            switch (type) {
                                case TYPE_EQUIPMENT:
                                    $.each(interface_data, function(k, v) {
                                        $('.type-apparatus').each(function(index, element) {
                                            //debugger;
                                            k = k.replace(/'/g,"");
                                            if (k == $('.type-apparatus').eq(index).html()) {
                                                $('.type-apparatus').eq(index).html(v);
                                            }
                                        });

                                    });
                                    break;
                            }
                        });

                        // 删除
                        $('.delete_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/equipments/delete',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "ids": data[index].equipmentId
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
                                            console.log("删除成功！");
                                            toastr.success('删除成功！');
                                            $(".delete_btn").eq(index).text("已删除");
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error('删除失败！');
                                    }
                                });
                            });
                        });

                        //修改文章
                        $('.modify_btn').each(function(index, element) {
                            $(this).on('click', function(event) {

                                $.each(data[index], function(k, v) {
                                    console.log(k+v);
                                     sessionStorage.setItem(k, v);    
                                });
                                
                                $(".mainContent").load('modifyApparatusMall.html');
                            });
                        });

                    },
                    locator: 'data'//分页
                });

                }

                

                
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
    $('body').loading({
        loadingWidth:240,
        title:'请耐心等待',
        name:'test',
        discription:'正在疯狂加载中... ',
        direction:'column',
        type:'origin',
        // originBg:'#71EA71',
        originDivWidth:40,
        originDivHeight:40,
        originWidth:6,
        originHeight:6,
        smallLoading:false,
        loadingMaskBg:'rgba(0,0,0,0.2)'
    });
    $("#addapparatus").on('click',function(){
        $(".mainContent").load('addApparatus.html');
    });

    var pageNumber = 1;
    var pageSize = 10;
// 搜索框——器械数据
    getPartData(function(type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_articleType').append(option_html);
                });
                break;
        }
    });

    InterfaceFunctions(pageNumber, pageSize, "", "");

    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "");
    });

    //搜索
    $('#searchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_articleType option:selected').val();
        searchCondition[1] = $('#search_articleName').val();
        //console.log(searchCondition[0]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
    });
});































































function load(url){
     // alert($(url).attr("href"));
     $.ajaxSetup({cache: false });
     $("#content").load($(url).attr("href")+ " #content ", function(result){
         //alert(result);
         //将被加载页的JavaScript加载到本页执行
         $result = $(result); 
         $result.find("script").appendTo('#content');
     });  
}
