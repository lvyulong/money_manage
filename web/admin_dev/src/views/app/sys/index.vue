<template>
    <div class="page">
        <page-header title="系统数据"></page-header>
        <div class="page-content" style="height: 90%">
            <div class="padding mt1rem">
                <h3>现金流事件类型</h3>
                <div class="mt1rem">
                    <tags
                            :tags="tags['eventType']"
                            :active.sync="actives.eventType"
                            keyName="eventType"
                            @edit="onEdit"
                            @delete="onDelete"
                            @save="onSave">
                    </tags>
                </div>
            </div>
            <div class="padding mt1rem">
                <h3>资金类型</h3>
                <div class="mt1rem">
                    <tags
                            :tags="tags['moneyType']"
                            :active.sync="actives.moneyType"
                            keyName="moneyType"
                            @edit="onEdit"
                            @delete="onDelete"
                            @save="onSave">
                    </tags>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import propsApi from 'api/propsApi';
    import enumConfig from 'app/common/config/enum';
    export default {
        name: "appSysIndex",
        data() {
            return {
                typeMap: {
                    eventType: 'EVENT_TYPE',
                    moneyType: 'MONEY_TYPE'
                },
                tags: {
                    eventType: [],
                    moneyType:[]
                },
                actives:{
                    eventType:'',
                    moneyType:''
                },
            }
        },
        methods: {
            // 重新获取props
            getTags(){
                var that = this;
                propsApi.query({
                    params:{
                        _page_size:-1
                    }
                }).then(function (res) {
                    var props = res.data.items;
                    that.tags.eventType = _.where(props, {type: enumConfig["EVENT_TYPE"]});
                    that.tags.moneyType = _.where(props, {type: enumConfig["MONEY_TYPE"]});
                    that.actives.eventType = that.tags.eventType[0]&&that.tags.eventType.id;
                    that.actives.moneyType = that.tags.moneyType[0]&&that.tags.moneyType.id;
                });
            },
            onSave(tag,keyName) {
                var that = this;
                var data = Object.assign({}, tag);
                data.type = enumConfig[that.typeMap[keyName]];
                propsApi.save({data: data}).then(function (res) {
                    that.getTags();
                    that.$message.success('添加成功');
                })
            },
            onEdit(tag,keyName) {
                var that = this;
                var data = Object.assign({}, tag);
                propsApi.update({data: data}).then(function (res) {
                    that.getTags();
                    that.$message.success('修改成功');
                })
            },
            onDelete(tag) {
                this.$message.warning("类型禁止删除");
            },

        },
        created:function(){
            this.getTags();
        },
    };
</script>
<style lang="less" scoped>
    .input-new-tag {
        width: 100px;
    }
    .tag {
        cursor: pointer;
    }
    .tag-active {
        background-color: #67c23a;
        color: white !important;
    }
</style>
