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
                <el-form-item label="名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>

                <el-form-item label="金额" prop="money">
                    <el-input type="number" v-model="model.money"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select
                            style="width: 100%"
                            v-model="model.type"
                            placeholder="类型">
                        <el-option
                                v-for="item in views.type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="事件类型" prop="event_type">
                    <el-select
                            style="width: 100%"
                            v-model="model.event_type"
                            placeholder="事件类型">
                        <el-option
                                v-for="item in views.eventType"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" rows="5" v-model="model.desc"></el-input>
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
    import cashFlowApi from 'api/cashFlowApi';
    import propsApi from 'api/propsApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';
    export default {
        name: "appCashFlowNew",
        data() {
            return {
                pageApi: cashFlowApi,
                nav:[
                    {label:'现金流动',to:{name:'appCashFlowIndex'}},
                    {label:'新增流水'}
                ],
                model:{
                    name:'',
                    money:'',
                    type:'',
                    event_type:'',
                    desc:''
                },
                formRules:[
                    {key:'name',label:'名称'},
                    {key:'money',label:'金额'},
                    {key:'type',label:'类型'},
                    {key:'event_type',label:'事件类型'},
                ],
                views:{
                    eventType:[],
                    type:[
                        {id:1,name:'收入'},
                        {id:2,name:'支出'},
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
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        var data = Object.assign({},that.model);
                        that.pageApi.save({
                            data:data
                        }).then(function (res) {
                            that.$message.success("新增成功");
                            that.$router.push({name:'appCashFlowIndex'});
                        })
                    }
                })
            }
        },
        created:function(){
            var that = this;
            axios.all([
                propsApi.query({params:{type:enumConfig['EVENT_TYPE']}})
            ]).then(function (res) {
                that.views.eventType = res[0].data.items;

            })
        }
    };
</script>
<style lang="less" scoped>

</style>
