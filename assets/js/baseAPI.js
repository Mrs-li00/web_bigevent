$.ajaxPrefilter(function(options) {
    
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);

    // 统一为有权限的接口, 设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

    // 全局统一挂载complete函数
    options.complete = function(res) {
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
            // 1.清空token值
            localStorage.removeItem('token')
            // 2.强制返回登录页
            location.href = '/login.html'
        } 
    }
})