cc.Class({
    extends: cc.Component,

    properties: {
        grap: cc.Graphics,
    },


    start() {
      //  cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.q:
                isjilu = true;
                break;
            case cc.KEY.w:
               this.init();
                break;
            case cc.KEY.y:
                this.showhelp();
                break;
            case cc.KEY.s:
                this.save();
                break;
        }
    },

    init(){
        var self=this;
        cc.loader.loadRes('Maphelp/guanka'+q_xuanzheguanka, function (err, jsonAsset) {          
            helps=jsonAsset.json;
            self.showhelp();
        });
    },

    save() {
        jsb.fileUtils.writeStringToFile(JSON.stringify(helps),jsb.fileUtils.getWritablePath()+"/map/guanka"+q_xuanzheguanka+".json");
    },

    showhelp() {
        this.grap.clear();

        for (var i = 0; i < helps.length; i++) {
            this.grap.circle(helps[i].position.x, helps[i].position.y, 30);
            this.grap.stroke();
            for (var j = 0; j < helps[i].point.length; j++) {

                this.grap.circle(helps[i].point[j].x + helps[i].position.x, helps[i].point[j].y + helps[i].position.y, 1);
            }
            this.grap.stroke();
        }

    }

});
