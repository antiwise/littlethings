var self;
cc.Class({
    extends: cc.Component,

    properties: {
        guankaprb: cc.Prefab,
        guankalock: cc.Prefab,
        guankapnode: cc.Prefab,
        caidanpreb: cc.Prefab,
        guankastrnode:cc.Prefab,
        content: cc.Node,
        target: cc.PageView,
        tanchuan: cc.Node,
        toggle1: cc.Node,
        toggle2: cc.Node,
        close: cc.AudioSource,
        click: cc.AudioSource,
        fanye: cc.AudioSource,

        bgaudio: cc.AudioSource,
        ban: cc.Node,

        guankaanim: cc.Animation,
        setanim: cc.Animation,
        helpanim: cc.Animation,
        xingxinglabel: cc.Label,
        caidanlabel: cc.Label,
        helpnode: cc.Node,
        exitnode:cc.Node,
    },



    onLoad() {
        self = this;
        //cc.sys.localStorage.setItem('userData', JSON.stringify(userData));   //储存数据
        // cc.sys.localStorage.removeItem('userData')                        //删除数据
        self.chushiShuju();
        //console.log(cc.sys.os);
        if (cc.sys.os == cc.sys.OS_ANDROID)
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.exitshow, self);
    },

    exitclick(event) {
     cc.director.end();
    },

    exitshow(){
        this.exitnode.active=true;
    },

    exithide(){
        this.exitnode.active=false;
    },

    callback: function (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "foobar"
    },

    chushiShuju() {
        //var shuju = JSON.parse(cc.sys.localStorage.getItem('userData'));       //读取数据
        var shuju = cc.sys.localStorage.getItem('userData');
        if (!shuju)            //如果没有用户数据。重新写入。
        {
            self.newUser();
            cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        }
        else {
            userData = JSON.parse(shuju);
        }
        self.jiazaiguanka();
        self.loadxingxingshu();
        self.scheduleOnce(self.qiehuan, 0.3);  //千万注意回调函数不能写括号

        if (userData.caozuomoshi == 1) {
            self.toggle1.active = false;
            self.toggle2.active = true;
        }
        else {
            self.toggle1.active = true;
            self.toggle2.active = false;
        }

        if (userData.yinyue) {
            self.ban.active = false;
            this.bgaudio.play();
        }
        else {
            self.ban.active = true;
            this.bgaudio.stop();
        }

    },

    qiehuan: function () {
        var page = Math.floor(q_xuanzheguanka / 18)
        self.target.scrollToPage(page);
    },


    loadxingxingshu() {
        var xingxingshu = 0;
        var caidanshu = 0;
        for (var i = 0; i < userData.guanka.length; i++) {
            xingxingshu += userData.guanka[i].xingxing;
            if (userData.guanka[i].caidan)
                caidanshu++;
        }
        var zongxingxing = userData.guanka.length * 3;

        this.xingxinglabel.string = xingxingshu + '/' + zongxingxing;
        this.caidanlabel.string = caidanshu + '/7';
      
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

    closeclick: function () {
        this.close.play();
    },

    clickclick: function () {
        this.click.play();
    },

    fanyeclick: function () {
        this.fanye.play();
    },



    radioButtonClicked1: function (toggle) {           //
        userData.caozuomoshi = 0;
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        self.toggle1.active = true;
        self.toggle2.active = false;
    },
    radioButtonClicked2: function (toggle) {
        userData.caozuomoshi = 1;
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        self.toggle1.active = false;
        self.toggle2.active = true;
    },

    tanchuanshow() {
        self.setanim.play('setshow');
        self.guankaanim.play('guankahide');
        self.helpanim.play('hide');
    },
    tanchuanhide() {
        self.setanim.play('hide');
        self.guankaanim.play('guankashow');
    },
    helpshow() {
        self.setanim.play('hide');
        self.guankaanim.play('guankahide');
        self.helpanim.play('helpshow');
    },
    helphide() {
        self.helpanim.play('hide');
        self.guankaanim.play('guankashow');
    },


    musicclick() {
        if (userData.yinyue) {
            userData.yinyue = false;
            this.bgaudio.stop();
            this.ban.active = true;
            cc.sys.localStorage.setItem('userData', JSON.stringify(userData));

        }
        else {
            userData.yinyue = true;
            this.bgaudio.play();
            this.ban.active = false;
            cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        }
    },

    clicknext() {
        var newpos = this.helpnode.position;
        if (this.helpnode.position.x > -2260) {
        newpos.x -= 500
            this.helpnode.position = newpos;
        }
    },
    clickback() {
        var newpos = this.helpnode.position;
        if (this.helpnode.position.x < -260) {
        newpos.x += 500
            this.helpnode.position = newpos;
        }
        else {
            newpos.x = -260
            this.helpnode.position = newpos;
        }
    },


    jiazaiguanka() {
        for (var i = 0; i < userData.guankan; i++) {
            if (i % 18 == 0) {
                var guankanode = cc.instantiate(self.guankapnode);
                guankanode.parent = self.content;
            }

            if (userData.guanka[i].suoding == true)              //这是表示当前关卡未解锁。
            {
                var thenode = cc.instantiate(self.guankalock);
                thenode.parent = guankanode;
                //  thenode.getChildByName("suoding").active = true;
                if (q_xuanzheguanka == -1)  //那么这是刚启动游戏。则把选择关卡切换到最新的一个。           
                    q_xuanzheguanka = i - 1;
            }
            else {
                var thenode = cc.instantiate(self.guankaprb);
                thenode.parent = guankanode;
                q_dqguanka = i;
                if (userData.guanka[i].caidan)     //有彩蛋就把彩蛋图片放上去
                {
                    var caidannode = cc.instantiate(self.caidanpreb);
                    caidannode.parent = thenode;
                }
                var star = thenode.getChildByName("xingxing").children;
                var j;
                for (j = 0; j < userData.guanka[i].xingxing; j++) {
                    star[j].active = true;
                }
            }
            var labelnode = thenode.getChildByName("label");
            labelnode.getComponent(cc.Label).string = i + 1;
        };
        //这里是写入等待关卡。
        
        var dengdaistr=['敬请期待','敬请期待','反正没人','可以通关','暂时不做','任性!!'];
        for(var i=0;i<6;i++)
        {
            var thenode = cc.instantiate(self.guankastrnode);
            thenode.parent = guankanode;
            var labelnode = thenode.getChildByName("label");
            labelnode.getComponent(cc.Label).string = dengdaistr[i];
        }       
    },

});

