
<template>
    <div class="page">
        <!--一、page-header部分-->
        <page-header title="用户管理"></page-header>

        <div class="page-content">
            <!--二、筛选部分-->
            <div>
                <router-link :to="{name:'appUserNew'}">
                    <el-button type="primary" plain>创建用户</el-button>
                </router-link>
                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>
                <!--下拉筛选-->
                <el-select
                        value-key="id"
                        class="pull-right mr1rem"
                        v-model="filter.is_enable"
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
            </div>
            <!--清除浮动-->
            <div class="clear-both"></div>
            <!--三、表格部分-->
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
                                    prop="mobile"
                                    label="手机号">
                            </el-table-column>

                            <el-table-column
                                    prop="mail"
                                    label="邮箱">
                            </el-table-column>

                            <el-table-column
                                    prop="created_at"
                                    label="创建时间">
                                <template slot-scope="scope">
                                    {{scope.row.created_at | dateFormat()}}
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="is_enable"
                                    label="启用状态">
                                <template slot-scope="scope" >
                                    <i style="font-size: 1.5rem" :class="scope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    width="250px"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                                name:'appUserEdit',
                                                params:{id:slotScope.row.id},
                                                query:{

                                                }}">
                                        <el-button type="primary" size="mini" plain>编辑</el-button>
                                    </router-link>
                                    <el-button size="mini"
                                               type="danger"
                                               plain
                                               v-if="slotScope.row.is_enable"
                                               @click="enableItem(slotScope.row)">
                                        禁用
                                    </el-button>
                                    <el-button size="mini"
                                               type="success"
                                               plain
                                               v-if="!slotScope.row.is_enable"
                                               @click="enableItem(slotScope.row)">
                                        启用
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
    import userApi from 'api/userApi';
    import axios from 'axios';

    export default {
        name: "appUserIndex",
        data() {
            return {
                // 页面列表的api
                pageListApi: userApi,
                // 本组件的路由名称
                routeName: 'appUserIndex',
                // 视图中需要的数据、选项等
                views: {
                    searchSelects: [
                        {label: '姓名', value: 'name'},
                        {label: '手机号', value: 'mobile'},
                        {label: '邮箱', value: 'mail'},
                    ],
                    status: [
                        {id: 1, name: '启用'},
                        {id: 0, name: '禁用'},
                    ],
                },
                filter: {
                    name: '',
                    is_enable: '',
                },
                validFilters: ['name', 'is_enable']
            }
        },
        methods: {
            enableItem(item) {
                var that = this;
                var data = {
                    id: item.id,
                    is_enable: item.is_enable ? 0 : 1
                };
                var tipStr = item.is_enable ? '确认禁用吗？' : '确认启用吗？';
                this.$confirm(tipStr).then(function () {
                    that.pageListApi.update({data: data}).then(function (res) {
                        item.is_enable = res.data.is_enable;
                        that.$message.success('修改成功！');
                    })
                })
            },
            deleteItem(item) {
                var that = this;
                this.$confirm('确认删除吗？').then(function () {
                    that.pageListApi.delete({
                        params:{
                            id:item.id
                        }
                    }).then(function (res) {
                        that.$message.success('删除成功！');
                        that.$refs.pageList.getList();
                    })
                })
            },
        },
        created: function () {
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
