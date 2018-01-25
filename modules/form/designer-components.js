(function () {
    var Designer = window.Designer;

    function createDefaultEditor() {
        return [
            {
                id: "name",
                editor: "textbox",
                text: "名称",
                value: ""
            }, {
                id: "comment",
                editor: "textbox",
                text: "描述",
                value: "新建控件"
            }, {
                id: "placeholder",
                editor: "textbox",
                text: "提示",
                value: ""
            }, {
                id: "size",
                editor: "radio",
                text: "控件大小",
                value: "6",
                data: [
                    {text: "大", value: 'large'},
                    {text: "小", value: 'small'}
                ]
            }, {
                id: "mdSize",
                editor: "radio",
                text: "移动端大小",
                value: "12",
                data: [
                    {text: "大", value: 'large'},
                    {text: "小", value: 'small'}
                ]
            },

            {
                id: "required",
                editor: "radio",
                text: "是否必填",
                value: "false",
                data: [
                    {text: "是", value: true},
                    {text: "否", value: false}
                ]
            }
        ];
    }

    function createClass(O, name) {
        (function () {
            // 创建一个没有实例方法的类
            var Super = function () {
            };
            Super.prototype = Component.prototype;
            //将实例作为子类的原型
            O.prototype = new Super();
            O.type = name || "基础控件";
        })();
    }

    /**基础组件**/
    {
        /**fieldset**/
        {
            function FieldSet(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.removeProperty("placeholder");
                this.removeProperty("name");
                this.removeProperty("required");
                this.getProperty("comment").value = "分割";
                this.getProperty("size").value = "12";
            }

            createClass(FieldSet);

            FieldSet.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md12'>");
                    var c = $("<fieldset class=\"brick layui-elem-field layui-field-title site-title\">");
                    var label = $("<legend>").text("分割");
                    c.append(label);
                    m.append(c);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (key, value) {
                        if (key === 'comment') {
                            container.find("legend").text(value);
                        } else {
                            container.find("legend").attr(key, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("fieldset", FieldSet);
        }

        /**文本输入框**/
        {
            function TextBox(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.getProperty("comment").value = "单行文本";
            }

            createClass(TextBox);

            TextBox.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md6'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var input = $("<input type=\"text\"  class=\"layui-input\">");
                    label.text("单行文本");
                    c.append(label).append(inputContainer.append(input));
                    m.append(c);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("textbox", TextBox);
        }

        /**密码**/
        {
            function Password(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.getProperty("comment").value = "密码";
            }

            createClass(Password);

            Password.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md6'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var input = $("<input type=\"password\"  class=\"layui-input\">");
                    label.text("密码");
                    c.append(label).append(inputContainer.append(input));
                    m.append(c);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("password", Password);
        }

        /**文本域**/
        {
            function TextArea(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.getProperty("comment").value = "多行文本";
            }

            createClass(TextArea);
            TextArea.prototype.render = function () {

                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md12'>");
                    var c = $("<div class=\"layui-form-text layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var input = $("<textarea  class=\"layui-textarea\"></textarea>");
                    label.text("多行文本");
                    c.append(label).append(inputContainer.append(input));
                    m.append(c);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };
            Designer.registerComponent("textarea", TextArea);
        }

        /**多选**/
        {
            function CheckBox(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.getProperty("comment").value = "多选";
                this.removeProperty("placeholder");
                this.properties.push({
                    id: "skin",
                    text: "类型",
                    value: ""
                });
                this.properties.push({
                    id: "data",
                    text: "选项",
                    value: "选项1,选项2"
                });
            }

            createClass(CheckBox);

            CheckBox.prototype.render = function () {
                var me = this;
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md6'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var checkbox1 = $("<input type=\"checkbox\" name='" + me.id + "[1]' title='选项1'>");
                    var checkbox2 = $("<input type=\"checkbox\" name='" + me.id + "checkbox[2]' title='选项2'>");
                    label.text("多选");
                    c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                    return m.append(c);
                });

                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        function initData() {
                            var inputParent = container.find(".layui-input-block");
                            inputParent.children().remove();
                            var data = me.getProperty("data").value;
                            if (!data) {
                                return;
                            }
                            var name = me.getProperty("name").value;
                            if (!name) {
                                name = me.id;
                            }
                            var skin = me.getProperty("skin").value;

                            data = data.split(",");
                            $(data).each(function () {
                                var option = $("<input type=\"checkbox\" lay-skin='" + skin + "' title='选项1'>");
                                var value = this;
                                var text = this;
                                if (value.indexOf(":") !== -1) {
                                    var vt = value.split(":");
                                    text = vt[0];
                                    value = vt[1];
                                }
                                option.attr({
                                    name: name + "[" + value + "]",
                                    title: text
                                });
                                inputParent.append(option);
                            });
                        }

                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else if (name === 'name' || name === 'data' || name === 'skin') {
                            initData();
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("checkbox", CheckBox);
        }

        /**单选**/
        {
            function RadioBox(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.getProperty("comment").value = "单选";
                this.removeProperty("placeholder");
                this.properties.push({
                    id: "data",
                    text: "选项",
                    value: "选项1,选项2"
                });
            }

            createClass(RadioBox);

            RadioBox.prototype.render = function () {
                var me = this;
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-xs4 layui-col-md4'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var checkbox1 = $("<input type=\"radio\" name='" + me.id + "' title='选项1'>");
                    var checkbox2 = $("<input type=\"radio\" name='" + me.id + "' title='选项2'>");
                    label.text("单选");
                    c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                    return m.append(c);
                });

                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        function initData() {
                            var inputParent = container.find(".layui-input-block");
                            inputParent.children().remove();
                            var data = me.getProperty("data").value;
                            if (!data) {
                                return;
                            }
                            var name = me.getProperty("name").value;
                            if (!name) {
                                name = me.id;
                            }
                            data = data.split(",");
                            $(data).each(function () {
                                var option = $("<input type=\"radio\"  title='选项1'>");
                                var value = this;
                                var text = this;
                                if (value.indexOf(":") !== -1) {
                                    var vt = value.split(":");
                                    text = vt[0];
                                    value = vt[1];
                                }
                                option.attr({
                                    name: name,
                                    title: text
                                }).val(value);
                                inputParent.append(option);
                            });
                        }


                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else if (name === 'name' || name === 'data') {
                            initData();
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };
            Designer.registerComponent("radio", RadioBox);
        }

        /**下拉列表**/
        {
            function Combobox(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.properties.push({
                    id: "data",
                    text: "选项",
                    value: "选项1,选项2"
                });
            }

            createClass(Combobox);

            Combobox.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-xs4'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var select = $("<select>");

                    var option1 = $("<option selected value='1'>").text("选项1");
                    var option2 = $("<option value='2'>").text("选项2");
                    select.append(option1).append(option2);
                    label.text("下拉列表");
                    c.append(label).append(inputContainer.append(select));
                    return m.append(c);
                });
                var me = this;
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        function initData() {
                            var inputParent = container.find("select");
                            inputParent.children().remove();
                            var data = me.getProperty("data").value;
                            if (!data) {
                                return;
                            }
                            data = data.split(",");
                            var name = me.getProperty("name").value;
                            if (!name) {
                                name = me.id;
                            }
                            inputParent.attr("name", name);
                            $(data).each(function () {
                                var option = $("<option title='选项1'>");
                                var value = this;
                                var text = this;
                                if (value.indexOf(":") !== -1) {
                                    var vt = value.split(":");
                                    text = vt[0];
                                    value = vt[1];
                                }
                                option.attr({
                                    value: value
                                });
                                option.text(text);
                                inputParent.append(option);
                            });
                        }

                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else if (name === 'data' || name === 'data') {
                            initData();
                        } else {
                            container.find("select").attr(name, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("combobox", Combobox);
        }

        /**日期选择**/
        {
            function Datepicker(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.properties.push({
                    id: "format",
                    editor: "textbox",
                    text: "日期格式",
                    value: "yyyy-MM-dd"
                });
                this.getProperty("comment").value = "日期输入";
            }

            createClass(Datepicker);

            Datepicker.prototype.render = function () {
                var me = this;
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-xs6'>");
                    var c = $("<div class=\"layui-form-item brick\">");
                    var label = $("<label  class=\"layui-form-label\">");
                    var inputContainer = $("<div class=\"layui-input-block\">");
                    var input = $("<input type=\"text\"  class=\"layui-input date-picker\">");
                    label.text("日期输入");
                    c.append(label).append(inputContainer.append(input));
                    m.append(c);
                    layui.laydate.render({elem: input[0]});
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (name, value) {
                        function reloadInput() {
                            var input = container.find(".date-picker");
                            var newInput = $("<input type=\"text\"  class=\"layui-input date-picker\">");
                            input.replaceWith(newInput);
                            var format = me.getProperty("format");
                            newInput.attr("format", format);
                            if (format.value) {
                                layui.laydate.render({elem: newInput[0], format: format.value});
                            }
                        }

                        if (name === 'format') {
                            reloadInput();
                        }
                        if (name === 'comment') {
                            container.find("label").text(value);
                        } else {
                            container.find("input").attr(name, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("datepicker", Datepicker);
        }
    }

    /**高级组件**/

    {
        /**选项卡**/
        {
            function Tabs(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.removeProperty("placeholder");
                this.removeProperty("name");
                this.removeProperty("required");
                this.getProperty("comment").value = "选项卡";
                this.getProperty("size").value = "12";
            }

            createClass(Tabs, "高级组件");

            Tabs.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md12 brick'>");
                    var c = $("<div class=\"layui-tab\" >");
                    var title = $("<ul class=\"layui-tab-title component-info\">");
                    var content = $("<div class=\"layui-tab-content\">");
                    title.append("<li class=\"layui-this\">选项卡1</li>")
                        .append("<li>选项卡2</li>");
                    content
                        .append($("<div style='height: 200px' class=\"layui-tab-item layui-show components\"></div>"))
                        .append($("<div class=\"layui-tab-item nest-components\"></div>"));
                    c.append(title).append(content);
                    m.append(c);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (key, value) {
                        if (key === 'comment') {
                            container.find("legend").text(value);
                        } else {
                            container.find("legend").attr(key, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("tabs", Tabs);
        }

        /**iframe**/
        {
            function Iframe(id) {
                Component.call(this);
                this.id = id;
                this.properties = createDefaultEditor();
                this.properties.push({
                    id: "url",
                    value: "",
                    text: "链接",
                    editor: "textbox"
                });
                this.removeProperty("placeholder");
                this.removeProperty("name");
                this.removeProperty("required");
                this.getProperty("comment").value = "子页面";
                this.getProperty("size").value = "12";
            }

            createClass(Iframe, "高级组件");

            Iframe.prototype.render = function () {
                var container = this.getContainer(function () {
                    var m = $("<div class='layui-col-md12 brick'>");
                    var c = $("<fieldset class='layui-elem-field'>").append($("<legend>").text("子页面"));

                    var f = $("<iframe frameborder='0' class=\"layui-tab\">");
                    f.css({
                        width: "100%",
                        height: "200px"
                    });
                    m.append(c);
                    c.append(f);
                    return m;
                });
                this.un("propertiesChanged")
                    .on('propertiesChanged', function (key, value) {
                        if (key === 'url') {
                            container.find("iframe").attr("src",value);
                        }
                        if (key === 'comment') {
                            container.find("legend").text(value);
                        } else {
                            container.find("iframe").attr(key, value);
                        }
                    });
                return container;
            };

            Designer.registerComponent("iframe", Iframe);
        }
    }
})();