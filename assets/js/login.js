$(function() {
    // 点击注册账号事件
    $('#reg').on('click', function() {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    // 点击登录事件
    $('#login').on('click', function() {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 从layUI中获取form对象
    const form = layui.form
    const layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/ ,'密码必须6到12位,且不能出现空格'
          ] ,
        repwd: function(value) {
            // 1.通过形参拿到的是确认密码的值
            // 2.需获取输入密码的的值
            // 3.判断两次密码值是否相等
           var pwd = $('.reg_box [name=password]').val() 
           if(pwd !== value) {
               return '两次密码输入不一致'
           }   
        }
    })

    // 监听表单的注册提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        const data = {username: $('#form_reg [name=username]').val() ,
        password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser' , 
        data,
        function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,去登录');
            $('#login').click()
        })
    })

    // 监听表单的登录提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                // console.log(res.token);
                // 将登录成功后的token 保存到本地中
                localStorage.setItem('token', res.token)

                // 跳转到后台页面
                location.href = ('/index.html')
            }
        })
    })
})