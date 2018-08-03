var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        this._super();
        this.nodeDict["sure"].on("click", this.sure, this);
        this.nodeDict["close"].on("click", this.close, this);
    },

    close() {
        uiFunc.closeUI(this.node);
    },

    sure() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI(gamePanel);
        }
        uiFunc.closeUI(this.node);
        Game.GameManager.lobbyShow();
    }
});
