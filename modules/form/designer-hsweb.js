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

    function createClass(O) {
        (function () {
            // 创建一个没有实例方法的类
            var Super = function () {
            };
            Super.prototype = Component.prototype;
            //将实例作为子类的原型
            O.prototype = new Super();
            O.type = "业务控件";
        })();
    }

    /**行政区联动选择**/
    {
        function District(id) {
            Component.call(this);
            this.id = id;
            this.properties = createDefaultEditor();
            this.getProperty("comment").value = "行政区";
            this.getProperty("size").value = "12";
        }

        createClass(District);

        District.prototype.render = function () {
            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-xs12'>");
                var c = $("<div class=\"layui-form-item brick\">");
                var label = $("<label class=\"layui-form-label\">").text("行政区");
                var classes = ["district-1", "district-2", "district-3"];
                c.append(label);

                $(classes).each(function () {
                    var inputContainer = $("<div class=\"layui-input-inline\">");
                    inputContainer.append($("<select>").addClass(this));
                    c.append(inputContainer);
                });
                // var option1 = $("<option selected value='1'>").text("选项1");
                // var option2 = $("<option value='2'>").text("选项2");

                // select.append(option1).append(option2);

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

        Designer.registerComponent("district", District);
    }
    /**人员选择**/
    {
        function Person(id) {
            Component.call(this);
            this.id = id;
            this.properties = createDefaultEditor();
            this.getProperty("comment").value = "人员";
        }

        createClass(Person);

        Person.prototype.render = function () {
            var container = this.getContainer(function () {
                var m = $("<div class='layui-col-md6'>");
                var c = $("<div class=\"layui-form-item brick\">");
                var label = $("<label  class=\"layui-form-label\">");
                var inputContainer = $("<div class=\"layui-input-inline\">");
                var input = $("<input value-property='v-id' type=\"text\" readonly class=\"layui-input\">");
                var button = $("<button class='person-selector layui-btn'>选择人员</button>");
                label.text("人员");
                c.append(label).append(inputContainer.append(input)).append(button);
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

        Designer.registerComponent("person", Person);
    }

})();