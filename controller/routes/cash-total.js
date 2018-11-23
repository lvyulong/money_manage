var router = require('express').Router();
var initRoute = require('../initRoute');
var speActions = require('../speActions');

initRoute(router, {
    table: 't_cash_total'
});

router.get('/trend', function (req, res, next) {
    var query = Object.assign({
        created_by: req.session.user.id,
        statisticType:'day'
    }, req.query);
    speActions.getCashTotal({
        query: query,
        table: 't_cash_total',
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