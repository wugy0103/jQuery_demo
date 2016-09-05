/**
 * Created by Lenovo on 2016/4/18.
 */

function hide(obj){
    obj.style.display = "none";
}

/**
 * Created by Lenovo on 2016/4/18.
 * canshufanzhigongneng
 */
function show(obj){
    obj.style.display = "block";
}


function scroll(){
    //1.判断，浏览器如果支持window.pageYOffset;那么直接使用
    if(window.pageYOffset != undefined){
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        };
    //2.要看浏览器也面有DTD约束。如果有执行document.documentElement.scrollTop;
    }else if(document.compatMode === "CSS1Compat"){
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        };
    }
    //3.否则执行document.body.scrollTop;
    //4.返回一个json,key分别问top和left；
    return {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    };
}


//缓动框架
function animate(obj,json,fn){
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //开闭原则
        var flag = true;
        for(var k in json){
            //获取该元素的属性值，然后取整（主要就是去除px）
            var leader = 0;
            var target = 0;
            //特殊的属性值，获取完毕后特殊处理。
            //for循环中的json[k]代表的是(属性值)；那么k代表的是（属性名）
            if( k =="opacity"){
                //如果属性名为opactiy那么获取该属性，放大100倍后取整，方便以后IE678的处理
                leader = Math.round(getStyle(obj,k)*100) || 100;
                target = json[k]*100;
            }else{
                leader = parseInt(getStyle(obj,k)) || 0;
                target = json[k];
            }
            var step = (target - leader)/10;
            step = step>0?Math.ceil(step):Math.floor(step);
            leader = leader+step;
            //我们要给传递过来的属性赋值
            if(k=="opacity"){
                //如果属性为opacity,那么先把值缩小100倍，在赋值
                obj.style.opacity = leader/100;
                //第二部处理透明度
                obj.style.filter = "alpha(opacity="+leader+")";
            }else if(k == "zIndex"){
                //如果属性值为z-index,那么一次性赋值，不要缓动
                obj.style.zIndex = json[k];
            }else{
                obj.style[k] = leader+"px";
            }
            console.log(1)
            //不会的举手！（没到达，目标位置的说话，告诉程序不允许清除定时器）
            //如果属性是透明度的时候，要把值先放大100倍然后四射五入取整后比较
            if(leader != target){
                flag = false;
            }
        }
        //所有属性都到到了目标位置，才清除定时器
        if(flag){
            clearInterval(obj.timer);
            //清除定时器以后，在执行fn这个函数
            if(fn){
                fn();
            }
        }
    },30);
}
//获得某个元素的属性值
function getStyle(obj,index){
    if(window.getComputedStyle){
        return window.getComputedStyle(obj,null)[index];
    }
    return obj.currentStyle[index];
}


//1.定义一个函数，带有一个形参的函数。
function $(aaa){
    //2.定义两个字符串：一个是参数的第一个字符，另一个是余下的字符。
    var str1 = aaa.charAt(0);
    var str2 = aaa.slice(1);
    //3.判断第一个字符串的值：
    //(1).如果== # ,调用document.getElementById(另一个字符串)，返回;
    if(str1 == "#"){
        return document.getElementById(str2);
        //(2).如果== . ,调用document.getElementsByClassName(另一个字符串)，返回;
    }else if(str1 == "."){
        return getClass(str2);
        //(3).如果两个都不是,调用document.getElementsByTagName(参数)，返回;
    }else{
        return document.getElementsByTagName(aaa);
    }
}

//兼容IE678
function getClass(str){
    if(document.getElementsByClassName){
        return document.getElementsByClassName(str);
    }
    var arrAllElements = document.getElementsByTagName("*");
    var arr = [];
    for(var i=0;i<arrAllElements.length;i++){
        var arrClassName = arrAllElements[i].className.split(" ");
        for(var j=0;j<arrClassName.length;j++){
            if(arrClassName[j] == str){
                arr.push(arrAllElements[i]);
            }
        }
    }
    return arr;
}

