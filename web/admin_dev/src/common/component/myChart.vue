<template>
    <div>
        <div ref="chart" style="width: 100%;height: 100%"></div>
    </div>
</template>
<script>
    import echarts from 'echarts';
    export default {
        name: "myChart",
        data() {
            return {
                myChart:{}
            };
        },
        props: ['options'],
        methods: {
            draw(myChart,options){
                myChart.setOption(options)
            }
        },
        mounted:function(){
            this.myChart = echarts.init(this.$refs.chart);
            if(this.options){
                this.myChart.setOption(this.options);
            }
        },
        watch: {
            'options':{
                handler:function () {
                    console.log(this.options);
                    this.myChart.setOption(this.options)
                },
                deep:true
            }
        }
    };
</script>
<style scoped lang="less">

</style>

