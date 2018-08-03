/*
    create by hao.c 2018/04/10

    desc: 游戏显示相关操作逻辑
 */

window.uiFunc = {
    uiList: []
};

uiFunc.openUI = function(uiName, callBack) {
    cc.loader.loadRes('ui/' + uiName, function(err, prefab) {
        if (err) {
            cc.error(err.message || err);
            return;
        }

        var temp = cc.instantiate(prefab);
        temp.parent = cc.Canvas.instance.node;
        uiFunc.uiList.push(temp);

        for (var i = 0; i < uiFunc.uiList.length; i++) {
            if (uiFunc.uiList[i] && uiFunc.uiList[i].name !== "") {
                var targetUI = uiFunc.uiList[i].getComponent("uiPanel");
                if (targetUI && targetUI.isTop) {
                    targetUI.node.setSiblingIndex(Number.MAX_SAFE_INTEGER);
                }
            }
        }
        // event--
        if (callBack) {
            callBack(temp);
        }
    });
};

uiFunc.closeUI = function(targetUI) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        if (uiFunc.uiList[i] && targetUI === uiFunc.uiList[i]) {
            targetUI.destroy();
            uiFunc.uiList.splice(i, 1);
            break;
        }
    }
};

uiFunc.findUI = function(uiName) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.name === uiName) {
            return temp;
        }
    }
    return null;
}
