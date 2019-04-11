cc.Class({
    extends: cc.Component,

    properties: {
        grap: cc.Graphics,
        rigidbody: cc.RigidBody,
        phy: cc.PhysicsPolygonCollider,
        prefab: cc.Prefab,
    },


    onLoad() {

    },

    init(points, leixing) {
        //首先是画出图形。
        this.grap.moveTo(0, 0);
        this.phy.points[0] = cc.v2(0, 0);
        for (var i = 0; i < points.length; i++) {
            points[i].y = -points[i].y;
        };
        for (var i = 0; i < points.length; i++) {
            if (i != 0) {
                this.phy.points[i] = cc.v2(points[i].x, points[i].y)  //修改碰撞块
                this.grap.lineTo(points[i].x,points[i].y);                    //修改图形点。
            };

            if (i == 0) {
                var point2 = points[points.length - 1];
                var point1 = points[i];
            }
            else {
                var point1 = points[i];
                var point2 = points[i - 1];
            };

            var changdu = cc.pDistance(point1, point2);
            var jiaodu = this._getAngle(cc.pSub(point1, point2));
            jiaodu = -jiaodu;
            var thenode = cc.instantiate(this.prefab);
            thenode.parent = this.node;
            //设置中心点
            var zhongxindian = cc.pMidpoint(point1, point2);
            thenode.setPosition(zhongxindian.x, zhongxindian.y);
            //设置旋转角度
            thenode.rotation = jiaodu;
            //设置长宽。颜色 
            {
                thenode.width = changdu;
                thenode.height = 3;

                if (leixing == 1) {
                    thenode.color = dycolor;
                };
            };

        };
        /*     this.grap.lineTo(20,100);
          this.grap.lineTo(70,100);  */

        //更改碰撞图形,上一个循环已经更改了图形。直接并且应用  。.
        // this.phy.points=[].concat(points);   //这样是已经复制成功了的
        this.phy.apply();


        //判断类型。0静止，1动态。默认是静止。动态就需要更改
        if (leixing == 1) {
            this.rigidbody.type = cc.RigidBodyType.Dynamic;
            this.grap.fillColor = dycolor;
            //this.grap.fillColor = cc.hexToColor('#13BB93');  //这个是默认颜色

        }
        this.grap.close();
        //this.grap.stroke();
        this.grap.fill();
    },

    start() {

    },

    _getAngle: function (point) {

        //var pos = this.node.getPosition();
        var pos = cc.v2(0, 0);
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
        return this._angle;
    },

    // update (dt) {},
});
