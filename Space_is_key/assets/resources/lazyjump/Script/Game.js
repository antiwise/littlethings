cc.Class({
    extends: cc.Component,

    properties: {
        //方块角色
        playerPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 碰撞后溅射的小方块
        bongPrefab:{
            default:null,
            type: cc.Prefab
        },
        // 关卡进度显示
        levelPrefab:{
            default:null,
            type: cc.Prefab
        },
        // 返回菜单按钮
        toMenuPrefab:{
            default:null,
            type: cc.Prefab
        },
        //方块移动方向
        direction:1,
        //方块在该场景中所在的层数
        level:1,
        //游戏现在所在的关卡数
        gameLevel:1,

        //当前关卡数 menu，1,2,3,4,5 - 10
        _levelCur: null,
        //玩家速度
        _playerMoveDuration: null,
        //玩家当前level获得的star
        _starGet:0,
    },
    onLoad: function () {
        this._starGet = 0;
        // 打开碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        
        // 得到当前的关卡数
        this._levelCur = cc.director.getScene().children[0].name;
        this.gameLevel = parseInt(this._levelCur.replace("Level",""));
        
        var self = this;
        //取得背景容器
        var bgcontainer = this.node.getChildByName("bgcontainer");
        this.bg1 = bgcontainer.getChildByName("bg1");
        this.bg2 = bgcontainer.getChildByName("bg2");
        this.bg3 = bgcontainer.getChildByName("bg3");

        //创建cube
        this.createPlayer(-this.node.width/2, this.node.height/6);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;
        
        
       

        // 位于菜单场景中特定的快速移动
        if(this._levelCur == "Menu"){
            this.gameLevel = 0;
            this._playerMoveDuration = 2;
        }else  if(this.gameLevel >= 6 ){// 第6关之后方块移动加速
            this._playerMoveDuration = 3.5;
        }else
        {
            this._playerMoveDuration = 4;
        }
        this.player.getComponent('Player').moveDuration = this._playerMoveDuration;
        // 方块移动
        this.movePlayer(this.direction);
        
        if(this.gameLevel>0){
            // 显示关卡进度
            var levelPrefab = cc.instantiate(this.levelPrefab);
            this.node.addChild(levelPrefab);
            levelPrefab.setPosition(cc.p(0,290));
            levelPrefab.color = this.bg2.color;
            levelPrefab.getComponent(cc.Label).string = this.gameLevel + "/10";
            //显示返回菜单
            var toMenuPrefab = cc.instantiate(this.toMenuPrefab);
            this.node.addChild(toMenuPrefab);
            toMenuPrefab.setPosition(cc.p(420,290));
            toMenuPrefab.color = this.bg2.color;
        }else{
           
        }
        
        //设置小方块初始颜色
       // this.player.color = this.bg2.color;
        
        // 监听方块成功走完一层的事件
        this.node.on("moveEnd",function(){
            self.level++;
            if(self.level > 3){
                self.gameOver();
            }else{
               self.direction = -self.direction;
               self.restart(self.level); 
            }
        });
        // 监听方块碰撞事件
        this.node.on("collision",function(e){
            var x = e.target.x;
            var y = e.target.y;
            self.toBong(x, y);
            self.restart(self.level);
        });
        // 监听星星获得
        this.node.on("starGet",function(e){
            self._starGet = self._starGet + 1;
            console.log(self._levelCur,self._starGet);
        });
        //监听屏幕触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,function(){
            self.touch();
        });
    },
    // 屏幕触摸时小方块跳跃
    touch: function(){
        if(this.gameLevel > 0){
            this.player.getComponent('Player').jump();
        }
    },
    // 移动方块函数
    movePlayer:function(direction){
        this.player.getComponent('Player').goMove(direction);
    },
    //创建方块角色函数
    createPlayer:function(x,y){
        this.player = cc.instantiate(this.playerPrefab);
        this.node.addChild(this.player);
        this.player.setPosition(cc.p(x,y+this.player.height*0.5));
    },
    // 创建碰撞碎片函数
    createBong:function(x,y){
        var bong = cc.instantiate(this.bongPrefab);
        this.node.addChild(bong);
        bong.setPosition(cc.p(x,y));
        this.bongDestroy(bong);
        bong.color = this.player.color;
        return bong;
    },
    // 碰撞产生碎片
    toBong:function(x,y){
        var n = parseInt(Math.random()*10+5);
        for(var i = 0; i < n; i++){
            var length = Math.random()*150+80;
            var deg = Math.random()*360;
            var vx = length*Math.cos(deg);
            var vy = length*Math.sin(deg);
            var move = cc.moveBy(1,cc.p(vx,-vy)).easing(cc.easeCubicActionOut());
            var scale = cc.scaleBy(1, 0.2, 0.2);
            this.createBong(x, y).runAction(move);
        }
    },
    // 销毁碰撞碎片
    bongDestroy:function(bong){
        var time = Math.random()*300+bong.getComponent('bong').endTime*1000;
        setTimeout(function(){bong.destroy();},time);
    },
    // 重新开始该层
    restart:function(level){
        this.player.destroy();
        this.createPlayer(-(this.direction*this.node.width/2+this.player.width/2),this.node.height/2-level*this.node.height/3);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;
        this.player.getComponent('Player').moveDuration = this._playerMoveDuration;
        
        this.movePlayer(this.direction);
        if(level == 1 || level == 3){
            //设置小方块颜色
            //this.player.color = this.bg2.color;
            this.player.scaleX = 1;
            this.player.getComponent('Player').directionTo = 1;
        }
        if(level == 2){
            //设置小方块颜色
            //this.player.color = this.bg3.color;
            //设置小方块转向
            this.player.scaleX = -1;
            this.player.getComponent('Player').directionTo = -1;
        }
    },
    gameOver:function(){
        cc.fy.JumpData.updateLevelData(this.gameLevel,this._starGet);
        // 进入下一关卡
        if(this.gameLevel !== 0){
            this.gameLevel++;
            cc.director.loadScene('Level'+this.gameLevel);
        }else{
            this.player.destroy();
        }
        // 通过最后一关后返回菜单
        if(this.gameLevel == 10){
            cc.director.loadScene("Menu");
        }
       
    },

});
