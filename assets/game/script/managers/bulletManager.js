cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: cc.Prefab,
        boomPrefab: cc.Prefab,
        shotGunPrefab: cc.Prefab,
    },

    onLoad() {
        Game.BulletManager = this;
        this.bulletPool = new cc.NodePool();
        this.boomPool = new cc.NodePool();
    },

    getBullet() {
        var target = this.bulletPool.get();
        if (!target) {
            target = cc.instantiate(this.bulletPrefab);
        }
        target.parent = Game.BulletManager.node;
        return target;
    },

    recycleBullet(target) {
        this.bulletPool.put(target);
    },

    boomEffect(host) {
        var obj = this.boomPool.get();
        if (!obj) {
            obj = cc.instantiate(this.boomPrefab);
        }
        obj.parent = host.parent;
        obj.position = host.position;
        obj.rotation = host.rotation;
        obj.getComponent(cc.Animation).play();
        setTimeout(function() {
            if (this && this.boomPool && obj) {
                this.boomPool.put(obj);
            }
        }.bind(this), 2000);
    }
});
