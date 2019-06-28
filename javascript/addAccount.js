function limitation(value){
    debugger;
    if(value.length > 0){
        value = value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g,'');
        // if(/["'<>%;)(&+]/.test(value)){
        //     $("#name-account").val(value.replace(/["'<>%;)(&+]/,""));
        // }
        $("#name-account").val(value);
    }
}

$(function() {
    var isInputZh = false;
    $("#name-account")[0].addEventListener('compositionstart', function () {
        isInputZh = true;
    },false);

    $("#name-account")[0].addEventListener('compositionend',function(){
        debugger;
        isInputZh = false;
        limitation($("#name-account").val());
    },false);

    $("#name-account")[0].addEventListener('input',function(){
        debugger;
        if(isInputZh) return;
        var value = this.value;
        limitation(value);
    },false);

    $("#name-account").change(function () {
        if ($(this).val().length < 1) {
            $(".tip_msp_name").css({ "display": "inline-block" });
        } else {
            $(".tip_msp_name").css({ "display": "none" });
        }
    });

    $("#installPassword").change(function () {
        if ($(this).val().length < 6) {
            $(".tip_msp_password").css({ "display": "inline-block" });
        } else {
            $(".tip_msp_password").css({ "display": "none" });
        }
    });

    //保存
    $('.submitBtn').on('click', function() {
        var account = $("#name-account").val();
        if(account.length < 1){
            $(".tip_msp_name").css({ "display": "inline-block" });
            return;
        }
        if($("#installPassword").val() === $("#confirmPassword").val()){
            var password = $("#installPassword").val();
            $(".tip_msp").css({ "display": "none" });
            if (password.length < 6) {
                $(".tip_msp_password").css({ "display": "inline-block" });
                return;
            }
        } else{
            $(".tip_msp").css({ "display": "inline-block" });
            return;
        }

        $.ajax({
            type: "POST",
            url: URL + '/user/create',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "userId": obj.userId,
                "account": account,
                "password": hex_md5(password)
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'accessToken': obj.accessToken,
                'userLoginId': obj.userLoginId
            },
            withCredentials: true,
            beforeSend: function(){
                $(".submitBtn").attr({"disabled": true});
                $(".submitBtn").css({"background":"#DCDCDC"});
            },
            success: function(data) {
                console.log(data);
                if (data.code == "200" || data.code == "OK") {
                    console.log("后台账号新增成功！");
                    toastr.success("新增成功！");
                    var timer = setTimeout(function() {
                        $('.accountManage').click();
                    }, 2000);


                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else if(data.code == "500"){
                    toastr.warning("新增失败！该账号名已存在!");
                    $(".submitBtn").removeAttr("disabled");
                    $(".submitBtn").css({"background":"#67C23A"});
                } else {
                    console.log(data);
                    toastr.warning("新增失败！请检查输入内容格式!");
                    $(".submitBtn").removeAttr("disabled");
                    $(".submitBtn").css({"background":"#67C23A"});
                }
            },
            // complete: function () {
            //     $(".submitBtn").removeAttr("disabled");
            // },
            error: function(error) {
                console.log("error");
                $(".submitBtn").removeAttr("disabled");
                $(".submitBtn").css({"background":"#67C23A"});
                toastr.warning("新增失败！请联系开发人员处理!");
            }
        });


    });

    $(".cancel").on('click', function() {
        $('.accountManage').click();
    });
});