var router = require('express').Router();

router.use(function (req,res,next) {
    console.log("进入user");
    next();
    // res.send({
    //     user:{
    //         name:"Eallon"
    //     }
    // })

});

router.get('/test',function (req,res,next) {
    res.send({
        name:'test'
    })
});


module.exports = router;