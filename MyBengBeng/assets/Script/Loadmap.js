const Camerascript = require('Cameragensui');
const starScr = require('starScr');
var mapsize;
cc.Class({
    extends: cc.Component,

    properties: {
        canvas:cc.Node,
        heronode:cc.Node,
        tilemap01: cc.Node,
        zhangainode: cc.Node,
        starnode:cc.Node,
        backgroud:cc.Node,
        backbg:cc.Node,
        juqingsound:cc.Node,
        helpnode:cc.Node,
        zhangaiprefab:cc.Prefab,
        tanlizhangai:cc.Prefab,
        zhanprefab:cc.Prefab,
        chuanprefab:cc.Prefab,
        tanprefab:cc.Prefab,
        starprefab:cc.Prefab,
        doorprefab:cc.Prefab,
        jianprefab:cc.Prefab,
        objprefab:cc.Prefab,
        yuanfrefab:cc.Prefab,
        camerascript:Camerascript,
        starscr:starScr,
    },



   onLoad () {
    if (q_moshi == 1)      //关卡模式
    {
        var url='Map/guan'+q_xuanzheguanka;
        this.onLoadTileMap(url, this.tilemap01);
        
    }
    

   },

    start () {

    },

    update (dt) {

    },


    onLoadTileMap(url, tilednode) {

        cc.loader.loadRes(url, cc.TiledMapAsset, (err, tmxAsset) => {
            if (err) {
                cc.error(err);
                return;
            }//**********************这里是初始化加载成功了。然后要初始化函数。***************************************/
            
            this.onCreateTileMap(tmxAsset, tilednode);
           
            this.camerascript.init();
            this.starscr.init();
            var heroscr=this.heronode.getComponent("Hero");
            heroscr.init();
            this.canvas.setLocalZOrder(-1);           
        });
    },

    onCreateTileMap(tmxAsset, tilednode) {

        var tileMap = tilednode.getComponent(cc.TiledMap);

        tileMap.tmxAsset = tmxAsset;
        
        mapsize=cc.size(tileMap.getMapSize().width*20,tileMap.getMapSize().height*20);

        tilednode.setPosition(tileMap.getMapSize().width*10+y_mapweizhi.x, tileMap.getMapSize().height*10+y_mapweizhi.y);  //地图块高度*32/2就得到地图中心店
       
        this.Setzhangai(tileMap);    //设置障碍位置。
        this.Setbianjie(tileMap, tilednode);//设置边界的坐标点。
        //设置背景图片的长宽为止。
        {
        this.backgroud.width=tileMap.getMapSize().width*20+60;
        this.backgroud.height=tileMap.getMapSize().height*80;
        this.backgroud.position=cc.v2(tilednode.position.x,-30);


        this.backbg.width=tileMap.getMapSize().width*20+1500;
        this.backbg.height=tileMap.getMapSize().height*80+1500;
        this.backbg.position=cc.v2(tilednode.position.x,-1500); 
        }
        var groups = tileMap.getObjectGroup("duixiang");  
         groups.enabled=false;    //这里就把对象层删除掉.不可见就行了。不然报错
         //运行完毕后更新地图新位置

         //反正都是只有一张地图，所以地图位置没有必要改变
       // y_mapweizhi.x += tileMap.getMapSize().width * 20;     
      //  y_mapweizhi.y += tileMap.getMapSize().height * 20;   
    },

    Setbianjie(tileMap, tilednode)
    {
        var mingcheng=tilednode.name;
        if (mingcheng=='map01')
        {
            bianjie1.x1=tilednode.getPosition().x-tileMap.getMapSize().width*10;
            bianjie1.x2=tilednode.getPosition().x+tileMap.getMapSize().width*10;
            
            bianjie1.y1=tilednode.getPosition().y-tileMap.getMapSize().height*10;
            bianjie1.y2=tilednode.getPosition().y+tileMap.getMapSize().height*10;
        }
/*         if (mingcheng=='map02')
        {
            bianjie2.x1=tilednode.getPosition().x-tileMap.getMapSize().width*10;
            bianjie2.x2=tilednode.getPosition().x+tileMap.getMapSize().width*10;
            
            bianjie2.y1=tilednode.getPosition().y-tileMap.getMapSize().height*10;
            bianjie2.y2=tilednode.getPosition().y+tileMap.getMapSize().height*10;
        }   */
    },

    Setzhangai(tileMap) {
        var group = tileMap.getObjectGroup("duixiang"); 
        if (group===null)    
        return;
        var obj = group.getObjects();
        for (var i = 0; i < obj.length; i++) {
            switch (obj[i].name) {
                case "floor":
                this.setprefab(obj[i],this.zhangaiprefab,1,this.zhangainode);             
                break;

                case "floordy":
                this.setprefab(obj[i],this.zhangaiprefab,1,this.zhangainode,true);             
                break;

                case "tanlizhangai":
                this.setprefab(obj[i],this.tanlizhangai,1,this.zhangainode);
                break;

                case "chuan":
                this.setprefab(obj[i],this.chuanprefab,1,this.zhangainode);
                break;

                case "zhan":
                this.setprefab(obj[i],this.zhanprefab,1,this.zhangainode);
                break;

                case "jian":
                this.setprefab(obj[i],this.jianprefab,1,this.zhangainode);
                break;

                case "star":
                this.setprefab(obj[i],this.starprefab,2,this.starnode);
                break;

                case "caidan":
                this.setprefab(obj[i],this.tanprefab,2,this.zhangainode);
                break;

                case "door":
                this.setprefab(obj[i],this.doorprefab,2,this.zhangainode);
                break;

                case "xiantiao":
                this.setxiantiao(obj[i],this.zhangaiprefab,this.zhangainode);
                break;

                case "hero":
                //设置hero坐标。
                this.heronode.setPosition(obj[i].offset.x,mapsize.height-obj[i].offset.y-obj[i].objectSize.height/2);

                break;
                
                case "map":
                var properties=obj[i].getProperties();
                mapxingxing.caidan=properties.caidan;
                mapxingxing.step1=parseInt(properties.step1);
                mapxingxing.step2=parseInt(properties.step2);
                mapxingxing.step3=parseInt(properties.step3);
                mapxingxing.maxstep= mapxingxing.step1+ mapxingxing.step2+ mapxingxing.step3;

                if (properties.help=='true'||heroData.help)
                {
                    heroData.help=false;
                    var helpscr=this.helpnode.getComponent('helpscr');
                    helpscr.init();
                }


                break;
                case "objst":
                this.setobj(obj[i],this.objprefab,0);
                break;
                case "objdy":
                this.setobj(obj[i],this.objprefab,1);
                break;

                case "yuanst":
                this.setyuan(obj[i],this.yuanfrefab,0);
                break;
                case "yuandy":
                this.setyuan(obj[i],this.yuanfrefab,1);
                break;

                case "juqing":
                this.loadjuqing(obj[i]);
                break;

                default:
            }
        }    
    },

    loadjuqing(obj)
    {
        var properties=obj.getProperties();
        var self=this;

         cc.loader.loadRes("Sound/"+properties.yinyue,cc.AudioClip, function (err, clip) {
             yinyue=clip;
             var audio=self.juqingsound.getComponent(cc.AudioSource);
             audio.clip=yinyue; 
        });

        
  
        youjuqing=true;
        //剧情碰撞体为矩形。
        var zuobiaoxie=self.getzuobiao1(obj);
        var xx=zuobiaoxie[0]-zuobiaoxie[2]/2;
        var yy=zuobiaoxie[1]-zuobiaoxie[3]/2;

        juqingrect=cc.rect(xx,yy,zuobiaoxie[2],zuobiaoxie[3]);
      
        shuxing=JSON.parse(properties.type);
        tiaojianscr=JSON.parse(properties.tiaojian);
        
    },


    setyuan(obj,prefab,leixing)
    {
        var radius=obj.objectSize.width/2;
        var  thenode = cc.instantiate(prefab);
        thenode.parent=this.zhangainode;
        var zuobiao=this.getposition(obj);
        zuobiao=cc.pAdd(zuobiao,cc.v2(radius,-radius));     //圆的坐标点是左上角
        thenode.setPosition(zuobiao);
        var yuanscr=thenode.getComponent("yuanscr");
        yuanscr.init(radius,leixing);


    },

    setobj:function(obj,prefab,leixing){
        var properties=obj.getProperties();
        var points=properties.points;
        var  thenode = cc.instantiate(prefab);
        thenode.parent=this.zhangainode;
        var zuobiao=this.getposition(obj);
        thenode.setPosition(zuobiao);
        var grapscr=thenode.getComponent("Grapscr");
        grapscr.init(points,leixing);
    },

    setxiantiao:function(obj,prefab)
    {
        var properties=obj.getProperties();
        var points=properties.polylinePoints;
        var node = new cc.Node('xiantiaoxie');
        node.parent=this.zhangainode;
        var zuobiaoxie=this.getzuobiao1(obj);
        node.setPosition(zuobiaoxie[0],zuobiaoxie[1]);  //这是主线条的坐标
        //tiledmap  Y轴计算方式是相反的。
        for (var i=0;i<points.length;i++)
        {
            points[i].y=-points[i].y;
        };
        for (var i=0;i<points.length-1;i++)
        {
            
            var changdu=cc.pDistance(points[i+1],points[i])+6;
            var jiaodu=this._getAngle(cc.pSub(points[i+1],points[i]));
            jiaodu=-jiaodu;
            var  thenode = cc.instantiate(prefab);
            thenode.parent=node;
            //设置中心点
            var zhongxindian=cc.pMidpoint(points[i+1],points[i]);
            thenode.setPosition(zhongxindian.x,zhongxindian.y);
            //设置旋转角度
            thenode.rotation=jiaodu;
            //设置长宽。
               {
                thenode.width=changdu;
                thenode.height=10;
                //设置物理系统长宽。并且应用。
                var phybox=thenode.getComponent(cc.PhysicsBoxCollider);
                phybox.size.width=changdu;
                phybox.size.height=10;
                phybox.apply();
                }             
        }
    },

    setprefab:function(obj,prefab,leixing,parentnode,type)
    {
        var properties=obj.getProperties();
        var zuobiaoxie=this.getzuobiao1(obj);   
        //将障碍预制件载入，并且设置其父节点为障碍NODE             
        var  thenode = cc.instantiate(prefab);
        thenode.parent=parentnode;
        //设置中心点
        thenode.setPosition(zuobiaoxie[0],zuobiaoxie[1]);
        //设置长宽，旋转角度
        thenode.rotation=zuobiaoxie[4];
        if (leixing==1)
        {
        thenode.width=zuobiaoxie[2];
        thenode.height=zuobiaoxie[3];
        //设置物理系统长宽。并且应用。
        var phybox=thenode.getComponent(cc.PhysicsBoxCollider);
        phybox.size.width=zuobiaoxie[2];
        phybox.size.height=zuobiaoxie[3];
        phybox.apply();
        }
         //最后一个参数true表明是活动的。
        if (type)
        {
            var rigidbody=thenode.getComponent(cc.RigidBody);
            rigidbody.type = cc.RigidBodyType.Dynamic;
            thenode.color = cc.hexToColor('#D2DD53');

        };
         //只有一个点的情况。
        if (properties.x1!=undefined&&properties.x2==undefined)
        {
          var movescr=thenode.addComponent('Moveto');
           //重力设置为100是移动的刚体。只是一个标志而已。反正重力也用不着。
          var rigbox=thenode.getComponent(cc.RigidBody);
          rigbox.gravityScale=100;
         // var pos=cc.v2(zuobiaoxie[0],zuobiaoxie[1]);
          var movepos1=cc.v2(parseInt(properties.x1),parseInt(properties.y1));
          movescr.setmoveto(movepos1);
          //cc.log(obj.getProperties());
        }
        //有两个点的情况。
        if (properties.x1!=undefined&&properties.x2!=undefined)
        {
            var movescr=thenode.addComponent('Moveto');
            var rigbox=thenode.getComponent(cc.RigidBody);
            rigbox.gravityScale=100;
          //  var pos=cc.v2(zuobiaoxie[0],zuobiaoxie[1]);
        
            var movepos1=cc.v2(parseInt(properties.x1),parseInt(properties.y1));
            var movepos2=cc.v2(parseInt(properties.x2),parseInt(properties.y2));
            movescr.setmoveto2(movepos1,movepos2);
        }

    },

    getposition(obj)
    {
        var retposition= cc.v2(obj.offset.x,mapsize.height-obj.offset.y)
        return retposition;
    },

    getzuobiao1(obj)
    {
       var properties=obj.getProperties();
       var  x=obj.offset.x+y_mapweizhi.x;         //左x
       var  y=mapsize.height-obj.objectSize.height-obj.offset.y+y_mapweizhi.y;    //下y



       var  xx=obj.offset.x+obj.objectSize.width+y_mapweizhi.x;  //右x
       var  yy=mapsize.height-obj.offset.y+y_mapweizhi.y;            //上y
      
       //this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180/Math.PI);
       var zhongxinx=(x+xx)/2;
       var zhongxiny=(y+yy)/2;
       //通过360的角度得到弧度进行sin，cos运算。
       var jiaodu=-properties.rotation* (Math.PI / 180);

         //以x，yy为中心。原中心点为旋转。进行旋转。
       var positonx=(zhongxinx-x)*Math.cos(jiaodu) -(zhongxiny-yy)*Math.sin(jiaodu)+x;
       var postiony=(zhongxiny-yy)*Math.cos(jiaodu) +(zhongxinx-x)*Math.sin(jiaodu)+yy;

        //输出为中心点坐标。长度宽度，旋转角度。
       var ret=[positonx,postiony,obj.objectSize.width,obj.objectSize.height,properties.rotation];
        return ret;
    },

    _getAngle: function(point)
    {
        
        //var pos = this.node.getPosition();
        var pos = cc.v2(0,0);
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180/Math.PI);
        return this._angle;
    },


});
