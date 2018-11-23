var router = require('express').Router();
var initRoute = require('../initRoute');
var actions = require('../actions');

initRoute(router, {
    table: 't_shop_plan'
});

router.post('/complete', function (req, res, next) {
    var model = Object.assign({}, req.body);
    if (model.created_at) {
        delete model.created_at;
    }
    if (model.updated_at) {
        delete model.updated_at;
    }
    actions.update({
        table: 't_shop_plan',
        model: model,
        callback: function (err, resultShopPlan) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: "更新记录失败",
                        cause: err
                    }
                })
            } else {
                // 如果完成状态更新成功，则在现金流动表中插入一条新数据
                actions.create({
                    table: 't_cash_flow',
                    model: {
                        name: model.name,
                        money: model.money,
                        type: 2, //支出
                        event_type: model.event_type,
                        desc: '来自消费计划完成',
                        created_by: req.session.user.id,
                    },
                    callback: function (err, resultCashFlow) {
                        if (err) {
                            next({
                                status: 500,
                                error: {
                                    message: "同步到现金流动失败",
                                    cause: err
                                }
                            })
                        } else {

                            // 获取该用户的总资产面板
                            actions.find({
                                table: 't_cash_total',
                                query: {
                                    created_by: req.session.user.id
                                },
                                callback: function (err, resCashTotal) {
                                    if (err) {
                                        next({
                                            status: 500,
                                            error: {
                                                message: "获取基本面板数据失败",
                                                cause: err
                                            }
                                        })
                                    } else {
                                        // console.log(resCashTotal);
                                        // res.send(resultShopPlan);
                                        // return;
                                        var latestTotalMoney = resCashTotal.items[0].money;
                                        actions.create({
                                            table:'t_cash_total',
                                            model:{
                                                money: latestTotalMoney*1 - model.money*1,
                                                event_type: model.event_type,
                                                desc: '来自消费计划完成',
                                                created_by: req.session.user.id,
                                            },
                                            callback:function (err,resultCashTotal) {
                                                if(err){
                                                    next({
                                                        status: 500,
                                                        error: {
                                                            message: "插入基本面板数据失败",
                                                            cause: err
                                                        }
                                                    })
                                                }else{
                                                    res.send(resultShopPlan);

                                                }
                                            }
                                        })

                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
    })


});


module.exports = router;