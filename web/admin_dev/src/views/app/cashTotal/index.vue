<template>
    <div class="page">
        <page-header title="系统数据"></page-header>
        <div class="page-content" style="height: 90%;padding: 0">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本面板</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="updateCashTotalVisible = true">
                        更新
                    </el-button>
                </div>
                <div v-if="latestItem">
                   <span>
                        <strong>总资产:</strong>
                       {{latestItem.money}}
                   </span>
                </div>
                <div v-else>
                    未发现任何数据，请
                    <span class="primary pointer" @click="updateCashTotalVisible = true">初始化</span>
                </div>
            </el-card>
            <!--图表-->
            <el-card class="box-card mt2rem">
                <div slot="header" class="clearfix">
                    <strong>总资产走势图</strong>
                </div>
                <div>
                    <strong class="mr1rem"> 统计类型：</strong>
                    <el-radio-group v-model="trendFilter.statisticType" style="margin-top: -4px">
                        <el-radio label="year">年</el-radio>
                        <el-radio label="month">月</el-radio>
                        <el-radio label="day">日</el-radio>
                    </el-radio-group>

                    <strong class="ml3rem mr1rem">开始日期：</strong>
                    <el-date-picker
                            v-model="trendFilter.start_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>

                    <strong class="ml3rem mr1rem">结束日期：</strong>
                    <el-date-picker
                            v-model="trendFilter.end_date"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div>

                </div>
                <div>
                    <my-chart :options="trendOptions"
                                    style="width: 100%;height: 500px">
                    </my-chart>
                </div>
            </el-card>
        </div>
        <el-dialog title="更新数据" :visible.sync="updateCashTotalVisible">
            <el-form :model="model"
                     :rules="rules"
                     ref="formUpdateCashTotal">
                <el-form-item label="总资产" :label-width="'80'" prop="money">
                    <el-input type="number" v-model="model.money" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="'80'">
                    <el-input type="textarea" rows="5" v-model="model.desc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="updateCashTotalVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="updateCashTotal">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import cashTotalApi from 'api/cashTotalApi';

    export default {
        name: "appCashTotalIndex",
        data() {
            return {
                latestItem: {},
                updateCashTotalVisible: false,
                model: {
                    money: '',
                    event_type: 0,
                    desc: ''
                },
                formRules: [
                    {key: 'money', label: '总资产'},
                ],
                cashTotalData: [],

                trendFilter:{
                    statisticType: 'day',
                    start_date:'',
                    end_date:''
                },
                trendOptions: null,

            }
        },
        computed: {
            rules: function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            }
        },
        methods: {
            getCashTotal() {
                var that = this;
                cashTotalApi.query({}).then(function (res) {
                    that.latestItem = res.data.items[0];
                })
            },

            getTrendData(params) {
                var that = this;
                cashTotalApi.trend({
                    params: params
                }).then(function (res) {
                    var data = res.data.items;
                    var xData = _.pluck(data, 'time');
                    var yData = _.pluck(data, 'value');
                    var yMax = _.max(yData, function(item){ return Number(item); });
                    var options = {
                        xAxis: {
                            type: 'category',
                            data: xData
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '金额',
                                min: 0,
                                max:yMax*2,
                                axisLabel: {
                                    formatter: '{value} 元'
                                }
                            },
                            {
                                type: 'value',
                                show:false,
                                min: 0,
                                max:yMax,
                            },
                        ],
                        series: [
                            {
                                data: yData,
                                type: 'bar',
                                smooth: true,
                                label:{
                                    show: true,
                                    position:'top',
                                    color:'#000'

                                },
                                itemStyle:{
                                    color:'#409EFF'
                                }
                            },
                            {
                                data: yData,
                                type: 'line',
                                smooth: true,
                                yAxisIndex:1,
                                itemStyle:{
                                    color:'#409EFF'
                                }
                            }

                        ]
                    };
                    that.trendOptions = options;
                })
            },
            updateCashTotal() {
                var that = this;
                this.$refs.formUpdateCashTotal.validate((valid) => {
                    if (valid) {
                        var data = Object.assign({}, that.model);
                        cashTotalApi.save({
                            data: data
                        }).then(function (res) {
                            that.$message.success("更新数据成功");
                            that.updateCashTotalVisible = false;
                            that.getCashTotal();
                        })
                    }
                })
            },

        },
        created: function () {
            this.getCashTotal();
        },
        watch: {
            'trendFilter': {
                handler: function (n, o) {
                    this.getTrendData(n);
                },
                deep:true,
                immediate: true
            }
        }
    };
</script>
<style lang="less" scoped>

</style>
