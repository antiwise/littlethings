const gameUIscr = require('gameUIscr');
var stayn = 0;
var self;
cc.Class({
  extends: cc.Component,

  properties: {
    herophy: cc.PhysicsCircleCollider,
    rigidbody: cc.RigidBody,
    gameuiscr: gameUIscr,
    starnode: cc.Node,
    juqingaduio: cc.AudioSource,
    jumpaduio: cc.AudioSource,
    winaduio: cc.AudioSource,
    loseaduio: cc.AudioSource,
    bgaduio: cc.AudioSource,
    heroanim: dragonBones.ArmatureDisplay,
    girlanim: dragonBones.ArmatureDisplay,
    girlnode: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // this.oldparent=this.node.parent;
    self = this;
  },

  init() {
    this.girlnode = this.starnode.children[0];
    if (!userData.yinyue) {
      this.bgaduio.stop();
    }
    else { this.bgaduio.play(); }
  },

  start() {
    //好像是是否启动监听碰撞的意思吧，碰撞检测必须要用
    cc.director.getCollisionManager().enabled = true;
  },

  update(dt) {
    if (gameState == 0)
      return;

    if (iswin) {
      if (!heroData.girldie) {
        this.rigidbody.type = cc.RigidBodyType.Static;
        this.girlnode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        if (gameState != 10)
          this.win();
      }
    };

    if (gameState == 2) {
      this.panduandead();


      if (heroData.state != 0)   //只有等于2的时候是运动的时候。去判断剧情。
        if (youjuqing)
          if (gameState != 10)
            this.panduanjuqing();
    }

    if (heroData.state != 0)   //这是表示未静止状态。判断连续10帧<0.000001就把状态修改为静止。
    {
      //  cc.log(cc.pLength(this.rigidbody.linearVelocity));

      if (cc.pLength(this.rigidbody.linearVelocity) < 1) {
        stayn++;                  //stay计数。大于10.那么表明是停留了。  

        if (stayn > 7) {
          heroData.state = 0;
          heroData.jumpcount = heroData.jumpcountn;
          stayn = 0;
        }
      }
    }
  },

  panduandead() {
    if (this.node.x < bianjie1.x1 - 20 || this.node.x > bianjie1.x2 + 20 || this.node.y < bianjie1.y1 - 20) {
      //然后应该是播放死亡动画。动画完毕弹出重新玩，分享。
      //暂时没有死亡动画。所以直接弹出结束界面。
      this.rigidbody.type = cc.RigidBodyType.Static;
      this.girlnode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
      this.lose();
    }
    if (this.girlnode.x < bianjie1.x1 - 20 || this.girlnode.x > bianjie1.x2 + 20 || this.girlnode.y < bianjie1.y1 - 20) {
      //然后应该是播放死亡动画。动画完毕弹出重新玩，分享。
      //暂时没有死亡动画。所以直接弹出结束界面。

      heroData.girldie = true;

      if (youjuqing)    //强势插入girldie的状态。
      {
        this.panduanjuqing();
        if (gameState == 10)
          return;
      }

      this.rigidbody.type = cc.RigidBodyType.Static;
      this.girlnode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
      this.lose();
    }
  },

  // 只在两个碰撞体开始接触时被调用一次  第一步
  onBeginContact: function (contact, selfCollider, otherCollider) {
    // isstay=true;
    this.panduan(otherCollider, contact);
    this.setnode(otherCollider);
    this.setzhan(otherCollider);
    // cc.log(otherCollider.tag);

  },

  // 只在两个碰撞体结束接触时被调用一次    第四步
  onEndContact: function (contact, selfCollider, otherCollider) {
    this.resetnode(otherCollider);
    this.resetzhan(otherCollider);
    // isstay=false;
  },

  // 每次将要处理碰撞体接触逻辑时被调用    第二步
  onPreSolve: function (contact, selfCollider, otherCollider) {
    /*         var  normal=contact.getWorldManifold().normal;  //暂时全部不要弹力
            if (heroData.state==1&&(normal.x==1||normal.x==-1))
            {
              contact.setRestitution(1);  //设置弹力
              contact.setFriction(0);    //设置摩擦力
              heroData.state=2;
            } */

  },

  // 每次处理完碰撞体接触逻辑时被调用    第三步
  onPostSolve: function (contact, selfCollider, otherCollider) {

  },

  win() {


    //this.rigidbody.type=cc.RigidBodyType.Static;  //这里是正在发生碰撞。所以不能动态修改。
    gameState = 4;                                     //*************这里还没有考虑过剧情的情况。不然有问题。******* */

    this.winaduio.play();
    this.bgaduio.stop();
    if (heroData.caidan)                                  //如果有彩蛋，那么写入
    {
      userData.guanka[q_xuanzheguanka].caidan = true;
      heroData.xingxing = 3;
    }
    if (heroData.xingxing > userData.guanka[q_xuanzheguanka].xingxing)  //破纪录了。然后还要加上金币。一个星星20gold。
    {
      userData.guanka[q_xuanzheguanka].xingxing = heroData.xingxing;
      qudaoscr.setscore();
    }
    userData.guanka[q_xuanzheguanka + 1].suoding = false;

    cc.sys.localStorage.setItem('userData', JSON.stringify(userData));   //储存。
    iswin = false;
    this.gameuiscr.Gamenext();
  },

  lose() {
    if (gameState == 5 || gameState == 4)
      return;
    gameState = 5;
    this.gameuiscr.Gameover();
    this.loseaduio.play();
    this.bgaduio.stop();
    this.rigidbody.gravityScale = 0;
    this.rigidbody.linearVelocity = cc.v2();
  },


  panduan(otherCollider, contact) {
    switch (otherCollider.tag) {
      case 10:      //star
        iswin = true;
        break;
      case 11:      //door

        break;
      case 3:        //jian
        this.lose();
        break;
      case 4:        //彩蛋
        heroData.caidan = true;
        contact.disabled = true;
        otherCollider.node.active = false;
        break;
      default:
    }
  },

  setzhan(otherCollider) {
    if (otherCollider.tag == 2) {
      this.rigidbody.gravityScale = 0;
      this.rigidbody.linearVelocity = cc.v2();
    }
  },

  resetzhan(otherCollider) {
    if (otherCollider.tag == 2) {
      this.rigidbody.gravityScale = 5;

    }
  },

  setnode(otherCollider) {
    if (otherCollider.getComponent(cc.RigidBody).gravityScale == 100) {
      var moveto = otherCollider.getComponent('Moveto');
      moveto.ishold = true;
    }

  },
  resetnode(otherCollider) {
    if (otherCollider.getComponent(cc.RigidBody).gravityScale == 100) {
      var moveto = otherCollider.getComponent('Moveto');
      moveto.ishold = false;
    }
  },

  fashe(vx, vy) {
    heroData.state = 1;
    this.rigidbody.linearVelocity = cc.v2(vx, vy);
    heroData.jumpcount = heroData.jumpcount - 1;
    this.jumpaduio.play();

  },

  isenter(times) {

    for (var i = 0; i < 10; i++) {
      var timer = times - 0.03 * i;
      var theposition = cc.v2(0, 0);
      theposition.x = this.rigidbody.linearVelocity.x * timer;
      theposition.y = (this.rigidbody.linearVelocity.y * 2 - 1600 * timer) * timer / 2;

      theposition = cc.pAdd(this.node.position, theposition);

      if (juqingrect.contains(theposition))
        return true;
    };
    return false;
  },

  settime() {
    var suofang = shuxing[buzhou].timescale / timescale;
    timescale = shuxing[buzhou].timescale;


    this.rigidbody.linearVelocity = cc.pMult(this.rigidbody.linearVelocity, suofang);
    this.rigidbody.gravityScale = this.rigidbody.gravityScale * suofang * suofang;

    var girlnode = this.girlnode;
    var girlrididbody = girlnode.getComponent(cc.RigidBody);
    girlrididbody.linearVelocity = cc.pMult(girlrididbody, suofang);
    girlrididbody.gravityScale = girlrididbody.gravityScale * suofang * suofang;
  },

  huanyuan() {
    if (gameState != 10)     //如果游戏是其他状态的话。不改变角色状态了。
      return;
    var suofang = 1 / timescale;
    timescale = 1;

    this.rigidbody.linearVelocity = cc.pMult(this.rigidbody.linearVelocity, suofang);
    this.rigidbody.gravityScale = 5;

    var girlnode = this.girlnode;
    var girlrididbody = girlnode.getComponent(cc.RigidBody);
    girlrididbody.linearVelocity = cc.pMult(girlrididbody, suofang);
    girlrididbody.gravityScale = 5;
    this.heroanim.playAnimation('waitxia');
    this.girlanim.playAnimation('girlwait');
  },

  setanim() {
    if (shuxing[buzhou].anim1 != 0) {
      switch (shuxing[buzhou].anim1) {
        case 1:
          this.heroanim.playAnimation('aixinboy');
          break;
        case 2:
          this.heroanim.playAnimation('jinjiao');
          break;
        case 3:
          // this.heroanim.playAnimation('getcaidan');          
          break;
      }
    };


    if (shuxing[buzhou].anim2 != 0) {
      switch (shuxing[buzhou].anim2) {
        case 1:
          this.girlanim.playAnimation('aixingirl');
          break;
      }
    };
  },

  loadjuqing() {

    if (buzhou == shuxing.length) {
      self.huanyuan();
      gameState = 2;
      buzhou = 0;
      youjuqing = false;   //让他只触发一次剧情。
      return;
    }

    //设置时间比例。即英雄与girl的重力，速度。修改。
    self.settime();
    //设置摄像机跟随函数。及其模式，及缩放比例。
    usetime = 0;
    //设置动画。
    self.setanim();
    //self.unscheduleAllCallbacks();
    self.scheduleOnce(self.xxx, shuxing[buzhou].time);    //回调函数不能调用自身，只能去调度另一个来实现该功能
    buzhou++;
  },

  xxx() {
    this.scheduleOnce(self.loadjuqing, 0);
  },

  panduanjuqing() {
    if (tiaojianscr.time) {                  //判断是否进入目标的条件。然后如果false那么结束。
      if (!this.isenter(tiaojianscr.time))
        return;
    }
    if (tiaojianscr.getcaidan) {                  //判断是否进入目标的条件。然后如果false那么结束。
      if (!heroData.caidan)
        return;
    }

    if (tiaojianscr.girldie) {                  //判断是否进入目标的条件。然后如果false那么结束。
      if (!heroData.girldie)
        return;
    }



    //启动剧情。
    this.heroanim = this.node.getChildByName('Heroanim').getComponent(dragonBones.ArmatureDisplay);
    this.girlanim = this.girlnode.getComponent(dragonBones.ArmatureDisplay);
    this.juqingaduio.play();
    this.bgaduio.stop();
    gameState = 10;
    this.loadjuqing();


  },



});
