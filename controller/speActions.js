var pool = require('../database');

/*
* options:{
*   table:必填,
*   callback:必填
*   query:不必要
* }
*
* */

function getCashTotal(options) {
    var query = options.query || {};
    pool.getConnection(function (err, connection) {
        if (err) {
            options.callback(err);

        } else {
            var dateFormat = {
                year: '%Y',
                month: '%Y-%m',
                day: '%Y-%m-%d',
            };
            // 开始日期，截止日期
            var dateQuery;
            if (query.start_date && query.end_date) {
                dateQuery = ` AND created_at>='${query.start_date}' AND created_at<'${query.end_date}'`;
            } else if (query.start_date) {
                dateQuery = ` AND created_at>='${query.start_date}'`;

            } else if (query.end_date) {
                dateQuery = ` AND created_at<='${query.end_date}'`;
            } else {
                dateQuery = '';
            }

            // 处理除了start_date、end_date、statisticType、created_by之外的查询参数
            var extraQuery = '';
            for (var key in query) {
                if (key != 'start_date' && key != 'end_date' && key != 'statisticType' && key != 'created_by') {
                    extraQuery += ` AND ${key}='${query[key]}'`
                }
            }

            var sql = `SELECT DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') AS time,money AS value FROM ${options.table} WHERE id IN (SELECT MAX(id) FROM ${options.table} WHERE created_by=${query.created_by}${dateQuery}${extraQuery} GROUP BY DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}')) ORDER BY time`;
            console.log(sql);
            connection.query(sql, function (err, rows, fileds) {
                if (err) {
                    options.callback(err);
                } else {
                    options.callback(null, {
                        items: rows
                    });
                }
                connection.release();
            })

        }
    })
}


function getCashFlow(options) {
    var query = options.query || {};
    pool.getConnection(function (err, connection) {
        if (err) {
            options.callback(err);

        } else {
            var dateFormat = {
                year: '%Y',
                month: '%Y-%m',
                day: '%Y-%m-%d',
            };
            // 开始日期，截止日期
            var dateQuery;
            if (query.start_date && query.end_date) {
                dateQuery = ` AND created_at>='${query.start_date}' AND created_at<'${query.end_date}'`;
            } else if (query.start_date) {
                dateQuery = ` AND created_at>='${query.start_date}'`;

            } else if (query.end_date) {
                dateQuery = ` AND created_at<='${query.end_date}'`;
            } else {
                dateQuery = '';
            }

            // 处理除了start_date、end_date、statisticType、created_by之外的查询参数
            var extraQuery = '';
            for (var key in query) {
                if (key != 'start_date' && key != 'end_date' && key != 'statisticType' && key != 'created_by') {
                    extraQuery += ` AND ${key}='${query[key]}'`
                }
            }

            var sql1 = `SELECT DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') AS time,SUM(money) AS value FROM ${options.table} WHERE type=1 AND created_by=${query.created_by}${dateQuery}${extraQuery}  GROUP BY DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') ORDER BY DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') ASC`;
            var sql2 = `SELECT DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') AS time,SUM(money) AS value FROM ${options.table} WHERE type=2 AND created_by=${query.created_by}${dateQuery}${extraQuery} GROUP BY DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') ORDER BY DATE_FORMAT(created_at,'${dateFormat[query.statisticType]}') ASC`;
            var sql = `${sql1};${sql2}`;
            console.log(sql);
            connection.query(sql, function (err, result, fileds) {
                if (err) {
                    options.callback(err);
                } else {
                    options.callback(null, {
                        income: result[0],
                        expense: result[1],
                    });
                }
                connection.release();
            })

        }
    })

}

function getCashFlowPie(options){
    var query = options.query || {};
    pool.getConnection(function (err, connection) {
        if (err) {
            options.callback(err);

        } else {

            // 开始日期，截止日期
            var dateQuery;
            if (query.start_date && query.end_date) {
                dateQuery = ` AND created_at>='${query.start_date}' AND created_at<'${query.end_date}'`;
            } else if (query.start_date) {
                dateQuery = ` AND created_at>='${query.start_date}'`;

            } else if (query.end_date) {
                dateQuery = ` AND created_at<='${query.end_date}'`;
            } else {
                dateQuery = '';
            }

            // 处理除了start_date、end_date、statisticType、created_by之外的查询参数
            var extraQuery = '';
            for (var key in query) {
                if (key != 'start_date' && key != 'end_date' && key != 'statisticType' && key != 'created_by') {
                    extraQuery += ` AND ${key}='${query[key]}'`
                }
            }

            var sql = `SELECT SUM(MONEY) AS value,event_type FROM ${options.table} WHERE type=2${dateQuery}${extraQuery} GROUP BY event_type`;

            console.log(sql);
            connection.query(sql, function (err, result, fileds) {
                if (err) {
                    options.callback(err);
                } else {
                    options.callback(null, {
                       items:result
                    });
                }
                connection.release();
            })

        }
    })

}



module.exports = {
    getCashTotal: getCashTotal,  //获取总资产趋势图数据
    getCashFlow: getCashFlow,  //获取收入、支出趋势图数据
    getCashFlowPie:getCashFlowPie, //获取支出百分比图
};
