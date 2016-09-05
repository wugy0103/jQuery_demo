/**
 * Created by Lenovo on 2016/4/22.
 */
window.onload = function () {

        //步骤：
    //1.我们必须让页面加载的时候把所有的属性加载出来，让我看看。（核心）
    //2.鼠标放到大盒子上显示对应的左右切换按钮，移开隐藏
    //3.获取两个按钮。对他们进行事件绑定。对他们进行判断。
    //4.如果是左侧的按钮执行一套程序，如果是右侧的按钮执行另一套程序。
    //5.绑定按钮的函数，一个是正转，一个是反转。（传参确定）
    //6.调换相应的数组对应的元素。（先删除谁，在怎么添加）


    //每个图片的样式json都在这个数组里。我们随时修改他
    var json = [
        {   //  1
            width:400,
            top:70,
            left:50,
            opacity:0.2,
            z:2
        },
        {  // 2
            width:600,
            top:120,
            left:0,
            opacity:0.8,
            z:3
        },
        {   // 3
            width:800,
            top:100,
            left:200,
            opacity:1,
            z:4
        },
        {  // 4
            width:600,
            top:120,
            left:600,
            opacity:0.8,
            z:3
        },
        {   //5
            width:400,
            top:70,
            left:750,
            opacity:0.2,
            z:2
        }
    ];

    //获取用的到的盒子
    var lis = $("li");
    var wrap = $("#wrap");
    var arrow = document.getElementById("arrow");
    var as = arrow.children;


    //1.我们必须让页面加载的时候把所有的属性加载出来，让我看看。（核心）
        //for(var i=0;i<lis.length;i++){
        //    //lis[i].style.width = json[i].width + "px";
        //    //lis[i].style.top = json[i].top+ "px";
        //    //lis[i].style.left = json[i].left+ "px";
        //    //lis[i].style.opacity = json[i].opacity;
        //    //lis[i].style.zIndex = json[i].z;
        //    animate(lis[i],{
        //        width: json[i].width,
        //        top : json[i].top,
        //        left : json[i].left,
        //        opacity : json[i].opacity,
        //        zIndex : json[i].z
        //    });
        //}

    //页面初始化
    move();

    //2.鼠标放到大盒子上显示对应的左右切换按钮，移开隐藏
    wrap.onmouseover = function () {
        animate(arrow,{opacity:1});
    }
    wrap.onmouseout = function () {
        animate(arrow,{opacity:0});
    }

    //3.获取两个按钮。对他们进行事件绑定。对他们进行判断。
    //4.如果是左侧的按钮执行一套程序，如果是右侧的按钮执行另一套程序。
    //5.绑定按钮的函数，一个是正转，一个是反转。（传参确定）
    //开闭原则；
    var temp = true;
    for(var k in as){
        as[k].onclick = function () {
            if(this.className == "prev"){
                //函数节流，只有函数执行完毕才能执行下一次
                if(temp){
                    move(false);
                }
                temp = false;
            }else{
                //函数节流，只有函数执行完毕才能执行下一次
                if(temp){
                    move(true);
                }
                temp = false;
            }
        }
    }

    //6.调换相应的数组对应的元素。（先删除谁，在怎么添加）
    //判断参数，操作数组，使用数组
    function move(flag){
        //只有传参数的时候才改变数组中元素的位置，如果不传参，那么不改变数组位置
        if(flag != undefined){
            if(flag){
                //操作数组（反转）
                //正转如何操作数组
                //在数组json中，删除第一个元素，添加到最末尾。（反转）
                //var aaa = json.shift();
                //json.push(aaa);
                json.unshift(json.pop());
            }else{
                json.push(json.shift());
            }
        }
        //用数组中的每个元素的属性，为页面山的图片赋值
        for(var i=0;i<lis.length;i++){
            animate(lis[i],{
                width: json[i].width,
                top : json[i].top,
                left : json[i].left,
                opacity : json[i].opacity,
                zIndex : json[i].z
            }, function () {
                //图片的属性加载完毕以后，在去更改temp的值，这时候才能第二次点击
                temp = true;
            });
        }
    }









}