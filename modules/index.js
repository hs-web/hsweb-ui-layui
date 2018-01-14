window.API_BASE_PATH = "http://localhost:8080/";
layui.config({
    dir: 'plugins/layui/'
    , version: false
    , debug: false
    , base: 'modules/'
});
layui.use(['hsweb', "element"], function (r) {
    var $ = layui.jquery;
     var element = layui.element;
    layui.use('request', function (r) {
        r.get("menu/user-own/tree", function (e) {
            console.log(e);
            if (e.status === 200) {
                initTopMenu(e.result);
                element.init();
                $($("#top-menu").find("a")[0]).click();
            }
        })
    });

    function initTopMenu(menus) {
        var topMenus = $("#top-menu");
        topMenus.children().remove();
        $(menus).each(function () {
            var parent = $("<li>");
            parent.addClass("layui-nav-item");
            var parentNode = this;
            if (this.children && this.children.length > 0) {
                var menuLink = $("<a>").attr({"href": "javascript:void(0)"}).text(parentNode.name);
                var childrenNode = this.children;
                parent.append(menuLink);
                if (this.children[0].children && this.children[0].children.length > 0 && this.children[0].children[0].children) {
                    var dl = $("<dl>").addClass("layui-nav-child");
                    var hasChildren = false;
                    $(this.children[0].children).each(function () {
//                            if(this.children&&this.children.length>0){
//                                hasChildren=true;
                        dl.append($("<dd>").append($("<a>").text(this.name)));
//                            }
                    });
//                        if(hasChildren)
                    parent.append(dl);
                } else {
                    menuLink.on("click", function () {
                        initLeftMenu(childrenNode);
                    });
                }
            }
            topMenus.append(parent);
        });

    }

    function loadMenu(menu) {
        if ($("[lay-id=" + menu.id + "]").length === 0) {
            layui.element.tabAdd('tabs', {
                title: menu.name
                , content:'<div id="container-'+menu.id+'" style="width: 100%;height: 100%" />'
                , id: menu.id
            });
            layui.use("user",function () {
                layui.user.init("#container-"+menu.id);
            });
        }
        layui.element.tabChange('tabs', menu.id);
    }

    function initLeftMenu(menus) {
        var leftMenu = $("#left-menu");
        leftMenu.children().remove();
        $(menus).each(function () {
            var menuEl = $("<li>");
            menuEl.addClass("layui-nav-item");
            var parentNode = this;
            var menuLink = $("<a>").text(this.name);
            menuEl.append(menuLink);
            if (parentNode.children && parentNode.children.length > 0) {
                var dl = $("<dl>");
                dl.addClass("layui-nav-child");
                $(parentNode.children).each(function () {
                    var link = $("<a>").text(this.name).attr("href", "javascript:void(0)");
                    var m = this;
                    link.on("click", function () {
                        loadMenu(m)
                    });
                    dl.append($("<dd>").append(link));

                });
                menuEl.append(dl);
            }
            leftMenu.append(menuEl);
        });
        $(leftMenu.children()[0]).addClass("layui-nav-itemed");
        layui.element.init();
    }
});
