var screenHeight;
var URL = "http://47.99.81.5:8092/sandbagapp/backEnd";
var url = "http://47.99.81.5:8092/sandbagapp";

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

function delClass(ele, className) {
    $(ele).find(".sideNav-item").each(function() {
        if ($(this).hasClass(className)) {
            $(this).removeClass(className);
        }
    });
}

$(function() {

    // if (obj.headPhotoUrl != "" && obj.headPhotoUrl != undefined && obj.headPhotoUrl != "undefined") {
    //     $('.avatar').children("img").attr('src', obj.headPhotoUrl);
    // }

    $(".userManagement").on('click', function() {
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".mainContent").load('userManage.html');
    });

    $('.coachApply').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('coachApply.html');
    });
     $('.coachInfo').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('coachInfo.html');
    });
    $(".circleManagement").on('click', function() {
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".mainContent").load('circleManage.html');
    });

    $(".integralMall").on('click', function() {
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".mainContent").load('integralMall.html');
    });

    $(".orderManagement").on('click', function() {
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".mainContent").load('orderManage.html');
    });

    $('.bannerManage').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('bannerManage.html');
    });

    $('.dryGoods').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('dryGoods.html');
    });

    $('.instrument').on('click', function () {
        $(".moreMenu-item").each(function () {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('instrument.html');
    });

    $('.actionLib').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('actionLib.html');
    });

    $('.trainProgram').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('trainProgram.html');
    });

    $('.apparatusMall').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('apparatusMall.html');
    });

    $('.diet').on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('diet.html');
    });

    $(".marketingManagement").on('click', function() {
        if ($(".marketType").hasClass("showBox")) {
            $(".marketType").removeClass("showBox");
            $('.marketingManagement').find(".sideNav-icon").attr('src', './img/takeUp.png');
        } else {
            $(".marketType").addClass("showBox");
            $('.marketingManagement').find(".sideNav-icon").attr('src', "./img/drop-down.png");
        }
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".bannerManage").click();
    });
	$(".coachManagement").on('click', function() {
        if ($(".coachType").hasClass("showBox")) {
            $(".coachType").removeClass("showBox");
            $('.coachManagement').find(".sideNav-icon").attr('src', './img/takeUp.png');
        } else {
            $(".coachType").addClass("showBox");
            $('.coachManagement').find(".sideNav-icon").attr('src', "./img/drop-down.png");
        }
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        $(".coachApply").click();
    });
    
    $(".messageManage").on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('messageManage.html');
    });

    $(".userOpinion").on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('opinion.html');
    });

    $(".accountManage").on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('accountManage.html');
    });

    $(".modifyPassword").on('click', function() {
        $(".moreMenu-item").each(function() {
            if ($(this).find('a').hasClass("moreMenu-active")) {
                $(this).find('a').removeClass("moreMenu-active");
            }
        });
        $(this).find('a').addClass('moreMenu-active');
        $(".mainContent").load('modifyPassword.html');
    });

    $(".system-setup").on('click', function() {
        if ($(".setupType").hasClass("showBox")) {
            $(".setupType").removeClass("showBox");
            $(".system-setup").find(".sideNav-icon").attr('src', './img/takeUp.png');
        } else {
            $(".setupType").addClass("showBox");
            $(".system-setup").find(".sideNav-icon").attr('src', './img/drop-down.png');
        }
        delClass($(".sideNav"), "actived");
        $(this).addClass("actived");
        // $(".messageManage").click(); //此功能隐藏
        $(".userOpinion").click();
    });

    $('.systemMessage').on('click', function() {
        $(".system-setup").click();
        if ($(".setupType").hasClass('showBox')) {
            $(".system-setup").click();
        }
        $(".userOpinion").click();
    });

    $('.setUp').find('img').on('click', function() {
        if ($(".system-setup").hasClass("actived")) {} else {
            $('.system-setup').click();
        }
        // $(".messageManage").click(); //此功能隐藏
        $(".userOpinion").click();
    });

    $('#signOut').on('click',function(){
        $.cookie("user", "null");
        data_cookie = null;
        window.location.href = "index.html";
    });

    $('.sideNav-item').on('click', function() {
        if (!$(this).hasClass('marketingManagement')) {
            if (!$(".marketType").hasClass("showBox")) {
                $(".marketType").addClass("showBox");
                $('.marketingManagement').find(".sideNav-icon").attr('src', "./img/drop-down.png");
            }
        }
        if (!$(this).hasClass('coachManagement')) {
            if (!$(".coachType").hasClass("showBox")) {
                $(".coachType").addClass("showBox");
                $('.coachManagement').find(".sideNav-icon").attr('src', "./img/drop-down.png");
            }
        }
        if (!$(this).hasClass('system-setup')) {
            if (!$(".setupType").hasClass("showBox")) {
                $(".setupType").addClass("showBox");
                $(".system-setup").find(".sideNav-icon").attr('src', './img/drop-down.png');
            }
        }
    });
    $(".userManagement").click();

    var screenHeight = $(window).height();

    $(".mainContent").resize(function() {
        var div_height = $(this);
        if (screenHeight < div_height.height() + 80) {
            $(".sideNav").css({ minHeight: div_height.height() + 20 });
        } else {
            $(".sideNav").css({ minHeight: screenHeight });
        }

    });

    toastr.options = {
        "closeButton": false, //显示关闭按钮
        "debug": false, //启用debug
        "positionClass": "toast-top-center", //弹出的位置
        "showDuration": "300", //显示的时间
        "hideDuration": "1000", //消失的时间
        "timeOut": "1000", //停留的时间
        "extendedTimeOut": "1000", //控制时间
        "showEasing": "swing", //显示时的动画缓冲方式
        "hideEasing": "linear", //消失时的动画缓冲方式
        "showMethod": "fadeIn", //显示时的动画方式
        "hideMethod": "fadeOut" //消失时的动画方式
    };

});