var router = require('express').Router();
var pool = require('../../database');
router.post('/',function (req,res) {
    //
    // pool.getConnection(function (err,connection) {
    //     // if(err){
    //     //
    //     // }
    //
    // });



    res.send({
        msg:'ok'
    })
});


module.exports = router;