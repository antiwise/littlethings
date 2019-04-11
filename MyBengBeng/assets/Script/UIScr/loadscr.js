var userbutton;
var self;
var isclick = false;
cc.Class({
    extends: cc.Component,

    properties: {
        jiazainode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var pingmusize = cc.view.getFrameSize();
        this.gamewidth = pingmusize.width / 2 - 50;
        this.gameheigth = pingmusize.height / 2 - 20;
        self = this;
        self.chushishuju();

        
        if (cc.sys.os == cc.sys.OS_ANDROID)
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.back:
                cc.director.end();
                break;
        }
    },

    chushishuju() {
        var shuju = cc.sys.localStorage.getItem('userData');
        if (!shuju)            //如果没有用户数据。重新写入。
        {
            self.newUser();
            cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                cc.director.preloadScene("mainScence");
                cc.director.preloadScene("game");
                this.jiazainode.active = true;
            }
        }
        else {
            userData = JSON.parse(shuju);
        }
    },

    newUser() {
        //初始化关卡。
        var guanka = {
            xingxing: 0,
            step: 10000,
            caidan: false,
            suoding: false,
        }
        userData.guanka[0] = guanka;
        for (var i = 1; i < userData.guankan; i++) {
            var guanka = {
                xingxing: 0,
                step: 10000,
                caidan: false,
                suoding: true,
            }
            userData.guanka[i] = guanka;
        }
        //初始化皮肤
        //初始化尾巴
    },

    clickguankamoshi() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME)    //如果微信系统。申请用户授权
        //如果已获取授权，那么直接进入。
        {

            if (userData.firstgame)
                wx.authorize({           //第一次授权。启动。以后不启动。
                    scope: "scope.userInfo",
                    success: function () {
                        cc.director.loadScene("mainScence");
                    },
                    fail: function () {
                    },
                    complete: function () {
                        userData.firstgame = false;
                        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
                    }
                })
            else {
                var user = false;
                wx.getSetting({
                    success: (res) => {
                        user = res.authSetting["scope.userInfo"];
                        if (user) {
                            cc.director.loadScene("mainScence");
                        }
                        else {
                            if (isclick)
                                return;

                            isclick = true;
                            this.textclick();
                        }
                    }
                });
            }
        }
        else   //其他系统，直接开始
        {
            cc.director.loadScene("mainScence");
        };
    },

    textclick() {
        userbutton = wx.createUserInfoButton({
            type: 'text',
            text: '登录',
            style: {
                left: this.gamewidth,
                top: this.gameheigth,
                width: 100,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#1F9741',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 20,
                borderRadius: 4
            }
        });
        userbutton.onTap(this.callback);
    },

    callback() {
        //  console.log('点击了获取用户信息按钮')
        userbutton.hide();
        self.clickguankamoshi();
        isclick = false;
    },

});

