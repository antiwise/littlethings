cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onLoad: function () {
        // 旋转
        var rotate = cc.rotateBy(2,360,360);
        this.node.runAction(cc.repeatForever(rotate));
    },

});
