window.fbsys=false;
window.ADload=false;
window.qudaoscr = {


    setscore() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var xingxingshu = 0;
            var caidanshu = 0;
            for (var i = 0; i < userData.guanka.length; i++) {
                xingxingshu += userData.guanka[i].xingxing;
                if (userData.guanka[i].caidan)
                    caidanshu++;
            }

            var caidanscore = { score: caidanshu, update_time: new Date() };
            var xingxingscore = { score: xingxingshu, update_time: new Date() };

            wx.setUserCloudStorage({
                KVDataList: [{ key: "xingxing", value: xingxingscore }, { key: "caidan", value: caidanscore }],
                success: function (res) {
                    console.log('setUserCloudStorage', 'success', res)
                },
                fail: function (res) {
                    console.log('setUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('setUserCloudStorage', 'ok')
                }
            });
        }
    },

    loadAD() {
        if (ADload)
        return;

        console.log('xxxx');
        if (cc.sys.platform == cc.sys.WECHAT_GAME)
        {
            window.myvideoAD = wx.createRewardedVideoAd('12345678');
            myvideoAD.load(); 
            myvideoAD.onLoad(function () {
            ADload = true;
            console.log(myvideoAD);
        });
       }
    },

    showAD() {
        console.log(cc.sys.platform +'  '+fbsys);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (window.ADload) {
                myvideoAD.show();
                myvideoAD.onClose(function (res) {
                    if (res)           //成功看完广告
                    {
                        heroData.help = true;
                        q_moshi = 1;
                        var xx = new chushi;
                        cc.director.loadScene("game");
                        ADload=false;
                        qudaoscr.loadAD();
                        console.log('duile');
                    }
                    else              //没看完广告关闭。
                    {
                        heroData.help = false;
                        q_moshi = 1;
                        var xx = new chushi;
                        cc.director.loadScene("game");
                        console.log('cuole');
                    }
                });
            }
            else
                qudaoscr.loadAD();
        }
    },
}