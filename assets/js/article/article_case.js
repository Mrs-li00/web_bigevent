$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCaseList()
    // 获取文章分类的列表
    function initArtCaseList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
            //    console.log(res);
               var htmlStr = template('tpl_table', res)
               $('tbody').html(htmlStr)

            }
        })
    }

    // 为添加类别按钮添加点击事件
    var index = null
    $('#btn_case').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog_add').html()
        });     
    })

    // 为表单监听提交事件
    $('body').on('submit','#form_add', function(e) {
         e.preventDefault()
         $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
               if(res.status !== 0) {
                   return layer.msg('新增文章分类失败')
               }
               layer.msg('新增文章分类成功')
               initArtCaseList()
               layer.close(index) 
            }
        })
    })

    // 为编辑按钮添加点击事件
    var indexEdia = null
    $('tbody').on('click','.btn_edia', function() {
        // console.log('ok');
        indexEdia = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog_edia').html()
        });   
        
        var id = $(this).attr('data-id')
        // 发起请求获取对应的数据
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form_edia', res.data)
            }
        })
    })

    $('body').on('submit', '#form_edia', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdia)
                initArtCaseList() 
            }
        })
    })

    // 为删除按钮添加点击事件
    
    $('body').on('click', '#btn_delete', function() {
        // console.log('ok');
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                meyhod:'GET', 
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCaseList()
                }
            })
        });        
    })
})