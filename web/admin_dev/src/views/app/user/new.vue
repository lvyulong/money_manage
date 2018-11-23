<template>
    <div class="page">
        <!--title-->
        <page-header back="1" :nav="nav"></page-header>
        <!--表单-->
        <div class="page-content" style="height: 90%">
            <el-form :model="model"
                     style="width: 800px"
                     label-width="150px"
                     :rules="rules"
                     class="mt2rem"
                     ref="form">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" placeholder="密码" v-model="model.password"></el-input>
                </el-form-item>

                <el-form-item label="重复密码" prop="password2">
                    <el-input type="password" placeholder="重复密码" v-model="model.password2"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                    <el-input type="number" v-model="model.mobile"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="model.mail"></el-input>
                </el-form-item>
                <!--账户类型-->
                <el-form-item label="账户类型" prop="type">
                    <el-select
                            style="width: 100%"
                            v-model="model.type"
                            placeholder="账户类型">
                        <el-option
                                v-for="item in views.userTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否启用" prop="is_enable">
                    <el-switch v-model="model.is_enable"
                               :active-value=1
                               :inactive-value=0
                               style="margin-top: 10px"></el-switch>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                               size="mini"
                               @click="submit('form')">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import axios from 'axios';
    export default {
        name: "appUserNew",
        data() {
            return {
                pageApi: userApi,
                nav:[
                    {label:'用户管理',to:{name:'appUserIndex'}},
                    {label:'创建新用户'}
                ],
                model:{
                    name:'',
                    password:'',
                    password2:'',
                    mobile:'',
                    mail:'',
                    is_enable:1,
                    type:1
                },
                formRules:[
                    {key:'name',label:'账号'},
                    {key:'password',label:'密码',length:6},
                    {key:'password2',label:'重复密码'},
                    {key:'mobile',label:'手机号',length:11},
                    {key:'mail',label:'邮箱',reg:/\S+@\S+\.\S+/},
                ],
                views:{
                    userTypes:[
                        {name:'管理员',id:0},
                        {name:'用户',id:1},
                    ]
                },
            }
        },
        computed:{
            rules:function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            }
        },
        methods: {
            submit(){
                var that = this;
                if(that.model.password!==that.model.password2){
                    that.$message.error("两次输入密码不一致");
                    return;
                }
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        var data = Object.assign({},that.model);
                        delete data.password2;
                        userApi.save({
                            data:data
                        }).then(function (res) {
                            that.$message.success("创建成功");
                            that.$router.push({name:'appUserIndex'});
                        })
                    }
                })
            }
        },
        created:function(){}
    };
</script>
<style lang="less" scoped>

</style>
