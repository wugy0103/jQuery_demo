$.fn.carousel = function() {
    //每个图片的样式json都在这个数组里。我们随时修改他
    var json = [{ //  1
        width: 400,
        top: 70,
        left: 50,
        opacity: 0.2,
        z: 2
    }, { // 2
        width: 600,
        top: 120,
        left: 0,
        opacity: 0.8,
        z: 3
    }, { // 3
        width: 800,
        top: 100,
        left: 200,
        opacity: 1,
        z: 4
    }, { // 4
        width: 600,
        top: 120,
        left: 600,
        opacity: 0.8,
        z: 3
    }, { //5
        width: 400,
        top: 70,
        left: 750,
        opacity: 0.2,
        z: 2
    }];
    //1.我们必须让页面加载的时候把所有的属性加载出来，让我看看。（核心）
    //页面初始化
    move();
    var timer;
    timer = setInterval(function() {
            move(true)
        }, 3000)
        //2.鼠标放到大盒子上显示对应的左右切换按钮，移开隐藏

    $(this).on('mouseenter', function() {
        clearInterval(timer);
        $('#arrow').animate({
            opacity: 1
        }, 300)
    })
    $(this).on('mouseleave', function() {
        timer = setInterval(function() {
            move(true)
        }, 3000)
        $('#arrow').animate({
            opacity: 0
        }, 300)
    })

    //3.获取两个按钮。对他们进行事件绑定。对他们进行判断。
    //4.如果是左侧的按钮执行一套程序，如果是右侧的按钮执行另一套程序。
    //5.绑定按钮的函数，一个是正转，一个是反转。（传参确定）
    var temp = true;
    $("#arrow>a").each(function(i) {
        $(this).on("click", function() {
            console.log(1);
            if ($(this).hasClass("prev")) {
                if (temp) {
                    move(false);
                }
                temp = false;
            } else {
                if (temp) {
                    move(true);
                }
                temp = false;
            }
        })
    })

    //6.调换相应的数组对应的元素。（先删除谁，在怎么添加）
    //判断参数，操作数组，使用数组
    function move(flag) {
        if (flag != undefined) {
            if (flag) {
                json.unshift(json.pop());
            } else {
                json.push(json.shift());
            }
        }
        //用数组中的每个元素的属性，为页面山的图片赋值

        $("#wrap").find('li').each(function(i) {

            $(this).css({
                    zIndex: json[i].z
                })
                .animate({
                        width: json[i].width,
                        top: json[i].top,
                        left: json[i].left,
                        opacity: json[i].opacity,

                    }, 400,
                    function() {
                        temp = true; //图片的属性加载完毕以后，在去更改temp的值，这时候才能第二次点击
                    })
        })
    }
}
