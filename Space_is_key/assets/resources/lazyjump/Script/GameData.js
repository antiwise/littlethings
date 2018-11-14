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
        }
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

    start () {

    },

    // update (dt) {},
});
