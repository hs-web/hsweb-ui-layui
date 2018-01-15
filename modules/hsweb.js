layui.define(["jquery","element","request"],function (exports) {
    //window.API_BASE_PATH="/";
    var element = layui.element;
    var $ = layui.jquery;
    var request = layui.request;
    function createTable(id,elem,url,cols) {
        layui.use("table",function () {
            var table = layui.table;
            var sorts=[];
            table.render({ //其它参数在此省略
                id:id,
                elem:elem,
                url: window.API_BASE_PATH+url,
                cols:cols,
                ajaxSort:true,
                height:'full-200',
                //where: {token: 'sasasas', id: 123} //如果无需传递额外参数，可不加该参数
                //method: 'post' //如果无需自定义HTTP类型，可不加该参数
                request: {
                    pageName: 'pageIndex' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                page: true,
                sorts:sorts,
                response: {
                    statusName: 'status' //数据状态的字段名称，默认：code
                    ,statusCode: 200 //成功的状态码，默认：0
                    ,msgName: 'message' //状态信息的字段名称，默认：msg
                    ,countName: 'result.total' //数据总数的字段名称，默认：count
                    ,dataName: 'result.data' //数据列表的字段名称，默认：data
                }
            });
            return table;
        });
    }
    var e ={
        createTable:createTable
    };

    exports("hsweb",e);
});