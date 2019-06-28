//初始化
var client = new OSS.Wrapper({
    region: 'oss-cn-hangzhou',
    secure: true,
    accessKeyId: 'LTAI75QlaQTIyBP7',
    accessKeySecret: 'hbnJs9v89gg8DC0a0pYMDID9XdMEAS',
    bucket: 'joinfit'
});
var modifyId = ''
getList()
//分页
$('#showNum').change(function () {
    let size = Number($("#showNum").val())
    getList(size)
});
//新增
$('#addInstrument').click(function () {
    $("#postDetails").css("display", "block");
    $('#box').addClass('mask')
    $('#sub').attr('data-id','0')
    $('#name').val('')
    $('.upImageBox').children().remove()
})
//修改
$('#info_box').on('click', '#modify', function () {
    var that = $(this)
    $('#sub').attr('data-id', '1')
    $("#postDetails").css("display", "block");
    $('#box').addClass('mask')
    modifyId = that.parents('tr').attr('data-id')
    $('#name').val(that.parents('tr').attr('data-name'))
    $('.upImageBox').children().remove()
    $('.upImageBox').append('<a class="upImageBox_term clearFile"><img id="imageUrl" src=' + that.parents('tr').attr('data-img')+' alt=""><i class="del_icon"></i></a>')
})
//删除
$('#info_box').on('click', '#delete', function () {
    let that = $(this)
    var list_options = {
        type: 'post',
        url: 'backEnd/exercise/equipment/delete',
        data: {
            id: that.parents('tr').attr('data-id')
        }
    }
    var list_back = {}
    list_back.success = function (e) {
        toastr.success('删除成功！');
        getList()
    }
    list_back.before = function () { }
    sendAjax(list_options, list_back)
})
//删除文件
$('.upImageBox').on('click', '.del_icon', function () {
    $(this).parents('.clearFile').remove()
})
//搜索
$('#instrumentSearchBtn').click(function () {
    getList()
})
$('#box').on('click', function () {
    $("#box").removeClass("mask");
    $('#postDetails').css("display", "none");
    $('.audit').css("display", "none");
});
$('.windowClose').on('click', function () {
    $("#box").removeClass("mask");
    $('#postDetails').css("display", "none");
    $('.audit').css("display", "none");
    $("#imagesBox").empty();
    $("#lickHeadPhoto").empty();
    $("div").remove("#xiangqingComment");
    $(".postDetails-body-box-head-left-icon").empty();

});
//上传文件按钮点击事件
var uploadImage = $("#uploadImage_btn");
uploadImage.on("click", function () {
    return $("#train_image")[0].click();
});

$("#train_image").change(function () {
    if ($(this)[0].files[0].size > 1024 * 1024 * 5) {
        alert("上传图片超出大小，请选择小一点的图片！");
        return false;
    } else if ($(this)[0].files.length > 1) {
        alert("请上传单张图片！");
        return false;
    } else {
        image_URL = uploadPic($(this));
    }

});

//获取列表
function getList(pageSize) {
    let html = ""
    let tpl_fn = Handlebars.compile($('#info_template').html());
    let list_options = {
        type: 'get',
        url: 'backEnd/exercise/equipment/queryList',
        data: {
            name: $('#searchName').val() || '',
            pageNumber: 1,
            pageSize: Number($('#showNum option:selected').val())
        }
    }
    let list_back = {}
    list_back.coment = function (e) {
        $('.bottom-pageNum-box').pagination({
            dataSource: e.config.url + '?name=' + e.config.params.name,
            totalNumber: e.data.total,
            alias: {
                pageNumber: 'pageNumber',
                pageSize: 'pageSize'
            },
            pageNumber: 1,
            pageSize: pageSize || Number($('#showNum option:selected').val()),
            callback: function (res, pagination) {
                html = ''
                $.each(res, function (index, item) {
                    html += tpl_fn(item)
                })
                $('#info_box').html(html);
            },
            locator: 'data'
        });
    }
    sendAjax(list_options, list_back)
}
function uploadPic(obj) {
    $('.sk-circle').css({ 'display': 'inline-block' });
    var file = obj[0].files[0]; //获取文件流
    var val = obj[0].value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = "exercise/image/" + timestamp() + suffix;
    //var image_url = client.getObjectUrl(storeAs);
    var image_url = "https://joinfit.oss-cn-hangzhou.aliyuncs.com/" + storeAs;

    //oss上传 回调
    client.multipartUpload(storeAs, file).then(function (result) {
        //清空已有文件
        $('.clearFile').each(function () {
            $(this).remove();
        });

        //上传文件显示
        var image_html = "<a class='upImageBox_term clearFile'><img id='imageUrl' src='" + image_url + "' alt=''/><i class='del_icon'></i></a>";
        $('.upImageBox').prepend(image_html);

        $('.sk-circle').css({ 'display': 'none' });

        
        //清空input框，确保同一个文件可上传
        $('#train_image').val("");

    }).catch(function (err) {
        alert("连接超时请重试");
    });

    return image_url;
}
//获取时间
function timestamp() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return "" + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}
//时间补零
function add0(m) {
    return m < 10 ? '0' + m : m;
}
//提交
$('#sub').click(function (){
    var that = $(this)
    var status = Number(that.attr('data-id'))
    if ($('#name').val()==''){
        toastr.warning('请输入器械名称！');
        return
    } else if ($('.upImageBox').children().length==0){
        toastr.warning('请上传器械图片！');
        return
    }else if($('#imageUrl').prop('src')==''){
        toastr.warning('请上传器械图片！');
        return
    }
    var list_options = {}
    var list_back = {}
    if(status){
        list_options = {
            type: 'post',
            url: 'backEnd/exercise/equipment/modify',
            data: {
                id: modifyId,
                name: $('#name').val(),
                imageUrl: $('#imageUrl').prop('src')
            }
        }
        list_back.success = function (e) {
            toastr.success('修改成功！');
            getList()
            $('.windowClose').trigger('click')
        }
    }else{
        list_options = {
            type: 'post',
            url: 'backEnd/exercise/equipment/add',
            data: {
                name: $('#name').val(),
                imageUrl: $('#imageUrl').prop('src')
            }
        }
        list_back.success = function (e) {
            toastr.success('新增成功！');
            getList()
            $('.windowClose').trigger('click')
        }
    }
    sendAjax(list_options, list_back)
})

