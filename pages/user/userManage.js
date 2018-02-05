define([ "request", "hsForm", "hsTable"], function (request, hsForm, hsTable) {

    function openSaveWindow(data) {
        require(["text!pages/user/save.hf"], function (templateJSON) {
            hsForm.openForm({
                template: JSON.parse(templateJSON),
                data: data,
                onSubmit: function (form) {
                    console.log(form);
                    return true;
                }
            });
        })
    }

    function init(containerId) {
        var id = "table" + new Date().getTime();

        hsTable.init(id, containerId, "user", [[
            {field: 'username', title: "用户名", sort: true},
            {field: 'name', title: "姓名"},
            {
                field: 'status', title: "状态", sort: true, templet: "<script type='text/html'><input type=\"checkbox\" {{d.status===1?'checked':''}} name=\"status\" title=\"有效\" /></script>"
            },
            {
                title: "操作", toolbar: "<script type='text/html'>" +
            "<button lay-event=\"edit\" class='layui-btn layui-btn-sm'><i class=\"layui-icon\">&#xe642;</i>编辑</button>" +
            "<button lay-event=\"edit_permission\" class='layui-btn layui-btn-normal layui-btn-sm'>" +
            "<i class=\"layui-icon\">&#xe614;</i> 设置权限</button>" +
            "</script>"
            }
        ]], {
            btns: [{
                name: '新建',
                class: '',
                callback: function () {
                    openSaveWindow();
                }
            }],
            search: [{
                label: '用户名',
                column: 'username',
                type: 'input'
            }, {
                label: '姓名',
                column: 'name',
                type: 'input'
            }]
        });
        var defPWD = Math.random();
        layui.table.on("tool(" + containerId + ")", function (e) {
            var data = e.data;
            var layEvent = e.event;
            if (layEvent === 'edit') {
                data.password = defPWD;
                data.status = "1";
                openSaveWindow(data);
            }
            console.log(e);
        })
    }

    return {init:init}
});
