// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        _progressData:null,

        currentLevel:{
            get()
            {
                return this._progressData.curLevel;
            },
            set(value)
            {
                if(value>this._progressData.curLevel)
                {
                    this._progressData.curLevel=value;
                    var str = JSON.stringify(this._progressData);
                    cc.sys.localStorage.setItem('progress', str);
                }
            }
        },
        audioId:null,
    },

    // LIFE-CYCLE CALLBACKS:

    init:function () 
    {
        //cc.sys.localStorage.removeItem("progress");
        if(cc.sys.localStorage.getItem('progress') == null){
            cc.sys.localStorage.setItem('progress', '{"curLevel":1,"level1":0,"level2":0,"level3":0,"level4":0,"level5":0,"level6":0,"level7":0,"level8":0,"level9":0,"level10":0}');
        }
        var data = cc.sys.localStorage.getItem('progress');
        this._progressData = JSON.parse(data);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },



    getLevelData:function(level)
    {
        return this._progressData['level'+level];
    },

    updateLevelData:function(level,value)
    {
        if(value>=this._progressData['level'+level])
        {
            this._progressData['level'+level] = value;
            if(this.currentLevel==level)
            {
                this.currentLevel = level+1;
            }
            var str = JSON.stringify(this._progressData);
            cc.sys.localStorage.setItem('progress', str);
        }
    },

    playBGM(url){
        var audioUrl = this.getUrl(url);
        console.log(audioUrl + ".mp3");
        if(this.audioId != null && this.audioId >= 0){
            cc.audioEngine.stop(this.audioId);
        }
        if(url != null){
            this.audioId = cc.audioEngine.play(audioUrl + ".mp3",true,1);
        }
        if(cc.sys.localStorage.getItem("playSound") == 0)
        {
            this.openSound(false);
        }
    },

    openSound(value){
        var state = cc.audioEngine.getState(this.audioId); //-1error,0initalzing,1playing,2paused
        if(value==null)
        {
            return state==1;
        }
        if(!value)
        {
            cc.audioEngine.pauseAll();
            cc.sys.localStorage.setItem("playSound", 0);
            return false;
        }
        if(value)
        {
            cc.audioEngine.resumeAll();
            cc.sys.localStorage.setItem("playSound", 1);
            return true;
        }
    },

    getUrl:function(url,gameType){
        return cc.url.raw("resources/modules/lazyjump/audio/" + url);
    },


    start () {

    },

    // update (dt) {},
});
