window.API_BASE_PATH = "http://localhost:8089/";
window.RESOURCE_PATH = "/hsweb-ui-layui/";
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

/**
 * 获取cooke
 * @param sName cookie名称
 * @param defaultVal 默认值
 * @returns {*} cookie值
 */
function getCookie(sName, defaultVal) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return defaultVal;
}

function importResource(path, callback) {
    if (path.indexOf("http") !== 0 || path.indexOf("//") !== 0) {
        if (!path.startWith("/"))
            path = window.RESOURCE_PATH + path;
    }
    var head = document.getElementsByTagName('head')[0];
    if (path.endWith("js")) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.timeout = 120000;
        if (typeof callback !== "undefined")
            script.async = false;
        script.src = path;

        function onload() {
            if (callback) callback();
        }

        script.onreadystatechange = function () {
            var r = script.readyState;
            if (r === 'loaded' || r === 'complete') {
                script.onreadystatechange = null;
                onload();
            }
        };
        script.onload = onload;
        script.onerror = onload;
        head.appendChild(script);
    } else if (path.endWith("css")) {
        var style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = path;
        style.type = "text/css";
        head.appendChild(style);
        if (callback) callback();
    }
}

function initRequireJs() {
    require.config({
        waitSeconds: 0,
        map: {
            '*': {
                'css': RESOURCE_PATH + 'plugins/require/css/css.js',
                'text': RESOURCE_PATH + 'plugins/require/text/text.js'
            }
        },
        shim: {
            'jquery': {exports: "$"},
            'layui': {exports: "layui"}
        },
        paths: {
            "jquery": [RESOURCE_PATH + "plugins/jquery-ui/jquery"],
            "authorize": [RESOURCE_PATH + "admin/commons/authorize"], //权限管理
            "plugin": [RESOURCE_PATH + "plugins"],
            "module": [RESOURCE_PATH + "modules"],
            "request": [RESOURCE_PATH + "modules/request"],
            "pages": [RESOURCE_PATH + "pages"],
            "hsForm": [RESOURCE_PATH + "modules/components/hs-form"],
            "hsTable": [RESOURCE_PATH + "modules/components/hs-table"]
        }
    });
}

function importJquery(callback) {
    require(["jquery"], callback);
}

function importLayui(callback) {
    function doImport() {
        //重复引入
        if (window.layui) {
            callback();
            return;
        }

        function loadLayui() {
            require(["css!plugin/layui/css/layui", "plugin/layui/layui"], function () {
                layui.config({
                    dir: RESOURCE_PATH + 'plugins/layui/'
                    , version: false
                    , debug: false
                    , base: RESOURCE_PATH + 'modules/'
                });
                layui.use(["table","element","form","layer","laydate"],function () {
                    callback();
                });
                //     .extend({
                //     //模块
                //     hsTable: 'components/hsTable',
                //     hsForm: 'components/hsForm',
                //     // 页面
                //     menuManage: 'pages/menuManage',
                //     userManage: 'pages/user/userManage'
                // });

            });
        }

        if (!window.jQuery && !window.$) {
            importJquery(loadLayui);
        } else {
            loadLayui();
        }
    }

    doImport();
}

importResource(RESOURCE_PATH + "plugins/require/js/require.min.js", initRequireJs);
