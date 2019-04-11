var pianyi = 160;
var pianyix = 0;
var pianyiy = 160;
var iszoom = true;
var isyidong = true;
var maxsuofang = 0.6;
var vshudux, vshuduy, vscale;
var isanchor = false;
var oldposition = cc.v2(0, 0);
var herozuobiao = cc.v2(0, 0);


cc.Class({
    extends: cc.Component,

    properties: {
        heronode: cc.Node,
        camera: cc.Camera,
        canvas: cc.Node,
        beginnode: cc.Node,
        girlnode: cc.Node,
    },


    onLoad() {
        var self = this;
        self.chushihua();
        self.canvas.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, self); //注册触摸事件
        self.canvas.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, self);  //结束事件
        //根据屏幕获取偏移量
        // cc.log(cc.winSize);
        // cc.log(cc.view.getFrameSize());
    },

    chushihua() {
        pianyi = 160;
        pianyix = 0;
        pianyiy = 160;
        iszoom = true;
        isyidong = true;
        maxsuofang = 0.6;
    },


    init() {
        //初始化pianyix为止。根据屏幕大小来
        var pingmusize = cc.view.getFrameSize();
        pianyi = pianyi - (pingmusize.width / pingmusize.height - 1.5) * 320;
        pianyix = 480 - pianyi;

        //初始化最大缩放
        var nowwidth = pingmusize.width / pingmusize.height * 640;
        var mapwidth = bianjie1.x2 - bianjie1.x1 + 320;
        maxsuofang = nowwidth / mapwidth;

        //初始化camera位置及缩放大小
        var midx = (bianjie1.x2 + bianjie1.x1) / 2;


        var midy = 240 / maxsuofang;
       // var midy = this.heronode.position.y;
       if (midy<this.heronode.position.y)
       midy=this.heronode.position.y;

        this.node.position = cc.v2(midx, midy);
        this.camera.zoomRatio = maxsuofang;
        //
        gameState = 0;
        //cc.director.getScheduler().setTimeScale(0.4);
        //初始化girlnode；
        this.girlnode = cc.find("Lmap/star/star");
    },


    lateUpdate(dt) {
        // update(dt){

        if (gameState == 0)   //这是还没有启动
            return;

        if (gameState == 10)   //这是摄像机慢动作
        {
            this.juqingcamera(dt);
            return;
        };


        if (gameState == 1) {           //这是摄像机启动了。缓慢变换为主角位置。
            if (this.camera.zoomRatio < 1) {
                this.camera.zoomRatio = this.camera.zoomRatio + dt * vscale;

                var newposition = this.node.getPosition();
                newposition.x += dt * vshudux;
                newposition.y += dt * vshuduy;
                this.node.position = newposition;
            }
            else {
                gameState = 2;
                this.heronode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;  
                this.camera.zoomRatio = 1;
            }
            return;
        }


        // var heroposition = this.node.convertToWorldSpaceAR(this.heronode.getPosition());
        //heroposition=cc.v2(heroposition.x/2,heroposition.y/2);
        this.updateposition();
        this.resetzoom(dt);
    },

    juqingcamera(dt) {
        var k = buzhou - 1;
        if (shuxing[k].mubiao == 0)
            var gensuinode = this.heronode
        else
            var gensuinode = this.girlnode;

        if (shuxing[k].moshi == 0)  //直接改变了就OK。
        {
            this.camera.zoomRatio = shuxing[k].scale;
            this.juqingcameraposition(gensuinode);
        };



        if (shuxing[k].moshi == 1)  //渐变
        {
            var shengyutime = (shuxing[k].time - usetime);
            if (shengyutime != 0)  //排除等于0的情况。
            {
                //剩余变化/剩余时间。得到现在每秒变化多少。
                if (Math.abs(shuxing[k].scale - this.camera.zoomRatio)<0.01)
                {
                    this.camera.zoomRatio = shuxing[k].scale;
                    this.juqingcameraposition(gensuinode);
                }
                else
                {
                this.camera.zoomRatio += (shuxing[k].scale - this.camera.zoomRatio) / shengyutime * dt;            
                //剩余变化/剩余时间。得到现在每秒变化多少。      
                var shengyuposition = cc.pSub(gensuinode.position, this.node.position);
                shengyuposition = cc.pMult(shengyuposition, dt / shengyutime);
                this.node.position = cc.pAdd(this.node.position, shengyuposition);
               }
               
            }

        };
        usetime = dt + usetime;
    },

    juqingcameraposition(gensuinode) {
        this.node.setPosition(gensuinode.position);
    },

    panduanbianjiey(heroposition, moshi) {
        //var pianyiyy = pianyiy / this.camera.zoomRatio;
        var pianyiyy = pianyiy;


        if (heroposition.y <= bianjie1.y1 + pianyiyy)
            return bianjie1.y1 + pianyiyy;
        if (moshi == 1)
            if (heroposition.y >= bianjie1.y2 - pianyiyy)
                return bianjie1.y2 - pianyiyy;

        return heroposition.y;
    },

    panduanbianjiex(heroposition) {
        // var pianyixx = pianyix / this.camera.zoomRatio;
        var pianyixx = pianyix;

        if (heroposition.x <= bianjie1.x1 + pianyixx) {
            // cc.log(bianjie1.x1+320-pianyi);
            return bianjie1.x1 + pianyixx;
        }
        if (heroposition.x >= bianjie1.x2 - pianyixx) {

            return bianjie1.x2 - pianyixx;
        }
        //第一个240=一半屏幕距离-80留边+hero与摄像机之间相差了160。。第二个是=一半屏幕距离-80留边+hero与摄像机之间相差了160



        return heroposition.x;
    },

    //缩放后。缓慢变回的函数。
    resetzoom: function (dt) {
        if (iszoom) {
            if (this.camera.zoomRatio < 1)
                this.camera.zoomRatio = this.camera.zoomRatio + dt * 2
            else
                this.camera.zoomRatio = 1;
        }
    },

    updateposition: function () {
        if (isyidong) {
            var newposition = cc.v2(0, 0);
            newposition.x = this.panduanbianjiex(this.heronode.position);
            newposition.y = this.panduanbianjiey(this.heronode.position, 0);
            this.node.setPosition(newposition);
        }
    },

    jisuanv: function () {
        var newposition = this.heronode.position;
        newposition.x = this.panduanbianjiex(this.heronode.position);
        newposition.y = this.panduanbianjiey(this.heronode.position, 0);
        // this.node.setPosition(newposition);

        vscale = (1 - this.camera.zoomRatio) / 1.5;
        vshudux = (newposition.x - this.node.position.x) / 1.5
        vshuduy = (newposition.y - this.node.position.y) / 1.5

        this.beginnode.active = false;
    },

    _touchEndEvent: function () {
        if (gameState == 0) {
            gameState = 1;
            this.jisuanv();     
        };

        iszoom = true;
        isyidong = true;

        //恢复默认锚点；
        isanchor = false;
    },


    _touchMoveEvent: function (event) {
        if (gameState != 2)   //等于2表示启动好了
            return;
        if (heroData.state != 0)  //主角不是静止状态，禁止使用该功能
            return;

        var self = this;
        var touches = event.getTouches();


        if (touches.length <= 2)  //判断一个指头的情况移动摄像机。
            if (touchhero) {            //如果另一个手指按住了主角。那么缩放摄像机。并且主角屏幕点不变。
                if (!isanchor)     //让主角点变为摄像机锚点。
                {
                    herozuobiao = cc.pNeg(this.node.convertToNodeSpaceAR(this.heronode.position));//先直接把这个坐标取反
                    oldposition = this.node.position;
                    isanchor = true;
                    iszoom = false;
                    cc.log(this.heronode.position + '  ' + this.node.position)
                    cc.log(herozuobiao);
                }
                isyidong = false;
                if (this.camera.zoomRatio > 0.4) {
                    var delta = event.touch.getDelta();
                    var changdu = cc.pLength(delta);
                    this.camera.zoomRatio = this.camera.zoomRatio - changdu / 600;//放大缩小，增量。

                    //位移变化。先算出初始相对距离。然后缩放
                    this.node.position = cc.pAdd(oldposition, cc.pMult(herozuobiao, 1 / (this.camera.zoomRatio) - 1));
                }

                return;
            };

        if (touches.length == 1)  //判断一个指头的情况移动摄像机。
        {
            isyidong = false;
            var delta = event.touch.getDelta();
            var newposition = cc.v2((self.node.x + delta.x * 3), self.node.y + delta.y * 3);
            self.node.x = this.panduanbianjiex(newposition);
            self.node.y = this.panduanbianjiey(newposition, 0);

        };

    },

    /*   取消掉双指缩放功能。没有单指看地图的好
        if (touches.length >= 2)//这是双指。缩放摄像机。
        {
            iszoom = false;
            var touch1 = touches[0].getLocation(), touch2 = touches[1].getLocation();
            var stouch1 = touches[0].getStartLocation(), stouch2 = touches[1].getStartLocation();
            var distance = cc.pDistance(stouch1, stouch2);
            var nowdistance = cc.pDistance(touch1, touch2);
            var scale = 1;
            // cc.log(nowdistance - distance);
            if (distance - nowdistance > 0) {
                var maxdis = 400;
                var changdu = distance - nowdistance > maxdis ? maxdis : distance - nowdistance;
                cc.log(changdu);
                scale = maxsuofang * changdu / maxdis;
                self.camera.zoomRatio = scale;
    
            }
        } */


    /*          _touchMoveEvent: function(event){
              var self=this;
              var touches = event.getTouches();
              if (touches.length >= 2) {
                  var touch1 = touches[0], touch2 = touches[1];
                  var delta1 = touch1.getDelta(), delta2 = touch2.getDelta();
                  var touchPoint1 = self.node.convertToNodeSpaceAR(touch1.getLocation());
                  var touchPoint2 = self.node.convertToNodeSpaceAR(touch2.getLocation());
                  //缩放
                  var distance = cc.pSub(touchPoint1, touchPoint2);
                  var delta = cc.pSub(delta1, delta2);
                  var scale = 1;
                  if (Math.abs(distance.x) > Math.abs(distance.y)) {
                      scale = (distance.x + delta.x) / distance.x * self.camera.zoomRatio;;
                  }
                  else {
                      scale = (distance.y + delta.y) / distance.y * self.camera.zoomRatio;
                  }
                  self.camera.zoomRatio = scale < 0.4 ? 0.4 : scale;
                  self.camera.zoomRatio = scale > 1.5 ? 1.5: scale;
              }
             },  */
});
