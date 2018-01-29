layui.define(["jquery", "element", "request", "form"], function (exports) {
    var element = layui.element,
        $ = layui.jquery,
        request = layui.request,
        form = layui.form;

    function init(ele, params) {
        if (ele) {
            //默认配置
            var config = {
                value: 'id',
                text: 'name',
                data: 'result.data',
            }
            var opt = $.extend({}, config, {
                type: $(ele).attr('hs-type'),
                url: $(ele).attr('hs-url'),
                value: $(ele).attr('hs-value'),
                text: $(ele).attr('hs-value'),
                data: $(ele).attr('hs-data'),
                name: $(ele).attr('hs-name'),
                selected: $(ele).attr('hs-selected'),
            });

            console.log(opt);

            //select
            if (opt.type == 'select' && opt.url) {
                opt.options = [];
                request.get(opt.url, function (e) {
                    console.log(e);
                    if (e.status === 200) {
                        layui.get(e,opt.data).forEach(function (item) {
                            opt.options.push({
                                text: layui.get(item,opt.text),
                                value: layui.get(item,opt.value)
                            })
                        });
                        console.log(opt.options);
                        //拼装
                        var formSelect = $('<select></select>').attr('name',opt.name);
                        formSelect.append($('<option></option>'));
                        opt.options.forEach(function(item) {
                            var optItem = $('<option></option>').text(item.text).attr('value',item.value);
                            if(opt.selected && opt.selected == item.value){
                                optItem.attr('selected',true);
                            }
                            formSelect.append(optItem);
                        });
                        $(ele).after(formSelect).remove();
                        form.render();
                    }
                });
            }

        }
    }

    var e = {
        init: init
    };

    exports("hsForm", e);
});