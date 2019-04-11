
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.Onclickbegin, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Onclickend, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Onclickout, this);
    },




    Onclickbegin() {
        if (this.node.name == 'guankabtn') {
            this.node.scale = 1.2;
            // this.scale.mul(1.2);
        }
        //cc.director.loadScene("game");
    },

    Onclickend(event) {
        if (this.node.name == 'guankabtn')  {
            this.node.scale = 1;
            //this.chushihua();
            var xx=new chushi;
            q_xuanzheguanka = this.node.getChildByName("label").getComponent(cc.Label).string - 1;
            cc.director.loadScene("game");
        }
    },

    Onclickout(event) {
        if(this.node.name == 'guankabtn') {
            this.node.scale = 1;
        }
    },


});
