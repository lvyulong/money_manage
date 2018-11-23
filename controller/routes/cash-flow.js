var router = require('express').Router();
var initRoute = require('../initRoute');
var actions = require('../actions');
var speActions = require('../speActions');
var _ = require('underscore');

initRoute(router, {
    table: 't_cash_flow',
    notDelete: true,
    notUpdate: true,
    notCreate: true
});
// create
router.post('/', function (req, res, next) {
    var model = Object.assign({}, req.body);
    model.created_by = req.session.user.id;
    actions.create({
        table: 't_cash_flow',
        model: model,
        callback: function (err, result) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: '插入现金流动数据失败',
                        cause: err
                    }
                })
            } else {
                actions.find({
                    table: 't_cash_total',
                    query: {created_by: req.session.user.id},
                    callback: function (err, cashTotalRows) {
                        if (err) {
                            next({
                                status: 500,
                                error: {
                                    message: '查询基本面板数据失败',
                                    cause: err
                                }
                            })
                        } else {
                            var latestData = cashTotalRows.items[0].money;
                            if(model.type == 1){
                                // 收入
                                latestData = latestData*1 + model.money*1;
                            }
                            if(model.type == 2){
                                // 支出
                                latestData = latestData*1 - model.money*1;
                            }
                            actions.create({
                                table: 't_cash_total',
                                model: {
                                    money: latestData,
                                    event_type: model.event_type,
                                    desc: '来自手动录入现金流动记录',
                                    created_by: req.session.user.id
                                },
                                callback: function (err, resultCashTotal) {
                                    if (err) {
                                        next({
                                            status: 500,
                                            error: {
                                                message: '插入基本面板数据失败',
                                                cause: err
                                            }
                                        })
                                    } else {
                                        res.send(result);
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
});

// 支出
router.get('/expense',function (req,res,next) {
    var query = Object.assign({
        created_by: req.session.user.id,
        statisticType:'day'
    }, req.query);
    speActions.getCashFlow({
        query: query,
        table: 't_cash_flow',
        callback: function (err, result) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: '获取数据库数据失败',
                        cause: err
                    }
                })
            }else{
                res.send({
                    items:result['expense']
                });
            }
        }
    });
    
});
// 收入
router.get('/income',function (req,res,next) {
    var query = Object.assign({
        created_by: req.session.user.id,
        statisticType:'day'
    }, req.query);
    speActions.getCashFlow({
        query: query,
        table: 't_cash_flow',
        callback: function (err, result) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: '获取数据库数据失败',
                        cause: err
                    }
                })
            }else{
                res.send({
                    items:result['income']
                });
            }
        }
    });

});
// 净收入
router.get('/net',function (req,res,next) {
    var query = Object.assign({
        created_by: req.session.user.id,
        statisticType:'day'
    }, req.query);
    speActions.getCashFlow({
        query: query,
        table: 't_cash_flow',
        callback: function (err, result) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: '获取数据库数据失败',
                        cause: err
                    }
                })
            }else{
                var expense = result['expense'];
                var income = result['income'];
                var net = [];
                _.each(expense,function (v,k) {
                    var incomeItem = _.findWhere(income,{time:v.time});
                    if(incomeItem){
                        net.push({
                            time:v.time,
                            value:Number(incomeItem.value) - Number(v.value)
                        })
                    }else{
                        net.push({
                            time:v.time,
                            value:-Number(v.value)
                        })
                    }
                });
                res.send({
                    items:net
                });
            }
        }
    });
});

// 支出类型构成百分比图
router.get('/expense-pie',function (req,res,next) {
    var query = Object.assign({
        created_by: req.session.user.id,
    }, req.query);
    speActions.getCashFlowPie({
        query: query,
        table: 't_cash_flow',
        callback: function (err, result) {
            if (err) {
                next({
                    status: 500,
                    error: {
                        message: '获取数据库数据失败',
                        cause: err
                    }
                })
            }else{
                res.send(result);
            }
        }
    });
});

module.exports = router;
