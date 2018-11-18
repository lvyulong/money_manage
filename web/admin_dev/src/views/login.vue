<template>
    <div class="user-bg">
        <!--<div class="logo">-->
            <!--<img src="~image/login/logo.png" style="width: 200px">-->
        <!--</div>-->
        <el-card class="user-panel">
            <div class="panel-body">
                <div class="login-area">
                    <h2 class="text-center">{{loginTitle}}</h2>
                    <div class="mt2rem">
                        <el-form :model="model"
                                 status-icon
                                 :rules="rules"
                                 ref="form">
                            <el-form-item prop="mobile">
                                <el-input placeholder="手机号" v-model="model.mobile" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item prop="password">
                                <el-input type="password" placeholder="密码" v-model="model.password"></el-input>
                            </el-form-item>
                            <el-form-item class="text-center">
                                <el-button class="submit" type="primary" round @click="submit">登录</el-button>
                            </el-form-item>
                            <div class="text-right">
                                <router-link :to="{name:'register'}" class="register">
                                    没有账号？请注册
                                </router-link>
                            </div>
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
        name: "Login",
        data() {
            return {
                loginTitle:sys.loginTitle,
                model:{
                    mobile:'',
                    password:''
                },
                formRules:[
                    {key:'mobile',label:'手机号'},
                    {key:'password',label:'密码'}
                ],
                key: '',
                loginError: '',
                appRouterEnter:{
                    name:'appUserIndex'
                }
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
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        authApi.login({
                            data:that.model
                        }).then(function (res) {
                            that.$router.push(that.appRouterEnter);
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
        background-image: url(~image/login/bg.png);
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
            background: rgba(255, 255, 255, .8);
            width: 500px;
            border: none;
            border-radius: 7px;
            box-shadow: 0 0 7px rgba(0, 0, 0, .15);
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -240px 0 0 -250px;
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

