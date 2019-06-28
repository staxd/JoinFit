var pageData;//页面数据
//var state = new Array();
//state['0'] = '未审核';
//state['1'] = '启用';
//state['2'] = '审核未通过';
//state['3'] = '禁用';
//state['4'] = '已删除';
var state = new Array();
state['0'] = '等待审核';
state['1'] = '审核通过';
state['2'] = '审核不通过';
state[""] = ' ';
var gende = new Array();
gende['0'] = '男';
gende['1'] = '女';
gende[""] = ' ';
//显示教练申请列表
function getcoachApplyRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='actionLibItem'></label>" + "</td>");
    row.append("<td class='name_user'>" + h.nickname + "</td>");//获取用户昵称
    row.append("<td class='img_user upFile'><img src='" + imgIndex + "' /></td>");//获取用户头像
    row.append("<td class='phone_user'>" + h.mobilePhone + "</td>"); //获取手机号
    row.append("<td class='sex_user'>" + gende[h.gender] + "</td>");//获取性别
    row.append("<td class='applyState_user'>" + h.comment + "</td>");//申请说明
    row.append("<td  class='applyData_user'><img src='" + dataImg1 + "' /><img src='" + dataImg2 + "' /></td>");//申请资料
    row.append("<td class='time_user'>" + h.applyDate + "</td>");//申请时间
    if(h.status == ""){
        row.append("<td class='state_user'>" + state[h.status] + "</td>");//获取状态
    }else {
        row.append("<td class='state_user'>" + state[parseInt(h.status)] + "</td>");//获取状态
    }

    row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='audit_btn'>查看并审核</div>" + "</td>");
    return row;
}

//获取页数， 每页记录数，和名称
function InterfaceFunctions(pageNumber, pageSize,status, nickname,mobilePhone) {
    var tbody = $('.contentList').children('tbody');//获取显示内容
    var suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize;//页数、每页记录数
    if (status == null || status == undefined || status == "") {
        status = "";//判断名称
    }
    if (nickname == null || nickname == undefined || nickname == "") {
        nickname = "";
    }
    if (mobilePhone == null || mobilePhone == undefined || mobilePhone == "") {
        mobilePhone = "";
    }
    
    if (status == "" && nickname == "" && mobilePhone != "") {
        suffix ='mobilePhone=' + mobilePhone;
    }else if(status == "" && nickname != "" && mobilePhone == ""){
         suffix ='nickname=' + nickname;
    }else if(status != "" && nickname == "" && mobilePhone == ""){
         suffix ='status=' + status;
    }else if(status != "" && nickname == "" && mobilePhone != ""){
         suffix ='status=' + status + '&mobilePhone=' + mobilePhone;
    }else if(status != "" && nickname != "" && mobilePhone == ""){
         suffix ='status=' + status + '&nickname=' + nickname;
    }else if(status == "" && nickname != "" && mobilePhone != ""){
         suffix ='nickname=' + nickname + '&mobilePhone=' + mobilePhone;
    }else if(status != "" && nickname != "" && mobilePhone != ""){
         suffix ='status=' + status + '&nickname=' + nickname + '&mobilePhone=' + mobilePhone;
    }else {
        suffix ='';
    }

    console.log(suffix);
    $.ajax({
        type: "GET",
        url: URL + '/user/queryAuditList?' + suffix + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        withCredentials: true,//是否打开跨域安全策略
        success: function(data) {
             var timer = setTimeout(function() {
                                            removeLoading('test');
                                                        }, 400);
            console.log(data);

            if (data.code == "200" || data.code == "OK") {
                console.log("获取用户列表成功！");

                // if (data.data.length == 0) {
                //     console.log("aaa");
                //     $("#contentList").css("display","none");
                //     toastr.warning('无记录！');
                //     return false;
                // }else{
                //      $("#contentList").css("display","");
                // }

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
                    dataSource: URL + '/user/queryAuditList?' + suffix,
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

                            var img = data[i].headPhoto;
                                imgIndex = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                             if(img ==""){
                                             imgIndex = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                                }else{
                                    if(img.indexOf(",") != -1){
                                      imgIndex = img.substr(0,[img.indexOf(",")]);
                                    }else if(img.indexOf("http") == -1){
                                                imgIndex = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                                     }else{
                                                imgIndex = img;
                                      } 
                                } 
                                                                 
                             
                            

                        	applyImages = data[i].images;
                            dataImg1 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                           	dataImg2 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                            if(applyImages.length == 0){
                                dataImg1 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                                dataImg2 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                             }else if(applyImages.length == 1){
                                $.each(applyImages,function(i,v){
                                     if(i == 0){
                                        if(v ==""){
                                            dataImg1 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                                        }else{
                                            if(v.indexOf(",") != -1){
                                            dataImg1 = v.substr(0,[v.indexOf(",")]);
                                             }else if(v.indexOf("http") == -1){
                                                dataImg1 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                                             }else{
                                                dataImg1 = v;
                                             } 
                                        } 
                                }
                            });
                                dataImg2 = "http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png";
                             }else if(applyImages.length == 2){

                                $.each(applyImages,function(i,v){
                                if(i == 0){
                                          dataImg1 = applyImages[i];
                                    }
                                if(i == 1){
                                          dataImg2 = applyImages[i];
                                }
                            });
                             }
                            
                                                      
                            
                             var trow = getcoachApplyRow(data[i]);
                            tbody.append(trow);
                            if(data[i].status == 0 || data[i].status == 2){
                                $(".state_user").eq(i).css("color","red");
                            }else{
                                $(".state_user").eq(i).css("color","rgba(103,194,58,1)");

                            }
                            
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
                                            $(".delete_btn").eq(index).text("删除失败");

                                    }
                                });
                            });
                        });
                        
                        //审核
						 $('.audit_btn').each(function(index, element) {
                         $(this).on('click', function(event) {

                             $.each(data[index], function(k, v) {
                                 
                                  sessionStorage.setItem(k, v); 
                                  if(k == "headPhoto"){

                                        if(v ==""){
                                    $(".postDetails-body-box-head-left-icon").append('<img src="http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png">');
                                            
                                        }else{
                                            if(v.indexOf(",") != -1){
                                    $(".postDetails-body-box-head-left-icon").append('<img src="' + v.substr(0,[v.indexOf(",")]) + '">');

                                             }else if(v.indexOf("http") == -1){
                                    $(".postDetails-body-box-head-left-icon").append('<img src="http://wohenshuai.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720181124195429.png">');
                                                
                                             }else{
                                    $(".postDetails-body-box-head-left-icon").append('<img src="' + v + '">');

                                             } 
                                        } 
                                } 
								 
                             });
                             $("#postDetails").css("display","block");
                             $("#box").addClass("mask");
                             var nickname = sessionStorage["nickname"];
                             var applyDate = sessionStorage["applyDate"];
                             var phoneData = sessionStorage["mobilePhone"];
                             var applyComment = decodeURI(sessionStorage["comment"]);
                             var images = data[index].images;
                             var praiseCount = sessionStorage["praiseCount"];
							 var commentCount = sessionStorage["commentCount"];
                             applyId = sessionStorage["applyId"];
                             indeX = index;
//							 console.log(data[index].images);
                            // headPhoto !=null ?  : $(".postDetails-body-box-head-left-icon").append("");
                            nickname == "" ? $("#userNamePostman").text("") : $("#userNamePostman").text(nickname);
                            applyDate == "" ? $("#createdTimePostman").text("") : $("#createdTimePostman").text(applyDate);
                            phoneData == "" ? $("#phonePostman").text("") : $("#phonePostman").text(phoneData);
                            applyComment == "" ? $("#contentPostman").text("") : $("#contentPostman").text(applyComment);
                            
                            if( images == "" || images == ","){
                                 $('#imagesBox').text("暂无申请资料");
                                 $("#imagesBox").css("background","#f5f5f5");
                            }else{
                            	
                            		$.each(images,function(i,v){
//											console.log(i + " " +v);
                                        $("#imagesBox").append('<img src="' + v + '">');
                                        $("#imagesBox").css("background","#fff");
										
								    });
                            	
                            	
                            }
                            });
                           });
                    
                    
                     

                    },
                    locator: 'data'//分页
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
    // $('body').loading({
    //     loadingWidth:240,
    //     title:'请耐心等待',
    //     name:'test',
    //     discription:'正在疯狂加载中... ',
    //     direction:'column',
    //     type:'origin',
    //     // originBg:'#71EA71',
    //     originDivWidth:40,
    //     originDivHeight:40,
    //     originWidth:6,
    //     originHeight:6,
    //     smallLoading:false,
    //     loadingMaskBg:'rgba(0,0,0,0.2)'
    // });
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
    $('#applySearchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_state option:selected').val();
        searchCondition[1] = $('#search_name').val();
        searchCondition[2] = $('#search_phoneNum').val();
        console.log("aaa");
        console.log(searchCondition[0]+" "+searchCondition[1]+" "+searchCondition[2]);
        //console.log(searchCondition[0]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1],searchCondition[2]);
    });
    $('#box').on('click', function() {
        $("#box").removeClass("mask");
        $('#postDetails').css("display","none");
         $('.audit').css("display","none");
          $("#imagesBox").empty();
         $("#lickHeadPhoto").empty();
         $("div").remove("#xiangqingComment");
         $(".postDetails-body-box-head-left-icon").empty();
    });
     $('.windowClose').on('click', function() {
        $("#box").removeClass("mask");
        $('#postDetails').css("display","none");
         $('.audit').css("display","none");
          $("#imagesBox").empty();
         $("#lickHeadPhoto").empty();
         $("div").remove("#xiangqingComment");
         $(".postDetails-body-box-head-left-icon").empty();
         
    });
     $("textarea").focus(function(){
     	$("textarea").val("");
     });
    $('#auditBtn').on('click', function() {
        $('.postDetailsBox').css("display","none");
        $('.audit').css("display","block");
    return false;
    });
	$('#audit-body-b-n').on('click', function() {
		$("#imagesBox").empty();
        $("#lickHeadPhoto").empty();
        $("div").remove("#xiangqingComment");
        $('.audit').css("display","none");
        $("#box").removeClass("mask");
        $(".postDetails-body-box-head-left-icon").empty();
    return false;
    });
$('#audit-body-b-y').on('click', function() {

							 var textValue = $("textarea").val();
							 textValue == "  审核备注..." ? textValue = "" : textValue = textValue;
							$("#imagesBox").empty();
                            $("#lickHeadPhoto").empty();
                            $(".postDetails-body-box-head-left-icon").empty();
                            $("div").remove("#xiangqingComment");
							var auditY = $('#auditY:checked').val();
                            var auditN = $('#auditN:checked').val();
							if(auditY == "1"){
                                console.log(indeX);
                                $(".state_user").eq(indeX).text("审核通过");
                                $(".state_user").eq(indeX).css("color","rgba(103,194,58,1)");


                            	$.ajax({
                                    type: "POST",
                                    url: URL + '/user/trainerAudit',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "applyId": applyId,
                                        "status":auditY,
                                        "audit":textValue
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
                                            console.log(data);
                                            toastr.success('审核完成！');
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error('审核失败！');
                                    }
                                });
                            }else if(auditN == "2"){
                                console.log(indeX);

                                $(".state_user").eq(indeX).text("审核不通过");
                                $(".state_user").eq(indeX).css("color","red");
                            	$.ajax({
                                    type: "POST",
                                    url: URL + '/user/trainerAudit',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "applyId": applyId,
                                        "status":auditN,
                                        "audit":textValue
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
                                            toastr.success('审核完成！');
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error('审核失败！');
                                    }
                                });
                            }else{
								toastr.warning('请选择审核状态！');
                            }

	 if($('#auditY:checked').val() != null || $('#auditN:checked').val() != null){
        $('.audit').css("display","none");
        $("#box").removeClass("mask");
        }
   
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
