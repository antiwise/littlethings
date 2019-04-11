
var self;
cc.Class({
    extends: cc.Component,

    properties: {
      mingci:cc.Label,
      touxiang:cc.Sprite,
      mingcheng:cc.Label,
      defen:cc.Label,
      caidannode:cc.Node,
      xingxingnode:cc.Node,
    },

    onLoad() {
     self=this;
    },

    init(mingci,data,leixing){
        this.mingci.string=mingci;
        this.mingcheng.string=data.nikename;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.defen.string=grade.toString();       
        this.createImage(avatarUrl);
        if (leixing=='star')
        this.xingxingnode.active=true;
        else 
        this.caidannode.active=true;
    },


    createImage(avatarUrl){
        try{
        cc.loader.load({
            url: avatarUrl, type: 'jpg'
        }, (err, texture) => {
            self.touxiang.spriteFrame = new cc.SpriteFrame(texture);
        });
        }
        catch(err){};

    },
});
