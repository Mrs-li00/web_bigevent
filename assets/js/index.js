$(function() {
    getUserInfo()

    var layer = layui.layer
    $('#tuichu').on('click', function() {
      //  console.log('ok');
       layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, 
       function(index){
        // 1.清空token值
        localStorage.removeItem('token')
         // 2.返回到登录页面
         location.href = ('/login.html')
         layer.close(index);
       });
    })
   
})

// 获取用户登录信息
function getUserInfo() {
   $.ajax({
      method: 'GET',
      url: '/my/userinfo',

      success: function(res) {
         // console.log(res);
         if(res.status !== 0) {
            return layui.layer.msg('获取用户信息失败')
         }
         renderAvatar(res.data)
      },

      // 不论失败还是成功,都要调用complete函数
      // complete: function(res) {
      //    // console.log(res);
      //    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
      //       // 1.清空token值
      //       localStorage.removeItem('token')
      //       // 2.强制返回登录页
      //       location.href = '/login.html'
      //    }
      // }
   })
}

// 渲染用户头像
function renderAvatar(user) {
   var name = user.nickname || user.username
   // 设置欢迎文本
   $('.welcome').html('欢迎&nbsp;&nbsp' + name)
   // 2.按需渲染用户头像
   if(user.user_pic !== null) {
      // 2.1渲染图片头像
      $('.layui-nav-img').attr('src', 'user.user_pic').show()
      $('.text_avatar').hide()
      
   }else{
      // 2.2渲染文字头像
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text_avatar').html(first).show()
   }

}