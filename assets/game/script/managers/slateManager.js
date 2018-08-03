var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        slatePrefab: cc.Prefab
    },

    onLoad() {
        Game.SlateManager = this;
        this.slateMaxCnt = 3;
        this.slates = [];
        this.slateId = 0;
    },

    canSpawnSlate(hostPlayerId) {
        var targetSlates = this.slates.filter(function(temp) {
            return temp.hostPlayerId === hostPlayerId;
        });
        if (targetSlates.length >= this.slateMaxCnt) {
            return false;
        }
        return true;
    },

    spawnSlate(hostPlayerId) {
        if (!this.canSpawnSlate(hostPlayerId)) {
            return;
        }
        var hostPlayer = hostPlayerId === GLB.userInfo.id ? Game.PlayerManager.self : Game.PlayerManager.rival;
        if (hostPlayer) {
            var slateNode = cc.instantiate(this.slatePrefab);
            var worldPos = hostPlayer.slatePoint.convertToWorldSpaceAR(cc.v2(0, 0));
            var position = hostPlayer.node.parent.convertToNodeSpaceAR(worldPos);
            slateNode.parent = hostPlayer.node.parent;
            slateNode.rotation = hostPlayer.node.rotation;
            slateNode.position = position;
            var slate = slateNode.getComponent('slate');
            slate.init(hostPlayerId, this.slateId);

            this.slates.push(slate);
            this.slateId++;
        }
        clientEvent.dispatch(clientEvent.eventType.refreshSlateBtn);
    },

    hitSlate(slateId) {
        var slate = this.slates.find(function(temp) {
            return temp.slateId === slateId;
        });
        if (slate) {
            slate.beHit();
        }
    },

    destroySlate(slateId) {
        var index = this.slates.findIndex(function(temp) {
            return temp.slateId === slateId;
        });
        if (index >= 0) {
            this.slates[index].node.destroy();
            this.slates.splice(index, 1);
        }
        clientEvent.dispatch(clientEvent.eventType.refreshSlateBtn);
    }
});
