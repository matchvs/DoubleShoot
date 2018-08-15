var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        shootGunItem: cc.Prefab
    },

    onLoad() {
        Game.ItemManager = this;
        this.itemId = 0;
        this.items = [];
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
    },

    roundStart() {
        this.scheduleItemSpawn();
    },

    scheduleItemSpawn() {
        clearInterval(this.scheduleItemId);
        this.scheduleItemId = setInterval(function() {
            if (Game.GameManager.gameState === GameState.Over || !GLB.isRoomOwner) {
                return;
            }
            if (this.items && this.items.length === 0) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.SHOOT_GUN_ITEM,
                    itemId: this.itemId++
                }));
            }
        }.bind(this), 6000);
    },

    itemSpawn(itemId) {
        var item = cc.instantiate(this.shootGunItem);
        item.parent = this.node;
        item.position = cc.v2(0, 0);
        var shootGun = item.getComponent("shootgunItem");
        shootGun.init(itemId);
        this.items.push(shootGun);
    },

    itemGet(itemId, playerId) {

        var index = this.items.findIndex(function(temp) {
            return temp.itemId === itemId;
        });
        if (index >= 0) {
            var item = this.items[index].getComponent("shootgunItem");
            item.explosion(playerId);
            this.items.splice(index, 1);
        }
    },

    move() {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                this.items[i].move();
            }
        }
    },

    roundOver() {
        clearInterval(this.scheduleItemId);
    },

    gameOver() {
        clearInterval(this.scheduleItemId);
    },

    onDestroy() {
        clearInterval(this.scheduleItemId);
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
    }

});
