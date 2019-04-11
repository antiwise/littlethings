window.anysdkscr = {
    chushihua() {
        console.log('开始初始化');
        this.agent = anysdk.agentManager;
        this.ads_plugin = this.agent.getAdsPlugin();
        this.ads_plugin.setListener(this.onActionResult, this)
        console.log(this.ads_plugin);
    },

    onActionResult: function (code, msg) {
        if (code==anysdk.AdsResultCode.kRewardedVideoWithReward)
        console.log("ads result, resultcode:" + code + ", msg: " + msg);
        console.log("ads result, resultcode:" + code + ", msg: " + msg);
        this.loadAD();
    },

    loadAD(){
        this.ads_plugin.preloadAd('Xj6Ki9WjsU5c2malJ5C');
    },

    showAD()
    {
        this.ads_plugin.showAd('Xj6Ki9WjsU5c2malJ5C');
    }
}