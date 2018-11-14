cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight:0,
        jumpDuration: 0.35,
        moveDuration:4.5,
        allowJump:true,
        originY:0,
        mediaWidth:0,
        mediadHeight:0,
        directionTo:1,
        pointPrefab:{
            default:null,
            type: cc.Prefab
        },
        starAudio: {
            default: null,
            url: cc.AudioClip
        },
        jumpAudio: {
            default:null,
            url: cc.AudioClip
        }
    },
    onLoad: function () {
        //this.jumpAction = this.setJumpAction();
        this.setInputControl();
    },
    jump:function(){
        this.jumpAction = this.setJumpAction();
        if(this.allowJump){
            cc.audioEngine.playEffect(this.jumpAudio, false);
            this.node.runAction(this.jumpAction);
        }
    },
    goMove:function(direction){
        this.moveAction = this.setMoveAction(direction);
        this.node.runAction(this.moveAction);
    },
    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpRotateUp = cc.rotateBy(this.jumpDuration, -20,-20);//180, 180);
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var jumpRotateDown = cc.rotateBy(this.jumpDuration, 20,20);//180, 180);
        //var jumpRotate = cc.rotateTo(this.jumpDuration, 0,0);//180, 180);
        //var jumpRotate = cc.rotateBy(this.jumpDuration*2, 360,360);//180, 180);

        var callback = cc.callFunc(function(){
            this.allowJump = true;
        }, this);
        var forbidJump = cc.callFunc(function(){
            this.allowJump = false;
        }, this);
        //debugger
        if(this.directionTo==1)
        {
            return cc.spawn((cc.sequence(jumpRotateUp,jumpRotateDown)),(cc.sequence(forbidJump,jumpUp, jumpDown, callback)));
        }
        return cc.spawn((cc.sequence(jumpRotateDown,jumpRotateUp)),(cc.sequence(forbidJump,jumpUp, jumpDown, callback)));
        //return cc.spawn(jumpRotate,(cc.sequence(forbidJump,jumpUp, jumpDown, callback)));
    },
    // 设置移动动画
    setMoveAction: function(direction){
        var moveToRight = cc.moveBy(this.moveDuration,cc.p((this.mediaWidth+this.node.width)*direction,0));
        var moveEnd = cc.callFunc(function(){
            this.node.dispatchEvent( new cc.Event.EventCustom('moveEnd', true) );
        }, this);
        return cc.sequence(moveToRight,moveEnd);
    },
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.space:
                        self.jump();
                        break;
                }
            }
        }, self.node);
    },
    // 监听方块碰撞
    onCollisionEnter: function (other, self) {
        if(other.node.name == "barrier"){
            // 碰撞障碍
            this.node.dispatchEvent( new cc.Event.EventCustom('collision', true) );
        }else{
            // 接触到point或者星星
            this.pointGain(other.node);
            cc.audioEngine.playEffect(this.starAudio, false);
            if(other.node.name == "star")
            {
                this.node.dispatchEvent( new cc.Event.EventCustom('starGet', true) );
            }
        }
    },
    //接触到point或者星星
    pointGain: function(point){
        var move = cc.moveBy(0.2,cc.p(0,30)).easing(cc.easeCubicActionOut());
        var scale = cc.scaleTo(0.2,1.5,1.5).easing(cc.easeCubicActionOut());
        var fade = cc.fadeTo(0.2, 0);
        var callback = cc.callFunc(function(){
            point.destroy();
        },this);
        point.runAction(cc.sequence(cc.spawn(move,scale,fade),callback));
    },
});
