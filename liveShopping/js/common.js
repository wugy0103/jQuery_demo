/**
 * Created by wugy on 2017/2/16.
 */
//app交互
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
if(isIOS()){
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
    if(isIOS()){
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(func, json, function (responedata) {
                if(callback){
                    callback(responedata)
                }
            });
        });
    }else if(window.android) {
        window.android[func](JSON.stringify(json));
        if(callback){
            callback();
        }
    }else{
        //alert("请在健康猫APP打开！");
    }
}
//app调用h5
function IOSCallH5(func){
    if (isIOS()) {
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(func, function (data, responseCallback) {
                responseCallback(window[func](data));
            });

        });
    }
}

// 获取url参数值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
// 获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
// 设置cookie
function setCookie(c_name, value,domain, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ";domain="+domain+";path=/" +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
//分页加载
function dropload(url,type,params,isPaging,callback,mallId){
    H5callApp("setThePageLoading",{loading:true});
    if(isPaging){
        params.curPageNO = 0;
    }
    $('#content').dropload({
        scrollArea : window,
        distance:100,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">暂无更多商品</div>'
        },
        loadDownFn : function(me){
            if(isPaging){
                params.curPageNO++;
            }
            $.ajax({
                url:url ,
                type: type,
                data: params,
                dataType: "json",
                async:false,
                success: function (data) {
                    if(data.prodList){
                        var data = data;
                        if(mallId){
                            data.mallId =mallId;
                        }
                        var html = template('product-box', data);
                        $('.lists').append(html);
                        // 如果没有数据
                    }else{
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 每次数据插入，必须重置
                    me.resetload();
                    if(!!callback){
                        callback(data);
                    }

                    H5callApp("setThePageLoading",{loading:false});
                },
                error: function (err) {
                    H5callApp("setThePageLoading",{loading:false});
                    console.info(err)
                    alert('Ajax error!'+JSON.stringify(err));
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            })


        }
    });
}
var baseUrl = "http://wgy.daxmall.com:8080/p/account/whereIsURL?url=http://wgy.daxmall.com:8080/";
//mui分页加载
//function ajaxSuccess (url,type,params,callback,muiCallback,needPage) {
//    $.ajax({
//        url: url,
//        type: type,
//        data: params,
//        dataType: "json",
//        async:false,
//        success: function (data) {
//            console.log("第一次加载",data);
//            var data = data;
//            var html = template('product-box', data);
//            $('#mui-scroll').html(html);
//            if(!!callback){
//                callback(data);
//            }
//          下拉更多
//            if(!needPage){
//                mui.init({
//                    pullRefresh: {
//                        container: "#content",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
//                        up: {
//                            height: 0,//可选.默认50.触发上拉加载拖动距离
//                            auto: false,//可选,默认false.自动上拉加载一次
//                            contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
//                            contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
//                            callback: function () {
//                                //业务逻辑代码，比如通过ajax从服务器获取新数据；
//                                params.curPageNO=data.curPageNO+1;
//                                $.ajax({
//                                    url: url,
//                                    type: type,
//                                    data: params,
//                                    dataType: "json",
//                                    async:false,
//                                    success: function (pageData) {
//                                        console.log("分页加载",pageData);
//                                        data.curPageNO=pageData.curPageNO;
//                                        mui('#content').pullRefresh().endPullupToRefresh(!pageData.prodList);
//                                        var pageData = pageData;
//                                        var pataHtml = template('product-box', pageData);
//                                        $('.mui-pull-bottom-pocket').before(pataHtml);
//                                        if(!!muiCallback){
//                                            muiCallback();
//                                        }
//                                    },
//                                    error: function (err) {
//                                        console.info(err)
//                                        alert(err.status+" "+err.statusText+" "+err.readyState+" "+err.responseText)
//                                        alert(JSON.stringify(err))
//                                    }
//                                })
//                                //注意：
//                                //1、加载完新数据后，必须执行如下代码，true表示没有更多数据了：
//                                //2、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
//
//                            }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//                        }
//                    }
//                });
//            }
//        },
//        error: function (err) {
//            console.info(err)
//            alert(err.status+" "+err.statusText+" "+err.readyState+" "+err.responseText)
//            alert(JSON.stringify(err))
//        }
//    })
//
//}
