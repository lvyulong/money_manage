<template>
    <div class="page">
        <!--title-->
        <page-header back="1" :nav="nav"></page-header>
        <!--表单-->
        <div class="page-content" style="height: 90%;padding: 0;background:#F2F3F8 ">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <strong>支出统计</strong>
                </div>
                <div>
                    <strong class="mr1rem">开始日期：</strong>
                    <el-date-picker
                            v-model="expensePieFilter.start_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>

                    <strong class="ml3rem mr1rem">结束日期：</strong>
                    <el-date-picker
                            v-model="expensePieFilter.end_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div>
                    <my-chart :options="expensePieOptions"
                              style="width: 100%;height: 500px">
                    </my-chart>
                </div>
                <div style="border-top: 1px solid #e4e4e4;padding-top: 2rem">
                    <strong class="mr1rem"> 统计类型：</strong>
                    <el-radio-group v-model="expenseFilter.statisticType" style="margin-top: -4px">
                        <el-radio label="year">年</el-radio>
                        <el-radio label="month">月</el-radio>
                        <el-radio label="day">日</el-radio>
                    </el-radio-group>

                    <strong class="ml3rem mr1rem">开始日期：</strong>
                    <el-date-picker
                            v-model="expenseFilter.start_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>

                    <strong class="ml3rem mr1rem">结束日期：</strong>
                    <el-date-picker
                            v-model="expenseFilter.end_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div>
                    <my-chart :options="expenseOptions"
                              style="width: 100%;height: 500px">
                    </my-chart>
                </div>
            </el-card>
            <el-card class="box-card mt1rem">
                <div slot="header" class="clearfix">
                    <strong>收入统计</strong>
                </div>
                <div>
                    <strong class="mr1rem"> 统计类型：</strong>
                    <el-radio-group v-model="incomeFilter.statisticType" style="margin-top: -4px">
                        <el-radio label="year">年</el-radio>
                        <el-radio label="month">月</el-radio>
                        <el-radio label="day">日</el-radio>
                    </el-radio-group>

                    <strong class="ml3rem mr1rem">开始日期：</strong>
                    <el-date-picker
                            v-model="incomeFilter.start_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>

                    <strong class="ml3rem mr1rem">结束日期：</strong>
                    <el-date-picker
                            v-model="incomeFilter.end_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div>
                    <my-chart :options="incomeOptions"
                              style="width: 100%;height: 500px">
                    </my-chart>
                </div>
            </el-card>
            <el-card class="box-card mt1rem">
                <div slot="header" class="clearfix">
                    <strong>净收入统计</strong>
                </div>
                <div>
                    <strong class="mr1rem"> 统计类型：</strong>
                    <el-radio-group v-model="netFilter.statisticType" style="margin-top: -4px">
                        <el-radio label="year">年</el-radio>
                        <el-radio label="month">月</el-radio>
                        <el-radio label="day">日</el-radio>
                    </el-radio-group>

                    <strong class="ml3rem mr1rem">开始日期：</strong>
                    <el-date-picker
                            v-model="netFilter.start_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>

                    <strong class="ml3rem mr1rem">结束日期：</strong>
                    <el-date-picker
                            v-model="netFilter.end_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div>
                    <my-chart :options="netOptions"
                              style="width: 100%;height: 500px">
                    </my-chart>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
    import cashFlowApi from 'api/cashFlowApi';
    import propsApi from 'api/propsApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';

    export default {
        name: "appCashFlowNew",
        data() {
            return {
                pageApi: cashFlowApi,
                nav: [
                    {label: '现金流动', to: {name: 'appCashFlowIndex'}},
                    {label: '统计图表'}
                ],
                expenseFilter: {
                    statisticType: 'day',
                    start_date: '',
                    end_date: ''
                },
                expenseOptions: null,
                expensePieFilter: {
                    start_date: '',
                    end_date: ''
                },
                expensePieOptions: null,
                incomeFilter: {
                    statisticType: 'day',
                    start_date: '',
                    end_date: ''
                },
                incomeOptions: null,
                netFilter: {
                    statisticType: 'month',
                    start_date: '',
                    end_date: ''
                },
                netOptions: null,
                eventTypes: [],
            }
        },

        methods: {
            createBarOption(config) {
                var yMax = _.max(config.yData, function (item) {
                    return Number(item);
                });
                var yMin = _.min(config.yData, function (item) {
                    return Number(item);
                });
                var options = {
                    xAxis: {
                        type: 'category',
                        data: config.xData,
                        axisLine: {onZero: true},
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: config.name,
                            min: (yMin > 0) ? 0 : yMin * 2,
                            max: yMax * 2,
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        },
                        {
                            type: 'value',
                            show: false,
                            min: (yMin > 0) ? 0 : yMin * 2,
                            max: yMax,
                        },
                    ],
                    series: [
                        {
                            data: config.yData,
                            type: 'bar',
                            smooth: true,
                            label: {
                                show: true,
                                position: 'top',
                                color: '#000'

                            },
                            itemStyle: {
                                color: config.barColor
                            }
                        },
                        {
                            data: config.yData,
                            type: 'line',
                            smooth: true,
                            yAxisIndex: 1,
                            itemStyle: {
                                color: config.lineColor
                            }
                        }

                    ]
                };
                return options;
            },
            createPieOption(config) {
                var yMax = _.max(config.yData, function (item) {
                    return Number(item);
                });
                var yMin = _.min(config.yData, function (item) {
                    return Number(item);
                });
                var options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: config.legendData
                    },
                    series: [
                        {
                            name: '支出类型分布',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: config.seriesData
                        }
                    ]
                };
                return options;
            },
            getTrendData(params, type, config) {
                var that = this;
                this.pageApi[type]({
                    params: params
                }).then(function (res) {
                    var data = res.data.items;
                    // x轴以支出的数据为准
                    var xData = _.pluck(data, 'time');
                    var yData = _.pluck(data, 'value');
                    var charConfig = _.extend({}, config, {xData: xData, yData: yData});
                    var options = that.createBarOption(charConfig);
                    that[type + 'Options'] = options;
                })
            },
            getPieData(params, type, config) {
                var that = this;
                this.pageApi[type]({
                    params: params
                }).then(function (res) {
                    var data = res.data.items;
                    _.each(data, function (v, k) {
                        v.name = _.findWhere(that.eventTypes, {id: v.event_type}).name
                    });
                    // x轴以支出的数据为准
                    var legendData = _.pluck(data, 'name');
                    var charConfig = _.extend({}, config, {
                        legendData: legendData,
                        seriesData: data
                    });

                    var options = that.createPieOption(charConfig);
                    console.log(options);
                    that[type + 'Options'] = options;
                })
            },
        },
        created: function () {
            var that = this;
            axios.all([
                propsApi.query({
                    params: {
                        type: enumConfig['EVENT_TYPE']
                    }
                })
            ]).then(function (res) {

                that.eventTypes = res[0].data.items;
            })

        },
        watch: {
            'expensePieFilter': {
                handler: function (n, o) {
                    this.getPieData(n, 'expensePie', {
                        name: '支出类型构成图'
                    });
                },
                deep: true,
                immediate: true
            },
            'expenseFilter': {
                handler: function (n, o) {
                    this.getTrendData(n, 'expense', {
                        barColor: 'green',
                        lineColor: 'green',
                        name: '支出'
                    });
                },
                deep: true,
                immediate: true
            },
            'incomeFilter': {
                handler: function (n, o) {
                    this.getTrendData(n, 'income', {
                        barColor: 'red',
                        lineColor: 'red',
                        name: '收入'
                    });
                },
                deep: true,
                immediate: true
            },
            'netFilter': {
                handler: function (n, o) {
                    this.getTrendData(n, 'net', {
                        barColor: 'orange',
                        lineColor: 'orange',
                        name: '净收入'
                    });
                },
                deep: true,
                immediate: true
            },
        },
        beforeRouteEnter(to,from,next){
            axios.all([
                propsApi.query({
                    params: {
                        type: enumConfig['EVENT_TYPE']
                    }
                })
            ]).then(function (res) {
                next((vm)=>{
                    vm.eventTypes = res[0].data.items;
                });
            })
        }
    };
</script>
<style lang="less" scoped>

</style>
