cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        var canvas = cc.director.getScene().getChildByName("LevelSelect");
        var levelBtn = canvas.children;
        //为关卡选择场景里的按钮绑定touch事件，点击后跳转至相应关卡
        for(var i = 0; i < levelBtn.length; i++){
            if(levelBtn[i].name == "levelButton"){
                if(i <= cc.fy.JumpData.currentLevel )
                {
                    levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                        var btn = e.target;
                        var levelNum = btn.getChildByName("levelNum").getComponent(cc.Label).string;
                        cc.director.loadScene("Level"+levelNum);
                     });
                }
                var starNum = cc.fy.JumpData.getLevelData(i);
                for(var j=1;j<=3;j++)
                {
                    var star = levelBtn[i].getChildByName("star"+j);
                    if(j>starNum)
                    {
                        star.active = false;
                    }
                }
            }
            if(levelBtn[i].name == "backButton"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                   cc.director.loadScene("Menu");
                });
            }
        }
    },
});
