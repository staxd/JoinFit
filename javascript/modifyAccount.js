$(function () {
    $("#initialPassword").change(function () {
        if ($(this).val().length < 6) {
            $(".tip_msp_oldPassword").css({ "display": "inline-block" });
        } else {
            $(".tip_msp_oldPassword").css({ "display": "none" });
        }
    });

    $("#newPassword").change(function () {
        if ($(this).val().length < 6) {
            $(".tip_msp").css({ "display": "inline-block" });
        } else {
            $(".tip_msp").css({ "display": "none" });
        }
    });

    //设置返回值
    $("#name-account").val(sessionStorage["nickname"]);
    $("#name-account").css({"background":"#DCDCDC"});

    //保存
    $('.submitBtn').on('click', function() {
        var oldpassword = $("#initialPassword").val();
        if (oldpassword.length < 6){
            $(".tip_msp_oldPassword").css({ "display": "inline-block" });
            return;
        }
        var newpassword = $("#newPassword").val();
        if (newpassword.length < 6){
            $(".tip_msp").css({ "display": "inline-block" });
            return;
        }

        $.ajax({
            type: "POST",
            url: URL + '/user/modifyPassword',
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                "partyId": sessionStorage["partyId"],
                "oldpassword": hex_md5(oldpassword),
                "newpassword": hex_md5(newpassword)
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
                    console.log("后台账号修改成功！");
                    toastr.success("修改成功！");
                    var timer = setTimeout(function() {
                        $('.accountManage').click();
                    }, 2000);

                } else if (data.code == "401") {
                    $.cookie("user", "null");
                    data_cookie = null;
                    handleTokenInvalid();
                } else if(data.code == "400") {
                    console.log(data);
                    toastr.warning("修改失败！" + data.message);
                    $(".submitBtn").removeAttr("disabled");
                    $(".submitBtn").css({"background":"#67C23A"});
                } else {
                    console.log(data);
                    toastr.warning("修改失败！请检查输入内容格式!");
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
                toastr.warning("修改失败！请联系开发人员处理!");
            }
        });

    });

    $(".cancel").on('click', function() {
        $('.accountManage').click();
    });
});