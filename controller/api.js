var router = require('express').Router();
var fs = require('fs');

try {
    // 读取routes下面的所有文件，每个文件就是一个控制器路由，控制器下面书写各种action
    var files = fs.readdirSync(__dirname + '/routes');
    files.map(function (v,k) {
        var filename = v.split('.')[0];
        router.use(`/${filename}`,require(`./routes/${filename}`));
    })
}catch (e) {
    console.log(e);
}

module.exports = router;