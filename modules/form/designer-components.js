(function () {
    var Designer = window.Designer ? window.Designer : {};
    Designer.components = {};
    var componentsBuilder = {};
    Designer.createComponent = function (type, id) {
        if (componentsBuilder[type]) {
            return Designer.components[id] = componentsBuilder[type](id);
        }
    };

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
                value: "large",
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

    var Component = function (type, config) {
        this.config = config;
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
        })();
    }

    /**文本输入框**/
    {
        function TextBox(id) {
            Component.call(this);
            this.id = id;
        }

        createClass(TextBox);

        TextBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var c = $("<div class=\"hs-textbox layui-form-item brick large\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var input = $("<input type=\"text\"  class=\"layui-input\">");
                label.text("新建输入框");
                c.append(label).append(inputContainer.append(input));
                return c;
            });
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    if (e.id === 'size') {
                        container.removeClass("small");
                        container.removeClass("large");
                        container.addClass(e.value);
                    }
                    if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else {
                        container.find("input").attr(e.id, e.value);
                    }
                });
            return container;
        };
        componentsBuilder.textbox = function (id) {
            var box = new TextBox(id);
            box.editors = createDefaultEditor();
            return box;
        }
    }
    /**文本域**/
    {
        function TextArea(id) {
            Component.call(this);
            this.id = id;
        }

        createClass(TextArea);

        TextArea.prototype.render = function () {
            var container = this.getContainer(function () {
                var c = $("<div class=\"hs-textbox layui-form-text layui-form-item brick large\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var input = $("<textarea  class=\"layui-textarea\"></textarea>");
                // label.text("新建多行文本");
                c.append(label).append(inputContainer.append(input));
                return c;
            });
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    if (e.id === 'size') {
                        container.removeClass("small");
                        container.removeClass("large");
                        container.addClass(e.value);
                    }
                    if (e.id === 'comment') {
                        container.find("label").text(e.value);
                    } else {
                        container.find("input").attr(e.id, e.value);
                    }
                });
            return container;
        };
        componentsBuilder.textarea = function (id) {
            var box = new TextArea(id);
            box.editors = createDefaultEditor();
            return box;
        }
    }

    /**多选**/
    {
        function CheckBox(id) {
            Component.call(this);
            this.id = id;
        }

        createClass(CheckBox);

        CheckBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var c = $("<div class=\"hs-textbox layui-form-item brick large\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var checkbox1 = $("<input type=\"checkbox\" name='checkbox[1]' title='选项1'>");
                var checkbox2 = $("<input type=\"checkbox\" name='checkbox[2]' title='选项2'>");
                label.text("新建多选");
                c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                return c;
            });
            var me = this;
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    function initData(data) {
                        var inputParent = container.find("input").parent();
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
                        container.removeClass("small");
                        container.removeClass("large");
                        container.addClass(e.value);
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
        componentsBuilder.checkbox = function (id) {
            var box = new CheckBox(id);
            box.editors = createDefaultEditor();
            box.editors.push({
                id: "data",
                text: "选项",
                value: "选项1,选项2"
            });
            return box;
        }
    }

    /**单选**/
    {
        function RadioBox(id) {
            Component.call(this);
            this.id = id;
        }

        createClass(RadioBox);

        RadioBox.prototype.render = function () {
            var container = this.getContainer(function () {
                var c = $("<div class=\"hs-textbox layui-form-item brick large\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-block\">");
                var checkbox1 = $("<input type=\"radio\" name='radio[1]' title='选项1'>");
                var checkbox2 = $("<input type=\"radio\" name='radio[2]' title='选项2'>");
                label.text("新建单选");
                c.append(label).append(inputContainer.append(checkbox1).append(checkbox2));
                return c;
            });
            var me = this;
            this.un("propertiesChanged")
                .on('propertiesChanged', function (e) {
                    function initData(data) {
                        var inputParent = container.find("input").parent();
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
                        container.removeClass("small");
                        container.removeClass("large");
                        container.addClass(e.value);
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
        componentsBuilder.radio = function (id) {
            var box = new RadioBox(id);
            box.editors = createDefaultEditor();
            box.editors.push({
                id: "data",
                text: "选项",
                value: "选项1,选项2"
            });
            return box;
        }
    }
})();