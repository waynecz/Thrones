

define('Dashboard',['jquery','util','echarts','echarts/chart/line','echarts/chart/bar'],function($,util,echarts){

    var Dashboard = {
        init : function(){
            this.initCharts();
            this.initUsers();
            $(window).resize(this.initSize);
            this.initSize();
        },
        initCharts : function(){
            util.post('/statistic',function(data){
                Dashboard.render(data.dates,data.applys,data.leaders,data.safes,data.ops);
            });
        },
        initUsers : function(){
            util.post('/sysuser',function(data){
                for(var key in data){
                    $("#role"+key).text(data[key]+"");

                }
            });
        },
        echart : function(){
            return echarts.init(document.getElementById('statistic'));
        },
        initSize : function(){
            var contents = $("#contents").width();
            $("#area_daily").width(contents);
            $("#statistic").width(contents);
            var eachWidth = (contents - 15 * 3 ) / 4;
            console.log(contents);
            console.log(eachWidth);
            $(".panel_user").css("width",eachWidth);
            $(".panel_user:gt(0)").css("margin-left","15px");
        },
        render : function(dates,applys,leaders,safes,ops){
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    x : 'center',
                    data:['今日申请','领导审批','安全审批','运维审批']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : dates,
                        splitLine : {
                            show : false,
                            lineStyle : {
                                color: ['#ccc'],
                                width: 1,
                                type: 'solid'
                            }

                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine : {
                            show : true,
                            lineStyle : {
                                color: ['#ccc'],
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'今日申请',
                        type:'bar',
                        stack : '每日统计',
                        barWidth : '50',
                        data:applys,
                        itemStyle : {
                            normal : {
                                color:"#7a8c99"
                            }
                        }
                    },
                    {
                        name:'领导审批',
                        type:'bar',
                        stack : '每日统计',
                        data:leaders,
                        itemStyle : {
                            normal : {
                                color:"#6098bb"
                            }
                        }
                    },
                    {
                        name:'安全审批',
                        type:'bar',
                        stack : '每日统计',
                        data:safes,
                        itemStyle : {
                            normal : {
                                color:"#ff6c5c"
                            }
                        }
                    },
                    {
                        name:'运维审批',
                        type:'bar',
                        stack : '每日统计',
                        data:ops,
                        itemStyle : {
                            normal : {
                                color:"#a7db65"
                            }
                        }
                    }
                ]
            };
            Dashboard.echart().setOption(option);
        }
    }
    return Dashboard;
})





require(['Dashboard'],function(Dashboard){
    Dashboard.init();
});