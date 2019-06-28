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

$(function () {
	$("#addMessage").on('click',function(){
		$(".mainContent").load('addMessage.html');
	});
});