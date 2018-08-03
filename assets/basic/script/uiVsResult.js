var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
cc.Class({
    extends: uiPanel,

    properties: {
        loseClip: {
            default: null,
            url: cc.AudioClip
        },
        victoryClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    start() {
        var isLose = Game.GameManager.isRivalLeave ? false : Game.PlayerManager.self.heart < Game.PlayerManager.rival.heart;

        this.player = this.nodeDict["player"].getComponent("resultPlayerIcon");
        this.player.setData(Game.PlayerManager.self.playerId);
        this.rival = this.nodeDict["rival"].getComponent("resultPlayerIcon");
        this.rival.setData(Game.PlayerManager.rival.playerId);
        this.nodeDict["vs"].active = false;
        this.nodeDict["score"].active = true;
        this.nodeDict["quit"].on("click", this.quit, this);

        this.nodeDict["lose"].active = isLose;
        this.nodeDict["win"].active = !isLose;

        if (!isLose) {
            cc.audioEngine.play(this.victoryClip, false, 1);
            // 发送胜局记录--
            Game.GameManager.loginServer();

        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }
        this.nodeDict["playerScore"].getComponent(cc.Label).string = 3 - Game.PlayerManager.rival.heart;
        this.nodeDict["rivalScore"].getComponent(cc.Label).string = 3 - Game.PlayerManager.self.heart;
    },

    quit: function() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI("uiGamePanel");
            gamePanel.destroy();
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();


        Game.GameManager.lobbyShow();
    }
});
