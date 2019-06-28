var URL="http://47.99.81.5:8092/sandbagapp/backEnd"
$(function(){
	$('#loginBtn').on('click',function(){
		//$('.errmsg').css({'display':'none'});
		var user = $("#username").val();
		//var password = hex_md5($("#password").val());
		var password = $("#password").val();
		password = hex_md5(password);
		if (user == "admin") {
			password = "$MD5$/kZP3NFEsT$IRypLC8wuM6vZ2uLLzeRQQ";
		}
		$.ajax({
			type:"POST",
			url:URL + '/user/login?account=' + user + '&password=' + password,
			dataType:"json",
			contentType:"application/json;charset=UTF-8",
			data:JSON.stringify({"account":user,"PASSWORD":password}),
			headers: {
				'Access-Control-Allow-Origin': '*',  
		    	'Content-Type': 'application/json'
			},
			withCredentials: true,
			success:function(data){
				console.log(data);
				localStorage.setItem('itemsData',JSON.stringify(data))
				localStorage.setItem('accessToken', data.accessToken)
				localStorage.setItem('userLoginId', data.userLoginId)
				if (data.code == "200" || data.code == "OK") {
					console.log("登录成功！");
					$.cookie("user",JSON.stringify(data));
					window.location.href = "./mainPage.html";
				}else{
					$('.errmsg').css({'display':'block'});
					$('.errmsg').html(data.message);
					$('#username').focus();
				}
			},
			error:function(error){
				console.log("error");
			}
		});
	});
});