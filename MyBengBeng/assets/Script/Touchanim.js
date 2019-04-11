var maxdistance;
var banjing;
var vx, vy;
cc.Class({
    extends: cc.Component,

    properties: {
        donghua: cc.Node,
        xingxing: cc.Node,
        rigidbody: cc.RigidBody,
        cameranode: cc.Camera,
        graph: cc.Graphics,

        yaogannode: {
            default: null,
            type: cc.Node,
            displayName: '摇杆节点',
        },

        dot: {
            default: null,
            type: cc.Node,
            displayName: '摇杆中心节点',
        },

        ring: {
            default: null,
            type: cc.Node,
            displayName: '摇杆背景节点',
        },

        _getbone: null,
        _hero: null,
        _camera: null,

    },


    onLoad() {
        if (userData.caozuomoshi == 0)
            this._initTouchEvent();
        else {
            this.yaogannode.active = true;
            this.inityaogan();
        }

        this._getbone = this.donghua.getComponent("Getbone");
        this._hero = this.node.getComponent("Hero");
        this._camera = this.cameranode.getComponent("Cameragensui");  
        //这是是否启动物理系统的开关getPhysicsManager  //启动好了才打开物理系统开关。
        cc.director.getPhysicsManager().enabled = true;

        //是否更新物理系统。可以自定义物理系统update时间。
        //cc.director.getPhysicsManager().enabledAccumulator = true;
        //以下是绘制碰撞的包围盒子些。在物理系统下使用的代码。
        /*         var Bits = cc.PhysicsManager.DrawBits;
                cc.director.getPhysicsManager().debugDrawFlags = Bits.e_aabbBit |
                Bits.e_pairBit |
                Bits.e_centerOfMassBit |
                Bits.e_jointBit |
                Bits.e_shapeBit;
                //这下面应该有把这些显示在摄像机中的代码
                        cc.director.getCollisionManager().enabled = true;
              cc.director.getCollisionManager().enabledDebugDraw = true;
                 cc.director.getCollisionManager().enabledDrawBoundingBox = true;
                */



        //这是获取最大的变形量。
        maxdistance = this.node.width * 1.2;
        //这是获取他的半径。
        banjing = this.node.width * 0.5;
    },


    inityaogan: function () {
        var self = this;
        self.yaogannode.on(cc.Node.EventType.TOUCH_START, self._touchStartEvent, self);

        self.yaogannode.on(cc.Node.EventType.TOUCH_MOVE, self._touchMoveEvent, self);

        self.yaogannode.on(cc.Node.EventType.TOUCH_END, self._touchEndEvent, self);
        self.yaogannode.on(cc.Node.EventType.TOUCH_CANCEL, self._touchEndEvent, self);
    },


    //设置各种状态的触发函数
    _initTouchEvent: function () {
        var self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, self);

        self.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, self);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        self.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, self);
    },


    //这是刚开始时触发
    _touchStartEvent: function (event) {

        if (gameState != 2)    //游戏状态2.表示启动好了。
            return;

        touchhero = true;

        if (userData.caozuomoshi == 1) {
            var touchPos = this.yaogannode.convertToNodeSpaceAR(event.getLocation());
            // 更改摇杆的位置
            this.ring.setPosition(touchPos);
            this.dot.setPosition(touchPos);
            this.yaogannode.opacity = 80;
        }

    },

    //移动时触发
    _touchMoveEvent: function (event) {
        if (gameState != 2 || heroData.jumpcount < 1)    //游戏状态2.表示启动好了。还有就是jump次数至少大于1.
            return;
        //这句是转换坐标为这个node的相对坐标convertTouchToNodeSpaceAR
        // var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        //下面这句是把屏幕坐标转换为摄像机的世界坐标。

        //这是直接触摸的情况
        if (userData.caozuomoshi == 0) {
            var touchPos = this.cameranode.getCameraToWorldPoint(event.getLocation());
            //计算长度。屏幕坐标转换为摄像机的世界坐标
            var distance = this._getDistance(touchPos, this.node.getPosition());
            this._getAngle(this.node.position, touchPos);
        }

        if (userData.caozuomoshi == 1) {
            var touchPos = this.ring.convertToNodeSpaceAR(event.getLocation());
            var distance = this._getDistance(touchPos, cc.v2(0, 0));
            this._getAngle(cc.v2(0, 0), touchPos);

            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            var radius = this.ring.width / 2;
            if (radius > distance) {
                this.dot.position = this.yaogannode.convertToNodeSpaceAR(event.getLocation());
            }
            else {
                var xiangdui = cc.pMult(cc.pNormalize(touchPos), radius);
                xiangdui = cc.pAdd(xiangdui, this.ring.position);

                this.dot.setPosition(xiangdui);
            }
        }

        //由于摇杆的postion是以父节点为锚点，所以定位要加上ring和dot当前的位置(stickX,stickY)
        //现在又变换为屏幕中的坐标。以屏幕分辨率为基准。所以就可以省略掉就是呢。
        // var posX = this.node.getPosition().x + touchPos.x;
        // var posY = this.node.getPosition().y + touchPos.y;

        //现在如果是加了摄像机情况下。touchpos坐标是相对node在canve中的坐标  

        if (maxdistance < distance)
            distance = maxdistance;


        //这里是去变形。
        this.bianxing(distance, this._angle);
        //这里写入射线显示

        this.shexian();
    },
    //离开时触发。
    _touchEndEvent: function () {
        touchhero = false;

        //////////////////////////////////这里是记录射线的代码。发布时记得一定要删除///////////////////////////
        if (isjilu) {
            var jilu = { position: cc.v2(0, 0), point: [] };
            jilu.position = this.node.position;
            var canshu = 0.03;  //0.03秒。时间间隔。
            for (var i = 1; i < 20; i++) {
                var shexianx = vx * canshu * i;
                var shexiany = (vy - 1600 * canshu * i + vy) * canshu * i / 2;
                jilu.point.push(cc.v2(shexianx, shexiany));
            }
            helps.push(jilu);
            isjilu = false;
        }
        //////////////////////////////////这里是记录射线的代码。发布时记得一定要删除///////////////////////////

        if (userData.caozuomoshi == 1) {
            this.yaogannode.opacity = 10;
            this.dot.position = this.ring.position;
        };
        if (gameState == 0) {
            gameState = 1;
            this._camera.jisuanv();       
            return;
        };
        if (gameState != 2 || heroData.jumpcount < 1)    //游戏状态2.表示启动好了。还有就是jump次数至少大于1.
            return;
        if (vx == 0 && vy == 0)    //只是点击的情况。不做任何动作
            return;

        this.setstep();
        this.fuyuan();
        this._hero.fashe(vx, vy);
        //重新vx，vy归0.不然下次点击会跳。
        vx = 0;
        vy = 0;
        //这里清空射线显示
        this.graph.clear();
    },

    setstep() {
        heroData.step++;
        var filled = this.xingxing.getChildByName("filled");
        var starnode = this.xingxing.getChildByName("star").children;
        var x = 470 - heroData.step / mapxingxing.maxstep * 470;
        if (x >= 0)
            filled.width = x;

        if (heroData.step > mapxingxing.step1 + mapxingxing.step2) {//第二个星星消失
            heroData.xingxing = 1;
            starnode[1].active = false;
        }
        else if (heroData.step > mapxingxing.step1) {         //第一个星星消失
            heroData.xingxing = 2;
            starnode[2].active = false;
        };


    },

    //计算两点间的距离并返回
    _getDistance: function (pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2));
    },

    /*角度/弧度转换
角度 = 弧度 * 180 / Math.PI
弧度 = 角度 * Math.PI / 180*/
    //计算弧度并返回
    /*     _getRadian: function(point)
        {
            this._radian = Math.PI / 180 * this._getAngle(point);
            return this._radian;
        }, */

    //计算角度并返回
    _getAngle: function (pos, point) {
        //var pos = cc.v2(0,0);
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
        return this._angle;
    },

    fuyuan: function () {
        for (var i = 0; i < this._getbone.bone.length; i++) {
            this._getbone.bone[i].offset.x = 0;
            this._getbone.bone[i].offset.y = 0;
        }

    },


    shexian: function () {
        this.graph.clear();
        var canshu = 0.03;  //0.03秒。时间间隔。
        for (var i = 1; i < 20; i++) {
            var shexianx = vx * canshu * i;
            var shexiany = (vy - 1600 * canshu * i + vy) * canshu * i / 2;
            this.graph.circle(shexianx, shexiany, 1);
        }
        // this.graph.circle(0,0,20);
        // cc.log(vx+'  '+vy);
        this.graph.stroke();
    },

    bianxing: function (changdu, jiaodu) {
        var xx = Math.cos(jiaodu * (Math.PI / 180)) * banjing;
        var yy = Math.sin(jiaodu * (Math.PI / 180)) * banjing;
        var newpos = cc.v2(xx, yy);
        for (var i = 0; i < this._getbone.bone.length; i++) {
            //因为在龙骨中y的方向是与cocos中相反的，所以他的y前面需要加上一个负号 

            var bonepos = cc.v2(this._getbone.bone[i].global.x, -this._getbone.bone[i].global.y);
            //计算每个骨骼与角度点之间的距离。
            var changdu2 = this._getDistance(bonepos, newpos);
            //开始变形了。变形应该是到0.4的样子。

            var offsetx = Math.cos(jiaodu * (Math.PI / 180)) * changdu2 * changdu / maxdistance * 0.6;
            var offsety = -Math.sin(jiaodu * (Math.PI / 180)) * changdu2 * changdu / maxdistance * 0.6;
            //给他一个反方向的力=变形长度/最大变形长度*1000；
            vx = -Math.cos(jiaodu * (Math.PI / 180)) * changdu / maxdistance * 1000;
            vy = -Math.sin(jiaodu * (Math.PI / 180)) * changdu / maxdistance * 1000;

            this._getbone.bone[i].offset.x = offsetx;
            this._getbone.bone[i].offset.y = offsety;
        }
    },
});
