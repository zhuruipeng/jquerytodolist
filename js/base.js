

;(function () {
    'use strict';
    var $add_task = $('.add-task');
    var $submit = $('#submit');
    var $delete_task;
    var task_list = {};
    var task_detail = $('.show-detail');
    var $mask_detail = $('.mask-detail');
    var $detali_task;
    var $detail_item = $('.detail-item');
    var $quit;
    var current_index;
    var $updata_form;
    var $task_detail_content;
    var $checkbox_complete;
    var $msg = $('.msg');
    var $msg_content = $msg.find('.msg-content');
    var $msg_confirm = $msg.find('button');
    var $alert = $('.alert');
    var $body = $('body');
    var $window = $(window)
    init();
// alert('abc').then(function (res) {
//     console.log(res);
// })
    /**
     * 重写alert
     */
    function alert(arg) {
        if(!arg){
            console.error('必须有一个标题啊')
        }
        var conf = {}
        , $box, $mask, $title,$content,$confirm,$cancle,dfd,confirmed;
        dfd = $.Deferred();
        $box = $('<div>' +
            '<div class="pop-title"></div>' +
            '<div class="pot-content">123123</div>'+
            '<div class="confirm_cancle"><button class="confirm" type="button">确定</button>' +
            '<button class="cancle" type="button">取消</button></div>'+
            '</div>').css({
            color:'#444',
            width:300,
            height:200,
            background: '#fff',
            position: 'fixed',
            borderRadius:'10px',
            boxShadow:'0,1px,2px rgba(0,0,0.5)',
            textAlign:'center'
        });
        $title= $box.find('.pop-title').css({
            width:20,
            padding:'5px 10px',
            fontWeight:900,
            fontSize:20,
            textAlign:'center'
        })
        $content = $box.find('.pop-content').css({
            padding: '5px 10px',
            textAlign: 'center',
        });
        $confirm = $box.find('.confirm').css({
            position: 'absolute',
            bottom: 0,
            left: 160,
            textAlign: 'center'
        });
        $cancle = $box.find('.cancle').css({
            position: 'absolute',
            bottom: 0,
            left: 100,
            textAlign: 'center'
        });
        $mask = $('<div></div>').css({
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.5)"
        });
        var timer = setInterval(function () {
            if (confirmed !== undefined) {
                dfd.resolve(confirmed)
            }
            clearInterval(timer);
        }, 100);
        $confirm.on('click', function () {
            confirmed = true;
        });
        function adjust_box_position() {
            var window_width = $window.width(),
                window_height = $window.height(),
                box_width = $box.width(),
                box_height = $box.height(),
                move_x, move_y;
            move_x = (window_width - box_width)/2;
            move_y = (window_height - box_height)/2-30;
            $box.css({
                left:move_x,
                top:move_y
            })
        }
        $window.on('resize', function () {
            adjust_box_position();
        });

        if (typeof arg == 'string') {
            conf.title = arg;
        }else {
            conf = $.extend(conf,arg)
        }
        $mask.appendTo($body);
        $box.appendTo($body);
        $window.resize();
        return dfd.promise();
    }
    // render_task_list();
    $submit.on('click', function (e) {
        var new_task = {};
        e.preventDefault();
        var $input = $add_task.find('input[type=text]')
        new_task.content = $input.val();
        if (!new_task.content) {
            return
        };
        if (add_task(new_task)) {
            render_task_list()
        };
        $input.val(' ')
    });
    /**
     * 显示详情
     */
    function  listentask_detali() {
        var index;
        $('.task-item').on('dblclick', function () {
            index = $(this).data('index');
         show_detail(index)
        });
        $detali_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            index = $item.data('index');
            show_detail(index);
        });
       $('.mask-detail').on('click', hide_detail);
       // $quit.on('click',hide_detail)

    }
    function listen_checkbox_complete() {
        $checkbox_complete.on('click',function () {
            var $this = $(this);
           var is_complete = $this.is(':checked');
            var index = $this.parent().parent().data('index');
            var item = get(index);
            if(item.complete){
                updata_task(index, {complete: false});
                // $this.prop('checked', true);
            }else{
                updata_task(index, {complete: true});
                // $this.prop('checked', false);
            }
        })
    }
    function get(index) {
     return store.get('task_list')[index]
    }
    //注册我知道了事件
    function listen_msg_event() {
        $msg_confirm.on('click',function () {
            $alert.get(0).pause();
            hide_msg()
        })
    }
    /**
     * 显示详情
     */
    function show_detail(index) {
        render_task_detail(index);
        $mask_detail.show();
        current_index = index;
        task_detail.show();
        $quit = $('.quit');
        $quit.on('click',hide_detail)
    }
function updata_task(index,data) {
    if(index===undefined ||!task_list[index]) return;
    task_list[index] = $.extend({}, task_list[index], data);
    // task_list[index] = data;
    refresh_tasklist();
    console.log(task_list[index]);
}

    function render_task_detail(index) {
        if (index===undefined||!task_list[index]) return;
        var item = task_list[index];
        var temp = `  
  <form action="">
        <div class="box">
            <div class="detail-item  content">${item.content||""}</div>
            <div><input style="display: none" type="text" value="${item.content}" name="content"></div>
            <div class="quit"><img src="image/退出.png" alt=""></div>
        </div>
        <div class="remind">  
        <textarea name ='desc' value="">${item.desc||''}</textarea>
            <label>
            <div style="color: black">提醒时间 </div>
                <input class="datetime" name="remind" type="text" value="${item.remind_date}">
          </label>
           <button type="submit">更新</button>
        </div>
    </form>  `
      ;
        task_detail.html('');
        task_detail.html(temp);
        $('.datetime').datetimepicker();
        $updata_form = task_detail.find('form');
        $task_detail_content = $updata_form.find('.content');
        $task_detail_content.on('dblclick', function () {
            $updata_form.find('[name=content]').show();
            $task_detail_content.hide();
        });

        $updata_form.on('submit',function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind]').val();
            updata_task(index, data);
            // task_detail.hide();
            hide_detail()
        })
    }

    function hide_detail(index) {

        $mask_detail.hide();
        task_detail.hide();
        // console.log($detail_item);
        // $detail_item.html('1234553454')

    }

    function listen_delete_task() {
        $delete_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var tmp = confirm("确认删除吗？");
            tmp ? delete_task($item.data('index')) : null;
            // console.log(($item.data('index')));
        })
    }

    function add_task(new_task) {
        task_list.unshift(new_task);
        store.set('task_list', task_list);
        return true;
    }

    function refresh_tasklist() {
        store.set('task_list', task_list);
        render_task_list()

    }

    function init() {
        task_list = store.get('task_list') || [];
        listen_msg_event();
        if (task_list.length) {
            render_task_list();
            task_remind_check()
        }
    }

    /**
     * 提醒时间检查
     */
    function  task_remind_check() {
        // show_msg('123')
        var current_timestamp;
        var itl = setInterval(function () {
            for (var i = 0; i <task_list.length ; i++) {
                var item = get(i),task_timestamp;
                // console.log(item);
                if(!item||!item.remind_date||item.informed) continue;
                current_timestamp = (new Date()).getTime();
                task_timestamp = (new Date(item.remind_date)).getTime();
                if (current_timestamp-task_timestamp>=1){
                    updata_task(i, {informed: true});
                    show_msg(item.content)
                }
            }
        },1000)
    }
    function show_msg(content) {
        if(!content) return;
        $msg_content.html(content);
        $alert.get(0).play();
        $msg.show();
        console.log(1);
    }
    function hide_msg() {
        $('.msg').hide()
    }
    //渲染全部模板
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');

        var complete_item = [];
        for (let i = 0; i < task_list.length; i++) {
            var item = task_list[i];
            if (item && item.complete) {
                complete_item[i] = item;
                // console.log(complete_item)
            }
            else
                var $task = render_task_tpl(task_list[i], i);
            $task_list.prepend($task)
        }
        for (var j = 0; j < complete_item.length; j++) {
            $task = render_task_tpl(complete_item[j], j);
            if (!$task) continue;
            $task.addClass('completed');
            $task_list.append($task);

        }
        $delete_task = $('.action.delete');
        $detali_task = $('.action.detail');
        $checkbox_complete = $('.task-item .complete');
        listen_delete_task();
        listentask_detali();
        listen_checkbox_complete();
    }

    /**
     * 渲染单条模板
     * @param data
     * @param index
     * @returns {jQuery.fn.init|jQuery|HTMLElement}
     */
    function render_task_tpl(data, index) {
        if (!data || index === undefined) return;
        var list_item_tpl = `
        <li class="task-item" data-index =${index}>
            <span><input type="checkbox" class="complete" ${(data.complete)?'checked':''}> 
            </span>
            <span class="task-content">${data.content}</span>
            <div class="float-right">
            <span class="action delete"> 删除</span>
            <span class="action detail"> 详情</span>
            </div>

        </li>`;
        return $(list_item_tpl)
    }
    function delete_task(index) {
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        refresh_tasklist()
    }
})();
