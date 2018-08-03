cc.Class({
    extends: cc.Component,

    properties: {
        heart: 0,
        boomPrefab: cc.Prefab
    },

    init(hostPlayerId, slateId) {
        this.hostPlayerId = hostPlayerId;
        this.slateId = slateId;
        this.maxHeart = this.heart;
    },

    beHit() {
        this.heart--;
        if (this.heart <= 0) {
            var boom = cc.instantiate(this.boomPrefab);
            boom.parent = this.node.parent;
            boom.position = this.node.position;
            boom.rotation = this.node.rotation;
            Game.SlateManager.destroySlate(this.slateId);
        } else {
            this.node.getComponent(cc.Animation).play("hit" + (this.maxHeart - this.heart));
        }
    }
});
