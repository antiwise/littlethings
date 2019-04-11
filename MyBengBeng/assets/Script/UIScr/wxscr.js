
cc.Class({
    extends: cc.Component,

    properties: {
        thanknode: cc.Node,
        animation: cc.Animation,
        paihangnode:cc.Node,
        paihangbtnprab:cc.Prefab,
        paihangView: cc.Sprite,
        guankanode:cc.Node,
        helpnode:cc.Node,
        setnode:cc.Node,
        
    },


    onLoad() {    
     if (cc.sys.platform == cc.sys.WECHAT_GAME)  
     {
     //qudaoscr.loadAD();              //代码已经写好。取得广告后加载。
     this.tex = new cc.Texture2D();
     window.sharedCanvas.width = 960;
     window.sharedCanvas.height = 640;
     }

/*      if(cc.sys.os == cc.sys.OS_ANDROID) //如果是安卓系统
     {
        anysdkscr.chushihua();
     } */
    },

    start() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {

            if (gameclub)
                gameclub.show();
            else {
                gameclub = window.wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: 15,
                        top: 120,
                        width: 50,
                        height: 50
                    }
                });
            }
        }
    },

    fenxiang() {
        this.animation.off('finished', this.fenxiang, this);
        this.thanknode.active = false;
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            window.wx.shareAppMessage({
                title: "这游戏很好玩，快来和我一起玩吧",
                imageUrl: ('https://myres-1256148877.cos.ap-chengdu.myqcloud.com/help/fenxiang.png')
            });
        }
    },

    clickfenxiang() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            this.playanim();
        }
    },

    playanim() {
        this.thanknode.active = true;
        var anim = this.animation.play("b2");
        anim.repeatCount = 3;
        anim.speed = 1;
        this.animation.on('finished', this.fenxiang, this);
    },

    onclosepaihang(){
     this.paihangnode.active=false;
     this.helpnode.active=true;
     this.setnode.active=true;
     this.guankanode.active=true;
    },

    onclickpaihang(){
        if(cc.sys.platform==cc.sys.WECHAT_GAME) {
            // 发消息给子域
            this.paihangnode.active=true;
            this.helpnode.active=false;
            this.setnode.active=false;
            this.guankanode.active=false;
            window.wx.postMessage({
                messageType: 1,
            });
        } 
    },
   

    onclickxingxing(){
        if(cc.sys.platform==cc.sys.WECHAT_GAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
            });
        } 
    },

    onclickcaidan(){
        if(cc.sys.platform==cc.sys.WECHAT_GAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 2,
            });
        } 
    },

    _updateSubDomainCanvas() {
        if(cc.sys.platform==cc.sys.WECHAT_GAME&&this.paihangnode.active) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.paihangView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update (dt) {
       this._updateSubDomainCanvas(); 
    },
});
