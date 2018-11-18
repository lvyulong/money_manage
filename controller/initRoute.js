var pool = require('../database');
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
    var options = options?options:{};
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
    if (!options.index) {
        router.get('/', function (req, res, next) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    next({
                        status: 500,
                        error: {
                            message: '连接数据库失败'
                        }
                    })
                } else {
                    var _page_size = 20;
                    var _page = 1;
                    var queryObj = Object.assign(req.query);
                    // 每页显示多少个
                    if (queryObj._page_size) {
                        _page_size = queryObj._page_size;
                        delete queryObj._page_size;
                    }

                    // 当前页数
                    if (queryObj._page) {
                        _page = queryObj._page;
                        delete queryObj._page;
                    }

                    // 查询条件构造,去除掉_page、_page_size，如果还有其他的查询参数，则构造查询字符串
                    if (JSON.stringify(queryObj) != '{}') {
                        var query = 'WHERE ';
                        for (var key in queryObj) {
                            var val = queryObj[key];
                            query = query + key + '=' + val + ' and '
                        }
                        query = query.substring(0, query.length - 5);
                    }

                    // 构造sql查询语句
                    if (query) {
                        var sqlItems = `SELECT * FROM ${options.table} ` + query;
                        var sqlCount = `SELECT COUNT(id) AS count FROM ${options.table} ` + query;

                    } else {
                        var sqlItems = `SELECT * FROM ${options.table}`;
                        var sqlCount = `SELECT COUNT(id) AS count FROM ${options.table}`;
                    }
                    // 查询sql加上翻页功能
                    sqlItems = sqlItems + ` ORDER BY id desc LIMIT ${_page_size} OFFSET ${_page_size * (_page - 1)}`;
                    connection.query(sqlCount, function (err, rows, fileds) {
                        if (err) {
                            next({
                                status: 500,
                                error: {
                                    message: '查询数据库失败'
                                }
                            });
                            connection.release();
                        } else {
                            var totalCount = rows[0] && rows[0].count;
                            connection.query(sqlItems, function (err, rows, fileds) {
                                if (err) {
                                    next({
                                        status: 500,
                                        error: {
                                            message: '查询数据库失败'
                                        }
                                    })
                                } else {
                                    res.send({
                                        items: rows,
                                        _meta: {
                                            currentPage: _page*1,
                                            pageCount: Math.ceil(totalCount / _page_size),
                                            perPage: _page_size*1,
                                            totalCount: totalCount*1,
                                        }
                                    })
                                }
                                connection.release();
                            });
                        }
                    });
                }
            })
        })
    }

    // actionCreate
    if(!options.create){

    }






}

module.exports = initRoute;