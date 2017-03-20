const Router = require('koa-router');
var router = new Router();

const Pug = require('koa-pug');
var pug = new Pug({
    viewPath: './web',
    noCache: process.env.NODE_ENV === 'development',
});


const User = require('../model/User');

router.get('/index.html', (ctx) => ctx.redirect('/'))
router.get('/', (ctx) => {
    ctx.body = pug.render('index');
});

router.get('/bot', async (ctx) => {
    // var users = [];
    // var users = [{name: 'lolo'}, {name: 'lala'}];
    var users = await User.find();
    console.log('FIND USERS', users);
    ctx.body = pug.render('bot/template', {users});
});

module.exports = router;
