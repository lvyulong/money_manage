var mysql = require('mysql');

var pool = mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'199011',
    database:'money_manage'
});
module.exports = pool;