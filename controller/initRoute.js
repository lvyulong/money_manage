var pool = require('../database');
var actions = require('./actions');

/*
options:
    notCheckLogin: boolean;    是否不检查是否登录
    notIndex: boolean   是否不初始化index action
    notView: boolean    是否不初始化view action
    notCreate: boolean    是否不初始化create action
    notUpdate: boolean  是否不初始化update action
    notDelete: boolean 是否不初始化delete action
*/
function initRoute(router, options) {
    var options = options ? options : {};
    // 验证session，是否登陆
    if (!options.notCheckLogin) {
        router.use(function (req, res, next) {
            if (req.session.user) {
                next();
            } else {
                next({
                    status: 401,
                    error: {
                        message: '没有权限访问'
                    }
                })
            }
        })
    }


    // actionIndex:查询、翻页
    if (!options.notIndex) {
        router.get('/', function (req, res, next) {
            // 默认只查询当前用户的数据
            var query = Object.assign({created_by:req.session.user.id},req.query);
            actions.find({
                table:options.table,
                query:query,
                callback:function (err,result) {
                    if(err){
                        next({
                            status: 500,
                            error: {
                                message: '查询数据失败',
                                cause: err
                            }
                        })
                    }else{
                        res.send(result)
                    }
                }
            })
        })
    }

    // actionCreate
    if (!options.notCreate) {
        router.post('/', function (req, res, next) {
            var model = Object.assign({}, req.body);
            model.created_by = req.session.user.id;
            actions.create({
                table: options.table,
                model: model,
                callback: function (err, result) {
                    if (err) {
                        next({
                            status: 500,
                            error: {
                                message: '插入数据失败',
                                cause: err
                            }
                        })
                    } else {
                        res.send(result);
                    }
                }
            })
        })
    }

    // actionUpdate
    if (!options.notUpdate) {
        router.put('/:id(\\d+)', function (req, res, next) {
            var model = Object.assign({}, req.body);
            if (model.created_at) {
                delete model.created_at;
            }
            if (model.updated_at) {
                delete model.updated_at;
            }
            actions.update({
                table:options.table,
                model: model,
                callback:function (err,result) {
                    if (err) {
                        next({
                            status: 500,
                            error: {
                                message: "更新记录失败",
                                cause: err
                            }
                        })
                    } else {
                        res.send(result);
                    }
                }
            })
        })
    }


    // actionView
    if (!options.notView) {
        router.get('/:id(\\d+)', function (req, res, next) {
            var id = req.params.id;
            actions.findOne({
                table: options.table,
                id: id,
                callback: function (err, result) {
                    if (err) {
                        next({
                            status: 500,
                            error: {
                                message: "查询记录失败",
                                cause: err
                            }
                        })
                    } else {
                        res.send(result);
                    }
                }
            });
        })
    }

    // actionDelete
    if (!options.notDelete) {
        router.delete('/:id', function (req, res, next) {
            var id = req.params.id;
            pool.getConnection(function (err, connection) {
                if (err) {
                    next({
                        status: 500,
                        error: {
                            message: '数据库连接失败'
                        }
                    })
                } else {
                    var sqlDelete = `DELETE FROM ${options.table} WHERE id = ${id}`;
                    connection.query(sqlDelete, function (err, rows) {
                        if (err) {
                            next({
                                status: 500,
                                error: {
                                    message: "删除记录失败",
                                    cause: err
                                }
                            });
                        } else {
                            res.send({
                                message: '删除成功'
                            })
                        }
                    });
                    connection.release();
                }
            });
        })
    }
}

module.exports = initRoute;