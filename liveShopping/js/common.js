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
var baseUrl = "http://"+window.location.host+"/authRemote/whereIsURL?url=http://"+window.location.host+"/";
var async = true;
if(isIOS()){
    async = false;
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
        console.info("请在健康猫APP打开！");
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
//数据列表加载
function dataListLoad(url,type,params,isData,callback){
    H5callApp("setThePageLoading",{loading:true});
    $.ajax({
        url:url ,
        type: type,
        data: params,
        dataType: "json",
        async:async,
        success: function (data) {
            if(isData){
                if(JSON.stringify(data)!="{}"){
                    var listsHtml = template('data-box', data);
                    $('.lists').append(listsHtml);
                }else{
                    //$("#content").addClass("noProduct");
                }
            }
            if(!!callback){
                callback(data);
            }
            H5callApp("setThePageLoading",{loading:false});
        },
        error: function (err) {
            H5callApp("setThePageLoading",{loading:false});
            console.info(err)
            alert('请求失败!'+JSON.stringify(err));
        }
    })
}
//dropload分页加载
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
            domLoad    : '<div class="dropload-load"></div>',
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
                async:async,
                success: function (data) {
                    if(JSON.stringify(data)!="{}"){
                        if(mallId){
                            data.mallId =mallId;
                        }
                        var html = template('data-box', data);
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
                    // 即使加载出错，也得重置
                    me.resetload();
                    H5callApp("setThePageLoading",{loading:false});
                    console.info(err)
                    alert('请求失败!'+JSON.stringify(err));
                }
            })


        }
    });
}