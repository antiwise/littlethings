cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        var self = this;
        var canvas = cc.director.getScene().getChildByName("Menu");
        var levelBtn = canvas.children;

        if(cc.fy==null)
        {
            cc.fy = {};
        }
        var Gamedata = require("Gamedata");
        cc.fy.JumpData = new Gamedata();
        cc.fy.JumpData.init();

        // 为菜单上的按钮绑定touch事件
        for(var i = 0; i < levelBtn.length; i++){
            if(levelBtn[i].name == "newGame"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.newGame(cc.fy.JumpData.currentLevel);
                });
                // levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                //     self.newGame();
                // });
            }
            if(levelBtn[i].name == "selectLevel"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.selectLevel();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    self.selectLevel();
                });
            }
            if(levelBtn[i].name == "about"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    self.toAbout();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    self.toAbout();
                });
            }
            if(levelBtn[i].name == "exit"){
                levelBtn[i].on(cc.Node.EventType.TOUCH_END,function(e){
                    cc.director.end();
                });
                levelBtn[i].getChildByName("Label").on(cc.Node.EventType.TOUCH_END,function(e){
                    cc.director.end();
                });
            }
        }

         // 菜单场景中动画显示about按钮
         var about = this.node.getChildByName("about");
         setTimeout(function(){
            if(cc.isValid(about))
            {
             about.runAction(cc.moveBy(0.3,cc.p(0,-71)).easing(cc.easeCubicActionOut()));
            }
         },1000);
         // 菜单场景中动画显示exit按钮
         var exit = this.node.getChildByName("exit");
         setTimeout(function(){
            if(cc.isValid(exit))
            {
                exit.runAction(cc.moveBy(0.3,cc.p(0,71)).easing(cc.easeCubicActionOut()));
            }
         },1500);
         var newGame = this.node.getChildByName("newGame");
         setTimeout(function(){
            if(cc.isValid(newGame))
            {
        //        newGame.runAction(cc.moveBy(0.3,cc.p(0,-128)).easing(cc.easeCubicActionOut()));
            }
        },2000);
        var selectLevel = this.node.getChildByName("selectLevel");
         setTimeout(function(){
            if(cc.isValid(selectLevel))
            {
        //        selectLevel.runAction(cc.moveBy(0.3,cc.p(0,-128)).easing(cc.easeCubicActionOut()));
            }
        },2000);
    },
    // 加载第一关
    newGame:function(level){
         cc.director.loadScene("Level"+level);
    },
    //切换至关卡选择场景
    selectLevel:function(){
        cc.director.loadScene("LevelSelect");
    },
    //切换场景至about
    toAbout:function(){
        cc.director.loadScene("About");
    },

    onDestroy:function()
    {

    }
});
