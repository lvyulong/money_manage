<template>
    <div class="page">
        <page-header title="用户管理"></page-header>

        <div class="page-content">
            <page-list :pageListApi="pageListApi">
                <template slot-scope="slotScope">
                    <el-table :data="slotScope.list"
                              border
                              size="mini"
                              style="width: 100%">
                        <el-table-column
                                prop="id"
                                label="ID">
                        </el-table-column>

                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="手机号">
                        </el-table-column>
                        <el-table-column
                                prop="email"
                                label="邮箱">
                        </el-table-column>

                        <el-table-column
                                prop="created_at"
                                label="创建时间">
                        </el-table-column>
                    </el-table>
                </template>
            </page-list>
        </div>
    </div>
</template>

<script>
    import userApi from 'api/userApi';
    export default {
        name: "appUserIndex",
        data() {
            return {
                pageListApi: userApi,
                search: {},
            }
        },
        computed: {

        },
        methods: {

        },
        mounted: function () {

        }
    };
</script>
<style lang="less" scoped>

</style>
