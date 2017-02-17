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
// 获取url参数值
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
function ajaxSuccess (url,type,params,callback,muiCallback) {
    $.ajax({
        url: url,
        type: type,
        data: params,
        dataType: "json",
        success: function (data) {
            console.log("第一次加载",data);
            var data = data;
            var html = template('product-box', data);
            $('#mui-scroll').html(html);
            if(callback){
                callback(data);
            }
//          下拉更多
            mui.init({
                pullRefresh: {
                    container: "#content",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
                    up: {
                        height: 0,//可选.默认50.触发上拉加载拖动距离
                        auto: false,//可选,默认false.自动上拉加载一次
                        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                        callback: function () {
                            //业务逻辑代码，比如通过ajax从服务器获取新数据；
                            params.curPageNO=data.curPageNO+1;
                            $.ajax({
                                url: url,
                                type: type,
                                data: params,
                                dataType: "json",
                                success: function (pageData) {
                                    console.log("分页加载",pageData);
                                    data.curPageNO=pageData.curPageNO;
                                    mui('#content').pullRefresh().endPullupToRefresh(!pageData.prodList);
                                    var pageData = pageData;
                                    var pataHtml = template('product-box', pageData);
                                    $('.mui-pull-bottom-pocket').before(pataHtml);
                                    if(muiCallback){
                                        muiCallback();
                                    }
                                },
                                error: function (err) {
                                    console.log(err)
                                    if (err.responseURL) {
                                        window.location.href = err.responseURL;
                                    }
                                }
                            })
                            //注意：
                            //1、加载完新数据后，必须执行如下代码，true表示没有更多数据了：
                            //2、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后

                        }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    }
                }
            });
        },
        error: function (err) {
            console.log(err)
            if (err.responseURL) {
                window.location.href = err.responseURL;
            }
        }
    })

}