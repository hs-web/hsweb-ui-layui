define(["request", "hsForm"], function (request, hsForm) {

    require(['plugin/ztree/jquery.ztree.all', 'css!plugin/font-awesome/css/font-awesome', 'css!plugin/ztree/awesomeStyle/awesome']);


    function openSettingWindow(settingForType, settingFor) {
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false
            },
            check: {
                enable: true,
                chkboxType: {"Y": "ps", "N": "ps"}
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPid: "-1",
                    url: ""
                },
                key: {
                    url: "click_url"
                }
            },
            callback: {
                onClick: function () {


                },
                beforeDrag: beforeDrag,
                beforeDrop: beforeDrop
            }
        };

        function beforeDrag(treeId, treeNodes) {
            for (var i = 0, l = treeNodes.length; i < l; i++) {
                if (treeNodes[i].drag === false) {
                    return false;
                }
            }
            return true;
        }

        function beforeDrop(treeId, treeNodes, targetNode, moveType) {
            return targetNode ? targetNode.drop !== false : true;
        }

        request.get("menu/no-paging", function (resp) {
            if (resp.status === 200) {
                require(["text!pages/autz-setting/autz-setting.html"], function (html) {
                    hsForm.openForm({
                        template: {html: html, components: []},
                        onOpen: function (formEl, ready) {
                            var treeObj = $.fn.zTree.init(formEl.find("#menuTree"), setting, resp.result);
                            ready();
                        }
                    });
                });
            }
        });

    }

    return openSettingWindow;
});