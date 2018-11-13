cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onLoad: function () {
        // 旋转
        var rotate = cc.rotateBy(1.5,90,0);
        this.node.runAction(cc.repeatForever(rotate));
    },

});
