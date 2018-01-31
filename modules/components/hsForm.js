layui.define(["jquery", "element", "request", "form"], function (exports) {
    var element = layui.element,
        request = layui.request,
        form = layui.form;

    function init(ele) {
        //读取配置

        //判断是哪种


        //ele方式
        if (ele && typeof ele == "string") {

            var ELE_OBJ = $(ele),
                FORM_TYPE = ELE_OBJ.attr('hs-type');


            if (FORM_TYPE == 'hsSelect' && $(ele).attr('hs-url')) {
                //select通过url形式
                //默认配置
                // 参数说明
                // type        类型
                // value       返回数据取值value的key
                // text        返回数据取值text的key
                // data        数据格式的位置
                // url         地址
                // selected    默认选中项的id
                // name        input的name

                var config = {
                    value: 'id',
                    text: 'name',
                    data: 'result.data',
                };

                var opt = $.extend({}, config, {
                    type: $(ele).attr('hs-type'),
                    value: $(ele).attr('hs-value'),
                    text: $(ele).attr('hs-text'),
                    data: $(ele).attr('hs-data'),
                    name: $(ele).attr('hs-name'),
                    url: $(ele).attr('hs-url'),
                    selected: $(ele).attr('hs-selected'),
                });
                opt.options = [];
                request.get(opt.url, function (e) {
                    // console.log(e);
                    if (e.status === 200) {
                        layui.get(e, opt.data).forEach(function (item) {
                            opt.options.push({
                                text: layui.get(item, opt.text),
                                value: layui.get(item, opt.value)
                            })
                        });
                        //拼装
                        var obj = renderSelect(opt);
                        $(ele).after(obj).remove();
                        form.render();
                    }
                });
            } else if (FORM_TYPE == 'hsSelectTree') {
                //selectTree
                //默认配置
                // 参数说明
                // type        类型
                // idKey       ID的Key
                // pIdKey      pId的Key
                // nameKey     name的Key
                // data        数据格式的位置
                // url         地址
                // selected    默认选中项的id
                // name        input的name

                var config = {
                    idKey: 'id',
                    pIdKey: 'parentId',
                    nameKey: 'name',
                    data: 'result.data',
                };

                var opt = $.extend({}, config, {
                    type: $(ele).attr('hs-type'),
                    idKey: $(ele).attr('hs-idKey'),
                    pIdKey: $(ele).attr('hs-pIdKey'),
                    nameKey: $(ele).attr('hs-nameKey'),
                    data: $(ele).attr('hs-data'),
                    name: $(ele).attr('hs-name'),
                    url: $(ele).attr('hs-url'),
                    selected: $(ele).attr('hs-selected'),
                });
                opt.options = [];
                request.get(opt.url, function (e) {
                    console.log(e);
                    if (e.status === 200) {
                        layui.get(e, opt.data).forEach(function (item) {
                            opt.options.push({
                                id: layui.get(item, opt.idKey),
                                name: layui.get(item, opt.nameKey),
                                pId: layui.get(item, opt.pIdKey),
                            })
                        });
                        console.log(opt.options);
                        //拼装
                        var obj = renderSelectTree(opt);
                        $(ele).after(obj).remove();
                    }
                });
            }

        } else if (param) {    //参数形式
            // selectTree
            if (param.type == 'hsSelectTree') {

            }
        }
    }

    function hsFormat(data) {
        for (x in data) {
            console.log(x);
        }
    }

    //渲染select
    function renderSelect(opt) {
        var formSelect = $('<select></select>').attr('name', opt.name);
        formSelect.append($('<option></option>'));
        opt.options.forEach(function (item) {
            var optItem = $('<option></option>').text(item.text).attr('value', item.value);
            if (opt.selected && opt.selected == item.value) {
                optItem.attr('selected', true);
            }
            formSelect.append(optItem);
        });
        return formSelect;
    }

    //渲染selectTree
    function renderSelectTree(opt) {
        var treeSelect = $('<div class="hs-tree-select"></div>');
        var tree = $('<ul class="ztree layui-anim layui-anim-upbit"></ul>');
        var input = $('<input type="text" placeholder="请选择" readonly class="layui-input">');
        var inputHide = $('<input type="text" readonly style="display: none;">').attr('name', opt.name);
        var title = $('<div class="hs-select-title"></div>').append(input).append(inputHide).append($('<i class="layui-edge"></i>'));
        treeSelect.append(title);
        treeSelect.append(tree);

        title.on('click',function () {
            treeSelect.hasClass('expanded') ? (
                hideDown()
            ) : (
                showDown()
            );
            return false;
        });

        function hideDown(choose) {
            treeSelect.removeClass('expanded');
        }
        function showDown(choose) {
            treeSelect.addClass('expanded');
        }

        $(document).on('click', hideDown);

        //ztree
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };

        var treeObj = $.fn.zTree.init(tree, setting, opt.options);
        treeObj.expandAll(true);

        function zTreeOnClick(event, treeId, treeNode) {
            console.log(JSON.stringify(treeNode));
            input.val(treeNode.name);
            inputHide.val(treeNode.id);
        };

        return treeSelect;
    }

    var e = {
        init: init,
        format: hsFormat,
    };

    exports("hsForm", e);
});