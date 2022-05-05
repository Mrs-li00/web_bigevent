$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 获取文章分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                // layer.msg('获取文章分类成功')
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

     // 1. 初始化图片裁剪器
     var $image = $('#image')
     
     // 2. 裁剪选项
     var options = {
       aspectRatio: 400 / 280,
       preview: '.img-preview'
     }
     
     // 3. 初始化裁剪区域
     $image.cropper(options)

    // 为选择封面按钮绑定一个点击事件
    $('#btn_choose').on('click',function() {
       $('#file').click() 
    })

    // 为隐藏的文件选择框绑定一个change事件
    $('#file').on('change', function(e) {
        // console.log(e);
        var files = e.target.files
        if(files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)      
    })

    // 定义文章的发布状态
    var art_status = '发布'

    $('#btn_save').on('click', function() {
        art_status= '草稿'
    })

    // 为表单监听submit事件
    $('#form_pub').on('submit', function(e) {
        e.preventDefault()
        // 基于form表单,快速创建一个formData 对象
        var fd = new FormData($(this)[0])
        // console.log(fd);
        fd.append('status', art_status)

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { 
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将文件存放到 fd 中
            fd.append('cover_img', blob)
            // 发起 ajax请求,向服务器提交数据
            publishArticle(fd)
        })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/article_list.html'
            }
        })
    }
})