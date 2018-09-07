var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        bgmAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad() {
        this._super();
        this.nodeDict["right"].on(cc.Node.EventType.TOUCH_START, this.rightStart, this);
        this.nodeDict["right"].on(cc.Node.EventType.TOUCH_END, this.rightCancel, this);
        this.nodeDict["left"].on(cc.Node.EventType.TOUCH_START, this.leftStart, this);
        this.nodeDict["left"].on(cc.Node.EventType.TOUCH_END, this.leftCancel, this);
        this.nodeDict["shootButton"].on(cc.Node.EventType.TOUCH_START, this.sendFireMsg, this);
        this.defenseBtn = this.nodeDict["defenseButton"].getComponent(cc.Button);
        this.defenseBtn.enableAutoGrayEffect = true;
        this.defenseBtn.node.on(cc.Node.EventType.TOUCH_START, this.sendSlateMsg, this);
        this.lackBulletAnim = this.nodeDict["lackAmmunition"].getComponent(cc.Animation);
        this.cartridgeBullets = [].concat(this.nodeDict["cartridge"].children);
        this.bulletCnt = this.cartridgeBullets.length;
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

        this.nodeDict["exit"].on("click", this.exit, this);

        this.bgmId = cc.audioEngine.play(this.bgmAudio, true, 1);
    },

    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    if (data.leaveRoomInfo.userId !== GLB.userInfo.id) {
                        uiTip.setData("对手离开了游戏");
                    }
                }
            }.bind(this));
        }
    },

    rightStart() {
        this.sendDirectMsg(DirectState.Right);
    },

    rightCancel() {
        this.sendDirectMsg(DirectState.None);
    },

    leftStart() {
        this.sendDirectMsg(DirectState.Left);
    },

    leftCancel() {
        this.sendDirectMsg(DirectState.None);

    },

    sendDirectMsg(direction) {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.DIRECTION,
                direction: direction
            }));
        }
    },

    sendSlateMsg() {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.SPAWN_SLATE
            }));
        }
    },

    sendFireMsg() {
        if (this.bulletCnt > 0) {
            this.bulletCnt--;
            var bullet = this.cartridgeBullets.pop();
            bullet.getComponent(cc.Animation).play("sheel");
            if (Game.GameManager.gameState === GameState.Play) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.FIRE
                }));
            }
            if (this.bulletCnt === 0) {
                this.reloadCartridge();
            }
        } else {
            var state = this.lackBulletAnim.getAnimationState('lack');
            if (!state.isPlaying) {
                this.lackBulletAnim.play().repeatCount = 2;
            }
        }
    },

    reloadCartridge() {
        setTimeout(function() {
            if(this.node) {
                this.cartridgeBullets = [].concat(this.nodeDict["cartridge"].children);
                this.bulletCnt = this.cartridgeBullets.length;
                for (var i = 0; i < this.cartridgeBullets.length; i++) {
                    this.cartridgeBullets[i].getComponent(cc.Animation).play("reloading");
                }
                this.lackBulletAnim.stop();
                this.lackBulletAnim.node.opacity = 0;
            }
        }.bind(this), 5000);
    },

    refreshSlateBtn() {
        if (Game.SlateManager.canSpawnSlate(GLB.userInfo.id)) {
            this.defenseBtn.interactable = true;
        } else {
            this.defenseBtn.interactable = false;
        }
    },

    exit() {
        uiFunc.openUI("uiExit");
    },

    gameOver: function() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();

        cc.audioEngine.stop(this.bgmId);
    },

    roundStart: function() {
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
    },

    leaveRoom() {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },

    onDestroy() {
        cc.audioEngine.stop(this.bgmId);
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

    }
});
