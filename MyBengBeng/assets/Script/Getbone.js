cc.Class({
    extends: cc.Component,

    properties: {


        _armature : null,
        _armatureDisplay : null,
        bone:[],

    },

    // LIFE-CYCLE CALLBACKS:

    init () {
        this._armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this._armature = this._armatureDisplay.armature();
        this.huoqubone();
    },

    huoqubone () {
        var j;
        for (var i=0;i<9;i++)
        {
             j=i+1;
            this.bone[i]=this._armature.getBone("bone"+j);         
        }
    },
});
