define(["request", "hsForm", "hsTable"], function (request, hsForm, hsTable) {

    function init(containerId) {
        var id = "table" + new Date().getTime();
        var table;
        //打开编辑窗口
        function openSaveWindow(data,openCallback,submitCallback){
            var dataId = data ? data.id : "";
            require(["text!pages/form/save.html"], function (html) {
                hsForm.openForm({
                    title: "编辑表单",
                    area: ["1000px", "400px"],
                    template: {html: html, components: []},
                    data: data,
                    onOpen: function (formEl, ready) {
                        request.get(window.API_BASE_PATH + '/datasource',function (data) {
                            var select = $('select[name="dataSourceId"]')
                            console.info(data)
                            ready()
                        })

                        $('[data-select-id="add-column-btn"]').unbind('click')
                        $('[data-select-id="add-column-btn"]').click(function () {
                            require(["text!pages/form/saveColumns.html"],function (html) {
                                hsForm.openForm({
                                    title: "添加字段",
                                    area: ["600px", "400px"],
                                    template: {html: html, components: []},
                                    data: null,
                                    onOpen: null,
                                    onSubmit: function (data) {
                                        var value = JSON.parse($('input[name="columns"]').val())
                                        value.push(data)
                                        $('input[name="columns"]').val(JSON.stringify(value))
                                        var tr = $('<tr></tr>')
                                        tr.append('<td>'+data.name+'</td>')
                                        tr.append('<td>'+data.columnName+'</td>')
                                        tr.append('<td>'+data.alias+'</td>')
                                        tr.append('<td>'+data.describe+'</td>')
                                        tr.append('<td>'+data.jdbcType+'</td>')
                                        tr.append('<td>'+data.javaType+'</td>')
                                        tr.append('<td>'+data.length+'</td>')
                                        tr.append('<td><button class="layui-btn layui-btn-danger layui-btn-xs"><i class="layui-icon">&#x1006;</i></button></td>')
                                        $('[data-select-id="field-table-body"]').append(tr)
                                    }
                                });
                            })
                        })
                        if(openCallback) openCallback();
                    },
                    onSubmit: submitCallback
                });
            })
        }

        function edit(data) {
            openSaveWindow(data)
        }

        table = hsTable.init(id, containerId, "/dynamic/form", [[
            {field: 'id', title: "", sort: true, width: "10%"},
            {field: 'type ', title: "表单类型", width: "10%"},
            {field: 'databaseTableName', title: "物理表名", width: "20%"},
            {field: 'alias', title: "别名", width: "20%"},
            {field: 'version', title: "版本", width: "10%"},
            {
                field: 'deployed', title: "发布状态", sort: true,width:"20%", templet: "<script type='text/html'>" +
            "<input type=\"checkbox\"  lay-skin=\"switch\" value=\"{{d.id}}\" lay-text=\"有效|无效\" {{d.deployed===true?'checked':''}} lay-filter=\"form_deployed\" name=\"deployed\" />" +
            "</script>"
            },
            {
                title: "操作", align: "center", width: "10%", toolbar: "<script type='text/html'>" +
                "<button lay-event=\"edit\" class='layui-btn layui-btn-sm'><i class=\"layui-icon\">&#xe642;</i>编辑</button>" +
                "</script>"
            }
        ]], {
            btns: [{
                name: '新建',
                class: '',
                callback: function () {
                    openSaveWindow(null,null,function (formData,formEl) {
                        console.info(formData)
                    })
                }
            }],
            search: [{
                label: '标识',
                column: 'id',
                type: 'input'
            }, {
                label: '名称',
                column: 'name',
                type: 'input'
            }]
        });

        layui.form.on('switch(form_deployed)', function (obj) {
            var id = this.value;
            var state = obj.elem.checked;
            var url = state ? 'dynamic/form/' + id + '/deploy':'dynamic/form/' + id + '/un-deploy'
            request.put(url,{},function (resp) {
                if (resp.status !== 200) {
                    layer.alert("提交失败:" + resp.message);
                } else {
                    layer.tips("动态表单已" + (state ? "发布" : "取消发布"), obj.othis, {time: 1000});
                }
            })
        });

        layui.table.on("tool(" + containerId + ")", function (e) {
            var data = e.data;
            var layEvent = e.event;
            if (layEvent === 'edit') {
                edit(data);
            }
        })
    }

    return {init:init}
})