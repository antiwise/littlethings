
cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesAsset: dragonBones.DragonBonesAsset,
        dragonBonesAtlasAsset: dragonBones.DragonBonesAtlasAsset,
        armatureName:{
            default:'',
            tooltip:'当前的 Armature 名称。'
        },
        animationName:{
            default:'',
            tooltip:'当前播放的动画名称'
        },
        dragonDir:{
            default:'',
            tooltip:'骨骼动画json文件所在目录'
        },
        timeScale:{
            default:1,
            tooltip:'当前骨骼中所有动画的时间缩放率'
        },
        playTimes:{
            default:0,
            tooltip:'播放默认动画的循环次数 -1 表示使用配置文件中的默认值; 0 表示无限循环 >1 表示循环次数'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.armatureDisplay = this.node.addComponent(dragonBones.ArmatureDisplay)
        this.armatureDisplay.dragonAsset = null; //(初始化)
        this.armatureDisplay.dragonAtlasAsset = null; //(初始化)
        this.armatureDisplay.armatureName = null; //(初始化)
        if (this._isMecha) {
            this._isMecha = false;
            this.loadDragonBones(this.armatureDisplay, this.dragonDir, this.armatureName, this.animationName, this.playTimes)
        } else {
            this._isMecha = true;
            this.loadDragonBones(this.armatureDisplay, this.dragonDir, this.armatureName, this.animationName, this.playTimes)
        }
    },

    loadDragonBones(armatureDisplay, path, armatureName, newAnimation) {
        cc.loader.loadResDir(path,  (err, assets) => {
            if (err || assets.length <= 0) return;
            armatureDisplay.armatureName = "";
            armatureDisplay.dragonAsset = null;
            armatureDisplay.dragonAtlasAsset = null;

            for (let i = 0; i < assets.length; i++) {
                if (assets[i] instanceof dragonBones.DragonBonesAsset) {
                    armatureDisplay.dragonAsset = assets[i];
                }

                if (assets[i] instanceof dragonBones.DragonBonesAtlasAsset) {
                    armatureDisplay.dragonAtlasAsset = assets[i];
                }
            }

            armatureDisplay.armatureName = armatureName;
            armatureDisplay.timeScale = this.timeScale;
            armatureDisplay.playAnimation(newAnimation, this.playTimes);

            
            if (this.node.name=='Heroanim')
            {
                var getbone=this.node.getComponent('Getbone');
                getbone.init();
            };
        })
    },

    start() {

    },

    // update (dt) {},
    onDestroy() {
        cc.sys.isNative &&  this.armatureDisplay._factory.clear()
        cc.loader.releaseResDir(this.dragonDir);
    }
});
