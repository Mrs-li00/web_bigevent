$(function() {
    // 定义一个查询参数对象,将来请求数据的时候,需要将参数对象提交至服务器
   var layer = layui.layer
   var form = layui.form
   var laypage = layui.laypage


//    定义美化时间的过滤器
   template.defaults.imports.dataForman = function(date) {
      var dt = new Date(date)

      const y = dt.getFullYear()
      const m =  padZero(dt.getMonth() + 1)
      const d =  padZero(dt.getDate())

      const hh =  padZero(dt.getHours())
      const mm =  padZero(dt.getMinutes())
      const ss =  padZero(dt.getSeconds())
      return y + '-' + m + '-' +d +'-' +' ' +hh +':' +mm +':' +ss
   }
//    定义补0函数
    function  padZero(n) {
        return n > 9? n : '0'+ n
    }
    
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    initTable()
    initCate()
    // 获取文章的列表数据
    function initTable() {
       $.ajax({
           method: 'GET',
           url: '/my/article/list',
           data: q,
           success: function(res) {
                if(res.status !== 0) {
                   return layer.msg('获取文章列表失败')
                }
                // console.log(res);
                // layer.msg('获取文章列表成功') 
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
       })
    }

    // 初始化文章分类的方法
    function initCate() {
       $.ajax({
           method: 'GET',
           url: '/my/article/cates',
           success: function(res) {
               if(res.status !== 0) {
                   return layer.msg('获取分类数据失败')
               }
               //    渲染文章分类数据
               var htmlStr = template('tpl_cate', res)
            //    console.log(htmlStr);
               $('[name=cate_id]').html(htmlStr)
            //    通过 layui 重新渲染表单ui结构
            form.render()
           }
       })
    }

    // 为筛选表单提供 submit 事件
    $('#form_search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数q 赋值
        q.cate_id = cate_id
        q.state = state

        // 重新获取文章中列表数据
        initTable()
    })

    // 定义渲染分页的函数
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'renderBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            layout: ['count','limit','prev','page','next','skip'],
            limits: [2,5,10,20],

            jump:function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // initTable()
                if(!first) {
                    initTable() 
                }
            }
        })
    }

    // 通过代理形式为删除按钮绑定点击事件
    $('tbody').on('click', '#brn_delete', function() {
        // 获取删除按钮的个数
        var len = $('#brn_delete').length
        // console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
               method: 'GET',
               url: '/my/article/deletecate/' + id,
               success: function(res) {
                  if(res.status !== 0) {
                      return layer.msg('删除失败')
                  }
                  layer.msg('删除成功')
                  if(len === 1) {
                    //   页码值最小必须是1
                    q.pagenum =  q.pagenum === 1? 1 : q.pagenum -1
                   }
                  initTable()
                  layer.close(index);
                }
            })
        });
    })
})