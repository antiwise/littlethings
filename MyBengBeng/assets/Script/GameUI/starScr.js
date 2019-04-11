

cc.Class({
    extends: cc.Component,

    properties: {
        guankalabel:cc.Label,
    },


    init () {     //初始化

        var starnull=this.node.getChildByName("starnull").children;
        var star=this.node.getChildByName("star").children;
        var fillwidth=440;     //这是因为要加上一点偏移。所以位置小于长度470

        starnull[0].x=-fillwidth/2;          //第一个星星
        star[0].x=-fillwidth/2;

        starnull[1].x=-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstep)*fillwidth;          //第一个星星
        star[1].x=-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstep)*fillwidth;

        starnull[2].x=-fillwidth/2+fillwidth*(mapxingxing.step3+mapxingxing.step2)/mapxingxing.maxstep;          //第一个星星
        star[2].x=-fillwidth/2+fillwidth*(mapxingxing.step3+mapxingxing.step2)/mapxingxing.maxstep;

        this.guankalabel.string=q_xuanzheguanka+1;
    },  


    // update (dt) {},
});
