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
                id: "size",
                editor: "radio",
                text: "控件大小",
                value: "6",
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

    var Component = function () {
        this.config = {};
        this.events = {};
        this.properties = {};
        this.editors = [];

    };
    Component.prototype.on = function (event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    };
    Component.prototype.un = function (event) {
        this.events[event] = [];
        return this;
    };
    Component.prototype.getEditors = function () {

    };
    Component.prototype.setProperty = function (property) {
        this.properties[property.id] = property;
        if (this.events["propertiesChanged"]) {
            $(this.events["propertiesChanged"]).each(function () {
                var event = this;
                event(property);
            });
        }
        return this;
    };
    Component.prototype.setProperties = function (properties) {
        var me = this;
        $(properties).each(function () {
            me.setProperty(this);
        });
        return this;
    };
    Component.prototype.render = function () {

    };
    Component.prototype.bind = function (el) {
        $(el).children().remove();

        $(el).append(this.render());
    };
    Component.prototype.getContainer = function (newFunc) {
        var container;
        if (!this.container) {
            if (this.id) {
                container = $("[hs-id='" + this.id + "']");
                if (container.length === 0) {
                    this.container = container = newFunc();
                    this.container.attr("hs-id", this.id);
                }
            }
        } else {
            return this.container;
        }
        return container;
    };
    Component.prototype.init = function () {
    };
    Component.prototype.remove = function () {
        this.getContainer(function () {
            return $();
        }).remove();
    };

    function createClass(O) {
        (function () {
            // 创建一个没有实例方法的类
            var Super = function () {
            };
            Super.prototype = Component.prototype;
            //将实例作为子类的原型
            O.prototype = new Super();
            O.type="基础控件";
        })();
    }

    /**文本输入框**/
    {
        function TextBox(id) {
            Component.call(this);
            this.id = id;
            this.editors = createDefaultEditor();
            this.properties["comment"] = {id: "comment", value: "输入框"};
        }

        createClass(TextBox);

        TextBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-xs6'>");
                var c = $("<div class=\"layui-form-item brick\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var input = $("<input type=\"text\"  class=\"layui-input\">");
                label.text("输入框");
                c.append(label).append(inputContainer.append(input));
                m.append(c);
                return m;
            });
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    if (e.id === 'size') {
                        container.removeClass();
                        container.addClass("layui-col-xs" + e.value);
                    }
                    if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else {
                        container.find("input").attr(e.id, e.value);
                    }
                });
            return container;
        };

        Designer.registerComponent("textbox", TextBox);
    }
    /**文本域**/
    {
        function TextArea(id) {
            Component.call(this);
            this.id = id;
            this.editors = createDefaultEditor();
            this.properties["comment"] = {id: "comment", value: "多行文本"};
        }

        createClass(TextArea);
        TextArea.prototype.render = function () {

            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-xs12'>");
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
                .on('propertiesChanged', function (e) {
                    if (e.id === 'size') {
                        container.removeClass();
                        container.addClass("layui-col-xs" + e.value);
                    }
                    if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else {
                        container.find("input").attr(e.id, e.value);
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
            this.editors = createDefaultEditor();
            this.editors.push({
                id: "data",
                text: "选项",
                value: "选项1,选项2"
            });
        }

        createClass(CheckBox);

        CheckBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-xs4'>");
                var c = $("<div class=\"layui-form-item brick\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var checkbox1 = $("<input type=\"checkbox\" name='checkbox[1]' title='选项1'>");
                var checkbox2 = $("<input type=\"checkbox\" name='checkbox[2]' title='选项2'>");
                label.text("新建多选");
                c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                return m.append(c);
            });
            var me = this;
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    function initData(data) {
                        var inputParent = container.find(".layui-input-block");
                        inputParent.children().remove();
                        if (!data) {
                            return;
                        }
                        data = data.split(",");
                        $(data).each(function () {
                            var option = $("<input type=\"checkbox\"  title='选项1'>");
                            var name = me.id;
                            if (me.properties['name'] && me.properties['name'].value) {
                                name = me.properties['name'].value;
                            }
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

                    if (e.id === 'size') {
                        container.removeClass();
                        container.addClass("layui-col-xs" + e.value);
                    }
                    else if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else if (e.id === 'data') {
                        initData(e.value);
                    } else if (e.id === 'name') {
                        if (me.properties['data']) {
                            initData(me.properties['data'].value);
                        }
                    } else {
                        container.find("input").attr(e.id, e.value);
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
            this.editors = createDefaultEditor();
            this.editors.push({
                id: "data",
                text: "选项",
                value: "选项1,选项2"
            });
        }

        createClass(RadioBox);

        RadioBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-xs4 layui-col-md4'>");
                var c = $("<div class=\"layui-form-item brick\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var checkbox1 = $("<input type=\"radio\" name='radio[1]' title='选项1'>");
                var checkbox2 = $("<input type=\"radio\" name='radio[2]' title='选项2'>");
                label.text("新建单选");
                c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                return m.append(c);
            });
            var me = this;
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    function initData(data) {
                        var inputParent = container.find(".layui-input-block");
                        inputParent.children().remove();
                        if (!data) {
                            return;
                        }
                        data = data.split(",");
                        $(data).each(function () {
                            var option = $("<input type=\"radio\"  title='选项1'>");
                            var name = me.id;
                            if (me.properties['name'] && me.properties['name'].value) {
                                name = me.properties['name'].value;
                            }
                            var value = this;
                            var text = this;
                            if (value.indexOf(":") !== -1) {
                                var vt = value.split(":");
                                text = vt[0];
                                value = vt[1];
                            }
                            option.attr({
                                name: name,// + "[" + value + "]",
                                title: text,
                                value: value
                            });
                            inputParent.append(option);
                        });
                    }

                    if (e.id === 'size') {
                        container.removeClass();
                        container.addClass("layui-col-xs" + e.value);
                    }
                    else if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else if (e.id === 'data') {
                        initData(e.value);
                    } else if (e.id === 'name') {
                        if (me.properties['data']) {
                            initData(me.properties['data'].value);
                        }
                    } else {
                        container.find("input").attr(e.id, e.value);
                    }
                });
            return container;
        };
        Designer.registerComponent("radio", RadioBox);
    }
})();