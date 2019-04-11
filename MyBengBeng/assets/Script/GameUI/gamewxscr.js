cc.Class({
    extends: cc.Component,

    properties: {
        thanknode: cc.Node,
        fenxiangid: null,
        animation: cc.Animation,
        helpbox: cc.Node,
    },

    start() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
            if (gameclub)
                gameclub.hide();

        // this.animation=this.thanknode.getCompent(cc.Animation);
    },




    fenxiang() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            this.animation.off('finished', this.fenxiang, this);
            this.thanknode.active = false;

            if (this.fenxiangid = 1) {
                window.wx.shareAppMessage({
                    title: "嗯!挺有意思的，你也一起来吧！",
                    imageUrl: ('https://myres-1256148877.cos.ap-chengdu.myqcloud.com/help/fenxiang.png')
                });
            }

            if (this.fenxiangid = 2) {
                window.wx.shareAppMessage({
                    title: "游戏太难了，快来帮帮我",
                    imageUrl: ('https://myres-1256148877.cos.ap-chengdu.myqcloud.com/help/fenxiang.png')
                });
            }
        }
    },

    fenxiangwin() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            this.fenxiangid = 1;
            this.playanim();
        }
    },


    Onclickhelp() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            if(q_xuanzheguanka<20)   //这里暂时选择关卡ID小于20.那么免费帮助。
                {
                heroData.help=true;
                q_moshi = 1;
                var xx = new chushi;
                cc.director.loadScene("game");
                }; 
            qudaoscr.showAD();   //以后取得广告后加载。
        }

        if (cc.sys.os == cc.sys.OS_ANDROID)  //如果是安卓系统
        {
            this.helpbox.active = true;
           // anysdkscr.showAD();
        } 

    },//点击开始下一关

    onclickOK() {
        //   if (cc.sys.os == cc.sys.OS_ANDROID)  //如果是安卓系统
        {
            this.helpbox.active = false;
            if (q_xuanzheguanka < 20)   //这里暂时选择关卡ID小于20.那么免费帮助。
            {
                heroData.help = true;
                q_moshi = 1;
                var xx = new chushi;
                cc.director.loadScene("game");
            };
        }
    },


    fenxianglose() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)   //如果是微信小游戏系统
        {
            this.fenxiangid = 2;
            this.playanim();
        }
    },
    playanim() {
        this.thanknode.active = true;
        var anim = this.animation.play("b1");
        anim.repeatCount = 2;
        anim.speed = 2;
        this.animation.on('finished', this.fenxiang, this);
    }

    // update (dt) {},
});
