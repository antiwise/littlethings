cc.Class({
    extends: cc.Component,

    properties: {
        _actions:[],
        ismove:false,
        _speed:200,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.heronode=cc.find('Hero');
        this.ishold=false;
        this.dq=0;
        this.dqmovejuli=cc.v2();
        },

/*     setmoveto(movepos1)
    {
        var changdu=this._getDistance(cc.v2(0,0), movepos1);
        var shijian=0.4+changdu/320;  

        var action1 = cc.moveBy(shijian, movepos1);
        var action2 = cc.moveBy(shijian, cc.pNeg(movepos1));
        var seq = cc.sequence(action1,cc.delayTime(0.1),action2,cc.delayTime(0.1)).repeatForever();
        this.node.runAction(seq);     
    },

    setmoveto2(movepos1,movepos2)
    {   
        var changdu=this._getDistance(cc.v2(), movepos1);
        var shijian=0.4+changdu/320;  

        var action1 = cc.moveBy(shijian, movepos1);
        var action2 = cc.moveBy(shijian, movepos2);
        var action3 = cc.moveBy(shijian, cc.pNeg(movepos2));
        var action4 = cc.moveBy(shijian, cc.pNeg(movepos1));
        var seq = cc.sequence(action1,cc.delayTime(0.1),action2,cc.delayTime(0.1),action3,cc.delayTime(0.1),action4,cc.delayTime(0.1)).repeatForever();
        this.node.runAction(seq);  
    },
 */
    setmoveto(movepos1){
     this._actions[0]=movepos1;
     this._actions[1]=cc.pNeg(movepos1);
     this.ismove=true;
     this.dq=0;
    },
    setmoveto2(movepos1,movepos2){
        this._actions[0]=movepos1;
        this._actions[1]=movepos2;
        this._actions[2]=cc.pNeg(movepos2);
        this._actions[3]=cc.pNeg(movepos1);
        this.ismove=true;
        this.dq=0;
    },

    _getDistance: function(pos1, pos2)
    {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2));
    },

    setheroposition(dt)
    {  
        if (this.ismove)
     {
         
        var addpos=cc.pNormalize(this._actions[this.dq]);  //计算出长度为1的向量；
        addpos=cc.pMult(addpos,dt*this._speed);
        
        this.dqmovejuli=cc.pAdd(this.dqmovejuli,addpos);  

        if (cc.pLengthSQ(this.dqmovejuli)>=cc.pLengthSQ(this._actions[this.dq]))
        {
            //下面是避免时间运行长了有偏移。所以最后一帧是处于绝对值。
          addpos=cc.pSub(this._actions[this.dq],cc.pSub(this.dqmovejuli,addpos));  
          this.dqmovejuli=cc.v2();
          this.dq+=1;

          if (this.dq==this._actions.length)
          {
          this.dq=0;
          }
        };

        var newnodeposition=cc.pAdd(this.node.getPosition(),addpos);//获取该帧的新position  
        this.node.setPosition(newnodeposition);       



        if (this.ishold)
        {
            var newposition=cc.pAdd(this.heronode.getPosition(),addpos);
            this.heronode.setPosition(newposition);     
        }
     }

    },

    update (dt) {
        //cc.log(this.ishold);  
          this.setheroposition(dt*timescale);
     },
 
     
});
