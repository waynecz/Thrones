

define('Dashboard',['jquery','util','echarts','echarts/chart/line','echarts/chart/bar'],function($,util,echarts){

    var Dashboard = {
        init : function(){
            var myChart = echarts.init(document.getElementById('area_daily'));
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    show:true,
                    zlevel:1,
                    horizontal : 'horizonal',
                    itemWidth : 20,
                    itemHeight : 14,
                    x:'10px',
                    y:'10px',
                    data:['今日申请','安全审批','运维审批']
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
                        data : ['02-01','02-02','02-03','02-04','02-05','02-06','02-07'],
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
                        name:'申请人数',
                        type:'bar',
                        stack : '每日统计',
                        barWidth : '50',
                        data:[320, 332, 301, 334, 390, 330, 320],
                        itemStyle : {
                            normal : {
                                color:"#7a8c99"
                            }
                        }
                    },
                    {
                        name:'安全审批人数',
                        type:'bar',
                        stack : '每日统计',
                        data:[120, 132, 101, 134, 90, 230, 210],
                        itemStyle : {
                            normal : {
                                color:"#ff6c5c"
                            }
                        }
                    },
                    {
                        name:'运维审批人数',
                        type:'bar',
                        stack : '每日统计',
                        data:[220, 182, 191, 234, 290, 330, 310],
                        itemStyle : {
                            normal : {
                                color:"#a7db65"
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
    return Dashboard;
})



require(['Dashboard'],function(Dashboard){
    Dashboard.init();
});