/**
 * Created by wugy on 2017/2/16.
 */
//app交互
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}
// 初始化与iOS交互插件
connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {
        var data = { 'Javascript Responds':'Wee!' };
        responseCallback(data);
    });
});

function isIOS() {
    return navigator.platform.indexOf("iPhone")>-1 || navigator.platform.indexOf("iPad")>-1 || navigator.platform.indexOf("iPod")>-1;
}

function callIosApp(imgUrl,title,des,link){
    var data=null;
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("isAppOpen", data, function(response) { // 回调
            data = {'imgUrl':imgUrl,'title':title,'des':des,'url':link};
            bridge.callHandler('mallShare', data, function(response) {
                return true;
            });
        });
        return true;
    });
    return false;
}
//ajax错误函数
function ajaxError(err) {
    console.log(err)
    if (err.responseURL) {
        window.location.href = err.responseURL;
    }
}
//        获取url参数值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
// 获取cookie
var getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
// 设置cookie
var setCookie = function(c_name, value,domain, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ";domain="+domain+";path=/" +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
//mui分页加载
function muiPataData (pataData) {
    console.log("mui分页加载",pataData);
    data.curPageNO=pataData.curPageNO
    mui('#content').pullRefresh().endPullupToRefresh(!pataData.prodList);
    var pataData = pataData;
    var pataHtml = template('product-box', pataData);
    $('.mui-pull-bottom-pocket').before(pataHtml);
}