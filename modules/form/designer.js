var Designer = {};

$('.gridly').gridly({
    base: 60,
    gutter: 20,
    columns: 12,
    draggable: {
        zIndex: 800,
        selector: '> *'
    }
});

// openProperties();

function openProperties() {
    layui.layer.open({
        type: 1,
        title: "控件属性"
        , area: ['250px', '400px']
        , offset: 'r' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        , id: 'properties' //防止重复弹出
        , content: '<div id="component-properties" class="layui-form layui-form-pane"> </div>'
        , btn: '删除'
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , yes: function () {
            removeComponent(nowEditComponent.id);
            layer.closeAll();
        }
    });
}

var nowEditComponent;

function addComponent(type) {
    var id = md5(new Date().getTime() + "" + Math.random());
    var component = Designer.createComponent(type, id);
    var html = component.render();
    $('.gridly').append(html);
    $('.gridly').gridly();
    html.on('click', function () {
        initPropertiesEditor(component);
        $(".brick").find(".layui-form-label,legend").css("border", "");
        $(this).find(".layui-form-label,legend").css("border", "1px solid red");
        layui.form.render();
        nowEditComponent = component;
    });
    html.click();
    initPropertiesEditor(component);
}

function removeComponent(id) {
    var component = Designer.components[id];
    if (component) {
        component.remove();
    }
    $('.gridly').gridly();
}

function saveProperties() {

}

function initPropertiesEditor(component) {
    openProperties();
    var editors = component.editors;
    saveProperties();
    var html = $("#component-properties");
    html.children().remove();
    var properties = component.properties;
    $(editors).each(function () {
        var me = this;
        var propertyOld = properties[this.id];
        var c = $("<div class=\"layui-form-item\">");
        var label = $("<label class=\"layui-form-label\">");
        var inputContainer = $("<div class=\"layui-input-block\">");
        var input = $("<input type=\"text\" name=\"identity\" class=\"layui-input\">");
        label.text(this.text);
        if (propertyOld) {
            input.val(propertyOld.value);
        } else {
            component.setProperty({id: me.id, value: this.value});
        }
        input.on("change", function () {
            component.setProperty({id: me.id, value: input.val()});
            layui.form.render();
        });
        c.append(label).append(inputContainer.append(input));
        html.append(c);
    });

}

function test(e) {
    console.log(e);
}