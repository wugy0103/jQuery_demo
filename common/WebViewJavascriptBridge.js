/*
* @Author: wuguoyuan
* @Date:   2017-03-30 16:25:44
* @Last Modified by:   wuguoyuan
* @Last Modified time: 2017-03-30 16:26:11
*/
function isIOS() {
    //判断是否为IOS
    return navigator.platform === 'iPhone' ||
        navigator.platform === 'iPad' ||
        navigator.platform === 'iPod' ||
        navigator.platform === 'iPhone Simulator' ||
        navigator.platform === 'iPad Simulator' ||
        navigator.platform === 'iPod Simulator' ||
        navigator.platform === 'iPod touch' ||
        navigator.platform === 'iPod Touch';
}
function isAppOpen() {
     var result = false;
     if (window.android) {
         result = android.isAppOpen();
     } else {
         var arr, reg = new RegExp("(^| )deviceType=([^;]*)(;|$)");
         if (arr = document.cookie.match(reg)) {
             result = unescape(arr[2]);
         }
     }
     return !!result;
 }
if(isIOS() && isAppOpen()){

    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    }
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
            // 初始化与iOS交互插件
            var data = { 'Javascript Responds': 'Wee!' }
            //alert("与IOS交互啦");
            responseCallback(data);
        });
    });
}
//调用app方法
function H5callApp(func,json,callback){
    if(isIOS() && isAppOpen()){
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(func, json, function (responedata) {
                if(callback){
                    callback(responedata)
                }
            });
        });
    }else if(window.android && isAppOpen()) {
        window.android[func](JSON.stringify(json));
        if(callback){
            callback();
        }
    }else{
        console.info("请在健康猫APP打开！");
    }
}
//app调用h5
function IOSCallH5(func){
    if (isIOS() && isAppOpen()) {
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(func, function (data, responseCallback) {
                responseCallback(window[func](data));
            });

        });
    }
}
