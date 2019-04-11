
cc.Class({
    extends: cc.Component,

    properties: {
        rigidbody: cc.RigidBody,
        phy: cc.PhysicsCircleCollider,
    },

    init(radius, leixing) {
        if (leixing == 1)   //设置为动态圆
        {
            this.rigidbody.type = cc.RigidBodyType.Dynamic;
            this.node.color =dycolor;
        }
        //设置半径，及长宽。
        this.phy.radius = radius;
        this.node.width = radius * 2;
        this.node.height = radius * 2;
        this.phy.apply();

    },
    start() {

    },

    // update (dt) {},
});
