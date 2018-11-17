var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var errorhandler = require('errorhandler');
var Api = require('./controller/api');
var app = express();

// 开启gzip
app.use(compression());

// 使用bod-parser
app.use(bodyParser.json());

// 静态文件
app.use(express.static('web'));

//使用session
app.use(expressSession({
    secret: 'Eallonstronger',
    resave: true,
    rolling:true,
    cookie:{
        maxAge:1800000, //30分钟没有请求任何接口，则session过期
    }
}));

// 处理/api路由
app.use('/api',Api);

// 处理错误
// dev环境
if (process.env.NODE_ENV === 'dev') {
    app.use(errorhandler());
}
// prod环境
app.use(function (err,req,res,next) {
    if(err){
        res.status(err.status).send({
            error:err
        });
    }else{
        next();
    }

});


app.listen(3000,'localhost',function () {
    console.log("服务器开启");
});