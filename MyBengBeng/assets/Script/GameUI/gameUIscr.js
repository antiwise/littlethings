cc.Class({
    extends: cc.Component,

    properties: {
        gameover: cc.Node,
        gamenext: cc.Node,
        gamerestart: cc.Node,
        xingdonghua: cc.Animation,
        clickaudio: cc.AudioSource,
    },




    Gameover() {
        gameState = 3;   //死亡
        this.gameover.active = true;
    },

    Gamenext() {
        gameState = 4;    //成功
        this.gamenext.active = true;
        if (heroData.xingxing == 3) {
            this.xingdonghua.play("guankaxingxing3");
        };
        if (heroData.xingxing == 2) {
            this.xingdonghua.play("guankaxingxing2");
        };
        if (heroData.caidan) {
            this.gamenext.getChildByName('caidan').active = true;
        };
    },

    onclicksound() {
        this.clickaudio.play();
    },

    onclickres() {
        this.gamerestart.active = true;
    },

    onclickresclose() {
        this.gamerestart.active = false;
    },

    Onclickbegin() {
        q_moshi = 1;
        var xx = new chushi;
        cc.director.loadScene("game");
    },//点击无限模式

    Onclicknext() {
        q_moshi = 1;
        q_xuanzheguanka++;
        var xx = new chushi;
        cc.director.loadScene("game");
    },//点击开始下一关


    Onclickhome() {
        cc.director.loadScene("mainScence");
    },//点击无限模式


});
