var router = require('express').Router();
var initRoute = require('../initRoute');


router.use(function (req,res,next) {
    if(req.session.user){
        if(req.session.user.type==0){
            next();
        }else{
            next({
                status: 403,
                error: {
                    message: '对不起，您的访问权限不够！'
                }
            })
        }
    }else{
        next({
            status:401,
            error:{
                message:'没有权限访问'
            }
        })
    }

});

initRoute(router,{
    table:'t_user',
    notCheckLogin:true
});

module.exports = router;