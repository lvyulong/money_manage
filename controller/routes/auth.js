var router = require('express').Router();
var pool = require('../../database');

// current接口
router.get('/current',function (req,res,next) {
    // 获取session
    if(req.session.user){
        res.send({
            user:req.session.user
        })
    }else{
        next({
            status:401,
            message:'没有权限访问',
        })
    }
});

// 注册
router.post('/register',function (req,res,next) {
    pool.getConnection(function (err,connection) {
        if(err){
            next({
                status: 500,
                message: "数据库连接失败"
            })
        }else{
            connection.query('SELECT id FROM t_user WHERE mobile=?',[req.body.mobile],function (err,row) {
                if(err){
                    next({
                        status:500,
                        message:'数据库查询失败'
                    });
                    connection.release();
                }else{
                    if(row.length>0){
                        next({
                            status:403,
                            message:'该手机号已经存在'
                        });
                        connection.release();
                    }else{
                        connection.query('INSERT INTO t_user set ?',req.body,function (err,data) {
                            if(err){
                                next({
                                    status:500,
                                    message:err
                                });
                            }else{
                                res.send({
                                    msg:'注册成功',
                                    id:data.insertId
                                });
                            }
                            connection.release();
                        })
                    }
                }
            })
        }
    });
});

// 登陆
router.post('/login',function (req,res,next) {
    pool.getConnection(function (err,connection) {
        if(err){
            next({
                status: 500,
                message: "数据库连接失败"
            })
        }else{
            connection.query('SELECT * from t_user WHERE ??=? AND ??=?',['mobile',req.body.mobile,'password',req.body.password],function (err,row) {
                if(err){
                    console.log(err);
                    next({
                        status:500,
                        message:'数据库查询失败'
                    });
                }else{
                    if(row.length>0){
                        req.session.user = row[0];
                        res.send(row[0]);
                    }else{
                        next({
                            status:403,
                            message:'手机号与密码不匹配'
                        });
                    }

                }
                
            })
        }
    })
});

module.exports = router;
