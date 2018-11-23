var pool = require('../database');

/*
获取记录列表
options:{
    table：必填，
    query：不必填，
    callback：必填，
    connection:不必填，
}
*/
function find(options) {
    var _page_size = 20;
    var _page = 1;
    var queryObj = Object.assign({},options.query);
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
            query = query + key + "='" + val + "' and "
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
    // 查询sql加上翻页功能，_page_size=-1不分页，返回所有数据
    if (_page_size == -1) {
        sqlItems = sqlItems + ` ORDER BY id desc`;
    } else if (_page_size > 0) {
        sqlItems = sqlItems + ` ORDER BY id desc LIMIT ${_page_size} OFFSET ${_page_size * (_page - 1)}`;
    }
    // console.log(sqlCount);
    if (!options.connection) {
        pool.getConnection(function (err, connection) {
            if (err) {
                options.callback(err);
            } else {
                connection.query(sqlCount, function (err, rows, fileds) {
                    if (err) {
                        options.callback(err);
                        connection.release();
                    } else {
                        // console.log(sqlItems);
                        var totalCount = rows[0] && rows[0].count;
                        connection.query(sqlItems, function (err, rows, fileds) {
                            if (err) {
                                options.callback(err);
                            } else {
                                // _page_size = -1 返回所有的数据，不分页
                                if (_page_size == -1) {
                                    options.callback(null, {items: rows})
                                } else if (_page_size > 0) {
                                    options.callback(null, {
                                        items: rows,
                                        _meta: {
                                            currentPage: _page * 1,
                                            pageCount: Math.ceil(totalCount / _page_size),
                                            perPage: _page_size * 1,
                                            totalCount: totalCount * 1,
                                        }
                                    });
                                }
                            }
                            connection.release();
                        });
                    }
                });
            }
        })
    } else {
        options.connection.query(sqlCount, function (err, rows, fileds) {
            if (err) {
                options.callback(err);
            } else {
                // console.log(sqlItems);
                var totalCount = rows[0] && rows[0].count;
                options.connection.query(sqlItems, function (err, rows, fileds) {
                    if (err) {
                        options.callback(err);
                    } else {
                        // _page_size = -1 返回所有的数据，不分页
                        if (_page_size == -1) {
                            options.callback(null, {items: rows})
                        } else if (_page_size > 0) {
                            options.callback(null, {
                                items: rows,
                                _meta: {
                                    currentPage: _page * 1,
                                    pageCount: Math.ceil(totalCount / _page_size),
                                    perPage: _page_size * 1,
                                    totalCount: totalCount * 1,
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}


/*
创建记录
options:{
    table：必填，
    model：必填，
    callback：必填，
    connection:不必填，
}
*/
function create(options) {
    // 如果没有指定connection，则重新获取一个connection
    var sqlCreate = `INSERT INTO ${options.table} SET ?`;
    if (!options.connection) {
        pool.getConnection(function (err, connection) {
            if (err) {
                options.callback(err);
            } else {
                connection.query(sqlCreate, options.model, function (err, rows, fileds) {
                    if (err) {
                        options.callback(err);
                    } else {
                        findOne({
                            table: options.table,
                            id: rows.insertId,
                            connection: connection,
                            callback: function (err, result) {
                                if (err) {
                                    options.callback(err);
                                } else {
                                    options.callback(null, result);
                                }
                                connection.release();
                            }
                        })
                    }
                })
            }
        })
    } else {
        // 如果指定了connection，使用指定的connection
        options.connection.query(sqlCreate, options.model, function (err, rows, fileds) {
            if (err) {
                options.callback(err);
            } else {
                findOne({
                    table: options.table,
                    id: rows.insertId,
                    connection: options.connection,
                    callback: function (err, result) {
                        if (err) {
                            options.callback(err);
                        } else {
                            options.callback(null, result);
                        }
                        options.connection.release();
                    }
                })
            }
        })
    }
};

/*
获取某一条记录
options:{
    table：必填，
    id：必填，
    callback：必填，
    connection:不必填，
}
*/
function findOne(options) {
    var sqlView = `SELECT * FROM ${options.table} WHERE id = ${options.id}`;
    if (options.connection) {
        options.connection.query(sqlView, function (err, rows, fileds) {
            if (err) {
                options.callback(err)
            } else {
                options.callback(null, rows[0])
            }
        })
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                options.callback(err);
            } else {
                connection.query(sqlView, function (err, rows, fileds) {
                    if (err) {
                        options.callback(err)
                    } else {
                        options.callback(null, rows[0])
                    }
                    connection.release();
                })
            }

        })
    }
}

/*
更新记录
options:{
    table：必填，
    model：必填，
    callback：必填，
    connection:不必填，
}
*/
function update(options) {
    var sqlUpdate = `UPDATE ${options.table} SET ? WHERE id = ${options.model.id}`;
    if (options.connection) {
        options.connection.query(sqlUpdate, options.model, function (err, rows) {
            if (err) {
                options.callback(err);
            } else {
                findOne({
                    table: options.table,
                    id: options.model.id,
                    connection: options.connection,
                    callback: function (err, result) {
                        if (err) {
                            options.callback(err);
                        } else {
                            options.callback(null, result);
                        }
                    }
                })
            }
        })
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                options.callback(err);
            } else {
                connection.query(sqlUpdate, options.model, function (err, rows) {
                    if (err) {
                        options.callback(err);
                    } else {
                        findOne({
                            table: options.table,
                            id: options.model.id,
                            connection: connection,
                            callback: function (err, result) {
                                if (err) {
                                    options.callback(err);
                                } else {
                                    options.callback(null, result);
                                }
                                connection.release();
                            }
                        })
                    }
                })
            }
        })
    }
}


module.exports = {
    find: find,
    create: create,
    findOne: findOne,
    update: update,
};
