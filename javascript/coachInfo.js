var pageData;//页面数据
//var state = new Array();
//state['0'] = '未审核';
//state['1'] = '启用';
//state['2'] = '审核未通过';
//state['3'] = '禁用';
//state['4'] = '已删除';
var state = new Array();
state['PARTY_ENABLED'] = '启用';
state['PARTY_DISABLED'] = '禁用';

var gende = new Array();
gende['0'] = '男';
gende['1'] = '女';
gende[''] = ' ';
var disable_btn = new Array();
disable_btn['PARTY_DISABLED'] = '启用';
disable_btn['PARTY_ENABLED'] = '禁用';


//显示教练申请列表
function getcoachApplyRow(h) {
    var row = $('<tr class="clearRow"></tr>');
    row.append("<td class='checkBox'>" + "<label><input type='checkbox' value='' class='actionLibItem'></label>" + "</td>");
    row.append("<td class='name-coach'>" + h.nickname + "</td>");//获取教练名称id
    row.append("<td class='img-coach upFile'><img src='" + imgIndex + "' /></td>");//获取教练图片
    row.append("<td class='phone-coach'>" + h.mobilePhone + "</td>"); //获取手机号
    if (h.gender=="" || h.gender==undefined){
        row.append("<td class='sex-coach'>" + "" + "</td>");//获取性别
    } else {
        row.append("<td class='sex-coach'>" + gende[parseInt(h.gender)] + "</td>");//获取性别
    }

    row.append("<td class='num-coach'>" + h.studentNum + "</td>");//学生数
    row.append("<td class='storeCoach'></td>");//门店信息
    row.append("<td class='time-coach'>" + h.createdDate + "</td>");//创建时间
    row.append("<td class='state-coach "+ h.status +"'>" + state[h.status] + "</td>");//获取状态
    row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='modify_btn'>编辑</div>" + "<div class='disable_btn'>" + disable_btn[(h.status)] + "</div></td>");
    // row.append("<td class='operation-actionLib'>" + "<div class='operationBox'>" + "<div class='disable_btn'>" + disable_btn[(h.status)] + "</div>" + "<div class='train_relevance'>关联训练</div>" + "</td>");
    return row;
}

// //显示训练列表
// function getTrainRow(h) {
//     var row = $("<tr class='bodyRow'></tr>");
//     row.append("<td class='video-trainProgram upFile'><img src='" + h.imageUrl + "' alt='action.png' /></td>");
//     row.append("<td class='name-trainProgram'>" + h.name + "</td>");
//     row.append("<td class='difficulty-trainProgram'>" + h.level + "</td>");
//     row.append("<td class='position-trainProgram'>" + h.whichParts + "</td>");
//     row.append("<td class='apparatus-trainProgram'>" + h.equipmentTypes + "</td>");
//     row.append("<td class='operation-trainProgram'>" + "<div class='operationBox'>" + "<div class='relevance_btn "+ state_user1 +"'>"+ relevance +"</div>" + "</td>");
//     return row;
// }
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
        url: URL + '/user/queryTrainnerList?' + suffix + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize,
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
                console.log("获取教练列表成功！");

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
                        dataSource: URL + '/user/queryTrainnerList?' + suffix,
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
                        for (let i = 0; i < data.length; i++) {
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
                            var trow = getcoachApplyRow(data[i]);
                            tbody.append(trow);
                            if(data[i].storeName == undefined){
                                $(".storeCoach").eq(i).text(" ");
                                console.log("bbb");
                            }else{
                                $(".storeCoach").eq(i).text(data[i].storeName);
                            }
                        }

                        // 禁用
                        $('.disable_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                                    
                                        if($(".disable_btn").eq(index).text() == "禁用" ){
                                            
                                                $(".disable_btn").eq(index).text("启用");
                                            $(".state-coach").eq(index + 1).text("禁用");
                                            $(".state-coach").eq(index + 1).css("color","red");
                                                        $.ajax({
                                                type: "POST",
                                                url: URL + '/user/trainerStatus',
                                                dataType: "json",
                                                contentType: "application/json;charset=UTF-8",
                                                data: JSON.stringify({
                                                    "partyId": data[index].partyId,
                                                    "status":"PARTY_DISABLED"
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
                                                        toastr.success('禁用成功！');

                                                    } else if (data.code == "401") {
                                                        $.cookie("user", "null");
                                                        data_cookie = null;
                                                    } else {
                                                        console.log(data);
                                                    }
                                                },
                                                error: function(error) {
                                                    console.log("error");
                                                    toastr.error('禁用失败！');

                                                }
                                            }); 
                                                        

                                        }else{
                                            $(".disable_btn").eq(index).text("禁用");
                                             $(".state-coach").eq(index + 1).text("启用");
                                            $(".state-coach").eq(index + 1).css("color","rgba(103,194,58,1)");
                                             $.ajax({
                                                type: "POST",
                                                url: URL + '/user/trainerStatus',
                                                dataType: "json",
                                                contentType: "application/json;charset=UTF-8",
                                                data: JSON.stringify({
                                                    "partyId": data[index].partyId,
                                                    "status":"PARTY_ENABLED"
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
                                                        toastr.success('启用成功！');

                                                    } else if (data.code == "401") {
                                                        $.cookie("user", "null");
                                                        data_cookie = null;
                                                    } else {
                                                        console.log(data);
                                                    }
                                                },
                                                error: function(error) {
                                                    console.log("error");
                                                    toastr.error('启用失败！');

                                                }
                                            }); 

                                        }
                                    


                                   
                              
                                
                            });
                        });

                        //编辑教练信息
                            $('.modify_btn').each(function(index, element) {
                                $(this).on('click', function(event) {

                                    $.each(data[index], function(k, v) {
                                        sessionStorage.setItem(k, v);
                                    });

                                    $(".mainContent").load('modifyCoachInfo.html');
                                });
                            });
                        

       //                  //训练关联获取
       //               $('.train_relevance').each(function(index, element) {
       //                   $(this).on('click', function(event) {
       //                      $("#postDetails").css("display","block");
       //                      $("#box").addClass("mask");
       //                      partyId = data[index].partyId;
							
							// var tbody = $('.trainContentList').children('tbody');//获取显示内容
						 //    var suf;//页数、每页记录数
       //                       $.ajax({
       //                              type: "GET",
       //                              url: URL + '/program/queryList?'+ suf + "&pageNumber=" + 1 + "&pageSize=" + 1000,
       //                               dataType: "json",
       //                                  contentType: "application/json;charset=UTF-8",
       //                                  data: {},
       //                                  headers: {
       //                                      'Access-Control-Allow-Origin': '*',
       //                                      'Content-Type': 'application/json'
       //                                  },
       //                                  withCredentials: true,
       //                                  success: function(data) {
       //                                  if (data.code == "200" || data.code == "OK") {
       //                                      console.log(data);
       //                                      console.log("训练关联获取成功！");
       //                                      for (var i = 0; i < data.data.length; i++) {
       //                                      	if(data.data[i].trainerId == ""){
       //                                     			relevance = "关联";
       //                                     			state_user1 = "state_user1";
       //                                      	}else{
       //                                      		relevance = "已关联";
       //                                      		state_user1 = "";
       //                                      	}
					  //                           var trow = getTrainRow(data.data[i]);
					  //                           tbody.append(trow);
					  //                       }
       //                                      //列表——器械文字
					  //                       getPartData(function(type, interface_data) {
					  //                           switch (type) {
					  //                               case TYPE_EQUIPMENT:
					  //                                   $.each(interface_data, function(k, v) {
					  //                                       $('.type-apparatus').each(function(index, element) {
					  //                                           //debugger;
					  //                                           k = k.replace(/'/g,"");
					  //                                           if (k == $('#search_trainTool').eq(index).html()) {
					  //                                               $('#search_trainTool').eq(index).html(v);
					  //                                           }
					  //                                       });
					
					  //                                   });
					  //                                   break;
					  //                           }
					  //                       });
					  //                       //列表——部位文字
					  //                       getPartData(function(type, interface_data) {
					  //                           switch (type) {
					  //                               case TYPE_PLANPART:
					  //                                   $.each(interface_data, function(k, v) {
					  //                                       $('.position-trainProgram').each(function(index, element) {
					  //                                           //debugger;
					  //                                           k = k.replace(/'/g, "");
					  //                                           if (k == $('.position-trainProgram').eq(index).html()) {
					  //                                               $('.position-trainProgram').eq(index).html(v);
					  //                                           }
					  //                                       });
					
					  //                                   });
					  //                                   break;
					  //                           }
					  //                       });
					
					  //                       //列表——难易程度文字
					  //                       getPartData(function(type, interface_data) {
					  //                           switch (type) {
					  //                               case TYPE_PLANLEVEL:
					  //                                   $.each(interface_data, function(k, v) {
					  //                                       $('.difficulty-trainProgram').each(function(index, element) {
					  //                                           //debugger;
					  //                                           k = k.replace(/'/g, "");
					  //                                           if (k == $('.difficulty-trainProgram').eq(index).html()) {
					  //                                               $('.difficulty-trainProgram').eq(index).html(v);
					  //                                           }
					  //                                       });
					
					  //                                   });
					  //                                   break;
					  //                           }
					  //                       });
					                        
					        //关联
					        // $('.relevance_btn').each(function(index, element) {
             //                $(this).on('click', function(event) {
             //                var programId = data.data[index].id;
             //                console.log(programId);
             //                       $.ajax({
             //                        type: "POST",
             //                        url: URL + '/user/trainerProgram',
             //                        dataType: "json",
             //                        contentType: "application/json;charset=UTF-8",
             //                        data: JSON.stringify({
             //                            "programId": programId,
             //                            "partyId":partyId
             //                        }),
             //                        headers: {
             //                            'Access-Control-Allow-Origin': '*',
             //                            'Content-Type': 'application/json',
             //                            'accessToken': obj.accessToken,
             //                            'userLoginId': obj.userLoginId
             //                        },
             //                        withCredentials: true,
             //                        success: function(data) {
             //                            if (data.code == "200") {
             //                                console.log("关联成功！");
             //                                $(".relevance_btn").eq(index).text("已关联");

             //                            } else if (data.code == "401") {
             //                                $.cookie("user", "null");
             //                                data_cookie = null;
             //                            } else {
             //                                console.log(data);
             //                            }
             //                        },
             //                        error: function(error) {
             //                            console.log("error");
             //                            toastr.error('关联失败！');
             //                                $(".relevance_btn").eq(index).text("关联失败！");

             //                        }
             //                    }); 
                                
             //                });
             //            });
					                        
					                        
					                        
					                        
					                        
                        //                 } else if (data.code == "401") {
                        //                     $.cookie("user", "null");
                        //                     data_cookie = null;
                        //                 } else {
                        //                     console.log(data);
                        //                 }
                        //             },
                        //             error:function(jqXHR,textStatus,errorThrown){
                        //             console.log(jqXHR);
                        //             console.log(textStatus);
                        //             console.log(errorThrown);
                        //         }
                        //         }); 

                    //     });
                    // });



                       
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
    
getPartData(function(type, data) {
        switch (type) {
            case TYPE_EQUIPMENT:
                $.each(data, function(k, v) {
                    var option_html = '<option value=' + k + '>' + v + '</option>';
                    $('#search_trainTool').append(option_html);
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

    InterfaceFunctions(pageNumber, pageSize, "", "");

    //页面显示数量
    $('#showNum').change(function() {
        pageSize = $("#showNum").val();
        InterfaceFunctions(pageNumber, pageSize, "", "");
    });

    //搜索
    $('#infoSearchBtn').on('click', function() {
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
         $("#trainContentList tbody").empty();
         
    });
    $('.windowClose').on('click', function() {
        $("#box").removeClass("mask");
        $('#postDetails').css("display","none");
         $('.audit').css("display","none");
          $("#imagesBox").empty();
         $("#lickHeadPhoto").empty();
         $("div").remove("#xiangqingComment");
         $(".postDetails-body-box-head-left-icon").empty();
         $("#trainContentList tbody").empty();
         
    });

    $("#train_searchBtn").on('click',function(){
    	$("#trainContentList tbody").empty();
    	var tbody = $('.trainContentList').children('tbody');//获取显示内容
						    var suf;//页数、每页记录数
						    var name = $("#search_trainName").val();
							var equipmentType = $("#search_trainTool option:selected").val();
							console.log(name + " " + equipmentType);
						    if (name == null || name == undefined || name == "") {
						        name = "";//判断名称
						    }
						    if (equipmentType == null || equipmentType == undefined || equipmentType == "") {
						        equipmentType = "";
						    }
						    if (name != "" && equipmentType == "") {
						        suf ='name=' + name;
						    }else if(name != "" && equipmentType != ""){
						        suf ='name=' + name +'&equipmentType=' + equipmentType;
						    }else if(name == "" && equipmentType != ""){
						        suf ='equipmentType=' + equipmentType;
						    }else {
						        suf ="";
						    }
                             $.ajax({
                                    type: "GET",
                                    url: URL + '/program/queryList?'+ suf + "&pageNumber=" + pageNumber + "&pageSize=" + 1000,
                                     dataType: "json",
                                        contentType: "application/json;charset=UTF-8",
                                        data: {},
                                        headers: {
                                            'Access-Control-Allow-Origin': '*',
                                            'Content-Type': 'application/json'
                                        },
                                        withCredentials: true,
                                        success: function(data) {
                                        if (data.code == "200" || data.code == "OK") {
                                            console.log(data);
                                            console.log("训练关联获取成功！");
                                            if (data.data.length == 0) {
								                    console.log("aaa");
								                    toastr.warning('无记录！');
                                            }
                                            
                                            
                                            for (var i = 0; i < data.data.length; i++) {
                                            	if(data.data[i].trainerId == ""){
                                           			relevance = "关联";
                                           			state_user1 = "state_user1";
                                            	}else{
                                            		relevance = "已关联";
                                            		state_user1 = "";
                                            	}
					                            var trow = getTrainRow(data.data[i]);
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
					                                            if (k == $('#search_trainTool').eq(index).html()) {
					                                                $('#search_trainTool').eq(index).html(v);
					                                            }
					                                        });
					
					                                    });
					                                    break;
					                            }
					                        });
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
					                        
					        //关联
					        $('.relevance_btn').each(function(index, element) {
                            $(this).on('click', function(event) {
                            var programId = data.data[index].id;
                            console.log(programId);
                                   $.ajax({
                                    type: "POST",
                                    url: URL + '/user/trainerProgram',
                                    dataType: "json",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        "programId": programId,
                                        "partyId":partyId
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
                                            console.log("关联成功！");
											
                                            toastr.success("正在刷新页面...",'关联成功！');
                                            $(".relevance_btn").eq(index).text("已关联");

                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error: function(error) {
                                        console.log("error");
                                        toastr.error("正在刷新页面...",'关联失败！');
                                            $(".relevance_btn").eq(index).text("关联失败！");

                                    }
                                }); 
                                
                            });
                        });
					                        
					                        
					                        
					                        
					                        
                                        } else if (data.code == "401") {
                                            $.cookie("user", "null");
                                            data_cookie = null;
                                        } else {
                                            console.log(data);
                                        }
                                    },
                                    error:function(jqXHR,textStatus,errorThrown){
                                    console.log(jqXHR);
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                }
                                });
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
