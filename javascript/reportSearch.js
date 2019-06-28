var pageData;//页面数据
var state = new Array();
state['ARTICLE_DISABLED'] = '未审核';
state['ARTICLE_ENABLED'] = '已审核';
state['ARTICLE_DELETE'] = '已删除';
    
    var topPost = new Array();
topPost['1'] = '取消置顶';
topPost['5'] = '置顶';
  
//显示器械列表
function getDataRow(h) {
    var row = $('<tr style= "display:none" class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='actionLibItem'></label>" + "</td>");
    row.append("<td class='content-post'>" + decodeURI(h.content) + "</td>");//获取帖子内容
    row.append("<td class='img-post upFile'><img src='" + imgIndex + "' alt='article.png' /></td>");//获取图片
    row.append("<td class='person-post'>" + h.userName + "</td>"); //获取发帖人
    row.append("<td class='time-post'>" + h.createdTime + "</td>");//获取发帖时间
    row.append("<td class='comment-post'>" + h.commentCount + "</td>");//获取评论 数量
    row.append("<td class='like-post'>" + h.praiseCount + "</td>");//获取点赞数量
    row.append("<td class='state-coach "+ h.status + " '>" + state[(h.status)] + "</td>");//获取状态
    row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='audit_btn'>审核</div>" + "<div id='"+ h.id +"' class='delete_btn'>删除</div>" + "<div class='report_info'>"+ "举报信息" +"</div>" + "</td>");
    return row;
}
//显示评论列表
function getCommentList(k) {
    var xiangqing = $('<div id="xiangqingComment" class="postDetails-body-box-xiangqing"></div>');
    var xiangqingUp = $('<div class="xiangqing-up"></div>');
    var xiangqingDown = $('<div id="commentContent" class="xiangqing-down">'+ decodeURI(k.content) +'</div>');
    var xiangqingleft = $('<div id="commentPic" class="xiangqing-up-left">'+ '<img src="' + k.headPhoto +'" />' +'</div>');
    var xiangqingRight = $('<div class="xiangqing-up-right"></div>');
    var xiangqingName = $('<div id="commentMan" class="xiangqing-name">'+ k.userName +'</div>');
    var xiangqingTime = $('<div id="commentTime" class="xiangqing-time">'+ k.createdTime +'</div>');
    xiangqingRight.append(xiangqingName);
    xiangqingRight.append(xiangqingTime);
    xiangqingUp.append(xiangqingleft);
    xiangqingUp.append(xiangqingRight);
    xiangqing.append(xiangqingUp);
    xiangqing.append(xiangqingDown);
    return xiangqing;
}
function getReportInfoList(k) {
    var reportDetails = $('<div id="reportDetails" class="postDetails-body-box-xiangqing"></div>');
    var reportDetailsUp = $('<div class="xiangqing-up"></div>');
    var reportDetailsDown = $('<div id="reportDetailsContent" class="xiangqing-down">'+ k.reason +'</div>');
    var reportDetailsleft = $('<div id="reportDetailsPic" class="xiangqing-up-left">'+ '<img src="' + k.headPhoto +'" />' +'</div>');
    var reportDetailsRight = $('<div class="xiangqing-up-right"></div>');
    var reportDetailsName = $('<div id="reportDetailsMan" class="xiangqing-name">'+ k.userName +'</div>');
    var reportDetailsTime = $('<div id="reportDetailsTime" class="xiangqing-time">'+ k.createdTime +'</div>');
    reportDetailsRight.append(reportDetailsName);
    reportDetailsRight.append(reportDetailsTime);
    reportDetailsUp.append(reportDetailsleft);
    reportDetailsUp.append(reportDetailsRight);
    reportDetails.append(reportDetailsUp);
    reportDetails.append(reportDetailsDown);
    return reportDetails;
}
//获取页数， 每页记录数，和名称
function InterfaceFunctions(pageNumber, pageSize, content,userName) {
    var tbody = $('.contentList').children('tbody');//获取显示内容
    var suffix ='pageNumber=' + pageNumber + '&pageSize=' + pageSize;//页数、每页记录数
    if (content == null || content == undefined || content == "") {
        content = "";//判断名称
    }
    if (userName == null || userName == undefined || userName == "") {
        userName = "";
    }
    if (content != "" && userName == "") {
        suffix ='content=' + content;
    }else if(content != "" && userName != ""){
         suffix ='content=' + content +'&userName=' + userName;
    }else if(content == "" && userName != ""){
         suffix ='userName=' + userName;
    }else {
        suffix ="";
    }

    console.log(suffix);
    $.ajax({
        type: "GET",
        url: URL + '/article/queryList?' + suffix + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: {},
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        withCredentials: true,//是否打开跨域安全策略
        success: function(data) {
            console.log(data);

            if (data.code == "200" || data.code == "OK") {
                console.log("圈子列表成功！");

                // if (data.total == 0) {
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
                    dataSource: URL + '/article/queryList?' + suffix,
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
                        $.each(data,function(index,obj){
                        	var img = data[index].images;
//                             console.log(img);

                            $.each(img,function(i,v){
                                if(i == 0){
                                          imgIndex = v;
                                    }                                 
                             });
                        	var trow = getDataRow(obj);
                            tbody.append(trow);
                        	$.each(obj,function(key,value){
                        		
														
                            
									if(key == "id"){
															
									$.ajax({
                                    type: "GET",
                                    url: URL + '/article/queryAccuseList?' + "id=" + value + '&pageNumber=' + pageNumber + '&pageSize=' + data[index].accuseCount,
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                    }),
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Content-Type': 'application/json',
                                        'accessToken': obj.accessToken,
                                        'userLoginId': obj.userLoginId
                                    },
                                    
                                    success: function(data) {
                                    	var reportNull = true;	
                                        if (data.code == "200") {   
                                        	
//                                          console.log(data);
                                            if(data.data.length != 0){
												$("#"+value).parent().parent().parent().css("display","");
												
                                            }
                                            
                                            	
                                            
                                            
                                            
                                            
                                            var timer = setTimeout(function() {
                                            removeLoading('test');
                                                        }, 1000);
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
														
                        	
                        });	
                        });
						
													
                        // 删除
                        $('.delete_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                            	
                            	
                                $.ajax({
                                    type: "POST",
                                    url: URL + '/article/delete',
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
                                            toastr.success("正在刷新页面...",'删除成功！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('circleManage.html');
                                                        }, 1000);
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error("正在刷新页面...",'删除失败！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('circleManage.html');
                                                        }, 1000);
                                    }
                                });
                                
                                
                            });
                        });


                        //举报信息
                        $('.report_info').each(function(index, element) {
                         $(this).on('click', function(event) {
                               

                                    $.ajax({
                                    type: "GET",
                                    url: URL + '/article/queryAccuseList?' + "id=" + data[index].id + '&pageNumber=' + pageNumber + '&pageSize=' + data[index].accuseCount,
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
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
                                           
                                            	
                                            	$.each(data.data,function(i,obj){
                                                    // console.log(data.data[i].userName);
                                                    var reportInfoList = getReportInfoList(data.data[i]);
                                                    $("#report_box").append(reportInfoList);
                                            	});
                                            	$("#report_box").css("display","block");
                                            	$("#box").addClass("mask");
                                            	
                                            	
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

                          
                               
                            
                        });
                        });

                    
                             




                        
                     //帖子列表获取
                     $('.audit_btn').each(function(index, element) {
                         $(this).on('click', function(event) {

                             $.each(data[index], function(k, v) {
                                 
                                  sessionStorage.setItem(k, v);  
//								 console.log(k +" " +v); 
                                  
                             });
                             $("#postDetails").css("display","block");
                             $("#box").addClass("mask");
                             var userName = sessionStorage["userName"];
                             var createdTime = sessionStorage["createdTime"];
                             var content = decodeURI(sessionStorage["content"]);
                             var images = data[index].images;
                             var praiseCount = sessionStorage["praiseCount"];
							 var commentCount = sessionStorage["commentCount"];
							 auditId = sessionStorage["id"];
//							 console.log(data[index].images);
                            userName == "" ? $("#userNamePostman").text("") : $("#userNamePostman").text(userName);
                            createdTime == "" ? $("#createdTimePostman").text("") : $("#createdTimePostman").text(createdTime);
                            content == "" ? $("#contentPostman").text("") : $("#contentPostman").text(content);
                            $("#lickNum").text(praiseCount +"人点赞：");
							$("#commentNum").text("评论数(" + commentCount +")");
                            if( images == "" || images == ","){
                                 $('#imagesBox').text("暂无图片信息");
                                 $("#imagesBox").css("background","#f5f5f5");
                            }else{
                            	
                            		$.each(images,function(i,v){
//											console.log(i + " " +v);
                                        $("#imagesBox").append('<img src="' + v + '">');
                                        $("#imagesBox").css("background","#fff");
										
								    });
                            	
                            	
                            }

                            //评论数
                            if(commentCount == 0 ){
                                $(".postDetails-body-box-xiangqing").css("display","none");
                            }else{
                            	
                            	 $.ajax({
                                    type: "GET",
                                    url: URL + '/article/queryCommentList?' + 'id=' + data[index].id + '&pageNumber=' + pageNumber + '&pageSize=' + commentCount,
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
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
                                            if(data.total == 0){
                              					  $(".postDetails-body-box-xiangqing").css("display","none");
                                            }else{
                                            	$.each(data.data,function(i,obj){
                                                    // console.log(data.data[i].userName);
                                                    var commentList = getCommentList(data.data[i]);
                                                    $("#postDetails-body-box").append(commentList);
                                            	});
                                               
															                                       
                                                }
                                            
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
                            
                            //点赞数量
                            if(praiseCount == 0 ){
                                $(".postDetails-body-box-body-content-dianzan-right-icon").css("display","none");
                                $(".postDetails-body-box-body-content-dianzan-right-btn").css("display","none");
                            }else{
                                $.ajax({
                                    type: "GET",
                                    url: URL + '/article/queryPraiseList?' +'id=' + data[index].id+ '&pageNumber=' + pageNumber + '&pageSize=' + praiseCount,
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
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
                                            if(data.total == 0){
                                                 $(".postDetails-body-box-body-content-dianzan-right-icon").css("display","none");
                                                 $(".postDetails-body-box-body-content-dianzan-right-btn").css("display","none");
                                            }else{
                                                $.each(data.data,function(index,obj){
                                                    $.each(obj,function(k,v){
                                                 $(".postDetails-body-box-body-content-dianzan-right-icon").css("display","block");
                                                 $(".postDetails-body-box-body-content-dianzan-right-icon").css("display","block");
                                                     if(k == "headPhoto" ){
                                                         $("#lickHeadPhoto").append('<img src="' + v + '">');

                                                     }
                                                });
                                            });
                                                
                                            }
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
// 		loadingWidth:240,
// 		title:'若列表为空，则没有举报贴！',
// 		name:'test',
// 		discription:'正在疯狂加载中... ',
// 		direction:'column',
// 		type:'origin',
// 		// originBg:'#71EA71',
// 		originDivWidth:40,
// 		originDivHeight:40,
// 		originWidth:6,
// 		originHeight:6,
// 		smallLoading:false,
// 		loadingMaskBg:'rgba(0,0,0,0.2)'
// 	});
	
 $("#backReport").on('click',function(){
    $(".mainContent").load('circleManage.html');
 });
	
    var pageNumber = 1;
    var pageSize = 10000;

    InterfaceFunctions(pageNumber, pageSize, "", "");
		
    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "");
    });

    //搜索
    $('#searchBtn').on('click', function() {
        var searchCondition = [];
        searchCondition[0] = $('#search_keyword').val();
        searchCondition[1] = $('#search_userName').val();
        //console.log(searchCondition[0]);
        InterfaceFunctions(pageNumber, pageSize, searchCondition[0], searchCondition[1]);
    });
    $('#box').on('click', function() {
        $("#box").removeClass("mask");
        $('#postDetails').css("display","none");
         $('.audit').css("display","none");
          $("#imagesBox").empty();
         $("#lickHeadPhoto").empty();
         $("div").remove("#xiangqingComment");
         $("#report_box").css("display","none");
         $("div").remove("#reportDetails");
         
    });
    $('#postDetails').on('click', function() {
        $('.postDetails-body-box-body-content-dianzan-right-icon').css("overflow","hidden");
        $('.postDetails-body-box-body-content-dianzan-right-icon-touxiang').css("background","#fff");

    });
    $('#rightBtn').on('click', function() {
        $('.postDetails-body-box-body-content-dianzan-right-icon').css("overflow","visible");
        $('.postDetails-body-box-body-content-dianzan-right-icon-touxiang').css("background","#f5f5f5");

    return false;
    });
    $('#auditBtn').on('click', function() {
        $('.postDetails').css("display","none");
        $('.audit').css("display","block");
    return false;
    });
	$('#audit-body-b-n').on('click', function() {
		$("#imagesBox").empty();
        $("#lickHeadPhoto").empty();
        $("div").remove("#xiangqingComment");
        $('.audit').css("display","none");
        $("#box").removeClass("mask");
        
    return false;
    });
$('#audit-body-b-y').on('click', function() {
							$("#imagesBox").empty();
                            $("#lickHeadPhoto").empty();
                            $("div").remove("#xiangqingComment");
							var auditY = $('#auditY:checked').val();
                            var auditN = $('#auditN:checked').val();
							if(auditY == "ARTICLE_ENABLED"){
                            	$.ajax({
                                    type: "POST",
                                    url: URL + '/article/audit',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "id": auditId,
                                        "status":auditY
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
                                            toastr.success("正在刷新页面...",'审核完成！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('reportSearch.html');
                                                        }, 500);
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error("正在刷新页面...",'审核失败！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('reportSearch.html');
                                                        }, 500);
                                    }
                                });
                            }else if(auditN == "ARTICLE_DELETE")
                            	$.ajax({
                                    type: "POST",
                                    url: URL + '/article/audit',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "id": auditId,
                                        "status":auditN
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
                                            toastr.success("正在刷新页面...",'审核完成！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('reportSearch.html');
                                                        }, 500);
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error("正在刷新页面...",'审核失败！');
                                         var timer = setTimeout(function() {
                                            $(".mainContent").load('reportSearch.html');
                                                        }, 500);
                                    }
                                });
                            else{
								toastr.warning('请选择审核状态！');
                            }

	 if($('#auditY:checked').val() != null || $('#auditN:checked').val() != null){
        $('.audit').css("display","none");
        $("#box").removeClass("mask");
        }
   
    });
$('#auditY').on('click', function() {
	$('#auditN').attr("disabled","disabled");
    });
$('#auditN').on('click', function() {
	$('#auditY').attr("disabled","disabled");
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
