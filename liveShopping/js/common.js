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
function callApp(func,json,callback){
    if(isIOS()){
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(func, json, function (responedata) {
                if(callback){
                    callback(responedata)
                }
            });
        });
    }else if(window.android) {
        console.info("android")
        window.android[func](JSON.stringify(json));
    }else{
        alert("请在健康猫APP打开！");
    }
}
//app调用h5--有bug
function appCallH5(func){
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
//mui分页加载
/*function ajaxSuccess (url,type,params,callback,muiCallback,needPage) {
    $.ajax({
        url: url,
        type: type,
        data: params,
        dataType: "json",
        async:false,
        success: function (data) {
            console.log("第一次加载",data);
            var prodList = data.prodList;
            var html ="";
            for(var i=0;i<prodList.length;i++){
                html +='<div class="product-box " >\
                    <a href="'+prodList[i].prodUrl+'" class="product-img">\
                    <img src="'+prodList[i].picUrl+'" alt="'+prodList[i].title+'"/>\
                    </a>\
                    <div class=" product-info">\
                    <h3 class="product-title"><a href="'+prodList[i].prodUrl+'">'+prodList[i].title+'</a></h3>\
            <div class="buyinfo clearfix">\
                <div class="">\
                <div class="price"><b>￥'+prodList[i].promotionPrice+'</b></div>\
            <div class="peopleNum">销量: '+prodList[i].buys+'  库存: '+prodList[i].stocks+'  收藏: '+prodList[i].favorite+' </div>\
            </div>\
            <a href="javascript:;" data-picUrl="'+prodList[i].picUrl+'" data-title="'+prodList[i].title+'" data-promotionPrice="'+prodList[i].promotionPrice+'" data-productId="'+prodList[i].productId+'" data-productUrl="'+prodList[i].prodUrl+'" class="recommendBtn main-color">推荐</a>\
                </div>\
                </div>\
                </div>'
            }
            $('#mui-scroll').html(html);
            if(!!callback){
                callback(data);
            }
//          下拉更多
           if(!needPage){
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
                                   async:false,
                                   success: function (pageData) {
                                       console.log("分页加载",pageData);
                                       data.curPageNO=pageData.curPageNO;
                                       mui('#content').pullRefresh().endPullupToRefresh(!pageData.prodList);
                                       var pageData = pageData;
                                       var pataHtml = template('product-box', pageData);
                                       $('.mui-pull-bottom-pocket').before(pataHtml);
                                       if(!!muiCallback){
                                           muiCallback();
                                       }
                                   },
                                   error: function (err) {
                                       console.info(err)
                                       alert(err.status+" "+err.statusText+" "+err.readyState+" "+err.responseText)
                                       alert(JSON.stringify(err))
                                   }
                               })
                               //注意：
                               //1、加载完新数据后，必须执行如下代码，true表示没有更多数据了：
                               //2、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后

                           }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                       }
                   }
               });
           }
        },
        error: function (err) {
            console.info(err)
            alert(err.status+" "+err.statusText+" "+err.readyState+" "+err.responseText)
            alert(JSON.stringify(err))
        }
    })

}*/

function ajaxSuccess (url,type,params,callback,muiCallback,needPage) {
    $.ajax({
        url: url,
        type: type,
        data: params,
        dataType: "json",
        async:false,
        success: function (data) {
            console.log("第一次加载",data);
            var data = data;
            var html = template('product-box', data);
            $('#mui-scroll').html(html);
            if(!!callback){
                callback(data);
            }
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
        },
        error: function (err) {
            console.info(err)
            alert(err.status+" "+err.statusText+" "+err.readyState+" "+err.responseText)
            alert(JSON.stringify(err))
        }
    })

}