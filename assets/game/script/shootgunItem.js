cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        bullets: [cc.Node],
        bulletParent: cc.Node,
        itemSp: cc.Node,
        explosionClip: {
            default: null,
            url: cc.AudioClip
        },
        explosionPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        this.isDestroy = false;
        if (GLB.isRoomOwner) {
            this.speedX *= -1;
        }
    },

    init(itemId) {
        this.itemId = itemId;
        this.targetPosX = this.node.x;
    },

    move(){
        var deltaX = (1 / GLB.FRAME_RATE) * this.speedX;
        this.targetPosX += deltaX;
        if (this.targetPosX < -GLB.limitX) {
            this.targetPosX = GLB.limitX + deltaX;
            this.node.x = GLB.limitX;
        }
        if (this.targetPosX > GLB.limitX) {
            this.targetPosX = -GLB.limitX + deltaX;
            this.node.x = -GLB.limitX;
        }
    },

    explosion(hostPlayerId) {
        this.isDestroy = true;
        cc.audioEngine.play(this.explosionClip, false, 1);
        var boom = cc.instantiate(this.explosionPrefab);
        boom.parent = this.node;
        boom.position = cc.v2(0.0);

        this.node.getComponent(cc.BoxCollider).enabled = false;
        this.bulletParent.active = true;
        this.itemSp.active = false;
        if (GLB.userInfo.id === hostPlayerId) {
            this.node.rotation = 0;
        } else {
            this.node.rotation = 180;
        }
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i].getComponent("bullet");
            if (bullet) {
                bullet.init(hostPlayerId, GLB.NormalBulletSpeed)
            }
        }
    },

    update(dt) {
        if (!this.isDestroy) {
            this.node.x = cc.lerp(this.node.x, this.targetPosX, 4 * dt);
        }
    }

});
