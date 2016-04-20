!function(){
	var btn = document.getElementById("devtime");
	var curDevtime = cur = parseInt(localStorage.getItem("devtime")) || 10;
	btn.innerText = cur;
	var timer = setInterval(run,1000);
	btn.onclick = function(){
		var times = [2,5,10,3000,2];
		var index = times.indexOf(curDevtime);
		index ++;
		if(index == times.length){
			index = 0;
		}
		localStorage.setItem("devtime",times[index]);
		btn.innerText = times[index];
		cur = times[index];
		curDevtime = times[index];
		clearInterval(timer);
		timer = setInterval(run, 1000);
		
	}

	function run(){
		cur	--;
		btn.innerText = cur;
		if(cur == 0){
			location.reload();
		}
	}
}();




require(['jquery'],function($){
	//菜单操作
	var title = document.title;
	var link = $(".subnav a[data-page='" + title + "']");
	link.addClass('active');
	link.parents("dd").prev("dt").addClass("active");
	document.title = "Thrones-" + (link.text() || '后台管理中心');

    $(".nav").each(function(index){
        $(this).data("state",1);
        $(this).click(function(){
            var state = $(this).data("state");
            if(state == 1){
                $(this).next().find("ul").slideUp();
                $(this).data('state',0);
            }
            else{
                $(this).next().find("ul").slideDown();
                $(this).data('state',1);
            }

        });
    });

	$(".nav").click(function(){
		$(this).nextSibling(".subnav").slideUp();
	});

    $(window).resize(function(){
        setSearchSectionSize();
    });
    setSearchSectionSize();
    function setSearchSectionSize(){
        //判断内容区域的宽度
        var sectionHeight = $(".search_section").outerHeight(true);
        if(sectionHeight > 120){
            $(".search_item").css("margin-bottom","20px");
        }
        else{
            $(".search_item").css("margin-bottom","0px");
        }
    }


});


