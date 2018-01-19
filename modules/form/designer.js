(function () {
    var supportComponents = {};
    window.Designer = function (config) {
        this.config = config;
        this.components = {};
    };
    window.Designer.supportComponents = supportComponents;
    Designer.registerComponent = function (type, component) {
        supportComponents[type] = component;
    };

    Designer.prototype.createComponent = function (type, id) {
        if (supportComponents[type]) {
            return this.components[id] = new supportComponents[type](id);
        }
        return undefined;
    };

    Designer.prototype.init = function () {
        var me = this;
        /**初始化组件列表**/
        {
            var group = {};
            for (var name in supportComponents) {
                var component = supportComponents[name];
                if (!group[component.type]) {
                    group[component.type] = [];
                }
                component.componentName = name;
                group[component.type].push(component);
            }
            var container = $(".support-components");
            var index = 0;
            for (var type in group) {
                index++;
                var list = group[type];
                var html = [];
                html.push('<div class="layui-colla-item">');
                html.push('<h2 class="layui-colla-title">' + type + '</h2>');
                html.push('<div class="layui-colla-content ' + (index === 1 ? 'layui-show' : '') + '">');
                $(list).each(function () {
                    var component = this;
                    var componentHtml = new component("__").render();
                    componentHtml.find(".brick").removeClass("brick");
                    componentHtml.find(".layui-form-item").addClass("layui-form-text");
                    componentHtml
                        .find("input,textarea")
                        .attr("readonly", "readonly")
                        .attr("disabled", "disabled");

                    componentHtml.attr("class", "");
                    componentHtml.addClass("component");
                    componentHtml.attr("hs-type", this.componentName);
                    html.push(componentHtml[0].outerHTML)
                });
                html.push('</div>');
                html.push('</div>');
                container.append(html.join(""));
            }
            layui.element.render();
            layui.form.render();
        }
        /**初始化主编辑器**/
        {
            $(".component").draggable({
                connectToSortable: ".components",
                helper: "clone",
                cursor: "move",
                revert: "valid"
            }).disableSelection();

            function initDroppable() {
                var cache = {};
                $(".components").sortable({
                    revert: true,
                    connectWith: ".component"
                }).droppable({
                    accept: ".component",
                    drop: function (event, ui) {
                        var source = $(ui.draggable);
                        var type = source.attr("hs-type");
                        if (!cache[event.timeStamp]) {
                            if (type) {
                                var component = newComponent(type);
                                var html = component.getContainer();
                                source.replaceWith(html);
                                html.click();
                                initPropertiesEditor(component);
                            }
                            cache[event.timeStamp] = 1;
                            // initDroppable();
                        }

                    }
                }).disableSelection();
            }

            initDroppable();

            function openProperties(x, y) {
            }

            var nowEditComponent;

            function newComponent(type) {
                var id = md5(new Date().getTime() + "" + Math.random());
                var component = me.createComponent(type, id);
                var html = component.render();
                // $('.main-panel').append(html);
                // $('.gridly').gridly();
                html.on('click', function () {
                    initPropertiesEditor(component);
                    $(".brick").find(".layui-form-label,legend").css("border", "");
                    $(this).find(".layui-form-label,legend").css("border", "1px solid red");
                    layui.form.render();
                    nowEditComponent = component;
                });
                return component;
            }

            function addComponent(type) {
                var id = md5(new Date().getTime() + "" + Math.random());
                var component = Designer.newComponent(type, id);
                var html = component.render();
                // $('.main-panel').append(html);
                // $('.gridly').gridly();
                html.on('click', function () {
                    initPropertiesEditor(component);
                    $(".brick").find(".layui-form-label,legend").css("border", "");
                    $(this).find(".layui-form-label,legend").css("border", "1px solid red");
                    layui.form.render();
                    nowEditComponent = component;
                });
                $(".components").children(".layui-row:last-child").append(html);
                html.click();
                initPropertiesEditor(component);
            }

            function removeComponent(id) {
                var component = me.components[id];
                if (component) {
                    component.remove();
                }
            }

            function saveProperties() {

            }

            function initPropertiesEditor(component) {
                saveProperties();
                var offset = component.getContainer().offset();
                openProperties(offset.top + 30 + "px", offset.left + 150 + "px");
                var editors = component.editors;
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
                    input.on("keyup", function () {
                        component.setProperty({id: me.id, value: input.val()});
                        layui.form.render();
                    });
                    c.append(label).append(inputContainer.append(input));
                    html.append(c);
                });
                var button = $("<button>");
                button.addClass("layui-btn").addClass("layui-btn-danger").addClass("delete-component");
                button.on('click', function () {
                    html.children().remove();
                    component.getContainer().remove();
                    removeComponent(component.id);
                });
                button.text("删除");
                html.append(button);
            }

            function fixLayout() {
                initDroppable();
                $(".ui-sortable-placeholder").remove();
            }

            $(".fix-layout").on("click", fixLayout);
            $(".export-html").on('click', function () {
                fixLayout();
                var template = [
                    "<!DOCTYPE html>", "<html lang=\"zh-cn\">", " <head>"
                    , "<meta charset=\"UTF-8\">", " <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">"
                    , "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">"
                    , "<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">"
                    , "<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">"
                    , "<meta name=\"format-detection\" content=\"telephone=no\">"
                    , "<title>hsweb 动态表单设计器</title>"
                    , "<link rel=\"stylesheet\" href=\"http://res.layui.com/layui/dist/css/layui.css?t=1515376178709\">"
                    , "</head>"
                    , "<body>"
                ];
                $(".brick").find(".layui-form-label,legend").css("border", "");
                var html = $(".main-panel");
                html.find("hs-id").removeAttr("hs-id");

                template.push(html[0].outerHTML);
                template.push("</body>");
                template.push(" </html>");
                template.push("<script src=\"http://res.layui.com/layui/dist/layui.js?t=1515376178709\" charset=\"utf-8\"></script>");

                // 创建隐藏的可下载链接
                var eleLink = document.createElement('a');
                eleLink.download = "动态表单.html";
                eleLink.style.display = 'none';
                // 字符内容转变成blob地址
                var blob = new Blob([template.join("\n")]);
                eleLink.href = URL.createObjectURL(blob);
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
                // console.log(html[0].outerHTML);
            });
            $(document).keyup(function (e) {
                if (e.keyCode === 46) {
                    if (nowEditComponent) {
                        $("#component-properties .delete-component").click();
                    }
                }
            });
        }
    };
    var designer = new Designer();
    window.setTimeout(function () {
        designer.init();
    }, 100)
})();