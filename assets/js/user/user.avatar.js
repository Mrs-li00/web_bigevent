$(function() {
     // 1.1 获取裁剪区域的 DOM 元素
 var $image = $('#image')
 // 1.2 配置选项
 const options = {
   // 纵横比
   aspectRatio: 1,
   // 指定预览区域
   preview: '.img-preview'
 }

 // 1.3 创建裁剪区域
 $image.cropper(options)

 $("#btnChooseImage").on('click', function() {
    $('#file').click()
 })

 $('#file').on('change', function(e) {
    //  console.log(e);
    var fileList = e.target.files
    if(fileList.length === 0) {
       return layui.layer.msg('请选择照片')
    }
    var file = e.target.files[0]
    var newImgUrl = URL.createObjectURL(file)
    $('#image').cropper('destroy').attr('src', newImgUrl).cropper(options)
 })

 $('#btnUpload').on('click', function() {
    //  1.获取用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2.上传到服务器
    $.ajax({
        method:'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('更换头像失败')
            }
            layui.layer.msg('更换头像成功')
            window.parent.getUserInfo()
        }
    })
 })
})

