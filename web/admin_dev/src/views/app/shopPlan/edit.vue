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
                <el-form-item label="计划名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>

                <el-form-item label="花费金额" prop="money">
                    <el-input type="number" v-model="model.money"></el-input>
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
    import shopPlanApi from 'api/shopPlanApi';
    import propsApi from 'api/propsApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';
    export default {
        name: "appShopPlanEdit",
        data() {
            return {
                pageApi: shopPlanApi,
                nav:[
                    {label:'消费计划',to:{name:'appShopPlanIndex'}},
                    {label:'新增计划'}
                ],
                model:{
                    name:'',
                    money:'',
                    event_type:'',
                    desc:''
                },
                formRules:[
                    {key:'name',label:'计划名称'},
                    {key:'money',label:'花费金额'},
                    {key:'event_type',label:'事件类型'},
                ],
                views:{
                    eventType:[]
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
                        that.pageApi.update({
                            data:data
                        }).then(function (res) {
                            that.$message.success("修改成功");
                            that.$router.push({name:'appShopPlanIndex'});
                        })
                    }
                })
            }
        },
        created:function(){
            var that = this;
            axios.all([
                propsApi.query({params:{type:enumConfig['EVENT_TYPE']}}),
                shopPlanApi.get({params:{id:that.$route.params.id}})
            ]).then(function (res) {
                that.views.eventType = res[0].data.items;
                that.model = res[1].data;
            })
        }
    };
</script>
<style lang="less" scoped>

</style>
