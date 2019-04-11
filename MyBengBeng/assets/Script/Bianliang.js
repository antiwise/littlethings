
window.userData = {
    guanka: [],
    guankan:120,
    nowguanka:0,
    skin:[],
    userskin:0,
    yindaoxian:20,
    gold:0,
    caozuomoshi:1,
    yinyue:true,
    firstgame:true,
    uptime:0,
    nengliang:10,
};



window.heroData = {
   state:0,   //0表示静止状态速度为0，1表示刚弹出去状态，。3
   step:0,   //步数
   jumpcount:1,
   jumpcountn:1,  //可以跳多少下。
   xingxing:3,
   caidan:false,
   girldie:false,
   help:false,
}

window.statecolor=cc.hexToColor('#13BB93');
window.dycolor=cc.hexToColor('#A1AA40');



window.skin={
   lock:true,
   type:0,
   gold:500,
},
window.weiba={
    lock:true,
    type:0,
    gold:500,
 },

window.bianjie1 = {
    x1:-100000000,
    x2:100000000,
    y1:-100000000,
    y2:100000000,   
};

//下面是播放剧情所需要的参数。
window.youjuqing=false;
window.tiaojianscr=0;

window.yinyue=0;
window.shuxing=[];

window.timescale=1;
window.juqingrect=new cc.Rect(0 , 0, 0, 0);
window.buzhou=0;
window.usetime=0;
window.juqinganim1=0;
window.juqinganim2=0;


//下面的是所有用到的全局变量
window.q_moshi=1;
window.q_xuanzheguanka=-1;
window.q_dqguanka=0;

window.mapxingxing={
    caidan:false,
    step1:0,
    step2:0,
    step3:0,
    maxstep:0,
}


//facebook用到的全局变量


//微信小游戏中用到的全局变量
window.gameclub=false;

//HELP//
window.helps=[];
window.isjilu=false;

//游戏中用到的全局变量
window.y_mapweizhi=cc.v2(0,0);
window.gameState=0;    //游戏启动状态，0无状态，1加载完毕，2开始游戏。3表示角色死亡。4表示成功过关。10表示触发剧情。
window.touchhero=false;
window.iswin=false;
window.islose=false;



window.chushi=function(){
    y_mapweizhi = cc.v2(0, 0);
    gameState = 0;
    heroData.state = 0;  //0表示静止状态速度为0，1表示刚弹出去状态，2表示被侧面弹了一次后。
    heroData.step = 0;  //步数
    heroData.jumpcount = 1;
    heroData.jumpcountn = 1;  //可以跳多少下。
    heroData.xingxing = 3;
    heroData.caidan=false; 
    heroData.girldie=false;

    //剧情用到的东西。全部初始化了。
    youjuqing = false;
    tiaojianscr = 0;


    yinyue = 0;
    shuxing = [];

    timescale = 1;
    juqingrect = new cc.Rect(0, 0, 0, 0);
    buzhou = 0; 
    window.iswin=false;
    window.islose=false;
    window.helps=[];
    window.isjilu=false;
};