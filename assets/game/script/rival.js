cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        firePoint: cc.Node,
        hearts: [cc.Node],
        heart: 3,
        limitX:415
    },

    start() {
        this.playerId = GLB.playerUserIds[1];
        this.direction = DirectState.None;
        this.targetPosX = this.node.x;
    },

    fire() {
        var bullet = Game.BulletManager.getBullet();
        var worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        var bulletPoint = Game.BulletManager.node.convertToNodeSpaceAR(worldPos);
        bullet.position = bulletPoint;
        bullet.rotation = 180;
        bullet.getComponent("bullet").init(this.playerId);
    },

    hurt() {
        this.heart--;
        if (this.heart <= 0) {
            this.dead();
        }
        // 受伤动画
        this.refreshHeartUI();
    },

    dead() {
        // 游戏结束--
        if (GLB.isRoomOwner) {
            var msg = {
                action: GLB.GAME_OVER_EVENT
            };
            Game.GameManager.sendEventEx(msg);
        }
    },

    refreshHeartUI() {
        for (var i = 0; i < this.hearts.length; i++) {
            if (i > this.heart - 1) {
                this.hearts[i].active = false;
            } else {
                this.hearts[i].active = true;
            }
        }
    },

    move() {
        var dir = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? 1 : -1;
        var deltaX = (1 / GLB.FRAME_RATE) * this.speed * dir;
        this.targetPosX += deltaX;
        if (this.targetPosX < -this.limitX) {
            this.targetPosX = this.limitX + deltaX;
            this.node.x = this.limitX;
        }
        if (this.targetPosX > this.limitX) {
            this.targetPosX = -this.limitX + deltaX;
            this.node.x = -this.limitX;
        }
    },

    setDirect(dir) {
        this.direction = dir;
    },

    update(dt) {
        this.node.x = cc.lerp(this.node.x, this.targetPosX, 4 * dt);
    }
});
