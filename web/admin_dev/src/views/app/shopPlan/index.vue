<template>
    <div class="page">
        <!--一、page-header部分-->
        <page-header title="消费计划"></page-header>

        <div class="page-content">
            <!--二、筛选部分-->
            <div>
                <router-link :to="{name:'appShopPlanNew'}">
                    <el-button type="primary" plain>新增计划</el-button>
                </router-link>
                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>
                <!--状态-->
                <el-select
                        value-key="id"
                        class="pull-right mr1rem"
                        v-model="filter.status"
                        filterable
                        clearable
                        placeholder="请选择状态">
                    <el-option
                            v-for="item in views.status"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id+''">
                    </el-option>
                </el-select>
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
            </div>
            <!--清除浮动-->
            <div class="clear-both"></div>
            <!--三、表格部分-->
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi" ref="pageList">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  :row-class-name="tableRowClassName"
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
                                    label="计划名称">
                            </el-table-column>

                            <el-table-column
                                    prop="money"
                                    label="花费金额">
                            </el-table-column>

                            <el-table-column
                                    prop="status"
                                    label="状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status==0">待完成</span>
                                    <span v-if="scope.row.status==1" class="green">已完成</span>
                                    <span v-if="scope.row.status==2" class="red">已作废</span>
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

                            <el-table-column
                                    width="350px"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                                name:'appShopPlanEdit',
                                                params:{id:slotScope.row.id},
                                                query:{

                                                }}">
                                        <el-button type="primary" size="mini" plain>编辑</el-button>
                                    </router-link>

                                    <el-button size="mini"
                                               :disabled="slotScope.row.status > 0"
                                               type="success"
                                               @click="completeShop(slotScope.row,'SHOP_PLAN_STATUS_COMPLETE')">
                                        完成
                                    </el-button>

                                    <el-button size="mini"
                                               type="warning"
                                               :disabled="slotScope.row.status > 0"
                                               v-if="slotScope.row.status!=2"
                                               @click="changeStatus(slotScope.row,'SHOP_PLAN_STATUS_CANCEL')">
                                        作废
                                    </el-button>

                                    <el-button size="mini"
                                               type="info"
                                               v-if="slotScope.row.status==2"
                                               @click="changeStatus(slotScope.row,'SHOP_PLAN_STATUS_INIT')">
                                        取消作废
                                    </el-button>

                                    <el-button size="mini"
                                               type="danger"
                                               @click="deleteItem(slotScope.row)">
                                        删除
                                    </el-button>
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
    import shopPlanApi from 'api/shopPlanApi';
    import propsApi from 'api/propsApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';

    export default {
        name: "appShopPlanIndex",
        data() {
            return {
                // 页面列表的api
                pageListApi: shopPlanApi,
                // 本组件的路由名称
                routeName: 'appShopPlanIndex',
                // 视图中需要的数据、选项等
                views: {
                    searchSelects: [
                        {label: '计划名称', value: 'name'},
                    ],
                    status: [
                        {id: '0', name: '待完成'},
                        {id: '1', name: '已完成'},
                        {id: '2', name: '已作废'},
                    ],
                    eventType: []
                },
                filter: {
                    name: '',
                    status: '',
                    event_type: ''
                },
                validFilters: ['name', 'status', 'event_type']
            }
        },
        methods: {
            changeStatus(item, key) {
                var that = this;
                var tipStr
                // 完成
                if (key == 'SHOP_PLAN_STATUS_COMPLETE') {
                    tipStr = "完成之后，数据会自动同步到现金流动和基本面板。确认完成吗？"
                }
                // 作废
                if (key == 'SHOP_PLAN_STATUS_CANCEL') {
                    tipStr = "确认作废吗？"
                }
                // 取消作废
                if (key == 'SHOP_PLAN_STATUS_INIT') {
                    tipStr = "确认取消作废吗？"
                }
                var data = {
                    id:item.id,
                    status:enumConfig[key]
                };
                this.$confirm(tipStr).then(function () {
                    that.pageListApi.update({data: data}).then(function (res) {
                        item.status = res.data.status;
                        that.$message.success('修改成功！');
                    })
                })
            },
            completeShop(item){
                var that = this;
                var data = Object.assign({},item);
                data.status = enumConfig['SHOP_PLAN_STATUS_COMPLETE'];

                this.$confirm("完成之后，数据会自动同步到现金流动和基本面板。确认完成吗？").then(function () {
                    that.pageListApi.complete({data: data}).then(function (res) {
                        item.status = res.data.status;
                        that.$message.success('购物计划已完成！');
                    })
                })
            },
            deleteItem(item) {
                var that = this;
                this.$confirm('确认删除吗？').then(function () {
                    that.pageListApi.delete({
                        params: {
                            id: item.id
                        }
                    }).then(function (res) {
                        that.$message.success('删除成功！');
                        that.$refs.pageList.getList();
                    })
                })
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === 2) {
                    return 'warning-row';
                } else if (row.status === 1) {
                    return 'success-row';
                }
                return '';
            }
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
.warning-row{
    background: oldlace!important;
}
</style>
