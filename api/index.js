var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:superbot@ds135680.mlab.com:35680/disordered');

const Router = require('koa-router');
var router = new Router();

['user'].forEach((path) => {
    let route = require(`./${path}`);
    router.use('/'+path, route.routes(), route.allowedMethods());
});

module.exports = router;
