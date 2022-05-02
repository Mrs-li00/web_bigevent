$(function() {
    var form= layui.form
    
    
    form.verify ({
        nickname: function(value) {
           if(value.length > 6) {
               return '昵称长度在1-6位之间'
           }
        }
    })
    

    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo() {
       $.ajax({
           type: 'get',
           url: '/my/userinfo',
           success: function(res) {
               if(res.status !== 0) {
                 return layui.layer.msg('获取用户信息失败')
               }
            //    console.log(res);
               form.val('formUserInfo', res.data)  

           } 
        })
    }

    // 重置表单内容
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单提交事件
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败')
                }
                layui.layer.msg('更新用户信息成功');
                window.parent.getUserInfo()

            }
        })
    })
})