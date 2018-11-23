<template>
    <div class="user-bg">
        <el-card class="user-panel">
            <div class="panel-body">
                <div class="login-area">
                    <h2 class="text-center">{{loginTitle}}</h2>
                    <div class="mt2rem">
                        <el-form :model="model"
                                 status-icon
                                 :rules="rules"
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

                            <el-form-item class="text-center">
                                <el-button class="submit" type="primary" round @click="submit">注册</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

            </div>
        </el-card>
    </div>
</template>
<script>
    import authApi from 'api/authApi';
    import sys from 'config/sys';

    export default {
        name: "Register",
        data() {
            return {
                loginTitle:sys.registerTitle,
                model:{
                    name:'',
                    password:'',
                    password2:'',
                    mobile:'',
                    mail:''
                },
                formRules:[
                    {key:'name',label:'账号'},
                    {key:'password',label:'密码',length:6},
                    {key:'password2',label:'重复密码'},
                    {key:'mobile',label:'手机号',length:11},
                    {key:'mail',label:'邮箱',reg:/\S+@\S+\.\S+/},
                ]
            };
        },
        computed:{
            rules:function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            },
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
                        authApi.register({
                            data:data
                        }).then(function (res) {
                            that.$message.success("注册成功");
                            that.$router.push({name:'login'});
                        })
                    }
                })
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "~style/variable";
    .user-bg {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background-image: url(~image/login/bg3.jpg);
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        .logo {
            text-align: center;
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -360px;
        }
        .user-panel {
            background: rgba(240, 255, 255, .8);
            width: 500px;
            border: none;
            border-radius: 7px;
            box-shadow: 0 0 7px rgba(0, 0, 0, .15);
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -370px 0 0 -250px;
            .panel-body {
                padding: 15px 25px;
            }
        }
    }
    .error{
        color: red;
    }
    .submit{
        padding: 1rem 190px;
    }
    .register{
        color: @primary;
    }
</style>

