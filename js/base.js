

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
    init();

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
    if(!index ||!task_list[index]) return;
    // task_list[index] = $.merge({}, task_list[index], data);
    task_list[index] = data;
    refresh_tasklist();
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
                <input name="remind" type="date" value="${item.remind_date}">
            </label>
           <button type="submit">更新</button>
        </div>
    </form>  `
      ;
        task_detail.html('');
        task_detail.html(temp);
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
            updata_task(index,data)
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
        if (task_list.length) {
            render_task_list();
        }
    }

    //渲染全部模板
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html(null);
        for (let i = 0; i < task_list.length; i++) {
            var $task = render_task_tpl(task_list[i], i);
            $task_list.append($task)
        }
        $delete_task = $('.action.delete');
        $detali_task = $('.action.detail');
        listen_delete_task();
        listentask_detali();
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
            <span><input type="checkbox">
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
