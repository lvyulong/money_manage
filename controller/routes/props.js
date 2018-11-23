var router = require('express').Router();
var initRoute = require('../initRoute');


initRoute(router,{
    table:'t_props',
    notDelete:true,
});



module.exports = router;