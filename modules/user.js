layui.define(["hsweb"],function (exports) {
    var hsweb=layui.hsweb;
    var $ = layui.jquery;
    exports("user",{
        init:function (container) {
            console.log(container);
            hsweb.createTable("user-table"+new Date().getTime(),container,"user",[[
                {field:'name',title:"姓名",sort:true},
                {field:'username',title:"用户名",sort:true}
            ]]);
        }
    });
});