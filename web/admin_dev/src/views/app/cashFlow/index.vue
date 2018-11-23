<template>
    <div class="page">
        <page-header title="现金流动"></page-header>
        <div class="page-content">
            <div>
                <router-link :to="{name:'appCashFlowNew'}">
                    <el-button type="primary" plain>新增流水</el-button>
                </router-link>

                <router-link :to="{name:'appCashFlowChart'}">
                    <el-button type="warning" plain>统计图表</el-button>
                </router-link>
                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>

                <!--事件类型-->
                <el-select
                        value-key="id"
                        class="pull-right mr1rem"
                        v-model="filter.event_type"
                        filterable
                        clearable
                        placeholder="请选择事件类型">
                    <el-option
                            v-for="item in views.eventType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id+''">
                    </el-option>
                </el-select>

                <!--类型-->
                <el-select
                        value-key="id"
                        class="pull-right mr1rem"
                        v-model="filter.type"
                        filterable
                        clearable
                        placeholder="请选择类型">
                    <el-option
                            v-for="item in views.type"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id+''">
                    </el-option>
                </el-select>

            </div>
            <!--清除浮动-->
            <div class="clear-both"></div>
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi" ref="pageList">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  height="820"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    width="50"
                                    prop="id"
                                    label="ID">
                            </el-table-column>

                            <el-table-column
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    prop="money"
                                    label="金额">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.type == 1" class="green font18"> + {{scope.row.money}}</span>
                                    <span v-if="scope.row.type == 2" class="red font18"> - {{scope.row.money}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="type"
                                    label="类型">
                                <template slot-scope="scope">
                                    {{scope.row.type | propMap(views.type,'id','name')}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="event_type"
                                    label="事件类型">
                                <template slot-scope="scope">
                                    {{scope.row.event_type | propMap(views.eventType,'id','name')}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="desc"
                                    label="描述">
                            </el-table-column>
                            <el-table-column
                                    prop="created_at"
                                    label="创建时间">
                                <template slot-scope="scope">
                                    {{scope.row.created_at | dateFormat()}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </page-list>
            </div>
        </div>
    </div>
</template>

<script>
    import cashFlowApi from 'api/cashFlowApi';
    import propsApi from 'api/propsApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';

    export default {
        name: "appCashFlowIndex",
        data() {
            return {
                // 页面列表的api
                pageListApi: cashFlowApi,
                // 本组件的路由名称
                routeName: 'appCashFlowIndex',
                // 视图中需要的数据、选项等
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ],
                    eventType: [],
                    type:[
                        {name:'收入',id:1},
                        {name:'支出',id:2}
                    ]
                },
                filter: {
                    name: '',
                    type:'',
                    event_type: ''
                },
                validFilters: ['name', 'type', 'event_type']
            }
        },
        methods: {

        },
        created: function () {
            var that = this;
            axios.all([
                propsApi.query({params: {type: enumConfig['EVENT_TYPE']}})
            ]).then(function (res) {
                that.views.eventType = res[0].data.items;
            })
        },
        watch: {
            // 监听filter，刷新页面
            filter: {
                handler: function (n, o) {
                    if (n) {
                        let params = Object.assign({}, this.$route.query, n);
                        // 清除无效属性
                        params = myTool.clearInvalidProp(params);
                        this.$router.push({name: this.routeName, query: params});
                    }
                },
                deep: true
            },
            '$route.query': {
                // 监听地址栏参数变化，及时更新到页面的筛选器中
                handler: function (n, o) {
                    this.filter = myTool.trimObj(n, this.validFilters);
                },
                // 侦听开始之后被立即调用
                immediate: true
            }
        },
    };
</script>
<style lang="less" scoped>

</style>
